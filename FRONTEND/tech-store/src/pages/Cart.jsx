import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency, getImageFallback } from '../utils.js';
import { OrderAPI } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [orderModal, setOrderModal] = useState(null);

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: items.map(i => ({ productId: i.id, quantity: i.qty, price: i.price })),
        total: total,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      const response = await OrderAPI.create(orderData);
      // If API doesn't return ID (mock), generate one
      const orderId = response?.id || Math.floor(Math.random() * 10000);
      
      setOrderModal({ id: orderId, total });
      clearCart();
    } catch (error) {
      showToast('Erro ao finalizar pedido. Tente novamente.', 'error');
    }
  };

  return (
    <div className="container main-content">
      <h1>Carrinho de Compras</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed var(--border)', borderRadius: '8px' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Seu carrinho está vazio</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Explorar Produtos</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {items.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '15px', flexDirection: 'row', gap: '20px' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', background: '#000' }}
                  onError={(e) => e.target.src = getImageFallback(item.name)}
                />
                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unit: {formatCurrency(item.price)}</div>
                </div>
                
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
                  <div className="qty-val">{item.qty}</div>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                </div>

                <div style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'right' }}>
                  {formatCurrency(item.price * item.qty)}
                </div>

                <button className="btn btn-icon" onClick={() => removeItem(item.id)} style={{ color: 'var(--danger)' }}>
                  🗑
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="card" style={{ padding: '25px', position: 'sticky', top: '100px' }}>
              <h3>Resumo do Pedido</h3>
              <div style={{ margin: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '15px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Frete</span>
                  <span>Grátis</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {orderModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ color: 'var(--success)' }}>Pedido Realizado!</h2>
            <p style={{ margin: '15px 0', color: 'var(--text-muted)' }}>Obrigado por comprar na TechStore.</p>
            <div style={{ background: 'var(--bg-hover)', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
              <div style={{ marginBottom: '5px' }}>Pedido <strong>#{orderModal.id}</strong></div>
              <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>{formatCurrency(orderModal.total)}</div>
              <div style={{ marginTop: '5px', fontSize: '0.9rem', color: 'var(--warning)' }}>Status: Processando</div>
            </div>
            <button className="btn btn-primary" onClick={() => setOrderModal(null)}>Continuar Comprando</button>
          </div>
        </div>
      )}
    </div>
  );
}