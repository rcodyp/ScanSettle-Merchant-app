import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const currency = String(body.currency);
    console.log(typeof amount, typeof currency);
    const api = process.env.KIRAPAY_API_KEY;
    console.log("API Key:", api);
    const response = await fetch("https://api.kira-pay.com/api/link/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api,
      },
      body: JSON.stringify({
        tokenOut: {
          chainId: "sol",
        },
        receiver: "HRbbo6aUt8yaEw9wPGbBwaHtkRRRnmT3rF7oyJKg38Yj",
        originalPrice: amount,
        fiatCurrency: currency,
        name: "Payment for Order #123",
        customOrderId: "ORDER-123456",
        redirectUrl: "https://dashboard.kira-pay.com/settings",
        type: "single_use",
        isViewAsCrypto: false,
      }),
    });

    const data = await response.json();
    console.log(data);
    
     return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

}