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
  this.metronome.scale = new Vec3(.025,.4,1);
  this.metronome.position = new Vec3(0,0.5,0);
  this.metronome.updateModelTransformation(); 

  this.gameObjects.push(this.metronome);

  //initialize outer track array
  this.trackMaterial = new Material(gl, this.textureProgram);
  this.trackTexture = new Texture2D(gl, "js/res/track.png");
  this.trackMaterial.colorTexture.set(this.trackTexture);
  this.trackMesh = new Mesh(this.quadGeometry, this.trackMaterial);

  this.Track0 = new Track(this.trackMesh, []);





 
 };












Scene.prototype.update = function(gl, keysPressed, clicked, mouseX,mouseY) {
  // // set clear color (part of the OpenGL render state)
   gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // // clear the screen
   gl.clear(gl.COLOR_BUFFER_BIT);

   var timeAtThisFrame = new Date().getTime();
   var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
   this.timeAtLastFrame = timeAtThisFrame;


   this.metronome.orbit(new Vec3(0,0,0), -.8*dt);

   this.Track0.draw();
   //draw the game objects
  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
   	this.gameObjects[i].draw();
   };




    
};




