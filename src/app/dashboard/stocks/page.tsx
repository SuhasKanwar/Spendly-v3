"use client";
import ChatbotModal from "@/components/ChatbotModal";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Stock {
  symbol: string;
  price: number;
  name: string;
  recommendation: string;
  forward_pe: number | string;
  dividend_yield: number;
  market_cap: number;
  currency: string;
  volume: number;
  avg_volume: number;
  fifty_day_average: number;
}

interface StockResponse {
  budget_inr: number;
  budget_usd: number;
  stocks: Stock[];
  recommendations: string;
}

export default function StocksPage() {
  const [stockData, setStockData] = useState<StockResponse | null>(null);
  const [topStocks, setTopStocks] = useState<StockResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualAmount, setManualAmount] = useState("");
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const searchParams = useSearchParams();
  const queryAmount = searchParams.get("amount");

  const fetchStocksData = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestOptions = {
        method: "POST",
        headers,
        body: JSON.stringify({ budget_inr: amount }),
      };

      const [analysisResponse, recommendationsResponse] = await Promise.all([
        fetch(
          "https://stocksmicro.onrender.com/analyze-stocks",
          requestOptions
        ),
        fetch(
          "https://stocksmicro.onrender.com/top-recommendations",
          requestOptions
        ),
      ]);

      if (!analysisResponse.ok || !recommendationsResponse.ok) {
        throw new Error("One or more API requests failed");
      }

      const analysisData = await analysisResponse.json();
      const recommendationsData = await recommendationsResponse.json();

      if (!analysisData || !recommendationsData) {
        throw new Error("Invalid data received from API");
      }

      setStockData(analysisData);
      setTopStocks(recommendationsData);
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch stock data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryAmount) {
      setManualAmount(queryAmount);
      fetchStocksData(Number(queryAmount));
    }
  }, [queryAmount]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAmount) {
      fetchStocksData(Number(manualAmount));
    }
  };

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

  // Parse markdown table to array of objects
  const parseRecommendations = (markdown: string) => {
    const lines = markdown
      .split("\n")
      .filter((line) => line.trim() && !line.includes("|-"));
    const headers = lines[1]
      .split("|")
      .filter(Boolean)
      .map((h) => h.trim());

    return lines.slice(2).map((line) => {
      const values = line
        .split("|")
        .filter(Boolean)
        .map((v) => v.trim());
      return headers.reduce((obj, header, i) => {
        obj[header.toLowerCase().replace(/ /g, "_")] = values[i];
        return obj;
      }, {} as Record<string, string>);
    });
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Stock Recommendations
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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
          <div className="flex gap-4 max-w-md mt-6">
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
      
      {/* <h1 className="text-3xl font-bold mb-6 mt-10">
        Stock Recommendations
        {manualAmount && (
          <span className="text-lg font-normal ml-2">
            (Budget: ₹{parseInt(manualAmount).toLocaleString()})
          </span>
        )}
      </h1> */}

      {topStocks?.recommendations && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Recommended Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed w-full">
                  <thead>
                    <tr>
                      <th className="w-1/6 px-4 py-2 text-center">Stock</th>
                      <th className="w-1/6 px-4 py-2 text-center">Score</th>
                      <th className="w-1/6 px-4 py-2 text-center">Price Score</th>
                      <th className="w-1/6 px-4 py-2 text-center">Analyst Rating</th>
                      {/* <th className="w-1/6 px-4 py-2 text-center">P/E Score</th> */}
                      <th className="w-1/6 px-4 py-2 text-center">Dividend Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseRecommendations(topStocks.recommendations).map(
                      (stock, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-muted" : ""}
                        >
                          <td className="px-4 py-2 text-center">{stock.stock}</td>
                          <td className="px-4 py-2 text-center">{stock.score}</td>
                          <td className="px-4 py-2 text-center">{stock.price_score}</td>
                          <td className="px-4 py-2 text-center">{stock.analyst_rating}</td>
                          {/* <td className="px-4 py-2 text-center">{stock.p_e_score}</td> */}
                          <td className="px-4 py-2 text-center">{stock.dividend_score}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stockData?.stocks.map((stock) => (
          <Card
            key={stock.symbol}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => setSelectedStock(stock.symbol)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{stock.symbol}</span>
                <span className="text-sm font-normal">
                  {stock.currency} {stock.price.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{stock.name}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Recommendation: {stock.recommendation}</p>
                <p>P/E Ratio: {stock.forward_pe}</p>
                <p>
                  Dividend Yield: {(stock.dividend_yield * 100).toFixed(2)}%
                </p>
                <p>Market Cap: {stock.market_cap}B</p>
                <p>Volume: {stock.volume.toLocaleString()}</p>
                <p>50 Day Avg: {stock.fifty_day_average.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}