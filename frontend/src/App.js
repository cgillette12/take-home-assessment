import React, { useState, useEffect } from 'react';
import './App.css';
import WalletConnection from './components/WalletConnection';
import PatientList from './features/Patients/PatientList';
import PatientDetail from './features/Patients/PatientDetail';
import ConsentManagement from './features/Consents/ConsentManagement';
import TransactionHistory from './features/Transactions/TransactionHistory';
import StatsDashboard from './features/Statistics/StatsDashboard';
import { useWeb3 } from './hooks/useWeb3';
import { apiService } from './services/apiService';

function App() {
  const { account, connectWallet, disconnectWallet, isConnected } = useWeb3();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('patients');

  useEffect(() => {
    // Check if wallet is already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            // Wallet already connected
          }
        });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>AI Health Chains</h1>
          <p className="subtitle">Web3 Healthcare Data Management Platform</p>
        </div>
        <WalletConnection
          account={account}
          isConnected={isConnected}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </header>

      <nav className="App-nav">
        <button
          className={activeTab === 'patients' ? 'active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          Patients
        </button>
        <button
          className={activeTab === 'consents' ? 'active' : ''}
          onClick={() => setActiveTab('consents')}
        >
          Consents
        </button>
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'patients' && (
          <div className="patients-container">
            {selectedPatient ? (
              <PatientDetail
                patientId={selectedPatient}
                onBack={() => setSelectedPatient(null)}
              />
            ) : (
              <PatientList
                onSelectPatient={setSelectedPatient}
              />
            )}
          </div>
        )}

        {activeTab === 'consents' && (
          <ConsentManagement account={account} />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory account={account} />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard />
        )}
      </main>
    </div>
  );
}

export default App;


