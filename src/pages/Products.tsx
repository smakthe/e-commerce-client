import {
  useEffect,
  useState,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../services/api";
import { Input } from "@/components/ui/input";

// Power-user Optimization: Lazy load the heavy product card UI
const ProductCard = lazy(() => import("../components/ProductCard"));

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
}

interface ExploreData {
  newest_arrivals: Product[];
  best_selling: Product[];
  maximum_revenue: Product[];
}

// Sophisticated loading skeleton mirroring actual card dimensions
const ProductSkeleton = () => (
  <div className="h-[380px] bg-secondary/10 animate-pulse rounded-xl w-full border border-border/30 flex flex-col shadow-sm">
    <div className="h-48 bg-secondary/20 rounded-t-xl" />
    <div className="p-4 flex flex-col gap-4 flex-1">
      <div className="h-6 bg-secondary/30 rounded w-3/4" />
      <div className="h-4 bg-secondary/20 rounded w-1/2" />
      <div className="mt-auto h-10 bg-primary/10 rounded-full w-full" />
    </div>
  </div>
);

const Products = () => {
  const [exploreData, setExploreData] = useState<ExploreData | null>(null);
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Advanced Infinite Scroll State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Intersection Observer for Infinite Scroll trigger
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasMore],
  );

  // Handle generalized explore page metrics fetching
  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const data = await api.get<ExploreData>("/products/explore");
        setExploreData(data);
      } catch (error) {
        console.error("Failed to fetch explore data", error);
      } finally {
        if (!search.trim()) setLoading(false);
      }
    };
    if (!exploreData) fetchExploreData();
  }, [exploreData, search]);

  // Execute Elasticsearch queries with debounce and pagination offsets
  useEffect(() => {
    if (!search.trim()) {
      setSearchProducts([]);
      setPage(0);
      setHasMore(true);
      if (exploreData) setLoading(false);
      return;
    }

    const loadSearchData = async () => {
      if (page === 0) setLoading(true);
      else setIsFetchingMore(true);

      try {
        // Paginating precisely by 24 matching backend optimizations
        const offset = page * 24;
        const data = await api.get<Product[]>(
          `/products?search=${encodeURIComponent(search)}&limit=24&offset=${offset}`,
        );

        // Calculate if we reached the end of the cluster pipeline
        setHasMore(data.length === 24);

        setSearchProducts((prev) => {
          if (page === 0) return data;
          // Filter duplicates just in case fast scrolling overlaps network yields
          const newIds = new Set(data.map((d) => d.id));
          const filteredPrev = prev.filter((p) => !newIds.has(p.id));
          return [...filteredPrev, ...data];
        });
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    if (page === 0) {
      // Debounce the first keystrokes
      const timeout = setTimeout(loadSearchData, 300);
      return () => clearTimeout(timeout);
    } else {
      // Instant execution when scrolling down
      loadSearchData();
    }
  }, [search, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
    setHasMore(true);
  };

  const ProductCarousel = ({
    title,
    description,
    products,
    collectionKey,
  }: {
    title: string;
    description: string;
    products: Product[];
    collectionKey: string;
  }) => (
    <div className="mb-16 group relative">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="relative">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 w-full hide-scrollbar pr-32"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[280px] sm:w-[320px]"
            >
              <Suspense fallback={<ProductSkeleton />}>
                <ProductCard product={product} />
              </Suspense>
            </div>
          ))}
        </div>

        {/* Floating Explore More Button visible only on mouse hover */}
        <div className="absolute right-0 top-0 bottom-6 w-48 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none pr-4">
          <Link
            to={`/collections/${collectionKey}`}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-full shadow-xl hover:scale-105 hover:bg-primary/90 transition-all transform translate-x-4 group-hover:translate-x-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary font-serif">
            Explore Marketplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover premium, hand-selected goods.
          </p>
        </div>
        <Input
          type="text"
          placeholder="Search all products..."
          className="max-w-xs h-12 rounded-full border-border/50 bg-secondary/20 shadow-inner px-6 focus-visible:ring-primary"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {loading && page === 0 && search.trim() ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
            Curating premium selection...
          </p>
        </div>
      ) : search.trim() ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h2 className="text-xl font-medium">Search Results</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchProducts.length > 0 ? (
              searchProducts.map((product, index) => {
                if (searchProducts.length === index + 1) {
                  return (
                    <div ref={lastProductRef} key={product.id}>
                      <Suspense fallback={<ProductSkeleton />}>
                        <ProductCard product={product} />
                      </Suspense>
                    </div>
                  );
                } else {
                  return (
                    <div key={product.id}>
                      <Suspense fallback={<ProductSkeleton />}>
                        <ProductCard product={product} />
                      </Suspense>
                    </div>
                  );
                }
              })
            ) : (
              <div className="col-span-full text-center py-16 text-muted-foreground bg-secondary/10 rounded-xl border border-border/50">
                No products found matching "{search}".
              </div>
            )}

            {/* Seamless loading skeletons for the next infinite scroll batch */}
            {isFetchingMore && (
              <>
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
              </>
            )}
          </div>
        </div>
      ) : exploreData ? (
        <div className="animate-in fade-in duration-700">
          {exploreData.newest_arrivals?.length > 0 && (
            <ProductCarousel
              title="Newest Arrivals"
              description="Fresh drops and the latest additions to our catalog."
              products={exploreData.newest_arrivals}
              collectionKey="newest_arrivals"
            />
          )}
          {exploreData.best_selling?.length > 0 && (
            <ProductCarousel
              title="Best Sellers"
              description="Our highest volume community favorites."
              products={exploreData.best_selling}
              collectionKey="best_selling"
            />
          )}
          {exploreData.maximum_revenue?.length > 0 && (
            <ProductCarousel
              title="Highest Grossing"
              description="Powerhouse products moving substantial market volume."
              products={exploreData.maximum_revenue}
              collectionKey="maximum_revenue"
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
            Loading explore dashboard...
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
