import { ethers } from 'ethers';
import axios from 'axios';

// Contract ABI fragments we need
const ORACLE_ABI = [
    "function updatePrice(uint256 _price) external",
    "function getPrice() external view returns (uint256, bool)",
    "function getLastUpdateTimestamp() external view returns (uint256)"
];

interface PriceData {
    price: number;
    threshold: {
        buy: number;
        sell: number;
    };
}

export class PriceUpdateService {
    private provider: ethers.providers.Provider;
    private wallet: ethers.Wallet;
    private oracle: ethers.Contract;
    private interval?: NodeJS.Timeout;
    private cryptoName: string;

    constructor(
        provider: string,
        oracleAddress: string,
        privateKey: string,
        cryptoName: string,
        baseApiUrl: string = 'http://localhost:8000'
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(provider);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.oracle = new ethers.Contract(oracleAddress, ORACLE_ABI, this.wallet);
        this.cryptoName = cryptoName.toLowerCase();
    }

    private async fetchThresholdData(): Promise<PriceData> {
        try {
            const response = await axios.get<PriceData>(`http://localhost:8000/threshold/${this.cryptoName}`);
            if (!response.data || !response.data.price || !response.data.threshold) {
                throw new Error('Invalid data from API');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching threshold data:', error);
            throw error;
        }
    }

    async updatePrice(): Promise<void> {
        try {
            const data = await this.fetchThresholdData();
            const priceInWei = ethers.utils.parseUnits(data.price.toString(), 18);
            const tx = await this.oracle.updatePrice(priceInWei);
            await tx.wait();
            console.log(`Price updated for ${this.cryptoName}: ${data.price}`);
            console.log(`Thresholds - Buy: ${data.threshold.buy}, Sell: ${data.threshold.sell}`);
        } catch (error) {
            console.error('Error updating price:', error);
            throw error;
        }
    }

    async start(updateInterval: number = 60000): Promise<void> {
        console.log(`Price Update Service started for ${this.cryptoName}`);
        
        // Clear any existing interval
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(async () => {
            try {
                await this.updatePrice();
            } catch (error) {
                console.error('Update cycle failed:', error);
            }
        }, updateInterval);
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            console.log(`Price Update Service stopped for ${this.cryptoName}`);
        }
    }
}
