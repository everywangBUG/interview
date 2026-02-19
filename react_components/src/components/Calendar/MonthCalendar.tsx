import { Dayjs } from 'dayjs';
import type { CalendarProps } from './Calendar';
import './MonthCalendar.scss';  

const WEEK_LIST = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface MonthCalendarProps extends CalendarProps {

}

const getAllDays = (date: Dayjs): Array<Array<{date: Dayjs, currentMonth: boolean}>>  => {
    const firstDay = date.startOf('month');

    const startDate = firstDay.day();
    
    const days = [];
    for (let i = 0; i <= 5; i++) {
        const rows = [];
        let start = startDate + 1;
        for (let j = 0; j <= 6; j++) {
            // 第一行i === 0的时候，如果startDate大于0，第一行数据从startDate开始计数
            if (i === 0) {
                if (startDate >= 0 && start <= 6) {
                    rows[j] = {
                        currentMonth: firstDay.add(j - startDate, 'day').month() === date.month(),
                        date: firstDay.add(j - startDate, 'day')
                    }
                    start++;
                } else {
                    rows[j] = {
                        currentMonth: firstDay.add(j - startDate, 'day').month() === date.month(),
                        date: firstDay.add(j - startDate, 'day')
                    }
                }
            } else {
            // 非第一行的时候
            rows[j] = {
                    currentMonth: firstDay.add(i * 7 + j - startDate, 'day').month() === date.month(),
                    date: firstDay.add(i * 7 + j - startDate, 'day')
                }
            }
        }
        days.push(rows);
    }

    return days;
}

const MonthCalendar = (props: MonthCalendarProps) => {
    const { date } = props;

    const days = getAllDays(date);

    const renderDays = (days:Array<Array<{date: Dayjs, currentMonth: boolean}>>) => {
        return days.map((row, rowIndex) => {
            return <div key={rowIndex} className='month_calendar_all_days_row'>
                {
                    row.map((col, colIndex) => {
                        return <div
                                key={colIndex}
                                className={'month_calendar_all_days_row_col' + ' ' + (col.currentMonth ? 'month_calendar_all_days_row_current' : '')}
                                >
                                    {col.date.format('DD')}
                                </div>
                    })
                }
                </div>
        })
    }

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
        <div className='month_calendar_all_days'>
            {
                renderDays(days)
            }
        </div>
    </div>
}

export default MonthCalendar;