"use client";

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Button } from "@mui/material";
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user)
        router.push('/itemlist'); // Redirect to /itemlist if the user is already logged in
      } else {
        setUser(null);
      }
    });
    
    return () => unsubscribe();
  }, [router]);
  

    const handleGoogle = async (e) => {
      console.log('login button pressed');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result)
      setUser(result.user);
      router.push('/itemlist'); // Redirect to /itemlist after successful login
    } catch (error) {
      console.error('Error logging in: ', error);
    }

  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    
    <div>
      <Button onClick={handleGoogle}
      >Login With Google
      </Button>
      {/* <ItemList/> */}
    </div>
  );
}
