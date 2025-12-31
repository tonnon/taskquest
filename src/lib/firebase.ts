import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRXBRawCp5xmnSZCd7AxpQ2mdlj_AWMbk",
  authDomain: "taskquest-c55d1.firebaseapp.com",
  projectId: "taskquest-c55d1",
  storageBucket: "taskquest-c55d1.firebasestorage.app",
  messagingSenderId: "117999133306",
  appId: "1:117999133306:web:52f36edd7124a7b839d1c3",
  measurementId: "G-KT00LBKC0L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
