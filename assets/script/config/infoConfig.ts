export interface IMoveInfo {
    x: number,
    y: number,
    currentPlayer: number; // 当前玩家 0: 黑子 1: 白子
}

export interface IHttpMessage {
    success: boolean;
    message?: string;
    data?: any;
}


export interface IWSMessage {
    type: MessageType;
    data?: any;
}

/**
 * 客户端信息
 * @interface IClientInfo
 * @property {number | null} [id] - 客户端用户id,-1-游客
 * @property {string | null} [name] - 客户端用户名称
 * @property {number | null} [color] - 客户端用户棋色,-1-未指定
 */
export interface IClientData {
    id? : number | null;
    name? : string | null;
    color? : number | null;
}


export enum MessageType {
    // 连接相关
    CONNECT = 'connect',    // 客户端连接
    JOIN_ROOM = 'join_room',    // 加入房间
    LEAVE_ROOM = 'leave_room',  // 离开房间
    RECONNECT = 'reconnect',    // 重连

    // 游戏相关
    GET_GAME_INFO = 'get_game_info',        // 获取游戏信息
    CHECK_PLAYER = 'check_player',          // 检查玩家是否存在
    UPDATE_GAME_INFO = 'update_game_info',  // 更新游戏信息(服务端)

    // 棋局相关
    MAKE_MOVE = 'make_move',      // 下子
    MOVE_MADE = 'move_made',      // 对方下子(服务端)

    // 心跳相关
    HEARTBEAT = 'heartbeat',      // 心跳
    HEARTBEAT_ACK = 'heartbeat_ack',    // 心跳响应,

    // 错误处理
    ERROR = 'error',
}