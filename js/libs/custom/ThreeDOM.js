// ThreeDOM.js r42 - http://github.com/mrdoob/three.js
/**
 * @author mr.doob / http://mrdoob.com/
 */

var THREE = THREE || {};

if ( ! window.Int32Array ) {

	window.Int32Array = Array;
	window.Float32Array = Array;

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Color = function ( hex ) {

	this.setHex( hex );

};

THREE.Color.prototype = {

	copy : function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.hex = color.hex;

	},

	setHex : function ( hex ) {

		this.hex = ( ~~ hex ) & 0xffffff;
		this.updateRGB();

	},

	setRGB : function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		this.updateHex();

	},

	setHSV : function ( h, s, v ) {

		// based on MochiKit implementation by Bob Ippolito
		// h,s,v ranges are < 0.0 - 1.0 >

		var r, g, b, i, f, p, q, t;

		if ( v == 0.0 ) {

			r = g = b = 0;

		} else {

			i = Math.floor( h * 6 );
			f = ( h * 6 ) - i;
			p = v * ( 1 - s );
			q = v * ( 1 - ( s * f ) );
			t = v * ( 1 - ( s * ( 1 - f ) ) );

			switch ( i ) {

				case 1: r = q; g = v; b = p; break;
				case 2: r = p; g = v; b = t; break;
				case 3: r = p; g = q; b = v; break;
				case 4: r = t; g = p; b = v; break;
				case 5: r = v; g = p; b = q; break;
				case 6: // fall through
				case 0: r = v; g = t; b = p; break;

			}

		}

		this.setRGB( r, g, b );

	},

	updateHex : function () {

		this.hex = ~~ ( this.r * 255 ) << 16 ^ ~~ ( this.g * 255 ) << 8 ^ ~~ ( this.b * 255 );

	},

	updateRGB : function () {

		this.r = ( this.hex >> 16 & 255 ) / 255;
		this.g = ( this.hex >> 8 & 255 ) / 255;
		this.b = ( this.hex & 255 ) / 255;

	},

	clone : function () {

		return new THREE.Color( this.hex );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.set(

		x || 0,
		y || 0

	);

};

THREE.Vector2.prototype = {

	set : function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	copy : function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	clone : function () {

		return new THREE.Vector2( this.x, this.y );

	},


	add : function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;

		return this;

	},

	addSelf : function ( v ) {

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	sub : function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;

		return this;

	},

	subSelf : function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	multiplyScalar : function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divideScalar : function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;

		} else {

			this.set( 0, 0 );

		}

		return this;

	},


	negate : function() {

		return this.multiplyScalar( -1 );

	},

	dot : function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq : function () {

		return this.x * this.x + this.y * this.y;

	},

	length : function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize : function () {

		return this.divideScalar( this.length() );

	},
	
	distanceTo : function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared : function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},


	setLength : function ( l ) {

		return this.normalize().multiplyScalar( l );

	},

	// deprecated: same as normalize

	unit : function () {

		return this.normalize();

	},
	
	// danger, works only on numbers which are exactly the same
	// (which may be not what is expected thanks to floating point precision)
	// (should be probably using some tiny epsilon instead of equality)
	
	equals : function( v ) {

		return ( ( v.x == this.x ) && ( v.y == this.y ) );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector3 = function ( x, y, z ) {

	this.set(

		x || 0,
		y || 0,
		z || 0

	);

};


THREE.Vector3.prototype = {

	set : function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	copy : function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	clone : function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	},


	add : function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;

		return this;

	},

	addSelf : function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar : function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub : function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;

		return this;

	},

	subSelf : function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply : function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf : function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.y;

		return this;

	},

	multiplyScalar : function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf : function ( v ) {

		return this.divide( this, v );

	},

	divideScalar : function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.set( 0, 0, 0 );

		}

		return this;

	},


	negate : function() {

		return this.multiplyScalar( -1 );

	},

	dot : function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq : function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length : function () {

		return Math.sqrt( this.lengthSq() );

	},

	lengthManhattan : function () {

		// correct version
		// return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		return this.x + this.y + this.z;

	},

	normalize : function () {

		return this.divideScalar( this.length() );

	},

	setLength : function ( l ) {

		return this.normalize().multiplyScalar( l );

	},


	cross : function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf : function ( v ) {

		return this.set(

			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x

		);

	},


	distanceTo : function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared : function ( v ) {

		return new THREE.Vector3().sub( this, v ).lengthSq();

	},


	setPositionFromMatrix : function ( m ) {

		this.x = m.n14;
		this.y = m.n24;
		this.z = m.n34;

	},

	setRotationFromMatrix : function ( m ) {

		var cosY = Math.cos( this.y );

		this.y = Math.asin( m.n13 );

		if ( Math.abs( cosY ) > 0.00001 ) {

			this.x = Math.atan2( - m.n23 / cosY, m.n33 / cosY );
			this.z = Math.atan2( - m.n12 / cosY, m.n11 / cosY );

		} else {

			this.x = 0;
			this.z = Math.atan2( m.n21, m.n22 );

		}

	},

	isZero : function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	}

};
/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.set(

		x || 0,
		y || 0,
		z || 0,
		w || 1

	);

};

THREE.Vector4.prototype = {

	set : function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy : function ( v ) {

		return this.set(

			v.x,
			v.y,
			v.z,
			v.w || 1.0

		);

	},

	clone : function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	},


	add : function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;
		this.w = v1.w + v2.w;

		return this;

	},

	addSelf : function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	sub : function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;
		this.w = v1.w - v2.w;

		return this;

	},

	subSelf : function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	multiplyScalar : function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;

		return this;

	},

	divideScalar : function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;
			this.w /= s;

		} else {

			this.set( 0, 0, 0, 1 );

		}

		return this;

	},


	negate : function() {

		return this.multiplyScalar( -1 );

	},

	dot : function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq : function () {

		return this.dot( this );

	},

	length : function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize : function () {

		return this.divideScalar( this.length() );

	},

	setLength : function ( l ) {

		return this.normalize().multiplyScalar( l );

	},


	lerpSelf : function ( v, alpha ) {

		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;
		this.w += (v.w - this.w) * alpha;

		return this;

	},

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = origin || new THREE.Vector3();
	this.direction = direction || new THREE.Vector3();

}

