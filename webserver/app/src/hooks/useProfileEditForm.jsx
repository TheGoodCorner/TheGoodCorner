import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

/**
 * Encapsule le mode édition du profil (ProfilHeader + ProfilInfos) :
 * état d'édition, valeurs des champs modifiables, sauvegarde via
 * userStore.updateProfile (PUT /user/:id).
 *
 * Champs branchés ici = ceux réellement portés par `user` (email, bio,
 * location.name). Téléphone / Taux de vente / Paiements restent des
 * données fictives ("fausse donnee", voir ProfilInfos.jsx) sans colonne
 * backend pour l'instant — à ajouter dans buildFormFromUser + save() le
 * jour où elles existeront vraiment côté API.
 */
function buildFormFromUser(user) {
  return {
    email: user?.email || '',
    // TODO backend: `location` est un objet { id, name } côté user, mais
    // updateUserRequest envoie du FormData à plat (voir userApi.jsx,
    // point 9 du contrat) — on édite donc juste le nom pour l'instant.
    location: user?.location?.name || '',
    bio: user?.bio || '',
  };
}

export function useProfileEditForm() {
  const user = useUserStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const storeError = useUserStore((state) => state.error);
  const clearStoreError = useUserStore((state) => state.clearError);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() => buildFormFromUser(user));
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Tant qu'on n'édite pas, le formulaire reste synchro avec le profil
  // (ex: user qui arrive après le refresh initial, voir authStore.initAuth,
  // ou juste après une sauvegarde réussie).
  useEffect(() => {
    if (!isEditing) setForm(buildFormFromUser(user));
  }, [user, isEditing]);

  const startEditing = () => {
    setForm(buildFormFromUser(user));
    setValidationError(null);
    clearStoreError();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(buildFormFromUser(user));
    setValidationError(null);
    clearStoreError();
    setIsEditing(false);
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (validationError) setValidationError(null);
    if (storeError) clearStoreError();
  };

  const save = async () => {
    if (!form.email.trim()) {
      setValidationError("L'email ne peut pas être vide.");
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    try {
      await updateProfile({
        email: form.email.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
      });
      setIsEditing(false);
    } catch {
      // Erreur déjà posée dans userStore.error par updateProfile — on
      // reste en édition pour laisser corriger / réessayer.
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    isEditing,
    form,
    submitting,
    error: validationError || storeError,
    startEditing,
    cancelEditing,
    handleChange,
    save,
  };
}
