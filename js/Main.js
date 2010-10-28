var audio, sequencer,
keys = [ 0, 6254, 31692, 55112, 74891, 109163, 133196, 165113, 198992 ],
camera, renderer,
container;

var QUALITY = 2;

init();

function init() {

	container = document.createElement( 'div' );

	camera = new THREE.Camera( 60, 800 / 600, 1, 20000 );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( 800, 600 );
	renderer.autoClear = false;
	container.appendChild( renderer.domElement );

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );

	// Timeline

	sequencer = new Sequencer();

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 0, 200 ), new THREE.Vector3( 0, 0, 10000 )  ), keys[ 0 ] - 1, keys[ 1 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3(), new THREE.Vector3() ), keys[ 0 ] - 1, keys[ 1 ] - 1 );
	sequencer.add( new Part1Effect( camera, renderer ), keys[ 0 ], keys[ 1 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 0, 1000 ), new THREE.Vector3( 0, 0, 400 ) ), keys[ 1 ] - 1, keys[ 2 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3(), new THREE.Vector3() ), keys[ 1 ] - 1, keys[ 2 ] - 1 );
	sequencer.add( new Part2Effect( camera, renderer ), keys[ 1 ], keys[ 2 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 200, 200 ), new THREE.Vector3( 0, - 200, 300 ) ), keys[ 2 ] - 1, keys[ 3 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3( 200, 0, 0 ), new THREE.Vector3( - 100, 0, 300 ) ), keys[ 2 ] - 1, keys[ 3 ] - 1 );
	sequencer.add( new Part3Effect( camera, renderer ), keys[ 2 ], keys[ 3 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 0, - 5000 ), new THREE.Vector3( 0, 0, 4000 ) ), keys[ 3 ] - 1, keys[ 4 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3( 0, 0, - 5000 ), new THREE.Vector3( 0, 0,  - 2000 ) ), keys[ 3 ] - 1, keys[ 4 ] - 1 );
	sequencer.add( new Part4Effect( camera, renderer ), keys[ 3 ], keys[ 4 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 1000, 2000 ), new THREE.Vector3( -100, 300, 400 ) ), keys[ 4 ] - 1, keys[ 5 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3( 500,  - 500, 1000 ), new THREE.Vector3( 0, -50, 0 ) ), keys[ 4 ] - 1, keys[ 5 ] - 1 );
	sequencer.add( new Part5Effect( camera, renderer ), keys[ 4 ], keys[ 5 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 500, 0, 500 ), new THREE.Vector3( 0, 200, 500 ) ), keys[ 5 ] - 1, keys[ 6 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3( - 100, - 600, 0 ), new THREE.Vector3( 50, - 100, 0 ) ), keys[ 5 ] - 1, keys[ 6 ] - 1 );
	sequencer.add( new Part6Effect( camera, renderer ), keys[ 5 ], keys[ 6 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 0, 0, 300 ), new THREE.Vector3( 0, 0, 1000 ) ), keys[ 6 ] - 1, keys[ 7 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3(), new THREE.Vector3() ), keys[ 6 ] - 1, keys[ 7 ] - 1 );
	sequencer.add( new Part7Effect( camera, renderer ), keys[ 6 ], keys[ 7 ] );

	sequencer.add( new Vector3TravelEffect( camera.position, new THREE.Vector3( 400, 0, 400 ), new THREE.Vector3( 0, 200, 800 ) ), keys[ 7 ] - 1, keys[ 8 ] - 1 );
	sequencer.add( new Vector3TravelEffect( camera.target.position, new THREE.Vector3( 0, 100, 0 ), new THREE.Vector3( 0, - 100, 0 ) ), keys[ 7 ] - 1, keys[ 8 ] - 1 );
	sequencer.add( new Part8Effect( camera, renderer ), keys[ 7 ], keys[ 8 ] );

	sequencer.add( new Part9Effect( camera, renderer ), keys[ 8 ], keys[ 8 ] + 2000 );

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

			audio.currentTime -= 1;
			break;

		case 39:

			audio.currentTime += 1;
			break;

	}

}

function onWindowResize( event ) {

	var width = window.innerWidth / QUALITY,
	height = window.innerHeight / QUALITY;

	camera.projectionMatrix = THREE.Matrix4.makePerspective( 60, width / height, 1, 20000 );

	var blending = renderer.domElement.getContext( '2d' ).globalCompositeOperation;

	renderer.setSize( width, height );
	renderer.domElement.style.width = window.innerWidth + 'px';
	renderer.domElement.style.height = window.innerHeight + 'px';
	renderer.domElement.getContext( '2d' ).globalCompositeOperation = blending;

}

function loop() {

	sequencer.update( audio.currentTime * 1000 );

}
