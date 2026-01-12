import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import apiService from '../apiService';

export default function DoctorsView() {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialty: '',
    address: '',
    officeVisitFee: 0,
    monthlyWorkingHours: 0
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await apiService.updateDoctor(editingDoctor.id, formData);
      } else {
        await apiService.createDoctor(formData);
      }

      setShowForm(false);
      setEditingDoctor(null);
      setFormData({
        firstName: '',
        lastName: '',
        specialty: '',
        address: '',
        officeVisitFee: 0,
        monthlyWorkingHours: 0
      });
      loadDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      specialty: doctor.specialty || '',
      address: doctor.address || '',
      officeVisitFee: doctor.officeVisitFee || 0,
      monthlyWorkingHours: doctor.monthlyWorkingHours || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await apiService.deleteDoctor(id);
        loadDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDoctor(null);
    setFormData({
      firstName: '',
      lastName: '',
      specialty: '',
      address: '',
      officeVisitFee: 0,
      monthlyWorkingHours: 0
    });
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Doctors Management</h2>
        <button 
          className="btn primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Doctor'}
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '2rem', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Specialty
              </label>
              <input
                type="text"
                placeholder="e.g., Cardiology, Pediatrics, Oncology"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Address
              </label>
              <input
                type="text"
                placeholder="123 Medical Plaza, Suite 100"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Office Visit Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.officeVisitFee}
                  onChange={(e) => setFormData({ ...formData, officeVisitFee: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Monthly Working Hours
                </label>
                <input
                  type="number"
                  placeholder="160"
                  value={formData.monthlyWorkingHours}
                  onChange={(e) => setFormData({ ...formData, monthlyWorkingHours: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn primary">
                {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
              </button>
              <button type="button" className="btn secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <p>No doctors found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click "Add Doctor" to create your first doctor record
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Address</th>
                <th>Visit Fee</th>
                <th>Patients Visited</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                  <td>{doctor.specialty || 'N/A'}</td>
                  <td>{doctor.address || 'N/A'}</td>
                  <td>${doctor.officeVisitFee || 0}</td>
                  <td>{doctor.numVisitedPatients || 0}</td>
                  <td>
                    <button
                      className="btn secondary"
                      onClick={() => handleEdit(doctor)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(doctor.id)}
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