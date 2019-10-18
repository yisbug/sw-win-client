const restify = require('restify');

const DM = require('./dm');

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());

server.listen(8086, async () => {
  console.log(`${server.name} listening at ${server.url}`);
});

server.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  return next();
});

const cacheDM = {};

server.get('/api/dm/:dmid/:type/:name', async (req, res) => {
  const { dmid, type, name } = req.params;
  const dm = cacheDM[dmid] || new DM(dmid);
  cacheDM[dmid] = dm;
  // 请求参数
  const args = Object.keys(req.query)
    .sort()
    .map(id => {
      return req.query[id];
    });

  console.log('request', type, name, args);
  try {
    const result = dm[type](name, args);
    res.send(200, result);
  } catch (e) {
    res.send(400, e.message);
  }
});
