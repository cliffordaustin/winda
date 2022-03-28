import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Home from "./Home";

function Analytics() {
  return (
    <div>
      <TopBar></TopBar>
      <div className="flex">
        <div className="w-[20%]">
          <Sidebar></Sidebar>
        </div>
        <div className="w-[80%]">
          <Home></Home>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
