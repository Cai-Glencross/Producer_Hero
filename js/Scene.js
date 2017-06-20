var Scene = function(gl, output) {

  this.gl = gl;
  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);



  this.frameCounter = 0;
  this.cooldown = 0;
  this.firstShot= true;

  this.timeAtLastFrame = new Date().getTime();

  this.camera = new OrthoCamera();

  this.gameObjects = [];
  this.HUDobjects = [];

  this.quadGeometry = new QuadGeometry(gl);


  // shader/program set ups
  this.vsTrafo2d = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl"); 
  this.asteroidProgram = new Program(gl, this.vsTrafo2d, this.fsSolid);

  this.fsAnimation = new Shader(gl, gl.FRAGMENT_SHADER, "animation_fs.essl");
  this.animationProgram = new Program(gl, this.vsTrafo2d, this.fsAnimation);



  //Game object set ups

    //lander object
  this.landerTexture = new Texture2D(gl, "js/res/JupiterMedia/lander.png");
  this.landerMaterial = new Material(gl, this.asteroidProgram);
  this.landerMaterial.colorTexture.set(this.landerTexture);
  this.landerMesh = new Mesh(this.quadGeometry, this.landerMaterial);

  this.lander = new GameObject2D(this.landerMesh);
  this.lander.scale = new Vec3(1/6,1/6,1/6);
  this.lander.mass = 100;
  this.lander.updateModelTransformation();

  this.gameObjects.push(this.lander);

    //thruster objects
    this.thrusters = [];
    this.thrusterTexture = new Texture2D(gl, "js/res/JupiterMedia/afterburner.png");
    this.thrusterMaterial = new Material(gl, this.asteroidProgram);
    this.thrusterMaterial.colorTexture.set(this.thrusterTexture);
    this.thrusterMesh = new Mesh(this.quadGeometry, this.thrusterMaterial);

      //upThruster
      this.upThruster = new GameObject2D(this.thrusterMesh);
      this.upThruster.parent = this.lander;
      this.upThruster.scale = new Vec3(1/8,1/8,1/8);
      this.upThruster.position = new Vec3(-.04,-.84, 0);
      this.upThruster.orientation = -Math.PI/2-.1;
      this.gameObjects.push(this.upThruster);
      this.thrusters.push(this.upThruster)

      //leftThruster
      this.leftThruster = new GameObject2D(this.thrusterMesh);
      this.leftThruster.parent = this.lander;
      this.leftThruster.scale = new Vec3(1/8,1/8,1/8);
      this.leftThruster.position = new Vec3(-.575,.4, 0);
      this.leftThruster.orientation = Math.PI
      this.gameObjects.push(this.leftThruster);
      this.thrusters.push(this.leftThruster);


      //rightThruster
      this.rightThruster = new GameObject2D(this.thrusterMesh);
      this.rightThruster.parent = this.lander;
      this.rightThruster.scale = new Vec3(1/8,1/8,1/8);
      this.rightThruster.position = new Vec3(.69,.35, 0);
      this.gameObjects.push(this.rightThruster);
      this.thrusters.push(this.rightThruster);

      //plasma sutff
      this.plasmas = [];
      this.plasmaTexture = new Texture2D(gl, "js/res/JupiterMedia/plasma.png");
      this.plasmaMaterial = new Material(gl, this.asteroidProgram);
      this.plasmaMaterial.colorTexture.set(this.plasmaTexture);
      this.plasmaMesh= new Mesh(this.quadGeometry, this.plasmaMaterial);


  //Platform object
    this.platformTexture = new Texture2D(gl, "js/res/JupiterMedia/platform.png");
    this.platformMaterial = new Material(gl, this.asteroidProgram);
    this.platformMaterial.colorTexture.set(this.platformTexture);
    this.platformMesh = new Mesh(this.quadGeometry, this.platformMaterial);

    this.platformMiddle= new GameObject2D(this.platformMesh);
    this.platformMiddle.scale= new Vec3(1/5, 1/30, 1);
    this.platformMiddle.position = new Vec3(.5,-.8,0);
    this.platformMiddle.updateModelTransformation();
    this.gameObjects.push(this.platformMiddle);

    this.platformEndTexture = new Texture2D(gl, "js/res/JupiterMedia/platformend.png");
    this.platformEndMaterial = new Material(gl, this.asteroidProgram);
    this.platformEndMaterial.colorTexture.set(this.platformEndTexture);
    this.platformEndMesh = new Mesh(this.quadGeometry, this.platformEndMaterial);

    this.platformLeftEnd = new GameObject2D(this.platformEndMesh);
    this.platformLeftEnd.parent = this.platformMiddle;
    this.platformLeftEnd.scale = new Vec3(1/8, 1,1);
    this.platformLeftEnd.position = new Vec3(-1-(1/8),0,0);
    this.gameObjects.push(this.platformLeftEnd);


    this.platformRightEnd = new GameObject2D(this.platformEndMesh);
    this.platformRightEnd.parent = this.platformMiddle;
    this.platformRightEnd.orientation= Math.PI;
    this.platformRightEnd.scale = new Vec3(1/8, 1,1);
    this.platformRightEnd.position = new Vec3(1+(1/8),0,0);
    this.gameObjects.push(this.platformRightEnd);


    //flipperPlatform
    this.flipPlatformMiddle = new GameObject2D(this.platformMesh);
    this.flipPlatformMiddle.scale = new Vec3(1/7,1/30,1);
    this.flipPlatformMiddle.position = new Vec3(-.5, -.8, 0);
    this.flipPlatformMiddle.updateModelTransformation();
    this.gameObjects.push(this.flipPlatformMiddle);
      //ends
      this.flipPlatformRightEnd = new GameObject2D(this.platformEndMesh);
      this.flipPlatformRightEnd.parent = this.flipPlatformMiddle;
      this.flipPlatformRightEnd.orientation = Math.PI;
      this.flipPlatformRightEnd.position = new Vec3(1+this.flipPlatformRightEnd.scale.x, 0,0);
      this.flipPlatformRightEnd.updateModelTransformation();
      this.gameObjects.push(this.flipPlatformRightEnd);

      this.flipPlatformLeftEnd = new GameObject2D(this.platformEndMesh);
      this.flipPlatformLeftEnd.parent = this.flipPlatformMiddle;
      this.flipPlatformLeftEnd.position = new Vec3(-(1+this.flipPlatformRightEnd.scale.x), 0,0);
      this.flipPlatformLeftEnd.updateModelTransformation();
      this.gameObjects.push(this.flipPlatformLeftEnd);





    this.diamondTexture = new Texture2D(gl, "js/res/JupiterMedia/diamond.png");
    this.diamondMaterial = new Material(gl,this.asteroidProgram);
    this.diamondMaterial.colorTexture.set(this.diamondTexture);
    this.diamondMesh = new Mesh(this.quadGeometry, this.diamondMaterial);
    this.diamonds = [];
    this.HUDdiamonds = [];


    //Meteors
    this.meteorTexture = new Texture2D(gl, "js/res/JupiterMedia/fireball.png");
    this.meteorMaterial = new Material(gl,this.asteroidProgram);
    this.meteorMaterial.colorTexture.set(this.meteorTexture);
    this.meteorMesh = new Mesh(this.quadGeometry, this.meteorMaterial);
    this.meteors = [];


    //lives
    this.numlives = 3;
    var offset = 0;
    this.lives = [];
    for (var i = 0; i < this.numlives; i++) {
      var life = new GameObject2D(this.landerMesh);
      life.scale = new Vec3(.04,.04,1);
      life.position = new Vec3(-1+life.scale.x+offset*2*life.scale.x, -1+life.scale.y, 0);
      life.updateModelTransformation();
      this.HUDobjects.push(life);
      this.lives.push(life);
      offset++;
    };


    //pokeballs
    this.pokeballTexture = new Texture2D(gl, "js/res/JupiterMedia/pokeball.png");
    this.pokeballMaterial = new Material(gl,this.asteroidProgram);
    this.pokeballMaterial.colorTexture.set(this.pokeballTexture);
    this.pokeballMesh = new Mesh(this.quadGeometry,this.pokeballMaterial);
    this.pokeballs = [];


    //explosion

    this.boomTexture = new Texture2D(gl, "js/res/JupiterMedia/boom.png");
    this.boomMaterial = new Material(gl, this.animationProgram);
    this.boomMaterial.colorTexture.set(this.boomTexture);
    //console.log(this.animationProgram.uniforms);
    this.boomMesh = new Mesh(this.quadGeometry, this.boomMaterial);
    this.booms = [];




      








 
 }

