import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGroups } from "../../hooks/useGroups";
import { Button, Heading } from "@chakra-ui/react";
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
import { db } from "../../fbConfig";
import { Spinner } from "@chakra-ui/react";

const Group = () => {
  const { gid } = useParams();
  const [groupWithTransaction, setGroupWithTransaction] = useState({
    loading: true,
  });

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
        <TableContainer>
          <Table variant="simple">
            <TableCaption>
              * If owed money is negative, then others have to give money to you
            </TableCaption>
            <Tbody>
              <Tr>
                <Th>The cost of the group:</Th>
                <Td>{getTotalCostOfTheGroup(groupWithTransaction)}</Td>
              </Tr>
              <Tr>
                <Th>It cost you:</Th>
                <Td>{getCostToUser(groupWithTransaction)}</Td>
              </Tr>
              <Tr>
                <Th>You've paid:</Th>
                <Td>{getAmountPaid(groupWithTransaction)}</Td>
              </Tr>
              <Tr>
                <Th className="owed">
                  <span>You are owed * :</span>
                </Th>
                <Td>{getOwnedAmount(groupWithTransaction)}</Td>
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

function getCostToUser(groupWithTransaction) {
  return (
    getTotalCostOfTheGroup(groupWithTransaction) /
    groupWithTransaction.groupData.members.length
  ).toFixed(1);
}

function getAmountPaid(groupWithTransaction) {
  const { transactions } = groupWithTransaction;
  let totalAmountGiven = 0;
  transactions.forEach((transaction) => {
    if (transaction.payerId === getCurrentUserId()) {
      totalAmountGiven += transaction.amount;
    }
  });
  return parseInt(totalAmountGiven);
}

function getOwnedAmount(groupWithTransaction) {
  return (
    getCostToUser(groupWithTransaction) - getAmountPaid(groupWithTransaction)
  ).toFixed(1);
}

function getCurrentUserId(id) {
  return "Gc2HdfWtYB6Qrge5QZIO";
}
export default Group;
