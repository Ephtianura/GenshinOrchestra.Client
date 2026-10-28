import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

type ConnectionStateCallback = (isLost: boolean) => void;

class SignalRService {
    private connection: HubConnection;
    private isStarted = false;
    private listeners: Set<ConnectionStateCallback> = new Set();
    public isConnectionLost = false;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5002/hub/')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.None)
            .build();

        this.connection.onreconnecting(() => {
            this.setConnectionLost(true);
        });

        this.connection.onreconnected(() => {
            console.log('Соединение с сервером восстановлено');
            this.setConnectionLost(false);
        });

        this.connection.onclose(() => {
            this.setConnectionLost(true);
        });

        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                console.log('Интернет снова в деле! Пробуем реконнект...');
                // Если интернета не было или соединение разорвано — сразу пробуем стартовать
                if (this.isConnectionLost || this.connection.state === HubConnectionState.Disconnected) {
                    this.start();
                }
            });

            window.addEventListener('offline', () => {
                console.warn('Интернет капут :(');
                this.setConnectionLost(true);
            });
        }
    }

    private setConnectionLost(state: boolean) {
        if (this.isConnectionLost !== state) {
            this.isConnectionLost = state;
            this.listeners.forEach((callback) => callback(state));
        }
    }

    public subscribeState(callback: ConnectionStateCallback): () => void {
        this.listeners.add(callback);
        callback(this.isConnectionLost);

        return () => {
            this.listeners.delete(callback);
        };
    }

    public async start(): Promise<void> {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            this.setConnectionLost(true);
            return;
        }

        if (this.isStarted && this.connection.state === HubConnectionState.Connected) return;

        try {
            await this.connection.start();
            this.isStarted = true;
            this.setConnectionLost(false);
        } catch (err) {
            this.setConnectionLost(true);
            setTimeout(() => this.start(), 5000);
        }
    }

    public async invoke<T>(methodName: string, ...args: any[]): Promise<T> {
        await this.start();
        return this.connection.invoke<T>(methodName, ...args);
    }

    public on(methodName: string, newMethod: (...args: any[]) => void): void {
        this.connection.on(methodName, newMethod);
    }

    public off(methodName: string, methodToDelegate?: (...args: any[]) => void): void {
        if (methodToDelegate) {
            this.connection.off(methodName, methodToDelegate);
        } else {
            this.connection.off(methodName);
        }
    }
}

export const signalRService = new SignalRService();