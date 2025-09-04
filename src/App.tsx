import React from "react";
import "./App.css";
import { DateRangeSelector } from "./components/DateRangeSelector";

function App() {
  return (
    <React.Fragment>
      <DateRangeSelector
        onChange={(start, end) => {
          console.log("Date selection changed", start, end);
        }}
      />
    </React.Fragment>
  );
}

export default App;
