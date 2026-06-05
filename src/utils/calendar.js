// Calendar utilities: generate Google Calendar URL + ICS file download.
// All client-side, no backend needed.

function formatGoogleDate(dateString, includeTime = true) {
  // dateString is 'YYYY-MM-DD'
  // For all-day events, Google Calendar uses YYYYMMDD
  // For timed events, it uses YYYYMMDDTHHMMSSZ (UTC)
  if (!dateString) return '';
  const clean = dateString.replace(/-/g, '');
  if (!includeTime) return clean;
  return `${clean}T090000Z`; // default 9 AM UTC (~2:30 PM IST)
}

export function buildGoogleCalendarUrl(event) {
  if (!event) return '#';
  const title = encodeURIComponent(event.name);
  const details = encodeURIComponent(
    `${event.description}\n\nVenue: ${event.venue}\nTime: ${event.time}\nCost: ${event.cost}\n\nMore info: https://mumbai-events.sagarjethi.com/events/${(event.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}\nRegister: ${event.link}`
  );
  const location = encodeURIComponent(event.venue || 'Mumbai, India');

  // Use all-day format — safer than assuming specific times
  const start = formatGoogleDate(event.startDate, false);
  // End date in Google all-day format is exclusive; add 1 day
  const endDateObj = new Date(event.endDate || event.startDate);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const end = endDateObj.toISOString().split('T')[0].replace(/-/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}

function escapeIcs(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function buildIcsContent(event) {
  if (!event) return '';
  const uid = `${(event.name || 'event').toLowerCase().replace(/\s+/g, '-')}@mumbai-events.sagarjethi.com`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtstart = (event.startDate || '').replace(/-/g, '');
  const endDateObj = new Date(event.endDate || event.startDate);
  endDateObj.setDate(endDateObj.getDate() + 1);
  const dtend = endDateObj.toISOString().split('T')[0].replace(/-/g, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mumbai Tech Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${escapeIcs(event.name)}`,
    `DESCRIPTION:${escapeIcs(event.description)}\\n\\nRegister: ${escapeIcs(event.link)}`,
    `LOCATION:${escapeIcs(event.venue)}`,
    `URL:${escapeIcs(event.link)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(event) {
  const ics = buildIcsContent(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(event.name || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
