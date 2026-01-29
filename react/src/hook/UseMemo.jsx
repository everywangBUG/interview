import React, { memo, useState, useMemo } from "react";

// memo的作用是父组件的props变化的时候，才会重新渲染子组件
const UseMemo = () => {
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(100);

  const expensiveCalc = (number) => {
    let res = 0;
    for (let i = 0; i < 2 ** 32; i++) {
      res += i;
    }
    console.log("计算了，，");
    return number * 2;
  };

  // const expensiveRes = expensiveCalc(2);
  // 仅当num依赖项发生变化重新计算，当count变化的时候不会重新计算
  const expensiveRes = useMemo(() => expensiveCalc(2), [num]);

  return (
    <>
      <div onClick={() => setNum((num) => (num += 1))}>{num}</div>
      <div onClick={() => setCount((num) => (num += 1))}>{count}</div>
      <SonMemo value={expensiveRes} />
    </>
  );
};

const SonMemo = memo((props) => {
  console.log(props.value, "只打印一次");

  return <div>{props.value}</div>;
});

export default UseMemo;
