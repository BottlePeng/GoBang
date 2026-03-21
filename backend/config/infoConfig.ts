// 消息类型枚举
export enum MessageType {
    HANDSHAKE = 'handshake',            // 握手消息
    HANDSHAKE_ACK = 'handshake_ack',    // 握手响应
    MESSAGE = 'message',                // 普通消息
    MESSAGE_ACK = 'message_ack',        // 消息响应
    ERROR = 'error',                    // 错误消息
    HEARTBEAT = 'heartbeat',            // 心跳消息
    HEARTBEAT_ACK = 'heartbeat_ack'     // 心跳响应
}

// 客户端信息
export interface IClientInfo {
    id: string;
    clientId?: string;
}

// 基础消息接口
export interface IBaseMessage {
    type: MessageType;
    data: any;
}

export interface IResponseConfig {
    success: boolean;
    message?: string;
    data?: any;
}

export interface IGoBangGameInfo {
    black_player_id: string | null;
    white_player_id: string | null;
    current_turn: 0 | 1;
    board_state: string;
}





// 握手消息
export interface IHandshakeMessage extends IBaseMessage {
    type: MessageType.HANDSHAKE;
    data: {
        clientId: string;
        timestamp: number;
    };
}

// 握手响应
export interface IHandshakeAckMessage extends IBaseMessage {
    type: MessageType.HANDSHAKE_ACK;
    data: {
        success: boolean;
        message: string;
        serverId: string;
        timestamp: number;
    };
}

// 普通消息
export interface IMessageMessage extends IBaseMessage {
    type: MessageType.MESSAGE;
    data: {
        content: string;
        timestamp: number;
    };
}

// 消息响应
export interface IMessageAckMessage extends IBaseMessage {
    type: MessageType.MESSAGE_ACK;
    data: {
        success: boolean;
        message: string;
        originalTimestamp: number;
        serverTimestamp: number;
    };
}

// 错误消息
export interface IErrorMessage extends IBaseMessage {
    type: MessageType.ERROR;
    data: {
        message: string;
        timestamp: number;
    };
}

// 心跳消息
export interface IHeartbeatMessage extends IBaseMessage {
    type: MessageType.HEARTBEAT;
    data: {
        timestamp: number;
    };
}

// 心跳响应
export interface IHeartbeatAckMessage extends IBaseMessage {
    type: MessageType.HEARTBEAT_ACK;
    data: {
        timestamp: number;
        serverTimestamp: number;
    };
}
