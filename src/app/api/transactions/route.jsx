import { NextResponse } from "next/server";

export async function GET(request) {
  const api = process.env.KIRAPAY_API_KEY;
  const url = new URL(request.url);

  console.log("Received request for transactions with URL:", url.href);
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";
  const receiver = url.searchParams.get("receiver") || null;

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
    // If a receiver query param was provided, try to filter returned records
    if (receiver) {
      // Find the first array in the response to filter (robust for different API shapes)
      let arrayKey = Object.keys(data).find((k) => Array.isArray(data[k]));
      let arr = arrayKey ? data[arrayKey] : Array.isArray(data) ? data : [];

      const normalizedReceiver = receiver.trim().toLowerCase();

      const filtered = (arr || []).filter((tx) => {
        if (!tx || typeof tx !== "object") return false;
        const values = Object.values(tx).map((v) => (typeof v === "string" ? v.toLowerCase() : v));
        // look for common receiver/order fields
        const matchesReceiver = values.some((v) => typeof v === "string" && v.includes(normalizedReceiver));
        const orderId = (tx.customOrderId || tx.orderId || tx.reference || tx.id || "") + "";
        const matchesOrder = orderId.toLowerCase().includes(normalizedReceiver);
        return matchesReceiver || matchesOrder;
      });

      // Reconstruct a response similar to the original shape
      if (arrayKey) {
        const newData = { ...data, [arrayKey]: filtered };
        return NextResponse.json(newData);
      }

      return NextResponse.json(filtered);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Error fetching transactions" }, { status: 500 });
  }
}
