import { useState } from "react";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useSignupMutation } from "../features/auth/authApiSlice";

import { useNavigate } from "react-router-dom";

import "../forms.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      const userData = await signup({ username, email, password }).unwrap();
      console.log("User data", userData);
      dispatch(setCredentials({ ...userData }));
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      // handle errors
      console.log(err);
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Grid container justifyContent="center" alignItems="center" direction="column" className="form">
        <Grid item>
          <Typography variant="h4" align="center">Register</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Signup;