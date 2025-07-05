import React, { useState, useEffect } from 'react';
import { Card, Table, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import '../styles/VehicleDataDisplay.css';

const VehicleDataDisplay = ({ speedData,  licenseData, helmetData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create a combined dataset for display
  const createCombinedData = () => {
    const combinedData = {};
    
    // Process numeric IDs (from speedData)
    Object.keys(speedData).forEach(id => {
      // Only add if it's a numeric ID, not a license_plate_ prefixed ID
      if (!id.startsWith('license_plate_')) {
        const licensePlateId = `license_plate_${id}`;
        
        combinedData[id] = {
          id,
          speed: speedData[id] || 'N/A',
          licensePlate: licenseData[licensePlateId] || 'N/A',
          helmetDetected: helmetData[id] === true ? 'Yes' : 
                          helmetData[id] === false ? 'No' : 'N/A',
          timestamp: new Date().toLocaleString(), // Dummy timestamp
          location: 'Camera 1' // Dummy location
        };
      }
    });
    
    // Now add any license plate IDs that don't have corresponding numeric IDs
    Object.keys(licenseData).forEach(id => {
      // Check if this is a license_plate_ ID
      if (id.startsWith('license_plate_')) {
        const numericId = id.replace('license_plate_', '');
        
        // Only add if we don't already have this ID (avoid duplicates)
        if (!combinedData[numericId]) {
          combinedData[id] = {
            id,
            speed: speedData[id] || 'N/A',
            licensePlate: licenseData[id] || 'N/A',
            helmetDetected: helmetData[id] === true ? 'Yes' : 
                            helmetData[id] === false ? 'No' : 'N/A',
            timestamp: new Date().toLocaleString(),
            location: 'Camera 1'
          };
        }
      }
    });
    
    return Object.values(combinedData);
  };
  
  const combinedData = createCombinedData();
  
  // Filter data based on search term
  const filteredData = combinedData.filter(vehicle => {
    return (
      vehicle.id.toString().includes(searchTerm) ||
      vehicle.licensePlate.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Animation effect when data updates
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation when data changes
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [speedData, licenseData, helmetData]);
  
  return (
    <Card className="mb-4 traffic-data-card shadow-sm">
      <Card.Header className="bg-dark text-white py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <i className="fas fa-traffic-light me-2"></i>
            <h5 className="mb-0">Traffic Surveillance Records</h5>
            <Badge bg="success" pill className="ms-2">Live</Badge>
          </div>
          <div className="d-flex">
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-light">
                <i className="fas fa-search text-light"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by ID or license plate"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-light bg-dark text-light"
                aria-label="Search records"
              />
              <Button variant="outline-light">
                <i className="fas fa-filter"></i>
              </Button>
            </InputGroup>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {filteredData.length === 0 ? (
          <div className="text-center p-5">
            <i className="fas fa-database text-muted fa-3x mb-3"></i>
            <p>No vehicle data available</p>
            <Button variant="outline-primary" size="sm">Refresh Data</Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0 vehicle-data-table">
              <thead>
                <tr className="bg-light">
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-id-card me-1 text-secondary"></i> Vehicle ID
                    </div>
                  </th>
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-clock me-1 text-secondary"></i> Timestamp
                    </div>
                  </th>
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-car-rear me-1 text-secondary"></i> License Plate
                    </div>
                  </th>
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-gauge-high me-1 text-secondary"></i> Speed (km/h)
                    </div>
                  </th>
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-helmet-safety me-1 text-secondary"></i> Helmet
                    </div>
                  </th>
                  <th className="border-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-location-dot me-1 text-secondary"></i> Location
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(vehicle => (
                  <tr key={vehicle.id} className={animate ? 'row-highlight' : ''}>
                    <td>
                      <Badge bg="light" text="dark" className="me-2">{vehicle.id}</Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {vehicle.timestamp}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="license-plate">{vehicle.licensePlate}</span>
                        {vehicle.id.toString().startsWith('license_plate_') ? null : (
                          <div className="small text-muted mt-1">
                            <i className="fas fa-link me-1"></i>
                            From: license_plate_{vehicle.id}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge 
                        bg={vehicle.speed > 40 ? 'danger' : vehicle.speed > 30 ? 'warning' : 'success'} 
                        className="speed-badge"
                      >
                        {vehicle.speed !== 'N/A' ? `${vehicle.speed} km/h` : 'N/A'}
                      </Badge>
                    </td>
                    <td>
                      {vehicle.helmetDetected === 'Yes' ? (
                        <i className="fas fa-check-circle text-success fa-lg"></i>
                      ) : vehicle.helmetDetected === 'No' ? (
                        <i className="fas fa-times-circle text-danger fa-lg"></i>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-video me-2 text-primary"></i>
                        {vehicle.location}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between align-items-center bg-light py-2">
        <div className="text-muted">
          <small>
            <i className="fas fa-filter me-1"></i>
            Showing <strong>{filteredData.length}</strong> of <strong>{combinedData.length}</strong> records
          </small>
        </div>
        <div>
          <Button variant="outline-secondary" size="sm" className="me-2">
            <i className="fas fa-download me-1"></i> Export
          </Button>
          <Button variant="outline-primary" size="sm">
            <i className="fas fa-sync me-1"></i> Refresh
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default VehicleDataDisplay; 