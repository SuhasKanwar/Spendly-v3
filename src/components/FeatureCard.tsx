import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg card-hover dark:bg-gray-800">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}