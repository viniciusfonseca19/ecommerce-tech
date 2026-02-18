import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductAPI } from '../services/api.js';
import { formatCurrency, getImageFallback, getCategoryInfo } from '../utils.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    ProductAPI.getById(id)
      .then(setProduct)
      .catch(() => {
        showToast('Produto não encontrado', 'error');
        navigate('/');
      });
  }, [id, navigate, showToast]);

  const handleAddToCart = () => {
    if (product && qty <= product.stock) {
      addItem(product, qty);
      showToast('Adicionado ao carrinho!', 'success');
    }
  };

  if (!product) return <div className="container main-content">Carregando...</div>;

  const categoryInfo = getCategoryInfo(product.category);

  return (
    <div className="container main-content">
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Voltar
      </button>

      <div className="product-detail">
        <div style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', overflow: 'hidden' }}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ maxWidth: '100%', maxHeight: '500px' }}
            onError={(e) => e.target.src = getImageFallback(product.name)}
          />
        </div>

        <div className="detail-info">
          <div style={{ color: 'var(--primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{categoryInfo.icon}</span>
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>{categoryInfo.label}</span>
          </div>
          
          <h1 style={{ fontSize: '3rem', lineHeight: '1.1' }}>{product.name}</h1>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '20px 0' }}>
            {product.description || 'Sem descrição disponível para este item tecnológico.'}
          </p>

          <div style={{ margin: '20px 0', fontSize: '1.1rem' }}>
            Disponibilidade: 
            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', marginLeft: '10px' }}>
              {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
            </span>
          </div>

          <div className="detail-price">{formatCurrency(product.price)}</div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <div className="qty-val">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>

              <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }} onClick={handleAddToCart}>
                Adicionar ao Carrinho
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}