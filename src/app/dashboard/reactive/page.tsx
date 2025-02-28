// ReactiveBuySellPanel.tsx
'use client'
import { useState } from "react";
import { ethers, Contract } from "ethers";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xC538763E67293b1FA6F8E118d5F413F1A9595646";

// Minimal ABI for buy and sell functions
const ABI = [
  "function buy(uint256 amount) external",
  "function sell(uint256 amount) external"
];

export default function Page() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const executeTransaction = async (action: "buy" | "sell") => {
    if (!amount) {
      setMessage("Enter a valid amount");
      return;
    }
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      // Using ethers v5 Web3Provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      let tx;
      // Using ethers v5 parseUnits from ethers.utils
      const parsedAmount = ethers.utils.parseUnits(amount, "wei");
      if (action === "buy") {
        tx = await contract.buy(parsedAmount);
      } else {
        tx = await contract.sell(parsedAmount);
      }
      await tx.wait();
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} executed successfully.`);
    } catch (error: any) {
      console.error(error);
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} execution failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px", margin:"45px" }}>
      <h3>Reactive Buy/Sell Panel</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => executeTransaction("buy")} disabled={loading} style={{ padding: "8px 16px" }}>
          Buy
        </button>
        <button onClick={() => executeTransaction("sell")} disabled={loading} style={{ padding: "8px 16px" }}>
          Sell
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
