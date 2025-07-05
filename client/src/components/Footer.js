import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const buildDate = new Date().toLocaleDateString();
  const gitHash = 'a7e3f9c'; // Typically this would come from environment variables
  
  return (
    <footer className="app-footer mt-auto">
      <Container fluid>
        <Row className="py-3">
          <Col md={4} className="text-md-start text-center mb-2 mb-md-0">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
              <i className="fas fa-traffic-light me-md-2 mb-2 mb-md-0"></i>
              <div>
                <div className="fw-bold">Smart Traffic Management System</div>
                <small className="text-muted">© {currentYear} STMS Inc. All rights reserved</small>
              </div>
            </div>
          </Col>
          
          <Col md={4} className="text-center mb-2 mb-md-0">
            <div className="d-flex flex-column align-items-center">
              <div className="system-metrics d-flex gap-3">
                <div className="small d-flex align-items-center">
                  <i className="fas fa-server me-1 text-success"></i>
                  <span>API: 32ms</span>
                </div>
                <div className="small d-flex align-items-center">
                  <i className="fas fa-tachometer-alt me-1 text-primary"></i>
                  <span>UI: 28ms</span>
                </div>
              </div>
              <div className="build-info small text-muted mt-1">
                Build {gitHash} ({buildDate})
              </div>
            </div>
          </Col>
          
          <Col md={4} className="text-md-end text-center">
            <div className="d-flex justify-content-center justify-content-md-end">
              <button className="btn btn-sm btn-link text-muted me-2">Privacy Policy</button>
              <button className="btn btn-sm btn-link text-muted me-2">Terms</button>
              <button className="btn btn-sm btn-link text-muted">Documentation</button>
            </div>
            <div className="mt-1">
              <div className="form-check form-switch d-inline-block">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  id="darkModeSwitch" 
                />
                <label className="form-check-label small" htmlFor="darkModeSwitch">
                  <i className="fas fa-moon me-1"></i>
                  Dark mode
                </label>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
