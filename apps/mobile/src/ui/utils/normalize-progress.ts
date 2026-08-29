type ProgressValues = {
  max: number;
  value: number;
};

export const normalizeProgress = ({ max, value }: ProgressValues) => {
  const normalizedMax = Number.isFinite(max) ? Math.max(max, 0) : 0;
  const normalizedValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), normalizedMax)
    : 0;

  return {
    fraction: normalizedMax > 0 ? normalizedValue / normalizedMax : 0,
    max: normalizedMax,
    value: normalizedValue,
  };
};
