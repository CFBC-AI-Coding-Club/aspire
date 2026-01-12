import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let queryClientSingleton: QueryClient | undefined;

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});
}

export function getContext() {
	// Server: always make a new query client
	if (typeof window === "undefined") {
		return {
			queryClient: makeQueryClient(),
		};
	}

	// Browser: make a new query client if we don't already have one
	// This is very important, so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	if (!queryClientSingleton) {
		queryClientSingleton = makeQueryClient();
	}

	return {
		queryClient: queryClientSingleton,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
