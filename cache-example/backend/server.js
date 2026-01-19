const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const morgan = require('morgan');
const { timeStamp } = require('console');

const app = express();
const PORT = 3001;

// 中间件
// 跨域中间件
app.use(cors());
// 请求日志中间件
app.use(morgan());
app.use(express.json());

// 内存缓存
const mermoryCache = new Map();
const ETAG_CACHE = new Map();
const LAST_MODIFIED_CACHE = new Map();

// 生成ETag
function generateEtag(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

// 生成最后修改时间
function generateLastModified() {
    return new Date().toUTCString();
}

// http1.0使用Expires字段告诉客户端是否可以使用当前副本，直到指定的时间为止，缺陷是客户端和服务端的时间可能不一致

// 强缓存
// 带上Cache-Control和Expires一般称为强缓存
app.get('/api/strong-cache', (req, res) => {
    console.log('强缓存接口被访问');

    // 设置强缓存60s
    res.set({
        // public表示可以被任何缓存(包括代理服务器、CDN、浏览器)缓存， private表示响应只能被客户端浏览器缓存
        // max-age=60，表示资源被缓存60s，在这个时间段内，客户端会直接从缓存中读取资源，不会像服务器发送请求，60s后，缓存过期重新向服务端请求资源
        'Cache-Control': 'public, max-age=60',
        'Expires': new Date(Date.now() + 60000).toUTCString()
    })

    res.json({
        message: '这是一个强缓存的响应，60s',
        timestamp: new Date().toISOString(),
        data: Math.random()
    })
})

// 协商缓存(ETag)
// 如果使用时间来判断会带来一定的误差，比如服务器使用特定的加密算法(比如md5)生成文件的唯一标志Etag
// 客户端的请求头把返回的ETag通过if-none-match带给服务端，服务端通过对比决定是否响应新的内容。
app.get('/api/etag-cache', (req, res) => {
    console.log('ETag接口被访问');

    const content = JSON.stringify({
        message: '这是一个ETag缓存的响应',
        timestamp: new Date().toISOString(),
        data: 'Static-data' // 静态数据
    })

    // 生成etag
    const etag = generateEtag(content);
    console.log(etag, 'etag');
    // 缓存到ETAG_CACHE中
    ETAG_CACHE.set('/api/etag-cache', { etag, content});

    // 定义客户端的clientETag
    const clientETag = req.headers['if-none-match'];
    console.log(clientETag, 'clientEtag');

    // 如果资源未修改，状态改为304
    if (clientETag && clientETag === etag) {
        return res.status(304).end();
    }

    res.set({
        'ETag': etag,
        'Cache-Control': 'no-chache' // 需要每次验证
    })

    res.json(JSON.parse(content));
})

// 协商缓存(Last-Modified)
// Last-Modified是服务器给客户端设置的reponse headers的字段，告知客户端资源的最后修改时间，if-modified-since是服务端上次给的该资源的最后修改时间，放到request headers中给服务器对比
// 如果最后的资源的修改时间大于上次给的资源的修改时间if-Modified-since，说明资源被改动过，返回新的资源，状态码200
// 如果最后的资源的修改时间小时上次的资源的修改时间if-Modified-since，资源未修改，返回状态码304
app.get('/api/last-modified', (req, res) => {
    console.log('Last-Modified接口被访问');

    const lastModified = generateLastModified();
    const content = {
        message: '这是一个Last-Modified缓存的响应',
        timestamp: new Date().toISOString(),
        data: 'static-last-modified-data'
    }

    LAST_MODIFIED_CACHE.set('api/last-modified', { lastModified, content });
    
    const clientModified = req.headers['if-modified-since'];

    if (clientModified && new Date(clientModified) >= new Date(lastModified)) {
        console.log('Last-Modified未修改，返回304');
        return res.status(304).end();
    }

    res.set({
        'Last-Modified': lastModified,
        'Cache-Control': 'no-cache'
    })
    
    res.json(content);
})

// service worker缓存
app.get('/api/sw-cache', (req, res) => {
    console.log('Service Worker缓存接口被访问');

    res.set({
        'Cache-Control': 'no-cache',
        'X-Cache-Type': 'service-worker'
    })

    res.json({
        message: 'Service Worker缓存数据',
        timeStamp: new Date().toISOString(),
        data: Math.random().toString(36).substring(7)
    })
})

// 不缓存
app.get('/api/no-cache', (req, res) => {
    console.log('不缓存接口被访问');

    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Prama': 'no-cache',
        'Expires': '0'
    })

    res.json({
        message: '这是一个不缓存的响应',
        timeStamp: new Date().toISOString(),
        data: Math.random()
    })
})

