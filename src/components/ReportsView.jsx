import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import apiService from '../apiService';

function ReportsView() {
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const [payroll, doctorsData, employeesData] = await Promise.all([
        apiService.getPayrollSummary(),
        apiService.getDoctors(),
        apiService.getEmployees()
      ]);

      setPayrollData(payroll);
      setDoctors(doctorsData || []);
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDoctorPayroll = (doctor) => {
    const visits = doctor.numVisitedPatients || 0;
    const fee = doctor.officeVisitFee || 0;
    return visits * fee;
  };

  const calculateEmployeePayroll = (employee) => {
    const hours = employee.monthlyWorkingHours || 0;
    const rate = employee.hourlyRate || 0;
    return hours * rate;
  };

  const totalDoctorPayroll = doctors.reduce((sum, doc) => sum + calculateDoctorPayroll(doc), 0);
  const totalEmployeePayroll = employees.reduce((sum, emp) => sum + calculateEmployeePayroll(emp), 0);
  const totalPayroll = totalDoctorPayroll + totalEmployeePayroll;

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Reports & Payroll</h2>
        <button 
          className="btn primary"
          onClick={loadPayrollData}
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          Loading payroll data...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Payroll</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalPayroll.toFixed(2)}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Doctor Payroll</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalDoctorPayroll.toFixed(2)}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.5rem' }}>{doctors.length} doctors</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Employee Payroll</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalEmployeePayroll.toFixed(2)}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.5rem' }}>{employees.length} employees</div>
            </div>
          </div>

          {/* Doctor Payroll Table */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Doctor Payroll Breakdown</h3>
            <div className="table-wrap">
              {doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No doctors found
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Specialty</th>
                      <th>Patients Visited</th>
                      <th>Visit Fee</th>
                      <th>Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor.id}>
                        <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                        <td>{doctor.specialty || 'General'}</td>
                        <td>{doctor.numVisitedPatients || 0}</td>
                        <td>${(doctor.officeVisitFee || 0).toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold', color: '#2d3748' }}>
                          ${calculateDoctorPayroll(doctor).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f7fafc', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ textAlign: 'right' }}>Total Doctor Payroll:</td>
                      <td style={{ color: '#667eea' }}>${totalDoctorPayroll.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Employee Payroll Table */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Employee Payroll Breakdown</h3>
            <div className="table-wrap">
              {employees.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No employees found
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Role</th>
                      <th>Hours Worked</th>
                      <th>Hourly Rate</th>
                      <th>Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.role}</td>
                        <td>{employee.monthlyWorkingHours || 0} hrs</td>
                        <td>${(employee.hourlyRate || 0).toFixed(2)}/hr</td>
                        <td style={{ fontWeight: 'bold', color: '#2d3748' }}>
                          ${calculateEmployeePayroll(employee).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f7fafc', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ textAlign: 'right' }}>Total Employee Payroll:</td>
                      <td style={{ color: '#4facfe' }}>${totalEmployeePayroll.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <div style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Monthly Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ color: '#718096', marginBottom: '0.5rem' }}>Total Staff:</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {doctors.length + employees.length}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#718096', marginBottom: '0.5rem' }}>Total Monthly Payroll:</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    ${totalPayroll.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsView;