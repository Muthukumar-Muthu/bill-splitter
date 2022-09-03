import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar";
import CreateGroup from "./routes/create-group";
import { Home } from "./routes/home";
import MyGroups from "./routes/my-groups";
import Group from "./routes/group";
import AddExpense from "./routes/add-expense";

import PrivateRoutes from "./routes/private-routes/PrivateRoutes";
import SignIn from "./components/SignIn";
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/my-groups" element={<MyGroups />} />
          <Route path="/my-groups/:gid" element={<Group />} />
          <Route path="/my-groups/:gid/add-Expense" element={<AddExpense />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
