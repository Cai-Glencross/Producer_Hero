var Slot = function(mesh, track){
	GameObject2D.call(this,mesh);

	this.track = track; 
	this.trackMatInv = track.modelMatrix.clone();
	this.trackMatInv.invert();

	this.onTexture;
	this.offTexture;
	this.theta;

	this.hasBeenPlayed = false;

	this.isOn = false;

	this.soundPath = "js/res/HiHat.wav";
	this.setSoundPath(this.soundPath);
	this.soundIndex = 0;
};

Slot.prototype = Object.create(GameObject2D.prototype);

Slot.prototype.constructor = Track;

Slot.prototype.setSoundPath = function(soundPath){
	this.soundPath = soundPath;
	this.sounds = [];
	for (var i = 0; i < 10; i++) {
		this.sounds.push(new Audio(soundPath));
	}
}

Slot.prototype.setOnTexture = function(onTexture){
	this.onTexture = onTexture;
}

Slot.prototype.setOffTexture = function(offTexture){
	this.offTexture = offTexture;
}


Slot.prototype.checkClick = function(mouseVector){
	//check if the mouseClick fell within the slot
	//console.log(mouseVector)
	var scaledPos = this.position.clone();
	scaledPos.xyz1mul(this.trackMatInv);

	// console.log("slot position= ("+ scaledPos.x+","+scaledPos.y+
	// 				") click position(scaled?) = ("+ mouseVector.x+","+mouseVector.y+")");

	//console.log("difference: ("+mouseVector.minus(scaledPos).x+","+mouseVector.minus(scaledPos).y+")");
	var difference = mouseVector.minus(scaledPos);
	var distance = Math.sqrt(Math.pow(difference.x,2)+Math.pow(difference.y,2));
	//console.log("distance: "+ distance);

	var scaledScale = this.scale.clone();
	scaledScale.xyz1mul(this.trackMatInv);
	//console.log("scale: "+scaledScale.x);
	if(distance < scaledScale.x){
		//console.log("you clicked something");
		//toggle on/off
		this.isOn = !this.isOn;
		//console.log(this.theta);
	}
	
};

Slot.prototype.draw = function(){
if(this.isOn){
	this.mesh.material.colorTexture.set(this.onTexture);
}else{
	this.mesh.material.colorTexture.set(this.offTexture);
}

  Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix);

  this.mesh.draw(); 
};


Slot.prototype.checkSoundSlot = function(metroTheta){
	var buffer = 0.1;
	var theta = Math.PI*2 + metroTheta;
	//console.log("metronome orientation: "+theta+"slot orientation: "+this.theta);
	if(theta >= this.theta-buffer && theta <=this.theta+buffer){
		var index = this.track.trackArray.indexOf(this);
		console.log("index of slot hit is: "+ index);
		if(index == 0){
			index = this.track.trackArray.length;
		}
		this.track.trackArray[index - 1].hasBeenPlayed = false; 
		console.log("metronome hit a slot");
		if(this.isOn && this.hasBeenPlayed == false){
			//console.log("!!!METRONOME HIT AN ACTIVESLOT!!!");
			this.hasBeenPlayed = true;
			this.sounds[this.soundIndex].play();
			this.soundIndex++;
			if(this.soundIndex>this.sounds.length - 1){
				this.soundIndex = 0;
			}
		}
	}
}








