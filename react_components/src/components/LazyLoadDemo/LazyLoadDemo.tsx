import React from "react";
import LazyLoad from "../LazyLoad/LazyLoad";

const LazyDemo = React.lazy(() => import('./LazyDemo'));

const LazyLoadDemo = () => {
    return <div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <div>11111</div>
        <LazyLoad placeholder={<p>loading...</p>} offset={'100px'} onContentVisible={() => {
            console.log('lazy component loaded')
        }}>
            <LazyDemo />
        </LazyLoad>
        <LazyLoad placeholder={<p>loading...</p>} offset={'20px'} onContentVisible={() => {
            console.log('loaded')
        }}>
            <img src='https://vcg00.cfp.cn/creative/vcg/800/new/VCG41N2206741284.jpg' alt='' />
        </LazyLoad>
    </div>
}

export default LazyLoadDemo