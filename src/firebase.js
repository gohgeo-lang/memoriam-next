import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBD7AfPMl4gRYhSdvUyD1Jv_XF_xzay0E",
  authDomain: "test-first-app-1a4f4.firebaseapp.com",
  projectId: "test-first-app-1a4f4",
  storageBucket: "test-first-app-1a4f4.firebasestorage.app",
  messagingSenderId: "810885073435",
  appId: "1:810885073435:web:831ea9307f87c65622c6be",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
