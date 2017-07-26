var Track = function(mesh, trackArray){
	GameObject2D.call(this,mesh);

	this.trackArray = trackArray;
};

Track.prototype = Object.create(GameObject2D.prototype);

Track.prototype.constructor = Track;

