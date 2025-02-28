import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$0",
    description: "For individuals just starting their financial journey",
    features: ["Expense tracking", "Basic budgeting tools", "Limited AI insights", "Connect up to 2 accounts"],
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For those serious about financial growth",
    features: [
      "Everything in Basic",
      "Advanced budgeting tools",
      "Full AI-powered insights",
      "Unlimited account connections",
      "Investment tracking",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For businesses and high net worth individuals",
    features: [
      "Everything in Pro",
      "Dedicated financial advisor",
      "Custom integrations",
      "Priority support",
      "Team collaboration tools",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

