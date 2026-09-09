import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#16161f',
              color: '#e2e8f0',
              border: '1px solid #1e1e2e',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#a855f7', secondary: '#16161f' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#16161f' } },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
