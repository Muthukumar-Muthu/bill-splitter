import { Link, NavLink } from "react-router-dom";

//file imports

const isActiveStyle = {
  backgroundColor: "#0088AA",
};

import "./style.css";
const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            style={({ isActive }) => {
              return isActive === true ? isActiveStyle : null;
            }}
            to={"/"}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            style={({ isActive }) => {
              return isActive === true ? isActiveStyle : null;
            }}
            to={"/create-group"}
          >
            Create group
          </NavLink>
        </li>
        <li>
          <NavLink
            style={({ isActive }) => {
              return isActive === true ? isActiveStyle : null;
            }}
            to={"/my-groups"}
          >
            My groups
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
export default NavBar;
