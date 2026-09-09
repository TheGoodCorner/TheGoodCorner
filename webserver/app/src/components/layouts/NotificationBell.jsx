import { Suspense, lazy } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../UI/Button';
import { useUIStore } from '../../stores/uiStore';
import { useClickOutside } from '../../hooks/useClickOutside';

const NotificationPopover = lazy(() =>
  import('../../pages/NotificationPopover').then((module) => ({ default: module.NotificationPopover }))
);

const badge = "absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold pointer-events-none";

export function NotificationBell({ notificationsEnabled, notificationCount }) {
  const toggleUi = useUIStore((state) => state.toggleUi);
  const closeUi = useUIStore((state) => state.closeUi);
  const isNotifOpen = useUIStore((state) => state.UserInterfaces['notification-popover']) || false;
  const notifRef = useClickOutside(() => closeUi('notification-popover'), isNotifOpen);

  return (
    <div className={`relative ${!notificationsEnabled ? 'opacity-40 pointer-events-none' : ''}`} ref={notifRef}>
      <Button
        onClick={() => { if (!notificationsEnabled) return; toggleUi('notification-popover'); }}
        variant="ghost"
        icon={Bell}
        aria-label="Notifications"
      />
      {notificationsEnabled && notificationCount > 0 && (
        <div className={badge}>{notificationCount}</div>
      )}
      {notificationsEnabled && isNotifOpen && (
        <Suspense fallback={null}>
          <NotificationPopover />
        </Suspense>
      )}
    </div>
  );
}