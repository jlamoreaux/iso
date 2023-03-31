export function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEndOfDay(date: Date) {
  const startOfDay = getStartOfDay(date);
  return new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
}
