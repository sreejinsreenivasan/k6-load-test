# k6 Load Testing with Docker

This repository provides a setup for performing load tests on your APIs using [k6](https://k6.io/) in Docker. You can configure key test parameters such as the number of virtual users (VUs), test duration, and the API URL through environment variables.

## **Table of Contents**

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Tests](#running-the-tests)
- [Increasing Load (VUs)](#increasing-load-vus)
- [Adding New Test Scripts](#adding-new-test-scripts)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## **Prerequisites**

- Docker
- Docker Compose

Ensure that Docker and Docker Compose are installed on your machine.

---

## **Project Structure**

```plaintext
.
├── docker-compose.yml      # Docker Compose configuration
├── .env                    # Environment variables for configuring the load tests
├── load-tests/             # Directory containing k6 test scripts
│   ├── test-endpoint-1.js  # Example test script for an API endpoint
│   ├── test-endpoint-2.js  # Another example test script
├── README.md               # This file
```

---

## **Setup and Installation**

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd k6-load-test
   ```

2. **Create a `.env` file**:

   The `.env` file will be used to configure the number of virtual users (VUs), test duration, and the API URL. Create a `.env` file by copying the example provided:

   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file**:

   Customize the variables to suit your testing needs:

   ```env
   LOAD_USERS=50           # Number of virtual users (VUs)
   LOAD_DURATION=1m        # Duration of the test (1 minute)
   API_URL=http://127.0.0.1:8000  # Base URL for the API being tested
   ```

---

## **Running the Tests**

To run the load tests using Docker, execute the following command:

```bash
docker-compose up
```

This command will start the k6 container and execute all test scripts located in the `load-tests/` directory.

**Running the tests for an individual test script**:

To run a specific test script with custom parameters:

```bash
docker compose run --rm k6 run \
 --vus ${VUS:-50} \
 --duration ${DURATION:-2m} \
 /scripts/load-tests/your-test-script.js
```

This command allows you to:

- Specify the number of virtual users (VUs) using the `VUS` environment variable
- Set the test duration using the `DURATION` environment variable
- Choose any test script from the `/scripts/load-tests/` directory

Example usage:

VUS=100 DURATION=5m docker compose run --rm k6 run /scripts/load-tests/your-test-script.js

**Run a test a single iteration**

```bash
docker compose run k6 run --iterations 1 /scripts/load-tests/new-vkyc-create.js
```

## If `VUS` and `DURATION` are not set, the command defaults to 50 VUs and 2 minutes duration.

## **Increasing Load (VUs)**

You can easily increase the load (number of virtual users) without modifying the test scripts by updating the `.env` file:

1. **Update the `.env` file**:

   Modify the number of VUs as needed:

   ```env
   LOAD_USERS=100          # Increase virtual users to 100
   LOAD_DURATION=2m        # Duration of the test (2 minutes)
   ```

2. **Re-run the tests**:

   After modifying the `.env` file, run the tests again:

   ```bash
   docker-compose up
   ```

k6 will now simulate the new number of virtual users as specified.

---

## **Adding New Test Scripts**

To add new test scripts for different API endpoints:

1. **Create a new test file** in the `load-tests/` directory.

   Example: `load-tests/test-endpoint-3.js`

   ```javascript
   import http from "k6/http";
   import { check, sleep } from "k6";

   export let options = {
     stages: [
       { duration: "30s", target: Number(__ENV.LOAD_USERS || 20) },
       { duration: "1m", target: Number(__ENV.LOAD_USERS || 20) },
       { duration: "30s", target: 0 },
     ],
   };

   export default function () {
     const url = `${__ENV.API_URL}/api/endpoint/`; // Use the API_URL from environment variables
     const response = http.get(url);

     check(response, {
       "status is 200": (r) => r.status === 200,
     });

     sleep(1);
   }
   ```

2. **Run the new tests**:

   Once the new test script is added, run `docker-compose up` to execute all tests in the `load-tests/` directory.

---

## **Environment Variables**

The behavior of the load tests can be customized using environment variables. The available options are:

| Variable        | Description                               | Default Value           |
| --------------- | ----------------------------------------- | ----------------------- |
| `LOAD_USERS`    | Number of virtual users (VUs) to simulate | `20`                    |
| `LOAD_DURATION` | Total duration of the test                | `1m`                    |
| `API_URL`       | The base URL of the API being tested      | `http://127.0.0.1:8000` |

### **Example `.env` File:**

```env
LOAD_USERS=100
LOAD_DURATION=2m
API_URL=http://127.0.0.1:8000
```

---

## **Customizing k6 Test Options**

In each test script, you can customize the load stages and options using k6's `options` object. Here’s an example:

```javascript
export let options = {
  stages: [
    { duration: "30s", target: Number(__ENV.LOAD_USERS || 20) }, // Ramp-up period
    { duration: "1m", target: Number(__ENV.LOAD_USERS || 20) }, // Hold at the max VUs
    { duration: "30s", target: 0 }, // Ramp-down period
  ],
};
```

This configuration simulates a load test where the number of VUs ramps up, holds steady, and then ramps down.

---

## **Troubleshooting**

- **Connection Refused**: If you encounter a `connection refused` error, ensure that the API you're testing is running and accessible from the k6 Docker container.
- **Environment Variable Not Working**: If the `LOAD_USERS`, `LOAD_DURATION`, or `API_URL` variables are not being applied, make sure your `.env` file is correctly configured and sourced by Docker Compose.

---

## **References**

- [k6 Documentation](https://k6.io/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
