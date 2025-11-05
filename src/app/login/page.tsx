import { LoginForm } from "@/components/auth/login-form";
import { PageHeader } from "@/components/shared/page-header";

export default function LoginPage() {
  return (
    <>
      <PageHeader
        title="Login to Your Account"
        subtitle="Access your saved prompts and continue creating."
      />
      <div className="container max-w-lg py-12">
        <LoginForm />
      </div>
    </>
  );
}