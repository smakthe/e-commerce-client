import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

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
  const [error, setError] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading product details...</div>;
  if (error || !product) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error || 'Product not found'}</div>;

  return (
    <div className="container animate-enter" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
        &larr; Back to Products
      </Link>
      
      <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
        <div style={{ flex: '1 1 400px', background: 'rgba(255,255,255,0.02)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Placeholder for product image. Since no image URL in current schema, we use a beautiful gradient placeholder */}
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(100,50,255,0.1), rgba(255,50,150,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.5 }}>{product.name[0]}</span>
          </div>
        </div>
        
        <div style={{ flex: '1 1 400px', padding: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          <p className="text-gradient" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <div style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            {product.description || 'No description available for this cutting-edge product. Experience the future of commerce today.'}
          </div>
          
          <div style={{ marginBottom: '2rem', fontSize: '0.875rem', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}
          </div>

          <button 
            className="btn-primary" 
            style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
            disabled={product.stock <= 0}
            onClick={() => addToCart({
              productId: product.id,
              name: product.name,
              price: parseFloat(product.price),
              quantity: 1
            })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
