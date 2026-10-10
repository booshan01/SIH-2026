import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatDateTime } from '../../utils/complianceEngine';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActivePage
  } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              In-App Dispatch Feed
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous Broadcast Hub</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Notification Centre
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Operational alerts, stream disconnection warnings, and scheduled inspection dispatches.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
        >
          Mark All as Read
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkPage) setActivePage(n.linkPage);
              }}
              className={`p-4 text-xs hover:bg-slate-50 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                !n.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {n.type === 'inspection' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                  {n.type === 'system' && <CheckCircle2 className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">
                    {formatDateTime(n.timestamp)}
                  </div>
                </div>
              </div>

              {n.linkPage && (
                <span className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 shrink-0">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
