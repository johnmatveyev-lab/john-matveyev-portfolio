import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function PWAPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast("A new version is available!", {
        action: {
          label: "Reload",
          onClick: () => updateServiceWorker(true),
        },
        duration: 10000,
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
