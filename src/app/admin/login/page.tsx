import { isConfigured } from "@/lib/adminAuth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <LoginForm configured={isConfigured()} />;
}
