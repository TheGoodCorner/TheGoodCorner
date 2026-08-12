import { useProductForm } from '../../hooks/useProductForm';
import { FormField } from '../UI/FormField';
import { Button } from '../UI/Button';
import { Package, Image, DollarSign, Tag, FileText } from 'lucide-react';

export function ProductForm({ onSuccess }) {
  const { form, submitting, isShaking, error, handleChange, submit, clearShake } = useProductForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(onSuccess);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        id="product-name"
        label="Nom du produit"
        icon={Package}
        type="text"
        value={form.name}
        onChange={handleChange('name')}
        placeholder="Ex: Chaise ergonomique"
        disabled={submitting}
      />

      <FormField
        id="image-url"
        label="URL de l'image"
        icon={Image}
        type="url"
        value={form.imageUrl}
        onChange={handleChange('imageUrl')}
        placeholder="https://example.com/image.jpg"
        disabled={submitting}
      />

      <FormField
        id="price"
        label="Prix (€)"
        icon={DollarSign}
        type="number"
        step="0.01"
        min="0"
        value={form.price}
        onChange={handleChange('price')}
        placeholder="29.99"
        disabled={submitting}
      />

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          Catégorie
        </label>
        <div className="relative">
          <Tag
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="category"
            className={
              'w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] ' +
              'bg-[var(--color-bg)] text-[var(--color-text)] ' +
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors ' +
              'disabled:opacity-60'
            }
            value={form.category}
            onChange={handleChange('category')}
            disabled={submitting}
          >
            <option value="">-- Sélectionne une catégorie --</option>
            <option value="furniture">Mobilier</option>
            <option value="electronics">Électronique</option>
            <option value="clothing">Vêtements</option>
            <option value="food">Alimentation</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      <FormField
        id="description"
        label="Description"
        icon={FileText}
        type="text"
        as="textarea"
        value={form.description}
        onChange={handleChange('description')}
        placeholder="Décris ton produit en détail..."
        disabled={submitting}
        className="resize-none"
        rows="4"
      />

      {error && (
        <p className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}

      <Button variant="primary" fullWidth loading={submitting}>
        Créer le produit
      </Button>
    </form>
  );
}
