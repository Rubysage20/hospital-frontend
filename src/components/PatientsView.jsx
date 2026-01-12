import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import apiService from '../apiService';

export default function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    primaryCarePhysician: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPatients();
      console.log('Patients data:', data);
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await apiService.updatePatient(editingPatient.id, formData);
      } else {
        await apiService.createPatient(formData);
      }

      setShowForm(false);
      setEditingPatient(null);
      setFormData({ firstName: '', lastName: '', address: '', primaryCarePhysician: '' });
      loadPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      address: patient.address || '',
      primaryCarePhysician: patient.primaryCarePhysician || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await apiService.deletePatient(id);
        loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Patients Management</h2>
        <button 
          className="btn primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '2rem', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            {editingPatient ? 'Edit Patient' : 'Add New Patient'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }}
            />
            <input
              type="text"
              placeholder="Primary Care Physician"
              value={formData.primaryCarePhysician}
              onChange={(e) => setFormData({ ...formData, primaryCarePhysician: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn primary">
                {editingPatient ? 'Update Patient' : 'Create Patient'}
              </button>
              <button 
                type="button" 
                className="btn secondary" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPatient(null);
                  setFormData({ firstName: '', lastName: '', address: '', primaryCarePhysician: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <p>No patients found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click "Add Patient" to create your first patient record
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Primary Care Physician</th>
                <th>Last Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.address || 'N/A'}</td>
                  <td>{patient.primaryCarePhysician || 'N/A'}</td>
                  <td>{patient.lastVisitedAt || 'Never'}</td>
                  <td>
                    <button
                      className="btn secondary"
                      onClick={() => handleEdit(patient)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(patient.id)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.85rem',
                        background: '#fc8181',
                        color: 'white'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}