import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../contexts/AuthContext";

export const Route = createFileRoute("/_auth/login")({
	component: LoginPage,
});

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		const result = await login(email, password);

		if (result.success) {
			navigate({ to: "/dashboard" });
		} else {
			setError(result.error || "Login failed");
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-[#f8f9fc] flex">
			{/* Left Side - Decorative */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#482977] to-[#6b42a1]">
				{/* Animated Orbs */}
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c22f99]/20 rounded-full blur-3xl animate-pulse delay-1000" />

				{/* Content */}
				<div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
					<div className="mb-8">
						<img 
							src="/aspire-logo.png" 
							alt="Aspire - Achieving Success through Personal Investment, Resources and Education" 
							className="h-16 w-auto brightness-0 invert"
						/>
					</div>

					<h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
						Learn to invest.
						<br />
						<span className="text-white/80">Build your future.</span>
					</h1>

					<p className="text-xl text-white/70 max-w-lg">
						Join thousands of young investors learning to grow their wealth
						through interactive simulations and games.
					</p>

					{/* Stats */}
					<div className="flex gap-12 mt-12">
						<div>
							<p className="text-4xl font-bold text-white">50K+</p>
							<p className="text-white/60">Active Learners</p>
						</div>
						<div>
							<p className="text-4xl font-bold text-white">$2M+</p>
							<p className="text-white/60">Virtual Traded</p>
						</div>
						<div>
							<p className="text-4xl font-bold text-white">4.9★</p>
							<p className="text-white/60">User Rating</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
				<div className="w-full max-w-md">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center justify-center mb-8">
						<img 
							src="/aspire-logo.png" 
							alt="Aspire - Achieving Success through Personal Investment, Resources and Education" 
							className="h-12 w-auto"
						/>
					</div>

					<div className="text-center lg:text-left mb-8">
						<h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Welcome back</h2>
						<p className="text-[#7a8aa3]">
							Sign in to continue your investing journey
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<Input
							label="Email"
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							leftIcon={<Mail className="w-5 h-5" />}
							required
						/>

						<Input
							label="Password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							leftIcon={<Lock className="w-5 h-5" />}
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
							required
						/>

						{error && (
							<div className="p-4 rounded-xl bg-[#dc2626]/10 border border-[#dc2626]/30">
								<p className="text-[#dc2626] text-sm">{error}</p>
							</div>
						)}

						<Button
							type="submit"
							fullWidth
							size="lg"
							isLoading={isLoading}
							rightIcon={<ArrowRight className="w-5 h-5" />}
						>
							Sign In
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-[#7a8aa3]">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-[#482977] font-semibold hover:text-[#6b42a1] transition-colors"
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
