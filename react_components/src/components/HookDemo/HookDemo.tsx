import { useEffect, useState } from "react";
import useLifeCycles from "../../hooks/useLifeCycles";
import useMountedState from "../../hooks/useMountedState";

const HookDemo = () => {
    const [, setNum] = useState(0);
    const isMounted = useMountedState();
    
    useLifeCycles(() => console.log('MOUNTED'), () => console.log('UNMOUNTED'));

    useEffect(() => {
        setTimeout(() => {
            setNum(100);
        }, 2000)
    }, [])

    return <div>
        {isMounted() ? 'mounted' : 'pending' }
    </div>
}

export default HookDemo;