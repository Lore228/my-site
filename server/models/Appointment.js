import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  selectedService: String,
  date: String,
  time: String,
  duration: Number,
  reminderSent: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Appointment', appointmentSchema);
