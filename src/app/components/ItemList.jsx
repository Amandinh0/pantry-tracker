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
import { collection, getDocs, query, addDoc, setDoc, doc, deleteDoc} from "firebase/firestore";
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
      pantryList.push(doc.id);
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  const removeItem = async (item) =>{
    const docRef =  doc(collection(firestore, 'Pantry'), item);
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
    await setDoc(docRef, {})
    updatePantry();
    }catch(e){
      console.log(`Error adding to DB: ${e}`)
    }
  }

  return (
    <>
    <Container>
    <Button onClick={handleOpen} variant="contained">Add</Button>
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

      <Box
        height={50}
        width={100}
        display="flex"
        alignItems="center"
        flexDirection={"column"}
      >
        Pantry Items
      </Box>

      <Stack spacing={2}>
      {pantry.map((item, index) => (
        <Stack
        direction={"row"}
        spacing={10}
        justifyContent={"center"}
        alignContent={"space-between"}
        display={"flex"}>
        <Box
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
          {item}
        </Box>

        <Button 
        variant="contained"
        onClick={() => removeItem(item)}>
          Remove
          </Button>
        </Stack>
      ))}
      </Stack>
      </Container>
    </>
  );
}
