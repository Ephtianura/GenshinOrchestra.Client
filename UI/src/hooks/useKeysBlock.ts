import { useEffect } from 'react';

export function useDesktopGuards() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const allowedCtrlKeys = ['c', 'v', 'x', 'a', 'z', 'y', '=', '-', '+', '_', '0'];

      // Разрешить Alt + F4 
      if (e.altKey && e.key === 'F4') {
        return;
      }

      // Блок F1 - F12
      if (/^F(1[0-2]|[1-9])$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Блок Ctrl / Cmd
      if (e.ctrlKey || e.metaKey) {
        if (!allowedCtrlKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
        }
      }

      // Блок Alt-комбинации
      if (e.altKey) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Слушатели
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
}