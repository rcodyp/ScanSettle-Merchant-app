import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const api = process.env.KIRAPAY_API_KEY ?? '';
  const response = await fetch("https://api.kira-pay.com/api/wallet/transactions/stats", {
    headers: {
      "x-api-key": api,
    }
  });

  const data = await response.json();
  console.log(data);

  return NextResponse.json(data);
}