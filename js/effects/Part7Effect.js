var Part7Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, context, asteroids, particle, geometry, mesh, material, scene1, scene2;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 0, 0, 300 ), end: new THREE.Vector3( 0, 0, 1000 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		scene1 = new THREE.Scene();
		scene2 = new THREE.Scene();
		scene3 = new THREE.Scene();

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/sun.png' ), blending: THREE.AdditiveBlending } ) );
		particle.scale.x = particle.scale.y = 5;
		scene1.addObject( particle );

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );

		for (var i = 0; i < 1000; i++) {

			particle = new THREE.Particle( material );
			particle.position.x = Math.random() * 4000 - 2000;
			particle.position.y = Math.random() * 4000 - 2000;
			particle.position.z = Math.random() * 4000 - 2000;
			particle.scale.x = particle.scale.y = Math.random() * Math.random();
			scene1.addObject( particle );
		}

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/asteroid.png' ) } );

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
		material = new THREE.MeshBasicMaterial( { color: 0x000000 } );

		for (var i = 0; i < 20; i++) {

			asteroids[ i ] = mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = Math.random() - 0.5;
			mesh.position.y = Math.random() - 0.5;
			mesh.position.normalize();
			mesh.position.multiplyScalar( Math.random() * 60 + 20 );
			mesh.position.z = Math.random() * 800 + 400;
			mesh.rotation.x = Math.random() * Math.PI;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = Math.random() * Math.PI;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 1;
			mesh.overdraw = true;
			scene2.addObject( mesh );

		}

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/sun2.png' ), blending: THREE.AdditiveBlending } ) );
		particle.scale.x = particle.scale.y = 3;
		scene3.addObject( particle );

	};

	this.show = function () {

		camera.target.position.set( 0, 0, 0 );

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		for ( var i = 0, l = asteroids.length; i < l; i ++ ) {

			mesh = asteroids[ i ];
			mesh.rotation.x = i + k * 2;
			mesh.rotation.y = i - k * 2;
			mesh.rotation.z = i + k * 2;

		}

		renderer.render( scene1, camera );
		renderer.render( scene2, camera );
		renderer.render( scene3, camera );
	};

};


Part7Effect.prototype = new Effect();
Part7Effect.prototype.constructor = Part7Effect;
