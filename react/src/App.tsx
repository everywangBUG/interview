import React, { useState } from "react";
// import Calendar from "./components/Control";
import Calendar1 from "./components/UnControl";
// import UseState from './hook/UseState';
// import UseEffect from './hook/UseEffect';
// import UseLayoutEffect from './hook/useLayoutEffect';
// import UseRef from './hook/useRef';
// import ForwardRef from './hook/ForwardRef';
// import UseContext from './hook/UseContext';
// import Memo from './hook/Memo';
// import UseReducer from './hook/UseReducer';
// import UseCallback from "./hook/UseCallback";
// import UseMemo from "./hook/UseMemo";
// import UseDeferredValue from "./hook/UseDeferredValue";
// import UseTransition from "./hook/UseTransition";
// import Closure from "./feature/Closure";

interface AppProps {
  name: string;
}

const App = (props: AppProps) => {
  const [value, setValue] = useState<Date>(new Date());

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* <UseState />
            <UseEffect /> */}
      {/* <UseLayoutEffect /> */}
      {/* <UseReducer /> */}
      {/* <UseRef /> */}
      {/* <ForwardRef /> */}
      {/* <UseContext /> */}
      {/* <Memo /> */}
      {/* <UseCallback /> */}
      {/* <UseMemo /> */}
      {/* <UseDeferredValue /> */}
      {/* <UseTransition /> */}
      {/* <Closure /> */}
      {/* <Calendar defaultValue={new Date()} onChange={(date) => {
        console.log(date, 'date');
      }}/> */}
      <Calendar1 value={value} onChange={
        (date) => setValue(date)
      } />
    </div>
  );
};

export default App;
