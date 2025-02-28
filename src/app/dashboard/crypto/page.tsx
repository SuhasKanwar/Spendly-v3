'use client';
import { useEffect, useState } from 'react';
import { CryptoIcon } from '@/components/ui/CryptoIcon';
import { ethers } from 'ethers';
import ReactiveBuySell from '../../../contracts/ReactiveBuySell.json';
import deploymentInfo from '../../../contracts/deployment.json';

type SupportedCrypto = 'ethereum';

interface DeploymentInfo {
  reactiveBuySell: {
    [key in SupportedCrypto]: string;
  };
}

const typedDeploymentInfo = deploymentInfo as DeploymentInfo;

const isSupportedCrypto = (str: string): str is SupportedCrypto => 
  str === 'ethereum';

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
  const [monitoredCryptos, setMonitoredCryptos] = useState<{[key: string]: boolean}>({});
  const [contracts, setContracts] = useState<{[key: string]: ethers.Contract}>({});

  const disconnectMetamask = async () => {
    setAccount("");
    setBalance("");
    setMonitoredCryptos({});
    setContracts({});

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/0b628bfdb1bf4499ab42192408b20ea0'],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
      }
    }
  };

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      // First switch to Sepolia
      await switchToSepolia();
      
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
      alert("Please make sure you're connected to Sepolia network");
    }
  };

  interface ThresholdResponse {
    crypto_id: string;
    threshold: {
      buy: number;
      sell: number;
    };
    explanation: string;
  }

  const handleAnalyze = async (crypto: string) => {
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/threshold/${crypto}`);
      const data = await res.json() as ThresholdResponse;
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
      setAnalysisResult({ error: 'Failed to fetch analysis.' });
    } finally {
      setModalLoading(false);
    }
  };

  const initializeContracts = async () => {
    if (!window.ethereum || !account) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const newContracts: {[key: string]: ethers.Contract} = {};
    const monitored: {[key: string]: boolean} = {};

    // Initialize contract instances for supported cryptocurrencies
    for (const [crypto, address] of Object.entries(typedDeploymentInfo.reactiveBuySell)) {
      if (isSupportedCrypto(crypto)) {
        const contract = new ethers.Contract(address, ReactiveBuySell.abi, signer);
        newContracts[crypto] = contract;
        
        try {
          // Check if contract is actively monitoring by checking its subscription status
          const isSubscribed = await contract.isSubscribed();
          monitored[crypto] = isSubscribed;
        } catch (error) {
          console.error(`Error checking subscription for ${crypto}:`, error);
          monitored[crypto] = false;
        }
      }
    }

    setContracts(newContracts);
    setMonitoredCryptos(monitored);
  };

  const toggleMonitoring = async (crypto: string) => {
    if (!account || !isSupportedCrypto(crypto) || !contracts[crypto]) return;

    try {
      const contract = contracts[crypto];
      if (!monitoredCryptos[crypto]) {
        // Start monitoring
        try {
          // Default thresholds if service is unavailable
          let buyThreshold = 1800; // $1800 for ETH
          let sellThreshold = 2200; // $2200 for ETH

          try {
            const thresholdData = await fetch(`http://127.0.0.1:8000/threshold/${crypto}`);
            if (thresholdData.ok) {
              const response = await thresholdData.json() as ThresholdResponse;
              if (response.threshold?.buy && response.threshold?.sell) {
                buyThreshold = response.threshold.buy;
                sellThreshold = response.threshold.sell;
              }
            }
          } catch (error) {
            console.warn('Threshold service unavailable, using default thresholds:', error);
          }

          // First subscribe to the contract
          await contract.subscribe({
            value: ethers.parseEther("0.000001") // Initial ETH for trading
          });

          // Then update thresholds
          await contract.updateThresholds(
            ethers.parseUnits(buyThreshold.toString(), 18),
            ethers.parseUnits(sellThreshold.toString(), 18)
          );
        } catch (error) {
          console.error('Error starting monitoring:', error);
          alert('Failed to start monitoring. Please check the threshold service is running and try again.');
          return;
        }
      } else {
        // Stop monitoring
        await contract.unsubscribe();
      }

      // Update monitoring status
      setMonitoredCryptos(prev => ({
        ...prev,
        [crypto]: !prev[crypto]
      }));

    } catch (error) {
      console.error("Error toggling monitoring:", error);
      alert("Failed to toggle monitoring. Please check the console for details.");
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
    initializeContracts();
  }, [account]);

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
            if (!data?.usd) return null;
            
            const contractAddress = isSupportedCrypto(crypto) ? 
              typedDeploymentInfo.reactiveBuySell[crypto] : undefined;
            const isSupported = contractAddress && contractAddress !== "";
            
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
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAnalyze(crypto)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Analyze
                  </button>
                  {isSupported && account && (
                    <>
                      <button
                        onClick={() => toggleMonitoring(crypto)}
                        className={`px-4 py-2 rounded transition-colors ${
                          monitoredCryptos[crypto]
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {monitoredCryptos[crypto] ? 'Stop Monitoring' : 'Monitor'}
                      </button>
                      <button
                        onClick={async () => {
                          if (!contracts[crypto]) return;
                          try {
                            await contracts[crypto].subscribe({
                              value: ethers.parseEther("0.000001")
                            });
                            await contracts[crypto].updateThresholds(
                              ethers.parseUnits("0", 18),
                              ethers.parseUnits("0", 18)
                            );
                            setMonitoredCryptos(prev => ({
                              ...prev,
                              [crypto]: true
                            }));
                          } catch (error) {
                            console.error("Simulation error:", error);
                            alert("Failed to simulate. Check console for details.");
                          }
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Simulate
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
