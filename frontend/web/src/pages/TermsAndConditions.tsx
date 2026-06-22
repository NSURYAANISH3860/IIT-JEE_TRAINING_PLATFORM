import FooterPolicyLinks from "../components/FooterPolicyLinks";

function TermsAndConditions() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Terms</p>
        <h1>Terms and Conditions</h1>
        <p>
          This is a placeholder terms page. Rules for using the platform,
          accounts, subscriptions, and content will be added here later.
        </p>
      </section>
      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default TermsAndConditions;
