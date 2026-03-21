// websocket/WebSocketManager.ts
import { MessageType, IWSMessage, IMoveInfo, networkConfig } from '../../config/networkConfig';

interface ReconnectConfig {
    maxAttempts: number;        // 最大重连次数
    initialDelay: number;       // 初始重连延迟（毫秒）
    maxDelay: number;           // 最大重连延迟
    backoffMultiplier: number;  // 延迟递增倍数
}

export class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket = null;
    private wsUrl: string = networkConfig.wsUrl;
    private isConnected: boolean = false;

    /**
     * 连接 WebSocket
     */
    private connectWebSocket() {
        console.log(`[WebSocket] 正在连接: ${this.wsUrl}`);

        this.ws = new WebSocket(this.wsUrl);

        this.ws.onmessage = this.onWebSocketMessage.bind(this);
        this.ws.onerror = this.onWebSocketError.bind(this);
        this.ws.onclose = this.onWebSocketClose.bind(this);
    }

    /**
     * 接收 WebSocket 消息
     */
    private onWebSocketMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'connect':
                    // 握手响应
                    this.isConnected = true;
                    console.log('[WebSocket] 握手成功');
                    break;

                // 添加其他消息类型处理逻辑

                default:
                    console.log('[WebSocket] 未知消息类型:', data.type);
            }
        } catch (error) {
            console.error('[WebSocket] 解析消息失败:', error);
        }
    }

    /**
     * WebSocket 错误
     */
    private onWebSocketError(event: Event) {
        console.error('[WebSocket] 连接错误:', event);
    }

    /**
     * WebSocket 关闭
     */
    private onWebSocketClose(event: CloseEvent) {
        console.log('[WebSocket] 连接关闭:', event.code, event.reason);
        this.isConnected = false;

        // 3秒后自动重连
        setTimeout(() => {
            console.log('[WebSocket] 尝试重连...');
            this.connectWebSocket();
        }, 3000);
    }

    /**
     * 发送握手请求
     */
    private sendHandshake() {
        const handshakeMsg = {
            type: 'handshake',
            data: {
                clientId: this.generateClientId(),
                timestamp: Date.now()
            }
        };

        this.ws.send(JSON.stringify(handshakeMsg));
        console.log('[WebSocket] 发送握手请求');
    }

    /**
     * 发送普通消息
     */
    private sendMessage(message) {
        this.ws.send(JSON.stringify(message));
    }

    /**
     * 生成客户端 ID
     */
    private generateClientId(): string {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}