import { createContext, PropsWithChildren, RefObject, useRef } from "react"
import { MessageRef, Message } from "./Message";

interface ConfigProviderProps {
    messageRef?: RefObject<MessageRef>;
}

export const ConfigContext = createContext<ConfigProviderProps>({});

export const ConfigProvider = (props: PropsWithChildren) => {
    const { children } = props;

    const messageRef = useRef<MessageRef>(null!);
    
    return <ConfigContext.Provider value={{ messageRef }}>
        <Message ref={messageRef}></Message>
        {children}
    </ConfigContext.Provider>
}