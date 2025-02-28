"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false
    });

    if(result?.error){
      toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive"
      });
    }

    if(result?.url){
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in"
      });
      router.replace('/dashboard');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-r from-gray-100 to-gray-200">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-primary"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back to Spendly</CardTitle>
          <p className="text-sm text-muted-foreground text-center">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Email/Username"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center w-full">
            Not a member?{' '}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;