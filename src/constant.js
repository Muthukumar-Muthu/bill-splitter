const name = "Muthukumar";
const id = "Gc2HdfWtYB6Qrge5QZIO";
const groups = [
  {
    gid: "123",
    title: "Tour",
    members: [
      {
        name,
        id,
      },
      {
        name: "Yogesh",

        id: "1234",
      },
      {
        name: "Nithish",
        id: "342",
      },
    ],
    transactionIds: ["1", "2", "3"],
  },
  {
    gid: "235",
    title: "Ski dinner",
    members: [
      {
        name,
        id,
      },
      {
        name: "Yogesh",

        id: "1234",
      },
      {
        name: "Nithish",
        id: "342",
      },
    ],
    transactionIds: ["1", "2", "3"],
  },
];
const transactions = {
  1: {
    tid: "1",
    payerId: "1",
    reason: "Dinner",
    amount: 25,
    date: "2022-08-09",
  },
  2: {
    tid: "2",
    payerId: "2",
    reason: "Lunch",
    amount: 50,
    date: "2022-08-09",
  },
  3: {
    tid: "3",
    payerId: "3",
    reason: "BreakFast",
    amount: 28,
    date: "2022-08-09",
  },
};
export { name, id, groups, transactions };
