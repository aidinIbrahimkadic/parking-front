import React from "react";
import { Panel } from "../Layout.jsx";
import DocumentsList from "../DocumentsList.jsx";

export default function DocumentsPanel() {
  return (
    <Panel>
      <DocumentsList />
    </Panel>
  );
}
