import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-50 flex items-center gap-2.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-medium text-white shadow-xl shadow-amber-600/30 animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <div>
        <p className="font-semibold">Mode Offline Aktif</p>
        <p className="text-[11px] text-amber-100">Data tersimpan di perangkat lokal. Akan tersinkron saat internet tersambung.</p>
      </div>
    </div>
  );
};
