import { useUIStore } from '../stores/uiStore';
import { AnimatePresence, motion } from 'motion/react';

export function NotificationPopover() {
  const isOpen = useUIStore((state) => state.UserInterfaces['notification-popover']) || false;

  return (
    <div className="absolute top-10 right-0 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4 text-[var(--color-text)]">Notifications</h3>
              <p className="text-sm text-[var(--color-text-muted)]">Aucune notification</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
