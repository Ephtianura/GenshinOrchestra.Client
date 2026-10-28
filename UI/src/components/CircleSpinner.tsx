
interface SpinnerProps {
  size?: number;        // Размер иконки в px (по умолчанию 16px)
  strokeWidth?: number; // Толщина кольца в px (по умолчанию 4px)
  color?: string;       // Цвет
  speed?: string;       // Скорость вращения (по умолчанию 2s)
  className?: string;
}

export const CircleSpinner = ({
  size = 16,
  strokeWidth = 4,
  color = 'var(--good-ping)',
  speed = '2s',
  className = '',
}: SpinnerProps) => {
  return (
    <div
      className={`relative inline-block animate-spin ${className}`}
      style={{ width: size, height: size, animationDuration: speed }}
    >
      {/* Вырезанный круг с коническим градиентом от цветного к прозрачному */}
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent 10%, ${color} 100%)`,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${strokeWidth}px), #000 calc(100% - ${strokeWidth}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${strokeWidth}px), #000 calc(100% - ${strokeWidth}px))`,
        }}
      />
      {/* Закругление на начале змейки */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: strokeWidth,
          height: strokeWidth,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default CircleSpinner;