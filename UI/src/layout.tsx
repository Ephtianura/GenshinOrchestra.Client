import { useEffect, useState } from 'react';
import { useDesktopGuards } from './functions/useKeysBlock';
// import Titlebar from './components/Titlebar';
import { PingIndicator } from './components/PingIndicator';
import { send } from './bridge/send';
import Home from "./pages/Home";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export default function Layout() {
  useDesktopGuards();

  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    send.invoke<string>('GetTest', {
      id: 42,
    })
      .then(setResult)
      .catch(console.error)
  }, [])

  console.log(result)


  return (
    <BrowserRouter>
      <div className="h-screen bg-[#0e131d] text-[#ece5d8] flex flex-col select-none relative overflow-hidden">
        {/* <Titlebar /> */}

        {/* Фоновое свечение*/}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" /> */}
        <div className='absolute left-0 top-0 noise-gradient w-screen h-screen z-0'></div>

      

        <div className="flex gap-6 p-4 relative h-screen w-full">
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
              </Route>

            </Routes>
          </AuthProvider>

        </div>

      </div>
    </BrowserRouter>
  );
}