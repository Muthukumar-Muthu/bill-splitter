import { AddIcon } from "@chakra-ui/icons";
import { Input, Button, IconButton, ButtonGroup } from "@chakra-ui/react";

import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Members from "../../components/Members";
import "./style.css";

import { GroupContext } from "../../context/GroupContext";
const CreateGroup = () => {
  const [title, setTitle] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const { createGroup } = useContext(GroupContext);
  function addMember() {
    if (member.trim() === "") return;
    setMembers((p) => {
      return [...p, { name: member, id: uuidv4() }];
    });
    setMember("");
  }
  function submitHandler(e) {
    e.preventDefault();
    if (title.trim() === "" || members.length < 1) return;
    console.log("submitting form");
    createGroup(title, members)
      .then((gid) => {
        if (!gid) throw new Error("Gid is undefined");
        navigate(`/my-groups/${gid}`);
      })
      .catch((err) => alert(JSON.stringify(err)));
  }
  return (
    <form className="center-element create-group" onSubmit={submitHandler}>
      <h1>Create a new Group</h1>
      <div>
        <label htmlFor="group-title">Group Name</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="group-title"
          size="md"
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="group-members">Add Members</label>
        <div className="add-members">
          <Input
            id="group-members"
            size="md"
            onChange={(e) => setMember(e.target.value)}
            value={member}
            autoComplete="off"
            // onKeyUp={(e) => {
            //   if (e.code === "Enter") addMember();
            // }}
          />
          <IconButton
            style={{ backgroundColor: "#00B5D8" }}
            onClick={addMember}
            colorScheme="teal"
            size="lg"
            icon={<AddIcon />}
          />
        </div>
        <Members members={members} />
      </div>
      <ButtonGroup className="button-group">
        <Button type="submit" colorScheme={"cyan"}>
          Create
        </Button>
        <Button colorScheme={"red"}>Cancel</Button>
      </ButtonGroup>
    </form>
  );
};
export default CreateGroup;
