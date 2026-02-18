import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getCategoryInfo, getImageFallback } from '../utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const catInfo = getCategoryInfo(product.category);

  const handleAdd = () => {
    addItem(product, qty);
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
    onClose();
  };

  const handleViewDetail = () => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-product-layout">
          <div className="modal-product-img">
            <img
              src={product.imageUrl || getImageFallback(product.name)}
              alt={product.name}
              onError={(e) => { e.target.src = getImageFallback(product.name); }}
            />
          </div>
          <div className="modal-product-info">
            <div className="product-card-cat">{catInfo.icon} {catInfo.label}</div>
            <h2 className="modal-product-name">{product.name}</h2>
            <p className="modal-product-desc">{product.description}</p>
            <div className="modal-price">{formatCurrency(product.price)}</div>
            <div className="modal-stock">
              {product.stock === 0
                ? <span className="stock-out">Esgotado</span>
                : <span className="stock-ok">Em estoque: {product.stock} unidades</span>
              }
            </div>
            {product.stock > 0 && (
              <div className="modal-qty-row">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAdd} disabled={product.stock === 0}>
                Adicionar ao Carrinho
              </button>
              <button className="btn-secondary" onClick={handleViewDetail}>
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}