import {
  addDoc,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Spinner } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../fbConfig";
import { id as userId, name as userName } from "../constant";
import { useState, createContext, useEffect } from "react";
const GroupContext = createContext();

function GroupProvider({ children }) {
  const { Provider } = GroupContext;

  const [groups, setGroups] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    connectToUserDoc();
  }, []);

  async function connectToUserDoc() {
    try {
      const docRef = doc(db, "users", userId);
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const userFs = snapshot.data();
          setUser(userFs);
          connectToGroups(userFs.groups);
        } else
          setDoc(doc(db, "users", userId), {
            id: userId,
            name: userName,
            groups: [],
          });
      });
    } catch (er) {
      console.error(er);
    }
  }
  async function connectToGroups(groupIds) {
    try {
      const groupsPromise = groupIds.map(async (groupId) => {
        const group = await getDoc(doc(db, "groups", groupId));

        return group.data();
      });

      const resolvedGroups = await Promise.all(groupsPromise);
      setGroups(resolvedGroups);
    } catch (error) {
      console.error(error);
    }
  }

  async function getGroup(gid) {
    return groups.find((group) => group.gid === gid);
  }

  async function addTransaction(transaction, gid) {
    const transId = uuidv4();
    setGroups((p) =>
      p.map((group) => {
        if (group.gid !== gid) {
          return group;
        } else {
          const { transactionIds } = group;
          return { ...group, transactionIds: [...transactionIds, transId] };
        }
      })
    );
    setTransactions((p) => ({ ...p, [transId]: transaction }));
  }
  if (!user)
    return (
      <div style={{ display: "grid", placeItems: "center", marginTop: "5em" }}>
        <Spinner size="xl" />
      </div>
    );
  return (
    <Provider value={{ groups, getGroup, addTransaction, transactions }}>
      {children}
    </Provider>
  );
}

export { GroupContext, GroupProvider };
