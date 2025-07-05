import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import '../styles/Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <header>
      {/* Main header with logo and title */}
      <Navbar bg="white" expand="lg" className="border-bottom py-2 shadow-sm">
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <div className="logo-container me-2">
              <i className="fas fa-traffic-light fs-4" style={{ color: '#28a745' }}></i>
            </div>
            <div>
              <h1 className="header-title m-0">Smart Traffic Control</h1>
              <small className="text-muted d-none d-md-block">Real-time traffic management</small>
            </div>
          </Navbar.Brand>
          
          <div className="d-flex align-items-center ms-auto">
            {/* System status indicators */}
            <div className="system-status me-3 d-none d-md-flex">
              <Badge bg="success" className="d-flex align-items-center me-2 px-2 py-1">
                <i className="fas fa-circle text-white me-1" style={{ fontSize: '0.5rem' }}></i>
                <span>System</span>
              </Badge>
              <Badge bg="success" className="d-flex align-items-center me-2 px-2 py-1">
                <i className="fas fa-circle text-white me-1" style={{ fontSize: '0.5rem' }}></i>
                <span>Server</span>
              </Badge>
              <Badge bg="warning" className="d-flex align-items-center px-2 py-1">
                <i className="fas fa-circle text-white me-1" style={{ fontSize: '0.5rem' }}></i>
                <span>Cameras 3/4</span>
              </Badge>
            </div>
            
            {/* User menu */}
            <NavDropdown 
              title={
                <div className="d-flex align-items-center">
                  <div className="avatar-circle me-1">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <span className="d-none d-lg-inline">Admin</span>
                </div>
              } 
              align="end"
              id="user-dropdown"
            >
              <NavDropdown.Item href="#">
                <i className="fas fa-user me-2"></i>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={() => setActiveTab('settings')}>
                <i className="fas fa-cog me-2"></i>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">
                <i className="fas fa-sign-out-alt me-2"></i>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        </Container>
      </Navbar>
      
      {/* Navigation bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="py-0">
        <Container fluid>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link 
                href="#analytics" 
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
                className="py-2"
              >
                <i className="fas fa-chart-line me-2"></i>Analytics
              </Nav.Link>
              <Nav.Link 
                href="#surveillance" 
                active={activeTab === 'surveillance'}
                onClick={() => setActiveTab('surveillance')}
                className="py-2"
              >
                <i className="fas fa-video me-2"></i>Surveillance
              </Nav.Link>
              <Nav.Link 
                href="#images" 
                active={activeTab === 'images'}
                onClick={() => setActiveTab('images')}
                className="py-2"
              >
                <i className="fas fa-images me-2"></i>Images
              </Nav.Link>
              
            </Nav>
            
            <div className="d-flex">
              <div className="search-box">
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary">
                    <i className="fas fa-search text-light"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-light"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
