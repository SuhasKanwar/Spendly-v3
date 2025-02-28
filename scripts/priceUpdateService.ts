import { ethers } from "hardhat";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { utils } from "ethers";

// Contract ABI fragments we need
const CHAINLINK_ABI = [
    "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    "function decimals() external view returns (uint8)"
];

interface ChainlinkPriceData {
    roundId: BigNumber;
    answer: BigNumber;
    startedAt: BigNumber;
    updatedAt: BigNumber;
    answeredInRound: BigNumber;
}

interface PriceFeedData {
    price: number;
    threshold: {
        buy: number;
        sell: number;
    };
}

export class PriceUpdateService {
    private chainlinkFeed: Contract;
    private cryptoName: string;
    private interval?: NodeJS.Timeout;

    constructor(
        chainlinkAddress: string,
        cryptoName: string,
        provider?: JsonRpcProvider
    ) {
        const defaultProvider = new JsonRpcProvider(
            "https://sepolia.infura.io/v3/0b628bfdb1bf4499ab42192408b20ea0"
        );
        this.chainlinkFeed = new Contract(
            chainlinkAddress, 
            CHAINLINK_ABI, 
            provider || defaultProvider
        );
        this.cryptoName = cryptoName.toLowerCase();
    }

    private async getLatestPrice(): Promise<number> {
        try {
            const decimals = await this.chainlinkFeed.decimals();
            const data: ChainlinkPriceData = await this.chainlinkFeed.latestRoundData();
            return parseFloat(utils.formatUnits(data.answer, decimals));
        } catch (error) {
            console.error('Error fetching price data:', error);
            throw error;
        }
    }

    async monitorPrice(): Promise<void> {
        try {
            const price = await this.getLatestPrice();
            console.log(`Current ${this.cryptoName} price: $${price}`);
        } catch (error) {
            console.error('Error monitoring price:', error);
            throw error;
        }
    }

    async start(updateInterval: number = 60000): Promise<void> {
        console.log(`Price monitoring service started for ${this.cryptoName}`);
        
        // Clear any existing interval
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(async () => {
            try {
                await this.monitorPrice();
            } catch (error) {
                console.error('Update cycle failed:', error);
            }
        }, updateInterval);
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            console.log(`Price monitoring service stopped for ${this.cryptoName}`);
        }
    }
}
