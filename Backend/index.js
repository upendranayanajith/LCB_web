const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const uploadRoute = require('./routes/uploadPdf.routes');
const categoryRoutes = require('./Routes/category.routes');
const path = require('path');



const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));




// MongoDB connection
mongoose.connect('mongodb+srv://Admin_LCB:lcbAdmin@cluster-lcb.t6r46.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-LCB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Use the PDF upload route
app.use('/api', uploadRoute);


// Use the category routes
app.use('/api', categoryRoutes);


// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
