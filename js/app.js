/**
 * App — Materialize CSS, spreadsheet sections, monthly + annual columns.
 */

const CONFIG_URL = './config/society.json';

let config = null;
let billingSelectInstance = null;

function currentBillingMonth() {
  const el = document.getElementById('billing-month');
  if (el && el.value) return el.value;
  return formatMonth(new Date());
}

function formatMonth(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function formatCurrency(amount, locale = 'en-IN', currency = 'INR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return parseFloat(el.value) || 0;
}

function getInputs() {
  return {
    carpet: getFieldValue('carpet'),
    balcony: getFieldValue('balcony'),
  };
}

function rowHtml(particular, monthly, annual, className = '', rowNum = '') {
  return `<tr class="${className}">
    <td class="center-align col-num">${rowNum}</td>
    <td>${particular}</td>
    <td class="right-align">${monthly}</td>
    <td class="right-align">${annual}</td>
  </tr>`;
}

function calcRowHtml(label, monthly, annual, rowNum) {
  return `<tr class="row-calc">
    <td class="center-align col-num">${rowNum}</td>
    <td>${label}</td>
    <td class="right-align">${monthly}</td>
    <td class="right-align">${annual}</td>
  </tr>`;
}

function fundFormulaNote(fund) {
  if (fund.formulaNote) return fund.formulaNote;
  return `(Total Usable Area × Construction Cost Per Sq.Ft. × ${fund.annualPercent}%) ÷ 12`;
}

function variableRowHtml(fund, rowNum) {
  const formula = fundFormulaNote(fund);
  return `<tr>
    <td class="center-align col-num">${rowNum}</td>
    <td>${fund.label}</td>
    <td class="right-align">${formatCurrency(fund.monthly)}</td>
    <td class="right-align">${formatCurrency(fund.annual)}</td>
  </tr>
  <tr class="row-formula">
    <td colspan="4" class="formula-note">${formula}</td>
  </tr>`;
}

function unitTypeRowHtml(label, units, rowNum) {
  return `<tr>
    <td class="center-align col-num">${rowNum}</td>
    <td>${label}</td>
    <td class="right-align">${units}</td>
  </tr>`;
}

function renderUnitTypesSection() {
  const tbody = document.getElementById('fixed-unit-types');
  if (!tbody || !config) return;

  const unitTypes = config.society.unitTypes || [];
  tbody.innerHTML = unitTypes
    .map((type, index) => unitTypeRowHtml(type.label, type.units, index + 1))
    .join('');

  setText('fixed-flat-count', config.society.flatCount);
  setText('fixed-unit-total', config.society.flatCount);
}

function renderFixedSection(result) {
  const { fixed } = result;
  const tbody = document.getElementById('fixed-items');
  const calcRows = document.getElementById('fixed-calc-rows');
  if (!tbody) return;

  // Main table: building-level monthly & annual (common expense)
  tbody.innerHTML = fixed.items
    .map((item, index) =>
      rowHtml(
        item.label,
        formatCurrency(item.societyMonthly),
        formatCurrency(item.societyAnnual),
        '',
        index + 1
      )
    )
    .join('');

  setText('fixed-building-monthly', formatCurrency(fixed.totalMonthly));
  setText('fixed-building-annual', formatCurrency(fixed.totalAnnual));

  if (calcRows) {
    calcRows.innerHTML = [
      calcRowHtml(
        'Per Flat Fixed Cost (before buffer)',
        formatCurrency(fixed.perFlat),
        formatCurrency(fixed.perFlat * 12),
        1
      ),
      calcRowHtml(
        `Buffer (${fixed.bufferPercent}%)`,
        formatCurrency(fixed.bufferAmount),
        formatCurrency(fixed.bufferAmount * 12),
        2
      ),
    ].join('');
  }

  setText('fixed-with-buffer-monthly', formatCurrency(fixed.withBuffer));
  setText('fixed-with-buffer-annual', formatCurrency(fixed.withBuffer * 12));
  setText('fixed-rounded-monthly', formatCurrency(fixed.rounded));
  setText('fixed-rounded-annual', formatCurrency(fixed.rounded * 12));
  setText('fixed-buffer-pct', fixed.bufferPercent);
}

function renderVariableSection(result) {
  const { variable } = result;
  const area = variable.area.toFixed(2);

  setText('total-area', area);
  setText('construction-rate', formatCurrency(variable.constructionCostPerSqFt));

  const tbody = document.getElementById('variable-items');
  if (tbody) {
    tbody.innerHTML = variable.funds
      .map((fund, index) => variableRowHtml(fund, index + 1))
      .join('');
  }

  const variableTotalMonthly = formatCurrency(variable.total);
  const variableTotalAnnual = formatCurrency(variable.totalAnnual);
  setText('variable-table-total-monthly', variableTotalMonthly);
  setText('variable-table-total-annual', variableTotalAnnual);
  setText('variable-total-monthly', variableTotalMonthly);
  setText('variable-total-annual', variableTotalAnnual);
}

function renderTemporarySection(result) {
  const { temporary } = result;
  const section = document.getElementById('temporary-section');
  const tbody = document.getElementById('temporary-items');

  if (!temporary.charges.length) {
    if (section) section.hidden = true;
    return;
  }

  if (section) section.hidden = false;
  if (tbody) {
    tbody.innerHTML = temporary.charges
      .map((charge, index) =>
        rowHtml(
          `${charge.label}<span class="item-note">${formatMonthLabel(charge.startMonth)} – ${formatMonthLabel(charge.endMonth)}${charge.note ? ` · ${charge.note}` : ''}</span>`,
          formatCurrency(charge.monthlyAmount),
          formatCurrency(charge.annualAmount),
          '',
          index + 1
        )
      )
      .join('');
  }

  const tempAnnual = temporary.charges.reduce((s, c) => s + c.annualAmount, 0);
  setText('temporary-total-monthly', formatCurrency(temporary.total));
  setText('temporary-total-annual', formatCurrency(tempAnnual));
}

function renderTotalSection(result) {
  const { fixed, variable, temporary, annual } = result;
  const exactMonthly = formatCurrency(result.exactMonthly);
  const exactAnnual = formatCurrency(annual.grandAnnual);
  const roundedMonthly = formatCurrency(result.grandMonthly);
  const roundedAnnual = formatCurrency(result.grandAnnual);

  setText('summary-fixed-monthly', formatCurrency(fixed.rounded));
  setText('summary-fixed-annual', formatCurrency(fixed.rounded * 12));
  setText('summary-variable-monthly', formatCurrency(variable.total));
  setText('summary-variable-annual', formatCurrency(variable.totalAnnual));
  setText('summary-temporary-monthly', formatCurrency(temporary.total));
  setText('summary-temporary-annual', formatCurrency(annual.temporaryAnnual));
  setText('summary-grand-monthly', roundedMonthly);
  setText('summary-grand-annual', roundedAnnual);
  setText('summary-grand-monthly-row', exactMonthly);
  setText('summary-grand-annual-row', exactAnnual);
  setText('summary-grand-monthly-foot', roundedMonthly);
  setText('summary-grand-annual-foot', roundedAnnual);
  setText('billing-month-label', formatMonthLabel(result.billingMonth));

  const tempRow = document.getElementById('summary-temporary-row');
  if (tempRow) tempRow.hidden = temporary.total === 0;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function recalculate() {
  if (!config) return;
  const { carpet, balcony } = getInputs();
  const billingMonth = currentBillingMonth();
  const result = calculateMaintenance(config, carpet, balcony, billingMonth);

  renderFixedSection(result);
  renderUnitTypesSection();
  renderVariableSection(result);
  renderTemporarySection(result);
  renderTotalSection(result);
}

function populateBillingMonthOptions() {
  const select = document.getElementById('billing-month');
  if (!select) return;

  const now = new Date();
  const current = formatMonth(now);
  select.innerHTML = '';

  for (let i = -6; i <= 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = formatMonth(d);
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === current) opt.selected = true;
    select.appendChild(opt);
  }
}

function initMaterialize() {
  M.updateTextFields();

  const select = document.getElementById('billing-month');
  if (select) {
    if (billingSelectInstance) billingSelectInstance.destroy();
    billingSelectInstance = M.FormSelect.init(select, {
      dropdownOptions: { coverTrigger: false },
    })[0];
  }
}

function bindInputs() {
  ['carpet', 'balcony'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', recalculate);
  });

  const billingMonth = document.getElementById('billing-month');
  if (billingMonth) billingMonth.addEventListener('change', recalculate);
}

function applyConfigMeta() {
  const title = config.society.name;
  document.title = title;
  setText('page-title', title);
}

async function init() {
  try {
    await assembleLayout();

    const response = await fetch(CONFIG_URL);
    if (!response.ok) throw new Error(`Failed to load config (${response.status})`);
    config = await response.json();

    applyConfigMeta();
    populateBillingMonthOptions();
    initMaterialize();
    bindInputs();
    recalculate();
  } catch (err) {
    const root = document.getElementById('app-root');
    const main = document.getElementById('main-content');
    const target = main || root;
    if (target) {
      target.innerHTML = `<div class="card red lighten-5 error-card z-depth-1">
        <h2>Unable to load page</h2>
        <p class="grey-text text-darken-2">${err.message}</p>
        <p class="grey-text">Ensure partials and <code>config/society.json</code> are available. Run via a local server (not file://).</p>
      </div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
