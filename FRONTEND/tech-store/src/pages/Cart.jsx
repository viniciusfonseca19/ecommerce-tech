import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, getImageFallback } from '../utils';
import { OrderAPI } from '../services/api';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total, count } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total,
      };
      const result = await OrderAPI.create(payload);
      clearCart();
      setOrderResult(result || { id: `ORD-${Date.now()}`, total, status: 'confirmed' });
    } catch {
      // Demo mode
      const fakeOrder = { id: `ORD-${Date.now()}`, total, status: 'confirmed' };
      clearCart();
      setOrderResult(fakeOrder);
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="modal-backdrop" style={{ position: 'fixed', zIndex: 9999 }}>
        <div className="modal-box order-success-modal">
          <div className="order-success-icon">✓</div>
          <h2>Pedido Confirmado!</h2>
          <p>Seu pedido foi realizado com sucesso.</p>
          <div className="order-details">
            <div><span>Pedido:</span> <strong>#{String(orderResult.id)}</strong></div>
            <div><span>Total:</span> <strong>{formatCurrency(orderResult.total || total)}</strong></div>
            <div><span>Status:</span> <strong className="stock-ok">{orderResult.status || 'Confirmado'}</strong></div>
          </div>
          <Link to="/" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem' }}>
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-cart">
        <h1 className="page-title">Carrinho</h1>
        <div className="empty-state">
          <span>🛒</span>
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="btn-primary">Ver Produtos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-cart">
      <h1 className="page-title">Carrinho <span className="count-badge">{count}</span></h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                <img
                  src={item.imageUrl || getImageFallback(item.name)}
                  alt={item.name}
                  onError={(e) => { e.target.src = getImageFallback(item.name); }}
                />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{formatCurrency(item.price)} / un.</div>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-subtotal">{formatCurrency(item.price * item.quantity)}</div>
              <button className="btn-remove" onClick={() => removeItem(item.id)} title="Remover">✕</button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Resumo do Pedido</h2>
          <div className="summary-row"><span>Subtotal ({count} itens)</span><span>{formatCurrency(total)}</span></div>
          <div className="summary-row"><span>Frete</span><span className="stock-ok">Grátis</span></div>
          <div className="summary-divider" />
          <div className="summary-row summary-total"><span>Total</span><span>{formatCurrency(total)}</span></div>
          <button className="btn-primary btn-large" onClick={handleFinalize} disabled={loading}>
            {loading ? 'Processando...' : 'Finalizar Pedido →'}
          </button>
        </div>
      </div>
    </div>
  );
}