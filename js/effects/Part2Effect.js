var Part2Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, vector, particles, particle, material, scene;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 0, 0, 1000 ), end: new THREE.Vector3( 0, 0, 400 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		vector = new THREE.Vector3();
		scene = new THREE.Scene();

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nebula.png' ) } ) );
		particle.position.z = - 2000;
		particle.scale.x = particle.scale.y = 4;
		scene.addObject( particle );

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova.png' ), blending: THREE.AdditiveBlending } ) );
		scene.addObject( particle );

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );

		particles = [];

		for ( var i = 0; i < 1000; i++ ) {

			particle = particles[ i ] = new THREE.Particle( material );
			particle.position.x = Math.random() - 0.5;
			particle.position.y = Math.random() - 0.5;
			particle.position.z = Math.random() - 0.5;
			particle.position.normalize();
			particle.position.multiplyScalar( Math.random() * Math.random() * Math.random() * 200 + 50 );

			particle.data = { start: new THREE.Vector3(), change: new THREE.Vector3() };
			particle.data.start.copy( particle.position ) ;

			particle.data.change.copy( particle.position );
			particle.data.change.normalize();
			particle.data.change.multiplyScalar( Math.random() * 600 );
			particle.data.change.subSelf( particle.position );

			particle.scale.x = particle.scale.y = Math.random() * 0.4;
			scene.addObject( particle );
		}

	};

	this.show = function () {

		camera.target.position.set( 0, 0, 0 );

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		for ( var i = 0, l = particles.length; i < l; i++ ) {

			particle = particles[ i ];

			vector.copy( particle.data.change );
			vector.multiplyScalar( k );

			particle.position.add( particle.data.start, vector );

		}

		renderer.render( scene, camera );

	};

};


Part2Effect.prototype = new Effect();
Part2Effect.prototype.constructor = Part2Effect;
