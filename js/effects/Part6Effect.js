var Part6Effect = function ( camera, renderer ) {

	Effect.call( this );

	var particle, line, material, material2, scene,
	greetings = ["Ate Bit", "ASD", "CNCD", "DNA", "Evoflash", "Fairlight", "Farbrausch", "Orange", "Ozone", "Quite", "Rgba", "Satori", "Spöntz", "SQNY", "Still", "Tpolm"];

	this.init = function () {

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

		material = new THREE.LineColorMaterial( 0x008080, 1 );
		material2 = loadImage( new THREE.ParticleBitmapMaterial(), 'files/textures/line_planet.png' );

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

			var textMaterial = new THREE.ParticleBitmapMaterial( createTextImage( greetings[ j ] ) );
			textMaterial.offset.y = 35;

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
			canvas.height = 35;

			var context = canvas.getContext( '2d' );
			context.font = "30px Georgia";
			context.fillStyle = "rgb(0, 255, 255)";
			context.textAlign = "center";
			context.fillText( string, canvas.width / 2, 25 );

			return canvas;
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

		renderer.clear();
		renderer.render( scene, camera );

	};

};


Part6Effect.prototype = new Effect();
Part6Effect.prototype.constructor = Part6Effect;
