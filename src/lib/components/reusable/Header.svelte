<header class="site-header">
  <nav class="nav-extended blue darken-2 z-depth-2" aria-label="Page header">
    <div class="nav-wrapper container header-container">
      <span class="brand-logo header-title">Society Maintenance</span>
    </div>
  </nav>
</header>

<style>
  nav.nav-extended {
    min-height: auto;
  }

  nav.nav-extended :global(.nav-wrapper) {
    min-height: auto;
    height: auto;
  }

  .header-container {
    width: 95%;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .header-title {
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    position: static;
    left: auto;
    transform: none;
    float: none;
    display: block;
    text-align: center;
    line-height: 1.35;
    height: auto;
    padding: 14px 8px;
    width: 100%;
    max-width: 100%;
    white-space: normal;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  @media only screen and (min-width: 601px) {
    .header-title {
      font-size: 1.28rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .header-container {
      width: 92%;
    }

    .header-title {
      font-size: 0.98rem;
      padding: 12px 2px;
    }
  }

  @media only screen and (max-width: 380px) {
    .header-title {
      font-size: 0.9rem;
    }
  }
</style>
