import { Button } from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "../../fbConfig";
import "./style.css";
const SignIn = () => {
  return (
    <div className="sign-in">
      <h2>Sign In</h2>
      <GoogleButton />
    </div>
  );
};
export default SignIn;

function GoogleButton() {
  const navigate = useNavigate();

  function clickHandler() {
    loginHandler()
      .then(() => {
        navigate("/");
      })
      .catch((er) => console.error(er));
  }
  return (
    <button className="google-btn" onClick={clickHandler}>
      <div className="google-icon-wrapper">
        <img
          className="google-icon"
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        />
      </div>
      <p className="btn-text">
        <b>Sign in with google</b>
      </p>
    </button>
  );
}

async function loginHandler() {
  try {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
  }
}
