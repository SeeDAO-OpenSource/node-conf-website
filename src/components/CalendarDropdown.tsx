import React, { useState, useRef, useEffect } from 'react';
import type { ConferenceData } from '../types/conference';
import dayjs from 'dayjs';

interface Props {
  data: ConferenceData;
}

export default function CalendarDropdown({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const eventDetails = {
    title: `SeeDAO第${data.season}季节点共识大会`,
    description: `SeeDAO第${data.season}季节点共识大会\n\n会议链接: ${data.meetingLink}`,
    startTime: dayjs(data.startDate),
    endTime: dayjs(data.endDate).add(1, 'day'), // Add one day to include the full last day
    location: data.meetingLink,
  };

  const generateGoogleCalendarLink = () => {
    const params = new URLSearchParams();
    params.append('action', 'TEMPLATE');
    params.append('text', eventDetails.title);
    params.append('details', eventDetails.description);
    params.append('location', eventDetails.location || '');
    params.append('dates', `${eventDetails.startTime.format('YYYYMMDD[T]HHmmss')}/${eventDetails.endTime.format('YYYYMMDD[T]HHmmss')}`);
    params.append('ctz', 'Asia/Shanghai');

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateOutlookOnlineLink = () => {
    const params = new URLSearchParams();
    params.append('path', '/calendar/action/compose');
    params.append('rru', 'addevent');
    params.append('subject', eventDetails.title);
    params.append('body', eventDetails.description);
    params.append('location', eventDetails.location || '');
    params.append('startdt', eventDetails.startTime.format('YYYY-MM-DD[T]HH:mm:ss'));
    params.append('enddt', eventDetails.endTime.format('YYYY-MM-DD[T]HH:mm:ss'));

    return `https://outlook.office.com/calendar/0/${params.toString()}`;
  };

  const generateYahooCalendarLink = () => {
    const params = new URLSearchParams();
    params.append('v', '60');
    params.append('title', eventDetails.title);
    params.append('desc', eventDetails.description);
    params.append('in_loc', eventDetails.location || '');
    params.append('st', eventDetails.startTime.format('YYYYMMDD[T]HHmmss'));
    params.append('et', eventDetails.endTime.format('YYYYMMDD[T]HHmmss'));

    return `https://calendar.yahoo.com/?${params.toString()}`;
  };

  const generateICSContent = () => {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SeeDAO//Node Conference//CN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${eventDetails.startTime.format('YYYYMMDD[T]HHmmss')}`,
      `DTEND:${eventDetails.endTime.format('YYYYMMDD[T]HHmmss')}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${eventDetails.location}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  };

  const downloadICSFile = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `seedao-conference-${eventDetails.startTime.format('YYYY-MM-DD-HH-mm')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAppleCalendar = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    window.location.href = `webcal:${url.substring(5)}`;
  };

  const calendarOptions = [
    {
      name: 'Google Calendar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.884 9.793H4v4.414h1.884c1.157 0 2.116-.95 2.116-2.207 0-1.258-.96-2.207-2.116-2.207z"/>
          <path fill="#FBBC05" d="M5.884 10.72H4v2.56h1.884c.714 0 1.294-.574 1.294-1.28 0-.705-.58-1.28-1.294-1.28z"/>
          <path fill="#4285F4" d="M18.116 9.793H20v4.414h-1.884c-1.157 0-2.116-.95-2.116-2.207 0-1.258.959-2.207 2.116-2.207z"/>
          <path fill="#34A853" d="M12 7c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"/>
        </svg>
      ),
      action: () => window.open(generateGoogleCalendarLink(), '_blank'),
    },
    {
      name: 'Apple Calendar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" fill="#999"/>
        </svg>
      ),
      action: openAppleCalendar,
    },
    {
      name: 'Outlook Online',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#0078D4" d="M21.179 4H7.821C6.815 4 6 4.815 6 5.821v12.358C6 19.185 6.815 20 7.821 20h13.358C22.185 20 23 19.185 23 18.179V5.821C23 4.815 22.185 4 21.179 4z"/>
          <path fill="#fff" d="M21.179 4H7.821C6.815 4 6 4.815 6 5.821v3.801l15 3.378V5.821C21 4.815 20.185 4 19.179 4z"/>
          <path fill="#0078D4" d="M6 9.622V18.179C6 19.185 6.815 20 7.821 20h13.358C22.185 20 23 19.185 23 18.179V13l-17-3.378z"/>
          <path fill="#0078D4" d="M1 5.65v12.7A1.65 1.65 0 002.65 20h4.7V4h-4.7A1.65 1.65 0 001 5.65z"/>
        </svg>
      ),
      action: () => window.open(generateOutlookOnlineLink(), '_blank'),
    },
    {
      name: 'Yahoo Calendar',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#6001D2" d="M13.131 2.736c-1.097 2.239-2.985 5.877-2.985 5.877h-.025s-1.888-3.638-2.985-5.877H2.31l5.783 10.694L2.31 24h4.826l2.985-5.877h.025L13.131 24h4.826l-5.783-10.57L17.957 2.736h-4.826z"/>
        </svg>
      ),
      action: () => window.open(generateYahooCalendarLink(), '_blank'),
    },
    {
      name: '下载 .ics 文件',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      ),
      action: downloadICSFile,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary inline-flex items-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2v3m8-3v3M3.5 8h17M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/>
        </svg>
        添加到日历
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2" role="menu">
            {calendarOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                role="menuitem"
              >
                <span className="text-gray-400">{option.icon}</span>
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}