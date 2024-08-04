'use client';

import Image from 'next/image'
import Markdown from 'markdown-to-jsx';
import { getResponse } from '../api.mjs';
import React, { useState, useRef } from 'react';
import { firestore, auth } from '../firebase';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Container,
} from '@mui/material';
import {
  collection,
  getDocs,
  query,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Camera } from 'react-camera-pro';
import dotenv from 'dotenv';
import next from 'next';
dotenv.config();

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 250,
  bgcolor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ItemList() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState(null);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [recipe, setRecipe] = useState('');
  const router = useRouter();
  console.log(search);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // setUser(user);
        setUser(user);
        console.log(user);
        updatePantry(user);
      } else {
        setUser(null);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  //Params: User object that represents the current logged in user
  //Use: Updated the current displayed list of items with new ones from database
  const updatePantry = async (currentUser) => {
    const qureyItems = query(
      collection(firestore, 'users', currentUser.uid, 'Inventory')
    );
    const docs = await getDocs(qureyItems);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, count: doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  //Param: Item name that needs to be removed from the
  const removeItem = async (item) => {
    const docRef = doc(
      collection(firestore, 'users', user.uid, 'Inventory'),
      item
    );
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data().count)
    if (docSnap.data().count > 1) {
      await setDoc(docRef, { count: docSnap.data().count - 1 });
      await updatePantry(user);
      return;
    }
    await deleteDoc(docRef);
    await updatePantry(user);
  };

  const handleAdd = async (item) => {
    try {
      console.log('Adding item: ' + item);
      const docRef = doc(
        collection(firestore, 'users', user.uid, 'Inventory'),
        item
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
        await updatePantry(user);
        return;
      }
      await setDoc(docRef, { count: 1 });
      updatePantry(user);
    } catch (e) {
      console.log(`Error adding to DB: ${e}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      //setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleCamera = () => {
    setCameraOpen(!cameraOpen);
  };

  const handleApiCall = async () => {
    //console.log(`API key inside my component${process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY}`);
    if (pantry) {
      let pantryString = '';
      pantry.map((item) => {
        pantryString += `${item.name}\n`;
      });
      try {
        const data = await getResponse(pantryString);
        setRecipe(data);
        console.log(`Inside Itemlist:`);
        console.log(recipe);
      } catch (err) {
        console.log(`Error calling API from component: ${err}`);
      }
    }
  };

  const saveImage = () => {
    console.log('Image saved:');
    console.log(image);
    toggleCamera();
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box
          display={'flex'}
          width="100%"
          justifyContent={'space-between'}
          p={2}
          //boxSizing={"bor"}
        >
          <Typography
            variant="h3"
            justifyContent={'left'}
            sx={{ fontFamily: 'PT Sans' }}
          >
            {' '}
            {/*user.displayName*/} Pantry Items
          </Typography>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
            }}
          />
          <Box>
            {/* <Button variant="contained" sx={{ mr: 2 }} onClick={handleLogout}>
              Log Out
            </Button> */}
            <Button onClick={handleOpen} variant="contained" sx={{ mr: 2 }}>
              Add
            </Button>
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleApiCall}>
              Generate Recipe
            </Button>
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        </Box>
        <Modal
          sx={modalStyle}
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box justifyContent={'center'} alignItems={'center'}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add an Item
            </Typography>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Stack
              direction={'row'}
              spacing={2}
              p={4}
              justifyContent={'center'}
            >
              <Button
                variant="contained"
                onClick={() => {
                  toggleCamera();
                  handleClose();
                  setItemName('');
                }}
              >
                Use Camera
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleAdd(itemName.toLowerCase());
                  handleClose();
                  setItemName('');
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleClose();
                  setItemName('');
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>

        {cameraOpen && (
          <div
            style={{
              display: 'flex',
              width: '100vw',
              height: '100vh',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '50vw',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                backgroundColor: '#f5f5f5',
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              <Camera ref={camera} />

              <Button
                variant="contained"
                onClick={() => {
                  if (camera.current) {
                    const photo = camera.current.takePhoto();
                    console.log(photo);
                    setImage(photo);
                  }
                  //toggleCamera();
                }}
              >
                Take photo
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  toggleCamera();
                  setImage(null);
                }}
              >
                Cancel
              </Button>
            </div>
            {image && (
              <div
                style={{
                  width: '50vw',
                  height: '100vh',
                  position: 'fixed',
                  right: 0,
                  top: 0,
                  backgroundColor: '#e0e0e0',
                  padding: '20px',
                  boxSizing: 'border-box',
                }}
              >
                <Button variant="contained" onClick={saveImage}>
                  Use Image
                </Button>
                <Image
                  src={image}
                  alt="Taken photo"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            )}
          </div>
        )}

        <Box
          sx={{
            width: '100%',
            height: '500px',
            overflow: 'auto',
            border: '1px solid #ddd',
          }}
        >
          <Stack spacing={2}>
            {pantry
              .filter((item) => {
                return search.toLowerCase() === ''
                  ? item
                  : item.name.toLowerCase().includes(search);
              })
              .map((item) => (
                <Stack
                  key={item.name}
                  direction={'row'}
                  spacing={10}
                  justifyContent={'center'}
                  alignContent={'space-between'}
                  display={'flex'}
                  bgcolor={'#F4B7A1'}
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
                    flexDirection={'column'}
                    justifyContent={'center'}
                    borderRadius={10} // Adjust the value to your preference
                    boxShadow={2}
                  >
                    <Typography
                      sx={{ fontFamily: 'PT Sans' }}
                      variant="h4"
                      key={item.name}
                    >
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Typography>
                  </Box>

                  <Typography variant="h4" textAlign={'center'}>
                    Quantity:{item.count.count}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => removeItem(item.name)}
                  >
                    Remove
                  </Button>
                </Stack>
              ))}
          </Stack>
        </Box>

        <Box
          display={'flex'}
          bgcolor={'#F4B7A1'}
          //alignItems="center"
          //flexDirection={'column'}
          //justifyContent={'center'}
          p={4}
          borderRadius={5}
          boxShadow={3}
          sx={{ margin: '0 auto' }}
        >
          {recipe ? (
            <div>
              <Typography
                variant="h3"
                //justifyContent={'left'}
                alignItems="flex-start"
                sx={{ fontFamily: 'PT Sans' }}
                p={2}
              >
                Recipe:
              </Typography>

              <Button
                variant="contained"
                display="flex"
                justifyContent="flex-end"
                onClick={handleApiCall}
                sx={{
                  mr: 2,
                  backgroundColor: '#3B8C88',
                  color: '#FFFFFF', // White text color
                  '&:hover': {
                    backgroundColor: '#1E5958', // Dark teal on hover
                  },
                }}
              >
                Regenerate Recipe
              </Button>

              <Markdown
                options={{
                  overrides: {
                    p: {
                      component: Typography,
                      props: {
                        variant: 'body1',
                        sx: {
                          fontFamily: 'PT Sans',
                          marginBottom: 1,
                          fontSize: '2rem',
                        },
                      },
                    },
                    ul: {
                      component: 'ul',
                      props: {
                        style: { paddingLeft: '1.5rem', marginBottom: 1 },
                      },
                    },
                    li: {
                      component: Typography,
                      props: {
                        component: 'li',
                        variant: 'body1',
                        sx: {
                          fontFamily: 'PT Sans',
                          marginBottom: 0.5,
                          fontSize: '1.25rem',
                        },
                      },
                    },
                    ol: {
                      component: 'ol',
                      props: {
                        style: { paddingLeft: '1.5rem', marginBottom: 1 },
                      },
                    },
                  },
                }}
              >
                {recipe}
              </Markdown>
            </div>
          ):(
            <Typography
            variant="h4"
                //justifyContent={'left'}
                alignItems="flex-start"
                sx={{ fontFamily: 'PT Sans' }}
                 >
              Press 'Generate Recipe' to get a simple recipe including all your
              Pantry Items
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
