import wss from '../server';

/**
 * @class ProgressChannel Class to handle dynamically defined channel
 */
export class ProgressChannel {
    public readonly clientId: string;

    public readonly channelStart: string;
    public readonly channelStep: string;
    public readonly channelEnd: string;
    public readonly channelError: string;

    constructor(base: string, clientId: string) {
        this.channelStart = `${base}_start`;
        this.channelStep = `${base}_step`;
        this.channelEnd = `${base}_end`;
        this.channelError = `${base}_error`;

        this.clientId = clientId;
    }

    public start(data: any) {
        if (wss && wss.io) {
            // Send 102 (Still processing) + data
            wss.io.to(this.clientId).emit(this.channelStart, data);
        }
    }

    /**
     * @summary Method to send message on channel
     * @param {any} data Data to send on channel
     */
    public step(data: any) {
        if (wss && wss.io) {
            wss.io.to(this.clientId).emit(this.channelStep, data);
        }
    }

    /**
     * @summary Method used to send error on channel
     * @param {any} data Error
     */
    public error(data: any) {
        if (wss && wss.io) {
            wss.io.to(this.clientId).emit(this.channelError, data);
        }
    }

    /**
     * @summary Method used to send end on channel
     */
    public end() {
        if (wss && wss.io) {
            // Send 200 (OK)
            wss.io.to(this.clientId).emit(this.channelEnd);
        }
    }
}