Scene.prototype.thrust = function(keysPressed){

   //don't draw thrusters unless key is pressed
   for (var i = 0; i < this.thrusters.length; i++) {
     this.thrusters[i].toDraw = false;
   };

   if (keysPressed["UP"]){
      this.lander.acceleration.add(this.upThrust.over(this.lander.mass));
      this.upThruster.toDraw = true;
      //make the plasma
      var plasmaObj=new GameObject2D(this.plasmaMesh);
      plasmaObj.acceleration = new Vec3(0,-10,0);
      var plasma = new Plasma(plasmaObj);
      plasma.position = this.lander.position.plus(new Vec3(.13*Math.cos(this.lander.orientation-(Math.PI/2)), .13*Math.sin(this.lander.orientation-(Math.PI/2)),.5));
      plasma.scale= new Vec3(1/100,1/100,1/100);
      plasma.updateGameObj();
      this.plasmas.push(plasma);
      this.gameObjects.push(plasma);

   }
   if (keysPressed["LEFT"]){
      this.lander.acceleration.add(this.leftThrust.over(this.lander.mass));
      this.rightThruster.toDraw = true;
      this.lander.angularVelocity += 1;
      //plasma
      var plasmaObj=new GameObject2D(this.plasmaMesh);
      plasmaObj.acceleration = new Vec3(5,-7,0);
      var plasma = new Plasma(plasmaObj);
      plasma.position = this.lander.position.plus(new Vec3(.12*Math.cos(this.lander.orientation+(Math.PI/5)), .12*Math.sin(this.lander.orientation+(Math.PI/5)),.5));
      plasma.scale= new Vec3(1/100,1/100,1/100);
      plasma.updateGameObj();
      this.plasmas.push(plasma);
      this.gameObjects.push(plasma);

   }
   if (keysPressed["RIGHT"]){
      this.lander.acceleration.add(this.rightThrust.over(this.lander.mass));
      this.leftThruster.toDraw = true;
      this.lander.angularVelocity -= 1;
      //plasma
      var plasmaObj=new GameObject2D(this.plasmaMesh);
      plasmaObj.acceleration = new Vec3(-5,-7,0);
      var plasma = new Plasma(plasmaObj);
      plasma.position = this.lander.position.plus(new Vec3(.11*Math.cos(this.lander.orientation+(4*Math.PI/5)), .11*Math.sin(this.lander.orientation+(4*Math.PI/5)),.5));
      plasma.scale= new Vec3(1/100,1/100,1/100);
      plasma.updateGameObj();
      this.plasmas.push(plasma);
      this.gameObjects.push(plasma);

   }

    if (this.lander.angularVelocity==0&&this.lander.orientation!=0){
      this.lander.angularVelocity-=(this.lander.orientation/Math.abs(this.lander.orientation))*.3;
    }


}


