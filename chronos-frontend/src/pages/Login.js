import { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      const userData = await login({ email, password }).unwrap();
      console.log("User data", userData);
      dispatch(setCredentials({ ...userData }));
      setEmail("");
      setPassword("");
      navigate("/welcome");
    } catch (err) {
      // handle errors
      console.log(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form noValidate autoComplete="off">
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleSubmit()}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
