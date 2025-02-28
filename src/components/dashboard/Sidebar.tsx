import Link from "next/link"
import { Home, CreditCard, BarChart2, PiggyBank, TrendingUp, Calculator, Bitcoin, LineChart } from "lucide-react"

const menuItems = [
  { icon: BarChart2, label: "Dashboard", href: "/dashboard" },
  { icon: CreditCard, label: "Transactions", href: "/dashboard/transactions" },
  { icon: PiggyBank, label: "Budget Planner", href: "/dashboard/budget-planner" },
  { icon: TrendingUp, label: "Stocks", href: "/dashboard/stocks" },
  { icon: LineChart, label: "Mutual Funds", href: "/dashboard/mutual-funds" },
  { icon: Bitcoin, label: "Crypto Wallet", href: "/dashboard/crypto" },
  { icon: Home, label: "Goals", href: "/dashboard/goals" },
  { icon: Calculator, label: "FD Planner", href: "/dashboard/planner" },
  {icon: Calculator, label: "Reactive Transactions", href: "/dashboard/reactive"}
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white h-full flex flex-col">
      <nav className="flex-1 mt-20">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}