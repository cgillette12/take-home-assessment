import React, { useState, useEffect, useMemo } from 'react';
import './TransactionHistory.css';
import { apiService } from '../../services/apiService';
import { formatDate } from '../utils';
import copyText from './copyText';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchTransactions function
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try { 
        const response = await apiService.getTransactions(account || null, 20);
        setTransactions(response.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);



  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const renderTransactions = () => {
    if (!transactions || transactions.length === 0) {
      return (
        <div className="placeholder">
          <p>{copyText.placeholderNoTransactions}</p>
        </div>
      );
    }
    return transactions.map((t) => (
      <div key={t.id} className="transaction-card">
        <div className="transaction-header-info">
          <div className={`transaction-type ${t.type}`}>{t.type.replace('_', ' ')}</div>
          <div className={`transaction-status ${t.status}`}>{t.status}</div>
        </div>

        <div className="transaction-details">
          <div className="transaction-detail-item">
            <div className="transaction-detail-label">{copyText.labelFrom}</div>
            <div className="transaction-detail-value address" title={t.from}>{formatAddress(t.from)}</div>
          </div>

          <div className="transaction-detail-item">
            <div className="transaction-detail-label">{copyText.labelTo}</div>
            <div className="transaction-detail-value address" title={t.to}>{formatAddress(t.to)}</div>
          </div>

          <div className="transaction-detail-item">
            <div className="transaction-detail-label">{copyText.labelAmount}</div>
            <div className="transaction-detail-value transaction-amount">{t.amount} {t.currency}</div>
          </div>

          <div className="transaction-detail-item">
            <div className="transaction-detail-label">{copyText.labelTxHash}</div>
            <div className="transaction-detail-value hash" title={t.blockchainTxHash}>{t.blockchainTxHash || '—'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="transaction-amount">{t.amount} {t.currency}</div>
          <div className="transaction-timestamp">{formatDate(t.timestamp)}</div>
        </div>
      </div>
    ));
  }



  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">{copyText.loadingTransactions}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>{copyText.headerTitle}</h2>
        {account && (
          <div className="wallet-filter">
            {copyText.walletFilterPrefix} {formatAddress(account)}
          </div>
        )}
      </div>

      {/* TODO: Display transactions list */}
      {/* Show: type, from, to, amount, currency, status, timestamp, blockchainTxHash */}
      <div className="transactions-list">
        {renderTransactions()}
      </div>
    </div>
  );
};

export default TransactionHistory;


