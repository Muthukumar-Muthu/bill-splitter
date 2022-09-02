import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GroupProvider } from "./context/GroupContext";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GroupProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </GroupProvider>
  </BrowserRouter>
);
