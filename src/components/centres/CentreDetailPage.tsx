import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ArrowLeft,
  Video,
  Package,
  UserCheck,
  AlertTriangle,
  PlusCircle,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { Classroom, RoomType } from '../../types';

export const CentreDetailPage: React.FC = () => {
  const {
    selectedCentreId,
    centres,
    classrooms,
    cameras,
    inventory,
    attendance,
    alerts,
    addClassroom,
    setActivePage,
    setSelectedCentreId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classrooms' | 'inventory' | 'attendance' | 'alerts'>('classrooms');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Form State for new room
  const [roomName, setRoomName] = useState('New Simulation Workshop');
  const [roomCode, setRoomCode] = useState('SIM-01');
  const [roomType, setRoomType] = useState<RoomType>('vocational_workshop');
  const [roomFloor, setRoomFloor] = useState('1st Floor East');
  const [roomCapacity, setRoomCapacity] = useState(30);

  const centre = centres.find(c => c.id === selectedCentreId) || centres[0];

  const centreRooms = classrooms.filter(r => r.centreId === centre.id);
  const centreCameras = cameras.filter(c => c.centreId === centre.id);
  const centreInventory = inventory.filter(i => i.centreId === centre.id);
  const centreAttendance = attendance.filter(a => a.centreId === centre.id);
  const centreAlerts = alerts.filter(a => a.centreId === centre.id);

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    addClassroom({
      centreId: centre.id,
      name: roomName,
      code: roomCode,
      roomType,
      floor: roomFloor,
      capacity: Number(roomCapacity),
    });
    setShowAddRoomModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('centres')}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Centres
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Centre Code: {centre.code}</span>
        </div>
      </div>

      {/* Centre Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {centre.code}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                centre.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                'bg-amber-50 text-amber-800 border border-amber-300'
              }`}>
                {centre.status === 'active' ? 'Active & Monitored' : 'Audit Required'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">{centre.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{centre.address} · {centre.district}, {centre.state}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Compliance Index</div>
              <div className={`text-xl font-bold ${
                centre.complianceScore >= 90 ? 'text-emerald-700' :
                centre.complianceScore >= 75 ? 'text-amber-700' : 'text-red-600'
              }`}>
                {centre.complianceScore}%
              </div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Centre Manager</div>
              <div className="font-semibold text-slate-800">{centre.managerName}</div>
              <div className="text-[11px] text-slate-500">{centre.contactPhone}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 pt-2">
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'classrooms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Classrooms & Cameras ({centreRooms.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Allocated Inventory ({centreInventory.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'attendance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Attendance Logs ({centreAttendance.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'alerts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Alerts & Flags ({centreAlerts.length})
          </button>
        </div>
      </div>

      {/* Tab Content: Classrooms & Cameras */}
      {activeTab === 'classrooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Registered Classrooms & Camera Nodes</h3>
            <button
              onClick={() => setShowAddRoomModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Classroom
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centreRooms.map(room => {
              const roomCams = cameras.filter(c => c.classroomId === room.id);
              return (
                <div key={room.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{room.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Code: {room.code} · {room.floor}</div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded capitalize">
                      {room.roomType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex justify-between">
                    <span>Capacity: <strong>{room.capacity} Trainees</strong></span>
                    <span>Installed Cameras: <strong>{roomCams.length}</strong></span>
                  </div>

                  {/* Camera List for this room */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">CCTV Nodes</div>
                    {roomCams.length === 0 ? (
                      <div className="text-[11px] text-amber-600">No camera assigned to this room</div>
                    ) : (
                      roomCams.map(cam => (
                        <div key={cam.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${cam.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="font-semibold text-slate-800">{cam.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">{cam.coveragePercentage}% Coverage</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Equipment Allocation for {centre.name}</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Approved Norm</th>
                <th className="py-3 px-4 text-center">AI Detected</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {centreInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.itemName}</td>
                  <td className="py-3 px-4 capitalize">{item.category.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{item.approvedQuantity}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span className={item.detectedQuantity < item.approvedQuantity ? 'text-red-600' : 'text-emerald-700'}>
                      {item.detectedQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize">{item.operationalStatus.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      item.inspectionStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                      item.inspectionStatus === 'shortage' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-800'
                    }`}>
                      {item.inspectionStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Attendance */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Attendance History for {centre.name}</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Batch Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Submitted</th>
                <th className="py-3 px-4 text-center">AI Visual</th>
                <th className="py-3 px-4 text-center">Difference</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {centreAttendance.map(att => (
                <tr key={att.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{att.batchName}</td>
                  <td className="py-3 px-4">{att.sessionDate}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{att.submittedPresent}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{att.estimatedPeopleCount}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      att.absoluteDifference === 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {att.absoluteDifference}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize font-medium">{att.verificationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Alerts */}
      {activeTab === 'alerts' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900">Alerts & Discrepancy Log for {centre.name}</h3>
          </div>
          <div className="divide-y divide-slate-100 p-4">
            {centreAlerts.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-4">No alerts recorded for this centre</div>
            ) : (
              centreAlerts.map(alt => (
                <div key={alt.id} className="py-3 text-xs flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        alt.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="font-semibold text-slate-900">{alt.title}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{alt.explanation}</p>
                    {alt.resolutionNotes && (
                      <div className="mt-1 text-[11px] text-blue-700 font-medium">
                        Resolution Note: {alt.resolutionNotes}
                      </div>
                    )}
                  </div>
                  <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 shrink-0">
                    {alt.reviewStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Classroom */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Add Classroom / Lab</h2>
              <button onClick={() => setShowAddRoomModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Room Code</label>
                  <input
                    type="text"
                    required
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 capitalize"
                  >
                    <option value="computer_lab">Computer Lab</option>
                    <option value="vocational_workshop">Vocational Workshop</option>
                    <option value="welding_bay">Welding Bay</option>
                    <option value="electrical_lab">Electrical Lab</option>
                    <option value="theory_classroom">Theory Classroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Floor / Wing</label>
                  <input
                    type="text"
                    required
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Capacity (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
