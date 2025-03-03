const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const eventRoutes = require('./Routes/eventRoutes');
const userRoutes = require('./Routes/userRoutes');
const cors = require('cors');
const inviteRoutes = require('./Routes/inviteRoutes');


dotenv.config();



const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credential: true,
}));


app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invites', inviteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
