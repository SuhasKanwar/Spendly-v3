"use client";

import { useSession } from 'next-auth/react';
import { User } from "next-auth";
import React from 'react';
import LoginComponent from '@/components/LoginComponent';
import { TransactionList } from "@/components/dashboard/TransactionList";
import { fetchUserData } from '@/utils/fetchUserData';

const TransactionsPage = () => {
  const { data: session } = useSession();
  
  if (!session || !session.user) {
    return <LoginComponent />;
  }
  
  const { username } = session?.user as User;
  fetchUserData(username as string);
  
  return (
    <div className='min-h-screen mt-16'>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          <a 
            href="/dashboard" 
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Back to Dashboard</span>
          </a>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <TransactionList showAll />
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;