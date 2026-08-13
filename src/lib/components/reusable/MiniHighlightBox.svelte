<script lang="ts">
  type TotalVariant = 'fixed' | 'variable' | 'temporary' | 'summary';

  type Props =
    | {
        mode: 'details';
        icon: string;
        title: string;
        meta: string;
      }
    | {
        mode: 'total';
        variant: TotalVariant;
        label: string;
        monthly: string;
        annual: string;
        icon?: string;
      };

  let props: Props = $props();

  const totalIcon = $derived(props.mode === 'total' ? (props.icon ?? 'currency_rupee') : '');
</script>

{#if props.mode === 'details'}
  <div class="mini-highlight mini-highlight--details">
    <div class="mini-highlight__icon-wrap">
      <i class="material-icons" aria-hidden="true">{props.icon}</i>
    </div>
    <div class="mini-highlight__text">
      <h3 class="mini-highlight__title">{props.title}</h3>
      <p class="mini-highlight__meta">{props.meta}</p>
    </div>
  </div>
{:else}
  <div class="mini-highlight mini-highlight--amounts mini-highlight--{props.variant}">
    <div class="mini-highlight__head">
      <div class="mini-highlight__icon-wrap">
        <i class="material-icons" aria-hidden="true">{totalIcon}</i>
      </div>
      <span class="mini-highlight__label">{props.label}</span>
    </div>
    <div class="mini-highlight__amounts">
      <div class="mini-highlight__amount">
        <span class="mini-highlight__period">Monthly</span>
        <strong>{props.monthly}</strong>
      </div>
      <div class="mini-highlight__amount">
        <span class="mini-highlight__period">Annually</span>
        <strong>{props.annual}</strong>
      </div>
    </div>
  </div>
{/if}

<style>
  .mini-highlight {
    box-shadow: var(--card-shadow);
  }

  /* Details mode — sub-section header */
  .mini-highlight--details {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
    border-radius: 8px;
    background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    border: 1px solid #3949ab;
  }

  .mini-highlight--details .mini-highlight__icon-wrap {
    width: 40px;
    height: 40px;
    background: #3949ab;
  }

  .mini-highlight--details .mini-highlight__icon-wrap :global(.material-icons) {
    font-size: 22px;
  }

  .mini-highlight__title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.25;
    color: #1a237e;
  }

  .mini-highlight__meta {
    margin: 4px 0 0;
    font-size: 0.78rem;
    line-height: 1.35;
    color: #3949ab;
    opacity: 0.9;
  }

  /* Amounts mode — section footer strip */
  .mini-highlight--amounts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    font-weight: 600;
    border: 2px solid transparent;
    text-align: center;
  }

  .mini-highlight__head {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
  }

  .mini-highlight__icon-wrap {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .mini-highlight__icon-wrap :global(.material-icons) {
    font-size: 20px;
    color: #fff;
  }

  .mini-highlight__text {
    flex: 1;
    min-width: 0;
  }

  .mini-highlight__label {
    flex: 0 1 auto;
    min-width: 0;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1.3;
    text-align: center;
  }

  .mini-highlight__amounts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 12px;
    width: 100%;
    max-width: 16rem;
    justify-items: center;
  }

  .mini-highlight__amount {
    display: flex;
    flex-direction: column;
    min-width: 0;
    align-items: center;
  }

  .mini-highlight__period {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }

  .mini-highlight__amount strong {
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .mini-highlight--fixed .mini-highlight__icon-wrap {
    background: #3949ab;
  }

  .mini-highlight--fixed {
    background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    border-color: #3949ab;
  }

  .mini-highlight--fixed .mini-highlight__label {
    color: #1a237e;
  }

  .mini-highlight--fixed .mini-highlight__period {
    color: #3949ab;
  }

  .mini-highlight--fixed .mini-highlight__amount strong {
    color: #1a237e;
  }

  .mini-highlight--variable .mini-highlight__icon-wrap {
    background: #388e3c;
  }

  .mini-highlight--variable {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-color: #388e3c;
  }

  .mini-highlight--variable .mini-highlight__label {
    color: #1b5e20;
  }

  .mini-highlight--variable .mini-highlight__period {
    color: #388e3c;
  }

  .mini-highlight--variable .mini-highlight__amount strong {
    color: #1b5e20;
  }

  .mini-highlight--temporary .mini-highlight__icon-wrap {
    background: #7b1fa2;
  }

  .mini-highlight--temporary {
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    border-color: #7b1fa2;
  }

  .mini-highlight--temporary .mini-highlight__label {
    color: #4a148c;
  }

  .mini-highlight--temporary .mini-highlight__period {
    color: #7b1fa2;
  }

  .mini-highlight--temporary .mini-highlight__amount strong {
    color: #4a148c;
  }

  .mini-highlight--summary {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border-color: #f57c00;
  }

  .mini-highlight--summary .mini-highlight__icon-wrap {
    background: #f57c00;
  }

  .mini-highlight--summary .mini-highlight__label {
    color: #e65100;
  }

  .mini-highlight--summary .mini-highlight__period {
    color: #f57c00;
  }

  .mini-highlight--summary .mini-highlight__amount strong {
    color: #e65100;
    font-size: 1.2rem;
  }

  @media only screen and (min-width: 601px) {
    .mini-highlight--amounts {
      flex-direction: row;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      text-align: left;
    }

    .mini-highlight__head {
      flex: 1;
      width: auto;
      justify-content: flex-start;
    }

    .mini-highlight--amounts .mini-highlight__icon-wrap {
      width: 40px;
      height: 40px;
    }

    .mini-highlight--amounts .mini-highlight__icon-wrap :global(.material-icons) {
      font-size: 22px;
    }

    .mini-highlight__label {
      flex: 1;
      font-size: 0.8rem;
      text-align: left;
    }

    .mini-highlight__amounts {
      display: flex;
      width: auto;
      max-width: none;
      flex-shrink: 0;
      gap: 20px;
      justify-items: stretch;
    }

    .mini-highlight__amount {
      align-items: flex-end;
      min-width: 4.75rem;
    }

    .mini-highlight__amount strong {
      font-size: 1.25rem;
    }

    .mini-highlight--summary .mini-highlight__amount strong {
      font-size: 1.35rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .mini-highlight--details {
      padding: 10px 12px;
      gap: 10px;
    }

    .mini-highlight--details .mini-highlight__icon-wrap {
      width: 36px;
      height: 36px;
    }

    .mini-highlight--details .mini-highlight__icon-wrap :global(.material-icons) {
      font-size: 20px;
    }

    .mini-highlight__title {
      font-size: 0.88rem;
    }

    .mini-highlight__meta {
      font-size: 0.7rem;
    }

    .mini-highlight__label {
      font-size: 0.72rem;
    }

    .mini-highlight__amount strong {
      font-size: 1rem;
    }
  }
</style>
