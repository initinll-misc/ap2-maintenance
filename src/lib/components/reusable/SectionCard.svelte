<script lang="ts">
  import type { Snippet } from 'svelte';

  type SectionVariant = 'flat' | 'fixed' | 'variable' | 'temporary' | 'total';

  interface Props {
    variant: SectionVariant;
    icon: string;
    title: string;
    meta: string;
    hidden?: boolean;
    extraClass?: string;
    children: Snippet;
  }

  let {
    variant,
    icon,
    title,
    meta,
    hidden = false,
    extraClass = '',
    children,
  }: Props = $props();
</script>

<div
  class="card section-card section-card--{variant} hoverable {extraClass}"
  {hidden}
>
  <div class="section-header section-header--{variant}">
    <div class="section-header__icon-wrap">
      <i class="material-icons" aria-hidden="true">{icon}</i>
    </div>
    <div class="section-header__text">
      <h2 class="section-header__title">{title}</h2>
      <p class="section-header__meta">{meta}</p>
    </div>
  </div>
  <div class="card-content">
    {@render children()}
  </div>
</div>

<style>
  .section-card {
    border-radius: 10px;
    margin-bottom: 14px;
    overflow: hidden;
    border: 2px solid transparent;
    background: #fff;
    box-shadow: var(--card-shadow);
    transition: box-shadow 0.25s ease;
  }

  .section-card.hoverable:hover {
    box-shadow: var(--card-shadow-hover);
  }

  .section-card--total {
    border-color: #f57c00;
  }

  .section-card > :global(.card-content) {
    padding-top: 18px;
  }

  .section-card--flat {
    border-color: #1976d2;
  }

  .section-card--fixed {
    border-color: #3949ab;
  }

  .section-card--variable {
    border-color: #388e3c;
  }

  .section-card--temporary {
    border-color: #7b1fa2;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    margin: 0;
    border: none;
    border-radius: 0;
  }

  .section-header__icon-wrap {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .section-header__icon-wrap :global(.material-icons) {
    font-size: 26px;
    color: #fff;
  }

  .section-header__text {
    flex: 1;
    min-width: 0;
  }

  .section-header__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .section-header__meta {
    margin: 3px 0 0;
    font-size: 0.78rem;
    opacity: 0.88;
    line-height: 1.35;
  }

  .section-header--flat {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-bottom: 2px solid #1976d2;
  }

  .section-header--flat .section-header__icon-wrap {
    background: #1976d2;
  }

  .section-header--flat .section-header__title {
    color: #0d47a1;
  }

  .section-header--flat .section-header__meta {
    color: #1565c0;
  }

  .section-header--fixed {
    background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    border-bottom: 2px solid #3949ab;
  }

  .section-header--fixed .section-header__icon-wrap {
    background: #3949ab;
  }

  .section-header--fixed .section-header__title {
    color: #1a237e;
  }

  .section-header--fixed .section-header__meta {
    color: #3949ab;
  }

  .section-header--variable {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-bottom: 2px solid #388e3c;
  }

  .section-header--variable .section-header__icon-wrap {
    background: #388e3c;
  }

  .section-header--variable .section-header__title {
    color: #1b5e20;
  }

  .section-header--variable .section-header__meta {
    color: #2e7d32;
  }

  .section-header--temporary {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border-bottom: 2px solid #7b1fa2;
  }

  .section-header--temporary .section-header__icon-wrap {
    background: #7b1fa2;
  }

  .section-header--temporary .section-header__title {
    color: #4a148c;
  }

  .section-header--temporary .section-header__meta {
    color: #6a1b9a;
  }

  .section-header--total {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border-bottom: 2px solid #f57c00;
  }

  .section-header--total .section-header__icon-wrap {
    background: #f57c00;
  }

  .section-header--total .section-header__title {
    color: #e65100;
  }

  .section-header--total .section-header__meta {
    color: #ef6c00;
  }

  @media only screen and (min-width: 601px) {
    .section-header {
      padding: 18px 20px;
      gap: 16px;
    }

    .section-header__icon-wrap {
      width: 52px;
      height: 52px;
    }

    .section-header__icon-wrap :global(.material-icons) {
      font-size: 28px;
    }

    .section-header__title {
      font-size: 1.15rem;
    }

    .section-header__meta {
      font-size: 0.82rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .section-card > :global(.card-content) {
      padding: 16px 12px 18px;
    }

    .section-header {
      padding: 12px;
      gap: 10px;
    }

    .section-header__icon-wrap {
      width: 40px;
      height: 40px;
    }

    .section-header__icon-wrap :global(.material-icons) {
      font-size: 22px;
    }

    .section-header__title {
      font-size: 0.92rem;
    }

    .section-header__meta {
      font-size: 0.72rem;
    }
  }
</style>
