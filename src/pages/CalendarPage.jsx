import { useEffect, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ro from 'date-fns/locale/ro';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import {
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

const locales = { ro };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/appointments')
      .then((res) => res.json())
      .then((data) => setAllAppointments(data));
  }, []);

  useEffect(() => {
    const mapped = allAppointments
      .filter(app => {
        if (selectedDate && app.date !== selectedDate) return false;
        if (selectedService && app.selectedService !== selectedService) return false;
        return true;
      })
      .map(app => {
        const start = dayjs(`${app.date} ${app.time}`, 'YYYY-MM-DD HH:mm');
        const duration = Number(app.duration) || 60;
  
        return {
          title: `${app.selectedService} - ${app.name}`,
          start: start.toDate(),
          end: start.add(duration, 'minute').toDate(),
          raw: app
        };
      });
      console.log('Programări mapate pentru calendar:', mapped);
    setEvents(mapped);
  }, [allAppointments, selectedDate, selectedService]);  

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Calendarul Programărilor
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrează după zi</InputLabel>
          <Select
            value={selectedDate}
            label="Filtrează după zi"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <MenuItem value="">Toate</MenuItem>
            {[...new Set(allAppointments.map((a) => a.date))].map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrează după serviciu</InputLabel>
          <Select
            value={selectedService}
            label="Filtrează după serviciu"
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <MenuItem value="">Toate</MenuItem>
            {[...new Set(allAppointments.map((a) => a.selectedService))].map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={(event) => setSelectedEvent(event)}
        style={{ height: 600 }}
        messages={{
          next: 'Următorul',
          previous: 'Anterior',
          today: 'Azi',
          month: 'Lună',
          week: 'Săptămână',
          day: 'Zi',
          agenda: 'Agendă',
          date: 'Dată',
          time: 'Oră',
          event: 'Eveniment',
          noEventsInRange: 'Nu există programări în această perioadă.',
        }}
      />

      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <DialogTitle>Detalii Programare</DialogTitle>
        <DialogContent>
          <Typography><strong>Serviciu:</strong> {selectedEvent?.raw?.selectedService}</Typography>
          <Typography><strong>Nume:</strong> {selectedEvent?.raw?.name}</Typography>
          <Typography><strong>Email:</strong> {selectedEvent?.raw?.email}</Typography>
          <Typography><strong>Telefon:</strong> {selectedEvent?.raw?.phone}</Typography>
          <Typography><strong>Dată:</strong> {selectedEvent?.raw?.date}</Typography>
          <Typography><strong>Ora:</strong> {selectedEvent?.raw?.time}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Închide</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
