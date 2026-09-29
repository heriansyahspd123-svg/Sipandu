import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Share2
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    currentUser,
    activeSchool
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const [waMessage, setWaMessage] = useState('');

  if (!isOpen) return null;

  // Filter based on user's role and unread filter
  const userNotifications = notifications.filter(n => {
    const roleMatch = !n.targetRole || n.targetRole === 'ALL' || n.targetRole === currentUser.role;
    if (activeTab === 'unread') return roleMatch && !n.isRead;
    return roleMatch;
  });

  const handleOpenWhatsAppPreview = (title: string, msg: string) => {
    const text = `*SIPANDU SEKOLAH - KAB. SIDRAP*\n\n📢 *${title}*\n\n${msg}\n\n🏫 *Sekolah:* ${activeSchool.name}\n👤 *Tujuan:* ${currentUser.name} (${currentUser.role.toUpperCase()})\n📅 *Waktu:* ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n\nSilakan buka aplikasi SIPANDU untuk menindaklanjuti. Terimakasih.`;
    setWaMessage(text);
    setShowWhatsAppPreview(true);
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pusat Notifikasi Mutu</h2>
              <p className="text-[11px] text-slate-500">Pemberitahuan tenggat, verifikasi, dan tindak lanjut</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filter & Mark All Read */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeTab === 'unread' 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Belum Dibaca
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tidak ada notifikasi baru</p>
              <p className="text-xs text-slate-400 mt-1">Semua tugas dan pengumpulan bukti berjalan sesuai rencana.</p>
            </div>
          ) : (
            userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition relative ${
                  notif.isRead 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                    : 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40 shadow-xs'
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-teal-500 ring-4 ring-teal-100 dark:ring-teal-900" />
                )}
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'urgent' ? 'bg-rose-100 text-rose-600' :
                    notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    notif.type === 'action' ? 'bg-blue-100 text-blue-600' :
                    'bg-teal-100 text-teal-600'
                  }`}>
                    {notif.type === 'urgent' || notif.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 pr-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{notif.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* WhatsApp preview trigger */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWhatsAppPreview(notif.title, notif.message);
                          }}
                          className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md"
                          title="Simulasi Kirim Notifikasi WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>

                        {notif.linkAction && (
                          <button
                            onClick={() => {
                              onNavigateTab(notif.linkAction!);
                              onClose();
                            }}
                            className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            Lihat Tindak Lanjut →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Sistem otomatis mengirim pengingat H-7 dan H-3 menjelang batas waktu RTL.
          </p>
        </div>
      </div>

      {/* WhatsApp Simulation Modal */}
      {showWhatsAppPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-slate-900 font-bold text-xs">
                  SP
                </div>
                <div>
                  <h3 className="text-sm font-bold">SIPANDU Notifikasi WhatsApp</h3>
                  <p className="text-[10px] text-emerald-200">Official Gateway Mutu Sidrap</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWhatsAppPreview(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#efeae2] dark:bg-slate-950 min-h-[160px]">
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed max-w-sm">
                {waMessage}
                <div className="mt-2 text-[9px] text-slate-400 text-right">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Pesan ini siap diintegrasikan dengan API resmi WhatsApp Disdikbud Sidrap.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(waMessage);
                  alert('Teks notifikasi WhatsApp disalin ke clipboard!');
                  setShowWhatsAppPreview(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Salin Pesan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
