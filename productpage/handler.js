const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(body),
});

const htmlResponse = (body) => ({
  statusCode: 200,
  headers: {
    "content-type": "text/html; charset=utf-8",
  },
  body,
});

const productpageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bookinfo</title>
    <style>
      :root { color-scheme: light; font-family: system-ui, sans-serif; color: #172033; background: #f3f6fb; }
      * { box-sizing: border-box; }
      body { margin: 0; }
      header { padding: 2.5rem max(1.25rem, calc((100% - 1000px) / 2)); color: white; background: #173b65; }
      header p { margin-bottom: 0; color: #d7e6f7; }
      main { max-width: 1000px; margin: 2rem auto; padding: 0 1.25rem; }
      .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
      button { border: 0; border-radius: .5rem; padding: .7rem 1rem; color: white; background: #1769aa; font: inherit; cursor: pointer; }
      button:disabled { opacity: .6; cursor: wait; }
      #status { color: #53647a; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
      article { min-height: 140px; padding: 1.25rem; border: 1px solid #dce4ef; border-radius: .75rem; background: white; box-shadow: 0 4px 14px #173b650d; }
      article h2 { margin: 0 0 .75rem; font-size: 1.1rem; }
      article pre { margin: 0; color: #40516a; white-space: pre-wrap; overflow-wrap: anywhere; font: .9rem/1.5 ui-monospace, monospace; }
      #error { color: #a12b2b; }
    </style>
  </head>
  <body>
    <header>
      <h1>Bookinfo</h1>
      <p>Product information, ratings, and reviews from the backend services.</p>
    </header>
    <main>
      <div class="toolbar">
        <span id="status" role="status">Loading backend services…</span>
        <button id="refresh" type="button">Refresh</button>
      </div>
      <p id="error" role="alert"></p>
      <section class="grid" id="services" aria-live="polite"></section>
    </main>
    <script>
      const serviceNames = ["detail", "rating", "review1", "review2", "review3"];
      const services = document.getElementById("services");
      const status = document.getElementById("status");
      const error = document.getElementById("error");
      const refresh = document.getElementById("refresh");

      async function loadProduct() {
        refresh.disabled = true;
        status.textContent = "Loading backend services…";
        error.textContent = "";
        services.replaceChildren();

        try {
          const response = await fetch("/productpage");
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "The productpage request failed.");
          }

          for (const name of serviceNames) {
            const card = document.createElement("article");
            const title = document.createElement("h2");
            const content = document.createElement("pre");
            title.textContent = name[0].toUpperCase() + name.slice(1);
            content.textContent = JSON.stringify(data[name], null, 2);
            card.append(title, content);
            services.append(card);
          }
          status.textContent = "All backend services loaded.";
        } catch (cause) {
          status.textContent = "Could not load backend services.";
          error.textContent = cause.message;
        } finally {
          refresh.disabled = false;
        }
      }

      refresh.addEventListener("click", loadProduct);
      loadProduct();
    </script>
  </body>
</html>`;

const getProductpageData = async () => {
  const backends = [
    ["detail", process.env.DETAIL_API_URL, "/detail"],
    ["rating", process.env.RATING_API_URL, "/rating"],
    ["review1", process.env.REVIEW_API_URL, "/review1"],
    ["review2", process.env.REVIEW_API_URL, "/review2"],
    ["review3", process.env.REVIEW_API_URL, "/review3"],
  ];

  const missingBackends = backends
    .filter(([, baseUrl]) => !baseUrl)
    .map(([name]) => name);

  if (missingBackends.length > 0) {
    return jsonResponse(500, {
      error: "Backend API URLs are not configured",
      services: [...new Set(missingBackends)],
    });
  }

  const results = await Promise.allSettled(
    backends.map(async ([name, baseUrl, path]) => {
      const url = new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${name} returned HTTP ${response.status}`);
      }

      return [name, await response.json()];
    }),
  );

  const failures = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [
          {
            service: backends[index][0],
            message: result.reason.message,
          },
        ]
      : [],
  );

  if (failures.length > 0) {
    return jsonResponse(502, {
      error: "One or more backend requests failed",
      failures,
    });
  }

  return jsonResponse(
    200,
    Object.fromEntries(results.map((result) => result.value)),
  );
};

exports.productpage = async (event = {}) => {
  const requestPath = event.rawPath ?? event.requestContext?.http?.path;
  if (requestPath === "/") {
    return htmlResponse(productpageHtml);
  }

  return getProductpageData();
};
