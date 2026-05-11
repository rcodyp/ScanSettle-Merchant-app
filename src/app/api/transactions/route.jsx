import { NextResponse } from "next/server";

export async function GET(request) {
  const api = process.env.KIRAPAY_API_KEY;
  const url = new URL(request.url);

  console.log("Received request for transactions with URL:", url.href);
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";

  if (!api) {
    return NextResponse.json({ error: "KIRAPAY_API_KEY is missing" }, { status: 500 });
  }
  try {
    const response = await fetch(
      `https://api.kira-pay.com/api/wallet/transactions?page=${page}&limit=${limit}`,
      {
        headers: {
          "x-api-key": api,
        },
      },
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      console.error("Failed to fetch transactions:", response.statusText);
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Error fetching transactions" }, { status: 500 });
  }
}
