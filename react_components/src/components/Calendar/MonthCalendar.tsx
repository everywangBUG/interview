import dayjs, { Dayjs } from 'dayjs';
import type { CalendarProps } from './Calendar';
import './MonthCalendar.scss';  

const WEEK_LIST = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

interface MonthCalendarProps extends CalendarProps {

}

const getAllDays = (date: Dayjs) => {
    // const day = date.daysInMonth();
    const firstDay = date.startOf('month');

    const startDate = firstDay.day();
    console.log(startDate, 'startDate');

    // const arr = new Array(6 * 7);
    const days = [];
    for (let i = 0; i <= 5; i++) {
        const arr1 = [];
        let a = startDate + 1;
        for (let j = 0; j <= 6; j++) {
            // 第一行i === 0的时候，如果startDate大于0，第一行数据从startDate开始计数
            if (i === 0) {
                if (startDate >= 0 && a <= 6) {
                    arr1[j] = {
                        currentDate: false,
                        date: firstDay.add(j - startDate, 'day').format('YYYY-MM-DD')
                    }
                    a++;
                } else {
                    arr1[j] = {
                        currentDate: false,
                        date: firstDay.add(j - startDate, 'day').format('YYYY-MM-DD')
                    }
                }
            } else {
            // 非第一行的时候
                arr1[j] = {
                    currentDate: false,
                    date: firstDay.add(i * 7 + j - startDate, 'day').format('YYYY-MM-DD')
                }
            }
        }
        days.push(arr1);
    }

    return days;
}

const MonthCalendar = (props: MonthCalendarProps) => {
    const { date } = props;


    console.log(date, 'date')
    const days = getAllDays(date);

    console.log(days)


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