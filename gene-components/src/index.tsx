import Calendar, { CalendarProps } from "./Calendar/Calendar";
import Watermark, { WatermarkProps } from "./Watermark/Watermark";
import { MessageProps, Position, MessageRef } from "./Message/Message";
import LazyLoad from "./LazyLoad/LazyLoad";
import { useMessage } from "./Message/useMessage";
import { ConfigProvider } from "./Message/CinfigProvider";

export {
    Calendar,
    Watermark,
    ConfigProvider,
    useMessage,
    LazyLoad
}

export type {
    CalendarProps,
    WatermarkProps,
    MessageProps,
    Position,
    MessageRef,
}