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
    Attemps:cc.Node = null;

    @property(cc.Label)
    Message:cc.Label = null;

    
    highScore:number = null;

    @property(cc.Label)
    labelHighScore:cc.Label;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.Attemps = cc.find('attemps');
        this.Attemps.setPosition(495,375);
        this.Attemps.getComponent(cc.Label).string = this.Attemps.getComponent('Score').attemps;
        this.loadHighScore();
     }

     loadHighScore(){
        this.highScore = cc.sys.localStorage.getItem('Attemps');
        let aux = this.Attemps.getComponent('Score').attemps;
        if(this.highScore == null){
            cc.sys.localStorage.setItem('Attemps', aux);
            this.highScore = cc.sys.localStorage.getItem('Attemps');
            console.log("entre en if");
        }else{
            if(this.highScore > this.Attemps.getComponent('Score').attemps){
                console.log("Entre en else");
                cc.sys.localStorage.setItem('Attemps', aux);
                this.highScore = cc.sys.localStorage.getItem('Attemps');
            }
        }
     }
    start () {

    }

     update (dt) {
         this.labelHighScore.getComponent(cc.Label).string = "La menor cantidad de intentos en que se termino el juego fue " + this.highScore;
     }
}