THREE.Ray.prototype = {

	intersectScene: function ( scene ) {

		return this.intersectObjects( scene.objects );

	},

	intersectObjects: function ( objects ) {

		var i, l, object,
		intersects = [];

		for ( i = 0, l = objects.length; i < l; i ++ ) {

			intersects = intersects.concat( this.intersectObject( objects[ i ] ) );

		}

		intersects.sort( function ( a, b ) { return a.distance - b.distance; } );

		return intersects;

	},

	intersectObject: function ( object ) {

		if ( object instanceof THREE.Particle ) {

			var distance = distanceFromIntersection( this.origin, this.direction, object );

			if ( ! distance || distance > object.scale.x ) {

				return [];

			}

			return [ {

				distance: distance,
				point: object.position,
				face: null,
				object: object

			} ];

		} else if ( object instanceof THREE.Mesh ) {

			// Checking boundingSphere

			var distance = distanceFromIntersection( this.origin, this.direction, object );

			if ( ! distance || distance > object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) ) ) {

				return [];

			}

			// Checking faces

			var f, fl, face, a, b, c, d, normal,
			dot, scalar,
			origin, direction,
			geometry = object.geometry,
			vertices = geometry.vertices,
			objMatrix,
			intersect, intersects = [],
			intersectPoint;

			for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				face = geometry.faces[ f ];

				origin = this.origin.clone();
				direction = this.direction.clone();

				objMatrix = object.matrixWorld;

				a = objMatrix.multiplyVector3( vertices[ face.a ].position.clone() );
				b = objMatrix.multiplyVector3( vertices[ face.b ].position.clone() );
				c = objMatrix.multiplyVector3( vertices[ face.c ].position.clone() );
				d = face instanceof THREE.Face4 ? objMatrix.multiplyVector3( vertices[ face.d ].position.clone() ) : null;

				normal = object.matrixRotationWorld.multiplyVector3( face.normal.clone() );
				dot = direction.dot( normal );

				if ( object.doubleSided || ( object.flipSided ? dot > 0 : dot < 0 ) ) { // Math.abs( dot ) > 0.0001

					scalar = normal.dot( new THREE.Vector3().sub( a, origin ) ) / dot;
					intersectPoint = origin.addSelf( direction.multiplyScalar( scalar ) );

					if ( face instanceof THREE.Face3 ) {

						if ( pointInFace3( intersectPoint, a, b, c ) ) {

							intersect = {

								distance: this.origin.distanceTo( intersectPoint ),
								point: intersectPoint,
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					} else if ( face instanceof THREE.Face4 ) {

						if ( pointInFace3( intersectPoint, a, b, d ) || pointInFace3( intersectPoint, b, c, d ) ) {

							intersect = {

								distance: this.origin.distanceTo( intersectPoint ),
								point: intersectPoint,
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					}

				}

			}

			return intersects;

		} else {

			return [];

		}

		function distanceFromIntersection( origin, direction, object ) {

			var vector, dot, intersect, distance,
			position = object.matrixWorld.getPosition();

			vector = position.clone().subSelf( origin );
			dot = vector.dot( direction );

			intersect = origin.clone().addSelf( direction.clone().multiplyScalar( dot ) );
			distance = position.distanceTo( intersect );

			// TODO: Check if distance is negative (object behind camera).			
			
			return distance;

		}

		// http://www.blackpawn.com/texts/pointinpoly/default.html

		function pointInFace3( p, a, b, c ) {

			var v0 = c.clone().subSelf( a ), v1 = b.clone().subSelf( a ), v2 = p.clone().subSelf( a ),
			dot00 = v0.dot( v0 ), dot01 = v0.dot( v1 ), dot02 = v0.dot( v2 ), dot11 = v1.dot( v1 ), dot12 = v1.dot( v2 ),

			invDenom = 1 / ( dot00 * dot11 - dot01 * dot01 ),
			u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom,
			v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

			return ( u > 0 ) && ( v > 0 ) && ( u + v < 1 );

		}

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Rectangle = function () {

	var _left, _top, _right, _bottom,
	_width, _height, _isEmpty = true;

	function resize() {

		_width = _right - _left;
		_height = _bottom - _top;

	}

	this.getX = function () {

		return _left;

	};

	this.getY = function () {

		return _top;

	};

	this.getWidth = function () {

		return _width;

	};

	this.getHeight = function () {

		return _height;

	};

	this.getLeft = function() {

		return _left;

	};

	this.getTop = function() {

		return _top;

	};

	this.getRight = function() {

		return _right;

	};

	this.getBottom = function() {

		return _bottom;

	};

	this.set = function ( left, top, right, bottom ) {

		_isEmpty = false;

		_left = left; _top = top;
		_right = right; _bottom = bottom;

		resize();

	};

	this.addPoint = function ( x, y ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = x; _top = y;
			_right = x; _bottom = y;

			resize();

		} else {

			_left = _left < x ? _left : x; // Math.min( _left, x );
			_top = _top < y ? _top : y; // Math.min( _top, y );
			_right = _right > x ? _right : x; // Math.max( _right, x );
			_bottom = _bottom > y ? _bottom : y; // Math.max( _bottom, y );

			resize();
		}

	};

	this.add3Points = function ( x1, y1, x2, y2, x3, y3 ) {

		if (_isEmpty) {

			_isEmpty = false;
			_left = x1 < x2 ? ( x1 < x3 ? x1 : x3 ) : ( x2 < x3 ? x2 : x3 );
			_top = y1 < y2 ? ( y1 < y3 ? y1 : y3 ) : ( y2 < y3 ? y2 : y3 );
			_right = x1 > x2 ? ( x1 > x3 ? x1 : x3 ) : ( x2 > x3 ? x2 : x3 );
			_bottom = y1 > y2 ? ( y1 > y3 ? y1 : y3 ) : ( y2 > y3 ? y2 : y3 );

			resize();

		} else {

			_left = x1 < x2 ? ( x1 < x3 ? ( x1 < _left ? x1 : _left ) : ( x3 < _left ? x3 : _left ) ) : ( x2 < x3 ? ( x2 < _left ? x2 : _left ) : ( x3 < _left ? x3 : _left ) );
			_top = y1 < y2 ? ( y1 < y3 ? ( y1 < _top ? y1 : _top ) : ( y3 < _top ? y3 : _top ) ) : ( y2 < y3 ? ( y2 < _top ? y2 : _top ) : ( y3 < _top ? y3 : _top ) );
			_right = x1 > x2 ? ( x1 > x3 ? ( x1 > _right ? x1 : _right ) : ( x3 > _right ? x3 : _right ) ) : ( x2 > x3 ? ( x2 > _right ? x2 : _right ) : ( x3 > _right ? x3 : _right ) );
			_bottom = y1 > y2 ? ( y1 > y3 ? ( y1 > _bottom ? y1 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) ) : ( y2 > y3 ? ( y2 > _bottom ? y2 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) );

			resize();

		};

	};

	this.addRectangle = function ( r ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = r.getLeft(); _top = r.getTop();
			_right = r.getRight(); _bottom = r.getBottom();

			resize();

		} else {

			_left = _left < r.getLeft() ? _left : r.getLeft(); // Math.min(_left, r.getLeft() );
			_top = _top < r.getTop() ? _top : r.getTop(); // Math.min(_top, r.getTop() );
			_right = _right > r.getRight() ? _right : r.getRight(); // Math.max(_right, r.getRight() );
			_bottom = _bottom > r.getBottom() ? _bottom : r.getBottom(); // Math.max(_bottom, r.getBottom() );

			resize();

		}

	};

	this.inflate = function ( v ) {

		_left -= v; _top -= v;
		_right += v; _bottom += v;

		resize();

	};

	this.minSelf = function ( r ) {

		_left = _left > r.getLeft() ? _left : r.getLeft(); // Math.max( _left, r.getLeft() );
		_top = _top > r.getTop() ? _top : r.getTop(); // Math.max( _top, r.getTop() );
		_right = _right < r.getRight() ? _right : r.getRight(); // Math.min( _right, r.getRight() );
		_bottom = _bottom < r.getBottom() ? _bottom : r.getBottom(); // Math.min( _bottom, r.getBottom() );

		resize();

	};

	/*
	this.contains = function ( x, y ) {

		return x > _left && x < _right && y > _top && y < _bottom;

	};
	*/

	this.instersects = function ( r ) {

		// return this.contains( r.getLeft(), r.getTop() ) || this.contains( r.getRight(), r.getTop() ) || this.contains( r.getLeft(), r.getBottom() ) || this.contains( r.getRight(), r.getBottom() );

		return Math.min( _right, r.getRight() ) - Math.max( _left, r.getLeft() ) >= 0 &&
		        Math.min( _bottom, r.getBottom() ) - Math.max( _top, r.getTop() ) >= 0;

	};

	this.empty = function () {

		_isEmpty = true;

		_left = 0; _top = 0;
		_right = 0; _bottom = 0;

		resize();

	};

	this.isEmpty = function () {

		return _isEmpty;

	};

};
THREE.Matrix3 = function () {

	this.m = [];

};

THREE.Matrix3.prototype = {

	transpose : function () {

		var tmp, m = this.m;

		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;

	},

	transposeIntoArray : function ( r ) {

		var m = this.m;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Matrix4 = function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

	this.set(

		n11 || 1, n12 || 0, n13 || 0, n14 || 0,
		n21 || 0, n22 || 1, n23 || 0, n24 || 0,
		n31 || 0, n32 || 0, n33 || 1, n34 || 0,
		n41 || 0, n42 || 0, n43 || 0, n44 || 1

	);

	this.flat = new Array( 16 );
	this.m33 = new THREE.Matrix3();

};

THREE.Matrix4.prototype = {

	set : function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		this.n11 = n11; this.n12 = n12; this.n13 = n13; this.n14 = n14;
		this.n21 = n21; this.n22 = n22; this.n23 = n23; this.n24 = n24;
		this.n31 = n31; this.n32 = n32; this.n33 = n33; this.n34 = n34;
		this.n41 = n41; this.n42 = n42; this.n43 = n43; this.n44 = n44;

		return this;

	},

	identity : function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy : function ( m ) {

		this.set(

			m.n11, m.n12, m.n13, m.n14,
			m.n21, m.n22, m.n23, m.n24,
			m.n31, m.n32, m.n33, m.n34,
			m.n41, m.n42, m.n43, m.n44

		);

		return this;

	},

	lookAt : function ( eye, center, up ) {

		var x = THREE.Matrix4.__v1, y = THREE.Matrix4.__v2, z = THREE.Matrix4.__v3;

		z.sub( eye, center ).normalize();

		if ( z.length() === 0 ) {

			z.z = 1;

		}

		x.cross( up, z ).normalize();

		if ( x.length() === 0 ) {

			z.x += 0.0001;
			x.cross( up, z ).normalize();

		}

		y.cross( z, x ).normalize();


		this.n11 = x.x; this.n12 = y.x; this.n13 = z.x;
		this.n21 = x.y; this.n22 = y.y; this.n23 = z.y;
		this.n31 = x.z; this.n32 = y.z; this.n33 = z.z;

		return this;

	},

	multiplyVector3 : function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z,
		d = 1 / ( this.n41 * vx + this.n42 * vy + this.n43 * vz + this.n44 );

		v.x = ( this.n11 * vx + this.n12 * vy + this.n13 * vz + this.n14 ) * d;
		v.y = ( this.n21 * vx + this.n22 * vy + this.n23 * vz + this.n24 ) * d;
		v.z = ( this.n31 * vx + this.n32 * vy + this.n33 * vz + this.n34 ) * d;

		return v;

	},

	multiplyVector4 : function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z, vw = v.w;

		v.x = this.n11 * vx + this.n12 * vy + this.n13 * vz + this.n14 * vw;
		v.y = this.n21 * vx + this.n22 * vy + this.n23 * vz + this.n24 * vw;
		v.z = this.n31 * vx + this.n32 * vy + this.n33 * vz + this.n34 * vw;
		v.w = this.n41 * vx + this.n42 * vy + this.n43 * vz + this.n44 * vw;

		return v;

	},

	rotateAxis : function ( v ) {

		var vx = v.x, vy = v.y, vz = v.z;

		v.x = vx * this.n11 + vy * this.n12 + vz * this.n13;
		v.y = vx * this.n21 + vy * this.n22 + vz * this.n23;
		v.z = vx * this.n31 + vy * this.n32 + vz * this.n33;

		v.normalize();

		return v;

	},

	crossVector : function ( a ) {

		var v = new THREE.Vector4();

		v.x = this.n11 * a.x + this.n12 * a.y + this.n13 * a.z + this.n14 * a.w;
		v.y = this.n21 * a.x + this.n22 * a.y + this.n23 * a.z + this.n24 * a.w;
		v.z = this.n31 * a.x + this.n32 * a.y + this.n33 * a.z + this.n34 * a.w;

		v.w = ( a.w ) ? this.n41 * a.x + this.n42 * a.y + this.n43 * a.z + this.n44 * a.w : 1;

		return v;

	},

	multiply : function ( a, b ) {

		var a11 = a.n11, a12 = a.n12, a13 = a.n13, a14 = a.n14,
		a21 = a.n21, a22 = a.n22, a23 = a.n23, a24 = a.n24,
		a31 = a.n31, a32 = a.n32, a33 = a.n33, a34 = a.n34,
		a41 = a.n41, a42 = a.n42, a43 = a.n43, a44 = a.n44,

		b11 = b.n11, b12 = b.n12, b13 = b.n13, b14 = b.n14,
		b21 = b.n21, b22 = b.n22, b23 = b.n23, b24 = b.n24,
		b31 = b.n31, b32 = b.n32, b33 = b.n33, b34 = b.n34,
		b41 = b.n41, b42 = b.n42, b43 = b.n43, b44 = b.n44;

		this.n11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		this.n12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		this.n13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		this.n14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		this.n21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		this.n22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		this.n23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		this.n24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		this.n31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		this.n32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		this.n33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		this.n34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		this.n41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		this.n42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		this.n43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		this.n44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray : function ( a, b, r ) {

		this.multiply( a, b );

		r[ 0 ] = this.n11; r[ 1 ] = this.n21; r[ 2 ] = this.n31; r[ 3 ] = this.n41;
		r[ 4 ] = this.n12; r[ 5 ] = this.n22; r[ 6 ] = this.n32; r[ 7 ] = this.n42;
		r[ 8 ]  = this.n13; r[ 9 ]  = this.n23; r[ 10 ] = this.n33; r[ 11 ] = this.n43;
		r[ 12 ] = this.n14; r[ 13 ] = this.n24; r[ 14 ] = this.n34; r[ 15 ] = this.n44;

		return this;

	},

	multiplySelf : function ( m ) {

		this.multiply( this, m );

		return this;

	},

	multiplyScalar : function ( s ) {

		this.n11 *= s; this.n12 *= s; this.n13 *= s; this.n14 *= s;
		this.n21 *= s; this.n22 *= s; this.n23 *= s; this.n24 *= s;
		this.n31 *= s; this.n32 *= s; this.n33 *= s; this.n34 *= s;
		this.n41 *= s; this.n42 *= s; this.n43 *= s; this.n44 *= s;

		return this;

	},

	determinant : function () {

		var n11 = this.n11, n12 = this.n12, n13 = this.n13, n14 = this.n14,
		n21 = this.n21, n22 = this.n22, n23 = this.n23, n24 = this.n24,
		n31 = this.n31, n32 = this.n32, n33 = this.n33, n34 = this.n34,
		n41 = this.n41, n42 = this.n42, n43 = this.n43, n44 = this.n44;

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
		return (
			n14 * n23 * n32 * n41-
			n13 * n24 * n32 * n41-
			n14 * n22 * n33 * n41+
			n12 * n24 * n33 * n41+

			n13 * n22 * n34 * n41-
			n12 * n23 * n34 * n41-
			n14 * n23 * n31 * n42+
			n13 * n24 * n31 * n42+

			n14 * n21 * n33 * n42-
			n11 * n24 * n33 * n42-
			n13 * n21 * n34 * n42+
			n11 * n23 * n34 * n42+

			n14 * n22 * n31 * n43-
			n12 * n24 * n31 * n43-
			n14 * n21 * n32 * n43+
			n11 * n24 * n32 * n43+

			n12 * n21 * n34 * n43-
			n11 * n22 * n34 * n43-
			n13 * n22 * n31 * n44+
			n12 * n23 * n31 * n44+

			n13 * n21 * n32 * n44-
			n11 * n23 * n32 * n44-
			n12 * n21 * n33 * n44+
			n11 * n22 * n33 * n44
		);

	},

	transpose : function () {

		var tmp;

		tmp = this.n21; this.n21 = this.n12; this.n12 = tmp;
		tmp = this.n31; this.n31 = this.n13; this.n13 = tmp;
		tmp = this.n32; this.n32 = this.n23; this.n23 = tmp;

		tmp = this.n41; this.n41 = this.n14; this.n14 = tmp;
		tmp = this.n42; this.n42 = this.n24; this.n24 = tmp;
		tmp = this.n43; this.n43 = this.n34; this.n43 = tmp;

		return this;

	},

	clone : function () {

		var m = new THREE.Matrix4();

		m.n11 = this.n11; m.n12 = this.n12; m.n13 = this.n13; m.n14 = this.n14;
		m.n21 = this.n21; m.n22 = this.n22; m.n23 = this.n23; m.n24 = this.n24;
		m.n31 = this.n31; m.n32 = this.n32; m.n33 = this.n33; m.n34 = this.n34;
		m.n41 = this.n41; m.n42 = this.n42; m.n43 = this.n43; m.n44 = this.n44;

		return m;

	},

	flatten : function () {

		this.flat[ 0 ] = this.n11; this.flat[ 1 ] = this.n21; this.flat[ 2 ] = this.n31; this.flat[ 3 ] = this.n41;
		this.flat[ 4 ] = this.n12; this.flat[ 5 ] = this.n22; this.flat[ 6 ] = this.n32; this.flat[ 7 ] = this.n42;
		this.flat[ 8 ]  = this.n13; this.flat[ 9 ]  = this.n23; this.flat[ 10 ] = this.n33; this.flat[ 11 ] = this.n43;
		this.flat[ 12 ] = this.n14; this.flat[ 13 ] = this.n24; this.flat[ 14 ] = this.n34; this.flat[ 15 ] = this.n44;

		return this.flat;

	},

	flattenToArray : function ( flat ) {

		flat[ 0 ] = this.n11; flat[ 1 ] = this.n21; flat[ 2 ] = this.n31; flat[ 3 ] = this.n41;
		flat[ 4 ] = this.n12; flat[ 5 ] = this.n22; flat[ 6 ] = this.n32; flat[ 7 ] = this.n42;
		flat[ 8 ]  = this.n13; flat[ 9 ]  = this.n23; flat[ 10 ] = this.n33; flat[ 11 ] = this.n43;
		flat[ 12 ] = this.n14; flat[ 13 ] = this.n24; flat[ 14 ] = this.n34; flat[ 15 ] = this.n44;

		return flat;

	},

	flattenToArrayOffset : function( flat, offset ) {

		flat[ offset ] = this.n11;
		flat[ offset + 1 ] = this.n21;
		flat[ offset + 2 ] = this.n31;
		flat[ offset + 3 ] = this.n41;

		flat[ offset + 4 ] = this.n12;
		flat[ offset + 5 ] = this.n22;
		flat[ offset + 6 ] = this.n32;
		flat[ offset + 7 ] = this.n42;

		flat[ offset + 8 ]  = this.n13;
		flat[ offset + 9 ]  = this.n23;
		flat[ offset + 10 ] = this.n33;
		flat[ offset + 11 ] = this.n43;

		flat[ offset + 12 ] = this.n14;
		flat[ offset + 13 ] = this.n24;
		flat[ offset + 14 ] = this.n34;
		flat[ offset + 15 ] = this.n44;

		return flat;

	},

	setTranslation : function( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	setScale : function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	setRotationX : function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	setRotationY : function( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			-s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	setRotationZ : function( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, -s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	setRotationAxis : function( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle ),
		s = Math.sin( angle ),
		t = 1 - c,
		x = axis.x, y = axis.y, z = axis.z,
		tx = t * x, ty = t * y;

		this.set(

		 	tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	setPosition : function( v ) {

		this.n14 = v.x;
		this.n24 = v.y;
		this.n34 = v.z;

		return this;

	},

	getPosition: function() {

		if ( ! this.position ) {

			this.position = new THREE.Vector3();

		}

		this.position.set( this.n14, this.n24, this.n34 );

		return this.position;

	},

	getColumnX: function() {

		if ( ! this.columnX ) {

			this.columnX = new THREE.Vector3();

		}

		this.columnX.set( this.n11, this.n21, this.n31 );

		return this.columnX;
	},

	getColumnY: function() {

		if ( ! this.columnY ) {

			this.columnY = new THREE.Vector3();

		}

		this.columnY.set( this.n12, this.n22, this.n32 );

		return this.columnY;

	},

	getColumnZ: function() {

		if ( ! this.columnZ ) {

			this.columnZ = new THREE.Vector3();

		}

		this.columnZ.set( this.n13, this.n23, this.n33 );

		return this.columnZ;

	},

	setRotationFromEuler: function( v, order ) {

		var x = v.x, y = v.y, z = v.z,
		a = Math.cos( x ), b = Math.sin( x ),
		c = Math.cos( y ), d = Math.sin( y ),
		e = Math.cos( z ), f = Math.sin( z );

		switch ( order ) {
			case 'YXZ':
				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				this.n11 = ce + df * b;
				this.n12 = de * b - cf;
				this.n13 = a * d;

				this.n21 = a * f;
				this.n22 = a * e;
				this.n23 = - b;

				this.n31 = cf * b - de;
				this.n32 = df + ce * b;
				this.n33 = a * c;
				break;

			case 'ZXY':
				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				this.n11 = ce - df * b;
				this.n12 = - a * f;
				this.n13 = de + cf * b;

				this.n21 = cf + de * b;
				this.n22 = a * e;
				this.n23 = df - ce * b;

				this.n31 = - a * d;
				this.n32 = b;
				this.n33 = a * c;
				break;

			case 'ZYX':
				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				this.n11 = c * e;
				this.n12 = be * d - af;
				this.n13 = ae * d + bf;

				this.n21 = c * f;
				this.n22 = bf * d + ae;
				this.n23 = af * d - be;

				this.n31 = - d;
				this.n32 = b * c;
				this.n33 = a * c;
				break;

			case 'YZX':
				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				this.n11 = c * e;
				this.n12 = bd - ac * f;
				this.n13 = bc * f + ad;

				this.n21 = f;
				this.n22 = a * e;
				this.n23 = - b * e;

				this.n31 = - d * e;
				this.n32 = ad * f + bc;
				this.n33 = ac - bd * f;
				break;

			case 'XZY':
				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				this.n11 = c * e;
				this.n12 = - f;
				this.n13 = d * e;

				this.n21 = ac * f + bd;
				this.n22 = a * e;
				this.n23 = ad * f - bc;

				this.n31 = bc * f - ad;
				this.n32 = b * e;
				this.n33 = bd * f + ac;
				break;

			default: // 'XYZ'
				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				this.n11 = c * e;
				this.n12 = - c * f;
				this.n13 = d;

				this.n21 = af + be * d;
				this.n22 = ae - bf * d;
				this.n23 = - b * c;

				this.n31 = bf - ae * d;
				this.n32 = be + af * d;
				this.n33 = a * c;
				break;
		}

		return this;

	},


	setRotationFromQuaternion: function( q ) {

		var x = q.x, y = q.y, z = q.z, w = q.w,
		x2 = x + x, y2 = y + y, z2 = z + z,
		xx = x * x2, xy = x * y2, xz = x * z2,
		yy = y * y2, yz = y * z2, zz = z * z2,
		wx = w * x2, wy = w * y2, wz = w * z2;

		this.n11 = 1 - ( yy + zz );
		this.n12 = xy - wz;
		this.n13 = xz + wy;

		this.n21 = xy + wz;
		this.n22 = 1 - ( xx + zz );
		this.n23 = yz - wx;

		this.n31 = xz - wy;
		this.n32 = yz + wx;
		this.n33 = 1 - ( xx + yy );

		return this;

	},

	scale: function ( v ) {

		var x = v.x, y = v.y, z = v.z;

		this.n11 *= x; this.n12 *= y; this.n13 *= z;
		this.n21 *= x; this.n22 *= y; this.n23 *= z;
		this.n31 *= x; this.n32 *= y; this.n33 *= z;
		this.n41 *= x; this.n42 *= y; this.n43 *= z;

		return this;

	},

	extractPosition: function ( m ) {

		this.n14 = m.n14;
		this.n24 = m.n24;
		this.n34 = m.n34;

	},

	extractRotation: function ( m, s ) {

		var invScaleX = 1 / s.x, invScaleY = 1 / s.y, invScaleZ = 1 / s.z;

		this.n11 = m.n11 * invScaleX;
		this.n21 = m.n21 * invScaleX;
		this.n31 = m.n31 * invScaleX;

		this.n12 = m.n12 * invScaleY;
		this.n22 = m.n22 * invScaleY;
		this.n32 = m.n32 * invScaleY;

		this.n13 = m.n13 * invScaleZ;
		this.n23 = m.n23 * invScaleZ;
		this.n33 = m.n33 * invScaleZ;

	}

};

THREE.Matrix4.makeInvert = function ( m1, m2 ) {

	// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm

	var n11 = m1.n11, n12 = m1.n12, n13 = m1.n13, n14 = m1.n14,
	n21 = m1.n21, n22 = m1.n22, n23 = m1.n23, n24 = m1.n24,
	n31 = m1.n31, n32 = m1.n32, n33 = m1.n33, n34 = m1.n34,
	n41 = m1.n41, n42 = m1.n42, n43 = m1.n43, n44 = m1.n44;

	if ( m2 === undefined ) m2 = new THREE.Matrix4();

	m2.n11 = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
	m2.n12 = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
	m2.n13 = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
	m2.n14 = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
	m2.n21 = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
	m2.n22 = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
	m2.n23 = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
	m2.n24 = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
	m2.n31 = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
	m2.n32 = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
	m2.n33 = n13*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
	m2.n34 = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
	m2.n41 = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
	m2.n42 = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
	m2.n43 = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
	m2.n44 = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;
	m2.multiplyScalar( 1 / m1.determinant() );

	return m2;

};

THREE.Matrix4.makeInvert3x3 = function ( m1 ) {

	// input:  THREE.Matrix4, output: THREE.Matrix3
	// ( based on http://code.google.com/p/webgl-mjs/ )

	var m33 = m1.m33, m33m = m33.m,
	a11 =   m1.n33 * m1.n22 - m1.n32 * m1.n23,
	a21 = - m1.n33 * m1.n21 + m1.n31 * m1.n23,
	a31 =   m1.n32 * m1.n21 - m1.n31 * m1.n22,
	a12 = - m1.n33 * m1.n12 + m1.n32 * m1.n13,
	a22 =   m1.n33 * m1.n11 - m1.n31 * m1.n13,
	a32 = - m1.n32 * m1.n11 + m1.n31 * m1.n12,
	a13 =   m1.n23 * m1.n12 - m1.n22 * m1.n13,
	a23 = - m1.n23 * m1.n11 + m1.n21 * m1.n13,
	a33 =   m1.n22 * m1.n11 - m1.n21 * m1.n12,

	det = m1.n11 * a11 + m1.n21 * a12 + m1.n31 * a13,

	idet;

	// no inverse
	if ( det == 0 ) {

		console.error( 'THREE.Matrix4.makeInvert3x3: Matrix not invertible.' );

	}

	idet = 1.0 / det;

	m33m[ 0 ] = idet * a11; m33m[ 1 ] = idet * a21; m33m[ 2 ] = idet * a31;
	m33m[ 3 ] = idet * a12; m33m[ 4 ] = idet * a22; m33m[ 5 ] = idet * a32;
	m33m[ 6 ] = idet * a13; m33m[ 7 ] = idet * a23; m33m[ 8 ] = idet * a33;

	return m33;

}

THREE.Matrix4.makeFrustum = function ( left, right, bottom, top, near, far ) {

	var m, x, y, a, b, c, d;

	m = new THREE.Matrix4();
	x = 2 * near / ( right - left );
	y = 2 * near / ( top - bottom );
	a = ( right + left ) / ( right - left );
	b = ( top + bottom ) / ( top - bottom );
	c = - ( far + near ) / ( far - near );
	d = - 2 * far * near / ( far - near );

	m.n11 = x;  m.n12 = 0;  m.n13 = a;   m.n14 = 0;
	m.n21 = 0;  m.n22 = y;  m.n23 = b;   m.n24 = 0;
	m.n31 = 0;  m.n32 = 0;  m.n33 = c;   m.n34 = d;
	m.n41 = 0;  m.n42 = 0;  m.n43 = - 1; m.n44 = 0;

	return m;

};

THREE.Matrix4.makePerspective = function ( fov, aspect, near, far ) {

	var ymax, ymin, xmin, xmax;

	ymax = near * Math.tan( fov * Math.PI / 360 );
	ymin = - ymax;
	xmin = ymin * aspect;
	xmax = ymax * aspect;

	return THREE.Matrix4.makeFrustum( xmin, xmax, ymin, ymax, near, far );

};

THREE.Matrix4.makeOrtho = function ( left, right, top, bottom, near, far ) {

	var m, x, y, z, w, h, p;

	m = new THREE.Matrix4();
	w = right - left;
	h = top - bottom;
	p = far - near;
	x = ( right + left ) / w;
	y = ( top + bottom ) / h;
	z = ( far + near ) / p;

	m.n11 = 2 / w; m.n12 = 0;     m.n13 = 0;      m.n14 = -x;
	m.n21 = 0;     m.n22 = 2 / h; m.n23 = 0;      m.n24 = -y;
	m.n31 = 0;     m.n32 = 0;     m.n33 = -2 / p; m.n34 = -z;
	m.n41 = 0;     m.n42 = 0;     m.n43 = 0;      m.n44 = 1;

	return m;

};

THREE.Matrix4.__v1 = new THREE.Vector3();
THREE.Matrix4.__v2 = new THREE.Vector3();
THREE.Matrix4.__v3 = new THREE.Vector3();
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Object3D = function() {

	this.parent = undefined;
	this.children = [];

	this.up = new THREE.Vector3( 0, 1, 0 );

	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.eulerOrder = 'XYZ';
	this.scale = new THREE.Vector3( 1, 1, 1 );

	this.dynamic = false; // when true it retains arrays so they can be updated with __dirty*
	
	this.doubleSided = false;
	this.flipSided = false;

	this.renderDepth = null;

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();
	this.matrixRotationWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = true;

	this.quaternion = new THREE.Quaternion();
	this.useQuaternion = false;

	this.boundRadius = 0.0;
	this.boundRadiusScale = 1.0;

	this.visible = true;

	this._vector = new THREE.Vector3();

	this.name = "";

};


THREE.Object3D.prototype = {

	translate : function ( distance, axis ) {

		this.matrix.rotateAxis( axis );
		this.position.addSelf( axis.multiplyScalar( distance ) );

	},

	translateX : function ( distance ) {

		this.translate( distance, this._vector.set( 1, 0, 0 ) );

	},

	translateY : function ( distance ) {

		this.translate( distance, this._vector.set( 0, 1, 0 ) );

	},

	translateZ : function ( distance ) {

		this.translate( distance, this._vector.set( 0, 0, 1 ) );

	},

	lookAt : function ( vector ) {

		// TODO: Add hierarchy support.

		this.matrix.lookAt( vector, this.position, this.up );

		if ( this.rotationAutoUpdate ) {

			this.rotation.setRotationFromMatrix( this.matrix );

		}

	},

	addChild: function ( child ) {

		if ( this.children.indexOf( child ) === - 1 ) {

			if( child.parent !== undefined ) {

				child.parent.removeChild( child );

			}

			child.parent = this;
			this.children.push( child );

			// add to scene

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene )  {

				scene.addChildRecurse( child );

			}

		}

	},

	removeChild: function ( child ) {

		var childIndex = this.children.indexOf( child );

		if ( childIndex !== - 1 ) {

			child.parent = undefined;
			this.children.splice( childIndex, 1 );

		}

	},

	getChildByName: function ( name, doRecurse ) {

		var c, cl, child, recurseResult;

		for ( c = 0, cl = this.children.length; c < cl; c++ ) {

			child = this.children[ c ];

			if ( child.name === name ) {

				return child;

			}

			if ( doRecurse ) {

				recurseResult = child.getChildByName( name, doRecurse );

				if ( recurseResult !== undefined ) {

					return recurseResult;

				}

			}

		}

		return undefined;

	},

	updateMatrix: function () {

		this.matrix.setPosition( this.position );

		if ( this.useQuaternion )  {

			this.matrix.setRotationFromQuaternion( this.quaternion );

		} else {

			this.matrix.setRotationFromEuler( this.rotation, this.eulerOrder );

		}

		if ( this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {

			this.matrix.scale( this.scale );
			this.boundRadiusScale = Math.max( this.scale.x, Math.max( this.scale.y, this.scale.z ) );

		}

		this.matrixWorldNeedsUpdate = true;

	},

	update: function ( parentMatrixWorld, forceUpdate, camera ) {

		this.matrixAutoUpdate && this.updateMatrix();

		// update matrixWorld

		if ( this.matrixWorldNeedsUpdate || forceUpdate ) {

			if ( parentMatrixWorld ) {

				this.matrixWorld.multiply( parentMatrixWorld, this.matrix );

			} else {

				this.matrixWorld.copy( this.matrix );

			}

			this.matrixRotationWorld.extractRotation( this.matrixWorld, this.scale );

			this.matrixWorldNeedsUpdate = false;

			forceUpdate = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].update( this.matrixWorld, forceUpdate, camera );

		}

	}

};
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Quaternion = function( x, y, z, w ) {

	this.set(

		x || 0,
		y || 0,
		z || 0,
		w !== undefined ? w : 1

	);

};

THREE.Quaternion.prototype = {

	set : function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy : function ( q ) {

		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;

		return this;

	},

	setFromEuler : function ( vec3 ) {

		var c = 0.5 * Math.PI / 360, // 0.5 is an optimization
		x = vec3.x * c,
		y = vec3.y * c,
		z = vec3.z * c,

		c1 = Math.cos( y  ),
		s1 = Math.sin( y  ),
		c2 = Math.cos( -z ),
		s2 = Math.sin( -z ),
		c3 = Math.cos( x  ),
		s3 = Math.sin( x  ),

		c1c2 = c1 * c2,
		s1s2 = s1 * s2;

		this.w = c1c2 * c3  - s1s2 * s3;
	  	this.x = c1c2 * s3  + s1s2 * c3;
		this.y = s1 * c2 * c3 + c1 * s2 * s3;
		this.z = c1 * s2 * c3 - s1 * c2 * s3;

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		// axis have to be normalized

		var halfAngle = angle / 2,
			s = Math.sin( halfAngle );

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos( halfAngle );

		return this;

	},
	
	calculateW  : function () {

		this.w = - Math.sqrt( Math.abs( 1.0 - this.x * this.x - this.y * this.y - this.z * this.z ) );

		return this;

	},

	inverse : function () {

		this.x *= -1;
		this.y *= -1;
		this.z *= -1;

		return this;

	},

	length : function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	normalize : function () {

		var l = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		if ( l == 0 ) {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 0;

		} else {

			l = 1 / l;

			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;

		}

		return this;

	},

	multiplySelf : function ( quat2 ) {

		var qax = this.x,  qay = this.y,  qaz = this.z,  qaw = this.w,
		qbx = quat2.x, qby = quat2.y, qbz = quat2.z, qbw = quat2.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	},

	multiply: function ( q1, q2 ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		this.x =  q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
		this.y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
		this.z =  q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
		this.w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
		
		return this;

	},

	multiplyVector3 : function ( vec, dest ) {

		if( !dest ) { dest = vec; }

		var x    = vec.x,  y  = vec.y,  z  = vec.z,
			qx   = this.x, qy = this.y, qz = this.z, qw = this.w;

		// calculate quat * vec

		var ix =  qw * x + qy * z - qz * y,
			iy =  qw * y + qz * x - qx * z,
			iz =  qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return dest;

	}

}

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

	if ( Math.abs( cosHalfTheta ) >= 1.0 ) {

		qm.w = qa.w; qm.x = qa.x; qm.y = qa.y; qm.z = qa.z;
		return qm;

	}

	var halfTheta = Math.acos( cosHalfTheta ),
	sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

	if ( Math.abs( sinHalfTheta ) < 0.001 ) { 

		qm.w = 0.5 * ( qa.w + qb.w );
		qm.x = 0.5 * ( qa.x + qb.x );
		qm.y = 0.5 * ( qa.y + qb.y );
		qm.z = 0.5 * ( qa.z + qb.z );

		return qm;

	}

	var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
	ratioB = Math.sin( t * halfTheta ) / sinHalfTheta; 

	qm.w = ( qa.w * ratioA + qb.w * ratioB );
	qm.x = ( qa.x * ratioA + qb.x * ratioB );
	qm.y = ( qa.y * ratioA + qb.y * ratioB );
	qm.z = ( qa.z * ratioA + qb.z * ratioB );

	return qm;

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Vertex = function ( position ) {

	this.position = position || new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materials ) {

	this.a = a; 
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materials = materials instanceof Array ? materials : [ materials ];

	this.centroid = new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materials ) {

	this.a = a; 
	this.b = b;
	this.c = c;
	this.d = d;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materials = materials instanceof Array ? materials : [ materials ];

	this.centroid = new THREE.Vector3();

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.UV = function ( u, v ) {

	this.set(

		u || 0,
		v || 0

	);

};

THREE.UV.prototype = {

	set : function ( u, v ) {

		this.u = u;
		this.v = v;

		return this;

	},

	copy : function ( uv ) {

		this.set(

			uv.u,
			uv.v

		);

		return this;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author greggman / http://games.greggman.com/
 */

THREE.Camera = function ( fov, aspect, near, far, target ) {

	THREE.Object3D.call( this );

	this.fov = fov || 50;
	this.aspect = aspect || 1;
	this.near = near || 0.1;
	this.far = far || 2000;

	this.target = target || new THREE.Object3D();
	this.useTarget = true;

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix = null;

	this.updateProjectionMatrix();

};

THREE.Camera.prototype = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.supr = THREE.Object3D.prototype;


THREE.Camera.prototype.translate = function ( distance, axis ) {

	this.matrix.rotateAxis( axis );

	axis.multiplyScalar( distance )

	this.position.addSelf( axis );
	this.target.position.addSelf( axis );

};


THREE.Camera.prototype.updateProjectionMatrix = function () {

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( this.fov * Math.PI / 360 ) * this.near;
		var bottom = -top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix = THREE.Matrix4.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far );

	} else {

		this.projectionMatrix = THREE.Matrix4.makePerspective( this.fov, this.aspect, this.near, this.far );

	}

};

/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for monitor each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.Camera.prototype.setViewOffset = function( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};

THREE.Camera.prototype.update = function ( parentMatrixWorld, forceUpdate, camera ) {

	if ( this.useTarget ) {

		// local

		this.matrix.lookAt( this.position, this.target.position, this.up );
		this.matrix.setPosition( this.position );


		// global

		if( parentMatrixWorld ) {

			this.matrixWorld.multiply( parentMatrixWorld, this.matrix );

		} else {

			this.matrixWorld.copy( this.matrix );

		}

		THREE.Matrix4.makeInvert( this.matrixWorld, this.matrixWorldInverse );

		forceUpdate = true;

	} else {

		this.matrixAutoUpdate && this.updateMatrix();

		if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

			if ( parentMatrixWorld ) {

				this.matrixWorld.multiply( parentMatrixWorld, this.matrix );

			} else {

				this.matrixWorld.copy( this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;
			forceUpdate = true;

			THREE.Matrix4.makeInvert( this.matrixWorld, this.matrixWorldInverse );

		}

	}

	// update children

	for ( var i = 0; i < this.children.length; i ++ ) {

		this.children[ i ].update( this.matrixWorld, forceUpdate, camera );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.ParticleDOMMaterial = function ( domElement ) {

	THREE.Material.call( this );

	this.domElement = domElement;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Particle = function ( materials ) {

	THREE.Object3D.call( this );

	this.materials = materials instanceof Array ? materials : [ materials ];

};

THREE.Particle.prototype = new THREE.Object3D();
THREE.Particle.prototype.constructor = THREE.Particle;
/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Bone = function( belongsToSkin ) {

	THREE.Object3D.call( this );

	this.skin = belongsToSkin;
	this.skinMatrix = new THREE.Matrix4();
	this.hasNoneBoneChildren = false;

};

THREE.Bone.prototype = new THREE.Object3D();
THREE.Bone.prototype.constructor = THREE.Bone;
THREE.Bone.prototype.supr = THREE.Object3D.prototype;


/*
 * Update
 */

THREE.Bone.prototype.update = function( parentSkinMatrix, forceUpdate, camera ) {

	// update local

	if ( this.matrixAutoUpdate ) {

		forceUpdate |= this.updateMatrix();

	}

	// update skin matrix

	if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

		if( parentSkinMatrix ) {

			this.skinMatrix.multiply( parentSkinMatrix, this.matrix );

		} else {

			this.skinMatrix.copy( this.matrix );

		}

		this.matrixWorldNeedsUpdate = false;
		forceUpdate = true;

	}

	// update children

	var child, i, l = this.children.length;

	if ( this.hasNoneBoneChildren ) {

		this.matrixWorld.multiply( this.skin.matrixWorld, this.skinMatrix );


		for ( i = 0; i < l; i++ ) {

			child = this.children[ i ];

			if ( ! ( child instanceof THREE.Bone ) ) {

				child.update( this.matrixWorld, true, camera );

			} else {

				child.update( this.skinMatrix, forceUpdate, camera );

			}

		}

	} else {

		for ( i = 0; i < l; i++ ) {

			this.children[ i ].update( this.skinMatrix, forceUpdate, camera );

		}

	}

};


/*
 * Add child
 */

THREE.Bone.prototype.addChild = function( child ) {

	if ( this.children.indexOf( child ) === - 1 ) {

		if ( child.parent !== undefined ) {

			child.parent.removeChild( child );

		}

		child.parent = this;
		this.children.push( child );

		if ( ! ( child instanceof THREE.Bone ) ) {

			this.hasNoneBoneChildren = true;

		}

	}

};

/*
 * TODO: Remove Children: see if any remaining are none-Bone
 */
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.matrixAutoUpdate = false;

	this.fog = null;

	this.overrideMaterial = null;

	this.collisions = null;

	this.objects = [];
	this.lights = [];

	this.__objectsAdded = [];
	this.__objectsRemoved = [];

};

THREE.Scene.prototype = new THREE.Object3D();
THREE.Scene.prototype.constructor = THREE.Scene;
THREE.Scene.prototype.supr = THREE.Object3D.prototype;

THREE.Scene.prototype.addChild = function( child ) {

	this.supr.addChild.call( this, child );
	this.addChildRecurse( child );

}

THREE.Scene.prototype.addChildRecurse = function( child ) {

	if ( child instanceof THREE.Light ) {

		if ( this.lights.indexOf( child ) === -1 ) {

			this.lights.push( child );

		}

	} else if ( !( child instanceof THREE.Camera || child instanceof THREE.Bone ) ) {

		if ( this.objects.indexOf( child ) === -1 ) {

			this.objects.push( child );
			this.__objectsAdded.push( child );

		}

	}

	for ( var c = 0; c < child.children.length; c++ ) {

		this.addChildRecurse( child.children[ c ] );

	}

}


THREE.Scene.prototype.removeChild = function( child ) {

	this.supr.removeChild.call( this, child );
	this.removeChildRecurse( child );

}

THREE.Scene.prototype.removeChildRecurse = function( child ) {

	if ( child instanceof THREE.Light ) {

		var i = this.lights.indexOf( child );

		if ( i !== -1 ) {

			this.lights.splice( i, 1 );

		}

	} else if ( !( child instanceof THREE.Camera ) ) {

		var i = this.objects.indexOf( child );

		if( i !== -1 ) {

			this.objects.splice( i, 1 );
			this.__objectsRemoved.push( child );

		}

	}

	for ( var c = 0; c < child.children.length; c++ ) {

		this.removeChildRecurse( child.children[ c ] );

	}

}

THREE.Scene.prototype.addObject = THREE.Scene.prototype.addChild;
THREE.Scene.prototype.removeObject = THREE.Scene.prototype.removeChild;
THREE.Scene.prototype.addLight = THREE.Scene.prototype.addChild;
THREE.Scene.prototype.removeLight = THREE.Scene.prototype.removeChild;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.Projector = function() {

	var _object, _objectCount, _objectPool = [],
	_vertex, _vertexCount, _vertexPool = [],
	_face, _face3Count, _face3Pool = [], _face4Count, _face4Pool = [],
	_line, _lineCount, _linePool = [],
	_particle, _particleCount, _particlePool = [],

	_vector3 = new THREE.Vector4(),
	_vector4 = new THREE.Vector4(),
	_projScreenMatrix = new THREE.Matrix4(),
	_projScreenObjectMatrix = new THREE.Matrix4(),

	_frustum = [
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4()
	 ],

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4(),

	_face3VertexNormals;


	this.projectVector = function ( vector, camera ) {

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	this.unprojectVector = function ( vector, camera ) {

		_projScreenMatrix.multiply( camera.matrixWorld, THREE.Matrix4.makeInvert( camera.projectionMatrix ) );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	this.projectObjects = function ( scene, camera, sort ) {

		var renderList = [],
		o, ol, objects, object, matrix;

		_objectCount = 0;

		objects = scene.objects;

		for ( o = 0, ol = objects.length; o < ol; o ++ ) {

			object = objects[ o ];

			if ( !object.visible || ( object instanceof THREE.Mesh && !isInFrustum( object ) ) ) continue;

			_object = getNextObjectInPool();

			_vector3.copy( object.position );
			_projScreenMatrix.multiplyVector3( _vector3 );

			_object.object = object;
			_object.z = _vector3.z;

			renderList.push( _object );

		}

		sort && renderList.sort( painterSort );

		return renderList;

	};

	// TODO: Rename to projectElements?

	this.projectScene = function ( scene, camera, sort ) {

		var renderList = [], near = camera.near, far = camera.far,
		o, ol, v, vl, f, fl, n, nl, c, cl, u, ul, objects, object,
		objectMatrix, objectMatrixRotation, objectMaterials, objectOverdraw,
		geometry, vertices, vertex, vertexPositionScreen,
		faces, face, faceVertexNormals, normal, faceVertexUvs, uvs,
		v1, v2, v3, v4;

		_face3Count = 0;
		_face4Count = 0;
		_lineCount = 0;
		_particleCount = 0;

		camera.matrixAutoUpdate && camera.update( undefined, true );

		scene.update( undefined, false, camera );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		computeFrustum( _projScreenMatrix );

		objects = this.projectObjects( scene, camera, true );

		for ( o = 0, ol = objects.length; o < ol; o++ ) {

			object = objects[ o ].object;

			if ( !object.visible ) continue;

			objectMatrix = object.matrixWorld;
			objectMatrixRotation = object.matrixRotationWorld;

			objectMaterials = object.materials;
			objectOverdraw = object.overdraw;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				geometry = object.geometry;
				vertices = geometry.vertices;
				faces = geometry.faces;
				faceVertexUvs = geometry.faceVertexUvs;

				for ( v = 0, vl = vertices.length; v < vl; v ++ ) {

					_vertex = getNextVertexInPool();
					_vertex.positionWorld.copy( vertices[ v ].position );

					objectMatrix.multiplyVector3( _vertex.positionWorld );

					_vertex.positionScreen.copy( _vertex.positionWorld );
					_projScreenMatrix.multiplyVector4( _vertex.positionScreen );

					_vertex.positionScreen.x /= _vertex.positionScreen.w;
					_vertex.positionScreen.y /= _vertex.positionScreen.w;

					_vertex.visible = _vertex.positionScreen.z > near && _vertex.positionScreen.z < far;

				}

				for ( f = 0, fl = faces.length; f < fl; f ++ ) {

					face = faces[ f ];

					if ( face instanceof THREE.Face3 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];

						if ( v1.visible && v2.visible && v3.visible &&
							( object.doubleSided || ( object.flipSided !=
							( v3.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
							( v3.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) < 0 ) ) ) {

							_face = getNextFace3InPool();

							_face.v1.copy( v1 );
							_face.v2.copy( v2 );
							_face.v3.copy( v3 );

						} else {

							continue;

						}

					} else if ( face instanceof THREE.Face4 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];
						v4 = _vertexPool[ face.d ];

						if ( v1.visible && v2.visible && v3.visible && v4.visible &&
							( object.doubleSided || ( object.flipSided !=
							( ( v4.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
							( v4.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) < 0 ||
							( v2.positionScreen.x - v3.positionScreen.x ) * ( v4.positionScreen.y - v3.positionScreen.y ) -
							( v2.positionScreen.y - v3.positionScreen.y ) * ( v4.positionScreen.x - v3.positionScreen.x ) < 0 ) ) ) ) {

							_face = getNextFace4InPool();

							_face.v1.copy( v1 );
							_face.v2.copy( v2 );
							_face.v3.copy( v3 );
							_face.v4.copy( v4 );

						} else {

							continue;

						}

					}

					_face.normalWorld.copy( face.normal );
					objectMatrixRotation.multiplyVector3( _face.normalWorld );

					_face.centroidWorld.copy( face.centroid );
					objectMatrix.multiplyVector3( _face.centroidWorld );

					_face.centroidScreen.copy( _face.centroidWorld );
					_projScreenMatrix.multiplyVector3( _face.centroidScreen );

					faceVertexNormals = face.vertexNormals;

					for ( n = 0, nl = faceVertexNormals.length; n < nl; n ++ ) {

						normal = _face.vertexNormalsWorld[ n ];
						normal.copy( faceVertexNormals[ n ] );
						objectMatrixRotation.multiplyVector3( normal );

					}

					for ( c = 0, cl = faceVertexUvs.length; c < cl; c ++ ) {

						uvs = faceVertexUvs[ c ][ f ];

						if ( !uvs ) continue;

						for ( u = 0, ul = uvs.length; u < ul; u ++ ) {

							_face.uvs[ c ][ u ] = uvs[ u ];

						}

					}

					_face.meshMaterials = objectMaterials;
					_face.faceMaterials = face.materials;
					_face.overdraw = objectOverdraw;

					_face.z = _face.centroidScreen.z;

					renderList.push( _face );

				}

			} else if ( object instanceof THREE.Line ) {

				_projScreenObjectMatrix.multiply( _projScreenMatrix, objectMatrix );

				vertices = object.geometry.vertices;

				v1 = getNextVertexInPool();
				v1.positionScreen.copy( vertices[ 0 ].position );
				_projScreenObjectMatrix.multiplyVector4( v1.positionScreen );

				for ( v = 1, vl = vertices.length; v < vl; v++ ) {

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ v ].position );
					_projScreenObjectMatrix.multiplyVector4( v1.positionScreen );

					v2 = _vertexPool[ _vertexCount - 2 ];

					_clippedVertex1PositionScreen.copy( v1.positionScreen );
					_clippedVertex2PositionScreen.copy( v2.positionScreen );

					if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) ) {

						// Perform the perspective divide
						_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
						_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

						_line = getNextLineInPool();
						_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
						_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

						_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

						_line.materials = object.materials;

						renderList.push( _line );

					}
				}

			} else if ( object instanceof THREE.Particle ) {

				_vector4.set( object.matrixWorld.n14, object.matrixWorld.n24, object.matrixWorld.n34, 1 );
				_projScreenMatrix.multiplyVector4( _vector4 );

				_vector4.z /= _vector4.w;

				if ( _vector4.z > 0 && _vector4.z < 1 ) {

					_particle = getNextParticleInPool();
					_particle.x = _vector4.x / _vector4.w;
					_particle.y = _vector4.y / _vector4.w;
					_particle.z = _vector4.z;

					_particle.rotation = object.rotation.z;

					_particle.scale.x = object.scale.x * Math.abs( _particle.x - ( _vector4.x + camera.projectionMatrix.n11 ) / ( _vector4.w + camera.projectionMatrix.n14 ) );
					_particle.scale.y = object.scale.y * Math.abs( _particle.y - ( _vector4.y + camera.projectionMatrix.n22 ) / ( _vector4.w + camera.projectionMatrix.n24 ) );

					_particle.materials = object.materials;

					renderList.push( _particle );

				}

			}

		}

		sort && renderList.sort( painterSort );

		return renderList;

	};

	// Pools

	function getNextObjectInPool() {

		var object = _objectPool[ _objectCount ] = _objectPool[ _objectCount ] || new THREE.RenderableObject();

		_objectCount ++;

		return object;

	}

	function getNextVertexInPool() {

		var vertex = _vertexPool[ _vertexCount ] = _vertexPool[ _vertexCount ] || new THREE.RenderableVertex();

		_vertexCount ++;

		return vertex;

	}

	function getNextFace3InPool() {

		var face = _face3Pool[ _face3Count ] = _face3Pool[ _face3Count ] || new THREE.RenderableFace3();

		_face3Count ++;

		return face;

	}

	function getNextFace4InPool() {

		var face = _face4Pool[ _face4Count ] = _face4Pool[ _face4Count ] || new THREE.RenderableFace4();

		_face4Count ++;

		return face;

	}

	function getNextLineInPool() {

		var line = _linePool[ _lineCount ] = _linePool[ _lineCount ] || new THREE.RenderableLine();

		_lineCount ++;

		return line;

	}

	function getNextParticleInPool() {

		var particle = _particlePool[ _particleCount ] = _particlePool[ _particleCount ] || new THREE.RenderableParticle();
		_particleCount ++;
		return particle;

	}

	//

	function painterSort( a, b ) {

		return b.z - a.z;

	}

	function computeFrustum( m ) {

		_frustum[ 0 ].set( m.n41 - m.n11, m.n42 - m.n12, m.n43 - m.n13, m.n44 - m.n14 );
		_frustum[ 1 ].set( m.n41 + m.n11, m.n42 + m.n12, m.n43 + m.n13, m.n44 + m.n14 );
		_frustum[ 2 ].set( m.n41 + m.n21, m.n42 + m.n22, m.n43 + m.n23, m.n44 + m.n24 );
		_frustum[ 3 ].set( m.n41 - m.n21, m.n42 - m.n22, m.n43 - m.n23, m.n44 - m.n24 );
		_frustum[ 4 ].set( m.n41 - m.n31, m.n42 - m.n32, m.n43 - m.n33, m.n44 - m.n34 );
		_frustum[ 5 ].set( m.n41 + m.n31, m.n42 + m.n32, m.n43 + m.n33, m.n44 + m.n34 );

		for ( var i = 0; i < 6; i ++ ) {

			var plane = _frustum[ i ];
			plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );

		}

	}

	function isInFrustum( object ) {

		var distance, matrix = object.matrixWorld,
		radius = - object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) );

		for ( var i = 0; i < 6; i ++ ) {

			distance = _frustum[ i ].x * matrix.n14 + _frustum[ i ].y * matrix.n24 + _frustum[ i ].z * matrix.n34 + _frustum[ i ].w;
			if ( distance <= radius ) return false;

		}

		return true;

	};

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0) || (bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerpSelf( s2, alpha1 );
				s2.lerpSelf( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.DOMRenderer = function () {

	THREE.Renderer.call( this );

	var _renderList = null,
	_projector = new THREE.Projector(),
	_div = document.createElement( 'div' ),
	_width, _height, _widthHalf, _heightHalf;

	this.domElement = _div;

	this.setSize = function ( width, height ) {

		_width = width; _height = height;
		_widthHalf = _width / 2; _heightHalf = _height / 2;

	};

	this.render = function ( scene, camera ) {

		var e, el, m, ml, element, material, dom, v1x, v1y;

		_renderList = _projector.projectScene( scene, camera );

		for ( e = 0, el = _renderList.length; e < el; e++ ) {

			element = _renderList[ e ];

			if ( element instanceof THREE.RenderableParticle ) {

				v1x = element.x * _widthHalf + _widthHalf; v1y = element.y * _heightHalf + _heightHalf;

				for ( m = 0, ml = element.material.length; m < ml; m++ ) {

					material = element.material[ m ];

					if ( material instanceof THREE.ParticleDOMMaterial ) {

						dom = material.domElement;
						dom.style.left = v1x + 'px';
						dom.style.top = v1y + 'px';

					}

				}

			}

		}

	};

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableParticle = function () {

	this.x = null;
	this.y = null;
	this.z = null;

	this.rotation = null;
	this.scale = new THREE.Vector2();

	this.materials = null;

};
