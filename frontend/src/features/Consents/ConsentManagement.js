import React, { useState, useEffect } from 'react';
import './ConsentManagement.css';
import { apiService } from '../../services/apiService';
import { useWeb3 } from '../../hooks/useWeb3';
import Modal from '../../components/Modal';
import copyText from './copyText';

const ConsentManagement = ({ account }) => {
  const { signMessage } = useWeb3();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    purpose: '',
  });
  const [modalState, setModalState] = useState({ isOpen: false, consent: null, action: null });
  // copy text/constants for labels and messages
  // TODO: Implement fetchConsents function
  useEffect(() => {
    const fetchConsents = async () => {
      setLoading(true);
      try {
       if(!account) {
          setConsents([]);
          setLoading(false);
          return;
        }
        const response = await apiService.getConsents(null, filterStatus);
        setConsents(response.consents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsents();
  }, [filterStatus]);

  // Implement createConsent function
  // This should:
  // 1. Sign a message using signMessage from useWeb3 hook
  // 2. Call apiService.createConsent with the consent data and signature
  // 3. Refresh the consents list
  const handleCreateConsent = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      setLoading(true);

      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;
      const signature = await signMessage(message);

      await apiService.createConsent({
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature,
      });

      setShowCreateForm(false);
      setFormData({ patientId: '', purpose: '' });

      // Refresh list
      const resp = await apiService.getConsents(null, filterStatus);
      setConsents(resp.consents || []);
      setError(null);
    } catch (err) {
      alert('Failed to create consent: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement updateConsentStatus function
  // This should update a consent's status (e.g., from pending to active)
  const handleUpdateStatus = async (consentId, newStatus) => {
    try {
      setLoading(true);
      await apiService.updateConsent(consentId, { status: newStatus });
      const resp = await apiService.getConsents(null, filterStatus);
      setConsents(resp.consents || []);
      setError(null);
    } catch (err) {
      alert('Failed to update consent: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };


  const renderConsents = () => {
    if (!consents || consents.length === 0) {
      return (
        <div className="placeholder">
          <p>{copyText.placeholderNoConsents}</p>
        </div>
      );
    }

    return consents.map((consent) => (
      <div key={consent.id} className="consent-card">
        <div className="consent-header-info">
          <div className="consent-purpose">{consent.purpose}</div>
          <div className={`consent-status ${consent.status}`}>{consent.status}</div>
        </div>

        <div className="consent-details">
          <div className="consent-detail-item"><strong>{copyText.consentPatientLabel}</strong> {consent.patientId}</div>
          <div className="consent-detail-item"><strong>{copyText.consentCreatedLabel}</strong> {new Date(consent.createdAt).toLocaleString()}</div>
          <div className="consent-detail-item"><strong>{copyText.consentWalletLabel}</strong> <span className="consent-wallet">{consent.walletAddress}</span></div>
          <div className="consent-detail-item"><strong>{copyText.consentTxLabel}</strong> <span className="consent-tx-hash">{consent.blockchainTxHash || '—'}</span></div>
        </div>

        <div className="consent-actions">
          {consent.status === 'pending' && (
            <button
            type='button '
              className="action-btn primary"
              onClick={() => setModalState({ isOpen: true, consent, action: 'active' })}
            >
              {copyText.actionActivate}
            </button>
          )}

          {consent.status === 'active' && (
            <button
            type='button'
              className="action-btn"
              onClick={() => setModalState({ isOpen: true, consent, action: 'revoked' })}
            >
              {copyText.actionRevoke}
            </button>
          )}
        </div>
      </div>
    ));
  }

  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">{copyText.loadingConsents}</div>
      </div>
    );
  }

   if (error) {
    return (
      <div className="consent-management-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="consent-management-container">
      <div className="consent-header">
        <h2>{copyText.consentHeaderTitle}</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account}
        >
          {showCreateForm ? copyText.createBtnCancel : copyText.createBtnCreate}
        </button>
      </div>

      {!account && (
        <div className="warning">{copyText.walletWarning}</div>
      )}

      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>{copyText.createFormTitle}</h3>
          <form onSubmit={handleCreateConsent}>
            <div className="form-group">
              <label>{copyText.formLabelPatientId}</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                placeholder={copyText.formLabelPatientIdPlaceholder}
              />
            </div>
            <div className="form-group">
              <label>{copyText.formLabelPurpose}</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              >
                <option value="">{copyText.purposeSelectPlaceholder}</option>
                <option value="Research Study Participation">{copyText.purposeResearchStudy}</option>
                <option value="Data Sharing with Research Institution">{copyText.purposeDataSharing}</option>
                <option value="Third-Party Analytics Access">{copyText.purposeAnalytics}</option>
                <option value="Insurance Provider Access">{copyText.purposeInsurance}</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">
              {copyText.submitCreate}
            </button>
          </form>
        </div>
      )}

      <div className="consent-filters">
        <button
          className={!filterStatus ? 'active' : ''}
          onClick={() => setFilterStatus(null)}
        >
          {copyText.filterAll}
        </button>
        <button
          className={filterStatus === 'active' ? 'active' : ''}
          onClick={() => setFilterStatus('active')}
        >
          {copyText.filterActive}
        </button>
        <button
          className={filterStatus === 'pending' ? 'active' : ''}
          onClick={() => setFilterStatus('pending')}
        >
          {copyText.filterPending}
        </button>
        <button
          className={filterStatus === 'revoked' ? 'active' : ''}
          onClick={() => setFilterStatus('revoked')}
        >
          {copyText.filterRevoked}
        </button>
      </div>

      {/* TODO: Display consents list */}
      <div className="consents-list">
        {/* Your implementation here */}
        {/* Map through consents and display them */}
        {/* Show: patientId, purpose, status, createdAt, blockchainTxHash */}
        {/* Add buttons to update status for pending consents */}
        <div className="placeholder">
          {renderConsents()}
        </div>
      </div>
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.action === 'active' ? copyText.modalActivateTitle : copyText.modalRevokeTitle}
        onClose={() => setModalState({ isOpen: false, consent: null, action: null })}
        onConfirm={async () => {
          if (!modalState.consent) return;
          await handleUpdateStatus(modalState.consent.id, modalState.action);
          setModalState({ isOpen: false, consent: null, action: null });
        }}
        confirmText={modalState.action === 'active' ? 'Activate' : 'Revoke'}
        cancelText={copyText.modalCancelText}
      >
        <p>{copyText.modalConfirmBody(modalState.action, modalState.consent?.patientId, modalState.consent?.purpose)}</p>
      </Modal>
    </div>
  );
};

export default ConsentManagement;


