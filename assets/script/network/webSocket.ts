import { _decorator, Component, director } from "cc";
import { MessageType } from "../config/infoConfig";
import { networkConfig } from "../config/networkConfig";
import { GameDirector } from "../globel/gameDirector";
const { ccclass, property } = _decorator;

@ccclass('GameDirector')
export class GameWebSocket extends Component {
    // 静态实例引用
    private static _instance: GameWebSocket = null;
    // 公开的静态方法获取实例
    public static get instance(): GameWebSocket {
        return GameWebSocket._instance;
    }
    

    private ws: WebSocket | null = null;
    private reconnectTimer: any = null;

    //=======================================生命周期=========================================
    
    onLoad() {
        // 单例检查
        if (GameWebSocket._instance !== null && GameWebSocket._instance !== this) {
            // 如果已经存在实例，销毁当前节点
            this.node.destroy();
            return;
        }

        // 设置为实例
        GameWebSocket._instance = this;

        // 设置为常驻节点
        director.addPersistRootNode(this.node);
    }

    onDestroy() {
        // 清理实例引用
        if (GameWebSocket._instance === this) {
            GameWebSocket._instance = null;
        }
    }

    //====================================方法============================================

    connectWebSocket(playerId: number, token: string) {
        const wsUrl = `${networkConfig.wsUrl}/ws?playerId=${playerId}&token=${token}`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket 连接成功');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case MessageType.UPDATE:
                    GameDirector.instance.blackPlayerId = data.blackPlayerId;
                    GameDirector.instance.blackPlayerName = data.blackPlayerName;
                    GameDirector.instance.whitePlayerId = data.whitePlayerId;
                    GameDirector.instance.whitePlayerName = data.whitePlayerName;
                    GameDirector.instance.currentTurn = data.currentTurn;
                    GameDirector.instance.boardState = data.boardState;
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

    private reconnect() {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        this.reconnectTimer = setTimeout(() => {
            console.log('尝试重连...');
            // 重新连接
        }, 3000);
    }
}