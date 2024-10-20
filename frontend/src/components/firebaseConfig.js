import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB3NAB12JPb5OElxnJyw1W4hyPX9pvMSms',
  authDomain: 'final-react-project-f8501.firebaseapp.com',
  projectId: 'final-react-project-f8501',
  storageBucket: 'final-react-project-f8501.appspot.com',
  messagingSenderId: '472676221457',
  appId: '1:472676221457:web:419034bc2dc09f91b2e7b0',
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Google user:', user);
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export default app;
