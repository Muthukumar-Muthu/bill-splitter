import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../fbConfig";

const { useState, createContext, useEffect } = require("react");
const GroupContext = createContext();

const userId = "Gc2HdfWtYB6Qrge5QZIO";

function GroupProvider({ children }) {
  const { Provider } = GroupContext;

  const [groups, setGroups] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [user, setUser] = useState({});
  useEffect(() => {
    connectToUserDoc();
  }, []);

  async function connectToUserDoc() {
    console.log("connecttouser");
    try {
      const docRef = doc(db, "users", userId);
      onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const userFs = snapshot.data();
          setUser(userFs);
          console.log(userFs);
          connectToGroups(userFs.groups);
        }
      });
    } catch (er) {
      console.error(er);
    }
  }
  async function connectToGroups(groupIds) {
    console.log("connecting to groups", groupIds);
    try {
      const groupsPromise = groupIds.map(async (groupId) => {
        const group = await getDoc(doc(db, "groups", groupId));

        return group.data();
      });

      const resolvedGroups = await Promise.all(groupsPromise);
      setGroups(resolvedGroups);
    } catch (error) {
      console.log(error);
    }
  }

  async function getGroup(gid) {
    return groups.find((group) => group.gid === gid);
  }

  async function createGroup(title = "", members = []) {
    if (!title) {
      console.error("Invalid data provided for group creation");
      return;
    }

    const gid = uuidv4();
    const group = {
      title,
      members: [...members, user],
      gid,
      transactionIds: [],
    };

    try {
      await setDoc(doc(db, "groups", gid), group);
      await updateDoc(doc(db, "users", userId), {
        groups: arrayUnion(gid),
      });
    } catch (error) {
      console.log(error);
      return;
    }
    // setGroups((p) => {
    //   return [...p, group];
    // });
    return gid;
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

  return (
    <Provider
      value={{ groups, createGroup, getGroup, addTransaction, transactions }}
    >
      {children}
    </Provider>
  );
}

export { GroupContext, GroupProvider };
