# Bookinfo Serverless

This repository demonstrates splitting Bookinfo into independently deployed
services. The `productpage` aggregates the detail, rating, and review APIs into
a single browser page, providing a simple example of service-to-service
integration with serverless functions.

## Deployed result

![Bookinfo productpage showing responses from the backend services](./serverless.png)

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

## Create a Serverless service

For an overview, see the official [Serverless Framework Getting Started
guide](https://www.serverless.com/framework/docs/getting-started). To scaffold
a new service interactively:

1. Run `serverless` in the directory where you want the service created.
2. Select an AWS Node.js HTTP API template.
3. Enter a project name when prompted. This becomes the service directory.
4. Choose **Create a new app**, then enter an app name.
5. Change into the new service directory:

   ```sh
   cd projectname
   ```

   Replace `projectname` with the name you entered.

The interactive scaffolding is only needed when creating a new service. This
repository already contains the four services and their Serverless
configuration files.

## Deploy

Install and configure the Serverless Framework and AWS credentials first. From
the repository root, deploy each service and inspect its deployed endpoint:

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

The productpage backend API base URLs are currently configured in
[`productpage/serverless.yml`](./productpage/serverless.yml). Update those
values if the backend APIs are redeployed with different endpoints.

## Remove deployed services

When you have finished testing, remove the deployed Serverless stacks to delete
their Lambda functions, API Gateway APIs, and related stack resources from AWS.
Run each command from the project root; remove productpage first so its UI and
aggregation API are taken down before the backends:

```sh
cd productpage && serverless remove
cd ../review && serverless remove
cd ../rating && serverless remove
cd ../detail && serverless remove
```
