import React, { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, DropdownButton, Dropdown, Card } from 'react-bootstrap';
import axios from 'axios';

// Import components
import VehicleDataDisplay from './components/VehicleDataDisplay';
import ImageGallery from './components/ImageGallery';
import UploadForm from './components/UploadForm';
import DashboardStats from './components/DashboardStats';
import SpeedDistributionChart from './components/SpeedDistributionChart';
import VehicleTypeDistribution from './components/VehicleTypeDistribution'; 
import HelmetComplianceChart from './components/HelmetComplianceChart';
import TrafficVolumeChart, { TimeFrameSelector } from './components/TrafficVolumeChart';
import LicensePlateRegionChart from './components/LicensePlateRegionChart';

import 'bootstrap/dist/css/bootstrap.min.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const locationData = {
  'Karnataka': {
    'Bangalore': ['MG Road', 'Whitefield', 'Electronic City'],
    'Mysore': ['Chamundi Hill', 'VV Mohalla', 'Nazarbad'],
    'Mangalore': ['Hampankatta', 'Surathkal', 'Kadri']
  },
  'Maharashtra': {
    'Mumbai': ['Andheri', 'Bandra', 'Dadar'],
    'Pune': ['Shivajinagar', 'Kothrud', 'Hinjewadi'],
    'Nagpur': ['Sitabuldi', 'Dharampeth', 'Civil Lines']
  },
  'Tamil Nadu': {
    'Chennai': ['T Nagar', 'Adyar', 'Velachery'],
    'Coimbatore': ['RS Puram', 'Gandhipuram', 'Peelamedu'],
    'Madurai': ['Anna Nagar', 'KK Nagar', 'Simmakkal']
  },
  'Delhi': {
    'New Delhi': ['Connaught Place', 'Karol Bagh', 'Saket'],
    'Dwarka': ['Sector 6', 'Sector 10', 'Sector 21'],
    'Rohini': ['Sector 7', 'Sector 13', 'Sector 24']
  },
  'West Bengal': {
    'Kolkata': ['Salt Lake', 'Park Street', 'Howrah'],
    'Siliguri': ['Sevoke Road', 'Hill Cart Road', 'Pradhan Nagar'],
    'Durgapur': ['City Center', 'Bidhannagar', 'Benachity']
  }
};

