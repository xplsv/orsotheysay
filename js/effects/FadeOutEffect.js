var FadeOutEffect = function ( hex, renderer ) {

	Effect.call( this );

	var camera, scene, material, mesh;

	this.init = function( callback ) {

		camera = new THREE.Camera( 60, 1, 1, 20000 );
		camera.position.z = 3;

		scene = new THREE.Scene();

		material = new THREE.MeshBasicMaterial( { color: hex, opacity: 1 } );

		mesh = new THREE.Mesh( new Plane( 4, 4 ), material );
		mesh.overdraw = true;

		scene.addObject( mesh );

	};

	this.update = function ( i ) {

		material.opacity = 1 - i;
		renderer.render( scene, camera );

	};

};

FadeOutEffect.prototype = new Effect();
FadeOutEffect.prototype.constructor = FadeOutEffect;
