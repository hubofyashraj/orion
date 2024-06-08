'use client'
import { AuthProvider } from './auth/ds';
import App from './app';
import { useEffect } from 'react';

// var n = 1;

// const socket = io(address);






export default function Home() {
  // const [showLogin, setShowLogin] = useState(false);
  // const [loginState, setLoginState] = useState(false);

  useEffect(()=>{
    console.log('Home');
    
  }, [])

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}


