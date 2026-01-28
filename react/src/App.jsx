import React from 'react';
import UseReducer from './hook/UseReducer';
// import UseState from './hook/UseState';
// import UseEffect from './hook/UseEffect';
// import UseLayoutEffect from './hook/useLayoutEffect';

const App = () => {

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {/* <UseState />
            <UseEffect /> */}
            {/* <UseLayoutEffect /> */}
            <UseReducer />
        </div>
    )
}

export default App;