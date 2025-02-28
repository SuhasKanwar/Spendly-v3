"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

const VerifyAccountPage = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm();

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            });

            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch(err) {
            console.error("Error verifying account", err);
            const axiosError = err as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "An error occurred verifying account";
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-[100vh] bg-gradient-to-r from-gray-100 to-gray-200">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Verify Your Account</CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        Enter the verification code sent to your email
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name='code'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    placeholder='Enter your code' 
                                                    {...field} 
                                                    className="pl-10"
                                                />
                                                <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                                    </>
                                ) : (
                                    'Verify Account'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-muted-foreground">
                        Didn't receive a code? <Button variant="link" className="p-0 h-auto font-normal">Resend Code</Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default VerifyAccountPage;