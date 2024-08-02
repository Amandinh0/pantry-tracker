"use client";

import React, { useState } from "react";
import { firestore } from "../firebase";
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
  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const qureyItems = query(collection(firestore, "Pantry"));
    const docs = await getDocs(qureyItems);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, count: doc.data()});
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  const removeItem = async (item) =>{
    const docRef =  doc(collection(firestore, 'Pantry'), item);
    const docSnap = await getDoc(docRef)
    // console.log(docSnap.data().count)
    if(docSnap.data().count > 1){
      await setDoc(docRef, {count: docSnap.data().count - 1})
      await updatePantry()
      return
    }
    await deleteDoc(docRef)
    await updatePantry();

  }

  useEffect(() => {
  
    updatePantry();
  }, []);

  const handleAdd  = async (item) => {
    try{
    console.log("Adding item: " + item)
    const docRef =  doc(collection(firestore, 'Pantry'), item);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
      await updatePantry()
      return
    }
    await setDoc(docRef, {count: 1})
    updatePantry();
    }catch(e){
      console.log(`Error adding to DB: ${e}`)
    }
  }

  return (
    <>
    <Container>
    <Box
      display="flex"
      justifyContent={"space-between"}
      // alignItems="center"
      p={2}
    >
    <Typography 
    variant="h3"
    justifyItems={"center"}
    textAlign={"center"}>
      Pantry Items
    </Typography>
    
    <Button onClick={handleOpen} variant="contained">Add</Button>
    
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
        bgcolor={"#068D9D"}
        p={3}
        borderRadius={5} // Adjust the value to your preference
        boxShadow={3}
        >
        
        <Box
          key={item.name}
          height={50}
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection={"column"}
          bgcolor={'#976391'}
          justifyContent={'center'}
          borderRadius={5} // Adjust the value to your preference
          boxShadow={3}
        >
          {item.name}
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
