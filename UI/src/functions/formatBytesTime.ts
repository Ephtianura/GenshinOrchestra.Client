
// Функция умного форматирования размеров 
// (100 кб -> 999кб -> 1.11мб -> 1.91мб -> 100мб -> 999мб -> 1.11гб -> 1.91гб)
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  const value = bytes / Math.pow(1024, i);
  
  const decimals = value < 10 && i > 0 ? 1 : 2;
  
  return `${value.toFixed(decimals)} ${units[i]}`;
}

// Форматирование времени (сек -> "2 мин 15 сек")
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return '0 сек';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs} сек`;
  return `${mins} мин ${secs} сек`;
}