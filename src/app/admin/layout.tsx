import { redirect } from "next/navigation";
import { getSession, requireAdmin } from "@/lib/authGuard";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/admin");

  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-outbreak-bg">{children}</div>
    </div>
  );
}
