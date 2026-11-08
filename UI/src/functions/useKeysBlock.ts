import { useEffect } from "react";

export function useDesktopGuards() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const allowedCtrlKeys = [
        "c",
        "v",
        "x",
        "a",
        "z",
        "y",
        "=",
        "-",
        "+",
        "_",
        "0",
        "с",
        "м",
        "ч",
        "ф",
        "я",
        "н",
      ];

      // Разрешить Alt + F4
      if (e.altKey && e.key === "F4") {
        return;
      }

      if (
        import.meta.env.DEV &&
        e.key.startsWith("F") &&
        !isNaN(Number(e.key.slice(1)))
      ) {
        return;
      }

      if (e.key.startsWith("F") && !isNaN(Number(e.key.slice(1)))) {
        e.preventDefault();
        return;
      }
      // Блок Ctrl / Cmd
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();

        // Проверка на порог зума >= 150%: запрещаем дальнейшее увеличение (+, =)
        const currentZoom = Math.round(window.devicePixelRatio * 100);
        if (currentZoom >= 150 && (key === "+" || key === "=")) {
          e.preventDefault();
          return;
        }

        if (!allowedCtrlKeys.includes(key)) {
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
        // Проверка на порог зума >= 150%: запрещаем зумить колесиком вверх (увеличение)
        const currentZoom = Math.round(window.devicePixelRatio * 100);
        if (currentZoom >= 150 && e.deltaY < 0) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
      }
    };

    let lastPixelRatio = window.devicePixelRatio;

    const handleResize = () => {
      if (window.devicePixelRatio !== lastPixelRatio) {
        lastPixelRatio = window.devicePixelRatio;
      }
    };

    // Слушатели
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", handleResize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
