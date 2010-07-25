var Part9Effect = function ( camera, renderer ) {

	Effect.call( this );

	// Init

	this.show = function () {

		renderer.domElement.getContext( '2d' ).globalCompositeOperation = 'source-over';

	};

	this.update = function ( time ) {

		renderer.clear();

	};

};


Part9Effect.prototype = new Effect();
Part9Effect.prototype.constructor = Part9Effect;
