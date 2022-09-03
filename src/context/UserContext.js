import { Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../fbConfig";

const UserContext = createContext();

function UserProvider({ children }) {
  const { Provider } = UserContext;
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setPending(false);
    });
  }, []);

  if (pending === true) return <Spinner />;
  return (
    <Provider
      value={{
        user,
      }}
    >
      {children}
    </Provider>
  );
}

export { UserProvider, UserContext };
