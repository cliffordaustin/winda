import React from "react";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Home from "./Home";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Button from "../../components/ui/Button";

function Analytics() {
  const send = () => {
    console.log("Send");
    Mixpanel.register_once({ "First Login Date": new Date().toISOString() });
  };
  return (
    <div>
      <TopBar></TopBar>
      <div className="flex">
        <div className="w-[20%]">
          <Sidebar></Sidebar>
        </div>
        <div className="w-[80%]">
          <Home></Home>
          <Button
            onClick={() => {
              send();
            }}
          >
            Clicked
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
