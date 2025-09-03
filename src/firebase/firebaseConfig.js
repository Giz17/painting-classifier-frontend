import { initializeApp } from 'firebase/app';

const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "your-api-key",
      authDomain: "your-app.firebaseapp.com",
      projectId: "your-app",
      storageBucket: "your-app.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef",
    };

const app = initializeApp(firebaseConfig);
export default app;
