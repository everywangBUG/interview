import { useState } from "react";
import List from "rc-virtual-list";
import VirtualList from "./VirtualList";

interface Item {
  id: number;
  content: string;
}

function App() {
  const [list, setList] = useState();

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
        />
    </>
  )
}

export default App;
