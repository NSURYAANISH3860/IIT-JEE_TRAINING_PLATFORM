function ContactSection() {
  function sendMessage() {
    window.alert("Message sent successfully!");
  }

  return (
    <section className="contact-section">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Contact Us</h2>
        <p>
          Have questions about Quantum AI IIT JEE Mock Tests? Reach out to us.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-card-list">
          <article className="contact-card">
            <p>EMAIL</p>
            <strong>info@quantumai.com</strong>
          </article>

          <article className="contact-card">
            <p>CONTACT</p>
            <strong>+91 9949029911</strong>
          </article>

          <article className="contact-card">
            <p>LOCATION</p>
            <strong>India</strong>
          </article>
        </div>

        <form className="form-card contact-form">
          <label>
            Name
            <input type="text" placeholder="Enter your name" />
          </label>

          <label>
            Email
            <input type="email" placeholder="student@example.com" />
          </label>

          <label>
            Message
            <textarea placeholder="Write your message"></textarea>
          </label>

          <button type="button" className="primary-btn" onClick={sendMessage}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
