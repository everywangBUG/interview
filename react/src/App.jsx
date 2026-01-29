import React from 'react';
// import UseReducer from './hook/UseReducer';
// import UseState from './hook/UseState';
// import UseEffect from './hook/UseEffect';
// import UseLayoutEffect from './hook/useLayoutEffect';
// import UseRef from './hook/useRef';
// import UseFowardRef from './hook/ForwardRef';
import UseContext from './hook/UseContext';
import Memo from './hook/Memo';

const App = () => {

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {/* <UseState />
            <UseEffect /> */}
            {/* <UseLayoutEffect /> */}
            {/* <UseReducer /> */}
            {/* <UseRef /> */}
            {/* <UseFowardRef /> */}
            {/* <UseContext /> */}
            <Memo />
        </div>
    )
}

export default App;