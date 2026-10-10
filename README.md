# Bookinfo Serverless

A Bookinfo application built with AWS Lambda, API Gateway, and the Serverless
Framework. The `productpage` service calls the separate `detail`, `rating`, and
`review` APIs and displays the responses in a browser UI.

## Deployed result

![Bookinfo productpage showing responses from the backend services](./image.png)

The productpage UI is available at
<https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/>.
The JSON response is available at
<https://xk5rc9rqp6.execute-api.us-east-1.amazonaws.com/productpage>.

The screenshot shows the current integration test result. The backend services
currently return greeting-message placeholders; they do not yet return full
book details, ratings, or review content.

## Services

| Service | API route(s) | Purpose |
| --- | --- | --- |
| `detail` | `GET /detail` | Returns book details |
| `rating` | `GET /rating` | Returns rating information |
| `review` | `GET /review1`, `/review2`, `/review3` | Returns review responses |
| `productpage` | `GET /` | Browser UI that displays all backend responses |
| `productpage` | `GET /productpage` | JSON API that aggregates all backend responses |

Each service has its own directory containing a `serverless.yml`, handler, and
README.

## Deploy

Install and configure the Serverless Framework and AWS credentials first.
Deploy the backend services, then deploy productpage:

```sh
cd detail && serverless deploy
cd ../rating && serverless deploy
cd ../review && serverless deploy
cd ../productpage && serverless deploy
```

The productpage backend API base URLs are currently configured in
[`productpage/serverless.yml`](./productpage/serverless.yml). Update those
values if the backend APIs are redeployed with different endpoints.
