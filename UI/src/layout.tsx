import { useDesktopGuards } from './functions/useKeysBlock';
// import Titlebar from './components/Titlebar';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './components/AuthContext';
import Home from "./pages/Home";
import { Login } from './pages/Login';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { Register } from './pages/Register';

export default function Layout() {
  useDesktopGuards();

  return (
    <BrowserRouter>
      <div className="h-screen bg-[#0e131d] text-[#ece5d8] flex flex-col select-none relative overflow-hidden">
        {/* <Titlebar /> */}

        {/* Фоновое свечение*/}
        <div className='noise-gradient absolute left-0 top-0 w-screen h-screen z-0'></div>

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

        <ToastContainer
          className="select-none"
          limit={2}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}
