import type { CSSProperties, ReactNode } from 'react';
import './Calendar.scss'
import Header from './Header';
import MonthCalendar from './MonthCalendar';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames'
import { createContext, useState } from 'react';

export interface CalendarProps {
    date: Dayjs;
    style?: CSSProperties;
    className?: string | string[];
    // 定制的日期显示，完全覆盖掉日期单元格
    dateRanger?: (currentDate: Dayjs) => ReactNode;
    // 定制的日期单元格，内容会被添加到单元格内，只在全屏的日历模式下生效
    dateInnerContent?: (currentDate: Dayjs) => ReactNode;
    // 国际化
    locale?: string;
    onChange?: (date: Dayjs) => void;
}

export interface LocaleContextType {
    locale: string
}

export const LocaleContext = createContext<LocaleContextType>({
    locale: 'zh-CN'
})

const Calendar = (props: CalendarProps) => {
    const {
        className,
        style,
        locale,
        date,
        onChange
    } = props;
    const classNames = cs('calendar', className);

    const [curDate, setCurDate] = useState<Dayjs>(date)

    const selectHandler = (date: Dayjs) => {
        setCurDate?.(date);
        onChange?.(date)
    }

    const todayHandler = (date: Dayjs) => {
        setCurDate?.(date);
        onChange?.(date);
    }
    
    const preHandler = () => {
        setCurDate(dayjs(curDate).subtract(-1, 'month'));
    }

    const postHandler = () => {
        setCurDate(dayjs(curDate).subtract(-1, 'month'));
    }

    return (
        <LocaleContext.Provider value={{locale: locale || navigator.language}}>
            <div className={classNames} style={style}>
                <Header {...props} todayHandler={todayHandler} preHandler={preHandler} postHandler={postHandler} curMonth={curDate}/>
                <MonthCalendar {...props} date={curDate} selectHandler={selectHandler}/>
            </div>
        </LocaleContext.Provider>
    )
}

export default Calendar;