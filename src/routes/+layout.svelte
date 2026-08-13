<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/reusable/Header.svelte';
  import Footer from '$lib/components/reusable/Footer.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Header />

<main class="app-main container" id="main-content">
  {@render children()}
</main>

<Footer />

<style>
  .app-main {
    width: 95%;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 16px;
    padding-bottom: 24px;
  }

  @media only screen and (max-width: 600px) {
    .app-main {
      width: 92%;
    }
  }
</style>
