import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3NAB12JPb5OElxnJyw1W4hyPX9pvMSms",
    authDomain: "final-react-project-f8501.firebaseapp.com",
    projectId: "final-react-project-f8501",
    storageBucket: "final-react-project-f8501.appspot.com",
    messagingSenderId: "472676221457",
    appId: "1:472676221457:web:419034bc2dc09f91b2e7b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google OAuth Provider
const googleProvider = new GoogleAuthProvider();

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const googleSignInBtn = document.getElementById('google-signin');
const googleSignUpBtn = document.getElementById('google-signup');
const signinButton = document.getElementById('signin-button');
const signupButton = document.getElementById('signup-button');

registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

// Google Sign-In
googleSignInBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result.user);
      // Redirect to home page or user dashboard
      window.location.href = '/protected';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Google Sign-Up
googleSignUpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result.user);
      // Redirect to home page or user dashboard
      window.location.href = '/protected';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Email/Password Sign-In
signinButton.addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      console.log(result.user);
      // Redirect to home page or user dashboard
      window.location.href = '/protected';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Email/Password Sign-Up
signupButton.addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      console.log(result.user);
      // Update profile with name
      updateProfile(result.user, {
        displayName: name
      });
      // Redirect to home page or user dashboard
      window.location.href = '/protected';
    })
    .catch((error) => {
      console.error(error);
    });
});