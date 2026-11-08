import { useState } from "react";
import { useAuth } from "./AuthContext";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { send } from "../bridge/send";
import { apiFetch } from "../functions/api";

export default function Profile() {
    const { user } = useAuth();
    // if (!user) return null;
    const initial = user?.name.charAt(0).toUpperCase();

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameValue, setNameValue] = useState(user?.name || "");

    const [isEditingUid, setIsEditingUid] = useState(false);
    const [uidValue, setUidValue] = useState(user?.uid?.toString() || "");

    const handleSaveName = async () => {
        await apiFetch("client/users/me", {
            method: "PATCH", 
            body: JSON.stringify({Name: nameValue})
        });
        console.log("Сохранено имя:", nameValue);

        setIsEditingName(false);
    };
    const handleCancelName = () => {
        setNameValue(user?.name || "");
        setIsEditingName(false);
    };

    const handleSaveUid = async () => {
        await apiFetch("client/users/me", {
            method: "PATCH", 
            body: JSON.stringify({Uid: uidValue})
        });
        console.log("Сохранен UID:", uidValue);
        setIsEditingUid(false);
    };
    const handleCancelUid = () => {
        setUidValue(user?.uid?.toString() || "");
        setIsEditingUid(false);
    };

    const handleTestInput = () => {
        send.invoke<string>('TestInput')
            .catch(console.error)
    };

    return (
        <div className="flex items-center mt-1 justify-between w-full h-full overflow-hidden gap-2">
            <div className="flex items-center gap-2.5 min-w-0">

                {/* Аватар */}
                {user?.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-[#2d3345] shrink-0"
                    />
                ) : (
                    <div className="relative flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-[#d3bc8e]/50 bg-[#2c374d]">
                        <span className="text-sm text-[#e0b974]">{initial}</span>
                    </div>

                )}

                {/* Ифнормация */}
                <div className="flex flex-col min-w-0 leading-tight gap-0.5">

                    {/* Ник + Имя */}
                    <div className="h-6 flex items-center gap-1 text-sm font-semibold truncate text-[12px] lg:text-[16px]">
                        {user?.genshinNickname && (
                            <span className="text-gray-900 dark:text-white shrink-0 flex gap-2">
                                {user.genshinNickname}
                                <span>|</span>
                            </span>
                        )}

                        {isEditingName ? (
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={nameValue}
                                    onChange={(e) => setNameValue(e.target.value)}
                                    className="bg-transparent text-gray-900 dark:text-white outline-none 
                                    w-28 pl-1 m-0 border-b border-gray-400 dark:border-gray-500 focus:border-[#cca043]"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveName}
                                    className="p-0.5 text-gray-900 dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    <IoCheckmark className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleCancelName}
                                    className="p-0.5 text-gray-900 dark:text-white hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    <IoClose className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <span
                                onClick={() => setIsEditingName(true)}
                                className="text-gray-900 dark:text-white cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 px-1 py-0.5 rounded transition-colors truncate"
                            >
                                {nameValue || user?.name || "Без имени"}
                            </span>
                        )}
                    </div>

                    {/* UID */}
                    <div className="h-3 flex text-[9px] lg:text-[11px] text-gray-500 dark:text-gray-400 gap-1">
                        <span>UID:</span>
                        {isEditingUid ? (
                            <div className="flex items-center ">
                                <input
                                    type="number"
                                    value={uidValue}
                                    onChange={(e) => setUidValue(e.target.value)}
                                    className="bg-transparent text-gray-500 dark:text-gray-400 
                                    outline-none w-20 border-b border-gray-400 dark:border-gray-500 
                                    focus:border-[#cca043]  
                                    [appearance:textfield] 
                                    [&::-webkit-outer-spin-button]:appearance-none 
                                    [&::-webkit-inner-spin-button]:appearance-none"
                                    autoFocus
                                />
                                <button onClick={handleSaveUid}
                                    className="p-0.5 text-gray-500 dark:text-gray-400 hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    <IoCheckmark className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={handleCancelUid}
                                    className="p-0.5 text-gray-500 dark:text-gray-400 hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    <IoClose className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <span
                                onClick={() => setIsEditingUid(true)}
                                className=" text-gray-500 dark:text-gray-400 
                                 truncate cursor-pointer 
                                hover:bg-black/5 dark:hover:bg-white/5  rounded transition-colors w-fit"
                            >
                                {uidValue || user?.uid || 0}
                            </span>
                        )
                        }
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="text-xs flex flex-col text-[#cca043] hover:text-[#b58b32] dark:text-[#e5bf6c] dark:hover:text-[#f3d386] transition-colors cursor-pointer shrink-0 truncate ml-2"
                onClick={() => handleTestInput()}
            >

                <span>Тест ввода</span>
                <span className="text-gray-600 text-[11px]">(зайди в геншин после нажатия!!)</span>
            </button>
        </div>
    );
}