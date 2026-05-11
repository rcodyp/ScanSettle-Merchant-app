import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const currency = String(body.currency);
    const receiver = String(body.receiver || "").trim();
    const label = String(body.label || "").trim();
    const api = process.env.KIRAPAY_API_KEY;

    if (!receiver) {
      return NextResponse.json({ error: "Receiver wallet address is required" }, { status: 400 });
    }

    const response = await fetch("https://api.kira-pay.com/api/link/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(api ? { "x-api-key": api } : {}),
      },
      body: JSON.stringify({
        tokenOut: {
          chainId: "sol",
        },
        receiver: receiver,
        originalPrice: amount,
        fiatCurrency: currency,
        name: label || "Payment for Order",
        customOrderId: `ORDER-${Date.now()}`,
        redirectUrl: "https://dashboard.kira-pay.com/settings",
        type: "single_use",
        isViewAsCrypto: false,
      }),
    });

    const data = await response.json();
    
     return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

}