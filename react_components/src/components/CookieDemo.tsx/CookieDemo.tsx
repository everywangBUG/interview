import { useEffect } from "react";
import useCokie from "../../hooks/useCokie";

const CookieDemo = () => {
    const [value, updateCookie, deleteCookie] = useCokie("cookieKey");
    
    useEffect(() => {
        deleteCookie();
    }, []);

    const updateCookieHandler = () => {
        updateCookie("8888");
    };

    return (
        <div>
            <p>cookie值：{value}</p>
            <button onClick={updateCookieHandler}>更新cookie</button>
            <button onClick={deleteCookie}>删除cookie</button>
        </div>
    );
};

export default CookieDemo;