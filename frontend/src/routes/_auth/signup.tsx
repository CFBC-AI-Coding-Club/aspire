import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
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
import { z } from "zod";
import { authClient } from "@/lib/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

type SignupStep = "account-type" | "details";

type AccountType = "PARENT" | "CHILD";

function SignupPage() {
  const [step, setStep] = useState<SignupStep>("account-type");
  const [accountType, setAccountType] = useState<AccountType>("CHILD");
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
      role: AccountType;
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
        role: accountType,
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
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/aspire-logo.png"
            alt="Aspire - Achieving Success through Personal Investment, Resources and Education"
            className="h-14 w-auto"
          />
        </div>

        {/* Account Type Selection Step */}
        {step === "account-type" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">
                Create your account
              </h1>
              <p className="text-[#7a8aa3]">
                Choose your account type to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Parent Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect("PARENT")}
                className={clsx(
                  "relative p-8 rounded-2xl text-left transition-all duration-300",
                  "bg-white border-2 shadow-sm",
                  "hover:border-[#c22f99] hover:shadow-lg hover:shadow-[#c22f99]/10",
                  "hover:-translate-y-1",
                  "group",
                  "border-[#482977]/10",
                )}
              >
                <div
                  className={clsx(
                    "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                    "bg-gradient-to-br from-[#c22f99]/10 to-[#9a2579]/10",
                    "group-hover:from-[#c22f99] group-hover:to-[#9a2579]",
                    "transition-all duration-300",
                  )}
                >
                  <Users
                    className={clsx(
                      "w-8 h-8",
                      "text-[#c22f99] group-hover:text-white",
                      "transition-colors duration-300",
                    )}
                  />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                  Parent Account
                </h3>
                <p className="text-[#7a8aa3] text-sm leading-relaxed mb-4">
                  Monitor and guide your children's investment learning journey.
                  Set up child accounts and track progress.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#c22f99]/10 text-[#c22f99] text-xs font-medium">
                    Oversight
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#c22f99]/10 text-[#c22f99] text-xs font-medium">
                    Controls
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#c22f99]/10 text-[#c22f99] text-xs font-medium">
                    Reports
                  </span>
                </div>
                <div
                  className={clsx(
                    "absolute top-4 right-4 w-8 h-8 rounded-full",
                    "flex items-center justify-center",
                    "bg-[#c22f99]/0 group-hover:bg-[#c22f99]",
                    "transition-all duration-300",
                  )}
                >
                  <ArrowRight className="w-4 h-4 text-[#c22f99] group-hover:text-white transition-colors" />
                </div>
              </button>

              {/* Child Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect("CHILD")}
                className={clsx(
                  "relative p-8 rounded-2xl text-left transition-all duration-300",
                  "bg-white border-2 shadow-sm",
                  "hover:border-[#482977] hover:shadow-lg hover:shadow-[#482977]/10",
                  "hover:-translate-y-1",
                  "group",
                  "border-[#482977]/10",
                )}
              >
                <div
                  className={clsx(
                    "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                    "bg-gradient-to-br from-[#482977]/10 to-[#6b42a1]/10",
                    "group-hover:from-[#482977] group-hover:to-[#6b42a1]",
                    "transition-all duration-300",
                  )}
                >
                  <GraduationCap
                    className={clsx(
                      "w-8 h-8",
                      "text-[#482977] group-hover:text-white",
                      "transition-colors duration-300",
                    )}
                  />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                  Student Account
                </h3>
                <p className="text-[#7a8aa3] text-sm leading-relaxed mb-4">
                  Start your investing journey with virtual money. Learn through
                  games, guides, and real market simulations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#482977]/10 text-[#482977] text-xs font-medium">
                    Learn
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#482977]/10 text-[#482977] text-xs font-medium">
                    Trade
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#482977]/10 text-[#482977] text-xs font-medium">
                    Compete
                  </span>
                </div>
                <div
                  className={clsx(
                    "absolute top-4 right-4 w-8 h-8 rounded-full",
                    "flex items-center justify-center",
                    "bg-[#482977]/0 group-hover:bg-[#482977]",
                    "transition-all duration-300",
                  )}
                >
                  <ArrowRight className="w-4 h-4 text-[#482977] group-hover:text-white transition-colors" />
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[#7a8aa3]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#482977] font-semibold hover:text-[#6b42a1] transition-colors"
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
              className="flex items-center gap-2 text-[#7a8aa3] hover:text-[#1a1a2e] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to account type</span>
            </button>

            <div className="max-w-md mx-auto">
              <div
                className={clsx(
                  "p-1 rounded-2xl mb-8",
                  accountType === "PARENT"
                    ? "bg-gradient-to-r from-[#c22f99]/20 to-[#9a2579]/20"
                    : "bg-gradient-to-r from-[#482977]/20 to-[#6b42a1]/20",
                )}
              >
                <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br",
                      accountType === "PARENT"
                        ? "from-[#c22f99] to-[#9a2579]"
                        : "from-[#482977] to-[#6b42a1]",
                    )}
                  >
                    {accountType === "PARENT" ? (
                      <Users className="w-6 h-6 text-white" />
                    ) : (
                      <GraduationCap className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className={clsx(
                        "font-semibold",
                        accountType === "PARENT"
                          ? "text-[#c22f99]"
                          : "text-[#482977]",
                      )}
                    >
                      {accountType === "PARENT"
                        ? "Parent Account"
                        : "Student Account"}
                    </p>
                    <p className="text-sm text-[#7a8aa3]">
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
                        accent={
                          accountType === "PARENT" ? "secondary" : "primary"
                        }
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          key={error?.message}
                          className="text-[#dc2626] text-sm"
                        >
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
                        accent={
                          accountType === "PARENT" ? "secondary" : "primary"
                        }
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          key={error?.message}
                          className="text-[#dc2626] text-sm"
                        >
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
                            className="hover:text-[#482977] transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        }
                        accent={
                          accountType === "PARENT" ? "secondary" : "primary"
                        }
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          key={error?.message}
                          className="text-[#dc2626] text-sm"
                        >
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
                        accent={
                          accountType === "PARENT" ? "secondary" : "primary"
                        }
                        required
                      />
                      {field.state.meta.errors.map((error) => (
                        <p
                          key={error?.message}
                          className="text-[#dc2626] text-sm"
                        >
                          {error?.message}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>

                {error && (
                  <div className="p-4 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30">
                    <p className="text-[#dc2626] text-sm">{error}</p>
                  </div>
                )}

                <form.Subscribe>
                  {(state) => (
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      accent={
                        accountType === "PARENT" ? "secondary" : "primary"
                      }
                      isLoading={state.isSubmitting || isPending}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Create Account
                    </Button>
                  )}
                </form.Subscribe>
              </form>

              <p className="mt-6 text-xs text-[#a0aec4] text-center leading-relaxed">
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
