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
    player:cc.Node = null;

    @property(cc.Node)
    changeLevel = null;

    timeChange:number = 0;

    change:boolean = false;

    @property(cc.Node)
    Attemps:cc.Node = null;

    

    //@property(cc.SceneAsset)
    //escena:cc.SceneAsset = null;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
         var manager = cc.director.getCollisionManager();
         manager.enabled = true;
         cc.director.getPhysicsManager().enabled = true;
         //manager.enabledDebugDraw = true;
       this.loadLevel();
       this.Attemps = cc.find("attemps");
       
       
     }

    start () {
   
    }

    loadLevel(){
        let aux = this.changeLevel.getComponent('ControlLevel').numberLevel;
        if(aux == 1){
            cc.director.preloadScene("Level_1");
            cc.director.preloadScene("Level_2");
        }else{
            if(aux == 2){
                cc.director.preloadScene("Level_2");
                cc.director.preloadScene("Level_3");
            }else{
                if(aux == 3){
                    cc.director.preloadScene("Level_3");
                    cc.director.preloadScene("Game_Over");
                }
            }
        }
    }

    controlLevel(){
        let playerState = this.player.getComponent('playerControl').PlayerDead;
        let changeLevel = this.player.getComponent('playerControl').finishLevel;
        let numLevel = this.changeLevel.getComponent('ControlLevel').numberLevel;
        if(playerState){
            
            if(numLevel == 1){
                playerState = false;
                this.changeSceneDead("Level_1");
            }else{
                if(numLevel == 2){
                    this.changeSceneDead("Level_2");
                }else{
                    if(numLevel == 3){
                        this.changeSceneDead("Level_3");
                    }
                }
            }
        }

        if(changeLevel){
            if(numLevel == 1){
                cc.director.loadScene("Level_2");
            }else{
                if(numLevel == 2){
                    cc.director.loadScene("Level_3");
                }else{
                    if(numLevel == 3){
                        cc.director.loadScene("Game_Over");
                    }
                }
            }
        }
    }

    changeSceneDead(name:string){
        if(!this.change){
            this.change = true;
        }
        if(this.timeChange >= 0.5){
            this.Attemps.getComponent('Score').attemps +=1; 
            cc.director.loadScene(name);

        }
    }

    score(){
        this.Attemps.getComponent(cc.Label).string = "Intentos " + this.Attemps.getComponent('Score').attemps;
    }

     update (dt) {
         if(this.change){
             this.timeChange += dt;
         }
        this.controlLevel();
        this.score();
     }
}
