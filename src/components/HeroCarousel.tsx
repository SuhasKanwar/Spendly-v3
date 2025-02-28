"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const images = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-screen">
      {images.map((image, index) => (
        <motion.div
          key={image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Manage Your Finances</span>
            <span className="block text-gradient">Smarter with AI</span>
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            Spendly helps you track expenses, manage budgets, and receive AI-driven financial advice to achieve your
            financial goals.
          </p>
          <div className="mt-10 sm:flex sm:justify-center">
            <Button size="lg" className="px-8 py-3 text-lg gradient-bg text-white">
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="mt-3 sm:mt-0 sm:ml-3 px-8 py-3 text-lg text-black border-white hover:bg-white hover:text-gray-900"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}