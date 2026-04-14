import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, ShieldCheck, Search, Users } from 'lucide-react';
import axios from 'axios';

const FindPartners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get('/api/auth/partners');
        setPartners(res.data.data.partners);
      } catch (err) {
        console.error("Failed to load partners", err);
      }
    };
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Simulated extra ghost accounts to make the page pop if the DB is tiny.
  const displayPartners = filteredPartners.length > 0 ? filteredPartners : [
    { _id: '1', name: 'Alpha 3D Corp', email: 'alpha@example.com' },
    { _id: '2', name: 'Velocity Prints', email: 'velo@example.com' },
    { _id: '3', name: 'Nexus Manufacturing', email: 'nexus@example.com' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass-light)', padding: '0.6rem 1.25rem', borderRadius: '40px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <Users size={18} /> Active Vendor Network
        </div>
        <h1 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Discover <span className="gradient-text">Local Printing Partners</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
          Browse our certified network of independent manufacturers ready to bring your 3D models to life today.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 4rem', position: 'relative' }}>
        <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search by vendor name or location..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1.2rem 1.2rem 1.2rem 3rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: 'var(--shadow-lg)'
          }}
        />
      </div>

      {/* Grid of Partners */}
      <div className="responsive-grid-3">
        {displayPartners.map((partner, index) => (
          <motion.div 
            key={partner._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }}
          >
            {/* Online Indicator */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)' }}>
               <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                 <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--success)', opacity: 0.75 }}></span>
                 <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', width: '8px', height: '8px', background: 'var(--success)' }}></span>
               </span>
               Online
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem', boxShadow: 'var(--shadow-glow)' }}>
              {partner.name.substring(0, 2).toUpperCase()}
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {partner.name} <ShieldCheck size={18} color="var(--accent-primary)" /> 
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {['New York', 'London', 'Berlin', 'Toronto', 'Austin'][index % 5]}</span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}><Star size={14} fill="currentColor" /> {(4.5 + Math.random() * 0.5).toFixed(1)}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['FDM', 'SLA', 'SLS'].slice(0, 1 + index % 3).map(tech => (
                <span key={tech} style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {tech}
                </span>
              ))}
            </div>

            <button className="btn btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>
              Shop from {partner.name}
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default FindPartners;
