import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import 'antd/dist/reset.css';
import { LocalizedAntdProvider, LocalizationDomSync } from '@/localization';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <LocalizedAntdProvider>
          <LocalizationDomSync />
          <App />
        </LocalizedAntdProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
