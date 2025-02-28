import { HeroCarousel } from "@/components/HeroCarousel"
import { Features } from "@/components/Features"
import { HowItWorks } from "@/components/HowItWorks"
import { InfiniteCarousel } from "@/components/InfiniteCarousel"
import { AlternatingSection } from "@/components/AlternatingSection"

const section1FAQs = [
  {
    question: "How does Spendly's AI-powered budgeting work?",
    answer:
      "Spendly uses advanced machine learning algorithms to analyze your spending patterns, categorize transactions, and provide personalized insights and recommendations to help you budget more effectively.",
  },
  {
    question: "Is my financial data safe with Spendly?",
    answer:
      "Yes, we take data security very seriously. We use bank-level encryption and security measures to protect your financial information. Your data is never sold or shared with third parties.",
  },
  {
    question: "Can I connect multiple bank accounts to Spendly?",
    answer:
      "Spendly allows you to connect and manage multiple bank accounts, credit cards, and investment accounts all in one place for a comprehensive view of your finances.",
  },
]

const section2FAQs = [
  {
    question: "How accurate are Spendly's investment insights?",
    answer:
      "Spendly's investment insights are based on real-time market data and advanced analytics. While we strive for high accuracy, all investment decisions should be made with careful consideration and professional advice when needed.",
  },
  {
    question: "Can Spendly help me save for specific financial goals?",
    answer:
      "Yes! Spendly allows you to set and track multiple financial goals. Our AI will provide personalized strategies and recommendations to help you reach your savings targets faster.",
  },
  {
    question: "Does Spendly offer bill payment reminders?",
    answer:
      "Absolutely. Spendly can analyze your recurring expenses and set up automated reminders for bill payments to help you avoid late fees and maintain a good credit score.",
  },
]

const section3FAQs = [
  {
    question: "How often is my financial data updated in Spendly?",
    answer:
      "Spendly syncs with your connected accounts multiple times a day to ensure you have the most up-to-date information. You can also manually refresh your accounts at any time.",
  },
  {
    question: "Can I use Spendly on my mobile device?",
    answer:
      "Yes, Spendly is available as both a web application and a mobile app for iOS and Android devices, allowing you to manage your finances on the go.",
  },
  {
    question: "What kind of customer support does Spendly offer?",
    answer:
      "We offer 24/7 customer support via chat and email. Our dedicated support team is always ready to assist you with any questions or issues you may have.",
  },
]

export default function Home() {
  return (
    <main className="pt-16">
      <HeroCarousel />
      <HowItWorks />
      <Features />
      <AlternatingSection
        title="Smart Budgeting & Expense Tracking"
        description="Experience the power of AI-driven financial management with Spendly. Our smart budgeting and expense tracking features help you take control of your finances like never before."
        imageSrc="/budgeting.jpg"
        imageAlt="Smart Budgeting Illustration"
        faqs={section1FAQs}
        imageOnLeft={true}
      />
      <AlternatingSection
        title="Intelligent Investment Insights"
        description="Make informed investment decisions with Spendly's cutting-edge analytics and personalized recommendations. Stay on top of your portfolio and maximize your returns."
        imageSrc="/investments.jpg"
        imageAlt="Investment Insights Illustration"
        faqs={section2FAQs}
        imageOnLeft={false}
      />
      <AlternatingSection
        title="Seamless Financial Integration"
        description="Connect all your accounts in one place for a comprehensive view of your financial health. Spendly makes it easy to manage your money across multiple institutions."
        imageSrc="/integration.jpg"
        imageAlt="Financial Integration Illustration"
        faqs={section3FAQs}
        imageOnLeft={true}
      />
      <InfiniteCarousel />
    </main>
  )
}