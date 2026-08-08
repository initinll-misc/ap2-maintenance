/**
 * Loads HTML partials into the page shell (static hosting + fetch).
 */

const LAYOUT_PARTIALS = [
  'partials/nav.html',
  'partials/grand-card.html',
  'partials/section-flat.html',
  'partials/section-fixed.html',
  'partials/section-variable.html',
  'partials/section-temporary.html',
  'partials/section-total.html',
  'partials/footer.html',
];

async function loadPartial(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status})`);
  }
  return response.text();
}

async function assembleLayout() {
  const root = document.getElementById('app-root');
  if (!root) {
    throw new Error('Missing #app-root container');
  }

  const parts = await Promise.all(LAYOUT_PARTIALS.map(loadPartial));
  root.innerHTML = parts.join('\n');
}
