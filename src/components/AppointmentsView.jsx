import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import apiService from '../apiService';

function AppointmentsView() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    time: '09:00',
    status: 'SCHEDULED'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appts, docs, pts] = await Promise.all([
        apiService.getAppointments(),
        apiService.getDoctors(),
        apiService.getPatients()
      ]);
      setAppointments(Array.isArray(appts) ? appts : []);
      setDoctors(Array.isArray(docs) ? docs : []);
      setPatients(Array.isArray(pts) ? pts : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setAppointments([]);
      setDoctors([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📅 Submitting appointment...');
    console.log('Form data:', formData);
    
    try {
      // Validate form data
      if (!formData.doctorId || !formData.patientId || !formData.date) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Combine date and time into ISO format
      const dateTime = `${formData.date}T${formData.time}:00`;
      console.log('Combined dateTime:', dateTime);
      
      const payload = {
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        date: dateTime,
        status: formData.status || 'SCHEDULED'
      };

      console.log('Payload being sent:', payload);
      console.log('Token exists:', !!localStorage.getItem('token'));

      const response = await apiService.createAppointment(payload);
      console.log('✅ Appointment created successfully:', response);

      // Reset form and reload data
      setShowForm(false);
      setFormData({
        doctorId: '',
        patientId: '',
        date: '',
        time: '09:00',
        status: 'SCHEDULED'
      });
      
      await loadData();
      alert('Appointment scheduled successfully!');
      
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      console.error('Error details:', error.message);
      alert(`Failed to create appointment: ${error.message}\n\nCheck console for details.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiService.deleteAppointment(id);
        await loadData();
        alert('Appointment deleted successfully!');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  };

  // Time slots (9 AM to 5 PM)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Appointments Management</h2>
        <button 
          className="btn primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Schedule Appointment'}
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '2rem', background: '#f8f9fa', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
            Schedule New Appointment
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Select Doctor *
              </label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty || 'General'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                Select Patient *
              </label>
              <select
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">-- Choose a Patient --</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Appointment Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2c3e50' }}>
                  Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>
                      {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn primary">
                Schedule Appointment
              </button>
              <button 
                type="button" 
                className="btn secondary" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({ doctorId: '', patientId: '', date: '', time: '09:00', status: 'SCHEDULED' });
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
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <p>No appointments scheduled</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Click "Schedule Appointment" to create your first appointment
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.start).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</td>
                  <td>{getDoctorName(appointment.doctorId)}</td>
                  <td>{getPatientName(appointment.patientId)}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      background: appointment.status === 'SCHEDULED' ? '#bee3f8' : 
                                 appointment.status === 'COMPLETED' ? '#c6f6d5' : '#fed7d7',
                      color: appointment.status === 'SCHEDULED' ? '#2c5282' :
                             appointment.status === 'COMPLETED' ? '#22543d' : '#742a2a'
                    }}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => handleDelete(appointment.id)}
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

export default AppointmentsView;