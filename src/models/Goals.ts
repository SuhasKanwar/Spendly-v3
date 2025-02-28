import { Schema } from "mongoose";

export interface IGoal {
    goalTitle: string;
    amount: number;
    remaining: number;
}

const GoalsSchema = new Schema<IGoal>({
    goalTitle: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"]
    },
    remaining: {
        type: Number,
        required: [true, "Remaining amount is required"]
    }
});

export default GoalsSchema;
