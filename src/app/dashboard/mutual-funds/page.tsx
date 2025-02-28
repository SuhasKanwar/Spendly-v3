"use client";
import ChatbotModal from "@/components/MutualFundsChatbotModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MutualFund {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    isin_growth: string;
    isin_div_reinvestment: string | null;
  };
  data: {
    date: string;
    nav: string;
  }[];
  status: string;
}

export default function MutualFundsPage() {
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(true);
  const searchParams = useSearchParams();
  const queryAmount = searchParams.get("amount");

  const fetchMutualFunds = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://stocksmicro.onrender.com/mutual-funds"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mutual funds");
      }
      const data = await response.json();
      setFunds(data);
    } catch (err) {
      console.error("Error fetching mutual funds:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch mutual funds"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryAmount) {
      setManualAmount(queryAmount);
      setShowBudgetDialog(false);
      fetchMutualFunds();
    }
  }, [queryAmount]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAmount) {
      fetchMutualFunds();
    }
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAmount) {
      setShowBudgetDialog(false);
      fetchMutualFunds();
    }
  };

  const filteredFunds = funds.filter((fund) => {
    const nav = parseFloat(fund.data[0].nav);
    const budget = parseFloat(manualAmount);
    return !isNaN(nav) && !isNaN(budget) && nav <= budget;
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500 p-4 rounded bg-red-50">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Dialog
        open={showBudgetDialog && !queryAmount}
        onOpenChange={setShowBudgetDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Investment Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBudgetSubmit} className="space-y-4 mt-4">
            <Input
              type="number"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              placeholder="Enter amount in INR"
              className="flex-grow"
              min="0"
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={!manualAmount}>
              Analyze
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-4 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Mutual Fund Recommendations
            {manualAmount && (
              <span className="text-lg font-normal ml-2">
                (Budget: ₹{parseInt(manualAmount).toLocaleString()})
              </span>
            )}
          </h1>
          <Button
            variant="outline"
            onClick={() => setIsChatOpen(true)}
            className="flex gap-2 items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ask AI Assistant
          </Button>
        </div>

        <ChatbotModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />

        {!queryAmount && (
          <form onSubmit={handleManualSubmit} className="mb-8">
            <div className="flex gap-4 max-w-md">
              <Input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="Enter investment amount in INR"
                className="flex-grow"
                min="0"
              />
              <Button type="submit" disabled={!manualAmount || isLoading}>
                Analyze
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFunds.length > 0 ? (
            filteredFunds.map((fund) => (
              <Card key={fund.meta.scheme_code}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {fund.meta.fund_house}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-sm mb-2">
                    {fund.meta.scheme_name}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>Type: {fund.meta.scheme_type}</p>
                    <p>Category: {fund.meta.scheme_category}</p>
                    <p className="font-semibold">
                      NAV: ₹{parseFloat(fund.data[0].nav).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last Updated: {fund.data[0].date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No mutual funds found within your budget range.
            </div>
          )}
        </div>
      </div>
    </>
  );
}