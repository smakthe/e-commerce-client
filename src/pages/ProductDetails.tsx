import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto py-16 text-center animate-pulse text-muted-foreground">
        Loading product details...
      </div>
    );
  if (error || !product)
    return (
      <div className="container mx-auto py-16 text-center text-destructive">
        {error || "Product not found"}
      </div>
    );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Link
        to="/products"
        className="inline-block mb-8 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        &larr; Back to Products
      </Link>

      <Card className="flex flex-col md:flex-row overflow-hidden border-border/50">
        <div className="flex-1 min-h-[300px] bg-secondary/50 flex items-center justify-center p-8">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
            <span className="text-6xl font-black text-primary/40 uppercase">
              {product.name[0]}
            </span>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-primary mb-6">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <div className="mb-8 text-muted-foreground leading-relaxed text-lg">
            {product.description ||
              "No description available for this cutting-edge product. Experience the future of commerce today."}
          </div>

          <div
            className={`mb-8 font-medium ${product.stock > 0 ? "text-primary" : "text-destructive"}`}
          >
            {product.stock > 0
              ? `${product.stock} units available`
              : "Currently out of stock"}
          </div>

          <Button
            size="lg"
            className="w-full md:w-auto h-12 px-8 text-lg"
            disabled={product.stock <= 0}
            onClick={() => {
              addToCart({
                productId: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: 1,
              });
              toast.success("Added to Cart", {
                description: `${product.name} has been added to your cart.`,
              });
            }}
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetails;
