// app/components/HomePage.js
"use client";

import { Box, Typography, Button, Container } from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firestore } from '../../firebase';

const HomePage = () => {
  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <Container>
      <Box textAlign="center" mt={10}>
        <Typography variant="h2" color="primary">Pantry Tracker</Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Keep track of your pantry items effortlessly.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
