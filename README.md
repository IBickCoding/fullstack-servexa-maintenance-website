# Servexa – Maintenance Management System

A full-stack web application designed to help manage maintenance requests, vendors, and tenants within a fictional campus environment.

Servexa was developed as a final project for **B470** and demonstrates the development of a complete web application using a modern React frontend, Spring Boot backend, REST APIs, database persistence, authentication, and supporting development documentation.

---

## 📖 Overview

**Servexa** is a full-stack maintenance management application created for a fictional campus environment.

The application provides a centralized platform for managing:

- Maintenance requests
- Vendors
- Tenants
- User accounts
- Maintenance-related information

The project follows a separated frontend/backend architecture. The frontend is built with **React and Vite**, while the backend is implemented using **Java and Spring Boot**. Communication between the two layers occurs through REST APIs.

The repository also contains supporting project documentation, API testing collections, planning documents, sprint retrospectives, and other materials used throughout the development process.

---

## ✨ Features

### 🔐 User Authentication

- User authentication and authorization
- Secure password handling
- JWT-based authentication
- Spring Security integration
- Protected application functionality

### 🛠️ Maintenance Management

- Track maintenance requests
- Manage maintenance-related information
- Connect maintenance requests with other application entities
- REST API integration for application data

### 👥 Tenant Management

- Track tenant information
- Manage tenant records
- Integrate tenant information with the maintenance system

### 🏢 Vendor Management

- Track vendors
- Manage vendor information
- Associate vendors with maintenance activities

### 🔄 REST API Integration

- Frontend communicates with backend through REST APIs
- Axios is used for HTTP requests
- Backend provides application data and business logic
- Database persistence is handled through Spring Data JPA

### 📱 Responsive Interface

- React-based user interface
- Responsive design
- Bootstrap styling
- Reusable React components
- Client-side routing

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| React DOM | React rendering |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| Axios | HTTP/API requests |
| Bootstrap | UI styling and responsive layout |
| React Router | Client-side routing |
| React Modal | Modal interfaces |
| React Select | Enhanced selection inputs |
| ESLint | Code quality and linting |

### Backend

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming language |
| Spring Boot | Backend application framework |
| Spring Web | REST API development |
| Spring Data JPA | Database access and persistence |
| Spring Security | Authentication and authorization |
| JWT | Token-based authentication |
| BCrypt | Password encryption |
| Spring Validation | Request/data validation |
| Maven | Dependency management and build automation |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| JPA/Hibernate | Object-relational mapping |

### Development Tools

- Git
- GitHub
- Postman
- Visual Studio Code
- IntelliJ IDEA
- Maven
- Node.js
- npm

---

## 🏗️ Project Structure

The repository is divided into three primary sections:

```text
fullstack-servexa-maintenance-website/
│
├── servexa_backend/
│   ├── .mvn/
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── README.md
│
├── servexa_frontend/
│   ├── frontend/
│   ├── memory/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
│
└── servexa_supporting_docs/
    ├── ProposalDocument.docx
    ├── 470sp26_Team3_FinalProjectDesignPlanning.docx
    ├── 470_570sp26 Sprint 1 Retrospective - 6 April 2026.docx
    ├── Servexa Initial API Tests Service Requests.postman_collection.json
    ├── Servexa Initial API Tests Tenants.postman_collection.json
    ├── Servexa Initial API Tests Vendors.postman_collection.json
    ├── Servexa_Frames.bmpr
    ├── testSetup.txt
    └── readme.md
```

---

## 🧩 Application Architecture

Servexa follows a traditional full-stack architecture:

```text
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│  React + Vite + Bootstrap   │
│  React Router + Axios       │
└──────────────┬──────────────┘
               │
               │ REST API / HTTP
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│                             │
│ Java 17                     │
│ Spring Web                  │
│ Spring Security             │
│ JWT Authentication          │
│ Spring Data JPA             │
└──────────────┬──────────────┘
               │
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│                             │
│ Relational Database         │
│ Persistent Application Data │
└─────────────────────────────┘
```

This separation allows the frontend and backend to be developed independently while communicating through clearly defined REST endpoints.

---

# 💻 Frontend

The Servexa frontend is located in:

```text
servexa_frontend/
```

The frontend is built using **React** and **Vite**.

### Frontend Technologies

- React
- React DOM
- Vite
- Axios
- Bootstrap
- React Router
- React Modal
- React Select
- ESLint

### Frontend Responsibilities

The frontend is responsible for:

- Rendering the user interface
- Handling user interaction
- Client-side navigation
- Sending requests to the backend API
- Displaying data retrieved from the backend
- Managing authentication-related frontend behavior
- Providing responsive layouts

### Frontend Scripts

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

---

# ☕ Backend

The Servexa backend is located in:

```text
servexa_backend/
```

The backend is implemented using **Java 17 and Spring Boot**.

### Backend Technologies

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- BCrypt
- Spring Validation
- PostgreSQL
- Maven

### Backend Responsibilities

The backend handles:

- REST API endpoints
- Business logic
- Authentication
- Authorization
- Database communication
- Data validation
- Password encryption
- JWT token handling
- Persistence of application data

---

# 🔐 Authentication & Security

Servexa incorporates several security technologies through Spring Security.

### Spring Security

Spring Security is used to provide authentication and authorization functionality for the application.

### JWT Authentication

