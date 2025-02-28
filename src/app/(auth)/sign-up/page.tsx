"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try{
          const response = await axios.get(`/api/check-unique-username?username=${username}`);
          const message = response.data.message;
          setUsernameMessage(message);
        }
        catch(err){
          const axiosError = err as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username");
        }
        finally{
          setIsCheckingUsername(false);
        }
      }
    }
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try{
      const response = await axios.post('/api/sign-up', data);
      toast({
        title: "Success",
        description: response.data.message
      });
      router.replace(`/verify/${username}`);
    }
    catch(err){
      console.error("Error signing up user", err);
      const axiosError = err as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message ?? "Error Signing Up User";
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
    finally{
      setIsSubmitting(false);
    }
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
          <CardTitle className="text-2xl font-bold text-center">Join Spendly</CardTitle>
          <p className="text-sm text-muted-foreground text-center">Sign up to start</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Username"
                          className="pl-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    {isCheckingUsername && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Checking username...</span>
                      </div>
                    )}
                    {usernameMessage && (
                      <p className={`text-sm ${usernameMessage === 'Username is available' ? 'text-[#00FA00]' : 'text-[#ff1515]'}`}>
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
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
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Already a member?{' '}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;