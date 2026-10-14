import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  ChevronRight,
  Pencil,
  MapPin,
  Mail,
  Phone,
  Video,
  Layers,
  X
} from 'lucide-react';
import { TrainingCentre } from '../../types';
import { TAMIL_NADU_DISTRICTS, INDIAN_STATES } from '../../utils/placesData';

export const CentresPage: React.FC = () => {
  const {
    centres,
    cameras,
    classrooms,
    addCentre,
    updateCentre,
    setSelectedCentreId,
    setActivePage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCentre, setEditingCentre] = useState<TrainingCentre | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'under_review' | 'inactive'>('active');

  const filteredCentres = useMemo(() => {
    return centres.filter(c => {
      if (districtFilter !== 'all' && c.district !== districtFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q) && !c.district.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [centres, districtFilter, statusFilter, searchQuery]);

  const openAdd = () => {
    setEditingCentre(null);
    setCode(`TN-NEW-${Math.floor(1000 + Math.random() * 9000)}`);
    setName('');
    setDistrict('Chennai');
    setState('Tamil Nadu');
    setAddress('');
    setManagerName('');
    setContactEmail('');
    setContactPhone('+91 ');
    setStatus('active');
    setShowModal(true);
  };

  const openEdit = (c: TrainingCentre) => {
    setEditingCentre(c);
    setCode(c.code);
    setName(c.name);
    setDistrict(c.district);
    setState(c.state);
    setAddress(c.address);
    setManagerName(c.managerName);
    setContactEmail(c.contactEmail);
    setContactPhone(c.contactPhone);
    setStatus(c.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCentre) {
      updateCentre(editingCentre.id, {
        code,
        name,
        district,
        state,
        address,
        managerName,
        contactEmail,
        contactPhone,
        status,
      });
    } else {
      addCentre({
        code,
        name,
        district,
        state,
        address,
        managerName,
        contactEmail,
        contactPhone,
        totalClassrooms: 3,
        activeCameras: 3,
        status,
        complianceScore: 90,
      });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-mono">
              Institutions Directory
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Government Approved Training Centres</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
              {centres.length} Active Hubs
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
            Training Centres Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Register, configure, and audit MSDE-certified vocational and technical skill centres across 38 Tamil Nadu districts and India's 28 States.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <button
            onClick={openAdd}
            className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-blue-500/40 ring-2 ring-blue-400/50 hover:ring-blue-300 dark:ring-blue-400/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-200 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
            <span className="tracking-wide">Register Training Centre</span>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-white border border-white/20">
              + New
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Filter className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">District:</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white cursor-pointer font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Districts (38 TN)</option>
              {TAMIL_NADU_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>
                  #{d.number} {d.name} {d.isCapital ? '★ Capital' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white cursor-pointer font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active & Monitored</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search centre name, code, district..."
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-56 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid of Centres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCentres.map((centre) => {
          const centreCameras = cameras.filter(c => c.centreId === centre.id);
          const centreRooms = classrooms.filter(r => r.centreId === centre.id);
          const onlineCameras = centreCameras.filter(c => c.status === 'connected').length;

          return (
            <div
              key={centre.id}
              className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md">
                        {centre.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        centre.status === 'active' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}>
                        {centre.status === 'active' ? '● Active & Monitored' : '▲ Audit Required'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                        {centre.district}, {centre.state}
                      </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-2">
                      {centre.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => openEdit(centre)}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Centre Details"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />
                    <span className="truncate">{centre.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{centre.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{centre.contactPhone} · <strong className="text-slate-700 dark:text-slate-200">Director: {centre.managerName}</strong></span>
                  </div>
                </div>

                {/* Score & Camera Metrics */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Compliance</div>
                    <div className={`font-bold text-base mt-0.5 ${
                      centre.complianceScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                      centre.complianceScore >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {centre.complianceScore}%
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Classrooms</div>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">{centreRooms.length}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">CCTV Cameras</div>
                    <div className="font-bold text-base text-blue-600 dark:text-cyan-400 mt-0.5">{onlineCameras}/{centreCameras.length}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedCentreId(centre.id);
                    setActivePage('centre-detail');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-cyan-300 hover:text-blue-900 dark:hover:text-white px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/80 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                >
                  <span>Inspect Centre Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add or Edit Centre */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingCentre ? 'Edit Training Centre' : 'Register New Training Centre'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Centre Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">State (28 States)</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                        {s.name} ({s.capital})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">District (38 TN)</label>
                  {state === 'Tamil Nadu' ? (
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      style={{ colorScheme: 'light dark' }}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {TAMIL_NADU_DISTRICTS.map(d => (
                        <option key={d.id} value={d.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                          #{d.number} {d.name} {d.isCapital ? '★ Capital' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="District name..."
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Centre Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Postal Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Centre Director / Manager</label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Accreditation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active & Monitored</option>
                    <option value="under_review">Under Audit Review</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Save Training Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
