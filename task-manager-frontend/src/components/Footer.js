// src/components/Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>About Us</h5>
            <p>Learn more about our task management system and how it can help you stay organized.</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Contact</h5>
            <p>Email: support@taskmanagement.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <a href="#" className="text-white me-2">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="text-white me-2">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-white">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
        <hr className="bg-white" />
        <p className="mb-0">&copy; 2023 Task Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;