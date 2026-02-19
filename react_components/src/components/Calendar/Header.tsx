import type { Dayjs } from "dayjs";
import './Header.scss';

interface HeaderProps {
    date: Dayjs
}

const Header = (props: HeaderProps) => {
    const { date } = props;

    return <div className='header'>
        <div className='header_date'>
            <button className='header_date_pre'>&lt;</button>
            <div>{date.format('YYYY年MM月')}</div>
            <button className='header_date_post'>&gt;</button>
        </div>
        <button className='header_today'>
            今天
        </button>
    </div>
}

export default Header;