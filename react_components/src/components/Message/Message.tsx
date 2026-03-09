import { CSSProperties, FC, ReactNode, useMemo, createRef, RefObject, Ref, forwardRef } from "react";
import useMessageStore, { MessageListFunction } from "./useMessageStore";
import './Message.scss';
import useTimer from "./useTimer";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";

export type Position = 'top' | 'bottom';

type RefMap = Map<number, RefObject<HTMLDivElement | null>>;

export interface MessageProps {
    style?: CSSProperties;
    className?: string | string[];
    content: ReactNode;
    duration?: number;
    id?: number;
    position?: Position;
    onClose?: (id: number) => void;
    nodeRef?: RefObject<HTMLDivElement>;
}

export type MessageRef = Omit<MessageListFunction, 'messageList'>;

const MessageItem: FC<MessageProps> = (it) => {
    const {onMouseEnter, onMouseLeave} = useTimer({id: it.id!, remove: it.onClose!, duration: it.duration});

    return <div
                ref={it.nodeRef}
                className='messages-item'
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {it.content}
            </div>
}

const MessageComponent = (props: { }, ref: Ref<MessageRef>) => {
    const { messageList, add, update, remove, clearAll  } = useMessageStore('top');

    const positions = Object.keys(messageList!) as Position[];

    if('current' in ref!) {
        ref.current = {
            add,
            update,
            remove,
            clearAll
        }
    }
    // useImperativeHandle(ref, (): MessageRef => {
        // return {
        //     add,
        //     remove,
        //     update,
        //     clearAll
        // }
    // }, [add, remove, update, clearAll]);

    const refs = useMemo(() => new Map<number, RefObject<HTMLDivElement | null>>(), []);

    const getOrCreateRef = (refs: RefMap, id: number) => {
        if (!refs.has(id)) {
            const newRef = createRef<HTMLDivElement>();
            refs.set(id, newRef);
        }
        return refs.get(id)!;
    }

    const messageWrapper = <div className='message-wrapper'>
                {
                    positions.map(position => {
                        return messageList[position].length > 0
                        && <div key={position} className={`message-wrapper-${position}`}>
                                        <TransitionGroup>
                                            { messageList[position].map((it) => {
                                            const nodeRef = getOrCreateRef(refs, it.id!);

                                             return <CSSTransition
                                                        nodeRef={nodeRef}
                                                        timeout={1000}
                                                        key={it.id}
                                                        classNames='messages'
                                                    >
                                                        <MessageItem
                                                            nodeRef={nodeRef}
                                                            {...it}
                                                            onClose={remove}
                                                        />
                                                </CSSTransition>
                                            }
                                            )} 
                                        </TransitionGroup>
                                    </div>
                    })
                }
        </div>

        const show = positions.map(position => messageList[position].length > 0).some(it => it);
        const el = useMemo(() => {

            if (!show) return;
            const div = document.createElement('div');
            
            div.className = 'wrapper';
            
            document.body.appendChild(div);
            
            return div;
        }, [show])

        return el && createPortal(messageWrapper, el);
}

export const Message = forwardRef<MessageRef, {}>(MessageComponent);