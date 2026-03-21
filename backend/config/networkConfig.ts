// 服务器配置
export interface INetworkConfig {
    port: number;   // 服务器端口
    heartbeatInterval: number; // 心跳间隔
    maxConnections: number; // 最大连接数
}