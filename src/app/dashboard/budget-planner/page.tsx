"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getHousingRentRange,
  getGroceriesUtilitiesRange,
  getTransportationRange,
  getEmergencyFundRange,
  getInvestmentsRange,
  getHealthInsuranceRange,
  getEntertainmentDiningRange,
  getShoppingRange,
  getPersonalCareRange,
} from "@/utils/budgetFormulas";
import SpeechRecognition from "@/components/dashboard/SpeechRecognition";
import InvestmentChoiceModal from "@/components/InvestmentChoiceModal";
import { useSession } from "next-auth/react";
import ConfirmChangesModal, { DiffBudget } from "@/components/dashboard/ConfirmChangesModal";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

interface BudgetResponse {
  advice: string;
  updatedBudget: BudgetItem[];
}

const getMiddlePercentage = (range: string) => {
  const [min, max] = range.split("-").map((x) => parseFloat(x));
  return (min + max) / 2;
};

const calculateAmount = (balance: number, percentage: number) => {
  return Math.round((percentage / 100) * balance);
};

const FlashNumber = ({ value }: { value: number }) => {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(timer);
  }, [value]);
  return (
    <motion.span
      animate={{ backgroundColor: flash ? "#ffe680" : "transparent" }}
      transition={{ duration: 0.5 }}
      className="px-1 rounded"
    >
      ₹{value.toLocaleString()}
    </motion.span>
  );
};

const defaultCategories = [
  "Housing/Rent",
  "Groceries & Utilities",
  "Transportation",
  "Emergency Fund",
  "Investments",
  "Health Insurance",
  "Entertainment & Dining",
  "Shopping",
  "Personal Care",
];

