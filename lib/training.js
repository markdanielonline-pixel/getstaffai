/**
 * Computes current training progress (0-100) from stored start time + duration.
 * Ported from staffai-web/lib/training.ts.
 */
export function computeTrainingProgress(employee) {
  if (employee.status !== 'training' || !employee.training_started_at) return 100;
  const elapsedSeconds = (Date.now() - new Date(employee.training_started_at).getTime()) / 1000;
  const duration = employee.training_duration_seconds ?? 5400;
  return Math.min(100, Math.round((elapsedSeconds / duration) * 100));
}

export function isTrainingComplete(employee) {
  if (employee.status !== 'training') return false;
  return computeTrainingProgress(employee) >= 100;
}
