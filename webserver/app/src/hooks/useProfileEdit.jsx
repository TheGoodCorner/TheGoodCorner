import { useState, useCallback } from 'react';
import { useUserStore } from '../stores/userStore';

/**
 * Encapsule la logique d'édition du profil :
 * - Gestion de l'état édition/lecture
 * - État des champs modifiés
 * - Validation
 * - Soumission API
 * 
 * Les données sensibles restent ici, pas dans Zustand.
 * Visuellement : aucune différence entre édition et lecture
 */
export function useProfileEdit(initialUser) {
  const { updateUserProfile } = useUserStore();

  // États
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    location: initialUser?.location?.name || '',
    bio: initialUser?.bio || '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Valider les champs
  const validate = useCallback(() => {
    if (!editedData.email.trim()) return 'L\'email est requis.';
    if (!editedData.email.includes('@')) return 'Email invalide.';
    if (editedData.bio.length > 500) return 'La bio ne peut pas dépasser 500 caractères.';
    return null;
  }, [editedData]);

  // Modifier un champ
  const handleFieldChange = useCallback((field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  }, [error, success]);

  // Passer en mode édition
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  }, []);

  // Annuler l'édition
  const cancelEditing = useCallback(() => {
    setEditedData({
      email: initialUser?.email || '',
      phone: initialUser?.phone || '',
      location: initialUser?.location?.name || '',
      bio: initialUser?.bio || '',
    });
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  }, [initialUser]);

  // Sauvegarder les modifications
  const saveChanges = useCallback(async (onSuccess) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Appel API (implémentation dans le store)
      await updateUserProfile(editedData);
      
      setSuccess(true);
      setIsEditing(false);
      onSuccess?.();

      // Réinitialiser le message de succès après 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }, [editedData, validate, updateUserProfile]);

  return {
    // État
    isEditing,
    editedData,
    submitting,
    error,
    success,
    
    // Actions
    handleFieldChange,
    startEditing,
    cancelEditing,
    saveChanges,
  };
}
