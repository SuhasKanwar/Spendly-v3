import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { IGoal } from "@/models/Goals";
import { getServerSession } from "next-auth";
import { pinata } from "@/utils/pinataConfig";

export async function GET(request: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        );
    }
    if (!username) {
        return new Response(JSON.stringify({ success: false, error: "User id not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    await dbConnect();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (!user.goalsCID || user.goalsCID.length === 0) {
            return new Response(JSON.stringify({ success: true, goals: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const cid = user.goalsCID[user.goalsCID.length - 1];
            const { data } = await pinata.gateways.get(`${cid}`);
            
            if (!data) {
                console.error('No data received from IPFS for CID:', cid);
                return Response.json({ success: true, goals: [] }, { status: 200 });
            }

            // Handle the data based on its type
            let goalsData: IGoal[];
            if (typeof data === 'string') {
                try {
                    goalsData = JSON.parse(data);
                } catch (parseError) {
                    console.error('Failed to parse string data:', parseError);
                    return Response.json({ success: true, goals: [] }, { status: 200 });
                }
            } else if (Array.isArray(data)) {
                goalsData = data;
            } else if (typeof data === 'object' && data !== null) {
                // If data is an object with a goals property
                goalsData = (data as any).goals || [];
            } else {
                console.error('Unexpected data format:', data);
                return Response.json({ success: true, goals: [] }, { status: 200 });
            }

            return Response.json({ success: true, goals: goalsData }, { status: 200 });

        } catch (ipfsError: any) {
            console.error('IPFS Error:', ipfsError);
            return Response.json({ 
                success: false, 
                error: 'Failed to fetch goals from IPFS',
                details: ipfsError.message 
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Goals API Error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
}

export async function POST(request: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params;
    const session = await getServerSession(authOptions);
    const newGoal = await request.json();

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        );
    }
    if (!username) {
        return new Response(JSON.stringify({ success: false, error: "User id not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Validate goal data
    if (!newGoal.goalTitle || typeof newGoal.amount !== 'number' || typeof newGoal.remaining !== 'number') {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Invalid goal data. Required: goalTitle (string), amount (number), remaining (number)" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (newGoal.amount <= 0 || newGoal.remaining < 0) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Amount must be positive and remaining must be non-negative" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (newGoal.remaining > newGoal.amount) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Remaining amount cannot be greater than total amount" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    await dbConnect();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        let currentGoals: IGoal[] = [];
        if (user.goalsCID.length > 0) {
            try {
                const currentCid = user.goalsCID[user.goalsCID.length - 1];
                const { data } = await pinata.gateways.get(`${currentCid}`);
                
                if (!data) {
                    throw new Error('No data received from IPFS');
                }

                // Handle the data based on its type
                if (typeof data === 'string') {
                    try {
                        currentGoals = JSON.parse(data);
                    } catch (parseError) {
                        console.error('Failed to parse string data:', parseError);
                        currentGoals = [];
                    }
                } else if (Array.isArray(data)) {
                    currentGoals = data;
                } else if (typeof data === 'object' && data !== null) {
                    currentGoals = (data as any).goals || [];
                }
            } catch (ipfsError: any) {
                console.error('Error fetching existing goals:', ipfsError);
                // Continue with empty goals array if fetch fails
            }
        }

        // Check if goal with same title already exists
        if (currentGoals.some(goal => goal.goalTitle === newGoal.goalTitle)) {
            return Response.json({ 
                success: false, 
                error: "A goal with this title already exists" 
            }, { status: 400 });
        }

        const goalToSave: IGoal = {
            goalTitle: newGoal.goalTitle,
            amount: newGoal.amount,
            remaining: newGoal.remaining
        };

        currentGoals.push(goalToSave);

        try {
            const goalsData = JSON.stringify(currentGoals);
            const goalsFile = new File([goalsData], 'goals.json', { type: 'application/json' });
            const goalsUpload = await pinata.upload.file(goalsFile);

            if (!goalsUpload?.cid) {
                throw new Error('Failed to get CID from IPFS upload');
            }

            user.goalsCID.push(goalsUpload.cid);
            await user.save();

            return Response.json({ 
                success: true, 
                message: "Goal created",
                goal: goalToSave,
                goals: currentGoals,
                cid: goalsUpload.cid
            }, { status: 200 });

        } catch (ipfsError: any) {
            console.error('IPFS Upload Error:', ipfsError);
            return Response.json({ 
                success: false, 
                error: 'Failed to upload to IPFS',
                details: ipfsError.message 
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Goals API Error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params;
    const session = await getServerSession(authOptions);
    const { goalTitle } = await request.json();

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        );
    }
    if (!username) {
        return new Response(JSON.stringify({ success: false, error: "Username not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (!goalTitle) {
        return new Response(JSON.stringify({ success: false, error: "Goal title not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    await dbConnect();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, error: "User not found" }, { status: 404 });
        }

        let currentGoals: IGoal[] = [];
        if (user.goalsCID.length > 0) {
            try {
                const currentCid = user.goalsCID[user.goalsCID.length - 1];
                const { data } = await pinata.gateways.get(`${currentCid}`);
                
                if (!data) {
                    throw new Error('No data received from IPFS');
                }

                // Handle the data based on its type
                if (typeof data === 'string') {
                    try {
                        currentGoals = JSON.parse(data);
                    } catch (parseError) {
                        console.error('Failed to parse string data:', parseError);
                        throw new Error('Invalid goals data format');
                    }
                } else if (Array.isArray(data)) {
                    currentGoals = data;
                } else if (typeof data === 'object' && data !== null) {
                    currentGoals = (data as any).goals || [];
                } else {
                    throw new Error('Unexpected data format from IPFS');
                }
            } catch (ipfsError: any) {
                console.error('Error fetching existing goals:', ipfsError);
                return Response.json({ 
                    success: false, 
                    error: 'Failed to fetch goals',
                    details: ipfsError.message 
                }, { status: 500 });
            }
        }

        const goalIndex = currentGoals.findIndex((goal: IGoal) => goal.goalTitle === goalTitle);
        if (goalIndex === -1) {
            return Response.json({ success: false, error: "Goal not found" }, { status: 404 });
        }

        currentGoals.splice(goalIndex, 1);

        // Upload to IPFS
        const goalsData = JSON.stringify(currentGoals);
        const goalsFile = new File([goalsData], 'goals.json', { type: 'application/json' });

        try {
            const goalsUpload = await pinata.upload.file(goalsFile);
            if (!goalsUpload?.cid) {
                throw new Error('Failed to get CID from IPFS upload');
            }

            // Save CID to user
            user.goalsCID.push(goalsUpload.cid);
            await user.save();

            return Response.json({ 
                success: true, 
                message: "Goal removed successfully",
                cid: goalsUpload.cid
            }, { status: 200 });

        } catch (ipfsError: any) {
            console.error('IPFS Upload Error:', ipfsError);
            return Response.json({ 
                success: false, 
                error: 'Failed to upload to IPFS',
                details: ipfsError.message 
            }, { status: 500 });
        }
        
    } catch (error: any) {
        console.error('Goals API Error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ username: string }> }) {
    const { username } = await context.params;
    const session = await getServerSession(authOptions);
    const updatedGoal = await request.json();

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        );
    }
    if (!username) {
        return new Response(JSON.stringify({ success: false, error: "Username not provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Validate updated goal data
    if (!updatedGoal.goalTitle || typeof updatedGoal.amount !== 'number' || typeof updatedGoal.remaining !== 'number') {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Invalid goal data. Required: goalTitle (string), amount (number), remaining (number)" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (updatedGoal.amount <= 0 || updatedGoal.remaining < 0) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Amount must be positive and remaining must be non-negative" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    if (updatedGoal.remaining > updatedGoal.amount) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: "Remaining amount cannot be greater than total amount" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    await dbConnect();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        let currentGoals: IGoal[] = [];
        if (user.goalsCID.length > 0) {
            try {
                const currentCid = user.goalsCID[user.goalsCID.length - 1];
                const { data } = await pinata.gateways.get(`${currentCid}`);
                
                if (!data) {
                    throw new Error('No data received from IPFS');
                }

                // Handle the data based on its type
                if (typeof data === 'string') {
                    try {
                        currentGoals = JSON.parse(data);
                    } catch (parseError) {
                        throw new Error('Invalid goals data format');
                    }
                } else if (Array.isArray(data)) {
                    currentGoals = data;
                } else if (typeof data === 'object' && data !== null) {
                    currentGoals = (data as any).goals || [];
                }
            } catch (ipfsError: any) {
                console.error('Error fetching existing goals:', ipfsError);
                return Response.json({ 
                    success: false, 
                    error: 'Failed to fetch goals',
                    details: ipfsError.message 
                }, { status: 500 });
            }
        }

        const goalIndex = currentGoals.findIndex(goal => goal.goalTitle === updatedGoal.goalTitle);
        if (goalIndex === -1) {
            return Response.json({ success: false, error: "Goal not found" }, { status: 404 });
        }

        // Update the existing goal
        currentGoals[goalIndex] = {
            ...currentGoals[goalIndex],
            ...updatedGoal
        };

        try {
            const goalsData = JSON.stringify(currentGoals);
            const goalsFile = new File([goalsData], 'goals.json', { type: 'application/json' });
            const goalsUpload = await pinata.upload.file(goalsFile);

            if (!goalsUpload?.cid) {
                throw new Error('Failed to get CID from IPFS upload');
            }

            user.goalsCID.push(goalsUpload.cid);
            await user.save();

            return Response.json({ 
                success: true, 
                message: "Goal updated successfully",
                goal: currentGoals[goalIndex],
                goals: currentGoals,
                cid: goalsUpload.cid
            }, { status: 200 });

        } catch (ipfsError: any) {
            console.error('IPFS Upload Error:', ipfsError);
            return Response.json({ 
                success: false, 
                error: 'Failed to upload to IPFS',
                details: ipfsError.message 
            }, { status: 500 });
        }
        
    } catch (error: any) {
        console.error('Goals API Error:', error);
        return Response.json({ 
            success: false, 
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
}