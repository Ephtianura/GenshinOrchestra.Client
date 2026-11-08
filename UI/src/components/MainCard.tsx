import type { ReactNode } from "react";

interface MainCard {
    children: ReactNode;
    name?: string;
    className?: string;
}
// flex h-full flex-col justify-between rounded-xl border border-[#d3bc8e]/20 bg-[#121925]/80 p-8 shadow-2xl relative
export const MainCard = ({ children, name, className }: MainCard) => {
    return (
        <div className={`flex flex-col gap-3 w-full h-full rounded-xl border border-[#d3bc8e]/20 bg-[#121925]/70 p-4 shadow-2xl relative ${className}`}>
            {name &&
                <div className="text-xs uppercase tracking-widest text-[#d3bc8e]/70 font-semibold mb-1 px-1 overflow-hidden">
                    {name}
                </div>
            }
            {children}
        </div>
    );
};