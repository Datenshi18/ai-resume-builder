const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/db');
const UserAuth = require('./routes/UserAuth');
const resumeRoutes = require('./routes/resumeRoutes');



connectDb();

const app = express();                 

app.use(cors());                       
app.use(express.json());               

app.use("/api/auth", UserAuth);
app.use('/api/resume', resumeRoutes);
        

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {               
    console.log(`Server running on http://localhost:${PORT}`);
});
