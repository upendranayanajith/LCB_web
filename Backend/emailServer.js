const net = require('net');
const nodemailer = require('nodemailer');

// SMTP Server Info
const host = "mail.lcbfinance.net";
const port = 25;

// Function to check connectivity (similar to telnet)
const checkSMTPConnection = async () => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    console.log('Attempting to connect to SMTP server...');

    // Set a timeout for the connection
    client.setTimeout(5000); // 5 seconds timeout

    client.connect(port, host, () => {
      console.log('Connected to SMTP server');
      client.write('HELO lcbfinance.net\r\n');
    });

    // Handle data from the server
    client.on('data', (data) => {
      console.log('Received: ' + data.toString());
      if (data.toString().includes('220')) {
        console.log('SMTP server is ready');
        resolve();
      } else {
        console.log('SMTP server not responding correctly');
        reject('Invalid SMTP response');
      }
      client.write('QUIT\r\n'); // Gracefully close the connection
    });

    // Handle connection timeout
    client.on('timeout', () => {
      console.error('Connection timed out');
      client.destroy();
      reject(new Error('Connection timed out'));
    });

    // Handle error during connection
    client.on('error', (err) => {
      console.error('Connection error: ' + err.message);
      reject(err);
    });

    // Handle connection closed
    client.on('close', () => {
      console.log('Connection closed');
    });
  });
};

// Create a Nodemailer transporter using SMTP
let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false, 
    auth: {
      user: 'inet@lcbfinance.net',
      pass: 'Password'
    },
    tls: {
      rejectUnauthorized: true
    },
    debug: true,
    logger: true
});
console.log('Using Email User:', process.env.EMAIL_USER);
// Function to send email
const sendEmail = async (subject, body) => {
  try {
    console.log('Attempting to send email...');

    // Check SMTP connection first (Telnet-like)
    await checkSMTPConnection();

    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS.substring(0, 3) + '...');

    let info = await transporter.sendMail({
      from: 'inet@lcbfinance.net',
      to: 'upendra.n@lcbfinance.net', // Make sure to validate this email
      subject: subject,
      text: body,
      html: `<p>${body}</p>`,
    });

    console.log('Email sent successfully:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Verify Nodemailer transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

module.exports = { sendEmail };
