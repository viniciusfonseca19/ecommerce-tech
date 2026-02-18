import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils';

export default function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'peripherals',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="input-group">
            <input 
              name="name" 
              className="input-field" 
              placeholder="Nome do Produto" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input 
              name="price" 
              type="number" 
              className="input-field" 
              placeholder="Preço" 
              value={formData.price} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="stock" 
              type="number" 
              className="input-field" 
              placeholder="Estoque" 
              value={formData.stock} 
              onChange={handleChange} 
              required 
            />
          </div>

          <select 
            name="category" 
            className="input-field" 
            value={formData.category} 
            onChange={handleChange}
          >
            {Object.keys(CATEGORIES).map(cat => (
              <option key={cat} value={cat}>{CATEGORIES[cat].label}</option>
            ))}
          </select>

          <input 
            name="imageUrl" 
            className="input-field" 
            placeholder="URL da Imagem" 
            value={formData.imageUrl} 
            onChange={handleChange} 
          />

          <textarea 
            name="description" 
            className="input-field" 
            placeholder="Descrição" 
            rows="3"
            value={formData.description} 
            onChange={handleChange} 
          ></textarea>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}