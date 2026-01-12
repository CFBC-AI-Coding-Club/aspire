import { createFileRoute } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  ArrowUpDown,
  Grid,
  List,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { SearchInput, Select } from "../../components/ui/Input";
import {
  useStocksQuery,
} from "../../hooks/queries/useStocksQuery";
import {
  
  sectors
} from "../../data/mockStocks";
import { Stock } from "@/types/market";
import { StockGridCard } from "@/components/market/StockGridCard";
import { StockListRow } from "@/components/market/StockListRow";
import { StockDetailModal } from "@/components/market/StockDetailModal";

export const Route = createFileRoute("/_app/market")({
  component: MarketPage,
});

type ViewMode = "grid" | "list";
type SortField = "symbol" | "price" | "change" | "volume";
type SortOrder = "asc" | "desc";

function MarketPage() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("change");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const { data: stocks, isLoading: isLoadingStocks } = useStocksQuery(true);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    if (!stocks) return [];
    let result = [...stocks];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.ticker.toLowerCase().includes(searchLower) ||
          s.name.toLowerCase().includes(searchLower),
      );
    }

    // Sector filter
    if (selectedSector !== "all") {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case "symbol":
          return sortOrder === "asc"
            ? a.ticker.localeCompare(b.ticker)
            : b.ticker.localeCompare(a.ticker);
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "change":
          aVal = a.price > 0 ? (a.change / a.price) * 100 : 0;
          bVal = b.price > 0 ? (b.change / b.price) * 100 : 0;
          break;
        case "volume":
          aVal = a.volume;
          bVal = b.volume;
          break;
        default:
          return 0;
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [stocks, search, selectedSector, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Market</h1>
        <p className="text-[#7a8aa3]">
          Browse and invest in {stocks?.length || 0} available stocks
        </p>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search stocks by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              options={[
                { value: "all", label: "All Sectors" },
                ...sectors.map((s) => ({ value: s, label: s })),
              ]}
              value={selectedSector}
              onChange={setSelectedSector}
            />

            <Select
              options={[
                { value: "change", label: "Sort by Change" },
                { value: "price", label: "Sort by Price" },
                { value: "volume", label: "Sort by Volume" },
                { value: "symbol", label: "Sort Alphabetically" },
              ]}
              value={sortField}
              onChange={(v) => setSortField(v as SortField)}
            />

            <div className="flex bg-[#f1f3f9] rounded-xl p-1 border border-[#482977]/10">
              <button
                onClick={() => setViewMode("grid")}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid"
                    ? "bg-[#482977] text-white"
                    : "text-[#7a8aa3] hover:text-[#1a1a2e]",
                )}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list"
                    ? "bg-[#482977] text-white"
                    : "text-[#7a8aa3] hover:text-[#1a1a2e]",
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-[#7a8aa3]">
        Showing {filteredStocks.length} of {stocks?.length || 0} stocks
      </p>

      {/* Stock Grid View */}
      {viewMode === "grid" && (
        <>
          {isLoadingStocks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="h-48 animate-pulse bg-[#f1f3f9]">
                  <></>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStocks.map((stock) => (
                <StockGridCard
                  key={stock.id}
                  stock={stock}
                  onClick={() => setSelectedStock(stock)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Stock List View */}
      {viewMode === "list" && (
        <>
          {isLoadingStocks ? (
            <Card className="h-96 animate-pulse bg-[#f1f3f9]">
              <></>
            </Card>
          ) : (
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#482977]/10">
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("symbol")}
                          className="flex items-center gap-1 text-[#7a8aa3] hover:text-[#1a1a2e]"
                        >
                          Stock
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("price")}
                          className="flex items-center gap-1 text-[#7a8aa3] hover:text-[#1a1a2e]"
                        >
                          Price
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">
                        <button
                          onClick={() => handleSort("change")}
                          className="flex items-center gap-1 text-[#7a8aa3] hover:text-[#1a1a2e]"
                        >
                          Change
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4 hidden md:table-cell">
                        Chart
                      </th>
                      <th className="text-left py-4 px-4 hidden lg:table-cell">
                        <button
                          onClick={() => handleSort("volume")}
                          className="flex items-center gap-1 text-[#7a8aa3] hover:text-[#1a1a2e]"
                        >
                          Volume
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </th>
                      <th className="text-left py-4 px-4">Sector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <StockListRow
                        key={stock.id}
                        stock={stock}
                        onClick={() => setSelectedStock(stock)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {filteredStocks.length === 0 && (
        <Card className="py-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">
            No stocks found
          </h3>
          <p className="text-[#7a8aa3]">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
