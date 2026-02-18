import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { ProductAPI } from '../services/api.js';
import { CATEGORIES } from '../utils.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = {};
      if (search) params.name_like = search;
      if (category) params.category = category;
      
      const data = await ProductAPI.getAll(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      // Fallback for demo if API fails
      if (products.length === 0 && !search && !category) {
         // Optional: You could showToast('Erro ao carregar produtos', 'error');
         // But for a pure frontend request without a backend running, 
         // we might just leave it empty or show a message.
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>TECH STORE <span style={{ color: '#fff' }}>GEAR</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Equipamento de alta performance para o seu setup.</p>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
        <div className="input-group" style={{ maxWidth: '600px' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Buscar produto..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: '30px', paddingLeft: '40px' }}
          />
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            🔍
          </span>
        </div>
      </div>

      <div className="filters" style={{ justifyContent: 'center' }}>
        <button 
          className={`filter-btn ${category === '' ? 'active' : ''}`} 
          onClick={() => setCategory('')}
        >
          Todos
        </button>
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <button 
            key={key} 
            className={`filter-btn ${category === key ? 'active' : ''}`}
            onClick={() => setCategory(key)}
          >
            {val.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--primary)' }}>Carregando sistema...</div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
              <h3>Nenhum produto encontrado.</h3>
              <p>Verifique a conexão com a API ou seus filtros.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}