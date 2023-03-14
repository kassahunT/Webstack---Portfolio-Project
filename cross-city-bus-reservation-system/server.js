import http from 'http';
import app from './app.js';

const port =process.env.PORT || 3003;
const server=http.createServer(app);
server.listen(port);
