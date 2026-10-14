import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Building2,
  Video,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Layers,
  Globe,
  Compass,
  ArrowUpRight,
  Landmark,
  X,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import {
  TAMIL_NADU_DISTRICTS,
  INDIAN_STATES,
  DistrictInfo,
  StateInfo
} from '../../utils/placesData';
import { TrainingCentre } from '../../types';

export const PlacesPage: React.FC = () => {
  const { centres, cameras, setActivePage, addCentre, setSelectedCentreId } = useApp();

  const [activeTab, setActiveTab] = useState<'tamil_nadu' | 'all_states' | 'allocator'>('tamil_nadu');
  const [districtSearch, setDistrictSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Northern' | 'Central' | 'Western' | 'Southern' | 'Coastal'>('all');

  const [stateSearch, setStateSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState<'all' | 'South' | 'North' | 'West' | 'East' | 'Central' | 'North-East'>('all');

  // Fast allocation modal state
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedPlaceState, setSelectedPlaceState] = useState('Tamil Nadu');
  const [selectedPlaceDistrict, setSelectedPlaceDistrict] = useState('Chennai');
  const [centreName, setCentreName] = useState('');
  const [centreAddress, setCentreAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 ');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Map active centres to Tamil Nadu districts
  const districtStats = useMemo(() => {
    const stats: Record<string, { centres: TrainingCentre[]; cameraCount: number }> = {};
    for (const d of TAMIL_NADU_DISTRICTS) {
      const matchCentres = centres.filter(c => c.state === 'Tamil Nadu' && c.district.toLowerCase() === d.name.toLowerCase());
      const cCount = matchCentres.reduce((sum, c) => sum + (c.activeCameras || 0), 0);
      stats[d.name] = { centres: matchCentres, cameraCount: cCount };
    }
    return stats;
  }, [centres]);

  // Filtered Tamil Nadu Districts
  const filteredDistricts = useMemo(() => {
    return TAMIL_NADU_DISTRICTS.filter(d => {
      if (regionFilter !== 'all' && d.region !== regionFilter) return false;
      if (districtSearch.trim()) {
        const q = districtSearch.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.headquarters.toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.number.toString().includes(q)
        );
      }
      return true;
    });
  }, [districtSearch, regionFilter]);

  // Filtered Indian States
  const filteredStates = useMemo(() => {
    return INDIAN_STATES.filter(s => {
      if (zoneFilter !== 'all' && s.zone !== zoneFilter) return false;
      if (stateSearch.trim()) {
        const q = stateSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.capital.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.number.toString().includes(q)
        );
      }
      return true;
    });
  }, [stateSearch, zoneFilter]);

  const handleOpenAllocate = (districtName?: string) => {
    setSelectedPlaceState('Tamil Nadu');
    if (districtName) {
      setSelectedPlaceDistrict(districtName);
      setCentreName(`${districtName} Vocational & Skill Academy`);
      setCentreAddress(`Main Industrial Corridor, ${districtName}, Tamil Nadu`);
    } else {
      setSelectedPlaceDistrict('Chennai');
      setCentreName('Apex State Technical Hub');
      setCentreAddress('Guindy Industrial Estate, Chennai, Tamil Nadu');
    }
    setManagerName('Regional Directorate Officer');
    setContactEmail(`admin.${(districtName || 'chennai').toLowerCase()}@msde.gov.in`);
    setContactPhone('+91 44 2850 1200');
    setShowAllocateModal(true);
  };

  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centreName.trim()) return;

    const newCode = `TN-${selectedPlaceDistrict.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addCentre({
      code: newCode,
      name: centreName.trim(),
      state: selectedPlaceState,
      district: selectedPlaceDistrict,
      address: centreAddress.trim(),
      managerName: managerName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      totalClassrooms: 3,
      activeCameras: 3,
      status: 'active',
      complianceScore: 92
    });

    setShowAllocateModal(false);
    setToastMsg(`✓ Successfully registered institution "${centreName}" under ${selectedPlaceDistrict}, ${selectedPlaceState}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-mono">
                  Geographical Jurisdictions Directory
                </span>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300">
                  28 STATES & 38 TN DISTRICTS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Places, States & District Jurisdictions
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comprehensive directory of Tamil Nadu's 38 revenue districts and India's 28 States & Capitals under national MSDE surveillance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenAllocate()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 duration-75 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Centre in Place</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('tamil_nadu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tamil_nadu'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Tamil Nadu (38 Districts)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'tamil_nadu' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              38
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all_states')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all_states'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>All 28 Indian States & Capitals</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'all_states' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              28
            </span>
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: TAMIL NADU (38 REVENUE DISTRICTS) */}
      {/* ========================================================================= */}
      {activeTab === 'tamil_nadu' && (
        <div className="space-y-4">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Districts</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">38 Districts</div>
              <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 font-bold">100% Geo-Indexed</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">State Capital</span>
              <div className="text-xl font-bold text-blue-600 dark:text-cyan-400 mt-1">Chennai</div>
              <span className="text-[10px] font-mono text-slate-500">Apex Secretariat Hub</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Active Skill Centres</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{centres.length} Institutes</div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">MSDE Accredited</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Live CCTV Surveillance</span>
              <div className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{cameras.length} Cameras</div>
              <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold animate-pulse">● 18 Sections Active</span>
            </div>
          </div>

          {/* Search and Region Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Search across all 38 Tamil Nadu districts (e.g. Ariyalur, Chennai, Salem, Madurai, Tenkasi)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Region:
              </span>
              {[
                { id: 'all', label: 'All 38' },
                { id: 'Northern', label: 'Northern' },
                { id: 'Western', label: 'Western' },
                { id: 'Central', label: 'Central' },
                { id: 'Southern', label: 'Southern' },
                { id: 'Coastal', label: 'Coastal' }
              ].map(rf => (
                <button
                  key={rf.id}
                  onClick={() => setRegionFilter(rf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    regionFilter === rf.id
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 38 Districts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredDistricts.map(district => {
              const stats = districtStats[district.name] || { centres: [], cameraCount: 0 };
              const hasCentres = stats.centres.length > 0;

              return (
                <div
                  key={district.id}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-3.5 shadow-2xs transition-all hover:shadow-md hover:border-blue-400 flex flex-col justify-between ${
                    district.isCapital
                      ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                      : hasCentres
                      ? 'border-slate-300 dark:border-slate-700'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        #{district.number} · {district.code}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                        district.isCapital
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {district.isCapital ? 'STATE CAPITAL' : district.region}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${district.isCapital ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{district.name}</span>
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      HQ: <strong>{district.headquarters}</strong>
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      {hasCentres ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{stats.centres.length} Centre · {stats.cameraCount} Cams</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Surveillance Ready
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenAllocate(district.name)}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Add Centre</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDistricts.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No district matches "{districtSearch}"
              </p>
              <button
                onClick={() => {
                  setDistrictSearch('');
                  setRegionFilter('all');
                }}
                className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Clear Search & Show All 38 Districts
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL 28 INDIAN STATES & CAPITALS */}
      {/* ========================================================================= */}
      {activeTab === 'all_states' && (
        <div className="space-y-4">
          {/* Search and Zone Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search across all 28 states & capitals (e.g. Tamil Nadu, Andhra Pradesh, Maharashtra, Mumbai)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                Zone:
              </span>
              {[
                { id: 'all', label: 'All 28' },
                { id: 'South', label: 'South' },
                { id: 'North', label: 'North' },
                { id: 'West', label: 'West' },
                { id: 'East', label: 'East' },
                { id: 'Central', label: 'Central' },
                { id: 'North-East', label: 'North-East' }
              ].map(zf => (
                <button
                  key={zf.id}
                  onClick={() => setZoneFilter(zf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    zoneFilter === zf.id
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {zf.label}
                </button>
              ))}
            </div>
          </div>

          {/* 28 States & Capitals Table and Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">State</th>
                    <th className="py-3 px-4">Capital</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Districts</th>
                    <th className="py-3 px-4">MSDE Monitoring Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStates.map(state => {
                    const isTN = state.name === 'Tamil Nadu';

                    return (
                      <tr
                        key={state.code}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          isTN ? 'bg-blue-50/30 dark:bg-blue-950/20 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-400">
                          {state.number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {state.name}
                            </span>
                            {isTN && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-600 text-white">
                                PRIMARY PILOT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Landmark className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                            {state.capital}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            {state.zone}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {state.totalDistricts} Districts
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Surveillance Enabled</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (isTN) {
                                setActiveTab('tamil_nadu');
                              } else {
                                handleOpenAllocate();
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            {isTN ? 'View 38 Districts →' : '+ Allocate Centre'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALLOCATE / REGISTER CENTRE IN JURISDICTION MODAL */}
      {/* ========================================================================= */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Register Institution Under Jurisdiction
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    MSDE Accredited Vocational Training Center
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAllocation} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State (28 States)
                  </label>
                  <select
                    value={selectedPlaceState}
                    onChange={(e) => setSelectedPlaceState(e.target.value)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                        {s.name} ({s.capital})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District (38 TN Districts)
                  </label>
                  {selectedPlaceState === 'Tamil Nadu' ? (
                    <select
                      value={selectedPlaceDistrict}
                      onChange={(e) => setSelectedPlaceDistrict(e.target.value)}
                      style={{ colorScheme: 'light dark' }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      {TAMIL_NADU_DISTRICTS.map(d => (
                        <option key={d.id} value={d.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                          #{d.number} {d.name} {d.isCapital ? '(Capital)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedPlaceDistrict}
                      onChange={(e) => setSelectedPlaceDistrict(e.target.value)}
                      placeholder="Enter district name..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Centre Name *
                </label>
                <input
                  type="text"
                  required
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                  placeholder="e.g. Salem Skill Academy, Trichy Technical Lab..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Postal Address
                </label>
                <input
                  type="text"
                  value={centreAddress}
                  onChange={(e) => setCentreAddress(e.target.value)}
                  placeholder="Street address, PIN code..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Centre Manager
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 duration-75"
                >
                  Confirm & Allocate Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
