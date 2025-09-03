import "./App.css";
import { DateRangeSelector } from "./components/DateRangeSelector";

function App() {
  return (
    <>
      <DateRangeSelector
        onChange={(start, end) => {
          console.log("Date selection changed", start, end);
        }}
      />
    </>
  );
}

export default App;
