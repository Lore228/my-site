import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Appointment from './models/Appointment.js';
import Review from './models/Review.js';

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectat la MongoDB Atlas'))
  .catch(err => console.error('❌ Eroare MongoDB:', err));

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const services = {
  'Machiaj de zi': 60,
  'Machiaj de ocazie': 90,
  'Machiaj pentru ședință foto': 120,
  'Machiaj mireasă': 150,
  'Programare generală': 60
};

const workSchedule = {
  0: { start: '07:00', end: '22:00' },
  1: { start: '17:00', end: '22:00' },
  2: { start: '17:00', end: '22:00' },
  3: { start: '17:00', end: '22:00' },
  4: { start: '17:00', end: '22:00' },
  5: { start: '17:00', end: '22:00' },
  6: { start: '06:00', end: '22:00' }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async (toEmail, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: '✨ Confirmare programare Allure',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #fff4f8; color: #333; border-radius: 8px;">
        <h2 style="color: #b76e79;">✨ Bună, ${appointment.name || 'dragă clientă'}!</h2>
        <p style="font-size: 16px;">Programarea ta pentru <strong>${appointment.selectedService}</strong> a fost <strong style="color: #b76e79;">confirmată</strong>!</p>
        <p style="margin-top: 12px; font-size: 15px;">
          <strong>📅 Data:</strong> ${appointment.date}<br/>
          <strong>🕒 Ora:</strong> ${appointment.time}
        </p>
        <p style="margin-top: 12px;">Ne vedem cu drag la studio 💄</p>
        <p style="margin-top: 24px; font-style: italic;">Cu stil și eleganță,<br/><strong style="color: #b76e79;">Allure Studio</strong></p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};
async function sendInternalNotification(appointment) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'lorenaaa155@gmail.com', 
    subject: `📥 Nouă programare de la ${appointment.name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #fff; border: 1px solid #eee; border-radius: 6px;">
        <h3 style="color: #b76e79;">📋 Programare înregistrată</h3>
        <ul style="font-size: 15px; line-height: 1.6;">
          <li><strong>Nume:</strong> ${appointment.name}</li>
          <li><strong>Email:</strong> ${appointment.email}</li>
          <li><strong>Telefon:</strong> ${appointment.phone}</li>
          <li><strong>Serviciu:</strong> ${appointment.selectedService}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Ora:</strong> ${appointment.time}</li>
        </ul>
        <p style="margin-top: 16px; font-size: 14px; color: #888;">Allure Studio · Notificare internă</p>
      </div>
    `
  };
  return await transporter.sendMail(mailOptions);
}


const sendReminderEmail = async (toEmail, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: '⏰ Reminder pentru programarea ta Allure',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f3f3f3; color: #333; border-radius: 8px;">
        <h2 style="color: #6a0dad;">⏰ Salut, ${appointment.name || 'dragă clientă'}!</h2>
        <p>Îți reamintim cu drag de programarea ta la Allure:</p>
        <p style="font-size: 15px;">
          <strong>📅 Data:</strong> ${appointment.date}<br/>
          <strong>🕒 Ora:</strong> ${appointment.time}<br/>
          <strong>💄 Serviciu:</strong> ${appointment.selectedService}
        </p>
        <p style="margin-top: 16px;">Te așteptăm cu zâmbetul pe buze! 💜</p>
        <p style="margin-top: 20px;">Cu eleganță,<br/><strong style="color: #6a0dad;">Allure Studio</strong></p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};
app.post('/api/book-appointment', async (req, res) => {
  const raw = req.body;
  if (!raw.date || !raw.time || !raw.selectedService) {
    return res.status(400).json({ success: false, message: 'Date lipsă' });
  }

  const date = dayjs(raw.date).format('YYYY-MM-DD');
  const time = raw.time;
  const duration = services[raw.selectedService] || 60;
  const totalDuration = duration + 30;

  const start = dayjs(`${date} ${time}`);
  const end = start.add(totalDuration, 'minute');

  const all = await Appointment.find({ date });
  const overlap = all.some((a) => {
    const aStart = dayjs(`${a.date} ${a.time}`);
    const aEnd = aStart.add(a.duration || 60, 'minute');
    return start.isBefore(aEnd) && end.isAfter(aStart);
  });

  if (overlap) return res.status(409).json({ success: false, message: 'Interval ocupat' });

  const appointment = new Appointment({
    ...raw,
    date,
    time,
    duration: totalDuration,
    reminderSent: false
  });

  await appointment.save();

  try {
    await sendConfirmationEmail(appointment.email, appointment);
    await sendInternalNotification(appointment);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Email eșuat', error: err.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  const { date } = req.query;
  const filter = date ? { date } : {};
  const all = await Appointment.find(filter);
  res.json(all);
});


app.get('/api/available-slots', async (req, res) => {
  const { date, service } = req.query;
  const duration = services[service] || 60;
  const buffer = 20;
  const appointments = await Appointment.find({ date });
  const schedule = workSchedule[dayjs(date).day()];

  if (!schedule) return res.json([]);

  let current = dayjs(`${date} ${schedule.start}`);
  const endTime = dayjs(`${date} ${schedule.end}`);
  const slots = [];

  while (current.add(duration, 'minute').isBefore(endTime)) {
    const slotStart = current;
    const slotEnd = current.add(duration + buffer, 'minute');
    const overlaps = appointments.some(a => {
      const aStart = dayjs(`${a.date} ${a.time}`);
      const aEnd = aStart.add(a.duration || 60, 'minute');
      return slotStart.isBefore(aEnd) && slotEnd.isAfter(aStart);
    });
    if (!overlaps) slots.push(current.format('HH:mm'));
    current = current.add(duration + buffer, 'minute');
  }

  res.json(slots);
});

app.get('/api/reviews', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});


app.post('/api/reviews', async (req, res) => {
  const { name, message, rating } = req.body;
  if (!name || !message || typeof rating !== 'number') {
    return res.status(400).json({ success: false });
  }

  const review = new Review({ name, message, rating });
  await review.save();
  res.json({ success: true });
});

cron.schedule('*/30 * * * *', async () => {
  const allAppointments = await Appointment.find();
  const now = dayjs();
  const in3Hours = now.add(3, 'hour');

  for (const a of allAppointments) {
    const apptTime = dayjs(`${a.date} ${a.time}`);
    if (
      apptTime.isAfter(now) &&
      apptTime.isBefore(in3Hours) &&
      !a.reminderSent
    ) {
      try {
        await sendReminderEmail(a.email, a);
        a.reminderSent = true;
        await a.save();
      } catch (e) {
        console.error('Reminder eșuat:', e);
      }
    }
  }

  // curăță programările expirate
  const oneDayAgo = now.subtract(1, 'day');
  await Appointment.deleteMany({
    $expr: {
      $lt: [{ $toDate: { $concat: ['$date', 'T', '$time'] } }, oneDayAgo.toDate()]
    }
  });
});


app.listen(PORT, () => console.log(`✅ Serverul rulează pe http://localhost:${PORT}`));
