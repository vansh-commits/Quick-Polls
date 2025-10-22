import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { pollRouter } from './urls/polls.js';
import cors from 'cors';
import { Poll } from './models/Poll.js';
import { Vote } from './models/Vote.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { authRouter } from './urls/auth.js';
import { userRouter } from './urls/user.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*'}));

// Basic health check and readiness
app.get('/health', async (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.json({ ok: true, dbReady });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}
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
app.use('/auth', authRouter);
app.use('/', userRouter);
app.use('/polls', pollRouter);

// OpenAPI/Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'QuickPolls API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${process.env.PORT || 8080}` }],
    components: {
      schemas: {
        CreatePollRequest: {
          type: 'object',
          required: ['question', 'options'],
          properties: {
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' }, minItems: 2 }
          }
        },
        VoteRequest: {
          type: 'object',
          required: ['optionIndex'],
          properties: { optionIndex: { type: 'integer', minimum: 0 } }
        },
        PollOption: {
          type: 'object',
          properties: { text: { type: 'string' }, votes: { type: 'number' } }
        },
        Poll: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            options: { type: 'array', items: { $ref: '#/components/schemas/PollOption' } }
          }
        }
      }
    },
    paths: {
      '/polls': {
        get: {
          summary: 'List polls',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Poll' } }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create poll',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePollRequest' } } }
          },
          responses: {
            200: { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Poll' } } } },
            400: { description: 'Invalid payload' }
          }
        }
      },
      '/polls/{id}': {
        get: {
          summary: 'Get poll by id',
          parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' } } ],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Poll' } } } },
            404: { description: 'Not found' }
          }
        }
      },
      '/polls/{id}/vote': {
        post: {
          summary: 'Vote on a poll',
          parameters: [ { name: 'id', in: 'path', required: true, schema: { type: 'string' } } ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VoteRequest' } } }
          },
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Poll' } } } },
            400: { description: 'Invalid payload' },
            404: { description: 'Not found' }
          }
        }
      }
    }
  },
  apis: []
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


