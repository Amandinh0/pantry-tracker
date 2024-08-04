"use client";

import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Button, Box } from "@mui/material";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
        router.push("/itemlist"); // Redirect to /itemlist if the user is already logged in
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogle = async (e) => {
    console.log("login button pressed");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      setUser(result.user);
      router.push("/itemlist"); // Redirect to /itemlist after successful login
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          height: "75vh", // Full height of the viewport
          width: "100vw", // Full width of the viewport
          display: "flex", // Use flexbox for centering
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          backgroundColor: "#EAD7D1", // Optional: Add background color
        }}
      >
        <Button
          variant="contained"
          onClick={handleGoogle}
          sx={{
            padding: "12px 24px", // Increase padding for a larger button
            fontSize: "1.5rem", // Increase font size for larger text
            backgroundColor: "#3B8C88", // Teal background color
            color: "#FFFFFF", // White text color
            "&:hover": {
              backgroundColor: "#1E5958", // Dark teal on hover
            },
          }}
        >
          Login With Google
        </Button>
      </Box>
      {/* <ItemList/> */}
    </div>
  );
}
