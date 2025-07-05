import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, BarController, BarElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import '../styles/TrafficVolumeChart.css';
import { Card, Badge } from 'react-bootstrap';

// ChartJS registration
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarController,
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

// TimeFrame Selector Component
export const TimeFrameSelector = ({ activeTimeFrame, onTimeFrameChange }) => {
  const timeFrames = [
    { id: 'hourly', label: 'H', fullLabel: 'Hourly' },
    { id: 'daily', label: 'D', fullLabel: 'Daily' },
    { id: 'weekly', label: 'W', fullLabel: 'Weekly' },
    { id: 'monthly', label: 'M', fullLabel: 'Monthly' },
    { id: 'yearly', label: 'Y', fullLabel: 'Yearly' }
  ];

  return (
    <div className="time-frame-selector" role="toolbar" aria-label="Time frame selection">
      {timeFrames.map(frame => (
        <button
          key={frame.id}
          type="button"
          className={`time-frame-button ${activeTimeFrame === frame.id ? 'active' : ''}`}
          onClick={() => onTimeFrameChange(frame.id)}
          aria-pressed={activeTimeFrame === frame.id}
          title={frame.fullLabel}
        >
          {frame.label}
          <span className="visually-hidden">{frame.fullLabel}</span>
        </button>
      ))}
    </div>
  );
};

const TrafficVolumeChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [volumeStats, setVolumeStats] = useState({
    totalVehicles: 0,
    peakPeriod: '',
    averagePeriod: 0
  });
  const [activeTimeFrame, setActiveTimeFrame] = useState('hourly');
  const chartRef = useRef(null);

  const getXAxisTitle = () => {
    switch (activeTimeFrame) {
      case 'hourly': return 'Time of Day';
      case 'daily': return 'Day of Week';
      case 'weekly': return 'Week';
      case 'monthly': return 'Month';
      case 'yearly': return 'Year';
      default: return 'Time';
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      enabled: false // Disable hover interactions
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false // Disable tooltips completely
      },
      annotation: {
        annotations: {
          peakBox: {
            type: 'box',
            xMin: -0.5,
            xMax: 0.5,
            yMin: 0,
            yMax: 'max',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: 'transparent',
            drawTime: 'beforeDraw',
            display: volumeStats.peakPeriod !== ''
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        title: {
          display: true,
          text: getXAxisTitle(),
          font: { weight: 'bold', size: 13 },
          color: '#555',
          padding: { top: 10 }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          tickLength: 8
        },
        ticks: {
          font: { size: 11 },
          color: '#666',
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Vehicles',
          font: { weight: 'bold', size: 13 },
          color: '#555'
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 11 },
          color: '#666',
          callback: (value) => value.toLocaleString()
        }
      }
    }
  };

  const generateHourlyData = () => {
    const labels = [...Array(24).keys()].map(h => `${String(h).padStart(2, '0')}:00`);
    const data = labels.map((_, h) =>
      h >= 6 && h <= 9 ? Math.random() * 30 + 70 :
      h >= 16 && h <= 19 ? Math.random() * 40 + 60 :
      h >= 10 && h <= 15 ? Math.random() * 30 + 40 :
      Math.random() * 20 + 10
    ).map(Math.floor);

    const total = data.reduce((a, b) => a + b, 0);
    const peakIndex = data.indexOf(Math.max(...data));

    setVolumeStats({
      totalVehicles: total,
      peakPeriod: labels[peakIndex],
      averagePeriod: Math.round(total / data.length)
    });

    return { labels, data };
  };

  const generateDailyData = () => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = labels.map(day =>
      ['Mon', 'Fri'].includes(day) ? Math.random() * 200 + 900 :
      ['Sat', 'Sun'].includes(day) ? Math.random() * 300 + 500 :
      Math.random() * 150 + 800
    ).map(Math.floor);

    const total = data.reduce((a, b) => a + b, 0);
    const peakIndex = data.indexOf(Math.max(...data));

    setVolumeStats({
      totalVehicles: total,
      peakPeriod: labels[peakIndex],
      averagePeriod: Math.round(total / data.length)
    });

    return { labels, data };
  };

  const generateWeeklyData = () => {
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const data = labels.map((_, i) => Math.floor(5000 + Math.random() * 1000 + i * 200));

    const total = data.reduce((a, b) => a + b, 0);
    const peakIndex = data.indexOf(Math.max(...data));

    setVolumeStats({
      totalVehicles: total,
      peakPeriod: labels[peakIndex],
      averagePeriod: Math.round(total / data.length)
    });

    return { labels, data };
  };

  const generateMonthlyData = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = labels.map(month =>
      ['Jun', 'Jul', 'Aug'].includes(month) ? Math.random() * 5000 + 25000 :
      ['Dec', 'Jan', 'Feb'].includes(month) ? Math.random() * 5000 + 15000 :
      Math.random() * 5000 + 20000
    ).map(Math.floor);

    const total = data.reduce((a, b) => a + b, 0);
    const peakIndex = data.indexOf(Math.max(...data));

    setVolumeStats({
      totalVehicles: total,
      peakPeriod: labels[peakIndex],
      averagePeriod: Math.round(total / data.length)
    });

    return { labels, data };
  };

  const generateYearlyData = () => {
    const year = new Date().getFullYear();
    const labels = Array.from({ length: 5 }, (_, i) => (year - 4 + i).toString());
    const data = labels.map((_, i) => Math.floor(200000 + i * 50000 + Math.random() * 30000));

    const total = data.reduce((a, b) => a + b, 0);
    const peakIndex = data.indexOf(Math.max(...data));

    setVolumeStats({
      totalVehicles: total,
      peakPeriod: labels[peakIndex],
      averagePeriod: Math.round(total / data.length)
    });

    return { labels, data };
  };

  const getChartData = () => {
    const map = {
      hourly: generateHourlyData,
      daily: generateDailyData,
      weekly: generateWeeklyData,
      monthly: generateMonthlyData,
      yearly: generateYearlyData
    };
    const { labels, data } = (map[activeTimeFrame] || generateHourlyData)();

    // Find peak period for highlighting
    const peakIndex = data.indexOf(Math.max(...data));
    
    // Create background colors array to highlight peak periods
    const backgroundColors = data.map((_, index) => {
      // Peak periods get a slightly more intense color
      if (index === peakIndex) {
        return 'rgba(40, 167, 69, 0.25)';
      }
      
      // If hourly data, highlight rush hour periods
      if (activeTimeFrame === 'hourly') {
        if ((index >= 6 && index <= 9) || (index >= 16 && index <= 19)) {
          return 'rgba(40, 167, 69, 0.15)';
        }
      }
      
      return 'rgba(40, 167, 69, 0.08)';
    });
    
    // Create point radii array to emphasize important points
    const pointRadii = data.map((_, index) => {
      return index === peakIndex ? 6 : 4;
    });
    
    // Create point hover radii
    const pointHoverRadii = pointRadii.map(r => r + 2);
    
    return {
      labels,
      datasets: [
        {
          label: 'Vehicles',
          data,
          borderColor: '#28a745',
          backgroundColor: backgroundColors,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#28a745',
          pointBorderColor: '#fff',
          pointRadius: pointRadii,
          pointHoverRadius: pointHoverRadii,
          borderWidth: 2,
          pointStyle: 'circle',
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: 'white'
        }
      ]
    };
  };

  useEffect(() => {
    const data = getChartData();
    setChartData(data);
  }, [activeTimeFrame]);

  return (
    <div className="traffic-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
          <h5 className="mb-0 fw-semibold d-flex align-items-center">
            <i className="fas fa-chart-line me-2 text-success"></i>
            Traffic Volume
            <Badge bg="success" pill className="ms-2 fs-6" title="Real-time data">
              Live
            </Badge>
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Vehicle counts across {getXAxisTitle().toLowerCase()}
          </p>
        </div>
        <TimeFrameSelector activeTimeFrame={activeTimeFrame} onTimeFrameChange={setActiveTimeFrame} />
      </div>

      <div className="traffic-stats mb-4">
        <div className="stat-box flex-fill text-center p-3">
          <p className="mb-1 small"><i className="fas fa-car-side me-1"></i>Total Vehicles</p>
          <h5 className="mb-0 fw-semibold">{volumeStats.totalVehicles.toLocaleString()}</h5>
        </div>
        <div className="stat-box flex-fill text-center p-3 peak-period">
          <p className="mb-1 small"><i className="fas fa-bolt me-1"></i>Peak {getXAxisTitle()}</p>
          <h5 className="mb-0 fw-semibold">{volumeStats.peakPeriod}</h5>
        </div>
        <div className="stat-box flex-fill text-center p-3">
          <p className="mb-1 small"><i className="fas fa-calculator me-1"></i>Avg / {getXAxisTitle()}</p>
          <h5 className="mb-0 fw-semibold">{volumeStats.averagePeriod.toLocaleString()}</h5>
        </div>
      </div>

      <div className="position-relative" style={{ height: '360px', width: '100%' }}>
        <Line ref={chartRef} data={chartData} options={options} />
        
        {/* Zoom/reset controls */}
        <div className="chart-controls position-absolute top-0 end-0 p-2 d-flex">
          <button 
            className="btn btn-sm btn-outline-secondary me-1" 
            title="Zoom In"
            onClick={() => {
              // In a real implementation, this would trigger chart zoom
              console.log('Zoom in clicked');
            }}
          >
            <i className="fas fa-search-plus"></i>
            <span className="visually-hidden">Zoom In</span>
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            title="Reset Zoom"
            onClick={() => {
              // In a real implementation, this would reset chart zoom
              console.log('Reset zoom clicked');
            }}
          >
            <i className="fas fa-redo-alt"></i>
            <span className="visually-hidden">Reset Zoom</span>
          </button>
        </div>
      </div>
      
      {/* Download options */}
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-sm btn-outline-secondary" title="Export data to CSV">
          <i className="fas fa-download me-1"></i>
          Export
        </button>
      </div>
    </div>
  );
};

export default TrafficVolumeChart;
