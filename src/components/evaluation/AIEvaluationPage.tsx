import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Activity,
  Zap,
  Sliders,
  Layers,
  X
} from 'lucide-react';
import { calculateEvaluationMetrics } from '../../utils/complianceEngine';
import { BenchmarkItem } from '../../types';

export const AIEvaluationPage: React.FC = () => {
  const { benchmarks, addBenchmarkSample, settings } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [sampleName, setSampleName] = useState('New Benchmark Video Clip');
  const [centreType, setCentreType] = useState('Computer Lab');
  const [gtPeople, setGtPeople] = useState(25);
  const [aiPeople, setAiPeople] = useState(24);
  const [tp, setTp] = useState(48);
  const [fp, setFp] = useState(1);
  const [fn, setFn] = useState(2);
  const [tn, setTn] = useState(110);
  const [latency, setLatency] = useState(42);

  const metrics = calculateEvaluationMetrics(benchmarks);

  const handleAddSample = (e: React.FormEvent) => {
    e.preventDefault();
    addBenchmarkSample({
      sampleName,
      centreType,
      groundTruthPeopleCount: Number(gtPeople),
      aiEstimatedPeopleCount: Number(aiPeople),
      groundTruthEquipment: { computers: 30 },
      aiDetectedEquipment: { computers: 29 },
      inferenceLatencyMs: Number(latency),
      truePositives: Number(tp),
      falsePositives: Number(fp),
      falseNegatives: Number(fn),
      trueNegatives: Number(tn),
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Scientific Model Evaluation
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Rigorous Ground-Truth Benchmarking</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            AI Model Performance Evaluation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Empirical validation against manual ground-truth annotations. Precision, Recall, MAE, and inference latency.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Ground-Truth Benchmark Sample
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Model Precision</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">TP / (TP + FP)</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Model Recall</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {(metrics.recall * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">TP / (TP + FN)</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Headcount MAE</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {metrics.peopleCountMAE.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Mean Absolute Error (trainees)</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Inference Speed</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {metrics.avgLatencyMs} ms
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{metrics.fpsThroughput} FPS throughput</div>
        </div>
      </div>

      {/* Detailed Confusion Matrix & Evaluation Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confusion Matrix Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Cumulative Confusion Matrix</h3>
          <p className="text-xs text-slate-500 mb-4">Object classification outcomes across {benchmarks.length} benchmark runs</p>

          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-[10px] font-semibold text-emerald-800 uppercase">True Positives (TP)</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                {benchmarks.reduce((a, b) => a + b.truePositives, 0)}
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Correctly detected</div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-[10px] font-semibold text-amber-800 uppercase">False Positives (FP)</div>
              <div className="text-2xl font-bold text-amber-700 mt-1 font-mono">
                {benchmarks.reduce((a, b) => a + b.falsePositives, 0)}
              </div>
              <div className="text-[10px] text-amber-600 mt-0.5">Spurious detections</div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="text-[10px] font-semibold text-red-800 uppercase">False Negatives (FN)</div>
              <div className="text-2xl font-bold text-red-700 mt-1 font-mono">
                {benchmarks.reduce((a, b) => a + b.falseNegatives, 0)}
              </div>
              <div className="text-[10px] text-red-600 mt-0.5">Missed objects</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-semibold text-slate-700 uppercase">True Negatives (TN)</div>
              <div className="text-2xl font-bold text-slate-800 mt-1 font-mono">
                {benchmarks.reduce((a, b) => a + b.trueNegatives, 0)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Correct background</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">False Positive Rate (FPR):</span>
              <span className="font-mono font-bold text-slate-800">{(metrics.falsePositiveRate * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">False Negative Rate (FNR):</span>
              <span className="font-mono font-bold text-slate-800">{(metrics.falseNegativeRate * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">F1 Harmonic Score:</span>
              <span className="font-mono font-bold text-emerald-700">{(metrics.f1Score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Benchmarks Dataset Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Empirical Benchmark Datasets</h3>
              <p className="text-xs text-slate-500">Annotated clips with ground truth human and equipment counts</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{benchmarks.length} sample runs</span>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Benchmark Clip</th>
                  <th className="py-2.5 px-3">Environment</th>
                  <th className="py-2.5 px-3 text-center">Ground Truth</th>
                  <th className="py-2.5 px-3 text-center">AI Estimate</th>
                  <th className="py-2.5 px-3 text-center">Diff (Error)</th>
                  <th className="py-2.5 px-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {benchmarks.map((item) => {
                  const error = Math.abs(item.aiEstimatedPeopleCount - item.groundTruthPeopleCount);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.sampleName}</td>
                      <td className="py-2.5 px-3">{item.centreType}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{item.groundTruthPeopleCount}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{item.aiEstimatedPeopleCount}</td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${error === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                          {error === 0 ? '0 (Perfect)' : `Δ ${error}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">{item.inferenceLatencyMs} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add Ground-Truth Benchmark Sample */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Add Benchmark Ground-Truth Clip</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSample} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sample Title</label>
                <input
                  type="text"
                  required
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Training Environment</label>
                <input
                  type="text"
                  required
                  value={centreType}
                  onChange={(e) => setCentreType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ground Truth People</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={gtPeople}
                    onChange={(e) => setGtPeople(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">AI Detected People</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={aiPeople}
                    onChange={(e) => setAiPeople(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">TP</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={tp}
                    onChange={(e) => setTp(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">FP</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={fp}
                    onChange={(e) => setFp(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">FN</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={fn}
                    onChange={(e) => setFn(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">TN</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={tn}
                    onChange={(e) => setTn(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Inference Latency (ms)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={latency}
                  onChange={(e) => setLatency(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Add Benchmark Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
