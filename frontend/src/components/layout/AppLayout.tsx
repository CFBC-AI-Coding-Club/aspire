import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AIAssistant } from "../features/AIAssistant";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/login" });
		}
	}, [isAuthenticated, isLoading, navigate]);

	// Close mobile menu when route changes
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-[var(--color-base-900)] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<img 
						src="/aspire-logo.png" 
						alt="Aspire" 
						className="h-12 w-auto mb-4 animate-pulse"
					/>
					<div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
				</div>
			</div>
		);
	}

	// Don't render if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[var(--color-base-900)]">
			{/* Mobile Menu Overlay */}
			{mobileMenuOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setMobileMenuOpen(false)}
					aria-label="Close menu"
				/>
			)}

			{/* Sidebar */}
			<Sidebar
				isCollapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				mobileMenuOpen={mobileMenuOpen}
				setMobileMenuOpen={setMobileMenuOpen}
			/>

			{/* Main Content */}
			<main
				className={clsx(
					"min-h-screen transition-all duration-300",
					"lg:ml-[280px]",
					sidebarCollapsed && "lg:ml-[72px]",
				)}
			>
				{/* Mobile Menu Button */}
				<button
					type="button"
					onClick={() => setMobileMenuOpen(true)}
					className={clsx(
						"fixed top-4 left-4 z-30 lg:hidden",
						"p-2 rounded-xl bg-[var(--color-base-800)] border border-[var(--color-border)]",
						"text-[var(--color-text-primary)] hover:bg-[var(--color-base-700)]",
						"transition-colors duration-200",
					)}
					aria-label="Open menu"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Menu</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>

				{/* Page Content */}
				<div className="p-6 lg:p-8 pt-20 lg:pt-6">
					<Outlet />
				</div>
			</main>

			{/* AI Assistant Widget */}
			<AIAssistant />
		</div>
	);
}
