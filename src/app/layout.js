import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
import { CssBaseline } from "@mui/material";
import NavBar from "./components/NavBar";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PantryPal",
  description: "App that you can use to keep track of pantry and generate simple recipies",

};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      

      <body className={inter.className}>
       
          <Layout>
            <NavBar/>
          {children}
          </Layout>
        
        
        </body>
    </html>
  );
}
