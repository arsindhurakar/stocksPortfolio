import React, { useEffect } from "react";
import "./Statement.scss";
import { Table } from "antd";
import { useData } from "../../../contexts/DataContext";
import getFormattedAmount from "../../../utils/getFormattedAmount";

const Statement = () => {
  const { getStatements, statements } = useData();

  useEffect(() => {
    getStatements();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "snum",
      key: "snum",
    },
    {
      title: "Stock Name",
      dataIndex: "stockName",
      key: "stockName",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => getFormattedAmount(text),
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
    },
  ];

  // console.log("statements", statements);

  const getData = () =>
    statements.map(
      (
        { transactionID, stock, action, quantity, investment, timestamp },
        index
      ) => ({
        key: transactionID,
        snum: index + 1,
        stockName: stock,
        transactionType: action,
        quantity,
        amount: investment,
        transactionDate: timestamp,
      })
    );

  return (
    <div className="statement">
      <Table
        columns={columns}
        dataSource={getData()}
        pagination={{ pageSize: 3 }}
      />
    </div>
  );
};

export default Statement;
