import { Heading, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";
import Expense from "../../components/Expense";
import "./style.css";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fbConfig";
import { Spinner } from "@chakra-ui/react";
const AddExpense = () => {
  const { gid } = useParams();

  const [group, setGroup] = useState({ loading: true });

  useEffect(() => {
    getGroup(gid).then((data) =>
      setGroup((p) => ({ ...p, loading: false, ...data }))
    );
  }, []);

  return group.loading !== true ? (
    <div className="add-expense">
      <Button colorScheme={"#0099cc"}>
        <ArrowBackIcon />
        <Link tabIndex={"1"} to={`/my-groups/${gid}`}>
          Back to Group Home
        </Link>
      </Button>
      <Expense group={group} />
    </div>
  ) : (
    <div style={{ display: "grid", placeItems: "center", marginTop: "5em" }}>
      <Spinner size="xl" />
    </div>
  );
};
export default AddExpense;

async function getGroup(gid) {
  const group = await getDoc(doc(db, "groups", gid));
  const groupData = group.data();
  return groupData;
}
