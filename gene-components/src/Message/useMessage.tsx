import { useContext } from "react";
import { ConfigContext } from "./CinfigProvider";
import { MessageRef } from "./Message";

export const useMessage = (): MessageRef => {
    const { messageRef } = useContext(ConfigContext);

    if (!messageRef) {
        throw new Error('请在最外层添加ConfigProvider组件');
    }

    return messageRef.current;
}
