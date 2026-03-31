import { useState } from 'react';

const auths = [
  { id: 'AUTH-1001', patient: 'Patient A', payer: 'Medicaid / Peach State', service: 'ABA Therapy', unitsAuth: 120, unitsUsed: 112, expires: '2025-01-15', status: 'Expiring soon', vendor: 'Availity' },
  { id: 'AUTH-1002', patient: 'Patient B', payer: 'BCBS of GA', service: 'Speech Therapy', unitsAuth: 60, unitsUsed: 18, expires: '2025-03-10', status: 'Active', vendor: 'Navicure' },
  { id: 'AUTH-1003', patient: 'Patient C', payer: 'Aetna', service: 'OT', unitsAuth: 40, unitsUsed: 40, expires: '2024-12-31', status: 'Expired', vendor: 'Availity' },
  { id: 'AUTH-1004', patient: 'Patient D', payer: 'UnitedHealthcare', service: 'ABA Therapy', unitsAuth: 200, unitsUsed: 95, expires: '2025-02-20', status: 'Active', vendor: 'Optum' },
  { id: 'AUTH-1005', patient: 'Patient E', payer: 'Humana', service: 'Speech Therapy', unitsAuth: 80, unitsUsed: 79, expires: '2025-01-20', status: 'Expiring soon', vendor: 'Navicure' },
  { id: 'AUTH-1006', patient: 'Patient F', payer: 'Cigna', service: 'PT', unitsAuth: 30, unitsUsed: 5, expires: '2025-04-01', status: 'Active', vendor: 'Availity' },
  { id: 'AUTH-1007', patient: 'Patient G', payer: 'Medicaid / Peach State', service: 'ABA Therapy', unitsAuth: 160, unitsUsed: 160, expires: '2024-12-15', status: 'Expired', vendor: 'Availity' },
  { id: 'AUTH-1008', patient: 'Patient H', payer: 'BCBS of GA', service: 'OT', unitsAuth: 50, unitsUsed: 12, expires: '2025-05-01', status: 'Active', vendor: 'Navicure' },
];

const vendorQueue = [
  { vendor: 'Availity', authId: 'AUTH-1009', patient: 'Patient I', submitted: '2024-12-20', slaDays: 5, daysPending: 8, status: 'Breached' },
  { vendor: 'Navicure', authId: 'AUTH-1010', patient: 'Patient J', submitted: '2024-12-23', slaDays: 5, daysPending: 4, status: 'Within SLA' },
  { vendor: 'Optum', authId: 'AUTH-1011', patient: 'Patient K', submitted: '2024-12-22', slaDays: 3, daysPending: 3, status: 'At risk' },
  { vendor: 'Availity', authId: 'AUTH-1012', patient: 'Patient L', submitted: '2024-12-21', slaDays: 5, daysPending: 6, status: 'Breached' },
  { vendor: 'Navicure', authId: 'AUTH-1013', patient: 'Patient M', submitted: '2024-12-24', slaDays: 5, daysPending: 2, status: 'Within SLA' },
];

const workflowStages = [
  { stage: 'Submitted to vendor', count: 5, color: '#185FA5' },
  { stage: 'Pending vendor review', count: 8, color: '#c67d14' },
  { stage: 'Approved', count: 24, color: '#1D9E75' },
  { stage: 'Expiring soon', count: 2, color: '#e07b39' },
  { stage: 'Expired', count: 2, color: '#c0392b' },
];

const kpis = [
  { label: 'Total active auths', value: '41', color: '#1a1a1a', sub: 'across all payers' },
  { label: 'Auths expiring ≤ 30 days', value: '2', color: '#e07b39', sub: 'requires immediate action' },
  { label: 'Avg unit utilization', value: '74%', color: '#185FA5', sub: 'authorized vs used' },
  { label: 'Vendor SLA compliance', value: '60%', color: '#c0392b', sub: '2 of 5 queue items breached' },
];

const tabs = ['Auth summary', 'Unit utilization', 'Vendor queue', 'Expiration risk', 'Workflow status'];

