import { Link } from "react-router-dom";
import FooterPolicyLinks from "./FooterPolicyLinks";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2026 VALLURI IIT JEE. All Rights Reserved.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms and Conditions</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/refund-cancellation">Refund / Cancellation</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
        </nav>

        <FooterPolicyLinks />
      </div>
    </footer>
  );
}

export default Footer;
