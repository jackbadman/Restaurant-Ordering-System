# Restaurant Ordering System
This is the Assignment 2 contribution of **Jack Goodman**, student number: **10840982**.
## Project Overview

This project is a full-stack restaurant ordering system developed as part of the COMP3006 – Full Stack Development module. The system supports remote food ordering, real-time order updates, and role-based workflows for customers, staff, and management.

Many small takeaway restaurants rely on phone-based or in-store ordering systems that require manual transcription and provide limited visibility of order progress. This application addresses these issues through a web-based platform with persistent storage, authentication, and live updates.

## Key Features

### User Authentication
- Secure login and registration using JWT-based authentication
- Role-based access control

### Customer Functionality
- Browse menu categories and items
- Place orders and view order history
- Receive real-time order status updates

### Staff Functionality
- View incoming orders
- Update order status (e.g. received, preparing, ready)

### Manager Functionality
- Create, update, and delete menu categories and menu items
- Manage pricing and availability

### Real-Time Updates
- Order status changes are broadcast to connected clients using WebSockets

## Technology Stack

### Frontend
- React
- JavaScript (ES6+)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- WebSockets (Socket.io)

### Testing & DevOps
- Jest (unit and integration testing)
- Supertest (API integration tests)
- ESLint (static analysis)
- GitHub Actions (continuous integration)

## Testing

The system is supported by a comprehensive testing strategy:
- Unit tests validate isolated logic such as authentication middleware and controllers
- Integration tests exercise API endpoints end-to-end using an isolated test database
- Manual system and usability testing validate real user workflows
- Automated tests are executed via the CI pipeline on push and pull request

## Continuous Integration

A GitHub Actions CI pipeline automatically:
- Installs dependencies
- Runs backend tests
- Enforces linting rules
- Builds the frontend

This provides rapid feedback and helps prevent regressions.

## Architecture

The backend is implemented as a monolithic Express application with clear separation of concerns between routes, controllers, middleware, and data models.
The frontend communicates with the backend via REST APIs and WebSockets.
MongoDB is used for persistent data storage.

Architecture, data models, and interaction flows are documented using UML component, ERD, and sequence diagrams (see report).

## Lessons Learned

Key lessons from this project include:
- The importance of introducing CI and automated testing early
- The value of role-based access design in multi-user systems
- The effectiveness of integration testing for validating real-world behaviour
- The need to balance feature scope with reliability and test coverage

