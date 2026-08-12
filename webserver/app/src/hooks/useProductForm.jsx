import { useState } from 'react';
import { useProductStore } from '../stores/productStore'; // À adapter selon ton store

/**
 * Encapsule la logique du formulaire de création produit :
 * état des champs, validation, soumission.
 *
 * (Rien ici n'a besoin d'être partagé avec le reste de l'app)
 */
export function useProductForm() {
  const { createProduct, error, setError } = useProductStore();

  const [form, setForm] = useState({
    name: '',
    image: null,
    price: '',
    category: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleChange = (field) => (e) => {
    if (field === 'image') {
      setForm((f) => ({ ...f, [field]: e.target.files?.[0] || null }));
    } else {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    }
    if (error) setError(null);
  };

  const validate = () => {
    if (!form.name.trim()) return 'Le nom du produit est requis.';
    if (!form.image) return 'Ajoute une image.';
    if (!form.price || isNaN(parseFloat(form.price))) return 'Le prix doit être un nombre valide.';
    if (parseFloat(form.price) <= 0) return 'Le prix doit être supérieur à 0.';
    if (!form.description.trim()) return 'Ajoute une description.';
    if (form.description.length < 10) return 'La description doit faire au moins 10 caractères.';
    return null;
  };

  /**
   * @param {Function} onSuccess - appelé après une création réussie
   */
  const submit = async (onSuccess) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsShaking(true);
      return;
    }

    setSubmitting(true);

    const success = await createProduct({
      name: form.name.trim(),
      image: form.image,
      price: parseFloat(form.price),
      description: form.description.trim(),
      quantity: 1,
    });

    setSubmitting(false);

    if (success) {
      setForm({
        name: '',
        image: null,
        price: '',
        description: '',
      });
      onSuccess?.();
    }
  };

  return {
    form,
    submitting,
    isShaking,
    error,
    handleChange,
    submit,
    clearShake: () => setIsShaking(false),
  };
}
