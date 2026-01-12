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

  // Format currency with commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
            <div style={{ background: 'linear-gradient(135deg, #0a4d68 0%, #088395 100%)', padding: '1.5rem', borderRadius: '16px', color: 'white', boxShadow: '0 10px 30px rgba(8, 131, 149, 0.3)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '500' }}>Total Payroll</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>{formatCurrency(totalPayroll)}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>
                 {doctors.length + employees.length} Total Staff
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #088395 0%, #05bfdb 100%)', padding: '1.5rem', borderRadius: '16px', color: 'white', boxShadow: '0 10px 30px rgba(5, 191, 219, 0.3)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '500' }}>Doctor Payroll</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>{formatCurrency(totalDoctorPayroll)}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>
                 {doctors.length} Doctors
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #05bfdb 0%, #00d4e4 100%)', padding: '1.5rem', borderRadius: '16px', color: 'white', boxShadow: '0 10px 30px rgba(0, 212, 228, 0.3)' }}>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '500' }}>Employee Payroll</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>{formatCurrency(totalEmployeePayroll)}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.75rem' }}>
                 {employees.length} Employees
              </div>
            </div>
          </div>

          {/* Doctor Payroll Table */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a3a52', fontSize: '1.25rem', fontWeight: '700' }}>
             Doctor Payroll Breakdown
            </h3>
            <div className="table-wrap" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              {doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No doctors found
                </div>
              ) : (
                <table className="table">
                  <thead style={{ background: 'linear-gradient(135deg, #088395 0%, #05bfdb 100%)', color: 'white' }}>
                    <tr>
                      <th style={{ color: 'white' }}>Doctor Name</th>
                      <th style={{ color: 'white' }}>Specialty</th>
                      <th style={{ color: 'white' }}>Patients Visited</th>
                      <th style={{ color: 'white' }}>Visit Fee</th>
                      <th style={{ color: 'white' }}>Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor, index) => (
                      <tr key={doctor.id} style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                        <td style={{ fontWeight: '600', color: '#1e293b' }}>Dr. {doctor.firstName} {doctor.lastName}</td>
                        <td style={{ color: '#64748b' }}>{doctor.specialty || 'General'}</td>
                        <td style={{ textAlign: 'center', color: '#475569' }}>{doctor.numVisitedPatients || 0}</td>
                        <td style={{ color: '#475569' }}>{formatCurrency(doctor.officeVisitFee || 0)}</td>
                        <td style={{ fontWeight: 'bold', color: '#088395' }}>
                          {formatCurrency(calculateDoctorPayroll(doctor))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#e0f2fe', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ textAlign: 'right', color: '#1e293b', fontSize: '1.05rem' }}>
                        Total Doctor Payroll:
                      </td>
                      <td style={{ color: '#088395', fontSize: '1.1rem' }}>
                        {formatCurrency(totalDoctorPayroll)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Employee Payroll Table */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1a3a52', fontSize: '1.25rem', fontWeight: '700' }}>
               Employee Payroll Breakdown
            </h3>
            <div className="table-wrap" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              {employees.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No employees found
                </div>
              ) : (
                <table className="table">
                  <thead style={{ background: 'linear-gradient(135deg, #05bfdb 0%, #00d4e4 100%)', color: 'white' }}>
                    <tr>
                      <th style={{ color: 'white' }}>Employee Name</th>
                      <th style={{ color: 'white' }}>Role</th>
                      <th style={{ color: 'white' }}>Hours Worked</th>
                      <th style={{ color: 'white' }}>Hourly Rate</th>
                      <th style={{ color: 'white' }}>Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={employee.id} style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                        <td style={{ fontWeight: '600', color: '#1e293b' }}>{employee.name}</td>
                        <td style={{ color: '#64748b' }}>{employee.role}</td>
                        <td style={{ textAlign: 'center', color: '#475569' }}>{employee.monthlyWorkingHours || 0} hrs</td>
                        <td style={{ color: '#475569' }}>{formatCurrency(employee.hourlyRate || 0)}/hr</td>
                        <td style={{ fontWeight: 'bold', color: '#05bfdb' }}>
                          {formatCurrency(calculateEmployeePayroll(employee))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#e0f2fe', fontWeight: 'bold' }}>
                      <td colSpan="4" style={{ textAlign: 'right', color: '#1e293b', fontSize: '1.05rem' }}>
                        Total Employee Payroll:
                      </td>
                      <td style={{ color: '#05bfdb', fontSize: '1.1rem' }}>
                        {formatCurrency(totalEmployeePayroll)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
              padding: '2rem', 
              borderRadius: '16px', 
              border: '2px solid #bae6fd',
              boxShadow: '0 4px 12px rgba(8, 131, 149, 0.1)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#0a4d68', fontSize: '1.25rem', fontWeight: '700' }}>
               Monthly Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <p style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '500' }}>
                    Total Staff Members
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0a4d68' }}>
                    {doctors.length + employees.length}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {doctors.length} Doctors • {employees.length} Employees
                  </p>
                </div>
                <div>
                  <p style={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '500' }}>
                    Total Monthly Payroll
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#088395' }}>
                    {formatCurrency(totalPayroll)}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    For period ending {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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