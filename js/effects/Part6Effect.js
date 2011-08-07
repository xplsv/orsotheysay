var Part6Effect = function ( camera, renderer ) {

	Effect.call( this );

	var cameraPath, cameraTargetPath, particle, line, material, material2, scene,
	greetings = ["Ate Bit", "ASD", "CNCD", "DNA", "Evoflash", "Fairlight", "Farbrausch", "Orange", "Ozone", "Quite", "Rgba", "Satori", "Spöntz", "SQNY", "Still", "Tpolm"];

	this.init = function () {

		cameraPath = { start: new THREE.Vector3( 500, 0, 500 ), end: new THREE.Vector3( 0, 200, 500 ), change: new THREE.Vector3() };
		cameraPath.change.sub( cameraPath.end, cameraPath.start );

		cameraTargetPath = { start: new THREE.Vector3( - 100, - 600, 0 ), end: new THREE.Vector3( 50, - 100, 0 ), change: new THREE.Vector3() };
		cameraTargetPath.change.sub( cameraTargetPath.end, cameraTargetPath.start );

		scene = new THREE.Scene();

		material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/nova_particle.png' ), blending: THREE.AdditiveBlending } );

		for ( var i = 0; i < 1000; i ++ ) {

			particle = new THREE.Particle( material );
			particle.position.x = Math.random() * 4000 - 2000;
			particle.position.y = Math.random() * 4000 - 2000;
			particle.position.z = Math.random() * 4000 - 2000;
			particle.scale.x = particle.scale.y = Math.random() * Math.random() * 1;
			scene.addObject( particle );
		}

		particle = new THREE.Particle( new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/sun.png' ), blending: THREE.AdditiveBlending } ) );
		scene.addObject( particle );

		material = new THREE.LineBasicMaterial( { color: 0x008080, opacity: 0.5, blending: THREE.AdditiveBlending } );
		material2 = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'files/textures/line_planet.png' ), blending: THREE.AdditiveBlending } );

		for ( var j = 0; j < greetings.length; j ++ ) {

			var resolution = 60;
			var amplitude = 100 + ( j * ( Math.random() * 20 + 10 ) );
			var size = 360 / resolution;

			geometry = new THREE.Geometry();

			for ( var i = 0; i <= resolution; i ++ ) {

				segment = ( i * size ) * Math.PI / 180;
				geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) ) );

			}

			line = new THREE.Line( geometry, material );
			scene.addObject( line );

			var rand = Math.random() * Math.PI * 2;

			particle = new THREE.Particle( material2 );
			particle.position.x = Math.cos( rand ) * amplitude;
			particle.position.z = Math.sin( rand ) * amplitude;
			particle.scale.x = particle.scale.y = 0.5;
			scene.addObject( particle );

			var textMaterial = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( createTextImage( greetings[ j ] ) ), blending: THREE.AdditiveBlending } );
			textMaterial.polygonOffset.y = 35;

			particle = new THREE.Particle( textMaterial );
			particle.position.x = Math.cos( rand ) * amplitude;
			// particle.position.y = 20;
			particle.position.z = Math.sin( rand ) * amplitude;
			particle.scale.x = particle.scale.y = 0.5;
			scene.addObject( particle );

		}

		function createTextImage( string ) {

			var canvas = document.createElement( 'canvas' );
			canvas.width = 150;
			canvas.height = 85;
			canvas.loaded = true;

			var context = canvas.getContext( '2d' );
			context.font = "30px Georgia";
			context.fillStyle = "rgb(0, 255, 255)";
			context.textAlign = "center";
			context.fillText( string, canvas.width / 2, 25 );

			return canvas;
		}

	};

	this.update = function ( k ) {

		camera.position.copy( cameraPath.change );
		camera.position.multiplyScalar( k );
		camera.position.addSelf( cameraPath.start );

		camera.target.position.copy( cameraTargetPath.change );
		camera.target.position.multiplyScalar( k );
		camera.target.position.addSelf( cameraTargetPath.start );

		renderer.render( scene, camera );

	};

};


Part6Effect.prototype = new Effect();
Part6Effect.prototype.constructor = Part6Effect;
