var Part7Effect = function ( camera, renderer ) {

	Effect.call( this );

	// Init

	var context, asteroids, particle, geometry, mesh, material, scene1, scene2;

	scene1 = new THREE.Scene();
	scene2 = new THREE.Scene();
	scene3 = new THREE.Scene();

	particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/sun.png' ) );
	particle.scale.x = particle.scale.y = 5;
	scene1.addObject( particle );

	particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/sun2.png' ) );
	particle.scale.x = particle.scale.y = 3;
	scene3.addObject( particle );

	material = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/nova_particle.png' );

	for (var i = 0; i < 1000; i++) {

		particle = new THREE.Particle( material );
		particle.position.x = Math.random() * 4000 - 2000;
		particle.position.y = Math.random() * 4000 - 2000;
		particle.position.z = Math.random() * 4000 - 2000;
		particle.scale.x = particle.scale.y = Math.random() * Math.random();
		scene1.addObject( particle );
	}

	material = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/asteroid.png' );

	for (var i = 0; i < 200; i++) {

		particle = new THREE.Particle( material );
		particle.position.x = Math.random() - 0.5;
		particle.position.y = Math.random() - 0.5;
		particle.position.normalize();
		particle.position.multiplyScalar( Math.random() * 150 + 60 );
		particle.position.z = Math.random() * 800 + 400;
		particle.rotation.z = Math.random() * Math.PI;
		particle.scale.x = particle.scale.y = 0.0001 + Math.random() * Math.random();
		scene2.addObject( particle );
	}


	asteroids = [];

	geometry = new Asteroid();
	material = new THREE.MeshColorFillMaterial( 0x000000 );

	for (var i = 0; i < 20; i++) {

		asteroids[ i ] = mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.random() - 0.5;
		mesh.position.y = Math.random() - 0.5;
		mesh.position.normalize();
		mesh.position.multiplyScalar( Math.random() * 60 + 15 );
		mesh.position.z = Math.random() * 800 + 400;
		mesh.rotation.x = Math.random() * Math.PI;
		mesh.rotation.y = Math.random() * Math.PI;
		mesh.rotation.z = Math.random() * Math.PI;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 1;
		mesh.overdraw = true;
		scene2.addObject( mesh );

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

		for ( var i = 0, l = asteroids.length; i < l; i ++ ) {

			mesh = asteroids[ i ];
			mesh.rotation.x = i + time * 2;
			mesh.rotation.y = i - time * 2;
			mesh.rotation.z = i + time * 2;

		}

		renderer.clear();

		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'lighter';
		renderer.render( scene1, camera );

		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'source-over';
		renderer.render( scene2, camera );
		renderer.render( scene3, camera );
	};

};


Part7Effect.prototype = new Effect();
Part7Effect.prototype.constructor = Part7Effect;
