import React from "react";
import { Box, Typography } from "@mui/material";
import { PiBowlFoodBold } from "react-icons/pi";

export default function NavBar() {
  return (
    <Box display={"flex"} justifyContent={"center"} p={3}>
      <Typography
        variant="h2"
        justifyContent={"center"}
        alignContent={"center"}
      >
        PantryPal <PiBowlFoodBold />
      </Typography>
    </Box>
  );
}
