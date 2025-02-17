const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());  // CORS thing
app.use(bodyParser.json()); // Parser thing for cors thing

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  }
});

app.post('/submit-ticket', async (req, res) => {
  const { name, description, time, recipientEmail } = req.body;

  // Field validation
  if (!name || !description || !time || !recipientEmail) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender Email
    to: recipientEmail,            // Recipient email
    subject: `New Ticket from ${name}`,  // Subject line
    text: `Name: ${name}\nDescription: ${description}\nTime: ${time}`,  // Email body
  };

  try {
    await transporter.sendMail(mailOptions);  // Sends the email
    res.status(200).json({ message: 'Ticket sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });  // Returns error details
  }
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
