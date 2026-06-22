import { Link } from "react-router-dom";

function FooterPolicyLinks() {
  return (
    <nav className="footer-policy-links" aria-label="Policy links">
      <Link to="/privacy-policy">Privacy Policy</Link>
      <Link to="/terms-and-conditions">Terms and Conditions</Link>
      <Link to="/cookie-policy">Cookie Policy</Link>
      <Link to="/refund-cancellation">Refunds / Cancellations</Link>
    </nav>
  );
}

export default FooterPolicyLinks;
