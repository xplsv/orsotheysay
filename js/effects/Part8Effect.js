var Part8Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, cameraTargetPath, scene1, scene2, scene3,
	particle, mesh, material;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 400, 0, 400 ), end: new THREE.Vector3( 0, 200, 800 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		cameraTargetPath = { start: new THREE.Vector3( 0, 100, 0 ), end: new THREE.Vector3( 0, - 100, 0 ), change: new THREE.Vector3() };
		cameraTargetPath.change.sub( cameraTargetPath.end, cameraTargetPath.start );

		scene1 = new THREE.Scene();
		scene2 = new THREE.Scene();
		scene3 = new THREE.Scene();

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nebula.png' ) } ) );
		particle.position.x = - 400;
		particle.position.z = - 800;
		particle.scale.x = particle.scale.y = 3;
		scene1.addObject( particle );

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/atmosphere.png' ), blending: THREE.AdditiveBlending } ) );
		particle.scale.x = particle.scale.y = 2.1;
		scene1.addObject( particle );

		for ( var i = 0; i < 1000; i ++ ) {

			particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { color: 0xffffff, opacity: Math.random() * 0.5 + 0.5 } ) );
			particle.position.x = Math.random() * 4000 - 2000;
			particle.position.y = Math.random() * 4000 - 2000;
			particle.position.z = Math.random() * 4000 - 2000;
			particle.scale.x = particle.scale.y = Math.random() + 0.5;
			scene2.addObject( particle );
		}

		mesh = new THREE.Mesh( new Sphere( 200, 20, 20 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/earth.jpg' ) } ) );
		scene2.addObject( mesh );

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/atmosphere2.png' ), blending: THREE.AdditiveBlending } ) );
		particle.scale.x = particle.scale.y = 2.29;
		scene3.addObject( particle );

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		camera.target.position.copy( cameraTargetPath.change );
		camera.target.position.multiplyScalar( k );
		camera.target.position.addSelf( cameraTargetPath.start );

		mesh.rotation.y = k * 0.5 + 2;

		renderer.render( scene1, camera );
		renderer.render( scene2, camera );
		renderer.render( scene3, camera );

	};

};


Part8Effect.prototype = new Effect();
Part8Effect.prototype.constructor = Part8Effect;
