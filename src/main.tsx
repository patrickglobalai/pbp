import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize app without waiting for collections
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);