"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Small Business Owner",
    content: "Spendly has revolutionized how I manage my business finances. The AI insights are incredibly helpful!",
  },
  {
    name: "Bob Smith",
    role: "Freelance Designer",
    content: "As a freelancer, keeping track of expenses was always a hassle. Spendly made it effortless and even fun!",
  },
  {
    name: "Carol Williams",
    role: "Student",
    content:
      "The budgeting features in Spendly helped me save for my semester abroad. It's a game-changer for students!",
  },
  {
    name: "David Brown",
    role: "Retiree",
    content:
      "Managing retirement funds was daunting until I found Spendly. Now I feel in control of my financial future.",
  },
  {
    name: "Eva Martinez",
    role: "Tech Entrepreneur",
    content:
      "The investment tracking in Spendly is top-notch. It's become an essential tool for managing my portfolio.",
  },
]

export function InfiniteCarousel() {
  return (
    <section id="testimonials" className="overflow-hidden bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gradient">What Our Users Say</h2>
      </div>
      <motion.div
        className="flex"
        animate={{
          x: ["0%", "-100%"],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        }}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <Card key={index} className="flex-shrink-0 w-[300px] mx-4 card-hover dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </section>
  )
}