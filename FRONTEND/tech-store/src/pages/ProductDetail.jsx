import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductAPI } from '../services/api';
import { formatCurrency, getCategoryInfo, getImageFallback } from '../utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    ProductAPI.getById(id)
      .then(setProduct)
      .catch(() => showToast('Produto não encontrado.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addItem(product, qty);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!product) return (
    <div className="empty-state">
      <span>😕</span>
      <p>Produto não encontrado.</p>
      <button className="btn-primary" onClick={() => navigate('/')}>Voltar</button>
    </div>
  );

  const catInfo = getCategoryInfo(product.category);

  return (
    <div className="page-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Voltar</button>
      <div className="detail-layout">
        <div className="detail-img-wrap">
          <img
            src={product.imageUrl || getImageFallback(product.name)}
            alt={product.name}
            onError={(e) => { e.target.src = getImageFallback(product.name); }}
          />
        </div>
        <div className="detail-info">
          <div className="product-card-cat">{catInfo.icon} {catInfo.label}</div>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-desc">{product.description}</p>
          <div className="detail-price">{formatCurrency(product.price)}</div>
          <div className="detail-stock">
            {product.stock === 0
              ? <span className="stock-out">Produto esgotado</span>
              : <span className="stock-ok">✓ {product.stock} unidades disponíveis</span>
            }
          </div>
          {product.stock > 0 && (
            <>
              <div className="detail-qty-label">Quantidade:</div>
              <div className="modal-qty-row">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn-primary btn-large" onClick={handleAdd}>
                🛒 Adicionar ao Carrinho — {formatCurrency(product.price * qty)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}