var GameObject2D = function(mesh) { 
  this.mesh = mesh;
  this.draggable=true;
  this.frame =0;

  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1);
  this.mass = 1;
  this.velocity = new Vec3(0,0,0);
  this.acceleration = new Vec3(0,0,0);

  this.elasticity = .1;

  //angular shit
  this.angularVelocity = 0;
  this.angularAcceleration = 0;

  this.modelMatrix = new Mat4(); 
  this.updateModelTransformation(); 

  this.parent = null;

  this.toDraw = true;



  //edges
  this.bottomEdge = this.position.y-(this.scale.y);
  this.topEdge = this.position.y+(this.scale.y);
  this.rightEdge = this.position.x+(this.scale.x);
  this.leftEdge = this.position.x-(this.scale.x);

};

GameObject2D.prototype.updateModelTransformation = function(){ 
  this.modelMatrix.set(). 
    scale(this.scale). 
    rotate(this.orientation). 
    translate(this.position);

};

GameObject2D.prototype.orbit = function(point,angle){
  var rotationMatrix = new Mat4().set().rotate(angle);
  var differenceVector = point.minus(this.position);
  var radius = differenceVector.length();
  var direction = differenceVector.direction();
  direction.xyz1mul(rotationMatrix);

  this.position.add(differenceVector);
  this.position.sub(direction.mul(radius));
  this.orientation+=angle;

  this.updateModelTransformation();



}

GameObject2D.prototype.draw = function(){ 

  Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix);

  this.mesh.draw(); 
};


GameObject2D.prototype.Lamedraw = function(camera){ 

  if (this.parent == null){
    Material.shared.modelViewProjMatrix.set(). 
      mul(this.modelMatrix).mul(camera.viewProjMatrix);
      //figure out what comes here
  }else{
    Material.shared.modelViewProjMatrix.set(). 
      mul(this.modelMatrix).mul(this.parent.modelMatrix).mul(camera.viewProjMatrix);
  }


  if (this.toDraw){this.mesh.draw()}; 
};

GameObject2D.prototype.updateEdges = function(){
if(this.parent==null){
  this.bottomEdge = this.position.y-(this.scale.y);
  this.topEdge = this.position.y+this.scale.y;
  this.rightEdge = this.position.x+this.scale.x;
  this.leftEdge = this.position.x-this.scale.x;
}else{
  this.bottomEdge = (this.parent.position.y+(this.position.y*this.parent.scale.y))-(this.scale.y*this.parent.scale.y);
  this.topEdge = (this.position.y+this.parent.position.y*this.parent.scale.y)+(this.scale.y*this.parent.scale.y);
  this.rightEdge = (this.position.x+this.parent.position.x*this.parent.scale.x)+(this.scale.x*this.parent.scale.x);
  this.leftEdge = (this.position.x+this.parent.position.x*this.parent.scale.x)-(this.scale.x*this.parent.scale.x);

}

}


GameObject2D.prototype.move = function(dt){

	this.velocity.add(this.acceleration.times(dt));
	this.position.add(this.velocity.times(dt));
  this.angularVelocity+=this.angularAcceleration*dt;
  this.orientation+=this.angularVelocity*dt;
	this.updateModelTransformation();

  this.updateEdges();
}
