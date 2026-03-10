// import { useState } from "react";

// import { useEffect } from "react";
// import CookieDemo from "./components/CookieDemo/CookieDemo";
// import HoverDemo from "./components/HoverDemo/HoverDemo";
// import { useRef } from "react";
// import { Message, MessageRef } from "./components/Message/Message";
// import { useMessage } from "./components/Message/useMessage";
// import { ConfigProvider } from "./components/Message/CinfigProvider";
// import { Watermark } from "gene-components";
// import { useMessage, ConfigProvider } from "gene-components";
import { Calendar, useMessage, ConfigProvider, Watermark } from 'gene-components-rollup';
import "gene-components-rollup/dist/index.css";
// import { Calendar } from 'gene-components';
// import "gene-components/dist/esm/Calendar/Calendar.css";
// import "gene-components/dist/esm/Calendar/Header.css";
// import "gene-components/dist/esm/Calendar/MonthCalendar.css";

// import { IconAdd } from "./components/Icon/IconAdd";
// import { IconEmail } from "./components/Icon/IconEmail";
// import Space from "./components/Space/Space";
// import { ConfigContext } from "./components/Space/ConfigProvider";
import dayjs from 'dayjs';
// import Calendar from './components/Calendar/Calendar';
// import LazyLoadDemo from "./components/LazyLoadDemo/LazyLoadDemo";
// import Watermark from "./components/Watermark/Watermark";
// import { ConfigProvider, Space as SpaceAntd } from 'antd';
// import { SpaceContextProvider } from "antd/es/space/context";
// import HookDemo from "./components/HookDemo/HookDemo";

function MessageDemo () {
  const message = useMessage();

  return <>
            <button
              onClick={() => {
                message.add({ duration: 2000, position: 'top',  content: `请求成功${Math.random().toString().slice(2, 8)}` })
              }}
            >成功</button> 
            <button
              onClick={() => {
                message.add({ duration: 2000, position: 'bottom',  content: '请求失败' })
              }}
            >失败</button> 
         </>
}

function App() {
  // const [visible, setVisible] = useState(true);
  // const messageRef = useRef<MessageRef>(null);


  return (
    // <>
    //   <Message ref={messageRef} />
    //   <button onClick={() => {
    //     messageRef.current?.add({
    //       id: 1,
    //       content: '请求成功'
    //     })
    //   }}>点击请求成功 </button>
    // </>

    <>
      <ConfigProvider>
        <div>
          <MessageDemo></MessageDemo>
        </div>
      </ConfigProvider>
      <Watermark
        gap={[2,1]}
        width={100}
        fontStyle={{color: 'red' }}
        getContainer={() => document.body}
        content={'水印水印'}
        rotate={135}
        className={'watermark'}
        offset={[10, 10]}
        // image={'https://picx.zhimg.com/v2-ab23d513fab6abd0a27cda9ba9676383_720w.jpg?source=172ae18b'}
        zIndex={-1}
      >
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
      </Watermark>
      <Calendar
        date={dayjs(new Date())}
        defaultValue={dayjs('2026/1/2')}
        // dateRanger={(value) => {
        //   return <div>
        //     <p style={{backgroundColor: 'yellow', height: '50px'}}>{value.format('YYYY-MM-DD')}</p>
        //   </div>
        // }}
        // dateInnerContent={(value) => {
        //     return <div>
        //       <p style={{backgroundColor: 'red', height: '25px'}}>{value.year()}</p>
        //     </div>
        // }}
        locale='zh-CN'
        onChange={(date) => {
          console.log(date.format('YYYY-MM-DD'))
        }}
      />
    </>

    // <>
    //   <HoverDemo />
    //   <CookieDemo />
    // </>

    // <>
    //   {/* <LazyLoadDemo /> */}
    //   <button onClick={() => setVisible(!visible)}>switch</button>
    //   { visible ? <HookDemo /> : <div>placeholder</div> }
    // </>
  
    // <>
    //   <Calendar
    //     date={dayjs(new Date())}
    //     defaultValue={dayjs('2026/1/2')}
    //     dateRanger={(value) => {
    //       return <div>
    //         <p style={{backgroundColor: 'yellow', height: '50px'}}>{value.format('YYYY-MM-DD')}</p>
    //       </div>
    //     }}
    //     dateInnerContent={(value) => {
    //         return <div>
    //           <p style={{backgroundColor: 'red', height: '25px'}}>{value.year()}</p>
    //         </div>
    //     }}
    //     locale='zh-CN'
    //     onChange={(date) => {
    //       alert(date.format('YYYY-MM-DD'))
    //     }}
    //   />
    // </>

    // <>
    //   <IconAdd size={['100px', '100px']} spin={true} />
    //   <IconEmail size={['100px', '100px']} />
    // </>
    // <>
    //   <div style={{width: '230px', height: '100px'}}>
    //     <Space size={['large', 24]} wrap={true} align='baseline' split={<p>这是一条分割线</p>}>
    //       <button>按钮1</button>
    //       <button>按钮2</button>
    //       <button>按钮3</button>
    //       <button>按钮1</button>
    //       <button>按钮2</button>
    //       <button>按钮3</button>
    //     </Space>
    //   </div>

    //   <ConfigContext.Provider value={{ space: { size: 20 }}}>
    //     <Space direction='vertical'>
    //       <button>888</button>
    //       <button>888</button>
    //       <button>888</button>
    //     </Space>

    //     <Space direction='horizontal'>
    //       <button>4</button>
    //       <button>5</button>
    //       <button>6</button>
    //     </Space>
    //   </ConfigContext.Provider>

    //   <ConfigProvider space={{size: 100}}>
    //     <SpaceAntd direction='vertical'>
    //       <button>按钮1</button>
    //       <button>按钮2</button>
    //       <button>按钮3</button>
    //     </SpaceAntd>
    //     <SpaceAntd direction='horizontal'>
    //       <button>按钮1</button>
    //       <button>按钮2</button>
    //       <button>按钮3</button>
    //     </SpaceAntd>
    //   </ConfigProvider>
    // </>
    // <>
    // </>
  )
}

export default App
