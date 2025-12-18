import React, { useState, useEffect } from 'react';
import './PatientList.css';
import { apiService } from '../../services/apiService';
import { useDebounce } from './utils';
import copyText from './copyText';
import { formatDate } from '../utils';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  // TODO: Implement the fetchPatients function
  // This function should:
  // 1. Call apiService.getPatients with appropriate parameters (page, limit, search)
  // 2. Update the patients state with the response data
  // 3. Update the pagination state
  // 4. Handle loading and error states

  const fetchPatients = async () => {
    // Your implementation here
    setLoading(true);
    try {
      const response = await apiService.getPatients(currentPage, 8, debouncedSearchTerm);
      setPatients(response.patients || []);
      setPagination(response.pagination || null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
      setPatients([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Fetch patients whenever the debounced search term or page changes
  useEffect(() => {
    fetchPatients();
  }, [debouncedSearchTerm, currentPage]);


  const truncate = (text, len = 18) => {
    if (!text) return '—';
    return text.length > len ? `${text.slice(0, len)}...` : text;
  };

  const renderPatients = () => {
    if (!patients || patients.length === 0) {
      return <div className="placeholder">{copyText.patientListPlaceholderNoPatients}</div>;
    }

    return patients.map((patient) => (
      <div
        key={patient.id}
        className="patient-card"
        onClick={() => onSelectPatient(patient.id)}
      >
        <div className="patient-card-header">
          <div>
            <div className="patient-name">{patient.name}</div>
            <div className="patient-id">{patient.patientId || patient.id}</div>
          </div>
          <div className="patient-dob">{formatDate(patient.dateOfBirth)}</div>
        </div>

        <div className="patient-info">
          <div className="patient-info-item">{copyText.patientListCardEmail}{patient.email || '—'}</div>
          <div className="patient-info-item">{copyText.patientListCardPhone}{patient.phone || '—'}</div>
        </div>

        <div className="patient-wallet">{copyText.patientListCardWallet}{truncate(patient.walletAddress, 20)}</div>
      </div>
    ));
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>{copyText.patientListHeaderTitle}</h2>


        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setLoading(true);
            setSearchTerm(e.target.value)
          }}
        />
      </div>
      {error && <div className="error-inline">{copyText.patientListError} {error}</div>}

      {/* TODO: Implement patient list display */}
      {/* Map through patients and display them */}
      {/* Each patient should be clickable and call onSelectPatient with patient.id */}
      {loading ? <div className="loading-inline">{copyText.patientListHeaderLoading}</div> : (
        <div className="patient-list">
          {/* Your implementation here */}
          {renderPatients()}
        </div>
      )}

      {/* TODO: Implement pagination controls */}
      {/* Show pagination buttons if pagination data is available */}
      {pagination && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={pagination.page <= 1}
          >
            {copyText.actionPrevious}
          </button>

          <div className="pagination-info">
            {copyText.paginationInfo
              .replace('{currentPage}', pagination.page)
              .replace('{totalPages}', pagination.totalPages)
              .replace('{totalItems}', pagination.total)}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            {copyText.actionNext}
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;


