# API Test Automation Project

This project is an API test automation framework built using TypeScript and Node.js. It leverages Playwright for browser automation and Supertest for HTTP assertions, allowing for comprehensive testing of API endpoints.

## Project Structure

```
api-test-automation
├── src
│   ├── tests
│   │   └── api.test.ts       # Contains test cases for the API
│   └── utils
│       └── helpers.ts        # Utility functions for testing
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
   cd api-test-automation
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

### Writing Tests

- Test cases are located in `src/tests/api.test.ts`. You can define your API tests using Playwright and Supertest.
- Utility functions can be added to `src/utils/helpers.ts` to assist with test data setup and request handling.

### Example

Here is a simple example of how to define a test case in `api.test.ts`:

```typescript
import request from 'supertest';
import { expect } from 'chai';

describe('API Tests', () => {
    it('should return a 200 status for the GET endpoint', async () => {
        const response = await request('https://api.example.com')
            .get('/endpoint');
        expect(response.status).to.equal(200);
    });
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.