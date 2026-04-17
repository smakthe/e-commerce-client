import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Input } from '@/components/ui/input';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
}

interface ExploreData {
  best_selling: Product[];
  most_expensive: Product[];
  maximum_revenue: Product[];
}

const Products = () => {
  const [exploreData, setExploreData] = useState<ExploreData | null>(null);
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (search.trim()) {
          const data = await api.get<Product[]>(`/products?search=${encodeURIComponent(search)}`);
          setSearchProducts(data);
        } else {
          // If no search, load the specialized explore arrays
          if (!exploreData) {
            const data = await api.get<ExploreData>('/products/explore');
            setExploreData(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [search, exploreData]);

  // Reusable horizontal scroll component
  const ProductCarousel = ({ title, description, products }: { title: string, description: string, products: Product[] }) => (
    <div className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 w-full hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {products.map(product => (
          <div key={product.id} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary font-serif">Explore Market</h1>
          <p className="text-muted-foreground mt-1">Discover premium, hand-selected goods.</p>
        </div>
        <Input 
          type="text" 
          placeholder="Search all products..." 
          className="max-w-xs h-12 rounded-full border-border/50 bg-secondary/20 shadow-inner px-6 focus-visible:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && !exploreData && searchProducts.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground animate-pulse">Loading curated collection...</div>
      ) : search.trim() ? (
        /* Standard Grid when searching */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6"><h2 className="text-xl font-medium">Search Results</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchProducts.length > 0 ? (
              searchProducts.map(product => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-16 text-muted-foreground bg-secondary/10 rounded-xl border border-border/50">
                No products found matching "{search}".
              </div>
            )}
          </div>
        </div>
      ) : exploreData ? (
        /* Real-world Categorized Explore view */
        <div className="animate-in fade-in duration-700">
           {exploreData.best_selling && exploreData.best_selling.length > 0 && (
             <ProductCarousel 
                title="Best Sellers" 
                description="Our highest volume community favorites."
                products={exploreData.best_selling} 
             />
           )}
           {exploreData.most_expensive && exploreData.most_expensive.length > 0 && (
             <ProductCarousel 
                title="The Premium Tier" 
                description="Uncompromising quality reserved for elite tier sourcing."
                products={exploreData.most_expensive} 
             />
           )}
           {exploreData.maximum_revenue && exploreData.maximum_revenue.length > 0 && (
             <ProductCarousel 
                title="Highest Grossing" 
                description="Powerhouse products moving substantial market volume."
                products={exploreData.maximum_revenue} 
             />
           )}
        </div>
      ) : null}
    </div>
  );
};

export default Products;
