import React from "react";
import "../../styles/privacy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us.</p>
      </header>
      <section className="privacy-content">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly, such as when you create
          an account, place an order, or contact customer support.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          Your information helps us process your orders, improve our services,
          and communicate with you.
        </p>

        <h2>Sharing Your Information</h2>
        <p>
          We do not sell or share your personal information with third parties,
          except as required by law or to provide our services.
        </p>

        <h2>Your Rights</h2>
        <p>
          You can access, update, or delete your personal information by
          visiting your account settings.
        </p>
      </section>
      <footer className="privacy-footer">
        <p>© {new Date().getFullYear()} Belivmart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
