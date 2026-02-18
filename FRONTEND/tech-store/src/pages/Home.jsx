import { useState, useEffect, useRef } from 'react';
import { ProductAPI } from '../services/api';
import { CATEGORIES } from '../utils';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useToast } from '../context/ToastContext';

// Mock data for when API is not configured
const MOCK_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 14" M3', category: 'notebooks', price: 14999, stock: 8, description: 'O notebook mais poderoso da Apple com chip M3, tela Liquid Retina XDR e até 18h de bateria.', imageUrl: '' },
  { id: 2, name: 'Dell XPS 15', category: 'notebooks', price: 12499, stock: 3, description: 'Notebook premium com display OLED 3.5K, Intel Core i9 e GPU NVIDIA RTX 4060.', imageUrl: '' },
  { id: 3, name: 'LG UltraGear 27" 4K 144Hz', category: 'monitores', price: 3799, stock: 15, description: 'Monitor gaming IPS com resolução 4K, 144Hz, 1ms GTG e suporte a G-Sync/FreeSync.', imageUrl: '' },
  { id: 4, name: 'Samsung Odyssey G9 49"', category: 'monitores', price: 7299, stock: 2, description: 'Monitor ultrawide curvo 49" com resolução 5120x1440, 240Hz e HDR2000.', imageUrl: '' },
  { id: 5, name: 'Keychron Q1 Pro', category: 'teclados', price: 899, stock: 20, description: 'Teclado mecânico sem fio com switches Gateron Pro, alumínio anodizado e RGB.', imageUrl: '' },
  { id: 6, name: 'Logitech MX Keys S', category: 'teclados', price: 649, stock: 12, description: 'Teclado sem fio premium com retroiluminação adaptativa e digitação silenciosa.', imageUrl: '' },
  { id: 7, name: 'Logitech MX Master 3S', category: 'mouses', price: 499, stock: 25, description: 'Mouse ergonômico premium com rastreamento de 8000 DPI e rolagem MagSpeed.', imageUrl: '' },
  { id: 8, name: 'Razer DeathAdder V3', category: 'mouses', price: 349, stock: 18, description: 'Mouse gaming com sensor de 30000 DPI, design ergonômico e switches Razer Gen-3.', imageUrl: '' },
  { id: 9, name: 'Sony WH-1000XM5', category: 'headsets', price: 1899, stock: 7, description: 'Fone over-ear com cancelamento de ruído líder do setor e 30h de bateria.', imageUrl: '' },
  { id: 10, name: 'SteelSeries Arctis Nova Pro', category: 'headsets', price: 1499, stock: 4, description: 'Headset gaming com DAC externo, cancelamento de ruído ativo e hot-swap de bateria.', imageUrl: '' },
  { id: 11, name: 'Samsung 990 Pro 2TB', category: 'armazenamento', price: 1199, stock: 30, description: 'SSD NVMe PCIe 4.0 com velocidade de leitura de 7450 MB/s para produtividade máxima.', imageUrl: '' },
  { id: 12, name: 'Seagate Backup Plus 4TB', category: 'armazenamento', price: 449, stock: 0, description: 'HD externo portátil com 4TB de capacidade e conexão USB 3.0.', imageUrl: '' },
  { id: 13, name: 'Elgato Stream Deck MK.2', category: 'perifericos', price: 799, stock: 9, description: 'Controle para streams com 15 teclas LCD personalizáveis e software robusto.', imageUrl: '' },
  { id: 14, name: 'CalDigit TS4 Thunderbolt 4', category: 'perifericos', price: 2299, stock: 5, description: 'Dock com 18 portas, 98W de carregamento e suporte a dois monitores 4K.', imageUrl: '' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { showToast } = useToast();
  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 400);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (debouncedSearch) params.search = debouncedSearch;
        const data = await ProductAPI.getAll(params);
        setProducts(data);
      } catch {
        // Use mock data if API not configured
        let filtered = MOCK_PRODUCTS;
        if (category) filtered = filtered.filter(p => p.category === category);
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, debouncedSearch]);

  const allCategories = Object.entries(CATEGORIES);

  return (
    <div className="page-home">
      <div className="home-hero">
        <div className="hero-text">
          <h1>O Futuro da<br /><span className="gradient-text">Tecnologia</span></h1>
          <p>Os melhores produtos tech com entrega rápida e garantia de qualidade.</p>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="category-filters">
        <button
          className={`cat-btn ${category === '' ? 'active' : ''}`}
          onClick={() => setCategory('')}
        >
          📦 Todos
        </button>
        {allCategories.map(([key, info]) => (
          <button
            key={key}
            className={`cat-btn ${category === key ? 'active' : ''}`}
            onClick={() => setCategory(key)}
          >
            {info.icon} {info.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <span>🔍</span>
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onOpenModal={setSelectedProduct} />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}