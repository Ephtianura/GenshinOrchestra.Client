import { useState } from 'react';
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { login as loginF } from '../functions/login';
import { send } from "../bridge/send";

export function Login() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [login, setLogin] = useState<string>('');
    const [hwid, setHwid] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuth } = useAuth();

    const from = location.state?.from?.pathname ?? "/";

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        send.invoke<string>('GetHwid')
            .then(setHwid)
            .catch(console.error);
        try {
            await loginF({
                login,
                password,
                hwid
            });

            await checkAuth();

            navigate(from, { replace: true });
        } catch (error) { }
    };


    return (
        <div className="w-full flex items-center justify-center text-[#333333] dark:text-[#e0e2ec] transition-colors duration-300 ">
            <div className="relative w-full max-w-[420px] rounded-xl p-8 bg-white border 
            border-gray-100 dark:bg-[#181c25] dark:border-[#2d3345] transition-all duration-300 shadow">

                {/* Кнопка закрытия */}
                <button
                    type="button"
                    className="absolute top-2.5 right-2.5 p-1 rounded text-gray-400 active:scale-95
                    hover:text-gray-700 hover:bg-black/5 dark:hover:text-white 
                    dark:hover:bg-white/5 transition cursor-pointer"
                >
                    <IoClose className="w-5 h-5" />
                </button>

                {/* Логотип miHoYo */}
                <div className="flex flex-col items-center mb-8 select-none">
                    {/*text-[#F3D893] text-[#55558D] text-[#8BBFF8]*/}
                    <div className="flex items-center gap-0 text-3xl tracking-tight dark:text-[#F5F3F6]">
                        <span className="">Gen</span>
                        <span className="mr-1">shin</span>
                        <span className=""> Orc</span>
                        <span className="">hestra</span>
                    </div>

                    <span className="text-[9px] tracking-[0.2em] uppercase mt-0.5 text-gray-500 dark:text-gray-400">
                        Очень Крутая Цитата Придумайте Пж
                    </span>
                </div>

                {/* Форма */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Инпут логина */}
                    <div>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Введите логин"
                            className="main-input"
                        />
                    </div>

                    {/* Инпут пароля */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            className="main-input"
                        />
                        <button type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-eye"
                        >
                            {showPassword ? <IoEyeOff className="w-4 h-4" /> : <IoEye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1 pb-2 text-sm">
                        Или...
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-[#cca043] hover:text-[#b58b32] dark:text-[#e5bf6c] 
                        dark:hover:text-[#f3d386] transition-colors cursor-pointer"
                        >
                            Создать аккаунт
                        </button>
                    </div>

                    {/* Главная кнопка */}
                    <button type="submit"
                        className="submit-btn"
                    >
                        Начать
                    </button>
                </form>

            </div>
        </div>
    );
}