"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { IndianRupee, Percent, Calendar, Calculator, TrendingUp } from "lucide-react"

type CompoundingFrequency = "yearly" | "half-yearly" | "quarterly" | "monthly" | "daily"

const frequencyOptions: { value: CompoundingFrequency; label: string }[] = [
  { value: "yearly", label: "Yearly" },
  { value: "half-yearly", label: "Half-Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "daily", label: "Daily" },
]

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<number>(0)
  const [interestRate, setInterestRate] = useState<number>(0)
  const [tenure, setTenure] = useState<number>(0)
  const [frequency, setFrequency] = useState<CompoundingFrequency>("yearly")
  const [result, setResult] = useState<{ maturityAmount: number; totalInterest: number } | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateFD = () => {
    setIsCalculating(true)
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const r = interestRate / 100
      let n: number

      switch (frequency) {
        case "yearly":
          n = 1
          break
        case "half-yearly":
          n = 2
          break
        case "quarterly":
          n = 4
          break
        case "monthly":
          n = 12
          break
        case "daily":
          n = 365
          break
        default:
          n = 1
      }

      const maturityAmount = principal * Math.pow(1 + r / n, n * tenure)
      const totalInterest = maturityAmount - principal

      setResult({
        maturityAmount: Number(maturityAmount.toFixed(2)),
        totalInterest: Number(totalInterest.toFixed(2)),
      })
      setIsCalculating(false)
    }, 500)
  }

  return (
    <div className="mt-8">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-9 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Financial Planner
        </h1>
        
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              FD Return Calculator
            </CardTitle>
            <CardDescription>Calculate your Fixed Deposit returns with different compounding frequencies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); calculateFD() }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="principal" className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Principal Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="principal"
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      placeholder="Enter amount"
                      className="pl-8"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-muted-foreground">₹</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Interest Rate
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    placeholder="Enter rate"
                    className="pl-8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenure" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tenure
                  </Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    placeholder="Years"
                    className="pl-8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Compounding Frequency
                  </Label>
                  <Select value={frequency} onValueChange={(value: CompoundingFrequency) => setFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isCalculating}>
                {isCalculating ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Calculator className="w-4 h-4" />
                    </motion.div>
                    Calculating...
                  </span>
                ) : (
                  "Calculate Returns"
                )}
              </Button>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 rounded-lg overflow-hidden"
              >
                <div className="bg-primary/10 p-6 rounded-lg space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Calculation Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground">Maturity Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{result.maturityAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                      <p className="text-2xl font-bold text-primary">₹{result.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}