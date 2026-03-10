import { Dayjs } from 'dayjs';
import { CalendarProps, LocaleContext } from './Calendar';
import './MonthCalendar.scss';
import { useContext } from 'react';
import allLocales from './locale';
import cs from 'classnames';

const WEEK_LIST = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

interface MonthCalendarProps extends CalendarProps {
    selectHandler?: (date: Dayjs) => void,
    curMonth?: Dayjs,
    date: Dayjs
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

const renderDays = (days:Array<Array<{date: Dayjs, currentMonth: boolean}>>, props: MonthCalendarProps) => {
    const { date, dateRanger, dateInnerContent, selectHandler, curMonth } = props;

    return days.map((row, rowIndex) => {
        return <div key={rowIndex} className='month_calendar_all_days_row'>
            {
                row.map((col, colIndex) => {
                    return <div
                            key={colIndex}
                            className={'month_calendar_all_days_row_col' + ' ' + (col.currentMonth ? 'month_calendar_all_days_row_current' : '')}
                            onClick={() => selectHandler?.(col.date)}
                            >
                                <div className='month_calendar_all_days_row_date'>
                                    {
                                        dateRanger
                                            ? dateRanger(date)
                                            : (
                                                <>
                                                <div
                                                    className={cs(
                                                        'month_calendar_all_days_row_value',
                                                        `${(col.date.format('YYYY-MM-DD') === date?.format('YYYY-MM-DD') && curMonth?.format('MM') === date.format('MM'))
                                                            ? 'month_calendar_all_days_row_selected'
                                                            : ''
                                                        }`
                                                    )}
                                                >
                                                    {col.date.format('DD')}
                                                </div>
                                                {
                                                    dateInnerContent && 
                                                    <div className='month_calendar_all_days_row_content'>
                                                        {dateInnerContent(date)} 
                                                    </div>
                                                }
                                                </>
                                              )
                                    }
                                </div>
                            </div>
                })
            }
            </div>
    })
}

const MonthCalendar = (props: MonthCalendarProps) => {
    const { date } = props;

    const localeContext = useContext(LocaleContext);

    const CalendarLocal = allLocales[localeContext.locale]

    const days = getAllDays(date);

    return <div className='month_calendar'>
        <div className='month_calendar_weeks_list'>
            {
                WEEK_LIST.map((it, idx) => {
                    return <div
                        key={`${it}-${idx}`}
                        className='month_calendar_weeks_list_item'
                    >
                        {CalendarLocal.week[it]}
                    </div>
                })
            }
        </div>
        <div className='month_calendar_all_days'>
            {
                renderDays(days, props)
            }
        </div>
    </div>
}

export default MonthCalendar;