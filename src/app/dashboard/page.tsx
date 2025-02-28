"use client";

import { useSession } from "next-auth/react";
import { User } from "next-auth";
import React from "react";
import LoginComponent from "@/components/LoginComponent";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { CreditDebitChart } from "@/components/dashboard/CreditDebitChart";
import { WeeklyTrendChart } from "@/components/dashboard/WeeklyTrendChart";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { fetchUserData } from "@/utils/fetchUserData";
import AddData from "@/components/dashboard/AddData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

const page = () => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = React.useState(false);
  const [stats, setStats] = React.useState({
    balance: 0,
    lastUpdated: "",
    transactions: 0,
  });

  React.useEffect(() => {
    const calculateStats = () => {
      try {
        const storedItem = localStorage.getItem("userData");
        const parsedData = storedItem ? JSON.parse(storedItem) : {};
        const banks = parsedData.banks || [];
        const transactions = banks
          .flatMap((bank: any) => bank.transactions || [])
          .filter(
            (transaction: any) =>
              transaction.description.toLowerCase() !== "opening balance"
          );
        if (transactions.length === 0) return;

        const sortedTransactions = [...transactions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const currentBalance = sortedTransactions[0].balance;

        setStats({
          balance: currentBalance,
          lastUpdated: sortedTransactions[0].date,
          transactions: transactions.length,
        });
      } catch (error) {
        console.error("Error calculating stats:", error);
        // Set default values on error
        setStats({
          balance: 0,
          lastUpdated: "",
          transactions: 0,
        });
      }
    };

    calculateStats();
    window.addEventListener("storage", calculateStats);
    return () => window.removeEventListener("storage", calculateStats);
  }, []);

  React.useEffect(() => {
    if (session?.user) {
      const { username } = session.user as User;
      fetchUserData(username as string, true) // Force refresh on mount
        .then(() => window.dispatchEvent(new Event("storage")))
        .catch(console.error);
    }
  }, [session]);

  const NoTransactionsMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-6">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by uploading your transaction data
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Upload Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!session || !session.user) {
    return <LoginComponent />;
  }

  const { username } = session?.user as User;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  function handleClearTransaction() {
    axios.delete(`/api/clear-transactions/${username}`)
      .then((response) => {
        if (response.data.success) {
          console.log("Transactions cleared successfully");
          localStorage.removeItem("userData");
          window.dispatchEvent(new Event("storage"));
        } else {
          console.error("Failed to clear transactions");
        }
      })
      .catch((error) => {
        console.error("Error clearing transactions:", error);
      });
  }

  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Hi, {username}
        </h1>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        {
          stats.transactions !== 0 && <Button onClick={handleClearTransaction}>Clear Transcations</Button>
        }
        
        {stats.transactions === 0 ? (
          <NoTransactionsMessage />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Balance
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current Balance
                  </p>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <div className="text-2xl font-bold">
                    {stats.lastUpdated ? getRelativeTime(stats.lastUpdated) : "-"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.lastUpdated
                      ? new Date(stats.lastUpdated).toLocaleString()
                      : "No transactions"}
                  </p>
                </CardContent>
              </Card>

              <Card
                className="p-4 relative group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setShowModal(true)}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Add Transaction
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <div className="text-2xl font-bold">{stats.transactions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total Transactions
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <ActivityChart />
              </div>
              <CreditDebitChart />
              <WeeklyTrendChart />
              <div className="md:col-span-2">
                <BalanceChart />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recent Transactions
                </h2>
                <a
                  href="/dashboard/transactions"
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-2 transition-colors"
                >
                  <span>View All</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <TransactionList limit={5} />
            </div>
          </>
        )}

        <AddData isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
};

export default page;