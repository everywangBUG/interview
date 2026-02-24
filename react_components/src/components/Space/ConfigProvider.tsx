import React from "react";
import { SizeType } from "./Space";

interface ConfigContextType {
    space?: {
        size?: SizeType,
    }
}

export const ConfigContext = React.createContext<ConfigContextType>({});