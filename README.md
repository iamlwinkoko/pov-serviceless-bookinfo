# Bookinfo Serverless

A simple microservices application built with **AWS Lambda, Amazon API
Gateway, and the Serverless Framework**.

Inspired by the [Istio Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/),
this project demonstrates how independently deployed serverless services
communicate through HTTP APIs.

## Architecture

![Bookinfo Serverless architecture](./architecture.png)

The application consists of four independently deployed services:

| Service | API endpoint(s) | Description |
| --- | --- | --- |
| `productpage` | `GET /`, `GET /productpage` | Calls the backend APIs and presents their responses as a browser UI or JSON. |
| `detail` | `GET /detail` | Returns book details. |
| `rating` | `GET /rating` | Returns book ratings. |
| `review` | `GET /review1`, `GET /review2`, `GET /review3` | Returns three review responses. |

### How it works

1. A user accesses the application through Amazon API Gateway.
2. API Gateway invokes the `productpage` Lambda function.
3. `productpage` calls the `detail`, `rating`, and `review` APIs over HTTP.
4. The backend services return their responses.
5. `productpage` combines the responses and returns HTML or JSON.

Each service is deployed separately using the Serverless Framework.

## Project structure

```text
pov-serviceless-bookinfo/
├── detail/
│   ├── handler.js
│   ├── serverless.yml
│   └── README.md
├── rating/
│   ├── handler.js
│   ├── serverless.yml
│   └── README.md
├── review/
│   ├── handler.js
│   ├── serverless.yml
│   └── README.md
├── productpage/
│   ├── handler.js
│   ├── serverless.yml
│   └── README.md
├── architecture.png
├── result.png
└── README.md
```

## Deployed result

**Browser UI:**

[https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/](https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/)

**JSON API:**

[https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/productpage](https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/productpage)

![Deployed Bookinfo productpage result](./result.png)

> **Note:** The backend services currently return greeting messages for
> integration testing, not actual book details, ratings, or reviews.

## Prerequisites

- An AWS account
- Node.js and npm
- AWS CLI configured with credentials that can deploy Lambda and API Gateway
- Serverless Framework

For installation and setup guidance, see the [Serverless Framework Getting
Started guide](https://www.serverless.com/framework/docs/getting-started).

## Deployment

Deploy the backend services first, then deploy `productpage`. From the
repository root:

```sh
cd detail
serverless deploy
serverless info

cd ../rating
serverless deploy
serverless info

cd ../review
serverless deploy
serverless info

cd ../productpage
serverless deploy
serverless info
```

Before deploying `productpage`, make sure the backend API base URLs in
[`productpage/serverless.yml`](./productpage/serverless.yml) match the endpoints
reported by `serverless info` for the detail, rating, and review services.

## Testing

Test the aggregated JSON API with `curl`:

```sh
curl https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/productpage
```

Or open the [productpage browser UI](https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/).

## Cleanup

Remove the deployed services when testing is complete to avoid unnecessary AWS
charges. From the repository root, remove `productpage` first, followed by its
backends:

```sh
cd productpage && serverless remove
cd ../review && serverless remove
cd ../rating && serverless remove
cd ../detail && serverless remove
```

## References

- [Istio Bookinfo Application](https://istio.io/latest/docs/examples/bookinfo/)
- [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
- [Amazon API Gateway documentation](https://docs.aws.amazon.com/apigateway/)
- [Serverless Framework documentation](https://www.serverless.com/framework/docs/)
