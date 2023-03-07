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
    Velocity_X = 300;

    velocityTotal_X:number = 0;   //variable privada que es utilizada en el update para mover al personaje en el eje X.

    @property(cc.Integer)
    Gravity = 100;  //gravedad

    @property(cc.Integer)
    JumpForce = 400;    //fuerza del salto

    jumpPressed:Boolean = false;    //deteccion de teclado.

    ForceInY:number = 0;    //variable que se utiliza para el movimiento, a esta se le asigna la fuerza de gravedad o del salto.

    CollisionFloor:boolean = false; //booleano para saber si el personaje colisiono con el piso.

    jumpCheck:boolean = false; //verifica que haya habido un salto, evita un doble salto en el aire.

    wallsCheck:boolean = false; //verifica si el personaje esta haciendo contacto contra la pared, sirve para mantenerse pegado a ella.

    velocityDrag:number = 0;    //velocidad de movimiento en X cuando estoy pegado a la pared.

    flagDrag:boolean = false;   //variable para saber si me encuentro colisionando con la pared.

    @property(cc.Integer)
    dragWalls = 1;  //Velocidad de caida cuando estoy pegado a la pared.

    //dragTime:number = 0;

    isDark:boolean = false; //variable para el cambio de color.

    currentAnimation:string = null; //contiene el nombre de la animacion que se esta reproduciendo, se utiliza para evitar reproducir varias veces la misma animacion.

    @property(cc.AnimationClip)
    darkIdle:cc.AnimationClip = null;

    @property(cc.AnimationClip)
    pinkIdle:cc.AnimationClip = null;

    //Variables para detectar la colision de colores con el piso.
    currentCollisionFloor:string = null;

    previousCollisionFloor:string = null;

    timeInitFloor:boolean = false;   //es verdad si tengo un color distinto al piso cuando colisiono por primera vez con el.

    timeStayFloor:boolean = false;   //es verdad si tengo un color distinto al piso y cambio de color cuando no estoy en contacto con un piso de color igual.

    initTimerFloor:number = 0;

    stayTimerFloor:number = 0;

    @property(cc.Integer)
    INIT_ToleranceTimeFLOOR = 0.3;

    @property(cc.Integer)
    STAY_ToleranceTimeFLOOR = 0.15;

   //Variables para detectar la colision de colores con los muros.

   currentCollisionWalls:string = null;

   preciousCollisionWalls:string = null;

   timeInitWalls:boolean = false;

   timeStayWalls:boolean = false;

   initTimerWalls:number = 0;

   stayTimerWalls:number = 0;

   

   @property(cc.Integer)
   INIT_ToleranceTimeWALLS = 0.3;

   @property(cc.Integer)
   STAY_ToleranceTimeWALLS = 0.15;


   @property(cc.Boolean)
   PlayerDead:boolean = false;
   @property(cc.Boolean)
   finishLevel:boolean = false;


    /******************************************************* */
    //COLISIONES.

    onCollisionEnter(otherCollider, selfCollider){
        if(otherCollider.node.group == "Walls"){
            this.changeVelocity();
            this.wallsCheck = true;
            this.jumpCheck = false;
            this.collisionEnterColorWalls(otherCollider.node.name);
        }

        if(otherCollider.node.group == "Floor"){
            this.ForceInY = 0;
            this.CollisionFloor = true;
            this.wallsCheck = false;
            this.jumpCheck = false;
            this.node.setPosition(this.node.position.x, otherCollider.node.position.y + 48);
            this.collisionEnterColorFloor(otherCollider.node.name);
            this.Velocity_X = this.velocityTotal_X;
            
        }

        if(otherCollider.node.group == "checkpoint"){
            this.finishLevel = true;
        }
    }

    onCollisionExit(otherCollider, selfCollider){
        if(otherCollider.node.group == "Floor"){
            this.CollisionFloor = false;
           
        }
        if(otherCollider.node.group == "Walls"){
            this.wallsCheck = false;
            this.timeInitWalls = false;
            this.timeStayWalls = false;
        }
    }

    onCollisionStay(otherCollider, selfCollider){
        if(otherCollider.node.group == "Walls"){
              this.collisionStayColorWalls(otherCollider.node.name);
        }
        if(otherCollider.node.group == "Floor"){
            this.ForceInY = 0;
            this.CollisionFloor = true;
            this.wallsCheck = false;
            this.jumpCheck = false;
            this.collisionStayColorFloor(otherCollider.node.name);
        }
    }
    
    /************************************************************ */

    //FUNCIONES.

    changeVelocity(){
        this.Velocity_X *= -1;
        this.velocityTotal_X = this.Velocity_X;
        if(this.velocityTotal_X < 0){
            this.getComponent(cc.Sprite).node.scaleX = 1;
        }else{
            this.getComponent(cc.Sprite).node.scaleX = -1;
        }
    }

    addGravity(){
        if(!this.CollisionFloor && this.wallsCheck && !this.flagDrag){
            this.flagDrag = true;
            if(this.ForceInY > 0){
                this.ForceInY = 0;
            }
            this.ForceInY = this.ForceInY - this.dragWalls;
            this.Velocity_X = this.velocityDrag;
            
        }else{
            if (!this.CollisionFloor){
                this.ForceInY = this.ForceInY - this.Gravity;
                this.flagDrag = false;
            }
        }


        if(this.wallsCheck == false /*&& this.Velocity_X == this.velocityDrag */&& this.CollisionFloor){
            if(this.velocityDrag == this.Velocity_X || -this.velocityDrag == this.Velocity_X){
                this.flagDrag = false;
                this.Velocity_X = this.velocityTotal_X;
            }
        }
    }

    //funciones del salto
    controlJump(){
        if(this.jumpCheck){
            this.Velocity_X = this.velocityTotal_X;
            this.wallsCheck = false;
        }
    }


    jumpControl(){
        this.timeInitFloor = false;
        this.timeInitWalls = false;
        this.timeStayFloor = false;
        this.timeStayWalls = false;
        if(this.wallsCheck || this.CollisionFloor){
            this.ForceInY = this.JumpForce;
        }
    }
   
    //funciones del color / cambio y animacion.
    changeColor(){
        if(this.isDark){
            this.isDark = false;
            this.controlColorAnimation();
        }else{
            this.isDark = true;
            this.controlColorAnimation();
        }
    }

    controlColorAnimation(){    //controla el color de las animaciones.
        var anim = this.getComponent(cc.Animation);
        var anim_State = anim.play();

        if(this.isDark){
            if(this.currentAnimation == "idle"){
                this.getComponent(cc.Animation).stop("pink-Idle");
                this.getComponent(cc.Animation).play("dark-idle");
            }else{
                if(this.currentAnimation == "slide"){
                    this.getComponent(cc.Animation).stop("pink-Slide");
                    this.getComponent(cc.Animation).play("dark-slide");
                    }
                }
        }else{
            if(this.currentAnimation == "idle"){
                this.getComponent(cc.Animation).stop("dark-idle");
                this.getComponent(cc.Animation).play("pink-Idle");
            }else{
                if(this.currentAnimation == "slide"){
                    this.getComponent(cc.Animation).stop("dark-slide");
                    this.getComponent(cc.Animation).play("pink-Slide");
                }
            }
            
        }
    }


    //Colision de colores con el piso.

    collisionEnterColorFloor(col:string){
        //console.log(col);
        
        this.previousCollisionFloor = this.currentCollisionFloor;
        this.currentCollisionFloor = col;
        if(this.currentCollisionFloor != this.previousCollisionFloor){
            this.initTimerFloor = 0;
            if(col == "floorPink" && this.isDark){
                this.timeInitFloor = true;
            }else{
                if(col == "floorPinkDark" && !this.isDark){
                    this.timeInitFloor = true;
                }
            }
        }
    }

    collisionStayColorFloor(col:string){
        if(col == "floorPink" && !this.isDark && !this.timeInitFloor){
            this.timeInitFloor = false
            this.timeStayFloor = false;
        }

        if(col == "floorPinkDark" && this.isDark && !this.timeInitFloor){
            this.timeInitFloor = false;
            this.timeStayFloor = false;
        }

        if(col == "floorPink" && this.isDark && !this.timeInitFloor){
            this.timeStayFloor = true;
            this.timeInitFloor = false;
        }

        if(col == "floorPinkDark" && !this.isDark && !this.timeInitFloor){
            this.timeStayFloor = true;
            this.timeInitFloor = false;
        }
    }

    timeChangeFloor(time:number){
        if(this.timeInitFloor){
            this.initTimerFloor += time;
            //console.log("init floor = " + this.initTimerFloor);
        }else{
            this.initTimerFloor = 0;
        }

        if(this.timeStayFloor && !this.timeInitFloor){
            this.stayTimerFloor += time;
            //console.log("stay floor = " + this.stayTimerFloor);
        }else{
            this.stayTimerFloor = 0;
        }

        if(this.initTimerFloor > this.INIT_ToleranceTimeFLOOR && this.timeInitFloor){
            //console.log("destrui en init floor");
            this.PlayerDead = true;
        }

        if(this.stayTimerFloor > this.STAY_ToleranceTimeFLOOR && this.timeStayFloor){
            //console.log("destrui en stay floor");
            this.PlayerDead = true;
        }
    }

    collisionEnterColorWalls(col:string){
       
        this.preciousCollisionWalls = this.currentCollisionWalls;
        this.currentCollisionWalls = col;
        if(this.currentCollisionWalls != this.preciousCollisionWalls){
            this.initTimerWalls = 0;
            if(col == "wallPink" && this.isDark){
                this.timeInitWalls = true;
            }else{
                if(col == "wallPinkDark" && !this.isDark){
                    this.timeInitWalls = true;
                }
            }
        }
    }

    collisionStayColorWalls(col:string){
        if(col == "wallPink" && !this.isDark && !this.timeInitWalls){
            this.timeInitWalls = false;
            this.timeStayWalls = false;
        }

        if(col == "wallPinkDark" && this.isDark && !this.timeInitWalls){
            this.timeInitWalls = false;
            this.timeInitWalls = false;
        }

        if(col == "wallPink" && this.isDark && !this.timeInitWalls){
            this.timeStayWalls = true;
            this.timeInitWalls = false;
        }

        if(col == "wallPinkDark" && !this.isDark && !this.timeInitWalls){
            this.timeStayWalls = true;
            this.timeInitWalls = false;
        }
    }

    timeChangeWalls(time:number){
        if(this.timeInitWalls){
            this.initTimerWalls += time;
            //console.log("init = " + this.initTimerWalls);
        }else{
            this.initTimerWalls = 0;
        }

        if(this.timeStayWalls && !this.initTimerWalls){
            this.stayTimerWalls +=time;
            //console.log("stay = " + this.stayTimerWalls);
        }else{
            this.stayTimerWalls = 0;
        }

        if(this.initTimerWalls > this.INIT_ToleranceTimeWALLS && this.timeInitWalls){
            //console.log("destrui en init");
            this.PlayerDead = true;
        }

        if(this.stayTimerWalls > this.INIT_ToleranceTimeWALLS && this.timeStayWalls){
            //console.log("destrui en stay");
            this.PlayerDead = true;
        }
    }

    
    // LIFE-CYCLE CALLBACKS:

    MovePlayer(event){
        switch(event.keyCode){
            case cc.macro.KEY.space:
                this.jumpPressed = true; 
                this.ForceInY =0;
                this.jumpControl();
                this.jumpCheck =true;
                this.currentAnimation = "idle";
                break;

            case cc.macro.KEY.enter:
                this.changeColor();
                break;
            
            case cc.macro.KEY.r:
                this.PlayerDead = true;
                break;

            case cc.macro.KEY.t:
                this.finishLevel = true;
                break;
        }
    }

    StopPlayer(event){
        switch(event.keyCode){
            case cc.macro.KEY.space:
                this.jumpPressed = false;
                break;
        }
    }

     onLoad () {
       cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.MovePlayer, this);
       cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.StopPlayer, this);
     }

    start () {
        this.ForceInY = -this.Gravity;
        this.velocityTotal_X = this.Velocity_X;
        this.getComponent(cc.Animation).play("dark-idle");
        this.currentAnimation = "jump";
    }



     update (dt) {
        this.controlJump();
        if(this.currentAnimation != "idle" && this.CollisionFloor){
            this.currentAnimation = "idle";
            console.log("entre idle");
            this.getComponent(cc.Animation).play("pink-Idle");
        }
        if(!this.CollisionFloor && this.wallsCheck && this.currentAnimation != "slide"){
            console.log("entre slide");
            this.currentAnimation = "slide";
            if(this.isDark){
            this.getComponent(cc.Animation).play("dark-slide");
            }else{
                this.getComponent(cc.Animation).play("pink-Slide");
            }
        }
        this.addGravity();
        this.timeChangeFloor(dt);
        this.timeChangeWalls(dt);
        if(!this.PlayerDead){
            this.node.setPosition(this.node.position.x += this.Velocity_X * dt, this.node.position.y += this.ForceInY*dt); 
        } 
    }
}