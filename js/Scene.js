var Scene = function(gl, output) {

  this.gl = gl;
  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);


  this.timeAtLastFrame = new Date().getTime();


  this.gameObjects = [];

  this.quadGeometry = new QuadGeometry(gl);


  // shader/program set ups
  this.vsGeneral = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "white_fs.essl"); 
  this.drumCircleProgram = new Program(gl, this.vsGeneral, this.fsSolid);

  this.fsAnimation = new Shader(gl, gl.FRAGMENT_SHADER, "animation_fs.essl");
  this.animationProgram = new Program(gl, this.vsGeneral, this.fsAnimation);

  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.textureProgram = new Program(gl, this.vsGeneral, this.fsTexture);



  //Game object set ups

  //metronome set-up
  this.metronomeMaterial = new Material(gl, this.drumCircleProgram);
  this.metronomeMesh = new Mesh(this.quadGeometry, this.metronomeMaterial);

  this.metronome = new GameObject2D(this.metronomeMesh);
  this.metronome.scale = new Vec3(.45,.025,1);
  this.metronome.position = new Vec3(0.45,0,0);
  this.metronome.updateModelTransformation(); 

  this.gameObjects.push(this.metronome);

  //initialize outer track array
  this.trackMaterial = new Material(gl, this.textureProgram);
  this.trackTexture = new Texture2D(gl, "js/res/track_circle.png");
  this.trackMaterial.colorTexture.set(this.trackTexture);
  this.trackMesh = new Mesh(this.quadGeometry, this.trackMaterial);
  this.trackArray = [];
  this.Track0 = new Track(this.trackMesh, this.gl);
  this.Track0.position = new Vec3(0,0,0);
  this.Track0.scale = new Vec3(.9,.9,0);
  this.Track0.updateModelTransformation();
  this.Track0.initializeSlots(this.Track0.numSlots);
  this.trackArray.push(this.Track0);


  this.Track1 = new Track(this.trackMesh, this.gl);
  this.Track1.position = new Vec3(0,0,0);
  this.Track1.scale = new Vec3(.7,.7,0);
  this.Track1.updateModelTransformation();
  this.Track1.initializeSlots(this.Track1.numSlots);
  this.trackArray.push(this.Track1);

  //best architecture should be to add slot objects to a track object, and have
  //the track object handle where on the track each slot should be put, maybe
  //have like a fill function, or initialize it with a certain number of slots
  //then each slot can have its own checks to see if its clicked called by some 
  //click checker for the track object... let's make this ish clean ;)


  this.centerTestMaterial = new Material(gl, this.drumCircleProgram);
  this.centerTestMesh = new Mesh(this.quadGeometry, this.centerTestMaterial);

  this.centerTest = new GameObject2D(this.centerTestMesh);
  this.centerTest.position = new Vec3(0,0,0);
  this.centerTest.scale = new Vec3(.01,.01,1);
  this.centerTest.updateModelTransformation();


 
 };

 Scene.prototype.checkSoundSlots = function(){
  for (var i = 0; i < this.trackArray.length; i++) {
    this.trackArray[i].checkSoundSlots(this.metronome.orientation % (Math.PI*2));
  };
 }


document.onmousedown = function(event){
    var mouseX = (event.clientX-canvas.width/2)/(canvas.width/2);
    var mouseY = (-event.clientY+canvas.height/2)/(canvas.height/2);
    //console.log("mouse dwn event called");
    //app.scene.Track0.checkSlotClicks(mouseX,mouseY);
    for (var i = 0; i < app.scene.trackArray.length; i++) {
   		app.scene.trackArray[i].checkSlotClicks(mouseX,mouseY);
   }

  }


Scene.prototype.update = function(gl, keysPressed, clicked, mouseX,mouseY) {
  // // set clear color (part of the OpenGL render state)
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // // clear the screen
   gl.clear(gl.COLOR_BUFFER_BIT);

   var timeAtThisFrame = new Date().getTime();
   var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
   this.timeAtLastFrame = timeAtThisFrame;


   this.metronome.orbit(new Vec3(0,0,0), -.8*dt);
   this.centerTest.draw();
   //this.Track0.drawTrack();

   for (var i = 0; i < this.trackArray.length; i++) {
   	this.trackArray[i].drawTrack();
   }

   //console.log("metronome's theta: " + this.metronome.orientation);
   this.checkSoundSlots();
   //draw the game objects
  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
   	this.gameObjects[i].draw();
   };




    
};




