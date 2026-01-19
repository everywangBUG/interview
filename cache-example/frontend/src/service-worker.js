// 自定义Service Worker
const CACHE_NAME = 'cache-demo-v1';
const API_CACHE_NAME = 'api-cache-v1';

// 需要缓存的API路径
const API_CACHE_PATHS = [
  '/api/sw-cache',
  '/api/v1/data'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json'
        ]);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活');
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API缓存策略
  if (API_CACHE_PATHS.some(path => url.pathname.includes(path))) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }
  
  // 静态资源缓存策略
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('从缓存加载:', event.request.url);
            return response;
          }
          
          return fetch(event.request)
            .then(response => {
              // 克隆响应
              const responseToCache = response.clone();
              
              // 缓存静态资源
              if (response.status === 200 && response.type === 'basic') {
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
              
              return response;
            })
            .catch(error => {
              console.error('获取失败:', error);
              // 可以返回自定义的fallback响应
              return new Response('网络错误，请检查连接', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

// 处理API请求
async function handleApiRequest(request) {
  const url = request.url;
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 克隆响应并存入缓存
      const clonedResponse = networkResponse.clone();
      cache.put(request, clonedResponse);
      console.log('API响应存入缓存:', url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('网络请求失败，尝试从缓存获取:', url);
    
    // 网络失败，尝试从缓存获取
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('从缓存返回API响应:', url);
      return cachedResponse;
    }
    
    // 缓存也没有，返回错误
    return new Response(JSON.stringify({
      error: '网络连接失败',
      cached: false,
      timestamp: new Date().toISOString()
    }), {
      status: 408,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 接收消息
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
});