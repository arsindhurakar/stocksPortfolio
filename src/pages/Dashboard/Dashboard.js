import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import { Navbar } from "../../components/Layout";
import {
  Statement,
  StocksSold,
  Overview,
  Transaction,
} from "../../components/UI";
import { Tabs } from "antd";
import { apiData } from "../../services";
import uuid from "react-uuid";
import { useData } from "../../contexts/DataContext";

const Dashboard = () => {
  const [stocksData, setStocksData] = useState([]);

  const { getStocksInHand, stocksInHand } = useData();

  const { TabPane } = Tabs;

  useEffect(() => {
    apiData().then(({ data }) =>
      data.map((element) =>
        setStocksData((prev) => [...prev, { ...element, id: uuid() }])
      )
    );
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__element">
        <Tabs defaultActiveKey="1" centered className="dashboard__tabPane">
          <TabPane tab="STATEMENTS" key="1">
            <Statement />
          </TabPane>
          <TabPane tab="TRANSACTION" key="2">
            <Transaction
              getStocksInHand={getStocksInHand}
              stocksInHand={stocksInHand}
              stocksData={stocksData}
            />
          </TabPane>
        </Tabs>
      </div>
      <div className="dashboard__body">
        <div className="dashboard__element">
          <StocksSold stocksData={stocksData} />
        </div>
        <div className="dashboard__element">
          <Overview
            getStocksInHand={getStocksInHand}
            stocksInHand={stocksInHand}
            stocksData={stocksData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
