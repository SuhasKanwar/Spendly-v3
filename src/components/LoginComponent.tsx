import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import React from "react";

const LoginComponent = () => {
  return (
    <section className="h-[100vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Please log in to view your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" asChild>
            <a href="/sign-in">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default LoginComponent;