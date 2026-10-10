import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Building2,
  CheckCircle2,
  PlusCircle,
  X
} from 'lucide-react';
import { initialUsers } from '../../utils/demoData';
import { UserRole } from '../../types';

export const UserManagementPage: React.FC = () => {
  const { currentUser, switchUserRole, centres } = useApp();

  const [userList, setUserList] = useState(initialUsers);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Access Governance & RBAC
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Role-Based Access Control</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            User Management & Role Permissions
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Role profiles enforce strict least-privilege access across administrators, officers, and centre managers.
          </p>
        </div>
      </div>

      {/* Role Switcher Demo Cards for Judges */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-blue-900">Judge Demonstration Role Selector</h3>
          </div>
          <span className="text-xs font-mono text-blue-700 font-semibold">Active: {currentUser.role}</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          Select any of the 3 roles below to immediately switch perspectives and verify role-specific authorization and UI workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {[
            {
              role: 'System Administrator' as UserRole,
              desc: 'Full control over centres, settings, approved inventories, audit logs, and system diagnostics.',
              badge: 'Superuser Access'
            },
            {
              role: 'Monitoring Officer' as UserRole,
              desc: 'Audits attendance discrepancies, reviews equipment flags, requests inspections, and signs reports.',
              badge: 'Audit & Review'
            },
            {
              role: 'Centre Manager' as UserRole,
              desc: 'Submits batch attendance registers, manages local classroom inventory, and responds to inquiries.',
              badge: 'Centre Scoped'
            }
          ].map((item) => (
            <div
              key={item.role}
              onClick={() => switchUserRole(item.role)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                currentUser.role === item.role
                  ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600'
                  : 'bg-white/80 hover:bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{item.role}</span>
                {currentUser.role === item.role && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              <div className="mt-3 text-[10px] text-blue-700 font-semibold font-mono uppercase">
                {item.badge}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Authorized Personnel Directory</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Name & Department</th>
              <th className="py-3 px-4">Official Email</th>
              <th className="py-3 px-4">Role Profile</th>
              <th className="py-3 px-4">Assigned Centre Scope</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {userList.map((user) => {
              const centre = centres.find(c => c.id === user.assignedCentreId);
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.department}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{user.email}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700">{user.role}</td>
                  <td className="py-3.5 px-4">
                    {centre ? (
                      <span className="text-slate-800">{centre.name}</span>
                    ) : (
                      <span className="text-slate-400">All Registered Centres (State-Wide)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-medium">
                      Active Credentials
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
