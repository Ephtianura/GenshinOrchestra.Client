import { useEffect, useState } from 'react';
import { signalRService } from './signalrService';

export function useSignalRState() {
    const [isConnectionLost, setIsConnectionLost] = useState(signalRService.isConnectionLost);

    useEffect(() => {
        const unsubscribe = signalRService.subscribeState(setIsConnectionLost);
        return unsubscribe;
    }, []);

    return { isConnectionLost };
}