const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to use HTML files
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Define a function to handle the "/" route
function handleIndex(req, res) {
  res.render('index');
}

// Route to your index.html file
app.get('/', handleIndex);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
