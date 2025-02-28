"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function BalanceChart() {
  const [transactions, setTransactions] = React.useState<any[]>([])

  React.useEffect(() => {
    const storedItem = localStorage.getItem("userData")
    const parsedData = storedItem ? JSON.parse(storedItem) : {}
    const banks = parsedData.banks || []
    const data = banks.flatMap((bank: any) => bank.transactions || [])
      .filter((transaction: any) => transaction.description.toLowerCase() !== "opening balance")
    setTransactions(data)
  }, [])

  const balanceByDate = transactions.reduce((acc: Record<string, { date: string; balance: number; time: number }>, transaction: any) => {
    const dateObj = new Date(transaction.date)
    const dateString = dateObj.toISOString().split("T")[0]
    const time = dateObj.getTime()
    if (!acc[dateString] || time > acc[dateString].time) {
      acc[dateString] = { date: dateString, balance: transaction.balance, time }
    }
    return acc
  }, {})

  const data = (Object.values(balanceByDate) as { date: string; balance: number; time: number }[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(({ date, balance }) => ({ date, balance }))

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Balance Over Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">No balance data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  });
                }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#6366F1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
