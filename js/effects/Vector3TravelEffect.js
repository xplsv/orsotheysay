var Vector3TravelEffect = function ( vector, start, end ) {

	Effect.call( this );

	// Init

	var current, change,

	current = new THREE.Vector3();
	change = new THREE.Vector3();
	change.sub( end, start );

	// Update

	this.update = function ( time ) {

		current.copy( change );
		current.multiplyScalar( time );
		current.addSelf( start );
		vector.copy( current );

	};

};


Vector3TravelEffect.prototype = new Effect();
Vector3TravelEffect.prototype.constructor = Vector3TravelEffect;
