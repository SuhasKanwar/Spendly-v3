"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

export function ActivityChart() {
  const [transactions, setTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const storedItem = localStorage.getItem("userData")
    const parsedData = storedItem ? JSON.parse(storedItem) : {}
    const banks = parsedData.banks || [];
    const data = banks.flatMap((bank: any) => bank.transactions || [])
      .filter((transaction: any) => transaction.description.toLowerCase() !== "opening balance");
    setTransactions(data);
  }, []);

  const activityData = transactions.reduce((acc: Record<string, { date: string; transactions: number; volume: number }>, transaction: any) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        transactions: 0,
        volume: 0
      };
    }
    acc[date].transactions += 1;
    acc[date].volume += Math.abs(transaction.amount);
    return acc;
  }, {});

  const data = Object.values(activityData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Show last 14 days

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span>Daily Activity Pattern</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">No activity data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="transactionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value, name) => [
                  name === 'volume' 
                    ? `₹${Number(value).toLocaleString('en-IN')}`
                    : value,
                  name === 'volume' ? 'Volume' : 'Transactions'
                ]}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="transactions"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#transactionsGradient)"
                dot={false}
                activeDot={{ r: 6, fill: "#10B981" }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#volumeGradient)"
                dot={false}
                activeDot={{ r: 6, fill: "#6366F1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
