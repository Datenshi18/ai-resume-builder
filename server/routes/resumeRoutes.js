const express = require('express');
const ResumeModel = require('../models/ResumeModel');
const authMiddleware = require('./middleware'); // since it's inside routes

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, summary, skills, experience, education } = req.body;

        const newResume = await ResumeModel.create({
            userId: req.user.id,
            title,
            summary,
            skills,
            experience,
            education,
        });

        res.status(201).json(newResume);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred" });
    }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await ResumeModel.find({
      userId: req.user.id
    });

    res.json(resumes);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, summary, skills, experience, education } = req.body;

    const updatedResume = await ResumeModel.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      {
        title,
        summary,
        skills,
        experience,
        education
      },
      { new: true } 
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    res.json(updatedResume);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating resume" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedResume = await ResumeModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting resume" });
  }
});

module.exports = router; 