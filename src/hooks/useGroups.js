import { useContext } from "react";
import { GroupContext } from "../context/GroupContext";

function useGroups() {
  return useContext(GroupContext);
}

export { useGroups };
