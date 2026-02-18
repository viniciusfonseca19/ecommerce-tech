import { useState, useEffect } from 'react';
import { ProductAPI } from '../services/api';
import { formatCurrency, getCategoryInfo, getImageFallback, CATEGORIES } from '../utils';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = { name: '', price: '', stock: '', category: 'notebooks', description: '', imageUrl: '' };

const MOCK_PRODUCTS = [
  { id: 1, name: 'MacBook Pro 14" M3', category: 'notebooks', price: 14999, stock: 8, description: 'Notebook Apple com chip M3.', imageUrl: '' },
  { id: 2, name: 'Dell XPS 15', category: 'notebooks', price: 12499, stock: 3, description: 'Notebook premium Intel i9.', imageUrl: '' },
  { id: 3, name: 'LG UltraGear 27" 4K', category: 'monitores', price: 3799, stock: 15, description: 'Monitor IPS 4K 144Hz.', imageUrl: '' },
  { id: 4, name: 'Samsung Odyssey G9', category: 'monitores', price: 7299, stock: 2, description: 'Monitor ultrawide 49" 240Hz.', imageUrl: '' },
  { id: 5, name: 'Keychron Q1 Pro', category: 'teclados', price: 899, stock: 20, description: 'Teclado mecânico sem fio.', imageUrl: '' },
  { id: 6, name: 'Logitech MX Master 3S', category: 'mouses', price: 499, stock: 25, description: 'Mouse ergonômico premium.', imageUrl: '' },
  { id: 7, name: 'Sony WH-1000XM5', category: 'headsets', price: 1899, stock: 0, description: 'Fone com noise cancelling.', imageUrl: '' },
  { id: 8, name: 'Samsung 990 Pro 2TB', category: 'armazenamento', price: 1199, stock: 30, description: 'SSD NVMe PCIe 4.0.', imageUrl: '' },
];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await ProductAPI.getAll();
      setProducts(data);
    } catch {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, description: p.description, imageUrl: p.imageUrl || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return showToast('Preencha os campos obrigatórios.', 'warning');
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
      if (editProduct) {
        await ProductAPI.update(editProduct.id, payload);
        showToast('Produto atualizado!', 'success');
      } else {
        await ProductAPI.create(payload);
        showToast('Produto criado!', 'success');
      }
      setShowModal(false);
      load();
    } catch {
      // Demo mode
      if (editProduct) {
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 } : p));
        showToast('Produto atualizado! (demo)', 'success');
      } else {
        const newP = { ...form, id: Date.now(), price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
        setProducts(prev => [...prev, newP]);
        showToast('Produto criado! (demo)', 'success');
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ProductAPI.delete(deleteTarget.id);
      showToast('Produto deletado!', 'success');
    } catch {
      showToast('Produto removido! (demo)', 'success');
    }
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    categories: new Set(products.map(p => p.category)).size,
  };

  return (
    <div className="page-admin">
      <div className="admin-header">
        <h1 className="page-title">Painel Admin</h1>
        <button className="btn-primary" onClick={openCreate}>+ Novo Produto</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total de Produtos</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✓</span>
          <div className="stat-value stat-green">{stats.inStock}</div>
          <div className="stat-label">Em Estoque</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✕</span>
          <div className="stat-value stat-red">{stats.outOfStock}</div>
          <div className="stat-label">Esgotados</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏷️</span>
          <div className="stat-value stat-cyan">{stats.categories}</div>
          <div className="stat-label">Categorias</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const cat = getCategoryInfo(p.category);
              return (
                <tr key={p.id}>
                  <td>
                    <img
                      className="table-thumb"
                      src={p.imageUrl || getImageFallback(p.name)}
                      alt={p.name}
                      onError={(e) => { e.target.src = getImageFallback(p.name); }}
                    />
                  </td>
                  <td className="table-name">{p.name}</td>
                  <td><span className="cat-pill">{cat.icon} {cat.label}</span></td>
                  <td className="table-price">{formatCurrency(p.price)}</td>
                  <td>
                    <span className={p.stock === 0 ? 'stock-out' : 'stock-ok'}>{p.stock}</span>
                  </td>
                  <td className="table-actions">
                    <button className="btn-edit" onClick={() => openEdit(p)}>✏️ Editar</button>
                    <button className="btn-delete" onClick={() => setDeleteTarget(p)}>🗑️ Deletar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box modal-form" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2>{editProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            <div className="form-grid">
              <div className="form-group form-span-2">
                <label>Nome *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do produto" />
              </div>
              <div className="form-group">
                <label>Preço *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Estoque</label>
                <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
              </div>
              <div className="form-group form-span-2">
                <label>Categoria</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {Object.entries(CATEGORIES).map(([key, info]) => (
                    <option key={key} value={key}>{info.icon} {info.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group form-span-2">
                <label>URL da Imagem</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="form-group form-span-2">
                <label>Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Descrição do produto..." />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : editProduct ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box modal-confirm" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja deletar <strong>{deleteTarget.name}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDelete}>Sim, deletar</button>
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}