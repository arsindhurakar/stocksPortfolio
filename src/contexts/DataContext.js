import React, { useState, useContext, createContext } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import moment from "moment";

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

const DataProvider = ({ children }) => {
  const [statements, setStatements] = useState([]);
  const [stocksInHand, setStocksInHand] = useState([]);
  const [stocksSold, setStocksSold] = useState([]);

  const { currentUser } = useAuth();

  const getStatements = () => {
    db.collection("transactions")
      .where("uid", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        let datas = [];
        querySnapshot.forEach((doc) => {
          const { stock, action, quantity, investment, timestamp } = doc.data();
          const data = {
            transactionID: doc.id,
            stock,
            action,
            quantity,
            investment,
            timestamp: moment(timestamp?.toDate()).format("LLLL"),
            // timestamp: timestamp.toDate().toString(),
          };
          datas = [...datas, data];
        });
        setStatements(datas);
      });
  };

  const getStocksInHand = () => {
    db.collection("stocksInHand")
      .where("uid", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        let datas = [];
        querySnapshot.forEach((doc) => {
          const { stock, investment, quantity, pricePerUnit } = doc.data();
          const data = {
            stockID: doc.id,
            stock,
            investment,
            quantity,
            pricePerUnit,
          };
          datas = [...datas, data];
        });
        setStocksInHand(datas);
      });
  };

  const getStocksSold = () => {
    db.collection("stocksSold")
      .where("uid", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        let datas = [];
        querySnapshot.forEach((doc) => {
          const {
            stock,
            quantity,
            soldAmount,
            investment,
            currentAmount,
            profitLoss,
          } = doc.data();
          const data = {
            stockID: doc.id,
            stock,
            quantity,
            soldAmount,
            investment,
            currentAmount,
            profitLoss,
          };
          datas = [...datas, data];
        });
        setStocksSold(datas);
      });
  };

  const values = {
    getStatements,
    statements,
    getStocksInHand,
    stocksInHand,
    getStocksSold,
    stocksSold,
  };
  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};

export default DataProvider;
