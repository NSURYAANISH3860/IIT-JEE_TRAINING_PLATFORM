import FooterPolicyLinks from "../components/FooterPolicyLinks";

function PrivacyPolicy() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Policy</p>
        <h1>Privacy Policy</h1>
        <p>
          This is a placeholder privacy policy page. Details about data
          collection, usage, and protection will be added here later.
        </p>
      </section>
      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default PrivacyPolicy;
