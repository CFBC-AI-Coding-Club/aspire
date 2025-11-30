import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import type { Parent } from "../../data/dummyData";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newParent: Parent = {
      id: `p${Date.now()}`,
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    login(newParent);
    navigate({ to: "/parent/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F9F7] to-[#2EC4B6] bg-opacity-10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#2EC4B6] mb-2">🚀 Aspire</h1>
          <p className="text-[#1B262C] text-lg">
            Start your family's investment journey
          </p>
        </div>

        <Card className="shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
          <h2 className="text-3xl font-bold text-[#1B262C] mb-2">
            Create Account
          </h2>
          <p className="text-[#7D8B91] mb-6">Set up your parent account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#1B262C] font-medium mb-2">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Sarah Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div>
              <label className="block text-[#1B262C] font-medium mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-[#FFE8E6] border-2 border-[#FF6F61] rounded-xl p-3 text-[#FF6F61] text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#7D8B91]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#2EC4B6] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-[#E3F9F7] rounded-xl">
            <p className="text-xs text-[#7D8B91] leading-relaxed">
              By creating an account, you agree to help your children learn
              about financial literacy and responsible investing.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
