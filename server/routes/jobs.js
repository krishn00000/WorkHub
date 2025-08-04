const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all jobs with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'active', expiresAt: { $gt: new Date() } };
    
    if (req.query.type) filter.type = req.query.type;
    if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name avatar company')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:jobId', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate('postedBy', 'name avatar company')
      .populate('applications.user', 'name avatar');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { views: 1 } });

    // Hide applications from non-owners
    if (!req.user || job.postedBy._id.toString() !== req.user._id.toString()) {
      job.applications = [];
    }

    res.json({ job: { ...job.toObject(), views: job.views + 1 } });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new job
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('company').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
  body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']).withMessage('Invalid job type'),
  body('salary').trim().notEmpty().withMessage('Salary is required'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('requirements').trim().isLength({ min: 20, max: 1500 }).withMessage('Requirements must be between 20 and 1500 characters'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    const populatedJob = await Job.findById(job._id)
      .populate('postedBy', 'name avatar company');

    res.status(201).json({
      success: true,
      job: populatedJob
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// Update job
router.put('/:jobId', auth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('company').optional().trim().isLength({ min: 2, max: 100 }),
  body('location').optional().trim().isLength({ min: 2, max: 100 }),
  body('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
  body('description').optional().trim().isLength({ min: 50, max: 2000 }),
  body('requirements').optional().trim().isLength({ min: 20, max: 1500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.jobId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name avatar company');

    res.json({
      success: true,
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// Apply to job
router.post('/:jobId/apply', auth, [
  body('coverLetter').optional().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Job is no longer accepting applications' });
    }

    // Check if user already applied
    const existingApplication = job.applications.find(
      app => app.user.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Add application
    job.applications.push({
      user: req.user._id,
      coverLetter: req.body.coverLetter || ''
    });

    await job.save();

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posted jobs
router.get('/user/posted', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('applications.user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Job.countDocuments({ postedBy: req.user._id });

    res.json({
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;