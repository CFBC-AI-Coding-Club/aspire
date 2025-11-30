import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { getParentByEmail } from "../../data/dummyData";
import { useAuth } from "../../contexts/AuthContext";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parent = getParentByEmail(email);

    if (!parent) {
      setError("Parent account not found");
      return;
    }

    if (parent.password !== password) {
      setError("Incorrect password");
      return;
    }

    login(parent);
    navigate({ to: "/parent/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F5FF] to-[#B8E6FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#2E8BC0] mb-2">🚀 Aspire</h1>
          <p className="text-[#1B262C] text-lg">
            Help your kids learn about investing
          </p>
        </div>

        <Card className="shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
          <h2 className="text-3xl font-bold text-[#1B262C] mb-2">
            Welcome Back!
          </h2>
          <p className="text-[#7D8B91] mb-6">Sign in to your parent account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1B262C] font-medium mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="parent@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[#1B262C] font-medium mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-[#FFE8E6] border-2 border-[#FF6F61] rounded-xl p-3 text-[#FF6F61] text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#7D8B91]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#2E8BC0] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-[#FFF4D6] rounded-xl">
            <p className="text-sm text-[#1B262C] font-medium mb-2">
              Demo Accounts:
            </p>
            <p className="text-xs text-[#7D8B91]">
              sarah.johnson@email.com / password123
            </p>
            <p className="text-xs text-[#7D8B91]">
              mike.chen@email.com / password123
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
