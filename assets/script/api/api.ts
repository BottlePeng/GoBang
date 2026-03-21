// api.ts
import { IHttpMessage } from "../config/infoConfig";
import { request } from "../network/httpUtil";

export class Api {
    /**
     * 查询是否注册
     * @param playerName 玩家名称
     * @returns {Promise<number>} 玩家id: -1-未注册, *-玩家id
     */ 
    static async isHasPlayer(playerName: string): Promise<number> {
        try {
            const response = await request('POST', '/api/isHasPlayer', { playerName });

            let res:IHttpMessage = {
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
                if (typeof res.data === 'number') {
                    return res.data;
                } else {
                    throw new Error('服务器返回数据格式错误,请联系管理员');
                }
            } else {
                throw new Error(res.message);
            }

        } catch (err) {
            throw err;
        }
    }


    /**
     * 加入游戏
     * @param playerId 玩家名称
     * @param playerColor 玩家颜色
     * @returns {Promise<void>}
     */
    static async joinGame(playerId: number, playerColor: number): Promise<void> {
        try {
            const response = await request('POST', '/api/joinGame', { playerName: playerId, playerColor });

            let res:IHttpMessage = {
                success: false,
            }

            if (response) {
                res.success = response.success;
                res.message = response.message;
                res.data = response.data;
            } else {
                throw new Error('未请求到任何游戏信息,请联系管理员');
            }

            if (res.success) {
                if (typeof res.data === 'object') {
                    return;
                } else {
                    throw new Error('服务器返回数据格式错误,请联系管理员');
                }
            } else {
                throw new Error(res.message);
            }
        } catch (err) {
            throw err;
        }
    }
}