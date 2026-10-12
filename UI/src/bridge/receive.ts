type EventCallback = (payload: any) => void;

type PhotinoExternal = {
    receiveMessage?: (callback: (rawMessage: string) => void) => void;
};

class PhotinoBridge {
    private listeners: Map<string, EventCallback[]> = new Map();

    constructor() {
        const external = window.external as PhotinoExternal | undefined;
        external?.receiveMessage?.((rawMessage: string) => {
            try {
                const { action, payload } = JSON.parse(rawMessage);
                const callbacks = this.listeners.get(action);
                if (callbacks) {
                    callbacks.forEach(cb => cb(payload));
                }
            } catch (e) {
                console.error("Ошибка получения сообщения от C#", e);
            }
        });
    }

    public on(action: string, callback: EventCallback) {
        if (!this.listeners.has(action)) {
            this.listeners.set(action, []);
        }
        this.listeners.get(action)!.push(callback);

        return () => {
            const list = this.listeners.get(action) || [];
            this.listeners.set(action, list.filter(cb => cb !== callback));
        };
    }
}

export const receive = new PhotinoBridge();