# Society Maintenance

Static web app for calculating society maintenance charges.

Because the app loads HTML partials and config via `fetch`, open it through a local HTTP server (not by opening `index.html` directly).

## Run locally

From the project root:

### Python

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

### Node

```bash
npx serve .
```

Then open the URL shown in the terminal (usually [http://localhost:3000](http://localhost:3000)).
