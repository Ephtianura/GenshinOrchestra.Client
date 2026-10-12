import { useEffect, useState } from 'react';
import { receive } from './bridge/receive';
import { formatBytes, formatTime } from './functions/formatBytesTime';

type ProgressPayload = {
  percent: number;
  message?: string | null;
  error?: string | null;
  bytesDownloaded?: number;
  totalBytes?: number;
  bytesPerSecond?: number;
  secondsRemaining?: number;
};

export default function Updating() {
  const [state, setState] = useState({
    percent: 0,
    message: 'Подготовка к загрузке...',
    error: null as string | null,
    downloadedStr: '0 B',
    totalStr: '0 B',
    speedStr: '0 B/s',
    timeStr: '0 сек',
  });

  useEffect(() => {
    const unsubscribe = receive.on('UpdateProgress', (data: ProgressPayload) => {
      try {
        setState({
          percent: Math.min(Math.max(data.percent ?? 0, 0), 100),
          message: data.message || ``,
          error: data.error ?? null,
          downloadedStr: formatBytes(data.bytesDownloaded ?? 0),
          totalStr: formatBytes(data.totalBytes ?? 0),
          speedStr: `${formatBytes(data.bytesPerSecond ?? 0)}/s`,
          timeStr: formatTime(data.secondsRemaining ?? 0),
        });
        console.log(state);
      } catch (err) {
        console.error('Ошибка обработки сообщения:', err);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#181825] text-[#cdd6f4] select-none p-6 ">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-1">
          <h2 className="text-xl tracking-wide text-[#cba6f7]">
            Genshin Orchestra
          </h2>
          <p className="text-sm text-[#a6adc8]">Обновление приложения</p>
        </div>

        {state.error ? (
          <div className="p-3 bg-[#f38ba8]/10 border border-[#f38ba8] rounded-lg text-[#f38ba8] text-sm">
            {state.error}
            {/* <div>Try again</div> */}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative w-full flex items-center">
              {/* Левый ромбик */}
              <div className="absolute -left-3 w-2 h-2 bg-[#FDFDFD] rotate-45 z-10 shadow-sm" />

              {/* Прогресс-бар */}
              <div className="relative w-full h-4 bg-[#313244] shadow-inner 
                  [clip-path:polygon(2%_0%,98%_0%,100%_50%,98%_100%,2%_100%,0%_50%)] overflow-hidden">
                {/* Заполнение */}
                <div
                  className="h-full bg-linear-to-r from-[#89b4fa] to-[#cba6f7] transition-all duration-300 ease-out"
                  style={{ width: `${state.percent}%` }}
                />
              </div>
              {/* Правый ромбик */}
              <div className="absolute -right-3 w-2 h-2 bg-[#FDFDFD] rotate-45 z-10 shadow-sm" />
            </div>

            <div className="flex justify-between items-center text-xs text-[#bac2de] px-1">
              <span className="truncate max-w-100">{state.message}</span>
              <span className="  text-[#89b4fa]">
                {state.percent}%
              </span>
            </div>

            <hr className='text-[#313244]/60 my-3' />

            <div className="flex items-start justify-between gap-2 text-xs h-10">
              <span className="text-[#a6adc8]">Осталось времени: {state.timeStr}</span>
              {state.percent < 100 &&
                <div className='flex flex-col text-[12px]'>
                  <div>
                    <span className=" text-[#cdd6f4]">
                      {state.downloadedStr}
                    </span>
                    {state.totalStr &&
                      <span className="text-[#a6adc8]"> / {state.totalStr}</span>
                    }
                  </div>
                  <span className=" text-[#cdd6f4]">
                    {state.speedStr}
                  </span>
                </div>
              }
            </div>
          </div>
        )}
      </div>

      <div className='w-50'>
        {state.error == null ?
          <img src="media/furina-accordion.gif" />
          :
          <img src="media/sad_furina.png" />
        }
      </div>
    </div>
  );
}