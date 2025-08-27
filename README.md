# API Test Automation Project

This project is an API test automation framework built using TypeScript and Node.js. It leverages Jest for test execution and Supertest for HTTP assertions. I attempt test /api/journey endpoint with POST, PATCH and GET requests.

## Project Structure

```
user-journey-api-tests-splyt
├── src
│   ├── tests
│   │   ├── journeys.post.test.ts    # POST /api/journeys tests (happy path & boundary values)
│   │   ├── journeys.patch.test.ts   # PATCH /api/journeys tests (happy path & boundary values)
│   │   ├── journeys.get.test.ts     # GET /api/journeys/:id tests (happy path & boundary values)
│   │   ├── config.ts                # Shared configuration (i.e., baseUrl)
│   │   └── helpers.ts               # Utility functions for test data and requests
│   └── ...
├── node_modules                     # Project dependencies
├── package.json                     # npm configuration file
├── package-lock.json                # npm lock file
├── tsconfig.json                    # TypeScript configuration file
└── README.md                        # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running Tests

To run the API tests, use the following command:

```bash
npm test
```

Or a single file using:
```
npx jest <file-name like src/tests/journeys.get.test.ts>
```

Or using a pattern:

```
npx jest <post | patch | get>
```

### Writing Tests

- Test cases are located in `src/tests/api.test.ts`. You can define your API tests using Jest and Supertest.
- Utility functions can be added to `src/utils/helpers.ts` to assist with test data setup and request handling.

### Test Reports

- JUnit test reports will be generated in `src/tests/junit.xml` whichi can be configured from package.json under `jest -> reporters`.

## Presentation deck

A presentation deck explaining the project can be found [here](https://docs.google.com/presentation/d/1wHHqtE6UjXX1G7E-ox4f7Y__hzUi9hW3HYmCogBKRPo/edit?usp=sharing).
