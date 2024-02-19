require("dotenv").config();
require("./src/helper/StringHelper.helper")
const bodyParser = require('body-parser');
const cors = require('cors');
const accountRouter = require("./src/routes/account.route");
const anonymousRouter = require("./src/routes/anonymous.route");
const authRouter = require("./src/routes/auth.route");
const messageRouter = require("./src/routes/message.route");
const userChannelRouter = require("./src/routes/user-channel.route");
const channelRouter = require("./src/routes/channel.route");
const express = require('express');
const { Server } = require('socket.io');
const initializeSocket = require('./src/event/socket');
const serverConfig = require('./src/config/server.config');
const https = require('https');
const { getCertificate } = require('./src/util/Certificates');
const cookieParser = require("cookie-parser");
const db = require('./src/db/connection');

const start = async () => {
  const cert = await getCertificate();
  const app = express();
  
  // Socket server
  const socketServer = https.createServer({key: cert.key, cert: cert.cert});
  socketServer.listen(serverConfig['ports']['socket']);
  
  const io = new Server(socketServer, {cors: serverConfig['cors']});
  
  // Socket events
  io.on('connection', socket => initializeSocket(io, socket));
  
  // Middlewares
  app.use(bodyParser.json())
  .use(cors(serverConfig['cors']))
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use((req, res, next) => {
    req.socketIo = io;
    next();
  });
  
  // Routes
  app.use("/accounts", accountRouter);
  app.use("/anonymous", anonymousRouter);
  app.use("/auth", authRouter);
  app.use("/messages", messageRouter);
  app.use("/channels", channelRouter);
  app.use("/user-channels", userChannelRouter);
  
  // Api server
  const apiServer = https.createServer({key: cert.key, cert: cert.cert}, app);
  apiServer.listen(serverConfig['ports']['api']);
  
}

start();