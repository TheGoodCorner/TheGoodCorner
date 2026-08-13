import { LucideIcon } from 'lucide-react';

export const InfoCard = ({ icon: Icon, label, value }) => (
  <div className='flex items-start gap-3'>
    <Icon size={20} className='text-[var(--color-primary)] flex-shrink-0 mt-0.5' />
    <div className='min-w-0'>
      <p className='text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide'>
        {label}
      </p>
      <p className='text-sm font-medium text-[var(--color-text)] mt-0.5'>
        {value || 'Non renseigné'}
      </p>
    </div>
  </div>
);
