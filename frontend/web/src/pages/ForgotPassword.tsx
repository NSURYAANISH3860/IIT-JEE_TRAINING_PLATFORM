import FooterPolicyLinks from "../components/FooterPolicyLinks";

function ForgotPassword() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Account Help</p>
        <h1>Forgot password</h1>
        <p>
          Password reset will be enabled soon. For now, contact the Valluri
          support team to recover access to your student account.
        </p>
      </section>

      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default ForgotPassword;
