import { AddIcon } from "@chakra-ui/icons";
import { Input, Button, IconButton, ButtonGroup } from "@chakra-ui/react";

import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Members from "../../components/Members";
import "./style.css";

import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, getUserId, getUserName } from "../../fbConfig";
const CreateGroup = () => {
  const [title, setTitle] = useState("");
  const [member, setMember] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);
    createGroup(title, members)
      .then((gid) => {
        if (!gid) throw new Error("Gid is undefined");
        navigate(`/my-groups/${gid}`);
      })
      .catch((err) => {
        console.error(err);
        alert(JSON.stringify(err));
      });
  }
  return (
    <form className="create-group" onSubmit={submitHandler}>
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
        <Button type="submit" colorScheme={"cyan"} loadingText={loading}>
          Create
        </Button>
        <Button
          onClick={() => {
            navigate(`/my-groups/`);
          }}
          colorScheme={"red"}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  );
};
export default CreateGroup;

async function createGroup(title = "", members = []) {
  const id = getUserId();
  const name = getUserName();
  if (!title) {
    console.error("Invalid data provided for group creation");
    return;
  }

  const gid = uuidv4();
  const group = {
    title,
    members: [...members, { id, name }],
    gid,
    transactionIds: [],
  };

  try {
    await setDoc(doc(db, "groups", gid), group);
    await updateDoc(doc(db, "users", id), {
      groups: arrayUnion(gid),
    });
  } catch (error) {
    await setDoc(doc(db, "users", id), {
      name,
      id,
      groups: [gid],
    });
    console.error(error);

    return gid;
  }

  return gid;
}
