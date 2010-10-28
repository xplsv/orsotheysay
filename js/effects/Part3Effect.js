var Part3Effect = function ( camera, renderer ) {

	Effect.call( this );

	var vector, particles, particle, material, material2, scene;

	this.init = function () {

		vector = new THREE.Vector3();
		scene = new THREE.Scene();

		particle = new THREE.Particle( loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/nova.png' ) );
		scene.addObject( particle );

		material = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/nova_particle.png' );
		material2 = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/galaxy32.png' );

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

		function loadImage( material, path ) {

			var image = new Image();

			image.onload = function () {

				material.bitmap = this;

			};

			image.src = path;

			return material;

		}

	};

	this.show = function () {

		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'lighter';

	};

	this.update = function ( time ) {

		for ( var i = 0, l = particles.length; i < l; i++ ) {

			particle = particles[ i ];

			vector.copy( particle.data.change );
			vector.multiplyScalar( time );

			particle.position.add( particle.data.start, vector );

		}

		renderer.clear();
		renderer.render( scene, camera );

	};

};


Part3Effect.prototype = new Effect();
Part3Effect.prototype.constructor = Part3Effect;
