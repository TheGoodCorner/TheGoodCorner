import { useProductForm } from '../../hooks/useProductForm';
import { FormField } from '../UI/FormField';
import { Button } from '../UI/Button';
import { FileInput } from '../UI/FileInput';
import { Package, Euro, Tag, FileText, PlusCircle } from 'lucide-react';
import { PRODUCT_PRICE_MAX } from '../../utils/constants';

const CATEGORIES = [
  { value: 'Training', label: 'Entrainement' },
  { value: 'Professionnal', label: 'Professionnel' },
  { value: 'Combat', label: 'combat' },
  { value: 'Cardio', label: 'cardio' },
  { value: 'other', label: 'Autre' },
];

export function ProductForm({ onSuccess }) {
  const { form, submitting, error, handleChange, submit } = useProductForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(onSuccess);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6' noValidate>
      {/* Ligne 1: Nom + Catégorie */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <FormField
          id='product-name'
          label='Nom du produit'
          icon={Package}
          type='text'
          value={form.name}
          onChange={handleChange('name')}
          placeholder='Ex: Chaise ergonomique'
          disabled={submitting}
        />
        
        <div>
          <label htmlFor='category' className='block text-sm font-semibold text-[var(--color-text)] mb-2'>
            Catégorie
          </label>
          <div className='relative'>
            <Tag
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none'
              aria-hidden='true'
            />
            <select
              id='category'
              className='w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors disabled:opacity-60'
              value={form.category}
              onChange={handleChange('category')}
              disabled={submitting}
            >
              <option value=''>-- Sélectionne une catégorie --</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
	{/* Champ affiché uniquement si "Autre" est sélectionné */}
        {form.category === 'other' && (
        <div className='animate-in fade-in slide-in-from-top-2 duration-200'>
          <FormField
            id='custom-category'
            label='Précise la catégorie personnalisée'
            icon={PlusCircle}
            type='text'
            value={form.customCategory || ''}
            onChange={handleChange('customCategory')}
            placeholder='Ex: Équipements de frappe'
            disabled={submitting}
            required
          />
        </div>
      )}
      {/* Ligne 2: Prix + Image */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        <FormField
          id='price'
          label='Prix (€)'
          icon={Euro}
          type='number'
          step='0.01'
          min='0'
          max = {PRODUCT_PRICE_MAX}
          value={form.price}
          onChange={handleChange('price')}
          placeholder='29.99'
          disabled={submitting}
        />

        <FileInput
          id='image-file'
          label='Image du produit'
          accept='.png,.jpeg,.jpg,image/png,image/jpeg'
          value={form.image}
          onChange={handleChange('image')}
          disabled={submitting}
        />
      </div>

      {/* Ligne 3: Description */}
      <FormField
        id='description'
        label='Description'
        icon={FileText}
        type='text'
        as='textarea'
        value={form.description}
        onChange={handleChange('description')}
        placeholder='Décris ton produit en détail...'
        disabled={submitting}
        className='resize-none'
        rows='5'
      />

      {/* Message d'erreur */}
      {error && (
        <div className='p-4 bg-[var(--color-danger-surface)] border border-[var(--color-danger)] rounded-[var(--radius-md)]'>
          <p className='text-sm text-[var(--color-danger)] font-medium' role='alert'>
            {error}
          </p>
        </div>
      )}

      {/* Bouton Submit */}
      <Button 
        variant='primary' 
        fullWidth 
        loading={submitting}
        className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] py-3 rounded-[var(--radius-md)] font-semibold transition-colors'
      >
        Créer le produit
      </Button>
    </form>
  );
}
