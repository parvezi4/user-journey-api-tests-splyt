# API Test Automation Project

This project is an API test automation framework built using TypeScript and Node.js. It leverages Jest for test execution and Supertest for HTTP assertions. I attempt test /api/journey endpoint with POST, PATCH and GET requests.

## Project Structure

```
api-test-automation
├── src
│   ├── tests
│   │   └── api.test.ts        # Contains test cases for the API
│   └── utils
│       └── helpers.ts         # Utility functions for testing
├── package.json               # npm configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
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

Or run individual tests:

```
npm test <name_of_test>
```

### Writing Tests

- Test cases are located in `src/tests/api.test.ts`. You can define your API tests using Jest and Supertest.
- Utility functions can be added to `src/utils/helpers.ts` to assist with test data setup and request handling.

## Presentation deck

A presentation deck explaining the project can be found [here](https://docs.google.com/presentation/d/1a2b3c4d5e6f7g8h9i0j/edit?usp=sharing).
