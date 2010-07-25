var Part6Effect = function ( camera, renderer ) {

	Effect.call( this );

	// Init

	var particle, line, material, material2, scene;

	scene = new THREE.Scene();

	material = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/nova_particle.png' );

	for (var i = 0; i < 1000; i++) {

		particle = new THREE.Particle( material );
		particle.position.x = Math.random() * 4000 - 2000;
		particle.position.y = Math.random() * 4000 - 2000;
		particle.position.z = Math.random() * 4000 - 2000;
		particle.scale.x = particle.scale.y = Math.random() * Math.random() * 1;
		scene.addObject( particle );
	}

	particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/sun.png' ) );
	scene.addObject( particle );

	material = new THREE.LineColorMaterial( 0x00ffff, 1 );
	material2 = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/line_planet.png' );

	for ( var j = 0; j < 10; j ++ ) {

		var resolution = 60;
		var amplitude = 100 + ( j * Math.random() * 50 );
		var size = 360 / resolution;

		geometry = new THREE.Geometry();

		for ( var i = 0; i <= resolution; i ++ ) {

			segment = ( i * size ) * Math.PI / 180;
			geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) ) );

		}

		line = new THREE.Line( geometry, material );
		scene.addObject( line );

		var rand = Math.random() * Math.PI * 2;

		particle =new THREE.Particle( material2 );
		particle.position.x = Math.cos( rand ) * amplitude;
		particle.position.z = Math.sin( rand ) * amplitude;
		particle.scale.x = particle.scale.y = 0.5;
		scene.addObject( particle );


	}

	//

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


Part6Effect.prototype = new Effect();
Part6Effect.prototype.constructor = Part6Effect;
