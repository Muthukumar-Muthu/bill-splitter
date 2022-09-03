import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { useGroups } from "../../hooks/useGroups";
import "./style.css";
const MyGroups = () => {
  const { groups } = useGroups();
  return (
    <ul className="group-list">
      {groups.length !== 0 ? (
        groups.map((group) => (
          <li key={group.gid}>
            <Link to={`/my-groups/${group.gid}`} key={group.gid}>
              <Avatar size="lg" name={group.title} />
              <span>{group.title}</span>
              <span style={{ marginRight: "5px" }}>
                Members: {group.members.length}
              </span>
            </Link>
          </li>
        ))
      ) : (
        <h1 style={{ textAlign: "center", fontSize: "2rem" }}>
          Create a group to split your bills
        </h1>
      )}
    </ul>
  );
};
export default MyGroups;
