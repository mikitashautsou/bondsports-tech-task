# Environment setup

## Local development

1.  Docker is required to run app locally
2.  To start application run the following command

```
docker-compose up --no-deps --build
```

3. After docker runs all containers, API will be available on root(/) url address

4. OpenAPI documentation can be accessed through `/api`

# Tests

Application currently has two types of tests, Unit tests and E2E tests

## Unit tests

1. To run unit tests run the following commands

```bash
cd app # change current directory to the app folder
pnpm install
pnpm run test
```

## E2E tests

```bash
cd e2e
pnpm install
pnpm run test
```

