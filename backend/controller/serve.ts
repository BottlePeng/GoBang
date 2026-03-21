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
}