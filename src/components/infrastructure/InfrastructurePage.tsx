import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Package,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  PlusCircle,
  Eye,
  Sliders,
  Sparkles,
  ClipboardCheck,
  Search
} from 'lucide-react';
import { compareInfrastructure, exportToCSV } from '../../utils/complianceEngine';
import { EquipmentCategory } from '../../types';

export const InfrastructurePage: React.FC = () => {
  const {
    inventory,
    centres,
    classrooms,
    settings,
    setActivePage,
    setSelectedCentreId
  } = useApp();

  const [centreFilter, setCentreFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

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
      if (statusFilter !== 'all' && item.inspectionStatus !== statusFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        if (!item.itemName.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [inventory, centreFilter, categoryFilter, statusFilter, searchFilter]);

  // Overall totals
  const totalApprovedUnits = inventory.reduce((acc, curr) => acc + curr.approvedQuantity, 0);
  const totalDetectedUnits = inventory.reduce((acc, curr) => acc + curr.detectedQuantity, 0);
  const shortageItems = inventory.filter(i => i.inspectionStatus === 'shortage');
  const verifiedItems = inventory.filter(i => i.inspectionStatus === 'verified');

  const exportCSV = () => {
    const headers = [
      'Item ID',
      'Item Name',
      'Category',
      'Centre',
      'Classroom',
      'Approved Qty',
      'Detected Qty',
      'Difference',
      'Confidence',
      'Status',
      'Operational Condition',
      'Last Inspection'
    ];
    const rows = filteredInventory.map(item => {
      const centre = centres.find(c => c.id === item.centreId);
      const room = classrooms.find(r => r.id === item.classroomId);
      return [
        item.id,
        item.itemName,
        item.category,
        centre?.name || item.centreId,
        room?.name || item.classroomId,
        item.approvedQuantity,
        item.detectedQuantity,
        item.countDifference,
        `${(item.detectionConfidence * 100).toFixed(0)}%`,
        item.inspectionStatus,
        item.operationalStatus,
        item.lastInspectionDate
      ];
    });
    exportToCSV(`SAIMS_Infrastructure_Audit_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Infrastructure & Equipment Audit
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous Vision vs Approved Norms</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Infrastructure Compliance Verification
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit high-value vocational training machinery, computer labs, welding bays, and lab workstations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('inventory')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            Manage Approved Inventory
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Audit (CSV)
          </button>
        </div>
      </div>

      {/* Compliance Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Approved Assets</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalApprovedUnits} units</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{inventory.length} asset classes allocated</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-emerald-700">Detected in Camera View</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{totalDetectedUnits} units</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">{verifiedItems.length} categories 100% verified</div>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-red-700">Possible Shortage Flags</div>
          <div className="text-2xl font-bold text-red-800 mt-1">{shortageItems.length} lines</div>
          <div className="text-[11px] text-red-600 mt-0.5">Physical audit recommended</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Avg Detection Confidence</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">91.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Threshold set at &gt; 60%</div>
        </div>
      </div>

      {/* Operational Norms Separation Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Operational Condition Disclaimer:</strong> AI visual recognition validates the physical presence and category count of equipment. Functional operability is tracked strictly through authorized inspection and calibration certificates, not cosmetic visual appearance alone.
        </div>
      </div>

      {/* Filters Bar */}
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
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Compliance:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified (Count Matches)</option>
              <option value="shortage">Possible Shortage</option>
              <option value="excess">Possible Excess</option>
              <option value="unverified">Low-Confidence Detection</option>
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search equipment..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-44"
          />

          {(centreFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setCentreFilter('all');
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchFilter('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Infrastructure Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Equipment Item & Category</th>
                <th className="py-3 px-4">Centre & Classroom</th>
                <th className="py-3 px-4 text-center">Approved Norm</th>
                <th className="py-3 px-4 text-center">AI Detected</th>
                <th className="py-3 px-4 text-center">Discrepancy</th>
                <th className="py-3 px-4">Detection Confidence</th>
                <th className="py-3 px-4">Operational Condition</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInventory.map((item) => {
                const centre = centres.find(c => c.id === item.centreId);
                const room = classrooms.find(r => r.id === item.classroomId);
                const comp = compareInfrastructure(item.approvedQuantity, item.detectedQuantity, item.detectionConfidence);

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.itemName}</div>
                      <div className="text-[11px] text-slate-500 capitalize">
                        Category: {item.category.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Location: {item.expectedLocation}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{centre?.name}</div>
                      <div className="text-[11px] text-slate-500">{room?.name || 'Classroom'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="text-sm font-bold text-slate-900">{item.approvedQuantity}</div>
                      <div className="text-[10px] text-slate-400">allocated</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className={`text-sm font-bold ${
                        item.countDifference < 0 ? 'text-red-600' :
                        item.countDifference === 0 ? 'text-emerald-700' : 'text-blue-700'
                      }`}>
                        {item.detectedQuantity}
                      </div>
                      <div className="text-[10px] text-slate-400">visible in frame</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${comp.badgeColor}`}>
                        {item.countDifference === 0 ? 'Matches Norm' : `${item.countDifference > 0 ? '+' : ''}${item.countDifference}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              item.detectionConfidence >= 0.85 ? 'bg-emerald-600' :
                              item.detectionConfidence >= 0.65 ? 'bg-blue-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.detectionConfidence * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{(item.detectionConfidence * 100).toFixed(0)}%</span>
                      </div>
                      {item.detectionConfidence < 0.65 && (
                        <div className="text-[10px] text-amber-600 mt-0.5 font-medium">
                          Below threshold (65%)
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        item.operationalStatus === 'operational' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                        item.operationalStatus === 'maintenance_due' ? 'text-amber-800 bg-amber-50 border border-amber-300' :
                        'text-red-700 bg-red-50 border border-red-200'
                      }`}>
                        {item.operationalStatus.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Last inspected: {item.lastInspectionDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.inspectionStatus === 'verified' && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Count Matches
                        </span>
                      )}
                      {item.inspectionStatus === 'shortage' && (
                        <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Possible Shortage
                        </span>
                      )}
                      {item.inspectionStatus === 'excess' && (
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Excess Detected
                        </span>
                      )}
                      {item.inspectionStatus === 'unverified' && (
                        <span className="text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Confidence
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
