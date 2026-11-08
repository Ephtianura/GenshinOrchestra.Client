import { useState } from 'react';
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import { joinRoom } from '../functions/joinRoom';
import type { RoomResponse } from '../types/types';

interface RoomJoinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (room: RoomResponse) => void;
}

export const RoomJoinModal = ({ isOpen, onClose, onJoin }: RoomJoinModalProps) => {
    const [inviteCode, setInviteCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const roomData = await joinRoom(inviteCode, password || undefined);

            console.log("Успешный вход в комнату:", roomData);

            onJoin(roomData)
        } catch (err: any) {
            console.error("Ошибка при входе:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4 animate-fadeIn">
            <div className="relative w-full max-w-[420px] rounded-xl p-6 bg-white border border-gray-100 dark:bg-[#181c25] dark:border-[#2d3345] shadow-2xl transition-all duration-300 text-[#333333] dark:text-[#e0e2ec]">

                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-2.5 right-2.5 p-1 rounded text-gray-400 active:scale-95
                    hover:text-gray-700 hover:bg-black/5 dark:hover:text-white 
                    dark:hover:bg-white/5 transition cursor-pointer"
                >
                    <IoClose className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                    Вход в комнату
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Инпут инвайт-кода */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400">Инвайт-код</label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value)}
                            placeholder="Введите инвайт-код"
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 dark:bg-[#12161f] dark:border-[#2d3345] dark:text-white outline-none focus:border-[#d3bc8e] transition-colors"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Инпут пароля */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400">Пароль (если есть)</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-gray-50 border border-gray-200 dark:bg-[#12161f] dark:border-[#2d3345] dark:text-white outline-none focus:border-[#d3bc8e] transition-colors pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                            >
                                {showPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        Присоединиться
                    </button>
                </form>
            </div>
        </div>
    );
};