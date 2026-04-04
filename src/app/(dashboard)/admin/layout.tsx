import { requireAdminUser } from "@/lib/auth/session";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminTopbar from "@/components/dashboard/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await requireAdminUser();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar fullName={currentUser.fullName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar
          fullName={currentUser.fullName}
          roleLabel={currentUser.role === "admin" ? "Administrator" : "User"}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
