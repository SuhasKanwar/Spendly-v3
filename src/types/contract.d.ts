declare module '../contracts/ReactiveBuySell.json' {
  const content: {
    abi: Array<{
      inputs: Array<{
        internalType: string;
        name: string;
        type: string;
      }>;
      stateMutability: string;
      type: string;
      name?: string;
      outputs?: Array<{
        internalType: string;
        name: string;
        type: string;
      }>;
      anonymous?: boolean;
    }>;
  };
  export default content;
}

declare module '../contracts/deployment.json' {
  type SupportedCrypto = "bitcoin" | "ethereum";
  
  const content: {
    priceFeedOracle: string;
    reactiveBuySell: {
      [K in SupportedCrypto]: string;
    };
  };
  export default content;
}
