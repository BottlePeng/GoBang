import { IGoBangGameInfo, IResponseConfig } from "../config/interfaceConfig";
import { DB } from "./db";

export class DBModel {
    // 重置棋盘数据表
    static async reset() {
        const sql = `CALL sp_reset_game()`;
        const result = await DB.query(sql, []) as any;

        let res: IResponseConfig = {
            success: false,
        };

        if (result && result.length > 0) {
            res.success = true;
            res.message = '重置棋盘成功';
        } else {
            res.message = '重置棋盘失败,请联系管理员';
        }

        return res;
    }

    // 重启服务器(仅服务端使用)
    static async restart() {
        const sql = `CALL sp_restart_server()`;
        await DB.query(sql, []) as any;
    }

    // 查询当前对局信息
    static async getGameInfo() {
        const sql = `SELECT * FROM current_game WHERE id = 1`;

        const result = await DB.query(sql, []) as any;

        let res: IResponseConfig = {
            success: false,
        };

        if (result && result.length > 0) {
            const gameInfo = result[0] as IGoBangGameInfo;
            // 解析棋盘数据
            let board_state: number[][] = [];
            try {
                if (gameInfo.board_state) {
                    board_state = JSON.parse(gameInfo.board_state);
                } else {
                    this.reset();
                    console.error('查询棋盘数据失败,重置棋盘数据');
                    board_state = Array(15).fill(0).map(() => Array(15).fill(0));
                }
            } catch (e) {
                console.error('解析棋盘数据失败:', e);
                // 如果解析失败，返回空棋盘
                board_state = Array(15).fill(0).map(() => Array(15).fill(0));
            }

            const black_player_name = gameInfo.black_player_id
                ? await this.getPlayerName(gameInfo.black_player_id)
                : null;
            const white_player_name = gameInfo.white_player_id
                ? await this.getPlayerName(gameInfo.white_player_id)
                : null;

            // 构建成功返回数据
            res = {
                success: true,
                data: {
                    black_player_name: black_player_name, 
                    white_player_name: white_player_name,
                    current_turn: gameInfo.current_turn,
                    board_state: board_state,
                }
            };
        } else {
            res.message = '未找到游戏信息';
        }

        return res;
    };

    // 查询是否存在用户
    static async isHasPlayer(playerName: string) {
        const sql = `SELECT * FROM players WHERE name = ?`;
        const result = await DB.query(sql, [playerName]) as any;

        let res: IResponseConfig = {
            success: false,
        };

        if (result && result.length > 0) {
            res.success = true;
            res.data = true;
            console.log(`${playerName}请求登录,已有该玩家信息`);
        } else {
            res.success = true;
            res.data = false;
            console.log(`${playerName}请求登录,无该玩家信息`);
        }

        return res;
    }

    // 修改对局信息
    static async updateGameInfo(gameInfo: any) {
        const sql = `UPDATE current_game SET black_player_id = ?, white_player_id = ?, current_turn = ?, board_state = ? WHERE id = 1`;

        const black_player_id = gameInfo.black_player_name
            ? await this.getPlayerId(gameInfo.black_player_name)
            : null;
        const white_player_id = gameInfo.white_player_name
            ? await this.getPlayerId(gameInfo.white_player_name)
            : null;

        const result = await DB.query(sql, [
            black_player_id,
            white_player_id,
            gameInfo.current_turn,
            JSON.stringify(gameInfo.board_state),
        ]) as any;

        let res: IResponseConfig = {
            success: false,
        };

        if (result && result.affectedRows > 0) {
            res.success = true;
        } else {
            res.message = '更新对局信息失败,请联系管理员';
        }

        return res;
    }

    // 心跳停止
    static async endHeartbeat(playerIndex: number) {
        console.log(`玩家 ${playerIndex === 0 ? '黑棋' : '白棋'} 掉线`);
    }






    /**
     * 根据玩家ID获取玩家名称
     */
    static async getPlayerName(playerId: string): Promise<string | null> {
        try {
            const sql = `SELECT name FROM players WHERE id = ?`;
            const result = await DB.query(sql, [playerId]) as any[];

            if (result && result.length > 0) {
                return result[0].name;
            }
            return null;
        } catch (error) {
            console.error('获取玩家名称失败:', error);
            return null;
        }
    }

    /**
     * 根据玩家名称获取玩家ID
     */
    static async getPlayerId(playerName: string): Promise<string | null> {
        try {
            const sql = `SELECT id FROM players WHERE name = ?`;
            const result = await DB.query(sql, [playerName]) as any[];
            if (result && result.length > 0) {
                return result[0].id;
            }
            return null;
        } catch (error) {
            console.error('获取玩家ID失败:', error);
            return null;
        }
    }
}
