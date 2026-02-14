import React, { useState, useRef, useEffect } from "react";
// import UseMergedStateFc from "./components/UseMergedStateFc";
// import UseMergedStateFc1 from "./components/UseMergedStateFc";
// import Calendar from "./components/Control";
// import Calendar1 from "./components/Control";
import MiniCalendar from './components/MiniCalendar.tsx/MiniCalendar';
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
// import ControlAndUnControl from "./components/ControlAndUnControl";

interface AppProps {
  name: string;
}

export interface MiniCalendarRef {
  getDate: () => Date,
  setDate: (date: Date) => void
}

const App = (props: AppProps) => {
  const [value, setValue] = useState<Date>(new Date());
  const miniCalendarRef = useRef<MiniCalendarRef>(null);

  useEffect(() => {
    console.log(miniCalendarRef.current?.getDate(), 'getDate');
    setTimeout(() => {
      miniCalendarRef?.current?.setDate(new Date(2027, 1, 1));
    }, 3000)
  }, []);

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
      {/* 非受控组件 */}
      {/* <Calendar
            defaultValue={new Date()}
            onChange={(date) => {
            console.log(date, 'date');
      }}/> */}
      {/* 受控组件 */}
      {/* <Calendar1 value={value} onChange={
        (date) => setValue(date)
      } /> */}
      {/* 同时支持受控组件和非受控组件，第一种：非受控组件 */}
      {/* <ControlAndUnControl
        defaultValue={new Date('2026/2/7')}
        onChange={(date) => console.log(date)}
      /> */}
      {/* 同时支持受控组件和非受控组件，第二种：受控模式 */}
      {/* <ControlAndUnControl
        value={value}
        onChange={(date) => setValue(date)}
      /> */}
      {/* <UseMergedStateFc 
        value={value}
        // onChange={(date) => setValue(date)}
        onChange={(date) => setValue(date)}
      /> */}
      {/* <UseMergedStateFc1
        value={value}
        // onChange={(date) => setValue(date)}
        onChange={(date) => setValue(date)}
      /> */}
      {/* <UseMergedStateFc
        defaultValue={new Date()}
        onChange={(date) => console.log(date.toLocaleDateString(), 'date') }
      /> */}
      <MiniCalendar
        value={value}
        onChange={(date) => {
          setValue(date);
          alert(`${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`)
        }}
      />
      {/* <MiniCalendar
        defaultValue={new Date()}
        onChange={(date) => alert(`${date.getFullYear()}年${date.getMonth()}月${date.getDate()}日`)}
        ref={miniCalendarRef}
      /> */}
    </div>
  );
};

export default App;
