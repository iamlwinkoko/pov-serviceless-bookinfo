# Bookinfo productpage

The productpage HTTP API calls the deployed detail, rating, and review APIs and
returns their JSON responses together. Configure each variable with the
corresponding API Gateway base URL (the URL before its route path):

- `DETAIL_API_URL` serves `/detail`
- `RATING_API_URL` serves `/rating`
- `REVIEW_API_URL` serves `/review1`, `/review2`, and `/review3`

For example, set the variables in your shell before deploying:

```sh
export DETAIL_API_URL=https://your-detail-api.execute-api.your-region.amazonaws.com
export RATING_API_URL=https://your-rating-api.execute-api.your-region.amazonaws.com
export REVIEW_API_URL=https://your-review-api.execute-api.your-region.amazonaws.com
serverless deploy
```

Deploy from this directory. Open the API base URL in a browser for the UI, or
use `GET /productpage` for the JSON API. The UI displays the detail, rating, and
review backend responses and has a refresh button. Backend responses are
requested concurrently; if any request fails or returns invalid JSON, the JSON
API returns an error instead of a partial success response.

The rating and review function names in their Serverless configs must be
exported by their handlers. If those changes are not in the currently deployed
Lambdas, redeploy the rating and review services before deploying productpage.