const statusStyle = {
  'Active': { background: '#eaf3de', color: '#3b6d11' },
  'Expiring soon': { background: '#faeeda', color: '#854f0b' },
  'Expired': { background: '#fcebeb', color: '#791f1f' },
  'Within SLA': { background: '#eaf3de', color: '#3b6d11' },
  'At risk': { background: '#faeeda', color: '#854f0b' },
  'Breached': { background: '#fcebeb', color: '#791f1f' },
};

const s = {
  app: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  navbar: { background: '#fff', borderBottom: '1px solid #e5e5e2', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '2rem', height: 52 },
  brand: { fontWeight: 600, fontSize: 14, color: '#1a1a1a', whiteSpace: 'nowrap' },
  main: { padding: '2rem', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%' },
  pageTitle: { fontSize: 24, fontWeight: 600, marginBottom: 4 },
  pageMeta: { fontSize: 12, color: '#888780', marginBottom: '1.5rem' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.5rem' },
  kpiCard: { background: '#fff', border: '1px solid #e5e5e2', borderRadius: 8, padding: '1rem 1.25rem' },
  kpiLabel: { fontSize: 12, color: '#888780', marginBottom: 6 },
  kpiSub: { fontSize: 11, color: '#888780', marginTop: 4 },
  tabNav: { display: 'flex', borderBottom: '1px solid #e5e5e2', marginBottom: '1.5rem' },
  tabBtn: { padding: '8px 1rem', fontSize: 13, color: '#888780', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' },
  tabBtnActive: { padding: '8px 1rem', fontSize: 13, color: '#1a1a1a', background: 'none', border: 'none', borderBottom: '2px solid #1a1a1a', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' },
  card: { background: '#fff', border: '1px solid #e5e5e2', borderRadius: 8, padding: '1.25rem', marginBottom: '1.25rem' },
  cardTitle: { fontSize: 13, fontWeight: 500, marginBottom: '1rem', color: '#5f5e5a' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#888780', padding: '8px 12px', borderBottom: '1px solid #e5e5e2', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  td: { padding: '10px 12px', borderBottom: '1px solid #f0efea', verticalAlign: 'middle' },
  badge: { display: 'inline-block', fontSize: 11, padding: '3px 9px', borderRadius: 99, fontWeight: 500 },
  barTrack: { height: 6, background: '#f0efea', borderRadius: 99, overflow: 'hidden', minWidth: 80 },
};

export default function App() {
  const [tab, setTab] = useState('Auth summary');

  const expiringAuths = auths.filter(a => a.status === 'Expiring soon' || a.status === 'Expired');
  const activeAuths = auths.filter(a => a.status === 'Active' || a.status === 'Expiring soon');

  return (
    <div style={s.app}>
      <nav style={s.navbar}>
        <span style={s.brand}>Magnolia Pediatric Behavioral Health</span>
        <span style={{ fontSize: 13, color: '#888780' }}>Prior Authorization Operations Tracker</span>
      </nav>

      <main style={s.main}>
        <h1 style={s.pageTitle}>Authorization Operations Tracker</h1>
        <p style={s.pageMeta}>Magnolia Pediatric Behavioral Health · Augusta, GA · FY 2024</p>

        <div style={s.kpiGrid}>
          {kpis.map(k => (
            <div key={k.label} style={s.kpiCard}>
              <div style={s.kpiLabel}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: k.color }}>{k.value}</div>
              <div style={s.kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={s.tabNav}>
          {tabs.map(t => (
            <button key={t} style={tab === t ? s.tabBtnActive : s.tabBtn} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === 'Auth summary' && (
          <div style={s.card}>
            <div style={s.cardTitle}>All active authorizations</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Auth ID</th>
                  <th style={s.th}>Patient</th>
                  <th style={s.th}>Payer</th>
                  <th style={s.th}>Service</th>
                  <th style={s.th}>Vendor</th>
                  <th style={s.th}>Expires</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auths.map(a => (
                  <tr key={a.id}>
                    <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{a.id}</td>
                    <td style={s.td}>{a.patient}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.payer}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.service}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.vendor}</td>
                    <td style={{ ...s.td, color: '#5f5e5a', whiteSpace: 'nowrap' }}>{a.expires}</td>
                    <td style={s.td}><span style={{ ...s.badge, ...statusStyle[a.status] }}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Unit utilization' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Unit utilization by authorization</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Auth ID</th>
                  <th style={s.th}>Patient</th>
                  <th style={s.th}>Service</th>
                  <th style={s.th}>Units auth'd</th>
                  <th style={s.th}>Units used</th>
                  <th style={s.th}>Utilization</th>
                  <th style={s.th}></th>
                </tr>
              </thead>
              <tbody>
                {auths.map(a => {
                  const pct = Math.round((a.unitsUsed / a.unitsAuth) * 100);
                  const barColor = pct >= 95 ? '#c0392b' : pct >= 80 ? '#e07b39' : '#1D9E75';
                  return (
                    <tr key={a.id}>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{a.id}</td>
                      <td style={s.td}>{a.patient}</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.service}</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.unitsAuth}</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.unitsUsed}</td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={s.barTrack}>
                            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: barColor }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: barColor, minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={s.td}>
                        {pct >= 95 && <span style={{ ...s.badge, ...statusStyle['Expiring soon'] }}>At limit</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Vendor queue' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Pending vendor queue — SLA performance</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Auth ID</th>
                  <th style={s.th}>Patient</th>
                  <th style={s.th}>Vendor</th>
                  <th style={s.th}>Submitted</th>
                  <th style={s.th}>SLA (days)</th>
                  <th style={s.th}>Days pending</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorQueue.map(v => (
                  <tr key={v.authId}>
                    <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{v.authId}</td>
                    <td style={s.td}>{v.patient}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{v.vendor}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{v.submitted}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{v.slaDays}</td>
                    <td style={{ ...s.td, fontWeight: 500, color: v.status === 'Breached' ? '#c0392b' : '#1a1a1a' }}>{v.daysPending}</td>
                    <td style={s.td}><span style={{ ...s.badge, ...statusStyle[v.status] }}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Expiration risk' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Authorizations expiring within 30 days or already expired</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Auth ID</th>
                  <th style={s.th}>Patient</th>
                  <th style={s.th}>Payer</th>
                  <th style={s.th}>Service</th>
                  <th style={s.th}>Units remaining</th>
                  <th style={s.th}>Expires</th>
                  <th style={s.th}>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {expiringAuths.map(a => {
                  const remaining = a.unitsAuth - a.unitsUsed;
                  return (
                    <tr key={a.id}>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{a.id}</td>
                      <td style={s.td}>{a.patient}</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.payer}</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.service}</td>
                      <td style={{ ...s.td, color: remaining === 0 ? '#c0392b' : '#5f5e5a', fontWeight: remaining === 0 ? 500 : 400 }}>{remaining} units</td>
                      <td style={{ ...s.td, color: '#5f5e5a' }}>{a.expires}</td>
                      <td style={s.td}><span style={{ ...s.badge, ...statusStyle[a.status] }}>{a.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Workflow status' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Authorization workflow pipeline — current snapshot</div>
            <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {workflowStages.map(w => (
                <div key={w.stage} style={{ flex: 1, minWidth: 140, background: '#f9f9f8', border: '1px solid #e5e5e2', borderRadius: 8, padding: '1rem', borderTop: `3px solid ${w.color}` }}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: w.color, marginBottom: 4 }}>{w.count}</div>
                  <div style={{ fontSize: 12, color: '#5f5e5a' }}>{w.stage}</div>
                </div>
              ))}
            </div>
            <div style={s.cardTitle}>Active auth details</div>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Auth ID</th>
                  <th style={s.th}>Patient</th>
                  <th style={s.th}>Payer</th>
                  <th style={s.th}>Service</th>
                  <th style={s.th}>Vendor</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeAuths.map(a => (
                  <tr key={a.id}>
                    <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{a.id}</td>
                    <td style={s.td}>{a.patient}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.payer}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.service}</td>
                    <td style={{ ...s.td, color: '#5f5e5a' }}>{a.vendor}</td>
                    <td style={s.td}><span style={{ ...s.badge, ...statusStyle[a.status] }}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
