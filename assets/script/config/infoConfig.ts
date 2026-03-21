export interface IHttpMessage {
    success: boolean;
    message?: string;
    data?: any;
}


export interface IWSMessage {
    type: MessageType;
    data?: any;
}

export enum MessageType {
    // 连接相关
    CONNECT = 'connect',    // 客户端连接
    RECONNECT = 'reconnect',    // 重连

    // 游戏相关
    GET_GAME_INFO = 'get_game_info',        // 获取游戏信息
    CHECK_PLAYER = 'check_player',          // 检查玩家是否存在
    UPDATE_GAME_INFO = 'update_game_info',  // 更新游戏信息(服务端)

    // 棋局相关
    MAKE_MOVE = 'make_move',      // 下子

    // 心跳相关
    HEARTBEAT = 'heartbeat',      // 心跳

    // 错误处理
    ERROR = 'error',
}