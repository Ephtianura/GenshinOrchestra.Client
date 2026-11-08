export const UrInstrument = () => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-4">
                <span className=" uppercase tracking-widest text-[#d3bc8e] font-semibold border-b border-[#d3bc8e]/20 pb-1">
                    Ваш инструмент
                </span>

                {/* Фоновая плашка предмета под 5★*/}
                <div className="relative flex items-center justify-center w-26 h-26 lg:w-52 lg:h-52 rounded-2xl border border-[#e0b974]/40 bg-linear-to-b from-[#a16828] via-[#523a1c] to-[#241a10] shadow-[0_0_30px_rgba(224,185,116,0.15)] group transition-transform duration-300 hover:scale-105">

                    {/* Сияние за инструментом */}
                    <div className="absolute inset-0 bg-amber-400/10 rounded-2xl blur-md group-hover:bg-amber-400/20 transition-all" />

                    <img
                        src="media/Item_Lingering_Euphonia.webp"
                        alt="Инструмент"
                        className="w-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10"
                    />

                </div>

                <h2 className="text-lg font-medium text-[#e0b974] tracking-wide mt-1">
                    Лира
                </h2>
            </div>
        </div>
    );
};