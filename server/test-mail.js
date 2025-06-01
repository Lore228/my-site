import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lorenaaa155@gmail.com',
    pass: 'gjvlzjbuoeltumtc'
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: 'lorenaaa155@gmail.com',
      to: 'lorenaaa155@gmail.com',
      subject: 'Test Nodemailer',
      text: 'Acesta este un test de email trimis prin Nodemailer!'
    });
    console.log('Email trimis:', info.response);
  } catch (err) {
    console.error('Eroare la trimiterea emailului:', err);
  }
}

testEmail();
