import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroups } from "../../hooks/useGroups";
import { Button, Heading, Select } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Transactions from "../../components/Transactions";
import "./style.css";

import { doc, getDoc } from "firebase/firestore";
import { db, getUserId, getUserName } from "../../fbConfig";
import { Spinner } from "@chakra-ui/react";

const Group = () => {
  const { gid } = useParams();
  const [groupWithTransaction, setGroupWithTransaction] = useState({
    loading: true,
  });
  const id = getUserId();
  const [selectedUser, setselectedUser] = useState(id);

  useEffect(() => {
    getGroup(gid).then((data) =>
      setGroupWithTransaction((p) => ({ ...p, loading: false, ...data }))
    );
  }, []);

  return groupWithTransaction.loading === false ? (
    <section className="group-page">
      <Button>
        <Link to={`add-Expense`}>Add Expense</Link>
      </Button>
      <div className="overview">
        <h1>Overview</h1>
        <div className="selected-user">
          <Select
            placeholder="Select the person"
            name="selectedUser"
            required
            onChange={(e) => {
              if (!e.target.value) setselectedUser(id);
              else setselectedUser(e.target.value);
            }}
            value={selectedUser}
          >
            {groupWithTransaction.groupData.members.map((member) => (
              <option key={"member" + member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </div>
        <TableContainer>
          <Table variant="simple">
            <TableCaption
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "0.5em",
              }}
            >
              <span style={{ fontSize: "1.5em" }}>
                Showing Data for
                {" " +
                  getUser(selectedUser, groupWithTransaction.groupData.members)
                    .name}
              </span>

              <span style={{ color: "lightgrey" }}>
                * If owed money is negative, then others have to give money to
                you
              </span>
            </TableCaption>
            <Tbody>
              <Tr>
                <Th>The cost of the group:</Th>
                <Td>
                  {getTotalCostOfTheGroup(groupWithTransaction, selectedUser)}
                </Td>
              </Tr>
              <Tr>
                <Th>It cost you:</Th>
                <Td>{getCostToUser(groupWithTransaction, selectedUser)}</Td>
              </Tr>
              <Tr>
                <Th>You've paid:</Th>
                <Td>{getAmountPaid(groupWithTransaction, selectedUser)}</Td>
              </Tr>
              <Tr>
                <Th className="owed">
                  <span>You are owed * :</span>
                </Th>
                <Td>{getOwnedAmount(groupWithTransaction, selectedUser)}</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th className="disclamer"></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
        <Transactions
          members={groupWithTransaction.groupData.members}
          transactions={groupWithTransaction.transactions}
        />
      </div>
    </section>
  ) : (
    <div style={{ display: "grid", placeItems: "center", marginTop: "5em" }}>
      <Spinner size="xl" />
    </div>
  );
};

function getUser(id, members) {
  return members.find((m) => m.id === id);
}
async function getGroup(gid) {
  const group = await getDoc(doc(db, "groups", gid));
  const groupData = group.data();
  const { transactionIds } = groupData;
  const transactionPromise = transactionIds.map(async (tid) => {
    const transaction = await getDoc(doc(db, "transactions", tid));
    return transaction.data();
  });
  const resolvedTransactions = await Promise.all(transactionPromise);

  return { groupData, transactions: resolvedTransactions };
}

function getTotalCostOfTheGroup(groupWithTransaction) {
  const { transactions } = groupWithTransaction;

  let totalCost = 0;

  transactions.forEach((transaction) => {
    totalCost += transaction.amount;
  });

  return parseInt(totalCost);
}

function getCostToUser(groupWithTransaction, userId) {
  return (
    getTotalCostOfTheGroup(groupWithTransaction, userId) /
    groupWithTransaction.groupData.members.length
  ).toFixed(1);
}

function getAmountPaid(groupWithTransaction, userId) {
  const { transactions } = groupWithTransaction;
  let totalAmountGiven = 0;
  transactions.forEach((transaction) => {
    if (transaction.payerId === userId) {
      totalAmountGiven += transaction.amount;
    }
  });
  return parseInt(totalAmountGiven);
}

function getOwnedAmount(groupWithTransaction, userId) {
  return (
    getCostToUser(groupWithTransaction, userId) -
    getAmountPaid(groupWithTransaction, userId)
  ).toFixed(1);
}

export default Group;
