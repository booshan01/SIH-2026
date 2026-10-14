import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Filter,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { EquipmentCategory, InventoryItem, OperationalStatus } from '../../types';
import { exportToCSV } from '../../utils/complianceEngine';

export const InventoryManagementPage: React.FC = () => {
  const {
    inventory,
    centres,
    classrooms,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    currentUser
  } = useApp();

  const [centreFilter, setCentreFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Add / Edit Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<EquipmentCategory>('computers');
  const [formCentreId, setFormCentreId] = useState(centres[0]?.id || '');
  const [formClassroomId, setFormClassroomId] = useState(classrooms[0]?.id || '');
  const [formApprovedQty, setFormApprovedQty] = useState(20);
  const [formDetectedQty, setFormDetectedQty] = useState(20);
  const [formLocation, setFormLocation] = useState('Ground Floor Lab Wing');
  const [formOperationalStatus, setFormOperationalStatus] = useState<OperationalStatus>('operational');
  const [formNotes, setFormNotes] = useState('');

  const availableRooms = classrooms.filter(r => r.centreId === formCentreId);

  const categories: EquipmentCategory[] = [
    'computers',
    'sewing_machines',
    'welding_machines',
    'electrical_training_equipment',
    'mechanical_training_equipment',
    'workbenches',
    'tables',
    'chairs',
    'toolkits',
    'laboratory_equipment',
    'custom'
  ];

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      if (centreFilter !== 'all' && item.centreId !== centreFilter) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        if (!item.itemName.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [inventory, centreFilter, categoryFilter, searchFilter]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('computers');
    setFormCentreId(centres[0]?.id || '');
    setFormClassroomId(classrooms[0]?.id || '');
    setFormApprovedQty(20);
    setFormDetectedQty(20);
    setFormLocation('Main classroom floor');
    setFormOperationalStatus('operational');
    setFormNotes('');
    setShowItemModal(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.itemName);
    setFormCategory(item.category);
    setFormCentreId(item.centreId);
    setFormClassroomId(item.classroomId);
    setFormApprovedQty(item.approvedQuantity);
    setFormDetectedQty(item.detectedQuantity);
    setFormLocation(item.expectedLocation);
    setFormOperationalStatus(item.operationalStatus);
    setFormNotes(item.notes || '');
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        itemName: formName,
        category: formCategory,
        centreId: formCentreId,
        classroomId: formClassroomId,
        approvedQuantity: Number(formApprovedQty),
        detectedQuantity: Number(formDetectedQty),
        expectedLocation: formLocation,
        operationalStatus: formOperationalStatus,
        notes: formNotes,
      });
    } else {
      addInventoryItem({
        centreId: formCentreId,
        classroomId: formClassroomId,
        itemName: formName,
        category: formCategory,
        approvedQuantity: Number(formApprovedQty),
        detectedQuantity: Number(formDetectedQty),
        detectionConfidence: 0.92,
        lastInspectionDate: new Date().toISOString().split('T')[0],
        inspectionStatus: Number(formDetectedQty) === Number(formApprovedQty) ? 'verified' : Number(formDetectedQty) < Number(formApprovedQty) ? 'shortage' : 'excess',
        operationalStatus: formOperationalStatus,
        expectedLocation: formLocation,
        notes: formNotes,
      });
    }
    setShowItemModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete inventory record for "${name}"?`)) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-mono">
              Asset Allocation & Registry
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Authorized Equipment Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
              {inventory.length} Assets Tracked
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
            Inventory Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure approved machinery quotas, verify physical asset availability against AI vision detections, and track operational health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <button
            onClick={openAddModal}
            className="group relative flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-blue-500/40 ring-2 ring-blue-400/50 hover:ring-blue-300 dark:ring-blue-400/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-200 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
            <span className="tracking-wide">Add Inventory Asset</span>
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
            <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Centre:</label>
            <select
              value={centreFilter}
              onChange={(e) => setCentreFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white cursor-pointer font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium py-1">
                All Centres ({centres.length})
              </option>
              {centres.map(c => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium py-1">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white cursor-pointer font-medium capitalize focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium py-1">
                All Categories
              </option>
              {categories.map(c => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium py-1">
                  {c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search equipment name..."
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-48 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Equipment Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Centre & Classroom</th>
                <th className="py-3.5 px-4 text-center">Approved Norm</th>
                <th className="py-3.5 px-4 text-center">Detected Qty</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredInventory.map((item) => {
                const centre = centres.find(c => c.id === item.centreId);
                const room = classrooms.find(r => r.id === item.classroomId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.itemName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">ID: {item.id}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium text-slate-800 dark:text-slate-200">
                      {item.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{centre?.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{room?.name || 'Classroom'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {item.approvedQuantity}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sm">
                      <span className={item.detectedQuantity < item.approvedQuantity ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}>
                        {item.detectedQuantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`capitalize px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        item.operationalStatus === 'operational'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : item.operationalStatus === 'maintenance_due'
                          ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                          : 'bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                      }`}>
                        {item.operationalStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Asset"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.itemName)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Item */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-slate-200 dark:border-slate-700 transition-all">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse"></span>
                  <h2 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    {editingItem ? 'Edit Approved Inventory Asset' : 'Add New Inventory Asset'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Machinery quotas, visual location, and operational compliance tracking.
                </p>
              </div>
              <button 
                onClick={() => setShowItemModal(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-4">
              {/* Field 1: Equipment Name */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5 flex items-center justify-between">
                  <span>Equipment Item Name *</span>
                  <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-400">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Industrial Sewing Machine (Juki DDL-8100)"
                  className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 shadow-xs transition-all"
                />
              </div>

              {/* Field 2: Category and Condition Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Equipment Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EquipmentCategory)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold capitalize focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 cursor-pointer shadow-xs transition-all"
                  >
                    {categories.map(c => (
                      <option 
                        key={c} 
                        value={c}
                        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold py-2"
                      >
                        {c.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Condition Status
                  </label>
                  <select
                    value={formOperationalStatus}
                    onChange={(e) => setFormOperationalStatus(e.target.value as OperationalStatus)}
                    style={{ colorScheme: 'light dark' }}
                    className={`w-full text-xs sm:text-sm border-2 rounded-xl p-2.5 font-bold cursor-pointer shadow-xs transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                      formOperationalStatus === 'operational'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200'
                        : formOperationalStatus === 'maintenance_due'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-600 text-amber-900 dark:text-amber-200'
                        : formOperationalStatus === 'faulty'
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 dark:border-red-600 text-red-900 dark:text-red-200'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    <option value="operational" className="bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-bold py-2">
                      ● Operational (In-Service)
                    </option>
                    <option value="maintenance_due" className="bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 font-bold py-2">
                      ▲ Maintenance Due (Inspection Flagged)
                    </option>
                    <option value="faulty" className="bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 font-bold py-2">
                      ■ Faulty / Defective (Offline)
                    </option>
                    <option value="decommissioned" className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-2">
                      ✕ Decommissioned / Retired
                    </option>
                  </select>

                  {/* Interactive Quick-Pick Status Pills for guaranteed visible status */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[
                      { val: 'operational', label: 'Operational', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700' },
                      { val: 'maintenance_due', label: 'Maintenance', color: 'text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700' },
                      { val: 'faulty', label: 'Faulty', color: 'text-red-700 dark:text-red-300 bg-red-100/70 dark:bg-red-950/60 border-red-300 dark:border-red-700' },
                      { val: 'decommissioned', label: 'Retired', color: 'text-slate-700 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800 border-slate-300 dark:border-slate-600' }
                    ].map(st => (
                      <button
                        key={st.val}
                        type="button"
                        onClick={() => setFormOperationalStatus(st.val as OperationalStatus)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                          formOperationalStatus === st.val
                            ? `${st.color} ring-2 ring-blue-500/50 shadow-xs scale-105`
                            : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 3: Target Centre and Classroom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Target Centre
                  </label>
                  <select
                    value={formCentreId}
                    onChange={(e) => setFormCentreId(e.target.value)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 cursor-pointer shadow-xs transition-all"
                  >
                    {centres.map(c => (
                      <option 
                        key={c.id} 
                        value={c.id}
                        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium py-2"
                      >
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Target Classroom
                  </label>
                  <select
                    value={formClassroomId}
                    onChange={(e) => setFormClassroomId(e.target.value)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 cursor-pointer shadow-xs transition-all"
                  >
                    {availableRooms.map(r => (
                      <option 
                        key={r.id} 
                        value={r.id}
                        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium py-2"
                      >
                        {r.name} [{r.code}] - Floor {r.floor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 4: Approved Quota and Detected Quantity */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Approved Quota (Norm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formApprovedQty}
                    onChange={(e) => setFormApprovedQty(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 shadow-xs transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                    Detected Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formDetectedQty}
                    onChange={(e) => setFormDetectedQty(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 shadow-xs transition-all"
                  />
                </div>
              </div>

              {/* Field 5: Expected Location in Room */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-slate-100 block mb-1.5">
                  Expected Location in Room
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. North wall workstation rows 1-3"
                  className="w-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl p-3 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-cyan-400 shadow-xs transition-all"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
