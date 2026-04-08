import { Suspense } from "react";
import { CarListingPage } from "@/components/landingPage/inventory/Carlistingpage";

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-bg">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-center px-6 py-20">
            <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        </main>
      }
    >
      <CarListingPage />
    </Suspense>
  );
}
