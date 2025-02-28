"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

interface AlternatingSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  faqs: FAQ[]
  imageOnLeft: boolean
}

export function AlternatingSection({
  title,
  description,
  imageSrc,
  imageAlt,
  faqs,
  imageOnLeft,
}: AlternatingSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}>
          <div className="w-full lg:w-1/2">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg mb-8">{description}</p>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="text-lg font-medium">{faq.question}</span>
                    {openFAQ === index ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {openFAQ === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

