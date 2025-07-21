import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'
import "../calendar.css";
import { DatesSetArg, EventContentArg } from '@fullcalendar/core';
import { calculateDailyBalance } from '../utils/financeCalculations';
import { Balance, CalendarContent, Transaction } from '../types';
import { formatCurrency } from '../utils/formatting';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { start } from 'repl';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

interface CalendarProps {
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>,
  currentDay: string,
  today: string,
  onDateClick: (dateInfo: DateClickArg) => void,
}
const Calendar = ({setCurrentDay,currentDay,today,onDateClick}: CalendarProps) => {
  const theme = useTheme();
  const monthlyTransactions = useMonthlyTransactions();
  const {setCurrentMonth} = useAppContext ();
  const dailyBalances = calculateDailyBalance(monthlyTransactions);
  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: 'red',
  }
  const createCalendarEvents = (dailyBalances: Record<string,Balance>): CalendarContent[] => {
  return Object.keys(dailyBalances).map((date) => {
    const {income, expense, balance} = dailyBalances[date];
    return {
      start: date,
      income:formatCurrency(income),
      expense:formatCurrency(expense),
      balance: formatCurrency(balance),
    }
});
  }
  const backgroundEvents = {
    start: currentDay,
    end: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  };
  const calendarEvents = createCalendarEvents(dailyBalances);

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (<div>
      <div className='money' id="event-income">
        {eventInfo.event.extendedProps.income}
      </div>

      <div className='money' id="event-expense">
        {eventInfo.event.extendedProps.expense}
      </div>

      <div className='money' id="event-balance">
        {eventInfo.event.extendedProps.balance}
      </div>
    </div>)
  }
  const handleDateSet = (dateSetInfo: DatesSetArg) => {
    const currentMonth = dateSetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if(isSameMonth(todayDate, currentMonth)){
      setCurrentDay(today);
    }
  }

  return (
    <FullCalendar
    locale ={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={[...calendarEvents,backgroundEvents]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
      />
  )
}

export default Calendar