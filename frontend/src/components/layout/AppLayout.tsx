import { Outlet, useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { AIAssistant } from "../features/AIAssistant";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
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
	}, []);

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
					<p className="text-[#6a6a6a]">Loading...</p>
				</div>
			</div>
		);
	}

	// Don't render if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-[#0a0a0a]">
			{/* Mobile Menu Overlay */}
			{mobileMenuOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
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
						"p-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]",
						"text-white hover:bg-[#2a2a2a]",
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
