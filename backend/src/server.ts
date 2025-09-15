import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { pollRouter } from './urls/polls';
import cors from 'cors';
import { Poll } from './models/Poll';
import { Vote } from './models/Vote';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*'}));

// Basic health check
app.get('/', (_req, res) => res.json({ ok: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017';
mongoose.connect(mongoUri).then(async () => {
  console.log('MongoDB connected');
  // Ensure collections and indexes exist on fresh databases
  try {
    await Poll.createCollection().catch(() => {});
    await Vote.createCollection().catch(() => {});
    await Poll.init();
    await Vote.init();
    console.log('Collections ensured: Poll, Vote');
  } catch (e) {
    console.error('Collection initialization error', e);
  }
}).catch((err) => {
  console.error('Mongo connection error', err);
  process.exit(1);
});

// Mount REST API
app.use('/polls', pollRouter);

// Create HTTP server and attach Socket.io
const nodeServer = createServer(app);

export const io = new SocketIOServer(nodeServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  socket.on('join-poll', (pollId: string) => {
    socket.join(`poll:${pollId}`);
  });
});

const PORT = Number(process.env.PORT || 8080);
nodeServer.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


