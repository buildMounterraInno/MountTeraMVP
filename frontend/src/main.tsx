import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'

// Suppress YouTube tracking/analytics errors that are blocked by ad blockers
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  
  // Suppress YouTube embed player errors related to ad blockers
  if (
    message.includes('www-embed-player.js') ||
    message.includes('youtubei/v1/log_event') ||
    message.includes('net::ERR_BLOCKED_BY_CLIENT') ||
    message.includes('YouTube Player API')
  ) {
    return; // Suppress these specific errors
  }
  
  // Allow all other errors to show
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
