import { useEffect, useState } from 'react';
import { useDesktopGuards } from './functions/useKeysBlock';
// import Titlebar from './components/Titlebar';
import { PingIndicator } from './components/PingIndicator';
import { send } from './bridge/send';

export default function Layout() {
  useDesktopGuards();
  const [isReady, setIsReady] = useState(false);

  const handleToggleReady = () => {
    const nextState = !isReady;
    setIsReady(nextState);

    const external = (window as Window & {
      external?: {
        sendMessage?: (message: string) => void;
      };
    }).external;

    if (external?.sendMessage) {
      external.sendMessage(nextState ? 'START' : 'STOP');
    }
  };

  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    send.invoke<string>('GetUser', {
      id: 42,
      includeDetails: 'Admin'
    })
      .then(setResult)
      .catch(console.error)
  }, [])

  console.log(result)

  return (
    <div className="min-h-screen bg-[#0e131d] text-[#ece5d8] flex flex-col select-none relative overflow-hidden">
      {/* <Titlebar /> */}
      {/* Фоновое свечение*/}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />


      <div className="flex gap-6 p-4 relative h-screen  w-full ">
        <div className="absolute right-3 top-3 z-10">
          <PingIndicator />
          {/* <p>{result}</p> */}
        </div>

        <div className='flex gap-4 w-full relative'>


          {/* Лобби */}
          <div className="w-72 flex flex-col gap-3 rounded-xl border border-[#d3bc8e]/20 bg-[#121925]/70 p-4 backdrop-blur-md shadow-2xl">

            <div className="text-xs uppercase tracking-widest text-[#d3bc8e]/70 font-semibold mb-1 px-1">
              Участники
            </div>

            {/* Карточка игрока 1 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#d3bc8e]/30 bg-linear-to-r from-[#212b3d] to-[#1a2232] p-3 shadow-md transition-all hover:border-[#d3bc8e]">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d3bc8e]/50 bg-[#2c374d]">
                <span className="text-sm font-bold text-[#e0b974]">E</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121925] bg-amber-400" title="Хост" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#ece5d8]">Ephtianura</span>
                <span className="text-[11px] text-[#a4b3c6]">Константин</span>
              </div>
            </div>

            {/* Карточка игрока 2 */}
            <div className="flex items-center gap-3 rounded-lg border border-[#d3bc8e]/10 bg-[#17202e]/50 p-3 opacity-80 transition-all hover:opacity-100 hover:border-[#d3bc8e]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-full relative border border-[#d3bc8e]/30 bg-[#232d3f]">
                <span className="text-sm font-bold text-[#a4b3c6]">E</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121925] bg-emerald-400" title="Хост" />

              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#ece5d8]">Ephtianura</span>
                <span className="text-[11px] text-emerald-400">Готов</span>
              </div>
            </div>
          </div>

          {/* Главная секция */}
          <div className="flex-1  flex flex-col justify-between rounded-xl border border-[#d3bc8e]/20 bg-[#121925]/80 p-8 backdrop-blur-xl shadow-2xl relative">

            {/* Декоративные орнаменты по углам */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#d3bc8e]/40" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#d3bc8e]/40" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#d3bc8e]/40" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#d3bc8e]/40" />

            {/* Центральный блок с инструментом */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="flex flex-col items-center gap-4">
                <span className=" uppercase tracking-widest text-[#d3bc8e] font-semibold border-b border-[#d3bc8e]/20 pb-1">
                  Ваш инструмент
                </span>

                {/* Фоновая плашка предмета под 5★*/}
                <div className="relative flex items-center justify-center max-w-52 max-h-52 rounded-2xl border border-[#e0b974]/40 bg-gradient-to-b from-[#a16828] via-[#523a1c] to-[#241a10] shadow-[0_0_30px_rgba(224,185,116,0.15)] group transition-transform duration-300 hover:scale-105">

                  {/* Сияние за инструментом */}
                  <div className="absolute inset-0 bg-amber-400/10 rounded-2xl blur-md group-hover:bg-amber-400/20 transition-all" />

                  <img
                    src="media/Item_Lingering_Euphonia.webp"
                    alt="Инструмент"
                    className="max-w-36 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10"
                  />

                </div>

                <h2 className="text-lg font-medium text-[#e0b974] tracking-wide mt-1">
                  Лира
                </h2>
              </div>
            </div>

            {/* Готов */}
            <div className='flex flex-col gap-1'>
              <div className="flex px-4 text-xs text-center">
                {isReady ? (
                  /* ПОСЛЕ */
                  <p className=" text-[#e0b974] leading-relaxed animate-fade-in bg-[#121925]/60 
                 backdrop-blur-sm">
                    <span className="font-medium text-[#fff2d6]">Партия может начаться в любой момент. </span>
                    Будут автоматически нажиматься клавиши клавиатуры – следите за указаниями организатора.
                  </p>
                ) : (
                  /* ДО */
                  <p className=" text-[#a4b3c6]/80 leading-relaxed">
                    <span>Нажимая </span>
                    <span className="text-[#d3bc8e] font-medium">«Готово»</span>
                    <span>, вы подтверждаете согласие на эмуляцию нажатий клавиш </span>
                    <code className="code-letter">Q-U</code>, <code className="code-letter">A-J</code>, <code className="code-letter">Z-M</code> в ходе исполнения партии.
                  </p>
                )}
              </div>
              <button
                onClick={handleToggleReady}
                className={`relative px-16 py-3.5 rounded-full font-bold tracking-wider 
                cursor-pointer transition-all active:scale-95 shadow-lg
                ${isReady
                    ? `bg-linear-to-r from-[#d9534f] via-[#ff6b6b] to-[#d9534f] 
                  text-white shadow-[0_0_20px_rgba(217,83,79,0.4)] border border-[#ff9999] brightness-90`

                    : `bg-linear-to-r from-[#e6c280] via-[#ffd993] to-[#e6c280] 
                  text-[#3b2b13] shadow-[0_0_20px_rgba(230,194,128,0.3)] border border-[#fff2d6] 
                  hover:brightness-101 hover:shadow-[0_0_15px_rgba(230,194,128,0.5)]`
                  }`}
              >
                {isReady ? 'ОТМЕНА' : 'ГОТОВО'}
              </button>
            </div>


          </div>
        </div>
      </div>

    </div>
  );
}