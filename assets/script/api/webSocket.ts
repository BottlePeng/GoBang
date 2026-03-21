import { MessageType } from "../config/infoConfig";
import { networkConfig } from "../config/networkConfig";

export class GameWebSocket {
    private ws: WebSocket | null = null;
    private reconnectTimer: any = null;

    connectWebSocket(playerId: number, token: string) {
        const wsUrl = `${networkConfig.wsUrl}/ws?playerId=${playerId}&token=${token}`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket 连接成功');
            // 开始心跳
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'connected':
                    console.log('连接成功:', data.message);
                    break;
                case 'ping':
                    // 回复心跳
                    this.ws?.send(JSON.stringify({ type: MessageType.HEARTBEAT }));
                    break;
            }
        };

        this.ws.onclose = () => {
            this.reconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
        };
    }

    private startHeartbeat() {
        setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: MessageType.HEARTBEAT }));
            }
        }, 30000);
    }

    private reconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        this.reconnectTimer = setTimeout(() => {
            console.log('尝试重连...');
            // 重新连接
        }, 3000);
    }
}