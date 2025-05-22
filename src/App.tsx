import { useState } from 'react'
import './App.css'
import { PackageInfo } from './components/PackageInfo'

// Pricing tiers and data
const tiers = [
  { min: 1, max: 50, label: '1-50', base: 49, learning: 19, checklist: 5, case: 5 },
  { min: 51, max: 100, label: '51-100', base: 39, learning: 15, checklist: 4, case: 4 },
  { min: 101, max: 500, label: '101-500', base: 32, learning: 13, checklist: 3.5, case: 3.5 },
  { min: 501, max: 1000, label: '501-1000', base: 29, learning: 10, checklist: 3, case: 3 },
  { min: 1001, max: 3000, label: '1001-3000', base: 25, learning: 8, checklist: 2.5, case: 2.5 },
  { min: 3001, max: Infinity, label: '3001+', base: 20, learning: 8, checklist: 2, case: 2 },
];

const subscriptions = [
  { label: 'Månad till månad', discount: 0 },
  { label: '12 månader (+10% rabatt)', discount: 0.10 },
  { label: '24 månader (+20% rabatt)', discount: 0.20 },
  { label: '36 månader (+30% rabatt)', discount: 0.30 },
];

const consultantPackages = [
  { label: 'Inga konsulttimmar', hours: 0, price: 0 },
  { label: '1 timma', hours: 1, price: 1100 },
  { label: '10 timmar', hours: 10, price: 10000 },
  { label: '25 timmar', hours: 25, price: 22500 },
  { label: '50 timmar', hours: 50, price: 40000 },
];

function getTier(users: number) {
  return tiers.find(t => users >= t.min && users <= t.max) || tiers[tiers.length - 1];
}

