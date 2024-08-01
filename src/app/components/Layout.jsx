import React from 'react';
import { Container, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box 
      className="main-container" 
      mx="auto" 
      my={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
        >
        {children}
      </Box>
    </Container>
  );
};

export default Layout;
