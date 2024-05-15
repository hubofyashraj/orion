import { AuthProvider } from './auth/ds';
import App from './app';

// var n = 1;

// const socket = io(address);






export default function Home() {
  // const [showLogin, setShowLogin] = useState(false);
  // const [loginState, setLoginState] = useState(false);

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}


