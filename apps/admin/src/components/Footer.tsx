import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function getCurrentYear() {
  return new Date().getFullYear();
}

export default function Footer() {
  const year = getCurrentYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 3,
        px: 2,
        py: 2,
        borderTop: "1px solid",
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        textAlign: "center",
      }}
    >
      <Typography sx={{ color: "var(--muted)" }} variant="body2">
        © {year} LifeExtended
      </Typography>
    </Box>
  );
}
