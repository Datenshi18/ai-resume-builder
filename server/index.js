const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/db');
const UserAuth = require('./routes/UserAuth');
const resumeRoutes = require('./routes/resumeRoutes');
const aiOutput = require('./routes/aiRoutes');
const tailoredResume = require('./routes/tailoredResume');



connectDb();

const app = express();                 

app.use(cors());                       
app.use(express.json());               

app.use("/api/auth", UserAuth);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai' , aiOutput)
app.use('/api/tailored-resume',tailoredResume)
        

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {               
    console.log(`Server running on http://localhost:${PORT}`);
});
