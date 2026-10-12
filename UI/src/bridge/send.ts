interface BridgeRequest {
    id: string;
    method: string;
    params: Record<string, unknown>;
}

interface BridgeResponse {
    id: string;
    data: unknown;
    error: string | null;
}

interface PhotinoExternal extends External {
    receiveMessage: (callback: (message: string) => void) => void;
    sendMessage: (message: string) => void;
}

class PhotinoBridge {
    private pendingRequests = new Map<string, { resolve: (value: any) => void; reject: (reason: any) => void }>();

    constructor() {
        const external = typeof window !== 'undefined' ? window.external as PhotinoExternal : undefined;
        if (external && typeof external.receiveMessage === 'function') {
            external.receiveMessage((message: string) => {
                this.handleIncomingMessage(message);
            });
        }
    }

    private handleIncomingMessage(message: string): void {
        try {
            const response: BridgeResponse = JSON.parse(message);
            const pending = this.pendingRequests.get(response.id);

            if (!pending) {
                return;
            }

            this.pendingRequests.delete(response.id);

            if (response.error) {
                pending.reject(new Error(response.error));
            } else {
                pending.resolve(response.data);
            }
        } catch (error) {
            console.error("Ошибка получения сообщения от C#:", error);
        }
    }

    public invoke<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();
            this.pendingRequests.set(id, { resolve, reject });

            const request: BridgeRequest = {
                id,
                method,
                params
            };

            const external = window.external as PhotinoExternal;
            if (external && typeof external.sendMessage === 'function') {
                external.sendMessage(JSON.stringify(request));
            } else {
                this.pendingRequests.delete(id);
                reject(new Error("Photino external interface is not available."));
            }
        });
    }
}

export const send = new PhotinoBridge();