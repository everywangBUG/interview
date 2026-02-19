import type { CSSProperties, ReactNode } from 'react';
import './Calendar.scss'
import Header from './Header';
import MonthCalendar from './MonthCalendar';
import { Dayjs } from 'dayjs';
import cs from 'classnames'
import classNames from 'classnames';

export interface CalendarProps {
    date: Dayjs;
    style?: CSSProperties;
    className?: string | string[];
    // 定制的日期显示，完全覆盖掉日期单元格
    dateRanger?: (currentDate: Dayjs) => ReactNode;
    // 定制的日期单元格，内容会被添加到单元格内，只在全屏的日历模式下生效
    dateInnerContent?: (currentDate: Dayjs) => ReactNode;
    // 国际化
    local?: string;
    onChange?: (date: Dayjs) => void;
}

const Calendar = (props: CalendarProps) => {
    const {
        className,
        style
    } = props;
    const classNames = cs('calendar', className);

    return <div className={classNames} style={style}>
        <Header {...props}/>
        <MonthCalendar {...props} />
    </div>
}

export default Calendar;