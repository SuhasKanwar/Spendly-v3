"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface BarData {
  month: string;
  credit: number;
  debit: number;
}

export function CreditDebitChart() {
  const [transactions, setTransactions] = React.useState<any[]>([])

  React.useEffect(() => {
    const storedItem = localStorage.getItem("userData")
    const parsedData = storedItem ? JSON.parse(storedItem) : {}
    const banks = parsedData.banks || [];
    const data = banks.flatMap((bank: any) => bank.transactions || [])
      .filter((transaction: any) => transaction.description.toLowerCase() !== "opening balance")
    setTransactions(data)
  }, [])

  const aggregatedData = transactions.reduce((acc: Record<string, { credit: number; debit: number }>, transaction: any) => {
    const date = new Date(transaction.date)
    const month = date.toLocaleString('en-US', { month: 'short' })
    if (!acc[month]) acc[month] = { credit: 0, debit: 0 }
    if (transaction.transactionType === "credit") {
      acc[month].credit += transaction.amount
    } else if (transaction.transactionType === "debit") {
      acc[month].debit += Math.abs(transaction.amount)
    }
    return acc
  }, {})

  const data: BarData[] = Object.entries(aggregatedData).map(([month, values]) => {
    const { credit, debit } = values as { credit: number; debit: number }
    return { month, credit, debit }
  })

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span>Credit vs Debit Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">No transaction data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
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
              />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => <span style={{color: '#4B5563'}}>{value}</span>}
              />
              <Bar 
                dataKey="credit" 
                fill="#10B981" 
                name="Credit"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="debit" 
                fill="#EF4444" 
                name="Debit"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
