import './Calendar.scss'
import MonthCalendar from './MonthCalendar';
import { Dayjs } from 'dayjs';

// daysInMonth 当月的天数
// startOf 当月的第一天
// endOf 当月的最后一天

export interface CalendarProps {
    date: Dayjs
}

const Calendar = (props: CalendarProps) => {
    return <div className='calendar'>
        <MonthCalendar {...props} />
    </div>
}

export default Calendar;