Scene.prototype.accountForDrag = function(){


  for (var i = 0; i <= this.gameObjects.length -1; i++) {
    if(this.gameObjects[i].draggable){
    if(this.gameObjects[i].mass>100){this.gameObjects[i].acceleration = this.forceOfGravity.over(this.gameObjects[i].mass)};
    var theDragForce;
   if (this.gameObjects[i].velocity.length()==0){
    theDragForce = new Vec3(0,0,0);
   }
   else{
    theDragForce = this.gameObjects[i].velocity.direction().times(this.dragCoeff*this.gameObjects[i].velocity.length2());
   }

   this.gameObjects[i].acceleration.sub(theDragForce.over(this.gameObjects[i].mass));
  }
}

}

Scene.prototype.explosionAnimation = function(xCoord,yCoord){
  var boom = new GameObject2D(this.boomMesh);
  boom.position = new Vec3(xCoord, yCoord, 0);
  boom.scale = this.lander.scale;
  //this.boomMaterial.colorTexture.set(this.gl, "js/res/pokeball.png");
  this.boomMaterial.pos = new Vec2(boom.frame%6, Math.floor(boom.frame/6));
  console.log();
  console.log(this.boomMaterial.xPos);
  boom.draggable = false;
  this.gameObjects.push(boom);
  this.booms.push(boom);



}

