// app/components/Pantry.js
"use client";

import { useState, useEffect } from 'react';
import { firestore, auth } from '../../firebase';
import { Box, Typography, Button, TextField, Container, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

// Function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

const Pantry = () => {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const auth = getAuth();

  const updatePantry = async () => {
    const user = auth.currentUser;
    if (user) {
      const snapshot = query(collection(firestore, `users/${user.uid}/pantry`));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPantry(pantryList);
    }
  };

  const handleAddItem = async () => {
    if (itemName.trim() === '') return;

    const capitalizedItemName = capitalizeWords(itemName);
    const user = auth.currentUser;

    if (user) {
      const itemsRef = collection(firestore, `users/${user.uid}/pantry`);
      const q = query(itemsRef, where('name', '==', capitalizedItemName));
      const querySnapshot = await getDocs(q);

      let imageURL = '';
      if (selectedImage) {
        imageURL = await uploadImage(selectedImage);
      }

      if (querySnapshot.empty) {
        await addDoc(itemsRef, { name: capitalizedItemName, quantity: 1, image: imageURL });
      } else {
        const itemDoc = querySnapshot.docs[0];
        await updateDoc(itemDoc.ref, {
          quantity: itemDoc.data().quantity + 1,
          image: imageURL || itemDoc.data().image, // Preserve existing image if no new image is uploaded
        });
      }

      setItemName('');
      setSelectedImage(null);
      updatePantry();
    }
  };

  const handleIncrementItem = async (id, currentQuantity) => {
    const user = auth.currentUser;
    if (user) {
      const itemRef = doc(firestore, `users/${user.uid}/pantry`, id);
      await updateDoc(itemRef, { quantity: currentQuantity + 1 });
      updatePantry();
    }
  };

  const handleRemoveItem = async (id, currentQuantity) => {
    const user = auth.currentUser;
    if (user) {
      const itemRef = doc(firestore, `users/${user.uid}/pantry`, id);
      if (currentQuantity <= 1) {
        await deleteDoc(itemRef);  // Delete the item if quantity is 1 or less
      } else {
        await updateDoc(itemRef, { quantity: currentQuantity - 1 });
      }
      updatePantry();
    }
  };

  const uploadImage = async (file) => {
    // Convert image to Base64 string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPantry = pantry.filter(item => 
    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Typography variant='h1'>Pantry Inventory</Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </Button>
      <TextField 
        label="Search Items" 
        variant="outlined" 
        fullWidth 
        margin="normal" 
        value={searchQuery} 
        onChange={handleSearchChange} 
      />
      <TextField 
        label="Item Name" 
        variant="outlined" 
        fullWidth 
        margin="normal" 
        value={itemName} 
        onChange={(e) => setItemName(e.target.value)} 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setSelectedImage(e.target.files[0])} 
      />
      <Button variant="contained" color="primary" onClick={handleAddItem}>
        Add Item
      </Button>
      <Box overflow="auto" marginTop="20px" display="flex" flexWrap="wrap" gap="20px">
        {filteredPantry.map((item) => (
          <Card key={item.id} style={{ width: 250, height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #ddd', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {item.image && (
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.name}
              />
            )}
            <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h5" component="div">
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {item.quantity}
              </Typography>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
              <Button size="small" color="primary" onClick={() => handleIncrementItem(item.id, item.quantity)}>
                Add
              </Button>
              <Button size="small" color="secondary" onClick={() => handleRemoveItem(item.id, item.quantity)}>
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Pantry;
