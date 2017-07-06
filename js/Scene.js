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
  this.vsTrafo2d = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl"); 
  this.drumCircleProgram = new Program(gl, this.vsTrafo2d, this.fsSolid);

  this.fsAnimation = new Shader(gl, gl.FRAGMENT_SHADER, "animation_fs.essl");
  this.animationProgram = new Program(gl, this.vsTrafo2d, this.fsAnimation);





  //Game object set ups
  this.metronomeMaterial = new Material(gl, this.drumCircleProgram);
  this.metronomeMesh = new Mesh(this.quadGeometry, this.metronomeMaterial);

  this.metronome = new GameObject2D(this.metronomeMesh);
  this.metronome.scale = new Vec3(.025,.4,1);
  this.metronome.position = new Vec3(0,0.5,0);
  this.metronome.updateModelTransformation(); 

  this.gameObjects.push(this.metronome);



 
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

   //draw the game objects
  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
   	this.gameObjects[i].draw();
   };


    
};




