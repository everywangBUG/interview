import type { CalendarProps } from './Calendar';
import './MonthCalendar.scss';  

const WEEK_LIST = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface MonthCalendarProps extends CalendarProps {

}

const MonthCalendar = (props: MonthCalendarProps) => {
    const { date } = props;
    console.log(date);

    return <div className='month_calendar'>
        <div className='month_calendar_weeks_list'>
            {
                WEEK_LIST.map((it, idx) => {
                    return <div
                        key={`${it}-${idx}`}
                        className='month_calendar_weeks_list_item'
                    >
                        {it}
                    </div>
                })
            }
        </div>
    </div>
}

export default MonthCalendar;