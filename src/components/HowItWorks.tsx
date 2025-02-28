import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
    import { LineChart, CreditCard, TrendingUp, Zap } from "lucide-react"

const steps = [
  {
    title: "Track Your Stocks",
    description: "Monitor your stock portfolio and get real-time updates on market performance and trends.",
    icon: LineChart,
  },
  {
    title: "Connect Your Accounts",
    description: "Securely link your bank accounts and credit cards to get a comprehensive view of your finances.",
    icon: CreditCard,
  },
  {
    title: "Track Your Spending",
    description:
      "Spendly automatically categorizes your transactions and provides real-time insights into your spending habits.",
    icon: TrendingUp,
  },
  {
    title: "Get AI-Powered Advice",
    description:
      "Receive personalized financial advice and savings strategies based on your unique financial situation.",
    icon: Zap,
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How Spendly Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <step.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}