"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function TransactionsSection() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?page=${page}&limit=10`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();
        console.log("Fetched transactions:", transactions);

        setTransactions(transactions.data?.transactions ?? []);
        setTotalPages(transactions.data?.totalPages ?? 1);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [page]);

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">View all your payment transactions</p>
      </div>

      <Card className="p-4 md:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-xs md:text-sm">Transaction ID</TableHead>
                <TableHead className="text-xs md:text-sm">Amount</TableHead>
                <TableHead className="text-xs md:text-sm">Token</TableHead>
                <TableHead className="text-xs md:text-sm">Status</TableHead>
                <TableHead className="text-xs md:text-sm">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx: any) => (
                <TableRow key={tx._id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-mono text-xs md:text-sm text-cyan-400">
                    {tx._id}
                  </TableCell>
                  <TableCell className="font-medium text-xs md:text-sm">
                    {tx.tokenIn.amount}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 rounded-md bg-white/10 text-xs font-medium">
                      {tx.tokenIn.symbol}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                        tx.status === "Success"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs md:text-sm">
                    {new Date(tx.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-md border border-white/10 bg-white/5 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-md border border-white/10 bg-white/5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
