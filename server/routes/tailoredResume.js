const express = require('express');
const authMiddleware = require('./middleware');
const router = express.Router();
const axios = require('axios');
const tailorResumeModel = require('../models/tailoredResumeModel');

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { masterResume, jobDescription, masterResumeId } = req.body;

    const prompt = `
You are an expert ATS resume optimizer.

Return ONLY valid JSON.
Do NOT include markdown or explanations.

Format exactly like this:

{
  "summary": "",
  "skills": {
    "languages": [],
    "frameworks": [],
    "tools": []
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "bullets": []
    }
  ],
  "projects": [],
  "education": []
}

Rules:
- Use measurable achievements
- Use action verbs
- Keep summary under 4 lines
- Do not fabricate experience
- Align with job description

MASTER RESUME:
${masterResume}

JOB DESCRIPTION:
${jobDescription}
`;

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "phi3",
      prompt,
      stream: false,
      options: {
        num_predict: 1500
      }
    });

    let aiText = response.data.response.trim();

    // Remove markdown if present
    aiText = aiText.replace(/```json/g, "");
    aiText = aiText.replace(/```/g, "");

    // Extract valid JSON part
    const firstBrace = aiText.indexOf("{");
    const lastBrace = aiText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      aiText = aiText.substring(firstBrace, lastBrace + 1);
    }

    let parsedData;

    try {
      parsedData = JSON.parse(aiText);
    } catch (err) {
      console.log("BROKEN JSON:\n", aiText);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    const tailorResume = await tailorResumeModel.create({
      userId: req.user.id,
      masterResumeId,
      jobDescription: parsedData.jobDescription,
      tailoredResume: JSON.stringify(parsedData), // 👈 important fix
      createdAt: new Date()
    });

    res.status(201).json(tailorResume);

  } catch (error) {
    console.error("AI generation failed:", error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await tailorResumeModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error.message);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
});
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await tailorResumeModel.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error.message);
    res.status(500).json({ message: "Error fetching resume" });
  }
});

module.exports = router;