import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/auth/authSlice";
import { useEffect } from "react";

const Welcome = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    console.log("Welcome loaded");
  }, []);

  const welcome = user ? `Welcome ${user}!` : `Welcome`;

  return (
    <div>
      <p>{welcome}</p>
      <p>{token}</p>
    </div>
  );
};

export default Welcome;
