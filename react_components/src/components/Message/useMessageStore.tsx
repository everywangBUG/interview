import { useState } from "react";
import { MessageProps, Position } from "./Message";

export interface MessageList {
    top: MessageProps[];
    bottom: MessageProps[];
}

export interface MessageListFunction {
    messageList: MessageList;
    add: (messageProps: MessageProps) => number;
    update: (id: number, messageProps: MessageProps) => void;
    remove: (id: number) => void;
    clearAll: () => void;
}

const useMessageStore = (defaultPosition: Position): MessageListFunction => {
    const [messageList, setMessageList] = useState<MessageList>({ top: [], bottom: []});
    
    return {
        messageList,
        add: (messageProps: MessageProps) => {
            const id = getId(messageProps);

            setMessageList((preState) => {
                // 根据id查找有没有已有的message，如果有则不添加，返回之前的
                if (messageProps?.id) {
                    const position = getMessagePosition(messageList, id);
                    if (position) {
                        return preState;
                    }
                }
                const position = messageProps.position ||  defaultPosition;
                const isTop = position.includes('top');

                const messages = isTop ? [{...messageProps, id}, ...(preState[position])] : [...(preState[position]), {...messageProps, id}]

                return {
                    ...preState,
                    [position]: messages
                }
            });
            return id;
        },

        update: (id: number, messageProps: MessageProps) => {
            if (!id) return;
            
            setMessageList((preState) => {
                const nextState = {...preState};
                const { position, idx } = findMessage(nextState, id);
                if (position && idx > -1) {
                    nextState[position][idx] = {...nextState[position][idx], ...messageProps};
                }
                return nextState;
            })
        },

        remove: (id: number) => {
            setMessageList((preState) => {
                const nextState = { ...preState };
                const { position, idx } = findMessage(nextState, id);
                if (position && idx > -1) {
                    nextState[position].splice(0, idx);
                }
                return nextState;
            })
        },

        clearAll: () => {
            setMessageList({top: [], bottom: []});
        }
    };
}

// 生成一个新的id
let count = 0;
export function getId(messageProps: MessageProps) {
    // 如果list中有id，直接返回list中的id
    if (messageProps.id) {
        return messageProps.id;
    }
    // 没有计数id+1
    count += 1;
    // 返回计数
    return count;
}

// 获取消息的位置
export function getMessagePosition(messageList: MessageList, id: number) {
    // 遍历top和bottom中的数组，查看有没有对应的Message
    for (const [position, list] of Object.entries(messageList)) {
        const _list = list as MessageProps[];
        if (_list.find(item => item.id === id)) {
            return position as Position;
        }
    }
}

export function findMessage(messageList: MessageList, id: number) {
    const position = getMessagePosition(messageList, id);
    const idx = position ? messageList[position].findIndex(it => it.id === id) : -1;

    return {
        position,
        idx
    }
}

export default useMessageStore;