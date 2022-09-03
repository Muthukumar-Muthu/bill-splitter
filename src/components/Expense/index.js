import "./style.css";
import { Heading, Input, Select, Button } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../fbConfig";

const Expense = ({ group }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payerId: null,
    reason: "",
    amount: 0,
  });

  function submitHandler(e) {
    e.preventDefault();
    const transaction = { ...formData, amount: parseInt(formData.amount) };

    addTransaction(transaction, group.gid)
      .then(() => {
        navigate(`/my-groups/${group.gid}`);
      })
      .catch((err) => console.error(err));
  }

  function changeHandler(e) {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((p) => ({ ...p, [name]: value }));
  }

  return (
    <form className="expense" onSubmit={submitHandler} onChange={changeHandler}>
      <h1>Add a expense</h1>
      <SelectMember members={group?.members} />
      <div>
        <label htmlFor="reason">paid for</label>
        <Input
          id="reason"
          name="reason"
          value={formData?.reason}
          size={"md"}
          required
          autoComplete="off"
          onChange={() => {}}
        />
      </div>
      <div>
        <label htmlFor="how-much">How Much?</label>
        <Input
          id="how-much"
          size={"md"}
          name="amount"
          value={formData?.amount}
          type="number"
          isRequired={true}
          autoComplete="off"
          onChange={() => {}}
        />
      </div>

      <div>
        <label htmlFor="when">When?</label>
        <Input
          id="when"
          type="date"
          name="date"
          size={"md"}
          required
          onChange={() => {}}
        />
      </div>
      <div className="button-group">
        <Button type="submit" colorScheme={"blue"}>
          Add
        </Button>
        <Button colorScheme={"red"}>Cancel</Button>
      </div>
    </form>
  );
};
export default Expense;

function SelectMember({ members }) {
  return (
    <Select
      placeholder="Select the person paid the amount"
      name="payerId"
      required
    >
      {members.map((member) => (
        <option key={"member" + member.id} value={member.id}>
          {member.name}
        </option>
      ))}
    </Select>
  );
}

async function addTransaction(transaction, gid) {
  const transId = uuidv4();

  await setDoc(doc(db, "transactions", transId), {
    transId,
    ...transaction,
  });

  await updateDoc(doc(db, "groups", gid), {
    transactionIds: arrayUnion(transId),
  });
}
