import { Link } from 'react-router-dom';
import { formatCurrency, truncate, getImageFallback, getCategoryInfo } from '../utils';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, onOpenModal }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product, 1);
    showToast(`${truncate(product.name, 30)} adicionado ao carrinho!`, 'success');
  };

  const catInfo = getCategoryInfo(product.category);

  return (
    <div className="product-card" onClick={() => onOpenModal && onOpenModal(product)}>
      <div className="product-card-img-wrap">
        <img
          src={product.imageUrl || getImageFallback(product.name)}
          alt={product.name}
          onError={(e) => { e.target.src = getImageFallback(product.name); }}
        />
        {product.stock === 0 && <span className="badge-out">Esgotado</span>}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge-low">Últimas unidades</span>
        )}
      </div>
      <div className="product-card-body">
        <div className="product-card-cat">
          <span>{catInfo.icon}</span> {catInfo.label}
        </div>
        <h3 className="product-card-name">{truncate(product.name, 50)}</h3>
        <p className="product-card-desc">{truncate(product.description, 80)}</p>
        <div className="product-card-footer">
          <span className="product-price">{formatCurrency(product.price)}</span>
          <button
            className={`btn-add-cart ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Esgotado' : '+ Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}