


export const SESSION_KEY = 'has_session';

export const PRODUCT_PRICE_MAX = 10000;

export const CATEGORIES = [
  { value: 'Training', label: 'Entrainement' },
  { value: 'Professionnal', label: 'Professionnel' },
  { value: 'Combat', label: 'Combat' },
  { value: 'Cardio', label: 'Cardio' },
  { value: 'other', label: 'Autre' },
];

export const CATEGORY_LABEL = {
  Training: 'Entrainement',
  Professionnal: 'Professionnel',
  Professional: 'Professionnel',
  Combat: 'Combat',
  Cardio: 'Cardio',
  other: 'Autre',
  Autre: 'Autre',
};

export const getCategoryLabel = (name) => CATEGORY_LABEL[name] ?? name ?? 'Non catégorisé';