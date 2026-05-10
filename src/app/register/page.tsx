import type { Metadata } from "next";

import { RegisterClient } from "./RegisterClient";

export const metadata: Metadata = {
  title: "Create your merchant account",
  description: "Register your business to start accepting crypto payments.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}