import { Suspense } from "react";
import LoginPage from "@/components/auth/Login";

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
