import { FeatureCard } from "./FeatureCard"
import { Brain, PiggyBank, BarChart3, CalendarClock, Bot, Shield, Wallet } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "AI-Powered Budgeting",
      description: "Categorizes spending, provides insights, and suggests savings strategies.",
      icon: Brain,
    },
    {
      title: "Bank Account Integration",
      description: "Securely links bank accounts for real-time financial tracking.",
      icon: PiggyBank,
    },
    {
      title: "Investment Portfolio Management",
      description: "Tracks stocks, crypto, and mutual funds with AI-driven insights.",
      icon: BarChart3,
    },
    {
      title: "FD Manager",
      description: "Track fixed deposits, get maturity alerts, and compare rates across banks.",
      icon: Wallet,
    },
    {
      title: "AI Financial Advisor",
      description: "Offers personalized financial advice based on user behavior.",
      icon: Bot,
    },
    {
      title: "Data Security & Privacy",
      description: "End-to-end encryption with secure authentication.",
      icon: Shield,
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}