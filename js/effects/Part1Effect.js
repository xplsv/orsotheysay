var Part1Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, scene, particles, particle, material;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 0, 0, 200 ), end: new THREE.Vector3( 0, 0, 10000 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		scene = new THREE.Scene();

		particles = [];

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );

		for ( var i = 0; i < 1000; i ++ ) {

			particles[ i ] = particle = new THREE.Particle( material );
			particle.position.x = Math.random() - 0.5;
			particle.position.y = Math.random() - 0.5;
			particle.position.z = Math.random() - 0.5;
			particle.position.normalize();
			particle.position.multiplyScalar( Math.random() * 1000 + 100 );
			particle.scale.x = particle.scale.y = Math.random() * 0.5;
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

		renderer.render( scene, camera );

	};

};


Part1Effect.prototype = new Effect();
Part1Effect.prototype.constructor = Part1Effect;