export default function App() {
  const [users, setUsers] = useState(1);
  const [addons, setAddons] = useState({ learning: false, checklist: false, case: false });
  const [subscription, setSubscription] = useState(0);
  const [consultant, setConsultant] = useState(0);

  const tier = getTier(users);
  let pricePerUser = tier.base;
  if (addons.learning) pricePerUser += tier.learning;
  if (addons.checklist) pricePerUser += tier.checklist;
  if (addons.case) pricePerUser += tier.case;
  const discount = subscriptions[subscription].discount;
  const discountedPricePerUser = pricePerUser * (1 - discount);
  const totalMonthly = discountedPricePerUser * users;
  const totalYearly = totalMonthly * 12;

  const consultantCost = consultantPackages[consultant].price;

  // Calculate discount in SEK per user
  const discountSEK = pricePerUser * discount;

  // Find previous tier for percent difference
  const currentTierIndex = tiers.findIndex(t => t.label === tier.label);
  const prevTier = currentTierIndex > 0 ? tiers[currentTierIndex - 1] : null;
  function percentDiff(newVal: number, oldVal: number) {
    if (!oldVal || oldVal === 0) return '';
    const diff = ((newVal - oldVal) / oldVal) * 100;
    if (diff === 0) return '';
    return (diff > 0 ? '+' : '') + diff.toFixed(0) + '%';
  }

  return (
    <div className="pricelist-container modern-bg">
      <PackageInfo />
      <div className="main-steps-grid">
        <div className="step-col">
          <h1 className="main-title">Prislista Kalkylator</h1>
          <div className="step-header">Steg 1: Välj användare, abonnemang och tillägg</div>
          <div className="input-group">
            <label>Antal användare:</label>
            <input
              type="number"
              min={1}
              value={users}
              onChange={e => setUsers(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <div className="input-group">
            <label>Abonnemangstyp:</label>
            <select value={subscription} onChange={e => setSubscription(Number(e.target.value))}>
              {subscriptions.map((s, i) => (
                <option value={i} key={s.label}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="addons-cta">
            <AddonButton
              label={`Learning module (+${tier.learning} SEK/användare)`}
              active={addons.learning}
              onClick={() => setAddons(a => ({ ...a, learning: !a.learning }))}
            />
            <AddonButton
              label={`Tools: Checklist (+${tier.checklist} SEK/användare)`}
              active={addons.checklist}
              onClick={() => setAddons(a => ({ ...a, checklist: !a.checklist }))}
            />
            <AddonButton
              label={`Tools: Ärendehantering (+${tier.case} SEK/användare)`}
              active={addons.case}
              onClick={() => setAddons(a => ({ ...a, case: !a.case }))}
            />
          </div>
        </div>
        <div className="step-col">
          <div className="step-header">Steg 2: Välj konsulttimmar (engångskostnad)</div>
          <div className="consultant-section">
            <div className="consultant-packages">
              {consultantPackages.map((pkg, i) => (
                <button
                  key={pkg.label}
                  className={`consultant-btn${consultant === i ? ' active' : ''}`}
                  onClick={() => setConsultant(i)}
                  type="button"
                >
                  <span className="consultant-label">{pkg.label}</span>
                  <span className="consultant-price">{pkg.price ? pkg.price.toLocaleString() + ' SEK' : '0 SEK'}</span>
                </button>
              ))}
            </div>
            {consultant !== 0 && (
              <div className="consultant-summary">
                <b>Valt paket:</b> {consultantPackages[consultant].label} – <b>{consultantPackages[consultant].price.toLocaleString()} SEK</b>
              </div>
            )}
          </div>
        </div>
        <div className="step-col">
          <div className="step-header">Steg 3: Sammanfattning</div>
          <div className="results modern-card summary-vertical">
            <div className="summary-grid-list">
              <div className="summary-grid-label"><b>Abonnemang</b></div>
              <div className="summary-grid-value">{subscriptions[subscription].label}</div>
              <div className="summary-grid-label"><b>Rabatt</b></div>
              <div className="summary-grid-value">{discount * 100}% ({discountSEK.toFixed(2)} SEK/användare)</div>
              <div className="summary-grid-label"><b>Prisnivå</b></div>
              <div className="summary-grid-value">{tier.label}</div>
              <div className="summary-grid-label"><b>Antal användare</b></div>
              <div className="summary-grid-value">{users}</div>
              <div className="summary-grid-label"><b>Grundpris användare</b></div>
              <div className="summary-grid-value">
                {tier.base.toLocaleString()} kr
                {prevTier && (
                  <span className="diff-note">{percentDiff(tier.base, prevTier.base)}</span>
                )}
              </div>
              <div className="summary-grid-label"><b>Tillägg användare</b></div>
              <div className="summary-grid-value">
                {(pricePerUser - tier.base).toLocaleString()} kr
                {prevTier && (
                  <span className="diff-note">{percentDiff(pricePerUser - tier.base, prevTier.learning + prevTier.checklist + prevTier.case)}</span>
                )}
              </div>
              <div className="summary-grid-label"><b>Månadspris per användare</b></div>
              <div className="summary-grid-value">{discountedPricePerUser.toLocaleString()} kr</div>
              <div className="summary-grid-label"><b>Årsvis per användare</b></div>
              <div className="summary-grid-value">{(discountedPricePerUser * 12).toLocaleString()} kr</div>
              <div className="summary-grid-divider" />
              <div className="summary-grid-label"><b>Total rabatt / år</b></div>
              <div className="summary-grid-value">{(discountSEK * users * 12).toLocaleString()} kr</div>
              <div className="summary-grid-divider" />
              <div className="summary-grid-label"><b>Totalt per månad</b></div>
              <div className="summary-grid-value">{totalMonthly.toLocaleString()} kr</div>
              <div className="summary-grid-label"><b>Totalt per år</b></div>
              <div className="summary-grid-value">{totalYearly.toLocaleString()} kr</div>
              <div className="summary-grid-divider" />
              <div className="summary-grid-label"><b>Engångskostnad: konsulttimmar</b></div>
              <div className="summary-grid-value">{consultantCost ? consultantCost.toLocaleString() + ' kr' : '0 kr'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddonButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      className={`addon-btn${active ? ' active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
