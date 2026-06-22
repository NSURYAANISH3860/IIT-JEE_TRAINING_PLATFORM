import FooterPolicyLinks from "../components/FooterPolicyLinks";

function CookiePolicy() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Policy</p>
        <h1>Cookie Policy</h1>
        <p>
          This is a placeholder cookie policy page. Details about cookies,
          analytics, and preference controls will be added here later.
        </p>
      </section>
      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default CookiePolicy;
