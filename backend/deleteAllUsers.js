// backend/deleteAllUsers.js
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if models folder is inside backend/
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await User.deleteMany({});
    console.log('✅ All users deleted');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
