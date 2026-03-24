import { useState } from "react";
import List from "rc-virtual-list";
import VirtualList from "./VirtualList";

const list_demo = Array.from({length: 10000}, (_, idx) => {
  return <div key={idx}>
      {idx}
    </div>
});

interface Item {
  id: number;
  content: string;
}

function App() {

  const [data] = useState<Item[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      content: `这是第 ${i} 条数据，用于测试虚拟滚动性能。`,
    }))
  );


  return (
    <>
      {/* <List data={list_demo} height={200} itemHeight={30} itemKey={Math.random().toString().slice(0, 8)}>
        {index => <div>{index}</div>}
      </List> */}
      <div>
      <h3>固定 (自动测量)</h3>
        <VirtualList
            data={data}
            height={400}
            itemHeight={50}
            renderItem={(item) => (
              <div style={{ 
                height: '100%', 
                borderBottom: '1px solid #ddd', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 10px' 
              }}>
                {item.content}
              </div>
            )}
          >
        </VirtualList>
      </div>

      <div>
        <h3>动态高度 (自动测量)</h3>
        <VirtualList
          data={data.map((d, i) => ({ ...d, content: d.content.repeat(i % 3 + 1) }))}
          height={400}
          itemHeight={() => 60} // 初始预估高度
          renderItem={(item) => (
            <div style={{ 
              borderBottom: '1px solid #eee', 
              padding: '10px',
              // 不设置固定高度，让内容撑开
            }}>
              <strong>ID: {item.id}</strong>
              <p>{item.content}</p>
            </div>
          )}
        />
      </div>
    </>
  )
}

export default App;
