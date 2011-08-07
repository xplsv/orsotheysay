var Part3Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, cameraTargetPath, vector, particles, particle, material, material2, scene;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 0, 200, 200 ), end: new THREE.Vector3( 0, - 200, 300 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		cameraTargetPath = { start: new THREE.Vector3( 200, 0, 0 ), end: new THREE.Vector3( - 100, 0, 300 ), change: new THREE.Vector3() };
		cameraTargetPath.change.sub( cameraTargetPath.end, cameraTargetPath.start );

		vector = new THREE.Vector3();
		scene = new THREE.Scene();

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova.png' ), blending: THREE.AdditiveBlending } ) );
		scene.addObject( particle );

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );
		material2 = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/galaxy32.png' ), blending: THREE.AdditiveBlending } );

		particles = [];

		for ( var i = 0; i < 1000; i++ ) {

			var galaxy = Math.random() > 0.9;

			particle = particles[ i ] = new THREE.Particle( galaxy ? material2 : material );
			particle.position.x = Math.random() - 0.5;
			particle.position.y = Math.random() - 0.5;
			particle.position.z = Math.random() - 0.5;
			particle.position.normalize();
			particle.position.multiplyScalar( Math.random() * Math.random() * Math.random() * 200 + 50 );

			particle.data = { start: new THREE.Vector3(), change: new THREE.Vector3() };
			particle.data.start.copy( particle.position ) ;

			particle.data.change.copy( particle.position );
			particle.data.change.normalize();
			particle.data.change.multiplyScalar( Math.random() * 400 );
			particle.data.change.addSelf( particle.position );

			if ( galaxy ) {

				particle.scale.x = Math.random() * 0.1 + 0.05;
				particle.scale.y = Math.random() * 0.1 + 0.05;
				particle.rotation.z = Math.random() * Math.PI;

			} else {

				particle.scale.x = particle.scale.y = Math.random() * 0.2;

			}

			scene.addObject( particle );
		}

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		camera.target.position.copy( cameraTargetPath.change );
		camera.target.position.multiplyScalar( k );
		camera.target.position.addSelf( cameraTargetPath.start );

		for ( var i = 0, l = particles.length; i < l; i++ ) {

			particle = particles[ i ];

			vector.copy( particle.data.change );
			vector.multiplyScalar( k );

			particle.position.add( particle.data.start, vector );

		}

		renderer.render( scene, camera );

	};

};


Part3Effect.prototype = new Effect();
Part3Effect.prototype.constructor = Part3Effect;
