import { id, name } from "../../constant";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../fbConfig";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { PieChart } from "react-minimal-pie-chart";
import "./style.css";
export const Home = () => {
  const [amountDetails, setAmountDetails] = useState({ loading: true });

  const costs = [
    amountDetails.totalAmountGiven,
    amountDetails.totalExpenseToUser,
    amountDetails.totalAmountOwed,
  ];

  useEffect(() => {
    getAllTransactions(id)
      .then(totalExpenseToUser)
      .then(totalAmountGiven)
      .then((value) => {
        const { totalAmountGiven, totalExpenseToUser } = value;
        const totalAmountOwed = totalExpenseToUser - totalAmountGiven;
        setAmountDetails((p) => ({
          loading: false,
          totalAmountGiven,
          totalExpenseToUser,
          totalAmountOwed,
        }));
      });
  }, []);

  return (
    <div className="home">
      {amountDetails.loading ? (
        <Spinner style={{ marginTop: "1em" }} />
      ) : (
        <>
          <h1>Chat representation of your expense report</h1>
          <div className="piechat-warpper">
            <PieChart
              labelStyle={{ fontSize: "10px", color: "white" }}
              label={(props) => costs[props.dataIndex].toFixed(1)}
              data={[
                {
                  title: "Total amount given to groups",
                  value: amountDetails.totalAmountGiven,
                  color: "#E38627",
                },
                {
                  title: "Total expense to you",
                  value: amountDetails.totalExpenseToUser,
                  color: "#C13C37",
                },
                {
                  title: "Total amount you owed",
                  value: Math.abs(amountDetails.totalAmountOwed),
                  color: "#6A2135",
                },
              ]}
            />
            <div className="legend">
              <span
                className="dot"
                style={{ backgroundColor: "#E38627" }}
              ></span>
              <span>Total amount given to groups</span>
            </div>
            <div className="legend">
              <span
                className="dot"
                style={{ backgroundColor: "#C13C37" }}
              ></span>
              <span>Total expense to you</span>
            </div>
            <div className="legend">
              <span
                className="dot"
                style={{ backgroundColor: "#6A2135" }}
              ></span>
              <span>Total amount you owed *</span>
            </div>
            <span style={{ fontSize: "1em", color: "lightgrey" }}>
              * If owed money is negative, then others have to give money to you
            </span>
          </div>
        </>
      )}
    </div>
  );
};

async function getAllTransactions(userId) {
  const user = await getDoc(doc(db, "users", userId));
  const groups = user.data().groups;

  const transactionPromises = groups.map(async (groupId) => {
    const group = await getDoc(doc(db, "groups", groupId));
    const { transactionIds } = group.data();

    const transactionPromises = transactionIds.map(async (transactionId) => {
      const transaction = await getDoc(doc(db, "transactions", transactionId));
      return { transaction: transaction.data(), group: group.data() };
    });

    const transactions = await Promise.all(transactionPromises);
    return transactions;
  });

  const resolvedTransactions = await Promise.all(transactionPromises);
  const flatenTransactions = resolvedTransactions.flat();
  console.log(flatenTransactions);
  return flatenTransactions;
}

async function totalExpenseToUser(transactionsWithGroups) {
  const totalExpense = transactionsWithGroups.reduce(
    (previousTransactionWithGroup, currentTransactionWithGroup) => {
      const { group, transaction } = currentTransactionWithGroup;
      const membersLength = group.members.length;
      const amount = transaction.amount;
      const averageExpenseOfTheTransaction = amount / membersLength;
      return previousTransactionWithGroup + averageExpenseOfTheTransaction;
    },
    0
  );
  console.log(totalExpense);
  return { transactionsWithGroups, totalExpenseToUser: totalExpense };
}

async function totalAmountGiven(obj) {
  const userId = id;
  const { transactionsWithGroups } = obj;
  const totalAmount = transactionsWithGroups.reduce(
    (pv, currentTransactionWithGroup) => {
      const { transaction } = currentTransactionWithGroup;
      let returnAmount = pv;
      if (transaction.payerId === userId) {
        returnAmount = transaction.amount + pv;
        console.log(returnAmount, transaction.payerId);
      }
      return returnAmount;
    },
    0
  );
  console.log(totalAmount);
  return { ...obj, totalAmountGiven: totalAmount };
}
