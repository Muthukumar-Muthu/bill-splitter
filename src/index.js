import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GroupProvider } from "./context/GroupContext";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <UserProvider>
      <GroupProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </GroupProvider>
    </UserProvider>
  </BrowserRouter>
);
