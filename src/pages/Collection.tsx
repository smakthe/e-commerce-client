import { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft } from "lucide-react";

const ProductCard = lazy(() => import("../components/ProductCard"));

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
}

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

const Collection = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
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
    [loading, isFetchingMore, hasMore]
  );

  useEffect(() => {
    // Reset state when collection ID changes
    setProducts([]);
    setPage(0);
    setHasMore(true);
    // Scroll to the top of the page instantly when navigating to a new collection
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    const loadCollectionData = async () => {
      if (page === 0) setLoading(true);
      else setIsFetchingMore(true);

      try {
        const offset = page * 24;
        const data = await api.get<Product[]>(
          `/products?collection=${id}&limit=24&offset=${offset}`
        );

        setHasMore(data.length === 24);

        setProducts((prev) => {
          if (page === 0) return data;
          const newIds = new Set(data.map(d => d.id));
          const filteredPrev = prev.filter(p => !newIds.has(p.id));
          return [...filteredPrev, ...data];
        });
      } catch (error) {
        console.error("Collection load failed", error);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };

    loadCollectionData();
  }, [id, page]);

  const getTitle = () => {
    switch (id) {
      case 'best_selling': return "Best Sellers";
      case 'maximum_revenue': return "Highest Grossing";
      case 'newest_arrivals': return "Newest Arrivals";
      default: return "Collection";
    }
  };

  const getDescription = () => {
    switch (id) {
      case 'best_selling': return "Our highest volume community favorites.";
      case 'maximum_revenue': return "Powerhouse products moving substantial market volume.";
      case 'newest_arrivals': return "Fresh drops and the latest additions to our catalog.";
      default: return "Explore our curated collection.";
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-screen">
      <div className="mb-10">
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary font-serif">
          {getTitle()}
        </h1>
        <p className="text-muted-foreground mt-2">
          {getDescription()}
        </p>
      </div>

      {loading && page === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => {
                if (products.length === index + 1) {
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
                No products found in this collection.
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
      )}
    </div>
  );
};

export default Collection;
