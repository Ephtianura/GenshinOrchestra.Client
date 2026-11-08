import { useReady } from '../functions/useReady';
import { useTrackReceiver } from '../functions/useTrackReceiver';

interface ReadyButtonProps {
    roomId: string | null
    userId: string | null
}

export const ReadyButton = ({ roomId, userId }: ReadyButtonProps) => {
    const { isReady, toggleReady } = useReady(roomId, userId ?? "");

    useTrackReceiver(isReady);

    if (!roomId || !userId) return null;
    
    return (
        <div className='flex flex-col gap-1'>
            <div className="flex px-4 text-xs text-center">
                {isReady ? (
                    /* ПОСЛЕ */
                    <p className=" text-[#e0b974] leading-relaxed animate-fade-in bg-[#121925]/60 backdrop-blur-sm">
                        <span className="font-medium text-[#fff2d6]">Партия может начаться в любой момент. </span>
                        Будут автоматически нажиматься клавиши клавиатуры – следите за указаниями организатора.
                    </p>
                ) : (
                    /* ДО */
                    <p className=" text-[#a4b3c6]/80 leading-relaxed text-[9px] lg:text-xs">
                        <span>Нажимая </span>
                        <span className="text-[#d3bc8e] font-medium">«Готов»</span>
                        <span>, вы подтверждаете согласие на эмуляцию нажатий клавиш </span>
                        <span className='whitespace-nowrap'>
                            <code className="code-letter">Q-U</code>, <code className="code-letter">A-J</code>, <code className="code-letter">Z-M</code>
                        </span>
                        <span> в ходе исполнения партии.</span>
                    </p>
                )}
            </div>
            <button
                onClick={toggleReady}
                className={`relative px-16 py-0 lg:py-3.5 rounded-full font-bold tracking-wider 
                cursor-pointer transition-all active:scale-95 shadow-lg
                ${isReady
                        ? `bg-linear-to-r from-[#d9534f] via-[#ff6b6b] to-[#d9534f] 
                  text-white shadow-[0_0_20px_rgba(217,83,79,0.4)] border border-[#ff9999] brightness-90`

                        : `bg-linear-to-r from-[#e6c280] via-[#ffd993] to-[#e6c280] 
                  text-[#3b2b13] shadow-[0_0_20px_rgba(230,194,128,0.3)] border border-[#fff2d6] 
                  hover:brightness-101 hover:shadow-[0_0_15px_rgba(230,194,128,0.5)]`
                    }`}
            >
                {isReady ? 'ОТМЕНА' : 'ГОТОВ'}
            </button>
        </div>
    );
};