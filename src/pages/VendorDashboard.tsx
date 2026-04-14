import React, { useState, useEffect } from 'react';
import { Printer, Clock, CheckCircle, DollarSign, Inbox, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [printers, setPrinters] = useState([
    { name: 'Prusa MK3S+', status: 'Printing (45%)', color: 'var(--warning)', active: true, progress: '45%' },
    { name: 'Bambu Lab X1C', status: 'Printing (12%)', color: 'var(--warning)', active: true, progress: '12%' },
    { name: 'Elegoo Mars 3', status: 'Idle', color: 'var(--success)', active: false, progress: '0%' },
  ]);

  const handleAddPrinter = () => {
    const printerNames = ['Creality Ender 3', 'Anycubic Photon', 'Voron 2.4'];
    const randomName = printerNames[Math.floor(Math.random() * printerNames.length)];
    setPrinters(prev => [...prev, {
      name: randomName,
      status: 'Idle',
      color: 'var(--success)',
      active: false,
      progress: '0%'
    }]);
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  const handleJobAction = async (id: string, currentStatus: string) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Shipped';
    else if (currentStatus === 'Shipped') nextStatus = 'Delivered';
    
    if (!nextStatus) return;

    try {
      await axios.put(`/api/jobs/${id}`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs(); // Refetch updated jobs
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Partner <span className="gradient-text">Dashboard</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage your incoming print jobs and printing farm.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddPrinter}><Plus size={18} /> Add New Printer</button>
      </div>

    {/* Stats Row */}
    <div className="responsive-grid-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
      {[
        { label: "Today's Earnings", value: "$342.50", icon: <DollarSign color="var(--success)" size={24} />, trend: "+12%" },
        { label: "Active Orders", value: "8", icon: <Activity color="var(--accent-primary)" size={24} />, trend: "2 urgent" },
        { label: "Completion Rate", value: "99.2%", icon: <CheckCircle color="var(--success)" size={24} />, trend: "+0.4%" },
        { label: "Avg Print Time", value: "4h 12m", icon: <Clock color="var(--warning)" size={24} />, trend: "-15m" }
      ].map((stat, i) => (
        <motion.div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} whileHover={{ y: -5 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>{stat.label}</span>
             {stat.icon}
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</span>
             <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.trend}</span>
           </div>
        </motion.div>
      ))}
    </div>

    <div className="responsive-grid-2">
      {/* Incoming Orders */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
         <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Inbox size={20} color="var(--accent-primary)" /> Incoming Print Jobs
         </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.filter(j => j.status !== 'Delivered').map((job, i) => (
              <div key={i} className="flex-column-mobile" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', transition: 'all 0.2s', textAlign: 'center' }}>
                 <div>
                   <p style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '1.05rem' }}>{job.item}</p>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                     <span style={{ color: 'var(--accent-primary)' }}>{job.idTag}</span> • {job.material} • Est: {job.time}
                   </p>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                   <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                     <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{job.rev}</span>
                     <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700 }}>{job.status}</span>
                   </div>
                   <button 
                    className={`btn ${job.status === 'Pending' ? 'btn-primary' : 'btn-secondary'}`} 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    onClick={() => handleJobAction(job._id, job.status)}
                   >
                     {job.status === 'Pending' ? 'Accept Job' : job.status === 'In Progress' ? 'Ship Item' : 'Mark Delivered'}
                   </button>
                 </div>
              </div>
            ))}
            {jobs.filter(j => j.status !== 'Delivered').length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No active jobs. Upload something from the Customer Portal!
              </div>
            )}
          </div>
      </div>

      {/* Printer Status */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
         <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={20} color="var(--accent-primary)" /> Farm Status
         </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {printers.map((printer, i) => (
               <div key={i} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: printer.active ? '0.75rem' : '0' }}>
                     <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{printer.name}</span>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: printer.color, fontWeight: 500 }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: printer.color, boxShadow: `0 0 8px ${printer.color}` }}></span>
                       {printer.status}
                     </span>
                  </div>
                  {printer.active && (
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                       <div style={{ width: printer.progress, height: '100%', background: 'var(--accent-gradient)' }}></div>
                    </div>
                  )}
               </div>
            ))}
          </div>
      </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
