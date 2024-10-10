const nodemailer = require('nodemailer');

// Controller to send email invitations
exports.sendInvitation = async (req, res) => {
  const { guestEmail, guestName, eventName, eventDate, eventTime, organizer } = req.body;

  try {
    // Create a transporter (using a real SMTP service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // Your email password (or app password)
      }
    });

    // Email message details
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender address
      to: guestEmail,                // Recipient address
      subject: `You're Invited to ${eventName}!`,
      html: `<p>Hello ${guestName},</p>
             <p>You have been invited to attend the event <strong>${eventName}</strong> on ${eventDate} at ${eventTime}.</p>
             <p>Organized by: ${organizer}</p>
             <p>We hope to see you there!</p>
             <p>Best regards,<br/>${organizer}</p>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ msg: 'Error sending email', error });
      }
      res.status(200).json({ msg: 'Invitation sent successfully!' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
