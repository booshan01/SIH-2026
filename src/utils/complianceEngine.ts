import { BenchmarkItem, EvaluationMetrics, InspectionStatus } from '../types';

/**
 * Attendance Compliance Engine
 * Calculates discrepancy and flags per MSDE compliance standards
 */
export function calculateAttendanceDiscrepancy(
  submittedPresent: number,
  estimatedPeopleCount: number,
  threshold: number = 3,
  confidenceScore: number = 0.85
) {
  const absoluteDifference = Math.abs(submittedPresent - estimatedPeopleCount);
  const percentageDifference = submittedPresent > 0 
    ? Math.round((absoluteDifference / submittedPresent) * 100 * 10) / 10 
    : 0;

  const isDiscrepant = absoluteDifference >= threshold;
  const isConfidenceLow = confidenceScore < 0.65;

  let flagReason = '';
  if (isConfidenceLow) {
    flagReason = 'Low AI detection confidence score (< 0.65). Human verification required.';
  } else if (isDiscrepant) {
    if (estimatedPeopleCount < submittedPresent) {
      flagReason = `Visual count (${estimatedPeopleCount}) is significantly lower than submitted attendance (${submittedPresent}) by ${absoluteDifference} trainees.`;
    } else {
      flagReason = `Visual count (${estimatedPeopleCount}) exceeds submitted attendance (${submittedPresent}) by ${absoluteDifference} trainees.`;
    }
  }

  return {
    absoluteDifference,
    percentageDifference,
    isDiscrepant,
    isConfidenceLow,
    flagReason,
  };
}

/**
 * Infrastructure Compliance Engine
 * Validates approved equipment versus detected counts
 */
export function compareInfrastructure(
  approvedQuantity: number,
  detectedQuantity: number,
  confidence: number,
  minConfidence: number = 0.60
): {
  countDifference: number;
  status: InspectionStatus;
  label: string;
  badgeColor: string;
  explanation: string;
} {
  const countDifference = detectedQuantity - approvedQuantity;

  if (confidence < minConfidence) {
    return {
      countDifference,
      status: 'unverified',
      label: 'Low Confidence Detection',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      explanation: `Detection confidence (${(confidence * 100).toFixed(0)}%) is below acceptable threshold (${(minConfidence * 100).toFixed(0)}%). Visual confirmation needed.`,
    };
  }

  if (countDifference === 0) {
    return {
      countDifference: 0,
      status: 'verified',
      label: 'Count Matches Approved',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      explanation: `Detected count matches approved inventory allocation (${approvedQuantity}/${approvedQuantity}).`,
    };
  }

  if (countDifference < 0) {
    return {
      countDifference,
      status: 'shortage',
      label: `Possible Shortage (${Math.abs(countDifference)})`,
      badgeColor: 'text-red-700 bg-red-50 border-red-200',
      explanation: `Shortage detected: Expected ${approvedQuantity} items, but only ${detectedQuantity} visible in camera frame. Discrepancy: ${Math.abs(countDifference)}.`,
    };
  }

  return {
    countDifference,
    status: 'excess',
    label: `Possible Excess (+${countDifference})`,
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    explanation: `Excess equipment detected: Expected ${approvedQuantity}, but ${detectedQuantity} items detected in room.`,
  };
}

/**
 * AI Performance Evaluation Calculations
 * Safely handles edge cases like zero denominators
 */
export function calculateEvaluationMetrics(benchmarks: BenchmarkItem[]): EvaluationMetrics {
  if (!benchmarks || benchmarks.length === 0) {
    return {
      totalSamples: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      peopleCountMAE: 0,
      falsePositiveRate: 0,
      falseNegativeRate: 0,
      avgLatencyMs: 0,
      fpsThroughput: 0,
    };
  }

  let totalTP = 0;
  let totalFP = 0;
  let totalFN = 0;
  let totalTN = 0;
  let totalAbsPeopleDiff = 0;
  let totalLatency = 0;

  for (const item of benchmarks) {
    totalTP += item.truePositives;
    totalFP += item.falsePositives;
    totalFN += item.falseNegatives;
    totalTN += item.trueNegatives;
    totalAbsPeopleDiff += Math.abs(item.aiEstimatedPeopleCount - item.groundTruthPeopleCount);
    totalLatency += item.inferenceLatencyMs;
  }

  const sampleCount = benchmarks.length;
  const precisionDenominator = totalTP + totalFP;
  const recallDenominator = totalTP + totalFN;
  const fprDenominator = totalFP + totalTN;

  const precision = precisionDenominator > 0 ? totalTP / precisionDenominator : 0;
  const recall = recallDenominator > 0 ? totalTP / recallDenominator : 0;
  const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const peopleCountMAE = totalAbsPeopleDiff / sampleCount;
  const falsePositiveRate = fprDenominator > 0 ? totalFP / fprDenominator : 0;
  const falseNegativeRate = recallDenominator > 0 ? totalFN / recallDenominator : 0;
  const avgLatencyMs = Math.round(totalLatency / sampleCount);
  const fpsThroughput = avgLatencyMs > 0 ? Math.round((1000 / avgLatencyMs) * 10) / 10 : 0;

  return {
    totalSamples: sampleCount,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    f1Score: Math.round(f1Score * 1000) / 1000,
    peopleCountMAE: Math.round(peopleCountMAE * 100) / 100,
    falsePositiveRate: Math.round(falsePositiveRate * 1000) / 1000,
    falseNegativeRate: Math.round(falseNegativeRate * 1000) / 1000,
    avgLatencyMs,
    fpsThroughput,
  };
}

/**
 * Universal CSV Export
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number | boolean)[][]) {
  const sanitize = (val: string | number | boolean) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(','))
  ];

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format timestamps nicely in Indian Standard Time (IST) format
 */
export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatDateOnly(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
