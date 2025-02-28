"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function WeeklyTrendChart() {
  const [transactions, setTransactions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const storedItem = localStorage.getItem("userData")
    const parsedData = storedItem ? JSON.parse(storedItem) : {}
    const banks = parsedData.banks || [];
    const data = banks.flatMap((bank: any) => bank.transactions || [])
      .filter((transaction: any) => transaction.description.toLowerCase() !== "opening balance");
    setTransactions(data);
  }, []);

  const weekdayData = transactions.reduce((acc: Record<string, { 
    day: string;
    totalAmount: number;
    avgAmount: number;
    count: number;
  }>, transaction: any) => {
    const date = new Date(transaction.date);
    const day = DAYS[date.getDay()];
    const amount = Math.abs(transaction.amount);

    if (!acc[day]) {
      acc[day] = {
        day,
        totalAmount: 0,
        avgAmount: 0,
        count: 0
      };
    }

    acc[day].totalAmount += amount;
    acc[day].count += 1;
    acc[day].avgAmount = acc[day].totalAmount / acc[day].count;

    return acc;
  }, {});

  const data = DAYS.map(day => weekdayData[day] || {
    day,
    totalAmount: 0,
    avgAmount: 0,
    count: 0
  });

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>Weekly Transaction Patterns</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">No weekly data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300} minWidth={600}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                yAxisId="left"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => Math.round(value).toString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value, name) => [
                  name === 'count' 
                    ? Math.round(Number(value))
                    : `₹${Number(value).toLocaleString('en-IN')}`,
                  name === 'count' 
                    ? 'Number of Transactions'
                    : name === 'avgAmount'
                    ? 'Average Amount'
                    : 'Total Amount'
                ]}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => {
                  const labels = {
                    totalAmount: 'Total Amount',
                    avgAmount: 'Average Amount',
                    count: 'Transaction Count'
                  };
                  return <span style={{color: '#4B5563'}}>{labels[value as keyof typeof labels]}</span>;
                }}
              />
              <Bar 
                yAxisId="left"
                dataKey="totalAmount" 
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgAmount"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
