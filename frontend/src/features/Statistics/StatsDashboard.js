import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../../services/apiService';
import copyText from './copyText';

const StatsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchStats function
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // TODO: Call apiService.getStats()
        // TODO: Update stats state
        const statsResponse = await apiService.getStats();
        setStats(statsResponse);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">{copyText.statsLoading}</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">{copyText.statsErrorPrefix}{error || copyText.statsNoData}</div>
      </div>
    );
  }

  const renderStats = () => {
    if (!stats) return (
      <div className="placeholder">{copyText.statsNoData}</div>
    );

    const fmt = (v) => new Intl.NumberFormat().format(v || 0);

    return (
      <>
        <div className="stat-card primary">
          <div className="stat-label">{copyText.statsLabelTotalPatients}</div>
          <div className="stat-value">{fmt(stats.totalPatients)}</div>
          <div className="stat-description">{copyText.statsDescTotalPatients}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{copyText.statsLabelTotalRecords}</div>
          <div className="stat-value">{fmt(stats.totalRecords)}</div>
          <div className="stat-description">{copyText.statsDescTotalRecords}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{copyText.statsLabelTotalConsents}</div>
          <div className="stat-value">{fmt(stats.totalConsents)}</div>
          <div className="stat-description">{copyText.statsDescTotalConsents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{copyText.statsLabelActiveConsents}</div>
          <div className="stat-value">{fmt(stats.activeConsents)}</div>
          <div className="stat-description">{copyText.statsDescActiveConsents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{copyText.statsLabelPendingConsents}</div>
          <div className="stat-value">{fmt(stats.pendingConsents)}</div>
          <div className="stat-description">{copyText.statsDescPendingConsents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{copyText.statsLabelTransactions}</div>
          <div className="stat-value">{fmt(stats.totalTransactions)}</div>
          <div className="stat-description">{copyText.statsDescTransactions}</div>
        </div>
      </>
    )
  }

  return (
    <div className="stats-dashboard-container">
      <h2>{copyText.statsHeaderTitle}</h2>
      
      {/* TODO: Display statistics in a nice grid layout */}
      {/* Show: totalPatients, totalRecords, totalConsents, activeConsents, pendingConsents, totalTransactions */}
      <div className="stats-grid">
        {renderStats()}
      </div>
    </div>
  );
};

export default StatsDashboard;


