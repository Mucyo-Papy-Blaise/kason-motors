import { Suspense } from "react";
import TestDriverBooking from "./TestDriverBooking";

function TestDriverFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-font">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );
}

export default function TestDriverPage() {
  return (
    <Suspense fallback={<TestDriverFallback />}>
      <TestDriverBooking />
    </Suspense>
  );
}
