import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import "./style.css";

const Transactions = ({ transactions, members }) => {
  const transactionsRow = transactions.map((transaction) => (
    <Transaction
      key={transaction.transId}
      transaction={transaction}
      members={members}
    />
  ));

  return (
    <section className="transactions">
      <h1>Transactions</h1>
      {transactions.length === 0 ? (
        <h5>No transaction to display</h5>
      ) : (
        <TableContainer>
          <Table size="md">
            <Thead>
              <Tr>
                <Th>Paid By</Th>
                <Th>Reason</Th>
                <Th>Amount</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>{transactionsRow}</Tbody>
          </Table>
        </TableContainer>
      )}
    </section>
  );
};
export default Transactions;

function getUser(id, members) {
  return members.find((member) => member.id === id).name;
}

function Transaction({ transaction, members }) {
  return (
    <Tr>
      <Td>{getUser(transaction.payerId, members)}</Td>
      <Td>{transaction.reason}</Td>
      <Td>{transaction.amount}</Td>
      <Td>{transaction.date}</Td>
    </Tr>
  );
}
