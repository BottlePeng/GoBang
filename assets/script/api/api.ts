// api.ts
import { IGoBangGameInfo, IResponseConfig } from "../config/networkConfig";
import { request } from "../network/httpUtil";

export class Api {
    // 获取对局信息
    static async getGameInfo() {
        try {
            const response = await request('GET', '/api/getGameInfo', null);

            let res:IResponseConfig = {
                success: false,
            }

            if (response) {
                res.success = response.success;
                res.message = response.message;
                res.data = response.data;
            } else {
                throw new Error('未请求到任何对局信息,请联系管理员');
            }

            if (res.success) {
                return res.data;
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            return err;
        }
    }

    // 查询是否注册
    static async isHasPlayer(playerName: string): Promise<boolean> {
        try {
            const response = await request('POST', '/api/isHasPlayer', { playerName });

            let res:IResponseConfig = {
                success: false,
            }

            if (response) {
                res.success = response.success;
                res.message = response.message;
                res.data = response.data;
            } else {
                throw new Error('未请求到任何注册信息,请联系管理员');
            }

            if (res.success) {
                return res.data;
            } else {
                throw new Error(res.message);
            }

        } catch (err) {
            return err;
        }

    }

    // 更改对局信息
    static async updateGameInfo(gameInfo: IGoBangGameInfo) {
        try {
            const response = await request('POST', '/api/updateGameInfo', { gameInfo });

            let res:IResponseConfig = {
                success: false,
            }

            if (response) {
                res.success = response.success;
                res.message = response.message;
            } else {
                throw new Error('未请求到任何对局信息,请联系管理员');
            }

            if (!res.success) {
                throw new Error(res.message);
            }
        } catch (err) {
            return err;
        }
    }

    // 心跳
    static async postHeartbeat(playerIndex: number) {
        try {
            if (playerIndex === -1) return;
            
            const response = await request('POST', '/api/heartBeat', { playerIndex });

            if (!response.success) {
                throw new Error(response.message);
            }
        } catch (err) {
            return err;
        }
    }
}