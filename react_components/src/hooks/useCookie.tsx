import { useCallback, useState } from 'react';
import Cookies from 'js-cookie';

// name: cookie的值
// expires: 过期时间
// max-age: 有效期，优先级高于expires
// domain: 哪些域名可以访问cookie
// path: 哪些路径可以访问cookie
// document.cookie = "auth_token=secret; secure"; 仅通过 HTTPS 传输
// HttpOnly: 防止 JavaScript 访问，只能通过 HTTP 请求传输
// SameSite: 控制跨站请求是否发送 Cookie

const useCookie = (cookieName: string): [
    string | null, (newValue: string, options?: Cookies.CookieAttributes) => void, () => void, 
] => {
    const [value, setValue] = useState<string | null>(() => Cookies.get(cookieName) || null);

    const updateCookie = useCallback((newValue: string, options?: Cookies.CookieAttributes) => {
        Cookies.set(cookieName, newValue, options);
        setValue(newValue);
    }, [cookieName]);

    const deleteCookie = useCallback(() => {
        Cookies.remove(cookieName);
        setValue(null);
    }, [cookieName])
    
    return [value, updateCookie, deleteCookie];
}

export default useCookie;