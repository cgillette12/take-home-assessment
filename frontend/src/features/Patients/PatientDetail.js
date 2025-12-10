import React, { useState, useEffect } from 'react';
import './PatientDetail.css';
import { apiService } from '../../services/apiService';
import copyText from './copyText';
import { formatDate } from '../utils';

const PatientDetail = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchPatientData function
  // This should fetch both patient details and their records
  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const patientResponse = await apiService.getPatient(patientId);
        const recordsResponse = await apiService.getPatientRecords(patientId);
        setPatient(patientResponse || null);
        setRecords(recordsResponse.records || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">{copyText.patientDetailLoading}</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">{copyText.patientDetailErrorPrefix}{error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">{copyText.patientDetailBack}</button>
      </div>
    );
  }

  const renderPatientInfo = () => {
    if (!patient) {
      return (
        <div className="placeholder">
          <p>{copyText.patientDetailPlaceholderNoInfo}</p>
        </div>
      );
    }
    return (
      <div className="patient-info-grid">
        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelName}</div>
          <div className="info-value">{patient.name || '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelEmail}</div>
          <div className="info-value">{patient.email || '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelDOB}</div>
          <div className="info-value">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelGender}</div>
          <div className="info-value">{patient.gender || '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelPhone}</div>
          <div className="info-value">{patient.phone || '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelAddress}</div>
          <div className="info-value">{patient.address || '—'}</div>
        </div>

        <div className="info-item">
          <div className="info-label">{copyText.patientDetailInfoLabelWallet}</div>
          <div className="info-value wallet">{patient.walletAddress || '—'}</div>
        </div>
      </div>
    );
  }

  const getRecordTypeClass = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('diagnostic')) return 'diagnostic';
    if (t.includes('treatment')) return 'treatment';
    if (t.includes('lab')) return 'lab';
    return '';
  }

 

  const renderRecords = () => {
    if (!records || records.length === 0) {
      return <div className="placeholder">{copyText.patientRecordsNone}</div>;
    }

    return (
      <div className="records-list">
        {records.map((r) => (
          <div key={r.id} className="record-card">
            <div className="record-header">
              <div>
                <div className="record-title">{r.title}</div>
                <div className={`record-type ${getRecordTypeClass(r.type)}`}>{r.type}</div>
              </div>

              <div className="record-meta">
                <div className="record-meta-item">{formatDate(r.date)}</div>
                <div className="record-meta-item">{r.doctor || '—'}</div>
                <div className="record-meta-item">{r.hospital || '—'}</div>
              </div>
            </div>

                <div className="record-description">{r.description}</div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className={`record-status ${r.status || ''}`}>{r.status || 'unknown'}</div>
                  {r.blockchainHash && <div className="record-meta-item">{copyText.recordHashLabel}<span style={{ fontFamily: 'Courier New', marginLeft: 6 }}>{r.blockchainHash}</span></div>}
                </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="patient-detail-container">
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">← {copyText.patientDetailBack}</button>
      </div>

      <div className="patient-detail-content">
        {/* TODO: Display patient information */}
        {/* Show: name, email, dateOfBirth, gender, phone, address, walletAddress */}
        <div className="patient-info-section">
          <h2>{copyText.patientDetailInfoTitle}</h2>
          {/* Your implementation here */}
          {renderPatientInfo()}
        </div>

        {/* TODO: Display patient records */}
        {/* Show list of medical records with: type, title, date, doctor, hospital, status */}
        <div className="patient-records-section">
          <h2>{copyText.patientRecordsTitle} ({records.length})</h2>
          {/* Your implementation here */}
          {renderRecords()}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;


