import { useUIStore } from '../../stores/uiStore';
import { useClickOutside } from '../../hooks/useClickOutside';
import { X, PanelRightClose } from 'lucide-react';
import { Button } from './Button';

/**
 * Popover générique réutilisable
 * @param {string} id - identifiant unique (pour le store UI)
 * @param {React.ReactNode} trigger - élément déclencheur (bouton, icône...)
 * @param {React.ReactNode} children - contenu du popover
 * @param {string} position - position: 'right', 'left', 'center' (default: 'right')
 * @param {boolean} showCloseButton - afficher le bouton X (default: true)
 */
export function Popover({
  id,
  trigger,
  children,
  position = 'right',
  showCloseButton = true,
}) {
  const { openUi, toggleUi, closeUi } = useUIStore();
  const isOpen = useUIStore((state) => state.UserInterfaces[id]) || false;

  const ref = useClickOutside(() => closeUi(id), isOpen);

  const positionClass = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
  }[position];

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => openUi(id)}>
        {trigger}
      </div>
      {/* Popover Panel */}
      {isOpen && (
        <div className={`fixed ${positionClass} top-4 right-4 bottom-4 top-0 mt-2 bg-white  z-50 rounded-lg shadow-2xl border border-gray-300 z-50 w-96 max-w-lg`}>
          {/* Header avec close button */}
          {showCloseButton && (
            <Button
              onClick={() => closeUi(id)}
              className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded transition"
            >
              <PanelRightClose className="w-4 h-4" />
            </Button>
          )}
          {/* Contenu */}
          <div className="p-6">{children}</div>
        </div>
      )}
    </div>
  );
}