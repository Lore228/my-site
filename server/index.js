import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appointmentsFile = path.join(__dirname, 'appointments.json');
const reviewsFile = path.join(__dirname, 'reviews.json');

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

const readJSON = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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
  if (!raw.date || !raw.time || !raw.selectedService) return res.status(400).json({ success: false, message: 'Date lipsă' });

  const date = dayjs(raw.date).format('YYYY-MM-DD');
  const time = raw.time;
  const duration = services[raw.selectedService] || 60;
  const totalDuration = duration + 30;

  const start = dayjs(`${date} ${time}`);
  const end = start.add(totalDuration, 'minute');

  const all = readJSON(appointmentsFile);
  const overlap = all
    .filter((a) => a.date === date)
    .some((a) => {
      const aStart = dayjs(`${a.date} ${a.time}`);
      const aEnd = aStart.add(a.duration || 60, 'minute');
      return start.isBefore(aEnd) && end.isAfter(aStart);
    });

  if (overlap) return res.status(409).json({ success: false, message: 'Interval ocupat' });

  const appointment = { ...raw, date, time, duration: totalDuration, reminderSent: false };
  all.push(appointment);
  writeJSON(appointmentsFile, all);

  try {
    await sendConfirmationEmail(appointment.email, appointment);
    await sendInternalNotification(appointment);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Email eșuat', error: err.message });
  }
});

app.get('/api/appointments', (req, res) => {
  const { date } = req.query;
  const all = readJSON(appointmentsFile);
  if (date) return res.json(all.filter((a) => a.date === date));
  res.json(all);
});

app.get('/api/available-slots', (req, res) => {
  const { date, service } = req.query;
  const duration = services[service] || 60;
  const buffer = 20;
  const appointments = readJSON(appointmentsFile).filter((a) => a.date === date);
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

app.get('/api/reviews', (req, res) => {
  const allReviews = readJSON(reviewsFile);
  res.json(allReviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, message, rating } = req.body;
  if (!name || !message || typeof rating !== 'number') return res.status(400).json({ success: false });

  const newReview = { name, message, rating, createdAt: new Date().toISOString() };
  const allReviews = readJSON(reviewsFile);
  allReviews.push(newReview);
  writeJSON(reviewsFile, allReviews);

  res.json({ success: true });
});

cron.schedule('*/30 * * * *', () => {
  const allAppointments = readJSON(appointmentsFile);
  const now = dayjs();
  const in3Hours = now.add(3, 'hour');

  allAppointments
    .filter(a => {
      const apptTime = dayjs(`${a.date} ${a.time}`);
      return apptTime.isAfter(now) && apptTime.isBefore(in3Hours) && !a.reminderSent;
    })
    .forEach(async (a) => {
      try {
        await sendReminderEmail(a.email, a);
        const updated = readJSON(appointmentsFile);
        const idx = updated.findIndex(x => x.email === a.email && x.date === a.date && x.time === a.time);
        if (idx !== -1) {
          updated[idx].reminderSent = true;
          writeJSON(appointmentsFile, updated);
        }
      } catch (e) {
        console.error('Reminder eșuat:', e);
      }
    });

  // curăță programările expirate
  const filtered = allAppointments.filter(a => dayjs(`${a.date} ${a.time}`).isAfter(now.subtract(1, 'day')));
  writeJSON(appointmentsFile, filtered);
});

app.listen(PORT, () => console.log(`✅ Serverul rulează pe http://localhost:${PORT}`));
