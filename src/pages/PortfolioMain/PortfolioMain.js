import React from "react";
import "./PortfolioMain.scss";
import { Navbar } from "../../components/Layout";
import { Portfolio } from "../../components/UI";

const PortfolioMain = () => {
  return (
    <div className="portfolioMain">
      <Navbar />
      <div className="portfolioMain__element">
        <Portfolio />
      </div>
    </div>
  );
};

export default PortfolioMain;
