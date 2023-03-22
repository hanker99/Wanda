// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  // Process and send the email using a third-party email service
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Encrypt the message here (optional)

  // Send email using Nodemailer
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'New Customer Inquiry',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while sending the email');
  }
});
