import React, { useEffect, useState, useRef } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Title,
  LinearScale,
  CategoryScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import '../styles/VehicleTypeDistribution.css';

// Register all necessary Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  Title,
  LinearScale,
  CategoryScale
);

const VehicleTypeDistribution = ({ vehicleData }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [isDataReady, setIsDataReady] = useState(false);
  const [activeType, setActiveType] = useState(null);

  // Define vehicle types with their properties
  const vehicleTypes = [
    { name: 'Car', icon: 'fa-car', color: '#1976d2', description: 'Personal vehicles' },
    { name: 'Motorcycle', icon: 'fa-motorcycle', color: '#dc3545', description: '2-wheelers' },
    { name: 'Truck', icon: 'fa-truck', color: '#28a745', description: 'Commercial transport' },
    { name: 'Bus', icon: 'fa-bus', color: '#ffc107', description: 'Public transport' },
    { name: 'Van', icon: 'fa-van-shuttle', color: '#6f42c1', description: 'Multi-purpose' },
    { name: 'Taxi', icon: 'fa-taxi', color: '#fd7e14', description: 'For-hire service' }
  ];

  // Prepare chart data
  useEffect(() => {
    try {
      // If no valid data is provided, use empty values
      if (!vehicleData || typeof vehicleData !== 'object') {
        setIsDataReady(false);
        return;
      }

      // Extract vehicle type labels and data
      const labels = vehicleTypes.map(type => type.name).slice(0, 4); // Only use the first 4 types for real data
      
      // Map the vehicle data to the defined types, using 0 if a type doesn't exist in the data
      const data = vehicleTypes.slice(0, 4).map(type => {
        // Get data for standard types (Car, Motorcycle, Truck, Bus)
        return vehicleData[type.name] || 0;
      });
      
      // Ensure we have at least one of each type to make charts look nicer
      const processedData = data.map(value => Math.max(1, value));
      
      // Verify we have some actual data
      const hasData = processedData.some(value => value > 1);
      
      // Extract colors for the chart
      const backgroundColor = vehicleTypes.slice(0, 4).map(type => type.color);
      const hoverBackgroundColor = vehicleTypes.slice(0, 4).map(type => {
        // Create slightly brighter versions for hover
        const color = type.color;
        return color;
      });
      
      // Update chart data
      const newChartData = {
        labels,
        datasets: [
          {
            data: processedData,
            backgroundColor,
            hoverBackgroundColor,
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 5,
            borderRadius: 0,
            spacing: 2
          }
        ]
      };
      
      setChartData(newChartData);
      setIsDataReady(true);
      
      // Force chart update when data changes
      setTimeout(() => {
        if (chartRef.current) {
          try {
            chartRef.current.update();
          } catch (err) {
            console.error("Error updating chart:", err);
          }
        }
      }, 0);
    } catch (error) {
      console.error("Error processing chart data:", error);
      setIsDataReady(false);
    }
  }, [vehicleData]); // Only re-run when vehicleData changes

  // Calculate total vehicles
  const totalVehicles = chartData.datasets[0].data.reduce((sum, count) => sum + count, 0) || 0;
  
  // Handle hover on vehicle type
  const handleTypeHover = (index) => {
    setActiveType(index !== activeType ? index : null);
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    layout: {
      padding: {
        top: 5,
        bottom: 5
      }
    },
    elements: {
      arc: {
        borderWidth: 2
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        titleFont: {
          weight: 'bold',
          size: 13
        },
        bodyColor: '#555',
        bodyFont: {
          size: 12
        },
        padding: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 4,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, data) => sum + data, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return [
              `${label}: ${value} vehicles`,
              `Percentage: ${percentage}%`
            ];
          },
          labelTextColor: function() {
            return '#333';
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleTypeHover(index);
      }
    }
  };

  // Show placeholder if no vehicle data
  if (!isDataReady || totalVehicles === 0) {
    return (
      <div className="no-data-placeholder">
        <i className="fas fa-car no-data-icon"></i>
        <p>No vehicle data available</p>
        <small>Upload or capture vehicle data to visualize distribution</small>
      </div>
    );
  }

  // Calculate the values for display in the compact grid
  const vehicleDataForGrid = vehicleTypes.map((type, index) => {
    const count = index < chartData.datasets[0].data.length ? chartData.datasets[0].data[index] : 0;
    const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { ...type, count, percentage };
  });

  return (
    <div className="vehicle-chart-container">
      <div className="vehicle-chart-header">
        <h3 className="vehicle-chart-title">
          <i className="fas fa-car me-2" style={{ color: '#1976d2' }}></i>
          Vehicle Types
        </h3>
        <div className="vehicle-chart-actions">
          <button className="vehicle-chart-action" title="Download CSV">
            <i className="fas fa-download"></i>
          </button>
          <button className="vehicle-chart-action" title="View Details">
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
      
      <div className="vehicle-chart-content">
        <div className="chart-area">
          <Doughnut ref={chartRef} data={chartData} options={options} />
          <div className="chart-center-stats">
            <div className="total-count">{totalVehicles}</div>
            <div className="total-label">Total</div>
          </div>
        </div>
        
        <div className="legend-container">
          {chartData.labels.map((label, index) => (
            <div 
              key={label} 
              className="legend-item"
              onMouseEnter={() => handleTypeHover(index)}
              onMouseLeave={() => setActiveType(null)}
              style={{ opacity: activeType === null || activeType === index ? 1 : 0.5 }}
            >
              <div 
                className="legend-color" 
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              ></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        
        <div className="vehicle-type-grid">
          {vehicleDataForGrid.map((vehicle, index) => (
            <div 
              key={vehicle.name} 
              className="vehicle-type-cell"
              style={{ 
                opacity: activeType === null || activeType === index ? 1 : 0.5,
                boxShadow: activeType === index ? `0 0 0 2px ${vehicle.color}, 0 2px 5px rgba(0, 0, 0, 0.1)` : '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={() => handleTypeHover(index)}
              onMouseLeave={() => setActiveType(null)}
            >
              <i className={`fas ${vehicle.icon} vehicle-type-icon`} style={{ color: vehicle.color }}></i>
              <div className="vehicle-type-name">{vehicle.name}</div>
              <div className="vehicle-type-stats">
                <span className="vehicle-type-count">{vehicle.count}</span>
                <span className="vehicle-type-percentage">({vehicle.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeDistribution; 