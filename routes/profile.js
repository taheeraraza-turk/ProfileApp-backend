// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user });
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create or update profile
router.post('/', auth, async (req, res) => {
  const { name, skills, projects, github } = req.body;

  const profileFields = {
    userId: req.user,
    name,
    skills,
    projects,
    github,
  };

  try {
    let profile = await UserProfile.findOne({ userId: req.user });
    if (profile) {
      // Update
      profile = await UserProfile.findOneAndUpdate(
        { userId: req.user },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new
    profile = new UserProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete profile (optional)
router.delete('/', auth, async (req, res) => {
  try {
    await UserProfile.findOneAndRemove({ userId: req.user });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
