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
    // 心跳相关
    HEARTBEAT = 'heartbeat',      // 心跳

    // 错误处理
    ERROR = 'error',
}