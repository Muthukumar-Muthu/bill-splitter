import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar";
import CreateGroup from "./routes/create-group";
import { Home } from "./routes/home";
import MyGroups from "./routes/my-groups";
import Group from "./routes/group";
import AddExpense from "./routes/add-expense";
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/my-groups/:gid" element={<Group />} />
        <Route path="/my-groups/:gid/add-Expense" element={<AddExpense />} />
      </Routes>
    </div>
  );
}

export default App;
