# User Authentication System

A modern user authentication system built with Next.js, GraphQL, and Material-UI. Features include user registration, login, and logout functionalities with secure password handling and account locking after multiple failed attempts.

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Account locking after 5 failed login attempts
- Material-UI styled components
- GraphQL API
- MongoDB database with Mongoose ODM
- TypeScript support
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up MongoDB:
   - Install MongoDB from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Start the MongoDB service
   - The default connection string is `mongodb://localhost:27017/auth_system`

4. Create a `.env` file in the root directory:
```
JWT_SECRET=your-secret-key
PORT=4000
MONGODB_URI=mongodb://localhost:27017/auth_system
```

## Running the Application

1. Start the backend server:
```bash
npm run server
# or
yarn server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/         # React components
├── contexts/          # React contexts
├── graphql/           # GraphQL schema and resolvers
├── lib/               # Utility functions and configurations
├── models/            # Database models
├── pages/             # Next.js pages
└── server/            # Backend server code
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Account locking after 5 failed attempts
- Secure password validation
- Protected GraphQL endpoints
- CORS enabled
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 