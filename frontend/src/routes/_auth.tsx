import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	const { isAuthenticated, isLoading } = useAuth();

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

	// Redirect to dashboard if already authenticated
	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return <Outlet />;
}
