import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HospitalProvider } from './context/HospitalContext.tsx';
import { AdminProvider } from './context/AdminContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HospitalProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </HospitalProvider>
  </StrictMode>,
);
