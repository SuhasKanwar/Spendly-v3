import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,dogecoin,cardano,solana,polkadot,avalanche-2,chainlink,matic-network&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch crypto prices' }, { status: 500 });
  }
}
