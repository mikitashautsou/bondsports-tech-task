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



# Setup App Configuration for Cloud Service Deployment
Application can be deployed to any cloud service that supports Kubernetes.

For local setup developers can use `minikube` tool

To run application via Kubernetes follow steps described below
1. Install minikube
2. Run the following command to start minikube
```
minikube start
```
3. Install helm
4. Before installing helm chart, app images must be built
For production environment image should be pushed to some docker image registry like dockerhub, AWS ECR, etc.
For local environment docker images can be built manually
```bash
eval $(minikube -p minikube docker-env)
docker build ./app -t bank-service-image:v1
```
4. Install app chart 
```bash
helm install bondsports -f helm/values/local.yaml helm/
```
For the subsequent launches of application use
```bash
helm install test-chart-1 helm/
```
minikube addons enable ingress
minikube docker-env
eval $(minikube -p minikube docker-env)

docker build ./app -t bank-service-image:v1

5. Wait until Kubernetes cluster set up all infrastructure
6. Access app on `http://localhost:80`