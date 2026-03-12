const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', (line) => {
  try {
    const req = JSON.parse(line);
    if (req.method === 'listTools') {
      console.log(JSON.stringify({
        jsonrpc: '2.0',
        result: { tools: [] },
        id: req.id
      }));
    }
  } catch {}
});