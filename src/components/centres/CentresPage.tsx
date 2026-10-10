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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Institutions Directory
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Government Approved Training Centres</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Training Centres Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Register and configure MSDE-certified vocational and technical skill centres.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Register Training Centre
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">District:</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Districts</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search centre name or code..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-52"
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
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {centre.code}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        centre.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {centre.status === 'active' ? 'Active & Monitored' : 'Audit Required'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-2">{centre.name}</h3>
                  </div>

                  <button
                    onClick={() => openEdit(centre)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{centre.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{centre.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{centre.contactPhone} · Manager: {centre.managerName}</span>
                  </div>
                </div>

                {/* Score & Camera Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Compliance</div>
                    <div className={`font-bold text-sm mt-0.5 ${
                      centre.complianceScore >= 90 ? 'text-emerald-700' :
                      centre.complianceScore >= 75 ? 'text-amber-700' : 'text-red-600'
                    }`}>
                      {centre.complianceScore}%
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Classrooms</div>
                    <div className="font-bold text-sm text-slate-800 mt-0.5">{centreRooms.length}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Cameras</div>
                    <div className="font-bold text-sm text-blue-700 mt-0.5">{onlineCameras}/{centreCameras.length}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedCentreId(centre.id);
                    setActivePage('centre-detail');
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Inspect Centre Dossier <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add or Edit Centre */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">
                {editingCentre ? 'Edit Training Centre' : 'Register New Training Centre'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Postal Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Manager</label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="active">Active & Monitored</option>
                    <option value="under_review">Under Audit Review</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
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
