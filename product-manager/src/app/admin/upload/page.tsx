'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Package, X, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { categories, bottleTypes, labelTypes, packagingTypes } from '@/lib/data';

export default function UploadPage() {
  const { addProduct, products } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '', code: '', category: 'Beverages', subcategory: '',
    bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
    size: '', color: '', quantity: 0, description: '', notes: '', instructions: '',
    isCocreate: false,
  });

  const update = (key: string, value: string | number | boolean) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    addProduct({
      ...form, id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      image: '', status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ name: '', code: '', category: 'Beverages', subcategory: '', bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack', size: '', color: '', quantity: 0, description: '', notes: '', instructions: '', isCocreate: false });
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Add Product</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Add a new product to the database.</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 20px', background: 'var(--success-subtle)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>
          <Check size={18} /> Product added successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Left — Form */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Product Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="float-label"><label>Product Name *</label><input className="input-field" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. AquaPure Crystal 500ml" /></div>
              <div className="float-label"><label>Product Code *</label><input className="input-field" required value={form.code} onChange={e => update('code', e.target.value)} placeholder="e.g. APC-500" /></div>
              <div className="float-label"><label>Category</label><select className="select-field" value={form.category} onChange={e => update('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="float-label"><label>Subcategory</label><input className="input-field" value={form.subcategory} onChange={e => update('subcategory', e.target.value)} placeholder="e.g. Water, Juice" /></div>
              <div className="float-label"><label>Bottle Type</label><select className="select-field" value={form.bottleType} onChange={e => update('bottleType', e.target.value)}>{bottleTypes.map(b => <option key={b}>{b}</option>)}</select></div>
              <div className="float-label"><label>Label Type</label><select className="select-field" value={form.labelType} onChange={e => update('labelType', e.target.value)}>{labelTypes.map(l => <option key={l}>{l}</option>)}</select></div>
              <div className="float-label"><label>Packaging</label><select className="select-field" value={form.packagingType} onChange={e => update('packagingType', e.target.value)}>{packagingTypes.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className="float-label"><label>Size</label><input className="input-field" value={form.size} onChange={e => update('size', e.target.value)} placeholder="e.g. 500ml, 1L" /></div>
              <div className="float-label"><label>Color</label><input className="input-field" value={form.color} onChange={e => update('color', e.target.value)} placeholder="e.g. Clear, Blue" /></div>
              <div className="float-label"><label>Quantity</label><input className="input-field" type="number" value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 0)} /></div>
            </div>

            <div className="float-label" style={{ marginBottom: 16 }}><label>Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => update('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
            <div className="float-label" style={{ marginBottom: 16 }}><label>Admin Notes</label><textarea className="input-field" rows={2} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Internal notes for reference..." style={{ resize: 'vertical' }} /></div>
            <div className="float-label" style={{ marginBottom: 16 }}><label>Worker Instructions</label><textarea className="input-field" rows={2} value={form.instructions} onChange={e => update('instructions', e.target.value)} placeholder="Instructions workers will see..." style={{ resize: 'vertical' }} /></div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: 24 }}>
              <input type="checkbox" checked={form.isCocreate} onChange={e => update('isCocreate', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} /> Co-Create Product
            </label>

            <button type="submit" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              <Package size={16} /> Save Product
            </button>
          </div>

          {/* Right — Image Upload */}
          <div>
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Product Image</h3>
              <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--surface-border)'}`,
                  borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'var(--accent-subtle)' : 'transparent', transition: 'all 0.2s',
                }}>
                <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Drop image here</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>or click to browse · PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quick Tips</h3>
              {[
                'Use clear, well-lit product photos',
                'Include front and back label views',
                'Show the bottle shape clearly',
                'Add packaging shots if available',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-hover)', fontWeight: 700 }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
