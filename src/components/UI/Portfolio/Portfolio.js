import React, { useState, useEffect } from "react";
import "./Portfolio.scss";
import { Table } from "antd";
import { useData } from "../../../contexts/DataContext";
import { apiData } from "../../../services";
// import uuid from "uuid";
import getFormattedAmount from "../../../utils/getFormattedAmount";

const Portfolio = () => {
  const [stocksData, setStocksData] = useState([]);

  const { getStocksInHand, stocksInHand } = useData();

  useEffect(() => {
    getStocksInHand();
    apiData().then(({ data }) =>
      data.map((element) => setStocksData((prev) => [...prev, { ...element }]))
    );
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "snum",
      key: "snum",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
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

  const getData = () => {
    const getCurrentAmount = (stock, quantity) => {
      const stockData = stocksData.filter(({ name }) => name === stock);
      return quantity * stockData[0]?.pricePerUnit;
    };

    return stocksInHand.map(
      ({ stockID, stock, quantity, pricePerUnit }, index) => ({
        key: stockID,
        snum: index + 1,
        stock,
        quantity,
        investment: quantity * pricePerUnit,
        currentAmount: getCurrentAmount(stock, quantity),
        profitLoss: getCurrentAmount(stock, quantity) - quantity * pricePerUnit,
      })
    );
  };

  return (
    <div className="portfolio">
      <Table
        columns={columns}
        dataSource={getData()}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Portfolio;
