import FooterPolicyLinks from "../components/FooterPolicyLinks";

function Analytics() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Analytics</p>
        <h1>Track what needs attention</h1>
        <p>Use your test data to plan the next revision session.</p>
      </section>

      <section className="feature-grid">
        <article className="feature-card">
          <h3>Weak Topics</h3>
          <p>Rotational motion, organic reactions, and definite integrals.</p>
        </article>
        <article className="feature-card">
          <h3>Accuracy</h3>
          <p>Your latest overall accuracy is 76%.</p>
        </article>
        <article className="feature-card">
          <h3>Speed</h3>
          <p>Your average question speed is 2.1 minutes.</p>
        </article>
      </section>

      <section className="white-panel">
        <div>
          <p className="dashboard-label">Revision Suggestions</p>
          <h2>Focus on weak chapters first</h2>
          <p>
            Revise Mechanics today, solve 20 Organic Chemistry questions, and
            attempt one Calculus mini test.
          </p>
        </div>
      </section>
      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default Analytics;