JSON Web Tokens are used to support token-based authentication between the frontend and backend.

The general authentication flow is:

```text
User
 │
 ▼
React Frontend
 │
 │ Login Request
 ▼
Spring Boot API
 │
 │ Validate Credentials
 ▼
Database
 │
 │ User Verified
 ▼
JWT Generated
 │
 ▼
React Frontend
 │
 │ Authenticated Requests
 ▼
Protected API Endpoints
```

### Password Security

Passwords are handled using **BCrypt** hashing rather than storing plaintext passwords.

### Validation

Spring Boot validation functionality is used to validate incoming application data before processing it.

---

# 🗄️ Database

Servexa uses **PostgreSQL** as its relational database.

Database access is handled through:

- Spring Data JPA
- Hibernate/JPA
- PostgreSQL JDBC driver

The application uses an object-relational mapping approach, allowing Java entities to interact with relational database tables through JPA.

---

# 🌐 API

The frontend communicates with the backend through RESTful API endpoints.

Axios is used by the React frontend to make HTTP requests.

The API supports functionality related to areas such as:

- Authentication
- Service requests
- Tenants
- Vendors
- Maintenance data

Postman collections are included in the supporting documentation directory for testing API functionality.

### API Testing Collections

```text
Servexa Initial API Tests Service Requests.postman_collection.json

Servexa Initial API Tests Tenants.postman_collection.json

Servexa Initial API Tests Vendors.postman_collection.json
```

These collections can be imported into Postman to assist with testing the backend API.

---

# 📚 Supporting Documentation

The repository includes a collection of documents created throughout the development lifecycle.

The `servexa_supporting_docs` directory contains:

### Project Planning

- Project proposal
- Final project design and planning documentation
- Development planning materials

### Agile Development

- Sprint retrospective documentation

### API Testing

- Service request API tests
- Tenant API tests
- Vendor API tests

### Design

- Servexa wireframes and frames

### Development

- Test setup information
- Supporting README documentation

These files provide additional context regarding the planning, design, development, and testing of the application.

---

# 🚀 Getting Started

## Prerequisites

Before running Servexa locally, install the following:

- **Java 17**
- **Maven**
- **Node.js**
- **npm**
- **PostgreSQL**
- **Git**

Verify your installations:

```bash
java --version
mvn --version
node --version
npm --version
```

---

# 📦 Frontend Setup

Navigate to the frontend directory:

```bash
cd servexa_frontend
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will start the React development environment.

The terminal will provide the local development URL.

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd servexa_backend
```

The project includes Maven wrapper files, allowing Maven commands to be executed without requiring a separate Maven installation.

### Windows

```bash
mvnw.cmd spring-boot:run
```

### macOS / Linux

```bash
./mvnw spring-boot:run
```

Alternatively, if Maven is installed globally:

```bash
mvn spring-boot:run
```

---

# 🗃️ Database Configuration

Before starting the backend, configure the PostgreSQL database connection according to the application's Spring configuration.

The database should be running locally and accessible by the Spring Boot application.

A typical PostgreSQL configuration will include:

```text
Database URL
Database Username
Database Password
Database Port
```

**Do not commit database passwords, JWT secrets, API keys, or other credentials to GitHub.**

Environment variables or an appropriate local configuration file should be used for sensitive values.

---

# 🔄 Running the Full Application

To run Servexa locally, start both the frontend and backend.

### Terminal 1 – Backend

```bash
cd servexa_backend
mvn spring-boot:run
```

### Terminal 2 – Frontend

```bash
cd servexa_frontend
npm install
npm run dev
```

The React frontend will communicate with the Spring Boot backend through the configured REST API.

---

# 🧪 Testing

Servexa includes testing resources for both application development and API testing.

### Backend Tests

Backend tests can be executed using Maven:

```bash
mvn test
```

The project also includes the H2 database dependency for testing purposes.

### API Testing

Postman collections are included for testing:

- Service Requests
- Tenants
- Vendors

These collections can be imported into Postman and used to verify API functionality.

---

# 📁 Repository Organization

The repository intentionally separates application code from project documentation.

| Directory | Purpose |
|---|---|
| `servexa_backend` | Spring Boot backend and REST API |
| `servexa_frontend` | React/Vite frontend |
| `servexa_supporting_docs` | Planning, design, testing, and development documentation |

This structure makes it easier to navigate the project and understand the separation between the frontend, backend, and supporting materials.

---

# 🎯 Project Purpose

Servexa was created as a final project for **B470**.

The project was designed to demonstrate the practical application of full-stack software development concepts, including:

- Frontend development
- Backend development
- REST API design
- Database integration
- Authentication and authorization
- Secure password handling
- Client-server communication
- Software project planning
- API testing
- Agile development practices
- Version control with Git and GitHub

Rather than functioning as a simple static website, Servexa demonstrates how multiple application layers work together to create a complete web-based system.

---

## 📌 Project Summary

**Servexa** is a full-stack maintenance management application built with:

```text
Frontend
React + Vite + Bootstrap
        │
        │ REST API
        ▼
Backend
Java + Spring Boot
        │
        │ JPA / Hibernate
        ▼
Database
PostgreSQL
```

The project demonstrates the development of a complete full-stack application with a modern frontend, RESTful backend, relational database, authentication, security, API testing, and supporting software-development documentation.
