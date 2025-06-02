import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useState, useContext, useEffect } from 'react';
import { BookingDialogContext } from '../context/BookingDialogContext';
import dayjs from 'dayjs';
import 'dayjs/locale/ro';

export default function BookingDialog() {
  const { open, selectedService, closeDialog } = useContext(BookingDialogContext);

  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null,
    time: null,
    selectedService: '',
  });

  const serviceDurations = {
    'Machiaj de zi': 60,
    'Machiaj de ocazie': 90,
    'Machiaj pentru ședință foto': 120,
    'Machiaj mireasă': 150,
    'Programare generală': 60,
  };

  const workHours = {
    0: [7, 22],
    1: [17, 22],
    2: [17, 22],
    3: [17, 22],
    4: [17, 22],
    5: [17, 22],
    6: [6, 22],
  };

  const breakMinutes = 30;
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [bookedHours, setBookedHours] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (selectedService) {
      setBookingData((prev) => ({ ...prev, selectedService }));
    }
  }, [selectedService]);

  useEffect(() => {
    if (bookingData.date) {
      const dateStr = bookingData.date.format('YYYY-MM-DD');
      fetch(`${API_BASE}/api/appointments?date=${dateStr}`)
      .then((res) => res.json())
        .then((data) => setBookedHours(data))
        .catch(() => setBookedHours([]));
    } else {
      setBookedHours([]);
    }
  }, [bookingData.date]);

  const validateField = (field, value) => {
    switch (field) {
      case 'name': return value.trim() === '' ? 'Numele este obligatoriu' : '';
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email invalid';
      case 'phone': return /^[0-9]{9,15}$/.test(value) ? '' : 'Număr invalid';
      case 'date': return value ? '' : 'Selectează o dată';
      case 'time': return value ? '' : 'Selectează o oră';
      case 'selectedService': return value.trim() === '' ? 'Selectează un serviciu' : '';
      default: return '';
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, bookingData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    console.log(`🛠️ Changed ${field}:`, value);
    if (field === 'time' && value && !dayjs.isDayjs(value)) {
      value = dayjs(value);
    }
    if (field === 'date' && value && !dayjs.isDayjs(value)) {
      value = dayjs(value);
    }
    setBookingData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async () => {
    const duration = serviceDurations[bookingData.selectedService] + breakMinutes;
    const parsedDate = dayjs(bookingData.date);
    const parsedTime = dayjs(bookingData.time);

    if (!parsedDate.isValid()) {
      setErrors((prev) => ({ ...prev, date: 'Data selectată nu este validă' }));
      return;
    }

    if (!parsedTime.isValid()) {
      setErrors((prev) => ({ ...prev, time: 'Ora selectată nu este validă' }));
      return;
    }

    const dataToSend = {
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.phone,
      selectedService: bookingData.selectedService,
      date: parsedDate.format('YYYY-MM-DD'),
      time: parsedTime.format('HH:mm'),
      duration,
    };

    const newErrors = {};
    for (let field in bookingData) {
      newErrors[field] = validateField(field, bookingData[field]);
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/book-appointment`, {
      method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (result.success) {
        setSuccess(`Mulțumim, ${bookingData.name}! Programarea a fost trimisă cu succes.`);
        setBookingData({ name: '', email: '', phone: '', date: null, time: null, selectedService: '' });
        setTimeout(() => {
          closeDialog();
          setSuccess(null);
        }, 2000);
      } else {
        setSuccess('Eroare la trimitere.');
      }
    } catch (err) {
      console.error("🚨 Eroare de rețea:", err);
      setSuccess('Eroare de rețea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>Programează-te</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ my: 1 }} error={!!errors.selectedService}>
          <InputLabel>Serviciu</InputLabel>
          <Select
            value={bookingData.selectedService}
            label="Serviciu"
            onChange={(e) => handleChange('selectedService', e.target.value)}
            onBlur={() => handleBlur('selectedService')}
          >
            <MenuItem value="">Selectează...</MenuItem>
            <MenuItem value="Machiaj de zi">Machiaj de zi</MenuItem>
            <MenuItem value="Machiaj pentru ședință foto">Machiaj pentru ședință foto</MenuItem>
            <MenuItem value="Machiaj de ocazie">Machiaj de ocazie</MenuItem>
            <MenuItem value="Machiaj mireasă">Machiaj mireasă</MenuItem>
            <MenuItem value="Programare generală">Programare generală</MenuItem>
          </Select>
          {errors.selectedService && <FormHelperText>{errors.selectedService}</FormHelperText>}
        </FormControl>

        <TextField fullWidth label="Nume" value={bookingData.name} onChange={(e) => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} error={!!errors.name} helperText={errors.name} sx={{ my: 1 }} />
        <TextField fullWidth label="Email" value={bookingData.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} error={!!errors.email} helperText={errors.email} sx={{ my: 1 }} />
        <TextField fullWidth label="Telefon" value={bookingData.phone} onChange={(e) => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} error={!!errors.phone} helperText={errors.phone} sx={{ my: 1 }} />

        <DatePicker
          label="Data"
          value={bookingData.date}
          onChange={(val) => handleChange('date', val)}
          onBlur={() => handleBlur('date')}
          disablePast
          minDate={dayjs()}
          maxDate={dayjs().add(2, 'month')}
          format="DD.MM.YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.date,
              helperText: errors.date,
              sx: { my: 1 },
            },
          }}
        />

        <TimePicker
          label="Ora"
          value={bookingData.time}
          onChange={(val) => handleChange('time', val)}
          onBlur={() => handleBlur('time')}
          ampm={false}
          minutesStep={15}
          minTime={bookingData.date ? dayjs().hour(workHours[bookingData.date.day()][0]).minute(0) : dayjs().hour(0).minute(0)}
          maxTime={bookingData.date ? dayjs().hour(workHours[bookingData.date.day()][1]).minute(0) : dayjs().hour(23).minute(59)}
          shouldDisableTime={(value, type) => {
            if (!bookingData.date || !bookingData.selectedService || type !== 'minutes' || !bookingData.time) return false;
            const candidate = dayjs().set('hour', bookingData.time.hour()).set('minute', value);
            const start = candidate;
            const end = candidate.add(serviceDurations[bookingData.selectedService] + breakMinutes, 'minute');
            return bookedHours.some((booked) => {
              const [h, m] = booked.time.split(':').map(Number);
              const bookedStart = dayjs().hour(h).minute(m);
              const bookedEnd = bookedStart.add(serviceDurations[booked.selectedService] + breakMinutes, 'minute');
              return start.isBefore(bookedEnd) && end.isAfter(bookedStart);
            });
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors.time,
              helperText: errors.time,
              sx: { my: 1 },
            },
          }}
        />

        {success && <p style={{ marginTop: 10, color: 'green' }}>{success}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Anulează</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Trimite'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
