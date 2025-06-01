// BookingDialogContext.jsx
import { createContext, useState, useCallback } from 'react';

export const BookingDialogContext = createContext();

export function BookingDialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const openDialog = useCallback((service) => {
    setSelectedService(service || '');
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setSelectedService('');
  }, []);

  return (
    <BookingDialogContext.Provider
      value={{ open, selectedService, openDialog, closeDialog }}
    >
      {children}
    </BookingDialogContext.Provider>
  );
}
