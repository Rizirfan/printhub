const express = require('express');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All job routes require auth

// Get all jobs (Contextual: Customer sees their jobs, Partner sees available & accepted)
router.get('/', async (req, res) => {
  try {
    const userRole = req.user.role;
    let jobs;

    if (userRole === 'user') {
      // Customer sees ONLY their jobs
      jobs = await Job.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    } else {
      // Partner sees Pending jobs AND jobs they accepted
      jobs = await Job.find({
        $or: [
          { status: 'Pending' }, 
          { partnerId: req.user._id }
        ]
      }).sort({ createdAt: -1 });
    }

    res.status(200).json({ status: 'success', data: { jobs } });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

// Create a new job (Customer only)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ status: 'fail', message: 'Only customers can create jobs.' });
    }

    const { item, material, quality, rev, time, idTag } = req.body;
    
    const newJob = await Job.create({
      customerId: req.user._id,
      item,
      material,
      quality,
      rev,
      time,
      idTag
    });

    res.status(201).json({ status: 'success', data: { job: newJob } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Update a job status (Partner only)
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'partner') {
      return res.status(403).json({ status: 'fail', message: 'Only partners can update jobs.' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ status: 'fail', message: 'Job not found.' });
    }

    const { status } = req.body;

    // If accepting a pending job, assign partnerId
    if (job.status === 'Pending' && status === 'In Progress') {
      job.partnerId = req.user._id;
    } 

    // Prevent partner from modifying other partners' jobs
    if (job.partnerId && job.partnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'This job belongs to another partner.' });
    }

    job.status = status;
    await job.save();

    res.status(200).json({ status: 'success', data: { job } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;
