import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: string; // usually strings in rails JSON based on decimal types
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
      quantity: 1
    });
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card glass-panel">
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
        <p className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      </div>
      <div className="product-actions">
        <button 
          className="btn-primary" 
          style={{ width: '100%' }}
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
