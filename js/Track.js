var Track = function(mesh, gl){
	GameObject2D.call(this,mesh);
	this.gl = gl;
	this.program = mesh.material.program;
	this.quadGeometry = mesh.geometry;

	console.log(this.program);


	this.trackArray = [];

	//default value is eight for eighth notes
	//might should change to some fraction of measures so measure can be customizable
	this.numSlots = 8;
	this.soundPath = "js/res/HiHat.wav";
	//this.initializeSlots(this.numSlots);

};

Track.prototype = Object.create(GameObject2D.prototype);

Track.prototype.constructor = Track;

Track.prototype.initializeSlots = function(numSlots){

	this.slotMaterial = new Material(this.gl, this.program);
	this.slotOnTexture = new Texture2D(this.gl, "js/res/clicked_slot.png");
	this.slotOffTexture = new Texture2D(this.gl, "js/res/unclicked_slot.png");
	this.slotMaterial.colorTexture.set(this.slotTexture);
	this.slotMesh = new Mesh(this.quadGeometry, this.slotMaterial);
	for (var i = 0; i < numSlots; i++) {
		//make a slot object
		var slot = new Slot(this.slotMesh, this);
		var theta = ((2*Math.PI)/numSlots)*i;
		var radius = 1;
		slot.scale = new Vec3(.1,.1,1);
		slot.position = new Vec3(radius*Math.cos(theta),radius*Math.sin(theta),1);
		slot.setOnTexture(this.slotOnTexture);
		slot.setOffTexture(this.slotOffTexture);
		slot.theta = theta;
		//maybe multiply beforehand?
		slot.updateModelTransformation();
		slot.modelMatrix.mul(this.modelMatrix);
		//slot.soundPath = this.soundPath;
		slot.setSoundPath(this.soundPath);

		//add it to the global Array of slot objects

		this.trackArray.push(slot);
	};
};

Track.prototype.drawTrack = function(){
	this.draw();
	for (var i = 0; i < this.trackArray.length; i++) {
		this.trackArray[i].draw();
	};
}


Track.prototype.checkSlotClicks = function(mouseX, mouseY){
	//get the mouseclick in the same scale as the slot ????
	var mouseVector = new Vec3(mouseX, mouseY,1);
	//this.updateModelTransformation();
	//console.log("mouseVector before scale: ("+ mouseX+","+mouseY+")");
	// var scalingMat = this.modelMatrix.clone();
	// scalingMat.invert().transpose();
	//console.log(scalingMat);
	//console.log(this.modelMatrix);
	//mouseVector.xyz1mul(scalingMat);
	//console.log("mouseVector after scale: ("+ mouseVector.x+","+mouseVector.y+")");
	for (var i = 0; i < this.trackArray.length; i++) {
		this.trackArray[i].checkClick(mouseVector);
	};


};

Track.prototype.checkSoundSlots = function(theta){
	for (var i = 0; i < this.trackArray.length; i++) {
		this.trackArray[i].checkSoundSlot(theta);
	};
}

