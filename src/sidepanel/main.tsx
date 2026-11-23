import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/common/styles/globals.css';
import { App } from '@/sidepanel/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
