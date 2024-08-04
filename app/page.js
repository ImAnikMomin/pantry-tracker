// app/page.js
"use client";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomePage from './components/HomePage'; // Use relative path
import Pantry from './components/Pantry'; // Use relative path

export default function Home() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      {user ? <Pantry /> : <HomePage />}
    </div>
  );
}
