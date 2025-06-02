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


// === Configurare Nodemailer ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  
});

async function sendConfirmationEmail(toEmail, appointment) {
  const mailOptions = {
    from: 'lorenaaa155@gmail.com',
    to: toEmail,
    subject: '✨ Confirmare programare Allure',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #b76e79;">✨ Bună, ${appointment.name || 'dragă clientă'}!</h2>
        <p>🌸 Programarea ta pentru <strong>${appointment.selectedService}</strong> a fost <strong>confirmată</strong>!</p>
        <p>
          <strong>📅 Data:</strong> ${appointment.date}<br>
          <strong>🕒 Ora:</strong> ${appointment.time}
        </p>
        <p>💌 Dacă ai întrebări, ne poți scrie oricând.</p>
        <p style="margin-top: 20px;">Cu drag,<br><strong style="color: #b76e79;">Echipa Allure 💜</strong></p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

async function sendReminderEmail(toEmail, appointment) {
  const mailOptions = {
    from: 'lorenaaa155@gmail.com',
    to: toEmail,
    subject: '⏰ Reminder pentru programarea ta Allure',
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #b76e79;">⏰ Salut, ${appointment.name || 'dragă clientă'}!</h2>
        <p>👋 Îți reamintim că ai o programare în curând la Allure:</p>
        <p>
          <strong>📅 Data:</strong> ${appointment.date}<br>
          <strong>🕒 Ora:</strong> ${appointment.time}<br>
          <strong>💄 Serviciu:</strong> ${appointment.selectedService}
        </p>
        <p>Te așteptăm cu zâmbetul pe buze! 😊</p>
        <p style="margin-top: 20px;">Cu stil și rafinament,<br><strong style="color: #b76e79;">Echipa Allure 💜</strong></p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

// === Express App Config ===
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appointmentsFile = path.join(__dirname, 'appointments.json');

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

// === Utilities ===
const readAppointments = () => {
  try {
    const data = fs.readFileSync(appointmentsFile, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAppointments = (data) => {
  fs.writeFileSync(appointmentsFile, JSON.stringify(data, null, 2));
};

// === Routes ===

app.post('/api/book-appointment', async (req, res) => {
  const raw = req.body;

  if (!raw.date || !raw.time || !raw.selectedService) {
    return res.status(400).json({ success: false, message: 'Date lipsă' });
  }

  const date = dayjs(raw.date).format('YYYY-MM-DD');
  const time = raw.time;

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ success: false, message: 'Formatul orei este invalid' });
  }

  const selectedService = raw.selectedService;
  const duration = services[selectedService] || 60;
  const totalDuration = duration + 30;

  const start = dayjs(`${date} ${time}`);
  const end = start.add(totalDuration, 'minute');

  const all = readAppointments();
  const overlap = all
    .filter((a) => a.date === date)
    .some((a) => {
      const aStart = dayjs(`${a.date} ${a.time}`);
      const aDuration = a.duration || (services[a.selectedService] || 60);
      const aEnd = aStart.add(aDuration, 'minute');
      return start.isBefore(aEnd) && end.isAfter(aStart);
    });

  if (overlap) {
    return res.status(409).json({ success: false, message: 'Interval ocupat' });
  }

  const appointment = {
    ...raw,
    date,
    time,
    duration: totalDuration,
    reminderSent: false
  };

  all.push(appointment);
  writeAppointments(all);

  try {
    await sendConfirmationEmail(appointment.email, appointment);
    res.json({ success: true, message: 'Programare salvată și email trimis.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Programare salvată, dar emailul a eșuat.', error: error.message });
  }
});

app.get('/api/appointments', (req, res) => {
  const { date } = req.query;
  const all = readAppointments();
  if (date) {
    return res.json(all.filter((a) => a.date === date));
  }
  res.json(all);
});

app.get('/api/available-slots', (req, res) => {
  const { date, service } = req.query;
  if (!date || !service) return res.status(400).json({ error: 'Missing params' });

  const duration = services[service] || 60;
  const buffer = 20;
  const appointments = readAppointments().filter((a) => a.date === date);
  const schedule = workSchedule[dayjs(date).day()];

  if (!schedule) return res.json([]);

  let current = dayjs(`${date} ${schedule.start}`);
  const endTime = dayjs(`${date} ${schedule.end}`);
  const slots = [];

  while (current.add(duration, 'minute').isBefore(endTime)) {
    const slot = current.format('HH:mm');
    const slotStart = current;
    const slotEnd = current.add(duration + buffer, 'minute');

    const overlaps = appointments.some(a => {
      const aStart = dayjs(`${a.date} ${a.time}`);
      const aDuration = a.duration || (services[a.selectedService] || 60);
      const aEnd = aStart.add(aDuration, 'minute');
      return slotStart.isBefore(aEnd) && slotEnd.isAfter(aStart);
    });

    if (!overlaps) slots.push(slot);
    current = current.add(duration + buffer, 'minute');
  }

  res.json(slots);
});

app.post('/api/test', (req, res) => {
  res.json({ success: true });
});

// === Cron Job pentru remindere ===
cron.schedule('*/30 * * * *', () => {
  const allAppointments = readAppointments();
  const now = dayjs();
  const in3Hours = now.add(3, 'hour');

  allAppointments
    .filter((a) => {
      const apptTime = dayjs(`${a.date} ${a.time}`);
      return apptTime.isAfter(now) && apptTime.isBefore(in3Hours) && !a.reminderSent;
    })
    .forEach(async (appointment) => {
      try {
        await sendReminderEmail(appointment.email, appointment);
        const all = readAppointments();
        const index = all.findIndex(a => a.email === appointment.email && a.date === appointment.date && a.time === appointment.time);
        if (index !== -1) {
          all[index].reminderSent = true;
          writeAppointments(all);
        }
      } catch (error) {
        console.error(`Eroare reminder pentru ${appointment.email}:`, error);
      }
    });
});

// === Pornire server ===
app.listen(PORT, () => {
  console.log(`✅ Serverul rulează la http://localhost:${PORT}`);
});
