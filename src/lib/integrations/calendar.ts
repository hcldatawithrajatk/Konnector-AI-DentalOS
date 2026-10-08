// =============================================================================
// KONNECTOR AI DENTALOS — CALENDAR SYNCHRONIZATION CONNECTOR
// =============================================================================

export interface CalendarEventPayload {
  clinicName: string;
  clinicAddress: string;
  doctorName: string;
  patientName: string;
  patientEmail?: string;
  treatmentName: string;
  startTime: string; // ISO 8601
  durationMins: number;
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) file string for universal calendar adding
 * (works on iPhone Apple Calendar, Google Calendar, and Microsoft Outlook).
 */
export function generateICalendarInvite(event: CalendarEventPayload): string {
  const start = new Date(event.startTime);
  const end = new Date(start.getTime() + event.durationMins * 60 * 1000);

  const formatICSDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Konnector AI DentalOS//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:apt-${Date.now()}@konnectordental.app`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:Dental Appointment: ${event.treatmentName} with ${event.doctorName}`,
    `DESCRIPTION:Confirmed appointment for ${event.patientName} at ${event.clinicName}.\\nProcedure: ${event.treatmentName}\\nDoctor: ${event.doctorName}\\nAddress: ${event.clinicAddress}`,
    `LOCATION:${event.clinicAddress}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Checks if a requested appointment slot conflicts with existing appointments.
 */
export function checkSlotConflict(
  existingAppointments: Array<{ appointmentTime: string; durationMins: number; doctorId: string }>,
  targetDoctorId: string,
  requestedStartTime: string,
  durationMins: number = 30
): boolean {
  const reqStart = new Date(requestedStartTime).getTime();
  const reqEnd = reqStart + durationMins * 60 * 1000;

  return existingAppointments.some((apt) => {
    if (apt.doctorId !== targetDoctorId) return false;
    const aptStart = new Date(apt.appointmentTime).getTime();
    const aptEnd = aptStart + apt.durationMins * 60 * 1000;

    // Check overlap
    return reqStart < aptEnd && reqEnd > aptStart;
  });
}
