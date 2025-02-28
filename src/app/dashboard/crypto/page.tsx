'use client';
import { useEffect, useState } from 'react';
import { CryptoIcon } from '@/components/ui/CryptoIcon';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface CryptoData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const cryptoNames: { [key: string]: string } = {
  'bitcoin': 'Bitcoin',
  'ethereum': 'Ethereum',
  'ripple': 'XRP',
  'dogecoin': 'Dogecoin',
  'cardano': 'Cardano',
  'solana': 'Solana',
  'polkadot': 'Polkadot',
  'avalanche-2': 'Avalanche',
  'chainlink': 'Chainlink',
  'matic-network': 'Polygon'
};

export default function CryptoPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const disconnectMetamask = async () => {
    setAccount("");
    setBalance("");

    if (window.ethereum) {
      try {
        // This requests updated permissions. The user can revoke "eth_accounts" permission in MetaMask if they wish.
        // Note: There's no direct way for a dApp to forcibly log out of MetaMask, as the user controls permissions.
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const bal = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        const ethBalance = parseInt(bal, 16) / 1e18;
        setBalance(ethBalance.toFixed(4));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnalyze = async (crypto: string) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/threshold/${crypto}`);
      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
      setAnalysisResult({ error: 'Failed to fetch analysis.' });
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const bal = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            const ethBalance = parseInt(bal, 16) / 1e18;
            setBalance(ethBalance.toFixed(4));
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkWalletConnection();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/crypto');
      const data = await response.json();
      setCryptoData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Wallet Details</h3>
        {account ? (
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="text-gray-600">
                <span className="font-medium">Address:</span>{' '}
                {`${account.slice(0,6)}...${account.slice(-4)}`}
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Balance:</span> {balance} ETH
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={disconnectMetamask}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-4">No wallet connected</p>
            <button 
              onClick={connectMetamask}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect MetaMask
            </button>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-6">Cryptocurrency Prices</h1>
      {!cryptoData ? (
        <div>Loading cryptocurrency prices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(cryptoData).map(([crypto, data]) => {
            if (!data?.usd) return null; // Skip if data is invalid
            return (
              <div key={crypto} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2">
                  <CryptoIcon symbol={crypto} />
                  <h2 className="text-xl font-semibold capitalize">
                    {cryptoNames[crypto] || crypto}
                  </h2>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">${data.usd.toFixed(2)}</p>
                  <p className={`text-sm ${data.usd_24h_change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {data.usd_24h_change?.toFixed(2) || '0.00'}% (24h)
                  </p>
                </div>
                {/* New Analyze button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleAnalyze(crypto)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Analysis Result</h2>
              <button onClick={() => { setModalOpen(false); setAnalysisResult(null); }} className="text-gray-600">&times;</button>
            </div>
            {modalLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {analysisResult?.error ? (
                  <p className="text-red-600">{analysisResult.error}</p>
                ) : (
                  <>
                    <p><strong>Crypto:</strong> {analysisResult.crypto_id}</p>
                    <p><strong>Threshold:</strong> {analysisResult.threshold}</p>
                    <p><strong>Explanation:</strong></p>
                    <p>{analysisResult.explanation}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}