import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import apiService from '../apiService';

function EmployeesView() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hourlyRate: 0,
    monthlyWorkingHours: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching employees...');
      
      const data = await apiService.getEmployees();
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error('Data is not an array:', data);
        setEmployees([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await apiService.updateEmployee(editingEmployee.id, formData);
      } else {
        await apiService.createEmployee(formData);
      }

      setShowForm(false);
      setEditingEmployee(null);
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        hourlyRate: 0,
        monthlyWorkingHours: 0
      });
      loadEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      role: employee.role || '',
      email: employee.email || '',
      phone: employee.phone || '',
      hourlyRate: employee.hourlyRate || 0,
      monthlyWorkingHours: employee.monthlyWorkingHours || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiService.deleteEmployee(id);
        loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      hourlyRate: 0,
      monthlyWorkingHours: 0
    });
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Employees Management</h2>
        <button 
          className="btn primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#742a2a', margin: '1rem' }}>
          <strong>Error:</strong> {error}
          <br />
          <button onClick={loadEmployees} style={{ marginTop: '0.5rem' }}>
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <div style={{ padding: '2rem', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Role *
              </label>
              <input
                type="text"
                placeholder="e.g., Nurse, Receptionist, Technician"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="25.00"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
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
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
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
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <p>No employees found</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click "Add Employee" to create your first employee record
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hourly Rate</th>
                <th>Monthly Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.email || 'N/A'}</td>
                  <td>{employee.phone || 'N/A'}</td>
                  <td>${employee.hourlyRate || 0}</td>
                  <td>{employee.monthlyWorkingHours || 0}</td>
                  <td>
                    <button
                      className="btn secondary"
                      onClick={() => handleEdit(employee)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(employee.id)}
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

export default EmployeesView;