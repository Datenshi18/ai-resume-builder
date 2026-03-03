const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require("./middleware.js");
const ResumeModel = require('../models/ResumeModel')
router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const { role, experienceLevel, skills } = req.body;

        const prompt = `
Generate a professional resume in STRICT JSON format.

Return ONLY valid JSON.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include extra text.

The JSON structure must be:

{
  "summary": "Professional summary here",
  "skills": ["skill1", "skill2"],
  "experience": "Work experience description",
  "education": "Education details"
}

Candidate Details:
Role: ${role}
Experience Level: ${experienceLevel}
Skills: ${skills?.join(", ")}
`;

       

        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "phi3",
            prompt,
            stream: false
        });

        const aiText = response.data.response;
        let parsedData;
        try {
            const cleaned = aiText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            parsedData = JSON.parse(cleaned);

            

        } catch (err) {
            console.error("JSON Parse Error:", err.message);

            return res.status(500).json({
                message: "AI did not return valid JSON",
                raw: aiText
            });
        }

        
        const savedResume = await ResumeModel.create({
            userId : req.user.id,
            title : role,
            summary:parsedData.summary,
            skills:parsedData.skills,
            experience:parsedData.experience,
            education:parsedData.education})
        res.status(201).json(savedResume);

    } catch (error) {
        console.error("AI generation failed:", error.message);
        res.status(500).json({ message: "AI generation failed" });
    }
});

module.exports = router;