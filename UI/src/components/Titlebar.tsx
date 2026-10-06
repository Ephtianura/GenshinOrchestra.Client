import { IoClose } from "react-icons/io5";

export default function Titlebar() {
    const handleMinimize = () => {
        (window as any).external?.sendMessage('WINDOW_MINIMIZE');
    };

    const handleClose = () => {
        (window as any).external?.sendMessage('WINDOW_CLOSE');
    };

    return (
        <header className="titlebar select-none flex h-9 w-full items-center justify-between border-b
     border-amber-500/20 bg-zinc-900/90  text-amber-100/80 backdrop-blur-md">


            <div className="flex items-center gap-2 text-sm font-medium tracking-wide pl-4">
                <img
                    src="/favicon.ico"
                    className="no-drag h-5 w-5 pointer-events-none"
                />
                <span className="text-xs text-amber-200/90">Genshin Orchestra Client</span>
            </div>

            <div className="no-drag flex items-center h-full justify-center">
                <button
                    onClick={handleMinimize}
                    type="button"
                    title="Свернуть"
                    className="flex h-full w-12 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-800  active:bg-zinc-700"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>

                <button
                    onClick={handleClose}
                    type="button"
                    title="Закрыть"
                    className="flex h-full w-12 items-center justify-center transition-colors hover:bg-zinc-800  active:bg-zinc-700 "
                >
                    <IoClose className="text-zinc-400 w-5 h-5" />

                </button>
            </div>

        </header>
    );
}


{/* <button
    onClick={handleClose}
    type="button"
    title="Закрыть"
    className="flex p-[2px] items-center justify-center transition-colors hover:bg-[#01010151]  active:bg-[#010101c0] rounded-sm"
>
    <IoClose className="text-white w-5 h-5" />

</button> */}