interface CryptoIconProps {
  symbol: string;
  className?: string;
}

const iconUrls: { [key: string]: string } = {
  'bitcoin': "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
  'ethereum': "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
  'ripple': "https://cryptologos.cc/logos/xrp-xrp-logo.svg",
  'dogecoin': "https://cryptologos.cc/logos/dogecoin-doge-logo.svg",
  'cardano': "https://cryptologos.cc/logos/cardano-ada-logo.svg",
  'solana': "https://cryptologos.cc/logos/solana-sol-logo.svg",
  'polkadot': "https://cryptologos.cc/logos/polkadot-new-dot-logo.svg",
  'avalanche-2': "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
  'chainlink': "https://cryptologos.cc/logos/chainlink-link-logo.svg",
  'matic-network': "https://cryptologos.cc/logos/polygon-matic-logo.svg"
};

export function CryptoIcon({ symbol, className = "h-6 w-6" }: CryptoIconProps) {
  const iconUrl = iconUrls[symbol.toLowerCase()];
  
  return (
    <img
      src={iconUrl}
      alt={`${symbol} icon`}
      className={className}
    />
  );
}
