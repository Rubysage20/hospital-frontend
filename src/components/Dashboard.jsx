import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import apiService from "../apiService";


export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    totalDoctors: 0,
    totalEmployees: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [doctorsData, patientsData, employeesData, appointmentsData] = await Promise.all([
        apiService.getDoctors(),
        apiService.getPatients(),
        apiService.getEmployees(),
        apiService.getAppointments()
        //apiService.getPayrollSummary()
      ]);

      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointmentsData.filter(apt => {
        if (apt.start) {
          const aptDate = apt.start.split('T')[0];
          return aptDate === today;
        }
        return false;
      });

      setStats({
        totalPatients: patientsData.length,
        appointmentsToday: todayAppointments.length,
        totalDoctors: doctorsData.length,
        totalEmployees: employeesData.length
      });

      // Build recent activity from appointments
      const recentAppts = appointmentsData
        .sort((a, b) => new Date(b.start) - new Date(a.start))
        .slice(0, 10)
        .map(apt => {
          const patient = patientsData.find(p => p.id === apt.patientId);
          const doctor = doctorsData.find(d => d.id === apt.doctorId);
          return {
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
            action: apt.status === 'SCHEDULED' ? 'Appointment Scheduled' : 
                    apt.status === 'COMPLETED' ? 'Appointment Completed' : 'Appointment Canceled',
            department: doctor?.specialty || 'General',
            date: new Date(apt.start).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })
          };
        });

      setRecentActivity(recentAppts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#667' }}>
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <section className="cards">
            <article className="card kpi">
              <div className="card-title">Total Patients</div>
              <div className="card-metric">{stats.totalPatients}</div>
              <div className="trend up">Active records</div>
            </article>

            <article className="card kpi">
              <div className="card-title">Appointments Today</div>
              <div className="card-metric">{stats.appointmentsToday}</div>
              <div className="trend">Scheduled</div>
            </article>

            <article className="card kpi">
              <div className="card-title">Total Doctors</div>
              <div className="card-metric">{stats.totalDoctors}</div>
              <div className="trend up">Medical staff</div>
            </article>

            <article className="card kpi">
              <div className="card-title">Employees</div>
              <div className="card-metric">{stats.totalEmployees}</div>
              <div className="trend up">On staff</div>
            </article>
          </section>

          {/* Table Panel */}
          <section className="panel">
            <div className="panel-head">
              <h2>Recent Activity</h2>
              <div className="filters">
                <button 
                  className="btn secondary"
                  onClick={loadDashboardData}
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="table-wrap">
              {recentActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No recent activity found. Start by creating appointments!
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Action</th>
                      <th>Department</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity, idx) => (
                      <tr key={idx}>
                        <td>{activity.patientName}</td>
                        <td>{activity.action}</td>
                        <td>{activity.department}</td>
                        <td>{activity.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Additional Stats Section */}
          <section className="panel" style={{ marginTop: '2rem' }}>
            <div className="panel-head">
              <h2>Quick Stats</h2>
            </div>
            <div className="cards" style={{ padding: '1rem' }}>
              <article className="card" style={{ padding: '1.5rem', background: '#f8f9fa' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Total Appointments
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
                  {recentActivity.length}
                </div>
              </article>
              <article className="card" style={{ padding: '1.5rem', background: '#f8f9fa' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Active Doctors
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
                  {stats.totalDoctors}
                </div>
              </article>
              <article className="card" style={{ padding: '1.5rem', background: '#f8f9fa' }}>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Patient Records
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>
                  {stats.totalPatients}
                </div>
              </article>
            </div>
          </section>
        </>
      )}
    </>
  );
}
