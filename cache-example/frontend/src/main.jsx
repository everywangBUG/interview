import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 注册Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log(navigator.serviceWorker, 'navigator.serviceWorker')
    navigator.serviceWorker.register('/service-worker.js', {scope: './'})
    .then(registration => {
        console.log('ServiceWorker注册成功:', registration.scope);
        
        // 检查更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('ServiceWorker更新发现:', newWorker.state);
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('新ServiceWorker已安装，需要刷新页面');
              if (window.confirm('新版本可用，是否刷新页面？')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(error => {
        console.log('ServiceWorker注册失败:', error);
      });
    
    // 监听Service Worker消息
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('收到Service Worker消息:', event.data);
    });
    
    // 定期检查更新
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
        }
      });
    }, 60 * 1000); // 每分钟检查一次
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
