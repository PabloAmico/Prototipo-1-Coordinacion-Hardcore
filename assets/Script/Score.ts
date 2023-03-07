// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Integer)
    attemps:number = 1;

    Save:string = null;

    //@property(cc.Node)
    //player:cc.Node = null;

    //previousAttemps:number = 0;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         cc.game.addPersistRootNode(this.node);
         //var filePath = cc.url.raw("Save/Save.txt");
         //this.Save = jsb.fileUtils.getStringFromFile(filePath);
     }

    start () {
        //this.previousAttemps = this.attemps;

       // this.node.setPosition(this.player.position.x + 100,this.player.position.y + 50)
    }

     update (dt) {
            //this.getComponent(cc.Label).string = "" + this.attemps;
     }
}
