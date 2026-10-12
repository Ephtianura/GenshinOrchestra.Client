import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import Updating from './updating.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Updating />
  </StrictMode>
);