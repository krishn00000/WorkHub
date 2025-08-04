const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('bio').optional().isLength({ max: 500 }),
  body('location').optional().isLength({ max: 100 }),
  body('linkedIn').optional().isURL(),
  body('skills').optional().isArray(),
  body('walletAddress').optional().matches(/^0x[a-fA-F0-9]{40}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        linkedIn: user.linkedIn,
        skills: user.skills,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get user profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email')
      .populate('connections.user', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment profile views
    await User.findByIdAndUpdate(req.params.userId, { $inc: { profileViews: 1 } });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        linkedIn: user.linkedIn,
        skills: user.skills,
        profileViews: user.profileViews + 1,
        connections: user.connections
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } },
        { location: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name avatar bio location skills profileViews')
    .limit(limit)
    .skip(skip)
    .sort({ profileViews: -1 });

    const total = await User.countDocuments({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } },
        { location: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send connection request
router.post('/connect/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = targetUser.connections.find(
      conn => conn.user.toString() === req.user._id.toString()
    );

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Add connection request
    targetUser.connections.push({
      user: req.user._id,
      status: 'pending'
    });

    await targetUser.save();

    res.json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    console.error('Connection request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;