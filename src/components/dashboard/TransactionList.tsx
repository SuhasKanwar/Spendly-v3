"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionListProps {
  limit?: number;
  showAll?: boolean;
}

export function TransactionList({ limit, showAll }: TransactionListProps) {
  const [transactions, setTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItem = localStorage.getItem("userData");
      const parsedData = storedItem ? JSON.parse(storedItem) : {};
      const banks = parsedData.banks || [];
      const data = banks.flatMap((bank: any) => bank.transactions || [])
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(data);
    }
  }, []);

  const displayedTransactions = limit && !showAll
    ? transactions.slice(0, limit)
    : transactions;

  return (
    <div className="overflow-hidden">
      {displayedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">No transactions found</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="py-4">Date</TableHead>
                <TableHead className="py-4">Description</TableHead>
                <TableHead className="py-4">Type</TableHead>
                <TableHead className="py-4">Amount</TableHead>
                <TableHead className="py-4">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((transaction: any) => (
                <TableRow 
                  key={transaction._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="py-4 font-medium">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="py-4">{transaction.description}</TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.transactionType === "credit"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className={`py-4 font-medium ${
                    transaction.transactionType === "debit"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}>
                    ₹{Math.abs(transaction.amount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell className="py-4 font-medium">
                    ₹{transaction.balance.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
