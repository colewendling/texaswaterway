import React from 'react';
import { Mail, Github, Linkedin, FileText, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Logo and Site Name */}
        <div className="footer-logo-container">
          <img
            src="/logos/logo-white.svg"
            alt="Texas Waterway Logo"
            className="footer-logo"
          />
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-title">Developer</h3>
          <span>cole wendling</span>
          <a href="mailto:cole@wendling.io" className="footer-link">
            <Mail className="footer-icon" />
            cole@wendling.io
          </a>
          <a href="tel:+19403935061" className="footer-link">
            +1-940-393-5061
          </a>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3 className="footer-title">Links</h3>
          <div className="footer-links-row">
            <a
              href="https://github.com/colewendling"
              className="footer-link-circle"
            >
              <Github className="footer-link-icon" />
            </a>
            <a
              href="https://www.linkedin.com/in/colewendling/"
              className="footer-link-circle"
            >
              <Linkedin className="footer-link-icon" />
            </a>
            <a href="https://wendling.io/" className="footer-link-circle">
              <Globe className="footer-link-icon" />
            </a>
            <a href="https://wendling.io/Resume" className="footer-link-circle">
              <FileText className="footer-link-icon" />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3 className="footer-title">Connect</h3>
          <a href="mailto:cole@wendling.io" className="footer-newsletter-link">
            <Mail className="footer-icon" />
            Contact Me
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        Texas Waterway &copy; 2024 - All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
