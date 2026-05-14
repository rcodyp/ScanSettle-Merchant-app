import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    console.log("hi");
    const api = process.env.KIRAPAY_API_KEY ?? ` `;
    const url = new URL(request.url);
    const receiver = url.searchParams.get("receiver") || null;

    if (!api) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    // Current date
    const toDate = new Date();

    // 7 days back
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const paramsObj = {
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
      period: "day",
    };

    if (receiver) paramsObj.receiver = receiver;

    const params = new URLSearchParams(paramsObj);

    const response = await fetch(
      `https://api.kira-pay.com/api/wallet/chart/date-range?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-api-key": api,
        },
      }
    );

    const data = await response.json();

    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}