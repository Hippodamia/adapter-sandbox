import {Adapter, Bot} from "@hippodamia/bot";
import {onebot} from "pure-bot";

export class SandboxAdapter implements Adapter {

    client: onebot.CqApi

    info = {desc: '', name: 'sandbox', version: '0.2'};

    pure_bot: onebot.QQbot

    bot: Bot

    constructor(mode: 'reverse' | 'http') {
        if (mode == "reverse") {
            this.pure_bot = new onebot.QQbot({
                name: '阿光',
                logUnhandledInfo: true, // 打印已收到，但未被处理的事件
                logHeartbeat: false, // 打印心跳事件
                debug: false, // debug，开启将显示被filter阻止的事件
                serverOptions: {
                    port: 8080 // cqhttp服务的反向websocket端口
                }
            });
        }
    }

    send(content: string | string[], target: { channel?: string; user?: string }): void {
        let text: string;
        if (typeof content == "object") {
            text = content.join('')
        } else {
            text = content
        }

        this.client.sendMsg({
            message: text,
            user_id: target.channel ? undefined : Number(target.user),
            group_id: Number(target.channel ?? 0),
            auto_escape: false
        }).catch((err) => {
            this.bot.logger.info(err, "SandboxAdapter error on sendMsg()")
        })
    };

    init(bot: Bot) {

        this.bot = bot
        this.pure_bot.onMetaEvent('lifecycle', (ctx) => {
            this.client = ctx.client
        })


        this.pure_bot.onMessage('group', (ctx) => {
            const message = ctx.raw_message;
            bot.emit('command', {
                user: {id: ctx.user_id.toString()},
                command_text: message,
                channel: {id: ctx.group_id.toString()},
                platform: 'sandbox'
            })

        })
        this.pure_bot.onMessage('private', (ctx) => {
            const message = ctx.raw_message;
            bot.emit('command', {
                user: {id: ctx.user_id.toString()},
                command_text: message,
                platform: 'sandbox'
            })
        })
    }
}
