import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { MatchesProvider } from "./context/MatchesContext";
import { AnnouncementProvider } from "./context/AnnouncementContext";
import { GalleryProvider } from "./context/GalleryContext";
import { MessageProvider } from "./context/MessageContext";
import ErrorBoundary from "./components/ErrorBoundary";
import axios from "axios";

// Bypass localtunnel warning globally
axios.defaults.headers.common["Bypass-Tunnel-Reminder"] = "true";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <MatchesProvider>
            <AnnouncementProvider>
              <GalleryProvider>
                <MessageProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </MessageProvider>
              </GalleryProvider>
            </AnnouncementProvider>
          </MatchesProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

