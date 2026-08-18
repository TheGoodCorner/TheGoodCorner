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
		customCategory: '',
		description: '',
	});
	const [submitting, setSubmitting] = useState(false);
	const [isShaking, setIsShaking] = useState(false);

	const handleChange = (field) => (e) => {
		let value = e.target.value;

		if (field === 'price') {
			if (Number(value) > 10000)
				value = '10000';
		}
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
		if (parseFloat(form.price) <= 0 || parseFloat(form.price) > 10000) return 'Le prix doit être supérieur à 0 et inferieur a 10 000.';
		if (form.category === 'other' && !form.customCategory.trim()) return 'Précise la catégorie personnalisée.';
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

		try {
			const finalCategory = form.category === 'other' ? form.customCategory.trim() : form.category.trim();
			const success = await createProduct({
				name: form.name.trim(),
				image: form.image,
				price: parseFloat(form.price),
				// TODO: le backend attend categoryId (int, FK vers Category), pas un nom
				// — bloqué tant qu'il n'y a pas de route pour lister les vraies
				// catégories. Le dropdown envoie pour l'instant un slug arbitraire.
				category: finalCategory,
				description: form.description.trim(),
				stock: 1,
			});

			setSubmitting(false);

			if (success) {
				setForm({
					name: '',
					image: null,
					price: '',
					category: '',
					customCategory: '',
					description: '',
				});
				onSuccess?.();
			}
		}
		catch (err) {
			setIsShaking(true);
		} finally {
			setSubmitting(false);
		}
	}
	return {
		form,
		submitting,
		isShaking,
		error,
		handleChange,
		submit,
		clearShake: () => setIsShaking(false),
	};
};


