import React, { useEffect } from "react";
import "./StocksSold.scss";
import { Table } from "antd";
import { useData } from "../../../contexts/DataContext";
import getFormattedAmount from "../../../utils/getFormattedAmount";

const StocksSold = ({ stocksData }) => {
  const { getStocksSold, stocksSold } = useData();

  useEffect(() => {
    getStocksSold();
  }, []);

  const getCurrentAmount = (stock, quantity) => {
    const stockData = stocksData.filter(({ name }) => name === stock);
    return stockData[0]?.pricePerUnit * quantity;
  };

  const columns = [
    {
      title: "#",
      dataIndex: "snum",
      key: "snum",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Stock Name",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Sold Amount",
      dataIndex: "soldAmount",
      key: "soldAmount",
      render: (text) => getFormattedAmount(text),
    },
    {
      title: "Total Investment",
      dataIndex: "investment",
      key: "investment",
      render: (text) => getFormattedAmount(text),
    },
    {
      title: "Current Amount",
      dataIndex: "currentAmount",
      key: "currentAmount",
      render: (text) => getFormattedAmount(text),
    },
    {
      title: "Profit/Loss",
      dataIndex: "profitLoss",
      key: "profitLoss",
      render: (text) => (
        <span
          className={
            text > 0
              ? "portfolioMain__profit"
              : text < 0
              ? "portfolioMain__loss"
              : ""
          }
        >
          {getFormattedAmount(text)}
        </span>
      ),
    },
  ];

  const getData = () =>
    stocksSold.map(
      (
        {
          stockID,
          stock,
          quantity,
          soldAmount,
          investment,
          // currentAmount,
          profitLoss,
        },
        index
      ) => ({
        key: stockID,
        snum: index + 1,
        stock,
        quantity,
        soldAmount,
        investment,
        currentAmount: getCurrentAmount(stock, quantity),
        profitLoss,
      })
    );

  return (
    <div className="stocksSold">
      <Table
        columns={columns}
        dataSource={getData()}
        pagination={{ pageSize: 3 }}
      />
    </div>
  );
};

export default StocksSold;
