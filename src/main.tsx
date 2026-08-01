import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HospitalProvider } from './context/HospitalContext.tsx';
import { AdminProvider } from './context/AdminContext.tsx';
import { SiteContentProvider } from './context/SiteContentContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProvider>
      <HospitalProvider>
        <SiteContentProvider>
          <App />
        </SiteContentProvider>
      </HospitalProvider>
    </AdminProvider>
  </StrictMode>,
);
