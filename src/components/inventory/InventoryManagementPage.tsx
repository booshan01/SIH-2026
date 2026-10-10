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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Asset Allocation & Registry
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Authorized Equipment Master</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Inventory Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure approved machinery quotas, classroom placement, and track physical asset availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Inventory Asset
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
            <label className="text-[11px] text-slate-500 font-medium">Centre:</label>
            <select
              value={centreFilter}
              onChange={(e) => setCentreFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Centres ({centres.length})</option>
              {centres.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search equipment name..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-44"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Centre & Classroom</th>
                <th className="py-3 px-4 text-center">Approved Norm</th>
                <th className="py-3 px-4 text-center">Detected Qty</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInventory.map((item) => {
                const centre = centres.find(c => c.id === item.centreId);
                const room = classrooms.find(r => r.id === item.classroomId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.itemName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {item.id}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-700">
                      {item.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{centre?.name}</div>
                      <div className="text-[11px] text-slate-500">{room?.name || 'Classroom'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      {item.approvedQuantity}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={item.detectedQuantity < item.approvedQuantity ? 'text-red-600' : 'text-emerald-700'}>
                        {item.detectedQuantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                        {item.operationalStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.itemName)}
                          className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">
                {editingItem ? 'Edit Approved Inventory Asset' : 'Add New Inventory Asset'}
              </h2>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Industrial Sewing Machine (Juki DDL-8100)"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EquipmentCategory)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 capitalize"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Condition</label>
                  <select
                    value={formOperationalStatus}
                    onChange={(e) => setFormOperationalStatus(e.target.value as OperationalStatus)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 capitalize"
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance_due">Maintenance Due</option>
                    <option value="faulty">Faulty</option>
                    <option value="decommissioned">Decommissioned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre</label>
                  <select
                    value={formCentreId}
                    onChange={(e) => setFormCentreId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    {centres.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Classroom</label>
                  <select
                    value={formClassroomId}
                    onChange={(e) => setFormClassroomId(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    {availableRooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Approved Quota (Norm)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formApprovedQty}
                    onChange={(e) => setFormApprovedQty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Detected Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formDetectedQty}
                    onChange={(e) => setFormDetectedQty(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Expected Location in Room</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. North wall workstation rows 1-3"
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
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
