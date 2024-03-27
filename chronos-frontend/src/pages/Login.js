import { useState } from "react";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

import { useNavigate } from "react-router-dom";

// import "../forms.css";
import calendarGif from "../assets/calendar.gif";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  const content = (
    <Container maxWidth="sm" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Grid container justifyContent="center" alignItems="center" className="form">
        <Grid item style={{ marginRight: "20px" }}>
          <img src={calendarGif} alt="Calendar" style={{ width: "300px" }} />
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h4" align="center">Login</Typography>
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
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );

  return content;
};

export default Login;
