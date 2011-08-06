var Part4Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, cameraTargetPath, scene, cube, particle, galaxies, mesh, material, material2;

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 0, 0, - 5000 ), end: new THREE.Vector3( 0, 0, 4000 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		cameraTargetPath = { start: new THREE.Vector3( 0, 0, - 5000 ), end: new THREE.Vector3( 0, 0,  - 2000 ), change: new THREE.Vector3() };
		cameraTargetPath.change.sub( cameraTargetPath.end, cameraTargetPath.start );

		scene = new THREE.Scene();

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );

		for (var i = 0; i < 500; i++) {

			particle = new THREE.Particle( material );
			particle.position.x = Math.random() * 10000 - 5000;
			particle.position.y = Math.random() * 10000 - 5000;
			particle.position.z = Math.random() * 10000 - 8000;
			particle.scale.x = particle.scale.y = Math.random() * 0.5 + 0.5;
			scene.addObject( particle );
		}

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova.png' ), blending: THREE.AdditiveBlending } );
		material2 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/galaxy.jpg' ), blending: THREE.AdditiveBlending } );

		galaxies = [];

		for ( var i = 0; i < 100; i ++ ) {

			particle = new THREE.Particle( material );
			particle.position.x = Math.random() * 10000 - 5000;
			particle.position.y = Math.random() * 10000 - 5000;
			particle.position.z = Math.random() * 10000 - 8000;
			scene.addObject( particle );

			galaxies[ i ] = mesh = new THREE.Mesh( new Plane( 400, 400, 2, 2 ), material2 );
			mesh.position.x = particle.position.x;
			mesh.position.y = particle.position.y;
			mesh.position.z = particle.position.z;
			mesh.rotation.x = - 90 * Math.PI / 180;
			mesh.rotation.y =  Math.random() * Math.PI;
			mesh.doubleSided = true;
			scene.addObject( mesh );

		}

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		camera.target.position.copy( cameraTargetPath.change );
		camera.target.position.multiplyScalar( k );
		camera.target.position.addSelf( cameraTargetPath.start );

		for ( var i = 0; i < 100; i ++ ) {

			mesh = galaxies[ i ];
			mesh.rotation.z = - k * 2;

		}

		renderer.render( scene, camera );

	};

};


Part4Effect.prototype = new Effect();
Part4Effect.prototype.constructor = Part4Effect;
