const net = require('net');
const nodemailer = require('nodemailer');

// SMTP Server Info
const host = "mail.lcbfinance.net";
const port = 25;

// Email categories
const emailCategories = {
  ADMIN: 'admin',
  ALL_USERS: 'all_users',
  MANAGER_CREDIT: 'Credit',
  MANAGER_FINANCE: 'Finance',
  MANAGER_IT_DEPARTMENT: 'IT Department',
  MANAGER_HUMAN_RESOURCES: 'Human Resources',
  MANAGER_LEGAL: 'Legal',
  MANAGER_OPERATIONS: 'Operations',
};

// Email recipients
const emailRecipients = {
  [emailCategories.ADMIN]: ['ramila.b@lcbfinance.net'], // Add admin email(s) here
  [emailCategories.ALL_USERS]: ['ramila.b@lcbfinance.net'], // Keep existing all users email
  [emailCategories.MANAGER_CREDIT]: ['upendra.n@lcbfinance.net'], // Add manager email(s) here
  [emailCategories.MANAGER_FINANCE]: ['ramila.b@lcbfinance.net'], // Add manager email(s) here
  [emailCategories.MANAGER_IT_DEPARTMENT]: ['upendra.n@lcbfinance.net'], // Add manager email(s) here
  [emailCategories.MANAGER_HUMAN_RESOURCES]: ['upendra.n@lcbfinance.net'], // Add manager email(s) here
  [emailCategories.MANAGER_LEGAL]: ['ramila.b@lcbfinance.net'], // Add manager email(s) here
  [emailCategories.MANAGER_OPERATIONS]: ['upendra.n@lcbfinance.net'], // Add manager email(s) here
};

// Function to check connectivity (similar to telnet)
const checkSMTPConnection = async () => {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    console.log('Attempting to connect to SMTP server...');

    client.setTimeout(5000); // 5 seconds timeout

    client.connect(port, host, () => {
      console.log('Connected to SMTP server');
      client.write('HELO lcbfinance.net\r\n');
    });

    client.on('data', (data) => {
      console.log('Received: ' + data.toString());
      if (data.toString().includes('220')) {
        console.log('SMTP server is ready');
        resolve();
      } else {
        console.log('SMTP server not responding correctly');
        reject('Invalid SMTP response');
      }
      client.write('QUIT\r\n');
    });

    client.on('timeout', () => {
      console.error('Connection timed out');
      client.destroy();
      reject(new Error('Connection timed out'));
    });

    client.on('error', (err) => {
      console.error('Connection error: ' + err.message);
      reject(err);
    });

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

// Function to send email
const sendEmail = async (subject, body, category = emailCategories.ADMIN) => {
  try {
    console.log('Attempting to send email...');

    // Check SMTP connection first (Telnet-like)
    await checkSMTPConnection();

    const recipients = emailRecipients[category] || emailRecipients[emailCategories.ALL_USERS];

    let info = await transporter.sendMail({
      from: 'inet@lcbfinance.net',
      to: recipients.join(', '),
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

module.exports = { sendEmail, emailCategories };
