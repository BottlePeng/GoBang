import { _decorator, Component, Label, Node } from 'cc';
import { GameDirector } from '../globel/gameDirector';
import { Api } from '../api/api';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {
    @property(Label)
    label: Label = null;

    // 心跳计时
    private _time: number = 20;
    private _timer: number = 0;

    black_player_name: string | null = null;
    white_player_name: string | null = null;

    protected start(): void {
        // 启动心跳
        Api.postHeartbeat(GameDirector.instance.getPlayerIndex());
    }

    protected update(dt: number): void {
        this.black_player_name = GameDirector.instance.gameInfo.black_player_name;
        this.white_player_name = GameDirector.instance.gameInfo.white_player_name;   

        this.label.string = `当前回合: ${GameDirector.instance.gameInfo.current_turn === 0 ? '黑方' : '白方'}
    你自己: ${GameDirector.instance.playerName}-${GameDirector.instance.getPlayerIndex() === 0 ? '黑方' : '白方'}`;
        
        if (GameDirector.instance.playerName !== 'Tourist') {
            // 心跳
            this._timer += dt;
            if (this._timer >= this._time) {
                this._timer = 0;
                Api.postHeartbeat(GameDirector.instance.getPlayerIndex());
            }
        }
    }
}


