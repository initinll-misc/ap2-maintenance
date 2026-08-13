<script lang="ts">
  interface Props {
    title?: string;
    message: string;
  }

  let { title = 'Unable to load page', message }: Props = $props();
</script>

<div class="card red lighten-5 error-card z-depth-1">
  <h2>{title}</h2>
  <p class="grey-text text-darken-2">{message}</p>
  <p class="grey-text">
    Ensure <code>config/maintenance.json</code> is available. Run via a local server or deploy the
    built static site.
  </p>
</div>

<style>
  .error-card {
    padding: 24px;
    text-align: center;
  }

  .error-card h2 {
    font-size: 1.2rem;
    color: #c62828;
  }
</style>
