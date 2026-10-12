export {};

declare global {
    interface Window {
        external?: {
            sendMessage(message: string): void;
            receiveMessage(callback: (message: string) => void): void;
        };
    }
}