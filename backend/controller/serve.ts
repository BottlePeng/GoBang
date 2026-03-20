import { DBModel } from "../db/db_model";
import { Request, Response } from "express";

export class Serve {
    // 心跳状态管理
    private static heartbeats = new Map<number, {
        active: boolean;
        timer: NodeJS.Timeout | null;
    }>();

    

    // 查询当前对局信息
    static async getGameInfo(req: Request, res: Response) {
        await DBModel.getGameInfo().then((result) => {
            res.send(result);
        });
    }

    // 查询玩家是否注册
    static async isHasPlayer(req: Request, res: Response) {
        await DBModel.isHasPlayer(req.body.playerName).then((result) => {
            res.send(result);
        });
    }

    // 修改对局信息
    static async updateGameInfo(req: Request, res: Response) {
        await DBModel.updateGameInfo(req.body.gameInfo).then((result) => {
            res.send(result);
        });
    }

    // 心跳检查
    static async postHeartbeat(req: Request, res: Response) {
        const who: number = req.body.playerIndex; // 0-黑棋, 1-白棋

        if (who !== 0 && who !== 1) {
            console.warn('无效的玩家标识');
            return;
        }

        // 获取或初始化心跳状态
        let heartbeat = this.heartbeats.get(who);
        if (!heartbeat) {
            heartbeat = { active: false, timer: null };
            this.heartbeats.set(who, heartbeat);
        }

        // 第一次心跳，激活
        if (!heartbeat.active) {
            heartbeat.active = true;
            console.log(`心跳检测激活`);
        }

        // 重置计时器
        if (heartbeat.timer) {
            clearTimeout(heartbeat.timer);
        }

        // 设置新的计时器
        heartbeat.timer = setTimeout(() => {
            if (heartbeat.active) {
                console.warn(`${who === 0 ? '黑棋' : '白棋'}心跳超时`);
                heartbeat.active = false;
                DBModel.endHeartbeat(who);
                this.heartbeats.delete(who); // 清理
            }
        }, 30000); // 30秒

        console.log(`玩家 ${who === 0 ? '黑棋' : '白棋'} 心跳正常`);
    }
}