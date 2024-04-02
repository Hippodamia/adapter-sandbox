import { Adapter, Bot } from "@hippodamia/bot";
import { onebot } from "pure-bot";
export declare class SandboxAdapter implements Adapter {
    client: onebot.CqApi;
    info: {
        desc: string;
        name: string;
        version: string;
    };
    pure_bot: onebot.QQbot;
    bot: Bot;
    constructor(mode: 'reverse' | 'http');
    send(content: string | string[], target: {
        channel?: string;
        user?: string;
    }): void;
    init(bot: Bot): void;
}
