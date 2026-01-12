import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth";
import { z } from "zod";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

type SignupStep = "account-type" | "details";

type AccountType = "parent" | "child";

function SignupPage() {
  const [step, setStep] = useState<SignupStep>("account-type");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep("details");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) =>
      await authClient.signUp.email(
        {
          ...data,
        },
        {
          onError: ({ error }) => {
            setError(error.message || "An error occurred while signing up.");
          },
          onSuccess: () => {
            navigate({ to: "/dashboard" });
          },
        },
      ),
  });

  const form = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    onSubmit: ({ value }) => {
      if (isPending) return;
      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      mutate({
        name: value.name,
        email: value.email,
        password: value.password,
      });
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z
          .string()
          .min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <span className="text-3xl font-bold text-white">Aspire</span>
        </div>

        {/* Account Type Selection Step */}
        {step === "account-type" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-3">
                Create your account
              </h1>
              <p className="text-[#6a6a6a]">
                Choose your account type to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Parent Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect("parent")}
                className={clsx(
                  "relative p-8 rounded-2xl text-left transition-all duration-300",
                  "bg-[#1a1a1a] border-2",
                  "hover:border-[#FBBF24] hover:shadow-lg hover:shadow-[#FBBF24]/10",
                  "hover:-translate-y-1",
                  "group",
                  "border-[#2a2a2a]",
                )}
              >
                <div
                  className={clsx(
                    "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                    "bg-linear-to-br from-[#FBBF24]/20 to-[#F59E0B]/20",
                    "group-hover:from-[#FBBF24] group-hover:to-[#F59E0B]",
                    "transition-all duration-300",
                  )}
                >
                  <Users
                    className={clsx(
                      "w-8 h-8",
                      "text-[#FBBF24] group-hover:text-white",
                      "transition-colors duration-300",
                    )}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Parent Account
                </h3>
                <p className="text-[#6a6a6a] text-sm leading-relaxed mb-4">
                  Monitor and guide your children's investment learning journey.
                  Set up child accounts and track progress.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-medium">
                    Oversight
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-medium">
                    Controls
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-xs font-medium">
                    Reports
                  </span>
                </div>
                <div
                  className={clsx(
                    "absolute top-4 right-4 w-8 h-8 rounded-full",
                    "flex items-center justify-center",
                    "bg-[#FBBF24]/0 group-hover:bg-[#FBBF24]",
                    "transition-all duration-300",
                  )}
                >
                  <ArrowRight className="w-4 h-4 text-[#FBBF24] group-hover:text-white transition-colors" />
                </div>
              </button>

              {/* Child Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect("child")}
                className={clsx(
                  "relative p-8 rounded-2xl text-left transition-all duration-300",
                  "bg-[#1a1a1a] border-2",
                  "hover:border-[#3B82F6] hover:shadow-lg hover:shadow-[#3B82F6]/10",
                  "hover:-translate-y-1",
                  "group",
                  "border-[#2a2a2a]",
                )}
              >
                <div
                  className={clsx(
                    "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                    "bg-linear-to-br from-[#3B82F6]/20 to-[#2563EB]/20",
                    "group-hover:from-[#3B82F6] group-hover:to-[#2563EB]",
                    "transition-all duration-300",
                  )}
                >
                  <GraduationCap
                    className={clsx(
                      "w-8 h-8",
                      "text-[#60A5FA] group-hover:text-white",
                      "transition-colors duration-300",
                    )}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Student Account
                </h3>
                <p className="text-[#6a6a6a] text-sm leading-relaxed mb-4">
                  Start your investing journey with virtual money. Learn through
                  games, guides, and real market simulations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#60A5FA] text-xs font-medium">
                    Learn
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#60A5FA] text-xs font-medium">
                    Trade
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#60A5FA] text-xs font-medium">
                    Compete
                  </span>
                </div>
                <div
                  className={clsx(
                    "absolute top-4 right-4 w-8 h-8 rounded-full",
                    "flex items-center justify-center",
                    "bg-[#3B82F6]/0 group-hover:bg-[#3B82F6]",
                    "transition-all duration-300",
                  )}
                >
                  <ArrowRight className="w-4 h-4 text-[#60A5FA] group-hover:text-white transition-colors" />
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[#6a6a6a]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#60A5FA] font-semibold hover:text-[#3B82F6] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Details Step */}
        {step === "details" && accountType && (
          <div className="animate-fade-in">
            <button
              type="button"
              onClick={() => setStep("account-type")}
              className="flex items-center gap-2 text-[#6a6a6a] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to account type</span>
            </button>

            <div className="max-w-md mx-auto">
              <div
                className={clsx(
                  "p-1 rounded-2xl mb-8",
                  accountType === "parent"
                    ? "bg-linear-to-r from-[#FBBF24]/30 to-[#F59E0B]/30"
                    : "bg-linear-to-r from-[#3B82F6]/30 to-[#2563EB]/30",
                )}
              >
                <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-linear-to-br",
                      accountType === "parent"
                        ? "from-[#FBBF24] to-[#F59E0B]"
                        : "from-[#3B82F6] to-[#2563EB]",
                    )}
                  >
                    {accountType === "parent" ? (
                      <Users className="w-6 h-6 text-white" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className={clsx(
                        "font-semibold",
                        accountType === "parent"
                          ? "text-[#FBBF24]"
                          : "text-[#60A5FA]",
                      )}
                    >
                      {accountType === "parent"
                        ? "Parent Account"
                        : "Student Account"}
                    </p>
                    <p className="text-sm text-[#6a6a6a]">
                      Complete your registration
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <form.Field name="name">
                  {(field) => (
                    <div className="space-y-1">
                      <Input
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        accent={accountType === "parent" ? "yellow" : "blue"}
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p key={error?.message} className="text-red-500">
                          {error?.message}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-1">
                      <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        accent={accountType === "parent" ? "yellow" : "blue"}
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p key={error?.message} className="text-red-500">
                          {error?.message}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-1">
                      <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 8 characters)"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        }
                        accent={accountType === "parent" ? "yellow" : "blue"}
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p key={error?.message} className="text-red-500">
                          {error?.message}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>

                <form.Field name="confirmPassword">
                  {(field) => (
                    <div className="space-y-1">
                      <Input
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        accent={accountType === "parent" ? "yellow" : "blue"}
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p key={error?.message} className="text-red-500">
                          {error?.message}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>

                {error && (
                  <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30">
                    <p className="text-[#EF4444] text-sm">{error}</p>
                  </div>
                )}

                <form.Subscribe>
                  {(state) => (
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      accent={accountType === "parent" ? "yellow" : "blue"}
                      isLoading={state.isSubmitting || isPending}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Create Account
                    </Button>
                  )}
                </form.Subscribe>
              </form>

              <p className="mt-6 text-xs text-[#4a4a4a] text-center leading-relaxed">
                By creating an account, you agree to help learn about financial
                literacy and responsible investing through simulation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
