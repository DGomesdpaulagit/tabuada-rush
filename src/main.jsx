import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { applyPrefs } from './lib/prefs';
import App from './App';
import './styles/globals.css';

// Aplica tema/acessibilidade antes do render (evita "flash" do tema errado)
applyPrefs();

// Registra o Service Worker (necessário p/ notificações reais no mobile e base do push futuro)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
);
