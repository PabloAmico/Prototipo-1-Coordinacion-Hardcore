// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        
     }

    start () {
        var follow = cc.follow(this.target,cc.rect(0,0,1500,1500));
        this.node.runAction(follow);
    }

    // update (dt) {}
}
