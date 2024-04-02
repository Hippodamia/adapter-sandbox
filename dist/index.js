"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxAdapter = void 0;
const pure_bot_1 = require("pure-bot");
class SandboxAdapter {
    constructor(mode) {
        this.info = { desc: '', name: 'sandbox', version: '0.2' };
        if (mode == "reverse") {
            this.pure_bot = new pure_bot_1.onebot.QQbot({
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
    send(content, target) {
        var _a;
        let text;
        if (typeof content == "object") {
            text = content.join('');
        }
        else {
            text = content;
        }
        this.client.sendMsg({
            message: text,
            user_id: target.channel ? undefined : Number(target.user),
            group_id: Number((_a = target.channel) !== null && _a !== void 0 ? _a : 0),
            auto_escape: false
        }).catch((err) => {
            this.bot.logger.info(err, "SandboxAdapter error on sendMsg()");
        });
    }
    ;
    init(bot) {
        this.bot = bot;
        this.pure_bot.onMetaEvent('lifecycle', (ctx) => {
            this.client = ctx.client;
        });
        this.pure_bot.onMessage('group', (ctx) => {
            const message = ctx.raw_message;
            bot.emit('command', {
                user: { id: ctx.user_id.toString() },
                command_text: message,
                channel: { id: ctx.group_id.toString() },
                platform: 'sandbox'
            });
        });
        this.pure_bot.onMessage('private', (ctx) => {
            const message = ctx.raw_message;
            bot.emit('command', {
                user: { id: ctx.user_id.toString() },
                command_text: message,
                platform: 'sandbox'
            });
        });
    }
}
exports.SandboxAdapter = SandboxAdapter;
