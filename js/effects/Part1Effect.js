var Part1Effect = function ( camera, renderer ) {

	Effect.call( this );

	// Init

	var vector, particles, particle, material, scene;

	vector = new THREE.Vector3();

	scene = new THREE.Scene();
	material = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/nova_particle.png' );

	particles = [];

	for (var i = 0; i < 1000; i++) {

		particles[ i ] = particle = new THREE.Particle( material );
		particle.position.x = Math.random() - 0.5;
		particle.position.y = Math.random() - 0.5;
		particle.position.z = Math.random() - 0.5;
		particle.position.normalize();
		particle.position.multiplyScalar( Math.random() * 1000 + 100 );
		particle.scale.x = particle.scale.y = Math.random() * 0.5;
		scene.addObject( particle );
	}

	function loadImage( material, path ) {

		var image = new Image();

		image.onload = function () {

			material.bitmap = this;

		};

		image.src = path;

		return material;

	}

	//

	this.show = function () {

		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'lighter';

	};

	this.update = function ( time ) {

		renderer.clear();
		renderer.render( scene, camera );

	};

};


Part1Effect.prototype = new Effect();
Part1Effect.prototype.constructor = Part1Effect;
