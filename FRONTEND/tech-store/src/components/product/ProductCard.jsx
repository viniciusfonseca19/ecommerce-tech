import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, getImageFallback, getCategoryInfo } from '../utils';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addItem(product);
      showToast(`${product.name} adicionado ao carrinho!`, 'success');
    } else {
      showToast('Produto esgotado!', 'error');
    }
  };

  const { icon, label } = getCategoryInfo(product.category);

  return (
    <Link to={`/product/${product.id}`} className="card">
      <div className="card-img-container">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="card-img"
          onError={(e) => e.target.src = getImageFallback(product.name)}
        />
        {product.stock === 0 && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px'
          }}>
            ESGOTADO
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-category">{icon} {label}</div>
        <h3 className="card-title">{product.name}</h3>
        <div className="card-price">{formatCurrency(product.price)}</div>
        <div className="card-actions">
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '8px' }}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            Adicionar +
          </button>
        </div>
      </div>
    </Link>
  );
}