import React, { memo, useState, useEffect, useCallback, useMemo } from "react";

// memo的作用是父组件的props变化的时候，才会重新渲染子组件
const UseCallback = () => {
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(8);

  useEffect(() => {
    setInterval(() => {
      setNum((count) => (count += 2));
    }, 2000);
  }, []);

  // 把函数传入了子组件中memo会失效，每次渲染子组件
  // const sonCallback = () => {
  //   return 111;
  // };

  // 使用useCallback缓存对象或者函数配合memo使用，可以防止props的不必要变化，依赖数组传空[]
  const sonCallback = useCallback(() => {
    return 1111;
  }, []);

  return (
    <>
      <div>{num}</div>
      <SonMemo value={count} callback={sonCallback} />
    </>
  );
};

const SonMemo = memo((props) => {
  // 使用memo后如果props没有变化只打印一次，父组件传函数会使得父组件的props变化，memo失效，使用useCallback
  console.log(props.value, "只打印一次");
  console.log(props.callback(), "props.callback");

  return <div>{props.value}</div>;
});

export default UseCallback;
