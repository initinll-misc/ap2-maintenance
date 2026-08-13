<script lang="ts">
  import SectionCard from '$lib/components/reusable/SectionCard.svelte';
  import BigHighlightBox from '$lib/components/reusable/BigHighlightBox.svelte';
  import { materializeSelect, materializeTextFields } from '$lib/actions/materialize';
  import type { MaintenanceConfig } from '$lib/types/config';
  import type { MaintenanceResult } from '$lib/types/maintenance';
  import { buildBillingMonthOptions } from '$lib/utils/format';

  interface Props {
    config: MaintenanceConfig;
    result: MaintenanceResult;
    carpet: number;
    balcony: number;
    billingMonth: string;
  }

  let {
    config: _config,
    result,
    carpet = $bindable(),
    balcony = $bindable(),
    billingMonth = $bindable(),
  }: Props = $props();

  const billingOptions = buildBillingMonthOptions();
  const totalArea = $derived(result.variable.area);
</script>

<SectionCard
  variant="flat"
  icon="home"
  title="Flat — Area (Sq. Ft.)"
  meta="Enter carpet & balcony to compute your share"
>
  <div class="row flat-inputs" use:materializeTextFields>
    <div class="input-field col s12 m6">
      <i class="material-icons prefix blue-text text-lighten-1">straighten</i>
      <input
        id="carpet"
        type="number"
        inputmode="decimal"
        min="0"
        step="any"
        class="validate"
        bind:value={carpet}
      />
      <label for="carpet" class="active">Carpet area (sq.ft)</label>
      <span class="helper-text">As mentioned in ANNEXURE F</span>
    </div>
    <div class="input-field col s12 m6">
      <i class="material-icons prefix blue-text text-lighten-1">deck</i>
      <input
        id="balcony"
        type="number"
        inputmode="decimal"
        min="0"
        step="any"
        class="validate"
        bind:value={balcony}
      />
      <label for="balcony" class="active">Balcony area (sq.ft)</label>
      <span class="helper-text">As mentioned in ANNEXURE F</span>
    </div>
  </div>

  <BigHighlightBox
    variant="area"
    icon="square_foot"
    label="Total Usable Area"
    value={totalArea.toFixed(2)}
    unit="sq.ft"
    formula="Carpet area + Balcony area"
  />

  <div class="row flat-inputs flat-inputs--billing">
    <div class="col s12 billing-month-field">
      <span class="billing-month-field__label" id="billing-month-label">Billing month</span>
      <div class="input-field billing-month-field__control">
        <i class="material-icons prefix blue-text text-lighten-1">event</i>
        <select
          id="billing-month"
          aria-labelledby="billing-month-label"
          bind:value={billingMonth}
          use:materializeSelect={billingMonth}
        >
          {#each billingOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</SectionCard>

<style>
  .flat-inputs {
    margin-bottom: 0;
  }

  .flat-inputs :global(.input-field) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .flat-inputs :global(.helper-text) {
    font-size: 0.72rem;
    color: #78909c;
    font-style: italic;
  }

  .flat-inputs--billing {
    margin-top: 1rem;
    margin-bottom: 0;
  }

  .billing-month-field__label {
    display: block;
    margin: 0 0 2px 3rem;
    padding: 0;
    color: #9e9e9e;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
    transform: scale(0.8);
    transform-origin: 0 0;
  }

  .billing-month-field__control {
    margin-top: 0;
    margin-bottom: 0;
  }

  .billing-month-field__control :global(.select-wrapper) {
    box-sizing: border-box;
    width: calc(100% - 3rem);
    margin-left: 3rem;
  }

  .billing-month-field__control :global(.select-wrapper input.select-dropdown) {
    box-sizing: border-box;
    width: 100%;
    height: 3rem;
    margin: 0 0 8px;
    padding-right: 2rem;
    font-size: 1rem;
    line-height: 3rem;
    color: rgba(0, 0, 0, 0.87);
  }

  .billing-month-field__control :global(.caret) {
    right: 0;
  }

  @media only screen and (max-width: 600px) {
    .flat-inputs :global(.input-field .prefix) {
      width: 2rem;
      font-size: 1.45rem;
    }

    .flat-inputs :global(.input-field > input) {
      margin-left: 2.5rem !important;
      width: calc(100% - 2.5rem) !important;
      font-size: 16px;
    }

    .flat-inputs :global(.input-field > label) {
      margin-left: 2.5rem !important;
    }

    .flat-inputs :global(.helper-text) {
      margin-left: 2.5rem;
    }

    .billing-month-field__label {
      margin-left: 2.5rem;
    }

    .billing-month-field__control :global(.select-wrapper) {
      width: calc(100% - 2.5rem);
      margin-left: 2.5rem;
    }

    .billing-month-field__control :global(.select-wrapper input.select-dropdown) {
      font-size: 16px;
    }
  }
</style>
