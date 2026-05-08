import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={clerkPubKey}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    signInFallbackRedirectUrl="/dashboard"
    signUpFallbackRedirectUrl="/dashboard"
  >
    <App />
  </ClerkProvider>
)
