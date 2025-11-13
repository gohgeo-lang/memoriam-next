"use client";
import { Suspense } from "react";

import EstimatePageContent from "./components/EstimatePageContent";

export default function EstimatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EstimatePageContent />
    </Suspense>
  );
}
