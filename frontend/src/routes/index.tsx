import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
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

	// Redirect based on auth state
	if (isAuthenticated) {
		return <Navigate to="/dashboard" />;
	}

	return <Navigate to="/login" />;
}
