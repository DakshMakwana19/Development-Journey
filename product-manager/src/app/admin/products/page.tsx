'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit2, Trash2, Eye, Package, X, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { categories, bottleTypes, labelTypes, packagingTypes } from '@/lib/data';
import { Product } from '@/types';
import Link from 'next/link';

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct, addProduct } = useAppStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [bottleFilter, setBottleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || p.category === catFilter;
      const matchBottle = !bottleFilter || p.bottleType === bottleFilter;
      return matchSearch && matchCat && matchBottle;
    });
  }, [products, search, catFilter, bottleFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const openEdit = (product: Product) => {
    setEditProduct({ ...product });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditProduct({
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`, name: '', code: '', category: 'Beverages',
      subcategory: '', bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
      size: '', color: '', quantity: 0, description: '', notes: '', instructions: '',
      isCocreate: false, image: '', status: 'active', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editProduct) return;
    const existing = products.find(p => p.id === editProduct.id);
    if (existing) {
      updateProduct(editProduct.id, editProduct);
    } else {
      addProduct(editProduct);
    }
    setShowModal(false);
    setEditProduct(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Products</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{products.length} total products · {filtered.length} showing</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, minWidth: 280 }}>
          <Search size={16} />
          <input className="input-field" placeholder="Search products by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
        <select className="select-field" style={{ width: 180 }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select-field" style={{ width: 180 }} value={bottleFilter} onChange={(e) => setBottleFilter(e.target.value)}>
          <option value="">All Bottle Types</option>
          {bottleTypes.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Code</th>
              <th>Category</th>
              <th>Bottle Type</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={16} color="var(--accent-hover)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.labelType} · {p.packagingType}</div>
                      </div>
                    </div>
                  </td>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-hover)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 4 }}>{p.code}</code></td>
                  <td>{p.category}</td>
                  <td>{p.bottleType}</td>
                  <td>{p.size}</td>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{p.quantity.toLocaleString()}</td>
                  <td><span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'draft' ? 'badge-warning' : 'badge-danger'}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => setViewProduct(p)} style={{ padding: 6, background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}>
                        <Eye size={14} />
                      </button>
                      <button onClick={() => openEdit(p)} style={{ padding: 6, background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.15s' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: 6, background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--danger)', transition: 'all 0.15s' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Package size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && editProduct && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{products.find(p => p.id === editProduct.id) ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="float-label"><label>Product Name</label><input className="input-field" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} /></div>
                <div className="float-label"><label>Product Code</label><input className="input-field" value={editProduct.code} onChange={(e) => setEditProduct({ ...editProduct, code: e.target.value })} /></div>
                <div className="float-label"><label>Category</label><select className="select-field" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="float-label"><label>Subcategory</label><input className="input-field" value={editProduct.subcategory} onChange={(e) => setEditProduct({ ...editProduct, subcategory: e.target.value })} /></div>
                <div className="float-label"><label>Bottle Type</label><select className="select-field" value={editProduct.bottleType} onChange={(e) => setEditProduct({ ...editProduct, bottleType: e.target.value })}>{bottleTypes.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div className="float-label"><label>Label Type</label><select className="select-field" value={editProduct.labelType} onChange={(e) => setEditProduct({ ...editProduct, labelType: e.target.value })}>{labelTypes.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                <div className="float-label"><label>Packaging</label><select className="select-field" value={editProduct.packagingType} onChange={(e) => setEditProduct({ ...editProduct, packagingType: e.target.value })}>{packagingTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div className="float-label"><label>Size</label><input className="input-field" value={editProduct.size} onChange={(e) => setEditProduct({ ...editProduct, size: e.target.value })} /></div>
                <div className="float-label"><label>Color</label><input className="input-field" value={editProduct.color} onChange={(e) => setEditProduct({ ...editProduct, color: e.target.value })} /></div>
                <div className="float-label"><label>Quantity</label><input className="input-field" type="number" value={editProduct.quantity} onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="float-label" style={{ marginBottom: 16 }}><label>Description</label><textarea className="input-field" rows={2} value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 16 }}><label>Admin Notes</label><textarea className="input-field" rows={2} value={editProduct.notes} onChange={(e) => setEditProduct({ ...editProduct, notes: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 16 }}><label>Worker Instructions</label><textarea className="input-field" rows={2} value={editProduct.instructions} onChange={(e) => setEditProduct({ ...editProduct, instructions: e.target.value })} style={{ resize: 'vertical' }} /></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={editProduct.isCocreate} onChange={(e) => setEditProduct({ ...editProduct, isCocreate: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                  Co-Create Product
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewProduct && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewProduct(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{viewProduct.name}</h2>
                <button onClick={() => setViewProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  ['Product Code', viewProduct.code],
                  ['Category', `${viewProduct.category} › ${viewProduct.subcategory}`],
                  ['Bottle Type', viewProduct.bottleType],
                  ['Label Type', viewProduct.labelType],
                  ['Packaging', viewProduct.packagingType],
                  ['Size', viewProduct.size],
                  ['Color', viewProduct.color],
                  ['Quantity', viewProduct.quantity.toLocaleString()],
                  ['Status', viewProduct.status],
                  ['Co-Create', viewProduct.isCocreate ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>

              {viewProduct.description && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{viewProduct.description}</div>
                </div>
              )}
              {viewProduct.notes && (
                <div style={{ marginTop: 16, padding: 16, background: 'var(--warning-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)', marginBottom: 4 }}>Admin Notes</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.notes}</div>
                </div>
              )}
              {viewProduct.instructions && (
                <div style={{ marginTop: 12, padding: 16, background: 'var(--info-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--info)', marginBottom: 4 }}>Worker Instructions</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.instructions}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
