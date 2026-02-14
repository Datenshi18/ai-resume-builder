const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/db');
connectDb();