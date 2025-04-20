// Import the registration file first
import './register';

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { typeDefs } from '../graphql/schema';
import { resolvers } from '../graphql/resolvers';
import connectDB from '../lib/db';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function startServer() {
  const app = express();

  // Connect to MongoDB
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace('Bearer ', '');
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
            user = await User.findById(decoded.userId);
          } catch (err) {
            // Invalid token
          }
        }

        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
}); 