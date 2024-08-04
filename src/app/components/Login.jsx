"use client";

import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const handleGoogle = async (e) => {
    console.log("login button pressed");
    const provider = await new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return <button onClick={handleGoogle}>Login with Google</button>;
}