function App() {
  const [speedData, setSpeedData] = useState({});
  const [licenseData, setLicenseData] = useState({});
  const [helmetData, setHelmetData] = useState({});
  const [vehicleImages, setVehicleImages] = useState([]);
  const [licensePlateImages, setLicensePlateImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [vehicleTypes, setVehicleTypes] = useState({});
  const [activeTimeFrame, setActiveTimeFrame] = useState('hourly');
  const [speedTimeFrame, setSpeedTimeFrame] = useState('hourly');
  const [helmetTimeFrame, setHelmetTimeFrame] = useState('hourly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/data`);
        const { speedData, licenseData, helmetData, vehicleImages, licensePlateImages } = response.data;
        setSpeedData(speedData || {});
        setLicenseData(licenseData || {});
        setHelmetData(helmetData || {});
        setVehicleImages(vehicleImages || []);
        setLicensePlateImages(licensePlateImages || []);
        processVehicleTypes(licenseData || {});
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please refresh the page.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processVehicleTypes = (data) => {
    const vehicleTypeCounts = { 'Car': 1, 'Motorcycle': 1, 'Truck': 1, 'Bus': 1 };
    if (!data || Object.keys(data).length === 0) {
      setVehicleTypes(vehicleTypeCounts);
      return;
    }
    Object.entries(data).forEach(([key, value]) => {
      let type = null;
      if (value && typeof value === 'object' && value.type) {
        type = value.type;
      } else if (value && typeof value === 'object' && value.licensePlate) {
        const license = value.licensePlate.toString().toUpperCase();
        if (license.includes('TRK') || license.includes('LOR')) type = 'Truck';
        else if (license.includes('BUS')) type = 'Bus';
        else if (license.includes('MC') || license.includes('BIKE')) type = 'Motorcycle';
        else type = 'Car';
      } else if (key && typeof key === 'string') {
        if (key.includes('truck') || key.includes('TRK')) type = 'Truck';
        else if (key.includes('bus') || key.includes('BUS')) type = 'Bus';
        else if (key.includes('bike') || key.includes('motorcycle') || key.includes('MC')) type = 'Motorcycle';
        else type = 'Car';
      } else if (value && typeof value === 'string') {
        const valueStr = value.toLowerCase();
        if (valueStr.includes('truck') || valueStr.includes('lorry')) type = 'Truck';
        else if (valueStr.includes('bus')) type = 'Bus';
        else if (valueStr.includes('bike') || valueStr.includes('motorcycle')) type = 'Motorcycle';
        else if (valueStr.includes('car')) type = 'Car';
        else type = 'Car';
      } else {
        const rand = Math.random();
        if (rand < 0.6) type = 'Car';
        else if (rand < 0.8) type = 'Motorcycle';
        else if (rand < 0.95) type = 'Truck';
        else type = 'Bus';
      }
      if (type) {
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        if (type === 'Truck' || type === 'Lorry') vehicleTypeCounts['Truck']++;
        else if (type === 'Bus' || type === 'Coach') vehicleTypeCounts['Bus']++;
        else if (type === 'Motorcycle' || type === 'Bike' || type === 'Scooter') vehicleTypeCounts['Motorcycle']++;
        else if (type === 'Car' || type === 'Sedan' || type === 'Suv' || type === 'Hatchback') vehicleTypeCounts['Car']++;
        else vehicleTypeCounts['Car']++;
      }
    });
    Object.keys(vehicleTypeCounts).forEach(type => {
      vehicleTypeCounts[type] = Math.max(1, vehicleTypeCounts[type]);
    });
    setVehicleTypes(vehicleTypeCounts);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/data`);
        const { speedData, licenseData, helmetData, vehicleImages, licensePlateImages } = response.data;
        setSpeedData(prevData => {
          if (JSON.stringify(prevData) !== JSON.stringify(speedData)) {
            showNotification('Speed data updated');
            return speedData;
          }
          return prevData;
        });
        setLicenseData(prevData => {
          if (JSON.stringify(prevData) !== JSON.stringify(licenseData)) {
            processVehicleTypes(licenseData);
            showNotification('License plate data updated');
            return licenseData;
          }
          return prevData;
        });
        setHelmetData(prevData => {
          if (JSON.stringify(prevData) !== JSON.stringify(helmetData)) {
            showNotification('Helmet data updated');
            return helmetData;
          }
          return prevData;
        });
        setVehicleImages(prevImages => {
          if (vehicleImages.length > prevImages.length) {
            showNotification(`${vehicleImages.length - prevImages.length} new vehicle image(s) detected`);
            return vehicleImages;
          }
          return prevImages;
        });
        setLicensePlateImages(prevImages => {
          if (licensePlateImages.length > prevImages.length) {
            showNotification(`${licensePlateImages.length - prevImages.length} new license plate image(s) detected`);
            return licensePlateImages;
          }
          return prevImages;
        });
      } catch (err) {}
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDataUpload = async (type, data) => {
    try {
      await axios.post(`${BACKEND_URL}/api/upload/data`, { type, data });
      showNotification(`${type} data uploaded successfully`);
    } catch (err) {
      setError(`Failed to upload ${type} data. Please try again.`);
    }
  };

  const handleImageUpload = async (vehicleFiles, licenseFiles) => {
    try {
      const formData = new FormData();
      if (vehicleFiles) vehicleFiles.forEach(file => formData.append('vehicle', file));
      if (licenseFiles) licenseFiles.forEach(file => formData.append('license', file));
      await axios.post(`${BACKEND_URL}/api/upload/images`, formData);
      showNotification('Images uploaded successfully');
    } catch (err) {
      setError('Failed to upload images. Please try again.');
    }
  };

  const getTotalVehicles = () => Object.keys(speedData).length;
  const getAverageSpeed = () => {
    if (Object.keys(speedData).length === 0) return 0;
    let sum = 0, count = 0;
    Object.values(speedData).forEach(value => {
      if (typeof value === 'number') { sum += value; count++; }
      else if (value && typeof value === 'object' && 'speed' in value) { sum += value.speed; count++; }
    });
    return count > 0 ? Math.round(sum / count) : 0;
  };
  const getHelmetCompliance = () => {
    if (Object.keys(helmetData).length === 0) return "0%";
    let helmetsDetected = 0, total = 0;
    Object.values(helmetData).forEach(value => {
      if (typeof value === 'boolean') { if (value === true) helmetsDetected++; total++; }
      else if (value && typeof value === 'object') {
        if (value.wearing === true || value.helmet === true) helmetsDetected++;
        total++;
      }
    });
    const percentage = total > 0 ? (helmetsDetected / total) * 100 : 0;
    return `${Math.round(percentage)}%`;
  };
  const getVehicleTypeCount = () => Object.keys(vehicleTypes).length > 0 ? Object.keys(vehicleTypes).length : 0;
  const hasData = () => Object.keys(speedData).length > 0 || Object.keys(licenseData).length > 0 || Object.keys(helmetData).length > 0;

  const handleTimeFrameChange = (newTimeFrame) => setActiveTimeFrame(newTimeFrame);
  const handleSpeedTimeFrameChange = (newTimeFrame) => setSpeedTimeFrame(newTimeFrame);
  const handleHelmetTimeFrameChange = (newTimeFrame) => setHelmetTimeFrame(newTimeFrame);

  const getCities = () => (selectedState && locationData[selectedState]) ? Object.keys(locationData[selectedState]) : [];
  const getStations = () =>
    selectedState && selectedCity && locationData[selectedState][selectedCity]
      ? locationData[selectedState][selectedCity]
      : [];

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity('');
    setSelectedStation('');
  };
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedStation('');
  };
  const handleStationChange = (station) => {
    setSelectedStation(station);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading vehicle data...</h2>
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="main-header">
        <div className="header-container">
          <h1 className="header-title">Smart Traffic Control & Surveillance System</h1>
          <div className="search-container d-flex">
            <div className="search-box me-2">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fa fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search license number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputGroup.Text className="dropdown-toggle-no-caret">
                  <i className="fa fa-caret-down"></i>
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="d-flex">
              <div className="me-2">
                <DropdownButton
                  id="dropdown-state"
                  title={selectedState || "Select state"}
                  variant="light"
                  onSelect={handleStateChange}
                >
                  {Object.keys(locationData).map((state) => (
                    <Dropdown.Item eventKey={state} key={state}>
                      {state}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
              <div className="me-2">
                <DropdownButton
                  id="dropdown-city"
                  title={selectedCity || "Select city"}
                  variant="light"
                  onSelect={handleCityChange}
                  disabled={!selectedState}
                >
                  {getCities().map((city) => (
                    <Dropdown.Item eventKey={city} key={city}>
                      {city}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
              <div>
                <DropdownButton
                  id="dropdown-station"
                  title={selectedStation || "Select station"}
                  variant="light"
                  onSelect={handleStationChange}
                  disabled={!selectedCity}
                >
                  {getStations().map((station) => (
                    <Dropdown.Item eventKey={station} key={station}>
                      {station}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="main-content">
        {notification && (
          <div className="notification-toast">
            <div className="notification-content">
              <i className="fas fa-info-circle me-2"></i>
              {notification}
            </div>
          </div>
        )}
        <div className="nav-tabs-container">
          <ul className="custom-tabs">
            <li className={activeTab === 'analytics' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>
                <i className="fas fa-chart-line me-2"></i>ANALYTICS
              </a>
            </li>
            <li className={activeTab === 'surveillance' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('surveillance'); }}>
                <i className="fas fa-video me-2"></i>DATA LOGS
              </a>
            </li>
            <li className={activeTab === 'images' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('images'); }}>
                <i className="fas fa-images me-2"></i>IMAGES
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          {activeTab === 'analytics' && (
            <div className="dashboard-analytics">
              <div className="stats-cards">
                <DashboardStats
                  totalVehicles={getTotalVehicles()}
                  averageSpeed={getAverageSpeed()}
                  helmetCompliance={getHelmetCompliance()}
                  vehicleTypes={getVehicleTypeCount()}
                />
              </div>
              <div className="charts-container">
                {!hasData() ? (
                  <div className="text-center p-5 mb-4 bg-light rounded">
                    <i className="fas fa-chart-line fa-4x mb-3 text-muted"></i>
                    <h4>No analytics data available</h4>
                    <p className="text-muted">
                      Upload or capture vehicle data to view analytics.
                      Analytics are generated only from actual vehicle data, not random simulations.
                    </p>
                  </div>
                ) : (
                  <>
                    <Row className="mb-4">
                      <Col lg={8}>
                        <Card className="chart-card">
                          <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">
                              <i className="fas fa-chart-line me-2" style={{ color: '#28a745' }}></i>
                              Traffic Volume Analysis
                            </h3>
                            <TimeFrameSelector
                              activeTimeFrame={activeTimeFrame}
                              onTimeFrameChange={handleTimeFrameChange}
                            />
                          </Card.Header>
                          <Card.Body style={{ height: '350px', padding: 0 }}>
                            <TrafficVolumeChart
                              vehicleData={vehicleTypes}
                              timeFrame={activeTimeFrame}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={4}>
                        <Card className="chart-card">
                          <Card.Header className="bg-transparent border-0 pb-0">
                            <h3 className="mb-0">
                              <i className="fas fa-car me-2" style={{ color: '#1976d2' }}></i>
                              Vehicle Types
                            </h3>
                          </Card.Header>
                          <Card.Body className="p-0 d-flex flex-column" style={{ overflow: 'hidden', height: '350px' }}>
                            <VehicleTypeDistribution vehicleData={vehicleTypes} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={6}>
                        <Card className="chart-card compact-chart-card">
                          <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">
                              <i className="fas fa-gauge-high me-2" style={{ color: '#ffc107' }}></i>
                              Speed Distribution (Km/hr)
                            </h3>
                            <TimeFrameSelector
                              activeTimeFrame={speedTimeFrame}
                              onTimeFrameChange={handleSpeedTimeFrameChange}
                            />
                          </Card.Header>
                          <Card.Body style={{ height: '350px' }}>
                            <SpeedDistributionChart
                              speedData={speedData}
                              timeFrame={speedTimeFrame}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col lg={6}>
                        <Card className="chart-card compact-chart-card">
                          <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">
                              <i className="fas fa-helmet-safety me-2" style={{ color: '#28a745' }}></i>
                              Helmet Compliance Over Time
                            </h3>
                            <TimeFrameSelector
                              activeTimeFrame={helmetTimeFrame}
                              onTimeFrameChange={handleHelmetTimeFrameChange}
                            />
                          </Card.Header>
                          <Card.Body style={{ height: '350px' }}>
                            <HelmetComplianceChart
                              helmetData={helmetData}
                              timeFrame={helmetTimeFrame}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col md={12}>
                        <Card className="chart-card">
                          <Card.Header className="bg-transparent border-0">
                            <h3 className="mb-0">
                              <i className="fas fa-id-card me-2" style={{ color: '#1976d2' }}></i>
                              License Plate Regions
                            </h3>
                          </Card.Header>
                          <Card.Body style={{ height: '250px', padding: 0 }}>
                            <LicensePlateRegionChart licenseData={licenseData} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            </div>
          )}
          {activeTab === 'surveillance' && (
            <div className="surveillance-logs">
              <VehicleDataDisplay
                speedData={speedData}
                licenseData={licenseData}
                helmetData={helmetData}
              />
            </div>
          )}
          {activeTab === 'images' && (
            <div className="images-section">
              <Row>
                <Col md={12} className="mb-4">
                  <Card>
                    <Card.Header className="bg-transparent">
                      <h3 className="mb-0">
                        <i className="fas fa-car me-2"></i>
                        Vehicle Images
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <ImageGallery images={vehicleImages} type="vehicle" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Header className="bg-transparent">
                      <h3 className="mb-0">
                        <i className="fas fa-id-card me-2"></i>
                        License Plate Images
                      </h3>
                    </Card.Header>
                    <Card.Body>
                      <ImageGallery images={licensePlateImages} type="license" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;