// CDN缓存实例
app.get('/api/cdn-cache', (req, res) => {
    console.log('CDN缓存接口被调用');

    res.set({
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'CDN-Cache-control': 'public, max-age=7200',
        // 根据客户端是否支持压缩，区分缓存不同的内容版本
        'Vary': 'Accept-Encoding'
    })

    res.json({
        message: 'CDN缓存数据，浏览器缓存一小时，CDN缓存2小时',
        timeStamp: new Date().toISOString(),
        data: 'cdn-cached-data'
    })
})

// 版本缓存
app.get('/api/v1/data', (req, res) => {
    console.log('版本缓存接口被访问');

    res.set({
        'Cache-Control': 'public, max-age=31536000', // 一年
        'ETag': 'v1.0.0'
    })

    res.json({
        message: '版本化的API响应（长期缓存）',
        version: 'v1.0.0',
        data: {
            users: ['Alice', 'Bob', 'Charlie']
        }
    })
})

// 内存缓存实例
app.get('/api/memory-cache', (req, res) => {
    console.log('内存缓存接口被访问');

    const cacheKey = 'memory-cache-data';
    const cacheTimeout = 30000; // 30秒

    if (mermoryCache.has(cacheKey)) {
        const cached = mermoryCache.get(cacheKey);
        if (Date.now() - cached.timeStamp < cacheTimeout) {
            console.log('从内存缓存中返回');
            return res.json(cached.data);
        }
    }

    // 模拟数据库查询
    const newData = {
        message: '从数据库中获取数据',
        timeStamp: new Date().toISOString(),
        data: Math.random(),
        source: 'database'
    }

    mermoryCache.set(cacheKey, {
        timeStamp: Date.now(),
        data: newData
    })

    return res.json(newData);
})

// 获取缓存状态
app.get('/api/cache-status', (req, res) => {
    console.log(mermoryCache, 'mermoryCache');
    res.json({
        mermoryCache: {
            size: mermoryCache.size,
            keys: Array.from(mermoryCache.keys)
        },
        etagCache: {
            size: ETAG_CACHE.size,
            keys: Array.from(ETAG_CACHE.keys)
        },
        lastModified: {
            size: LAST_MODIFIED_CACHE.size,
            keys: Array.from(LAST_MODIFIED_CACHE.keys)
        }
    })
})

app.listen(PORT, () => {
    console.log(`后端服务器运行在 http://localhost:${PORT}`);
    console.log('可用接口:');
    console.log('  GET  /api/strong-cache     - 强缓存示例');
    console.log('  GET  /api/etag-cache       - ETag协商缓存');
    console.log('  GET  /api/last-modified    - Last-Modified缓存');
    console.log('  GET  /api/service-worker    - Service-Worker缓存');
    console.log('  GET  /api/no-cache    - No-Cache缓存');
    console.log('  GET  /api/cdn-cache    - CDN-Cache缓存');
    console.log('  GET  /api/v1-data    - 版本缓存');
    console.log('  GET  /api/memory-cache    - 内存缓存');
    console.log('  GET  /api/cache-status    - 缓存状态');
})