import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../styles/DashboardStats.css';

// Enhanced stat configuration with more metadata and tooltips
const statConfig = [
  {
    label: 'Total Vehicles',
    valueKey: 'totalVehicles',
    icon: 'fas fa-car-side',
    badgeText: '12%',
    badgeVariant: 'primary',
    iconColor: 'var(--primary-color)',
    trend: 'up',
    colorClass: 'primary',
    description: 'Total number of vehicles detected across all cameras',
    timeframe: 'Past 24 hours',
    detailText: '843 cars, 243 motorcycles, 118 trucks',
  },
  {
    label: 'Average Speed',
    valueKey: 'averageSpeed',
    icon: 'fas fa-gauge-high',
    badgeText: '3%',
    badgeVariant: 'warning',
    iconColor: 'var(--warning-color)',
    trend: 'down',
    suffix: 'km/h',
    colorClass: 'warning',
    description: 'Average speed of all vehicles measured',
    timeframe: 'Past 12 hours',
    detailText: 'Peak: 47 km/h, Min: 8 km/h',
  },
  {
    label: 'Helmet Compliance',
    valueKey: 'helmetCompliance',
    icon: 'fas fa-helmet-safety',
    badgeText: '8%',
    badgeVariant: 'success',
    iconColor: 'var(--success-color)',
    trend: 'up',
    colorClass: 'success',
    description: 'Percentage of two-wheeler riders wearing helmets',
    timeframe: 'Current day',
    detailText: '243 compliant, 37 violations detected',
  },
  {
    label: 'Vehicle Categories',
    valueKey: 'vehicleTypes',
    icon: 'fas fa-truck',
    badgeText: 'All tracked',
    badgeVariant: 'info',
    iconColor: 'var(--secondary-color)',
    isStatic: true,
    colorClass: 'info',
    description: 'Number of different vehicle categories being tracked',
    timeframe: 'System-wide',
    detailText: 'Cars, motorcycles, trucks, buses',
  },
];

const DashboardStats = ({ totalVehicles, averageSpeed, helmetCompliance, vehicleTypes }) => {
  // No longer need expandedStat since we removed click interaction
  const data = { totalVehicles, averageSpeed, helmetCompliance, vehicleTypes };

  // Generate dummy sparkline data
  const generateSparklineData = (trend) => {
    const points = [];
    let lastVal = 50;
    
    for (let i = 0; i < 10; i++) {
      if (trend === 'up') {
        lastVal += Math.random() * 10 - 3; // Trend up but with variation
      } else if (trend === 'down') {
        lastVal += Math.random() * 10 - 7; // Trend down but with variation
      } else {
        lastVal += Math.random() * 10 - 5; // Neutral trend
      }
      lastVal = Math.max(0, Math.min(100, lastVal)); // Keep within 0-100 range
      points.push(lastVal);
    }
    return points;
  };
  
  // Draw mini sparkline
  const renderSparkline = (trend) => {
    const data = generateSparklineData(trend);
    const width = 100;
    const height = 24;
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (val / 100) * height;
      return `${x},${y}`;
    }).join(' ');
    
    const trendColor = 
      trend === 'up' ? '#28a745' : 
      trend === 'down' ? '#dc3545' : 
      '#1976d2';
    
    return (
      <svg width="100%" height={height} className="sparkline" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={trendColor}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Row className="stats-cards g-0 flex-nowrap w-100">
      {statConfig.map((stat, idx) => (
        <Col className="flex-grow-1 flex-shrink-0" key={idx}>
            <div 
              className={`stat-card p-3 border-0 bg-white ${stat.colorClass}`}
              style={{ borderRadius: 0, height: '100%', margin: '0 2px' }}
            >
              <div className="stat-label text-uppercase">{stat.label}</div>
              
              <div className="d-flex justify-content-between align-items-center my-2">
                <div className="stat-value">
                  {data[stat.valueKey]?.toLocaleString?.() ?? data[stat.valueKey]}
                  {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
                </div>
                <div className="card-icon">
                  <i className={stat.icon} style={{ color: stat.iconColor, fontSize: '1.5rem' }}></i>
                </div>
              </div>
              
              {!stat.isStatic && (
                <div className="sparkline-container">
                  {renderSparkline(stat.trend)}
                </div>
              )}
              
              <div className="stat-footer">
                <div className={`trend-badge ${stat.trend || 'neutral'}`}>
                  {stat.isStatic ? (
                    <i className="fas fa-check me-1"></i>
                  ) : (
                    <i className={`fas fa-arrow-${stat.trend} me-1`}></i>
                  )}
                  {stat.badgeText}
                </div>
                <div className="stat-secondary">
                  <i className="far fa-clock me-1"></i>
                  {stat.timeframe}
                </div>
              </div>
            </div>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;
