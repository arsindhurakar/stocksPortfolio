import React, { useEffect } from "react";
import "./Overview.scss";
import getFormattedAmount from "../../../utils/getFormattedAmount";
import { useData } from "../../../contexts/DataContext";

const Overview = ({ getStocksInHand, stocksInHand, stocksData }) => {
  useEffect(() => {
    getStocksInHand();
    getStocksSold();
  }, []);

  const { getStocksSold, stocksSold } = useData();

  const getCurrentAmountTotal = () => {
    let datas = [];
    stocksInHand.map(({ stock, quantity }) => {
      let stockData = stocksData.filter(({ name }) => name === stock);
      return (datas = [...datas, stockData[0]?.pricePerUnit * quantity]);
    });
    return (
      datas.length > 0 && datas.reduce((prevVal, currVal) => prevVal + currVal)
    );
  };

  const getTotalInvestement = () => {
    let datas = [];
    stocksInHand.map(
      ({ quantity, pricePerUnit }) =>
        (datas = [...datas, quantity * pricePerUnit])
    );
    return (
      datas.length > 0 && datas.reduce((prevVal, currVal) => prevVal + currVal)
    );
  };

  const getTotalQuantity = () => {
    let datas = [];
    stocksInHand.map(({ quantity }) => (datas = [...datas, quantity]));
    return (
      datas.length > 0 && datas.reduce((prevVal, currVal) => prevVal + currVal)
    );
  };

  const getTotalSoldAmount = () => {
    let datas = [];
    stocksSold.map(({ soldAmount }) => (datas = [...datas, soldAmount]));
    return (
      datas.length > 0 && datas.reduce((prevVal, currVal) => prevVal + currVal)
    );
  };

  return (
    <div className="overview">
      <div className="overview__header">
        <p>Your Portfolio</p>
        {/* Current Amount */}
        <p> Rs. {getFormattedAmount(getCurrentAmountTotal())}</p>
        {/* Overall Profit/Loss: */}
        <p>
          Rs.{" "}
          <span
            className={
              getCurrentAmountTotal() - getTotalInvestement() > 0
                ? "overview__profit"
                : getCurrentAmountTotal() - getTotalInvestement() < 0
                ? "overview__loss"
                : ""
            }
          >
            {getFormattedAmount(
              getCurrentAmountTotal() - getTotalInvestement()
            )}
          </span>
        </p>
      </div>
      <div className="overview__body">
        <p>
          <span>Quantity</span> <span>{getTotalQuantity()} units</span>
        </p>
        <p>
          <span>Sold Amount</span>{" "}
          <span>Rs. {getFormattedAmount(getTotalSoldAmount())}</span>
        </p>
        <p>
          <span>Total Investment</span>{" "}
          <span>Rs. {getFormattedAmount(getTotalInvestement())}</span>
        </p>
      </div>
    </div>
  );
};

export default Overview;
