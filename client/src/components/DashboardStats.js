import React from 'react';
import { Row, Col } from 'react-bootstrap';

const statConfig = [
  {
    label: 'Total Vehicles',
    valueKey: 'totalVehicles',
    icon: 'fas fa-car-side',
    badgeText: '12%',
    badgeVariant: 'primary',
    iconColor: 'var(--primary-color)',
    trend: 'up',
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
  },
  {
    label: 'Helmet Compliance',
    valueKey: 'helmetCompliance',
    icon: 'fas fa-helmet-safety',
    badgeText: '8%',
    badgeVariant: 'success',
    iconColor: 'var(--success-color)',
    trend: 'up',
  },
  {
    label: 'Vehicle Categories',
    valueKey: 'vehicleTypes',
    icon: 'fas fa-truck',
    badgeText: 'All tracked',
    badgeVariant: 'info',
    iconColor: 'var(--secondary-color)',
    isStatic: true,
  },
];

const DashboardStats = ({ totalVehicles, averageSpeed, helmetCompliance, vehicleTypes }) => {
  const data = { totalVehicles, averageSpeed, helmetCompliance, vehicleTypes };

  return (
    <Row className="stats-cards g-3">
      {statConfig.map((stat, idx) => (
        <Col xs={12} sm={6} xl={3} key={idx}>
          <div className={`stat-card p-3 rounded-4 shadow-sm h-100 border border-light bg-white hover-shadow`}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <p className="mb-1 text-muted small">{stat.label}</p>
                <h4 className="fw-semibold">
                  {data[stat.valueKey]?.toLocaleString?.() ?? data[stat.valueKey]}
                  {stat.suffix && <span className="fs-6 ms-1 text-muted">{stat.suffix}</span>}
                </h4>
              </div>
              <div className="card-icon fs-3">
                <i className={stat.icon} style={{ color: stat.iconColor }}></i>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className={`badge bg-light text-${stat.badgeVariant}`}>
                {stat.isStatic ? (
                  <i className="fas fa-check me-1"></i>
                ) : (
                  <i className={`fas fa-arrow-${stat.trend} me-1`}></i>
                )}
                {stat.badgeText}
              </span>
              {!stat.isStatic && (
                <span className="text-muted ms-2 small">vs last period</span>
              )}
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;
