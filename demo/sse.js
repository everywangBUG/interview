const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 提供HTML文件
    const filePath = path.join(__dirname, 'sse.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading sse.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/stream') {
    // 提供SSE流式接口
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // 模拟对话内容
    const messages = [
      '你好！',
      '我是一个基于SSE的流式对话服务。',
      '我可以实现打字机效果，逐字显示文本。',
      '这是一个演示，展示了如何使用Server-Sent Events技术。',
      '希望你喜欢这个效果！'
    ];

    let messageIndex = 0;
    let charIndex = 0;

    const sendNextChar = () => {
      if (messageIndex < messages.length) {
        const currentMessage = messages[messageIndex];
        if (charIndex < currentMessage.length) {
          // 发送单个字符
          res.write(`data: ${currentMessage[charIndex]}\n\n`);
          charIndex++;
          // 随机延迟，模拟打字效果
          setTimeout(sendNextChar, Math.random() * 100 + 50);
        } else {
          // 当前消息发送完毕，发送一个空行作为分隔
          res.write('data: \n\n');
          messageIndex++;
          charIndex = 0;
          // 消息之间的延迟
          setTimeout(sendNextChar, 1000);
        }
      } else {
        // 所有消息发送完毕，关闭连接
        res.end();
      }
    };

    // 开始发送
    sendNextChar();

    // 处理连接关闭
    req.on('close', () => {
      console.log('Client disconnected');
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});