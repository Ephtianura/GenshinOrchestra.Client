import { PiMusicNotesLight } from "react-icons/pi";
import { useInstrumentReceiver } from "../functions/useInstrumentReceiver";
import { GENSHIN_INSTRUMENT_FILE_NAMES, GENSHIN_INSTRUMENT_LABELS_RU, GenshinInstruments } from "../types/GenshinInstruments";

interface UrInstrumentProps {
    initInstrument: GenshinInstruments | null
}

export const UrInstrument = ({ initInstrument }: UrInstrumentProps) => {
    const instrument = useInstrumentReceiver(initInstrument);
    return (
        <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-4">

                <span className="uppercase tracking-widest text-[#d3bc8e] font-semibold border-b border-[#d3bc8e]/20 pb-1">
                    Ваш инструмент
                </span>

                {instrument !== null ? (
                    <>
                        <div className="relative flex items-center justify-center w-26 h-26 lg:w-52 lg:h-52 rounded-2xl border border-[#e0b974]/40 bg-linear-to-b from-[#a16828] via-[#523a1c] to-[#241a10] shadow-[0_0_30px_rgba(224,185,116,0.15)] group transition-transform duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-amber-400/10 rounded-2xl blur-md group-hover:bg-amber-400/20 transition-all" />

                            <img
                                src={`media/${GENSHIN_INSTRUMENT_FILE_NAMES[instrument]}`}
                                alt={GENSHIN_INSTRUMENT_LABELS_RU[instrument]}
                                className="w-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] z-10"
                            />
                        </div>

                        <h2 className="text-lg font-medium text-[#e0b974] tracking-wide mt-1">
                            {GENSHIN_INSTRUMENT_LABELS_RU[instrument]}
                        </h2>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-26 h-26 lg:w-52 lg:h-52 rounded-2xl border border-white/10 bg-white/[0.025] shadow-inner">

                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-3">
                            <PiMusicNotesLight className="w-6 h-6 text-white/30" />
                        </div>

                        <span className="text-white/40 text-xs tracking-wider uppercase">
                            Не назначен
                        </span>
                    </div>
                )}

                {instrument === null && (
                    <p className="text-white/30 text-xs text-center max-w-40">
                        Вам пока не назначили музыкальную партию
                    </p>
                )}
            </div>
        </div>
    );
};