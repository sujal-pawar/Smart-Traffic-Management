import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import '../styles/SystemStatusBar.css';

const SystemStatusBar = ({ 
    notification, 
    systemStatus = { isActive: true, serverOnline: true, cameras: { active: 4, total: 4 } },
    onExport = () => console.log('Export clicked'),
    onSettings = () => console.log('Settings clicked')
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const formattedTime = currentTime.toLocaleTimeString();
    const formattedDate = currentTime.toLocaleDateString(undefined, { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    return (
        <Card className="mb-4 shadow-sm status-bar">
            <Card.Body className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center flex-wrap">
                    {/* Status indicators */}
                    <Badge bg={systemStatus.isActive ? "success" : "danger"} pill className="d-flex align-items-center me-2 p-2">
                        <i className={`fas fa-${systemStatus.isActive ? 'circle-check' : 'circle-xmark'} me-1`}></i> 
                        {systemStatus.isActive ? "System Active" : "System Inactive"}
                    </Badge>
                    
                    <Badge bg={systemStatus.serverOnline ? "primary" : "danger"} pill className="d-flex align-items-center me-2 p-2">
                        <i className="fas fa-server me-1"></i> 
                        {systemStatus.serverOnline ? "Server Online" : "Server Offline"}
                    </Badge>
                    
                    <Badge 
                        bg={systemStatus.cameras.active === systemStatus.cameras.total ? "info" : "warning"} 
                        pill 
                        className="d-flex align-items-center me-2 p-2 text-white"
                    >
                        <i className="fas fa-camera me-1"></i> 
                        Cameras: {systemStatus.cameras.active}/{systemStatus.cameras.total}
                    </Badge>
                    
                    {/* Real-time notification if exists */}
                    {notification && (
                        <Badge bg="warning" pill className="d-flex align-items-center p-2 text-dark">
                            <i className="fas fa-bell me-1"></i> {notification}
                        </Badge>
                    )}
                </div>
                
                <div className="d-flex align-items-center">
                    {/* Current time and date */}
                    <div className="time-display me-3 d-none d-md-block text-end">
                        <div className="time fw-bold">{formattedTime}</div>
                        <div className="date small text-muted">{formattedDate}</div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="d-flex">
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={onExport}>
                            <i className="fas fa-download me-1"></i> Export
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={onSettings}>
                            <i className="fas fa-gear me-1"></i> Settings
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SystemStatusBar;
