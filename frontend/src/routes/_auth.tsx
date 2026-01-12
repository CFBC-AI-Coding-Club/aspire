import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	const { isAuthenticated, isLoading } = useAuth();

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

	// Redirect to dashboard if already authenticated
	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return <Outlet />;
}
