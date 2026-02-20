import React, { use, Suspense } from "react";

const Message = ({ messagePromise }) => {
  // use可以接收一个promise结果，或者在条件语句或者循环中使用use获取context上下文
  const messageContent = use(messagePromise);

  return <div>here is Message: {messageContent}</div>;
};

export const Use = ({ messagePromise }) => {
  return (
    <Suspense fallback={<p>等待MessagePromise中</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
};

export default Use;
