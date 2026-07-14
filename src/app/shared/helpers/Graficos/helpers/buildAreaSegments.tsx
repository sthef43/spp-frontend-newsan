interface ChartData<T> {
  data: T[];
  valueKey: string;
  threshold: number;
}

export const buildAreaSegments = <T,>({ data, valueKey, threshold }: ChartData<T>) => {
  return data.map((item, index) => {
    const value = item[valueKey] as number;
    const previous = index > 0 ? (data[index - 1][valueKey] as number) : undefined;
    const next = index < data.length - 1 ? (data[index + 1][valueKey] as number) : undefined;
    const isLow = value < threshold;
    const belongsToLowSegment = isLow || (previous !== undefined && previous < threshold && value >= threshold);
    return {
      ...item,
      normal: belongsToLowSegment ? null : value,
      warning: belongsToLowSegment ? value : null
    };
  });
};
