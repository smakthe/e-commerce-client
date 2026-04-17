import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  description: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
    });

    toast.success("Added to Cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors">
      <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-2xl font-bold text-primary mb-2">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
