var audio, sequencer,
keys = [ 0, 6254, 31692, 55112, 74891, 109163, 133196, 165113, 198992 ],
camera, renderer, container;

init();

function init() {

	container = document.createElement( 'div' );

	camera = new THREE.Camera( 60, null, 1, 20000 );

	renderer = new THREE.CanvasRenderer();
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );

	// Timeline

	sequencer = new Sequencer();

	sequencer.add( new ClearEffect( renderer ), keys[ 0], keys[ 8 ], 0 );

	sequencer.add( new Part1Effect( camera, renderer ), keys[ 0 ], keys[ 1 ], 1 );
	sequencer.add( new Part2Effect( camera, renderer ), keys[ 1 ], keys[ 2 ], 1 );
	sequencer.add( new Part3Effect( camera, renderer ), keys[ 2 ], keys[ 3 ], 1 );
	sequencer.add( new Part4Effect( camera, renderer ), keys[ 3 ], keys[ 4 ], 1 );
	sequencer.add( new Part5Effect( camera, renderer ), keys[ 4 ], keys[ 5 ], 1 );
	sequencer.add( new Part6Effect( camera, renderer ), keys[ 5 ], keys[ 6 ], 1 );
	sequencer.add( new Part7Effect( camera, renderer ), keys[ 6 ], keys[ 7 ], 1 );
	sequencer.add( new Part8Effect( camera, renderer ), keys[ 7 ], keys[ 8 ], 1 );

	sequencer.add( new FadeInEffect( 0x000000, renderer ), keys[ 0 ], keys[ 1 ], 2 );
	sequencer.add( new FadeInEffect( 0x000000, renderer ), keys[ 7 ], keys[ 8 ], 2 );

}

function start( key ) {

	document.body.removeChild( document.getElementById( 'launcher' ) );

	audio = document.getElementById( 'audio' );
	audio.currentTime = keys[ key ] / 1000;
	audio.play();

	document.body.appendChild( container );

	document.addEventListener( 'keydown', onDocumentKeyDown, false );

	setInterval( loop, 1000 / 120 );
}

function onDocumentKeyDown( event ) {

	switch( event.keyCode ) {

		case 32:

			audio.paused ? audio.play() : audio.pause();
			break;

		case 37:

			audio.currentTime --;
			break;

		case 39:

			audio.currentTime ++;
			break;

	}

}

function onWindowResize( event ) {

	var width = window.innerWidth, height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';

}

function loop() {

	sequencer.update( audio.currentTime * 1000 );

}