Scene.prototype.handleCollisions = function(){
     //handle collision (lander & platform)

   //between bottom of lander and top of platform
      //if bottom of lander at or below top of platform
   if (((this.lander.rightEdge>=this.platformMiddle.leftEdge
      //if right edge of lander is to the left of right edge of platform
      && this.lander.rightEdge <= this.platformMiddle.rightEdge)
      //if left edge of lander to the right of left edge of platform
      || (this.lander.leftEdge >= this.platformMiddle.leftEdge
      //if left edge of lander is to the left of right ege of platform
      && this.lander.leftEdge <= this.platformMiddle.rightEdge)))
   {
    if (this.lander.bottomEdge<=this.platformMiddle.topEdge){
      this.lander.acceleration=new Vec3(0,0,0);
      this.lander.velocity = new Vec3(0,0,0);
    }
   }

   //for flipperPlatform
      if (((this.lander.leftEdge<=this.flipPlatformMiddle.rightEdge+2*this.flipPlatformMiddle.scale.x
      //if right edge of lander is to the left of right edge of platform
      &&  this.lander.leftEdge>=this.flipPlatformMiddle.leftEdge - 2*this.flipPlatformMiddle.scale.x)
      //if left edge of lander to the right of left edge of platform
      || (this.lander.rightEdge>=this.flipPlatformMiddle.leftEdge - 2*this.flipPlatformMiddle.scale.x 
      //if left edge of lander is to the left of right ege of platform
      && this.lander.rightEdge<=this.flipPlatformMiddle.rightEdge + 2*this.flipPlatformMiddle.scale.x )) &&
        (this.lander.bottomEdge<=this.flipPlatformMiddle.topEdge
        &&this.lander.topEdge>=this.flipPlatformMiddle.bottomEdge))
   {
      this.lander.acceleration.add(new Vec3(0,120,0));
  }

  //diamonds
  for (var i = 0; i < this.diamonds.length; i++) {
      
      //if the lander and the diamond are horizontally aligned

       if (((this.diamonds[i].rightEdge>=this.lander.leftEdge
      //if right edge of lander is to the left of right edge of platform
      && this.diamonds[i].rightEdge <= this.lander.rightEdge)
      //if left edge of lander to the right of left edge of platform
      || (this.diamonds[i].leftEdge >= this.lander.leftEdge
      //if left edge of lander is to the left of right ege of platform
      && this.diamonds[i].leftEdge <= this.lander.rightEdge)))
       {
          //if the bottom of the diamond hits the top of the lander
          if (this.diamonds[i].bottomEdge<=this.lander.topEdge 
            && this.diamonds[i].topEdge>=this.lander.bottomEdge)
          {
                var index = this.gameObjects.indexOf(this.diamonds[i]);
                this.gameObjects.splice(index,1);
                  this.diamonds[i].scale = new Vec3(.04,.04,1);
                  this.diamonds[i].position=new Vec3(1-2*this.diamonds[i].scale.x*(this.HUDdiamonds.length+1),1-2*this.diamonds[i].scale.y,0);
                  this.diamonds[i].velocity = new Vec3(0,0,0);
                  this.diamonds[i].acceleration = new Vec3(0,0,0);
                  this.diamonds[i].updateModelTransformation();
                this.HUDdiamonds.push(this.diamonds[i]);
                this.HUDobjects.push(this.diamonds[i]);
                this.diamonds.splice(i,1);
          }
       }

     }



  //meteors
  for (var i = 0; i < this.meteors.length; i++) {
      

       if (((this.meteors[i].rightEdge>=this.lander.leftEdge
      //if right edge of lander is to the left of right edge of platform
      && this.meteors[i].rightEdge <= this.lander.rightEdge)
      //if left edge of lander to the right of left edge of platform
      || (this.meteors[i].leftEdge >= this.lander.leftEdge
      //if left edge of lander is to the left of right ege of platform
      && this.meteors[i].leftEdge <= this.lander.rightEdge)))
       {
          //if the bottom of the diamond hits the top of the lander
          if (this.meteors[i].bottomEdge<=this.lander.topEdge 
            && this.meteors[i].topEdge>=this.lander.bottomEdge)
          {
                var index = this.gameObjects.indexOf(this.meteors[i]);
                this.gameObjects.splice(index,1);
                this.meteors.splice(i,1);

                //lose a life
                this.numlives--;
                this.explosionAnimation(this.lander.position.x, this.lander.position.y);
                var lifeIndex = this.HUDobjects.indexOf(this.lives[this.lives.length-1]);
                this.HUDobjects.splice(lifeIndex,1);
                this.lives.splice(this.lives.length-1,1);
                this.lander.position = new Vec3(0,0,0);
                this.lander.updateModelTransformation();
                if(this.numlives==0){this.lander.position= new Vec3(Infinity, Infinity,0);}
          }
       }

     }




  };







