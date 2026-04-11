import React, { useState, useRef } from 'react';
import { UploadCloud, Box, Settings, MapPin, Truck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => (
  <div style={{ textAlign: 'center', padding: '5rem 0 3rem 0' }} className="animate-fade-in">
    <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
      The Global <span className="gradient-text">3D Printing</span> Marketplace
    </h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
      Upload your 3D models, get instant pricing, and connect with local printing professionals who bring your ideas to life.
    </p>
  </div>
);

const UploadSection = ({ addJob }: { addJob: (job: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [material, setMaterial] = useState('PLA');
  const [quality, setQuality] = useState('Standard (0.2mm)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pricingMap: Record<string, number> = {
    'PLA': 19.25,
    'ABS': 24.50,
    'Resin': 32.00
  };

  const currentPrice = pricingMap[material] || 19.25;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFindPartners = () => {
    if (!file) return;
    setIsSubmitting(true);
    
    // Simulate process
    setTimeout(() => {
      const newJob = {
        id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        item: file.name.split('.')[0],
        material: `${material} ${material === 'Resin' ? 'Gray' : 'Black'}`,
        quality: quality.split(' ')[0],
        status: 'Pending',
        rev: `$${currentPrice.toFixed(2)}`,
        time: '4h 15m',
        timestamp: new Date()
      };
      
      addJob(newJob);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".stl,.obj" 
        onChange={handleFileChange} 
      />
      {/* Viewport / Upload Box */}
      <motion.div 
        className="glass-panel" 
        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '400px', position: 'relative', overflow: 'hidden' }}
        whileHover={{ boxShadow: '0 8px 30px rgba(0, 210, 255, 0.15)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>3D Model Preview</h3>
          <span style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' }}>
            {file ? file.name : 'No file selected'}
          </span>
        </div>

        {file ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             {/* Mock 3D Viewer */}
             <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0, 210, 255, 0.1) 0%, transparent 70%)' }} />
             <motion.div animate={{ rotateY: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ zIndex: 1, transformStyle: 'preserve-3d' }}>
                <Box size={140} color="var(--accent-primary)" style={{ opacity: 0.8 }} />
             </motion.div>
             <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', zIndex: 2 }}>
                <span>Vol: ~124cm³</span><span>Est. Time: 4h 15m</span>
             </div>
          </div>
        ) : (
          <div 
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleFileClick}
            style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <div style={{ width: '64px', height: '64px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <UploadCloud size={32} color="var(--accent-primary)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Drag & Drop your STL/OBJ file</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>or click to browse from computer</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Configuration & Pricing */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={20} color="var(--accent-primary)" /> Job Configuration
        </h3>

        <div className="form-group">
          <label className="form-label">Material Selection</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {['PLA', 'ABS', 'Resin'].map(mat => (
              <button 
                key={mat}
                className="btn btn-secondary" 
                style={{ 
                  background: material === mat ? 'var(--bg-glass-light)' : 'var(--bg-tertiary)',
                  borderColor: material === mat ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: material === mat ? 'white' : 'var(--text-secondary)'
                }}
                onClick={() => setMaterial(mat)}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Print Quality</label>
          <select className="form-control" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option>Draft (0.3mm)</option>
            <option>Standard (0.2mm)</option>
            <option>High Detail (0.1mm)</option>
          </select>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Material Cost</span>
            <span>$4.50</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Printing Time (4h 15m)</span>
            <span>$12.75</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Platform Fee</span>
            <span>$2.00</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Estimated Total</span>
             <span className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>${currentPrice.toFixed(2)}</span>
          </div>

          <button 
            className={`btn ${isSuccess ? 'btn-success' : 'btn-primary'}`} 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: isSuccess ? 'var(--success)' : undefined }} 
            disabled={!file || isSubmitting || isSuccess}
            onClick={handleFindPartners}
          >
            {isSubmitting ? 'Searching...' : isSuccess ? 'Job Posted!' : 'Find Local Printing Partners'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Features = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '6rem', paddingBottom: '4rem' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <MapPin size={28} color="var(--accent-primary)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Local Partners</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Our algorithm finds the nearest available vendors to reduce delivery time and costs.</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <CreditCard size={28} color="var(--success)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Transparent Pricing</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>See exactly what you're paying for with our detailed breakdown of materials, time, and service.</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '60px', height: '60px', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Truck size={28} color="var(--accent-secondary)" />
      </div>
      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Flexible Delivery</h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Choose between fast store pickup or convenient doorstep delivery from the printing shop.</p>
    </div>
  </div>
);

const CustomerDashboard = ({ addJob }: { addJob: (job: any) => void }) => (
  <>
    <Hero />
    <UploadSection addJob={addJob} />
    <Features />
  </>
);

export default CustomerDashboard;