const BudgetCard = ({
  category,
  amount,
  percentage,
  showAddAsGoal,
  onClick,
  isImmutable,
  toggleImmutable,
}: {
  category: string;
  amount: number;
  percentage: number;
  showAddAsGoal?: boolean;
  onClick?: () => void;
  isImmutable: boolean;
  toggleImmutable: () => void;
}) => {
  const router = useRouter();
  const isInvestments = category === "Investments";
  const { data: session } = useSession();
  const username = session?.user?.username;

  const handleAddAsGoal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!username) return;
    await fetch(`/api/goals/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalTitle: category,
        amount,
        remaining: 0,
      }),
    });
    router.push("/dashboard/goals");
  };

  const handleClick = () => {
    if (isInvestments && onClick) {
      onClick();
    }
  };

  return (
    <div className="relative">
      <Card
        className={`hover:shadow-lg transition-shadow ${
          isInvestments ? "cursor-pointer hover:border-primary" : ""
        }`}
        onClick={handleClick}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{category}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">
            <FlashNumber value={amount} />
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}% of total budget
          </p>
          {showAddAsGoal && (
            <Button
              variant="outline"
              className="mt-2"
              onClick={handleAddAsGoal}
              disabled={!username}
            >
              Add as Goal
            </Button>
          )}
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className={`mt-2 w-full ${isImmutable ? "bg-secondary text-white" : ""}`}
        onClick={toggleImmutable}
      >
        Don't Change
      </Button>
      {isInvestments && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -bottom-8 left-0 right-0 text-center text-sm text-primary font-medium"
        >
          Click to choose investment options
        </motion.div>
      )}
    </div>
  );
};

const Chatbox = ({
  budgetDistribution,
  onBudgetUpdate,
  immutableCategories,
}: {
  budgetDistribution: Record<string, { amount: number; percentage: number }>;
  onBudgetUpdate: (newBudget: BudgetItem[]) => void;
  immutableCategories: string[];
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" as const };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/suggest-budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: input,
            currentDistribution: Object.entries(budgetDistribution).map(
              ([category, data]) => ({
                category,
                amount: data.amount,
                percentage: data.percentage,
              })
            ),
            immutableCategories,
          }),
        });

        const data = await response.json();
        if (data.suggestion) {
          try {
            const parsedResponse: BudgetResponse = JSON.parse(data.suggestion);
            setMessages((prev) => [
              ...prev,
              { text: parsedResponse.advice, sender: "bot" },
            ]);
            onBudgetUpdate(parsedResponse.updatedBudget);
          } catch (parseError) {
            setMessages((prev) => [
              ...prev,
              { text: data.suggestion, sender: "bot" },
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to get suggestion:", error);
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I couldn't process your request. Please try again.",
            sender: "bot",
          },
        ]);
      }

      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Budget Assistant</span>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4 h-[400px]" ref={scrollRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted mr-auto"
              } max-w-[80%]`}
            >
              {msg.text}
            </div>
          ))}
        </ScrollArea>
        <div className="flex gap-2 items-end">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your budget..."
            className="flex-grow"
            disabled={isLoading}
          />
          <SpeechRecognition
            onResult={(text) => setInput((prev) => prev + " " + text)}
            onStart={() => setInput("")} // clear input on start of speech recognition
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BudgetManagement() {
  const getBudgetData = (initialBalance: number) => [
    {
      category: "Housing/Rent",
      percentage: getMiddlePercentage(getHousingRentRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getHousingRentRange(initialBalance))
      ),
    },
    {
      category: "Groceries & Utilities",
      percentage: getMiddlePercentage(
        getGroceriesUtilitiesRange(initialBalance)
      ),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getGroceriesUtilitiesRange(initialBalance))
      ),
    },
    {
      category: "Transportation",
      percentage: getMiddlePercentage(getTransportationRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getTransportationRange(initialBalance))
      ),
    },
    {
      category: "Emergency Fund",
      percentage: getMiddlePercentage(getEmergencyFundRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getEmergencyFundRange(initialBalance))
      ),
    },
    {
      category: "Investments",
      percentage: getMiddlePercentage(getInvestmentsRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getInvestmentsRange(initialBalance))
      ),
    },
    {
      category: "Health Insurance",
      percentage: getMiddlePercentage(getHealthInsuranceRange()),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getHealthInsuranceRange())
      ),
    },
    {
      category: "Entertainment & Dining",
      percentage: getMiddlePercentage(
        getEntertainmentDiningRange(initialBalance)
      ),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getEntertainmentDiningRange(initialBalance))
      ),
    },
    {
      category: "Shopping",
      percentage: getMiddlePercentage(getShoppingRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getShoppingRange(initialBalance))
      ),
    },
    {
      category: "Personal Care",
      percentage: getMiddlePercentage(getPersonalCareRange(initialBalance)),
      amount: calculateAmount(
        initialBalance,
        getMiddlePercentage(getPersonalCareRange(initialBalance))
      ),
    },
  ];

  const [balance, setBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const storedItem = localStorage.getItem("userData");
      if (storedItem) {
        const parsedData = JSON.parse(storedItem);
        const banks = parsedData.banks || [];
        const transactions = banks
          .flatMap((bank: any) => bank.transactions || [])
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        return transactions[0]?.balance || 0;
      }
    }
    return 0;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItem = localStorage.getItem("userData");
      if (storedItem) {
        const parsedData = JSON.parse(storedItem);
        const banks = parsedData.banks || [];
        const transactions = banks
          .flatMap((bank: any) => bank.transactions || [])
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        setBalance(transactions[0]?.balance || 0);
      }
    }
  }, []);

  const [budgetDistribution, setBudgetDistribution] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("budgetDistribution");
      if (stored) return JSON.parse(stored);
    }
    // @ts-ignore
    const initialBudgetData = getBudgetData(0);
    return initialBudgetData.reduce((acc, item) => {
      acc[item.category] = {
        amount: item.amount,
        percentage: item.percentage,
      };
      return acc;
    }, {} as Record<string, { amount: number; percentage: number }>);
  });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage.getItem("budgetDistribution")
    ) {
      // @ts-ignore
      const updatedBudgetData = getBudgetData(balance);
      const newBudgetDistribution = updatedBudgetData.reduce((acc, item) => {
        acc[item.category] = {
          amount: item.amount,
          percentage: item.percentage,
        };
        return acc;
      }, {} as Record<string, { amount: number; percentage: number }>);
      setBudgetDistribution(newBudgetDistribution);
    }
  }, [balance]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "budgetDistribution",
        JSON.stringify(budgetDistribution)
      );
    }
  }, [budgetDistribution]);

  const [pendingBudgetDiff, setPendingBudgetDiff] = useState<DiffBudget[] | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBudgetUpdate = (newBudget: BudgetItem[]) => {
    const diff: DiffBudget[] = newBudget.map((item) => {
      const current = budgetDistribution[item.category] || { amount: 0, percentage: 0 };
      return {
        category: item.category,
        oldAmount: current.amount,
        newAmount: item.amount,
        deltaAmount: item.amount - current.amount,
        oldPercentage: current.percentage,
        newPercentage: item.percentage,
        deltaPercentage: item.percentage - current.percentage,
      };
    });
    setPendingBudgetDiff(diff);
    setShowConfirmModal(true);
  };

  const confirmUpdate = () => {
    if (pendingBudgetDiff) {
      const updatedDistribution = pendingBudgetDiff.reduce((acc, item) => {
        acc[item.category] = {
          amount: item.newAmount,
          percentage: item.newPercentage,
        };
        return acc;
      }, {} as Record<string, { amount: number; percentage: number }>);
      setBudgetDistribution(updatedDistribution);
      setShowConfirmModal(false);
      setPendingBudgetDiff(null);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmModal(false);
    setPendingBudgetDiff(null);
  };

  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedInvestmentAmount, setSelectedInvestmentAmount] = useState(0);

  const handleCardClick = (category: string, amount: number) => {
    if (category === "Investments") {
      setSelectedInvestmentAmount(amount);
      setShowInvestmentModal(true);
    }
  };

  const [immutableCategories, setImmutableCategories] = useState<string[]>([]);

  const toggleImmutableCategory = (category: string) => {
    setImmutableCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-6">Personal Budget Management</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 grid grid-cols-3 gap-4">
          {Object.entries(budgetDistribution).map(([category, data], index) => (
            <BudgetCard
              key={index}
              category={category}
              // @ts-ignore
              amount={data.amount}
              // @ts-ignore
              percentage={data.percentage}
              showAddAsGoal={!defaultCategories.includes(category)}
              //@ts-ignore
              onClick={() => handleCardClick(category, data.amount)}
              isImmutable={immutableCategories.includes(category)}
              toggleImmutable={() => toggleImmutableCategory(category)}
            />
          ))}
        </div>
        <div className="col-span-1">
          <Chatbox
            budgetDistribution={budgetDistribution}
            onBudgetUpdate={handleBudgetUpdate}
            immutableCategories={immutableCategories}
          />
        </div>
      </div>

      <InvestmentChoiceModal
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        amount={selectedInvestmentAmount}
      />
      
      <ConfirmChangesModal
        isOpen={showConfirmModal}
        changes={pendingBudgetDiff || []}
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
      />
    </div>
  );
}