import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
});

function App() {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [cacheStatus, setCacheStatus] = useState(null);
  const requestCountRef = useRef(new Map());

  // 增加请求计数
  const incrementRequestCount = (endpoint) => {
    const count = requestCountRef.current.get(endpoint) || 0;
    requestCountRef.current.set(endpoint, count + 1);
    return count + 1;
  };

  // 通用请求函数
  const makeRequest = useCallback(async (endpoint, cacheType) => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    
    try {
      const count = incrementRequestCount(endpoint);
      const startTime = performance.now();
      
      const response = await api.get(endpoint, {
        headers: {
          'Cache-Buster': cacheType === 'no-cache' ? Date.now() : undefined
        }
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      setResponses(prev => ({
        ...prev,
        [endpoint]: {
          data: response.data,
          timestamp: new Date().toLocaleTimeString(),
          duration: `${duration.toFixed(2)}ms`,
          requestCount: count,
          headers: response.headers,
          status: response.status
        }
      }));
      
    } catch (error) {
      console.error(`请求 ${endpoint} 失败:`, error);
      setResponses(prev => ({
        ...prev,
        [endpoint]: {
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
          requestCount: incrementRequestCount(endpoint)
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  }, []);

  // 清理缓存
  const clearCache = async (cacheType) => {
    try {
      await api.post('/clear-cache', { cacheType });
      alert(`已清理 ${cacheType} 缓存`);
      // 重新获取缓存状态
      fetchCacheStatus();
    } catch (error) {
      console.error('清理缓存失败:', error);
    }
  };

  // 获取缓存状态
  const fetchCacheStatus = async () => {
    try {
      const response = await api.get('/cache-status');
      setCacheStatus(response.data);
    } catch (error) {
      console.error('获取缓存状态失败:', error);
    }
  };

  // 批量测试所有缓存策略
  const testAllCacheStrategies = async () => {
    const endpoints = [
      '/strong-cache',
      '/etag-cache',
      '/last-modified',
      '/sw-cache',
      '/no-cache',
      '/cdn-cache',
      '/v1/data',
      '/memory-cache',
      '/cache-status'
    ];
    
    for (const endpoint of endpoints) {
      await makeRequest(endpoint, endpoint.includes('no-cache') ? 'no-cache' : 'default');
      await new Promise(resolve => setTimeout(resolve, 500)); // 延迟以防止请求过快
    }
  };

  // 组件加载时获取缓存状态
  useEffect(() => {
    fetchCacheStatus();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>浏览器缓存策略演示</h1>
        <p className="subtitle">React前端 + Node.js后端完整示例</p>
      </header>

      <main className="App-main">
        <section className="controls">
          <div className="button-group">
            <button onClick={() => makeRequest('/strong-cache', 'strong')}>
              {loading['/strong-cache'] ? '请求中...' : '测试强缓存'}
            </button>
            <button onClick={() => makeRequest('/etag-cache', 'etag')}>
              {loading['/etag-cache'] ? '请求中...' : '测试ETag缓存'}
            </button>
            <button onClick={() => makeRequest('/last-modified', 'last-modified')}>
              {loading['/last-modified'] ? '请求中...' : '测试Last-Modified'}
            </button>
            <button onClick={() => makeRequest('/sw-cache', 'sw')}>
              {loading['/sw-cache'] ? '请求中...' : '测试Service Worker'}
            </button>
          </div>
          
          <div className="button-group">
            <button onClick={() => makeRequest('/no-cache', 'no-cache')}>
              {loading['/no-cache'] ? '请求中...' : '测试不缓存'}
            </button>
            <button onClick={() => makeRequest('/cdn-cache', 'cdn')}>
              {loading['/cdn-cache'] ? '请求中...' : '测试CDN缓存'}
            </button>
            <button onClick={() => makeRequest('/v1/data', 'versioned')}>
              {loading['/v1/data'] ? '请求中...' : '测试版本化缓存'}
            </button>
            <button onClick={() => makeRequest('/memory-cache', 'memory')}>
              {loading['/memory-cache'] ? '请求中...' : '测试内存缓存'}
            </button>
          </div>

          <div className="action-group">
            <button 
              className="test-all-btn"
              onClick={testAllCacheStrategies}
            >
              批量测试所有缓存策略
            </button>
            
            <div className="clear-cache-buttons">
              <button onClick={() => clearCache('memory')}>清理内存缓存</button>
              <button onClick={() => clearCache('etag')}>清理ETag缓存</button>
              <button onClick={() => clearCache('last-modified')}>清理Last-Modified缓存</button>
            </div>
            
            <button onClick={fetchCacheStatus}>刷新缓存状态</button>
          </div>
        </section>

        <div className="content">
          <section className="cache-status">
            <h2>缓存状态</h2>
            {cacheStatus ? (
              <div className="status-grid">
                <div className="status-item">
                  <h3>内存缓存</h3>
                  <p>条目数: {cacheStatus.memoryCache?.size}</p>
                  <p>Keys: {cacheStatus.memoryCache?.keys.join(', ') || '无'}</p>
                </div>
                <div className="status-item">
                  <h3>ETag缓存</h3>
                  <p>条目数: {cacheStatus.etagCache.size}</p>
                  <p>Keys: {cacheStatus.etagCache.keys.join(', ') || '无'}</p>
                </div>
                <div className="status-item">
                  <h3>Last-Modified缓存</h3>
                  <p>条目数: {cacheStatus.lastModifiedCache?.size}</p>
                  <p>Keys: {cacheStatus.lastModifiedCache?.keys.join(', ') || '无'}</p>
                </div>
              </div>
            ) : (
              <p>加载中...</p>
            )}
          </section>

          <section className="responses">
            <h2>API响应结果</h2>
            <div className="response-grid">
              {Object.entries(responses).map(([endpoint, response]) => (
                <div key={endpoint} className="response-card">
                  <h3>{endpoint}</h3>
                  {response.error ? (
                    <div className="error">
                      <p>错误: {response.error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="response-meta">
                        <span className="meta-item">请求次数: {response.requestCount}</span>
                        <span className="meta-item">耗时: {response.duration}</span>
                        <span className="meta-item">时间: {response.timestamp}</span>
                        <span className="meta-item">状态码: {response.status}</span>
                      </div>
                      <div className="response-data">
                        <pre>{JSON.stringify(response.data, null, 2)}</pre>
                      </div>
                      {response.headers && (
                        <div className="response-headers">
                          <h4>响应头:</h4>
                          <ul>
                            {Object.entries(response.headers).map(([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="cache-explanations">
            <h2>缓存策略说明</h2>
            <div className="explanations-grid">
              <div className="explanation">
                <h3>强缓存 (Cache-Control)</h3>
                <p>浏览器直接从本地缓存读取，不发送请求到服务器。</p>
                <ul>
                  <li>Cache-Control: max-age=60</li>
                  <li>60秒内不会请求服务器</li>
                  <li>适用于不经常变化的静态资源</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>协商缓存 (ETag)</h3>
                <p>浏览器发送请求，服务器检查资源是否修改。</p>
                <ul>
                  <li>If-None-Match / ETag</li>
                  <li>未修改返回 304，使用缓存</li>
                  <li>减少了数据传输量</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>协商缓存 (Last-Modified)</h3>
                <p>基于时间戳的缓存验证机制。</p>
                <ul>
                  <li>If-Modified-Since / Last-Modified</li>
                  <li>检查资源最后修改时间</li>
                  <li>精度到秒，不如ETag精确</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>Service Worker缓存</h3>
                <p>在Service Worker中拦截请求，实现更灵活的缓存策略。</p>
              </div>
              
              <div className="explanation">
                <h3>不缓存</h3>
                <p>强制每次请求都获取最新数据。</p>
                <ul>
                  <li>Cache-Control: no-store</li>
                  <li>适用于实时性要求高的数据</li>
                  <li>会降低性能</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>CDN缓存</h3>
                <p>结合浏览器缓存和CDN边缘节点的多级缓存。</p>
                <ul>
                  <li>s-maxage 控制CDN缓存时间</li>
                  <li>max-age 控制浏览器缓存时间</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>版本化缓存</h3>
                <p>通过URL版本号实现长期缓存。</p>
                <ul>
                  <li>URL包含版本号: /api/v1/data</li>
                  <li>可设置长时间缓存(1年)</li>
                  <li>更新时更改版本号</li>
                </ul>
              </div>
              
              <div className="explanation">
                <h3>内存缓存</h3>
                <p>服务器端内存缓存，减少数据库查询。</p>
                <ul>
                  <li>Node.js内存中缓存</li>
                  <li>设置缓存过期时间</li>
                  <li>提高响应速度</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="App-footer">
        <p>浏览器缓存策略演示 - React前端 + Node.js后端</p>
        <p>观察Network面板查看缓存效果，注意304状态码和缓存命中</p>
      </footer>
    </div>
  );
}

export default App;