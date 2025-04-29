import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Typography, Paper } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, width: "100%", borderRadius: 2, textAlign: "center" }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Please register if you are a new user, or login to fill your form.
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