Scene.prototype.update = function(gl, keysPressed, clicked, mouseX,mouseY) {
  // // set clear color (part of the OpenGL render state)
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // // clear the screen
   gl.clear(gl.COLOR_BUFFER_BIT);

   var timeAtThisFrame = new Date().getTime();
   var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
   this.timeAtLastFrame = timeAtThisFrame;

    this.frameCounter++;
    this.cooldown++;
   if(this.frameCounter%100==0){
    var diamond = new GameObject2D(this.diamondMesh);
    diamond.position = new Vec3(Math.random()*2-1,1,0);
    diamond.mass = 101;
    diamond.acceleration = this.forceOfGravity.over(diamond.mass);
    //diamond.velocity = new Vec3(0,-10,0);
    diamond.scale = new Vec3(.05,.05,1);
    diamond.updateModelTransformation();
    this.diamonds.push(diamond);
    this.gameObjects.push(diamond);
   }

   if (this.frameCounter%200 == 0){
    var meteor = new GameObject2D(this.meteorMesh);
    meteor.position = this.frameCounter%400==0 ? new Vec3(1,Math.random()*2-1,0) : new Vec3(-1,Math.random()*2-1,0);
    meteor.velocity = this.frameCounter%400==0 ? new Vec3(-2,0,0) : new Vec3(2,0,0);
    if(this.frameCounter%400==0){meteor.orientation = Math.PI;}
    meteor.scale = new Vec3(.09,.07,1);
    meteor.draggable= false;
    this.meteors.push(meteor);
    this.gameObjects.push(meteor);
   }




    //thrusterless acceleration
   this.lander.acceleration = this.forceOfGravity.over(this.lander.mass);
   this.lander.angularVelocity = 0;

    this.handleCollisions();

    this.thrust(keysPressed);


    //camera motion
    if (keysPressed["W"]){
      //this.camera.position.y += dt*10;
       this.camera.windowSize.x--;
      this.camera.windowSize.y--;
    }
    if (keysPressed["A"]){
      this.camera.position.x -= dt*10
    }
    if (keysPressed["S"]){
      //this.camera.position.y -= dt*10;
      this.camera.windowSize.x++;
      this.camera.windowSize.y++;
    }
    if (keysPressed["D"]){
      this.camera.position.x += dt*10;
    }
    this.camera.updateViewProjMatrix();


//increment counter of every plasma ball and delete it if its existed for over ____ frames
var i = this.plasmas.length;
while(i>0){
  i--;
  this.plasmas[i].counter++;
  if (this.plasmas[i].counter>5){
    this.plasmas[i].acceleration = new Vec3(0,-7, 0);
    this.plasmas[i].updateGameObj();
  }
  if(this.plasmas[i].counter>10){
    var index = this.gameObjects.indexOf(this.plasmas[i]);
    this.gameObjects.splice(index,1);
    this.plasmas.splice(i,1);

  }
}




this.accountForDrag();


if(clicked){
console.log({mouseX,mouseY});
if(this.cooldown>50 || this.firstShot){
var pokeball = new GameObject2D(this.pokeballMesh);
pokeball.scale = new Vec3(1/15,1/15,1/15);
pokeball.position = this.lander.position.plus(new Vec3(0,0,0));
pokeball.mass = 7500;
pokeball.draggable = false;
var clickDir= (new Vec3(mouseX,mouseY,0).minus(pokeball.position)).direction();
pokeball.acceleration = (clickDir.times(100));
pokeball.updateModelTransformation();
this.gameObjects.push(pokeball);
this.pokeballs.push(pokeball);
this.cooldown = 0;
this.firstShot=false;
}

}


for (var i = 0; i <= this.gameObjects.length -1; i++) {
  this.gameObjects[i].move(dt);

}

//draw things in the HUD
for (var i = 0; i < this.HUDobjects.length; i++) {
  this.HUDobjects[i].HUDdraw();
};

for (var i = 0; i <= this.gameObjects.length -1; i++) {
  this.gameObjects[i].draw(this.camera);
}

//update animationFrames
for (var i = 0; i < this.booms.length; i++) {
  this.booms[i].frame++;
  this.boomMaterial.pos.set(new Vec2(this.booms[i].frame%6, Math.floor(this.booms[i].frame/6)));
  if (this.booms[i].frame>36){
    var index = this.gameObjects.indexOf(this.booms[i]);
    this.gameObjects.splice(index, 1);
    this.booms.splice(i,1);
  }
};


}




