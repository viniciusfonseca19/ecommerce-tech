export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (iso) => {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const truncate = (text, max) =>
  text && text.length > max ? text.slice(0, max) + '...' : text;

export const getImageFallback = (name) =>
  `https://via.placeholder.com/400x300/0a0a0f/00e5ff?text=${encodeURIComponent(name || 'Produto')}`;

export const CATEGORIES = {
  notebooks: { label: 'Notebooks', icon: '💻' },
  monitores: { label: 'Monitores', icon: '🖥️' },
  teclados: { label: 'Teclados', icon: '⌨️' },
  mouses: { label: 'Mouses', icon: '🖱️' },
  headsets: { label: 'Headsets', icon: '🎧' },
  armazenamento: { label: 'Armazenamento', icon: '💾' },
  perifericos: { label: 'Periféricos', icon: '🔌' },
};

export const getCategoryInfo = (cat) =>
  CATEGORIES[cat] || { label: cat, icon: '📦' };