import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';

/**
 * Encapsule le mode édition du profil (ProfilHeader + ProfilInfos) :
 * état d'édition, valeurs des champs modifiables, sauvegarde via
 * userStore.updateProfile (PUT /user/:id).
 *
 * Champs branchés : email, téléphone, bio, et l'adresse complète (location).
 * Le backend attend `location` comme un objet JSON stringifié dans le
 * FormData (voir updateUser.ts côté API) avec les clés country / region /
 * city / street / house_number / additionnal_infos.
 *
 * Attention à l'asymétrie lecture/écriture sur l'adresse : l'API renvoie
 * `location.houseNumber` (camelCase, cf. schema Prisma) mais attend
 * `house_number` (snake_case) en écriture — d'où le mapping explicite
 * dans buildFormFromUser.
 */
function buildFormFromUser(user) {
  return {
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
    location: {
      country: user?.location?.country || '',
      region: user?.location?.region || '',
      city: user?.location?.city || '',
      street: user?.location?.street || '',
      house_number: user?.location?.houseNumber != null ? String(user.location.houseNumber) : '',
      additionnal_infos: user?.location?.additionnal_infos || '',
    },
  };
}

const LOCATION_REQUIRED_FIELDS = ['country', 'region', 'city', 'street', 'house_number'];

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
  // (user qui arrive après le refresh initial, ou juste après une
  // sauvegarde réussie).
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

  const handleLocationChange = (field) => (e) => {
    setForm((f) => ({ ...f, location: { ...f.location, [field]: e.target.value } }));
    if (validationError) setValidationError(null);
    if (storeError) clearStoreError();
  };

  const save = async () => {
    if (!form.email.trim()) {
      setValidationError("L'email ne peut pas être vide.");
      return;
    }

    // Même règle que le backend (userUpdate.ts) : optionnel, mais si
    // renseigné, exactement 10 chiffres. Vérifié ici pour éviter un
    // aller-retour réseau sur un format évidemment invalide.
    const phoneDigits = form.phoneNumber.replace(/\D/g, '');
    if (form.phoneNumber.trim() !== '' && phoneDigits.length !== 10) {
      setValidationError('Numéro de téléphone invalide (10 chiffres requis).');
      return;
    }

    const additionnal_infos = form.location.additionnal_infos;
    if (additionnal_infos.length > 50) {
      setValidationError('Pas plus de 50 caractères pour le complément d\'adresse')
      return;
    }

    const loc = form.location;
    const filledLocationFields = LOCATION_REQUIRED_FIELDS.filter((key) => loc[key].trim() !== '');
    const hasAnyLocationField = filledLocationFields.length > 0;
    const hasAllLocationFields = filledLocationFields.length === LOCATION_REQUIRED_FIELDS.length;

    if (hasAnyLocationField && !hasAllLocationFields) {
      setValidationError(
        'Adresse incomplète : remplis tous les champs (pays, région, ville, rue, numéro), ou laisse-les tous vides.'
      );
      return;
    }

    setValidationError(null);
    setSubmitting(true);
    try {
      const payload = {
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        bio: form.bio.trim(),
      };

      if (hasAllLocationFields) {
        // Stringifié ici : FormData ne sait pas transporter un objet
        // imbriqué, le backend fait JSON.parse(body.location) de son côté.
        payload.location = JSON.stringify({
          country: loc.country.trim(),
          region: loc.region.trim(),
          city: loc.city.trim(),
          street: loc.street.trim(),
          house_number: loc.house_number.trim(),
          additionnal_infos: loc.additionnal_infos.trim(),
        });
      }

      await updateProfile(payload);
      setIsEditing(false);
    } catch {
      // Erreur déjà posée dans userStore.error par updateProfile — le
      // backend renvoie un message clair (400/409) au lieu d'une 500.
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
    handleLocationChange,
    save,
  };
}
