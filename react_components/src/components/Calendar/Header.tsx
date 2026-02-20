import type { Dayjs } from "dayjs";
import './Header.scss';
import { useContext } from "react";
import { LocaleContext } from "./Calendar";
import allLocales from "./locale";

interface HeaderProps {
    curMonth: Dayjs;
    todayHandler: () => void;
    preHandler: () => void;
    postHandler: () => void;
}

const Header = (props: HeaderProps) => {
    const { todayHandler, preHandler, postHandler, curMonth } = props;

    const localeContext = useContext(LocaleContext);

    const CalendarLocal = allLocales[localeContext.locale];

    return <div className='header'>
        <div className='header_date'>
            <button className='header_date_pre' onClick={preHandler}>&lt;</button>
            <div>{curMonth.format(CalendarLocal.formatMonth)}</div>
            <button className='header_date_post' onClick={postHandler}>&gt;</button>
        </div>
        <button className='header_today' onClick={() => todayHandler()}>
            {CalendarLocal.today}
        </button>
    </div>
}

export default Header;