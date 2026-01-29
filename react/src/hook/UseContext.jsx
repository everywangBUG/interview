import React from 'react';
import { useContext, createContext } from 'react';

const nightContext = createContext({ color: '#cccccc', fontColor: '#ffffff' });

const Head = (props) => {
    return <div style={{backgroundColor: props.color}}>
        <title style={{color: props.fontColor}}>娱乐公司主页</title>
        <span>用户：张三</span>
    </div>
}

const Content = (props) => {
    return <div style={{backgroundColor: props.color}}>
        <span style={{color: props.fontColor}}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum quam debitis enim, id deleniti assumenda odio consequatur quibusdam nobis sed harum ipsum quisquam obcaecati commodi autem, ducimus iusto quas quasi?</span>
    </div>
}

const UseContext = () => {
    const topic = useContext(nightContext);
    const { color = '', fontColor = '' } = topic;
    return (<div>
        <nightContext.Provider value={{color: '#ffffff', fontColor: '#cccccc'}}>
            <Head color={color} fontColor={fontColor} />
            <Content color={color} fontColor={fontColor} />
        </nightContext.Provider>
    </div>) 
}

export default UseContext;