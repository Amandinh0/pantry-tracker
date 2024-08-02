"use client";

import React, { useState } from "react";
import { firestore, auth } from "../firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Container,
} from "@mui/material";
import { collection, getDocs, query, addDoc, setDoc, doc, deleteDoc, getDoc} from "firebase/firestore";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#FFFFFF',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ItemList() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const[user, setUser] = useState(null);
  const[itemName, setItemName] = useState('')
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        // setUser(user);
        setUser(user);
        console.log(user)
        updatePantry(user)
        
      } else {
        setUser(null);
        router.push('/')
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  
  

  const updatePantry = async (currentUser) => {
    const qureyItems = query(collection(firestore, "users", currentUser.uid, 'Inventory'));
    const docs = await getDocs(qureyItems);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, count: doc.data()});
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  const removeItem = async (item) =>{
    const docRef =  doc(collection(firestore, 'users', user.uid , 'Inventory'), item);
    const docSnap = await getDoc(docRef)
    // console.log(docSnap.data().count)
    if(docSnap.data().count > 1){
      await setDoc(docRef, {count: docSnap.data().count - 1})
      await updatePantry(user)
      return
    }
    await deleteDoc(docRef)
    await updatePantry(user);

  }


  const handleAdd  = async (item) => {
    try{
    console.log("Adding item: " + item)
    const docRef =  doc(collection(firestore, 'users',user.uid,'Inventory'), item);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
      await updatePantry(user)
      return
    }
    await setDoc(docRef, {count: 1})
    updatePantry(user);
    }catch(e){
      console.log(`Error adding to DB: ${e}`)
    }
  }

  
  const handleLogout =async () =>{
    try {
      await signOut(auth);
      //setUser(null);
      router.push('/')

    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  return (
    <>
    <Container maxWidth='lg'>
    <Box
    display={"flex"}
      width="100%"
      justifyContent={"space-between"}
      p={2}
      //boxSizing={"bor"}
    >
    <Typography 
    variant="h3"
    justifyContent={"left"}
     > {/*user.displayName*/} Pantry Items
    </Typography>

    <Box>
      <Button variant="contained" sx={{ mr: 2 }} onClick={handleLogout}>
        Log Out
      </Button>
      <Button onClick={handleOpen} variant="contained">
        Add
      </Button>
    </Box>
    </Box>
    <Modal sx={modalStyle}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
        justifyContent={"center"}
        alignItems={"center"}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add an Item
          </Typography>
          <TextField 
          id="outlined-basic" label="Item" 
          variant="outlined" 
          fullWidth
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}/>
          <Stack direction={"row"} spacing={2}>
            <Button 
            variant="contained"
            onClick={()=>{
              handleAdd(itemName)
              handleClose()
              setItemName('')
            }}>
              Add
            </Button>
            <Button variant="contained" 
            onClick={() =>{
              handleClose()
              setItemName('')
              }}>
              Cancel
              </Button>
          </Stack>
        </Box>
      </Modal>

      

      <Stack spacing={2}>
      {pantry.map((item) => (
        <Stack
        direction={"row"}
        spacing={10}
        justifyContent={"center"}
        alignContent={"space-between"}
        display={"flex"}
        bgcolor={"#F4B7A1"}
        p={3}
        borderRadius={5} 
        //boxShadow={3}
        >
        
        <Box
          key={item.name}
          height={50}
          width="50%"
          display="flex"
          alignItems="center"
          flexDirection={"column"}
          //bgcolor={'#F7A48D'}
          justifyContent={'center'}
          borderRadius={10} // Adjust the value to your preference
          boxShadow={2}
        >
          <Typography variant="h4">
          {item.name}
          </Typography>
        </Box>
        
        <Typography variant="h4"
        textAlign={"center"}>
          Quantity:{item.count.count}
        </Typography>

        <Button 
        variant="contained"
        onClick={() => removeItem(item.name)}>
          Remove
          </Button>
        </Stack>
      ))}
      </Stack>
      </Container>
    </>
  );
}
