import FooterPolicyLinks from "../components/FooterPolicyLinks";

function ShippingPolicy() {
  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Shipping</p>
        <h1>Shipping Policy</h1>
        <p>
          This is a placeholder shipping policy page. Since this is a digital
          learning platform, delivery and access details will be listed here.
        </p>
      </section>
      <div className="page-policy-footer">
        <FooterPolicyLinks />
      </div>
    </main>
  );
}

export default ShippingPolicy;
