import React from "react";
import { Panel } from "../Layout.jsx";
import LiveOverview from "../LiveOverview.jsx";

export default function LivePanel() {
  return (
    <Panel>
      <LiveOverview baseFilters={{}} />
    </Panel>
  );
}
