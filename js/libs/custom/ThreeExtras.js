// ThreeExtras.js r42 - http://github.com/mrdoob/three.js
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ColorUtils = {
	
	adjustHSV : function ( color, h, s, v ) {

		var hsv = THREE.ColorUtils.__hsv;
		
		THREE.ColorUtils.rgbToHsv( color, hsv );

		hsv.h = THREE.ColorUtils.clamp( hsv.h + h, 0, 1 );
		hsv.s = THREE.ColorUtils.clamp( hsv.s + s, 0, 1 );
		hsv.v = THREE.ColorUtils.clamp( hsv.v + v, 0, 1 );
		
		color.setHSV( hsv.h, hsv.s, hsv.v );

	},
	
	// based on MochiKit implementation by Bob Ippolito

	rgbToHsv : function ( color, hsv ) {

		var r = color.r;
		var g = color.g;
		var b = color.b;
		
		var max = Math.max( Math.max( r, g ), b );
		var min = Math.min( Math.min( r, g ), b );

		var hue;
		var saturation;
		var value = max;

		if ( min == max )	{

			hue = 0;
			saturation = 0;

		} else {

			var delta = ( max - min );
			saturation = delta / max;

			if ( r == max )	{

				hue = ( g - b ) / delta;

			} else if ( g == max ) {

				hue = 2 + ( ( b - r ) / delta );

			} else	{

				hue = 4 + ( ( r - g ) / delta );
			}

			hue /= 6;

			if ( hue < 0 ) {

				hue += 1;

			}
			
			if ( hue > 1 ) {

				hue -= 1;

			}

		}
		
		if ( hsv === undefined ) {
			
			hsv = { h: 0, s: 0, v: 0 };

		}
		
		hsv.h = hue;
		hsv.s = saturation;
		hsv.v = value;
		
		return hsv;

	},
	
	clamp: function ( x, a, b ) { 
		
		return x < a ? a : ( x > b ? b : x ); 

	}

};

THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };var GeometryUtils = {

	merge: function ( geometry1, object2 /* mesh | geometry */ ) {

		var isMesh = object2 instanceof THREE.Mesh,
		vertexOffset = geometry1.vertices.length,
		uvPosition = geometry1.faceVertexUvs[ 0 ].length,
		geometry2 = isMesh ? object2.geometry : object2,
		vertices1 = geometry1.vertices,
		vertices2 = geometry2.vertices,
		faces1 = geometry1.faces,
		faces2 = geometry2.faces,
		uvs1 = geometry1.faceVertexUvs[ 0 ],
		uvs2 = geometry2.faceVertexUvs[ 0 ];

		isMesh && object2.matrixAutoUpdate && object2.updateMatrix();

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = new THREE.Vertex( vertex.position.clone() );

			isMesh && object2.matrix.multiplyVector3( vertexCopy.position );

			vertices1.push( vertexCopy );

		}

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			if ( face instanceof THREE.Face3 ) {

				faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );

			} else if ( face instanceof THREE.Face4 ) {

				faceCopy = new THREE.Face4( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset, face.d + vertexOffset );

			}

			faceCopy.normal.copy( face.normal );

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ];
				faceCopy.vertexNormals.push( normal.clone() );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faceCopy.materials = face.materials.slice();

			faceCopy.centroid.copy( face.centroid );

			faces1.push( faceCopy );

		}

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( new THREE.UV( uv[ j ].u, uv[ j ].v ) );

			}

			uvs1.push( uvCopy );

		}

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ImageUtils = {

	loadTexture: function ( path, mapping, callback ) {

		var image = new Image(),
			texture = new THREE.Texture( image, mapping );

		image.onload = function () { texture.needsUpdate = true; if ( callback ) callback( this ); };
		image.src = path;

		return texture;

	},

	loadTextureCube: function ( array, mapping, callback ) {

		var i, l, 
			images = [],
			texture = new THREE.Texture( images, mapping );

		images.loadCount = 0;

		for ( i = 0, l = array.length; i < l; ++i ) {

			images[ i ] = new Image();
			images[ i ].onload = function () {

				images.loadCount += 1; 
				if ( images.loadCount == 6 ) texture.needsUpdate = true; 
				if ( callback ) callback( this );

			};

			images[ i ].src = array[ i ];

		}

		return texture;

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	showHierarchy : function ( root, visible ) {

		THREE.SceneUtils.traverseHierarchy( root, function( node ) { node.visible = visible; } );

	},

	traverseHierarchy : function ( root, callback ) {

		var n, i, l = root.children.length;

		for ( i = 0; i < l; i ++ ) {

			n = root.children[ i ];

			callback( n );

			THREE.SceneUtils.traverseHierarchy( n, callback );

		}

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

if ( THREE.WebGLRenderer ) {

THREE.ShaderUtils = {

	lib: {

		/* -------------------------------------------------------------------------
		//	Fresnel shader
		//	- based on Nvidia Cg tutorial
		 ------------------------------------------------------------------------- */

		'fresnel': {

			uniforms: {

				"mRefractionRatio": { type: "f", value: 1.02 },
				"mFresnelBias": { type: "f", value: 0.1 },
				"mFresnelPower": { type: "f", value: 2.0 },
				"mFresnelScale": { type: "f", value: 1.0 },
				"tCube": { type: "t", value: 1, texture: null }

			},

			fragmentShader: [

				"uniform samplerCube tCube;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
					"vec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );",

					"refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
					"refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
					"refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",
					"refractedColor.a = 1.0;",

					"gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

				"}"

			].join("\n"),

			vertexShader: [

				"uniform float mRefractionRatio;",
				"uniform float mFresnelBias;",
				"uniform float mFresnelScale;",
				"uniform float mFresnelPower;",

				"varying vec3 vReflect;",
				"varying vec3 vRefract[3];",
				"varying float vReflectionFactor;",

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",

					"vec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );",

					"vec3 I = mPosition.xyz - cameraPosition;",

					"vReflect = reflect( I, nWorld );",
					"vRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );",
					"vRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );",
					"vRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );",
					"vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );",

					"gl_Position = projectionMatrix * mvPosition;",

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Normal map shader
		//		- Blinn-Phong
		//		- normal + diffuse + specular + AO + displacement maps
		//		- point and directional lights (use with "lights: true" material option)
		 ------------------------------------------------------------------------- */

		'normal' : {

			uniforms: THREE.UniformsUtils.merge( [

				THREE.UniformsLib[ "lights" ],

				{

				"enableAO"		: { type: "i", value: 0 },
				"enableDiffuse"	: { type: "i", value: 0 },
				"enableSpecular": { type: "i", value: 0 },

				"tDiffuse"	: { type: "t", value: 0, texture: null },
				"tNormal"	: { type: "t", value: 2, texture: null },
				"tSpecular"	: { type: "t", value: 3, texture: null },
				"tAO"		: { type: "t", value: 4, texture: null },

				"uNormalScale": { type: "f", value: 1.0 },

				"tDisplacement": { type: "t", value: 5, texture: null },
				"uDisplacementBias": { type: "f", value: 0.0 },
				"uDisplacementScale": { type: "f", value: 1.0 },

				"uDiffuseColor": { type: "c", value: new THREE.Color( 0xeeeeee ) },
				"uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
				"uAmbientColor": { type: "c", value: new THREE.Color( 0x050505 ) },
				"uShininess": { type: "f", value: 30 },
				"uOpacity": { type: "f", value: 1 }

				}

			] ),

			fragmentShader: [

				"uniform vec3 uAmbientColor;",
				"uniform vec3 uDiffuseColor;",
				"uniform vec3 uSpecularColor;",
				"uniform float uShininess;",
				"uniform float uOpacity;",

				"uniform bool enableDiffuse;",
				"uniform bool enableSpecular;",
				"uniform bool enableAO;",

				"uniform sampler2D tDiffuse;",
				"uniform sampler2D tNormal;",
				"uniform sampler2D tSpecular;",
				"uniform sampler2D tAO;",

				"uniform float uNormalScale;",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"uniform vec3 ambientLightColor;",

				"#if MAX_DIR_LIGHTS > 0",
					"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
					"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
				"#endif",

				"#if MAX_POINT_LIGHTS > 0",
					"uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",
				"#endif",

				"varying vec3 vViewPosition;",

				"void main() {",

					"gl_FragColor = vec4( 1.0 );",

					"vec4 mColor = vec4( uDiffuseColor, uOpacity );",
					"vec4 mSpecular = vec4( uSpecularColor, uOpacity );",

					"vec3 specularTex = vec3( 1.0 );",

					"vec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;",
					"normalTex.xy *= uNormalScale;",
					"normalTex = normalize( normalTex );",

					"if( enableDiffuse )",
						"gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",

					"if( enableAO )",
						"gl_FragColor = gl_FragColor * texture2D( tAO, vUv );",

					"if( enableSpecular )",
						"specularTex = texture2D( tSpecular, vUv ).xyz;",

					"mat3 tsb = mat3( vTangent, vBinormal, vNormal );",
					"vec3 finalNormal = tsb * normalTex;",

					"vec3 normal = normalize( finalNormal );",
					"vec3 viewPosition = normalize( vViewPosition );",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"vec4 pointTotal  = vec4( 0.0 );",

						"for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",

							"vec3 pointVector = normalize( vPointLight[ i ].xyz );",
							"vec3 pointHalfVector = normalize( vPointLight[ i ].xyz + vViewPosition );",
							"float pointDistance = vPointLight[ i ].w;",

							"float pointDotNormalHalf = dot( normal, pointHalfVector );",
							"float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",

							"float pointSpecularWeight = 0.0;",
							"if ( pointDotNormalHalf >= 0.0 )",
								"pointSpecularWeight = specularTex.r * pow( pointDotNormalHalf, uShininess );",

							"pointTotal  += pointDistance * vec4( pointLightColor[ i ], 1.0 ) * ( mColor * pointDiffuseWeight + mSpecular * pointSpecularWeight * pointDiffuseWeight );",

						"}",

					"#endif",

					// directional lights

					"#if MAX_DIR_LIGHTS > 0",

						"vec4 dirTotal  = vec4( 0.0 );",

						"for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",

							"vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",

							"vec3 dirVector = normalize( lDirection.xyz );",
							"vec3 dirHalfVector = normalize( lDirection.xyz + vViewPosition );",

							"float dirDotNormalHalf = dot( normal, dirHalfVector );",
							"float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",

							"float dirSpecularWeight = 0.0;",
							"if ( dirDotNormalHalf >= 0.0 )",
								"dirSpecularWeight = specularTex.r * pow( dirDotNormalHalf, uShininess );",

							"dirTotal  += vec4( directionalLightColor[ i ], 1.0 ) * ( mColor * dirDiffuseWeight + mSpecular * dirSpecularWeight * dirDiffuseWeight );",

						"}",

					"#endif",

					// all lights contribution summation

					"vec4 totalLight = vec4( ambientLightColor * uAmbientColor, uOpacity );",

					"#if MAX_DIR_LIGHTS > 0",
						"totalLight += dirTotal;",
					"#endif",

					"#if MAX_POINT_LIGHTS > 0",
						"totalLight += pointTotal;",
					"#endif",

					"gl_FragColor = gl_FragColor * totalLight;",

				"}"

			].join("\n"),

			vertexShader: [

				"attribute vec4 tangent;",

				"#ifdef VERTEX_TEXTURES",

					"uniform sampler2D tDisplacement;",
					"uniform float uDisplacementScale;",
					"uniform float uDisplacementBias;",

				"#endif",

				"varying vec3 vTangent;",
				"varying vec3 vBinormal;",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"#if MAX_POINT_LIGHTS > 0",

					"uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
					"uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",

					"varying vec4 vPointLight[ MAX_POINT_LIGHTS ];",

				"#endif",

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
					"vViewPosition = cameraPosition - mPosition.xyz;",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
					"vNormal = normalize( normalMatrix * normal );",

					// tangent and binormal vectors

					"vTangent = normalize( normalMatrix * tangent.xyz );",

					"vBinormal = cross( vNormal, vTangent ) * tangent.w;",
					"vBinormal = normalize( vBinormal );",

					"vUv = uv;",

					// point lights

					"#if MAX_POINT_LIGHTS > 0",

						"for( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {",

							"vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",

							"vec3 lVector = lPosition.xyz - mvPosition.xyz;",

							"float lDistance = 1.0;",

							"if ( pointLightDistance[ i ] > 0.0 )",
								"lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );",

							"lVector = normalize( lVector );",

							"vPointLight[ i ] = vec4( lVector, lDistance );",

						"}",

					"#endif",

					// displacement mapping

					"#ifdef VERTEX_TEXTURES",

						"vec3 dv = texture2D( tDisplacement, uv ).xyz;",
						"float df = uDisplacementScale * dv.x + uDisplacementBias;",
						"vec4 displacedPosition = vec4( vNormal.xyz * df, 0.0 ) + mvPosition;",
						"gl_Position = projectionMatrix * displacedPosition;",

					"#else",

						"gl_Position = projectionMatrix * mvPosition;",

					"#endif",

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Cube map shader
		 ------------------------------------------------------------------------- */

		'cube': {

			uniforms: { "tCube": { type: "t", value: 1, texture: null } },

			vertexShader: [

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec4 mPosition = objectMatrix * vec4( position, 1.0 );",
					"vViewPosition = cameraPosition - mPosition.xyz;",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform samplerCube tCube;",

				"varying vec3 vViewPosition;",

				"void main() {",

					"vec3 wPos = cameraPosition - vViewPosition;",
					"gl_FragColor = textureCube( tCube, vec3( - wPos.x, wPos.yz ) );",

				"}"

			].join("\n")

		},

		/* ------------------------------------------------------------------------
		//	Convolution shader
		//	  - ported from o3d sample to WebGL / GLSL
		//			http://o3d.googlecode.com/svn/trunk/samples/convolution.html
		------------------------------------------------------------------------ */

		'convolution': {

			uniforms: {

				"tDiffuse" : { type: "t", value: 0, texture: null },
				"uImageIncrement" : { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
				"cKernel" : { type: "fv1", value: [] }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"uniform vec2 uImageIncrement;",
				//"#define KERNEL_SIZE 25.0",

				"void main(void) {",

					"vUv = uv - ((KERNEL_SIZE - 1.0) / 2.0) * uImageIncrement;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",

				"uniform sampler2D tDiffuse;",
				"uniform vec2 uImageIncrement;",

				//"#define KERNEL_SIZE 25",
				"uniform float cKernel[KERNEL_SIZE];",

				"void main(void) {",

					"vec2 imageCoord = vUv;",
					"vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",
					"for( int i=0; i<KERNEL_SIZE; ++i ) {",
						"sum += texture2D( tDiffuse, imageCoord ) * cKernel[i];",
						"imageCoord += uImageIncrement;",
					"}",
					"gl_FragColor = sum;",

				"}"


			].join("\n")

		},

		/* -------------------------------------------------------------------------

		// Film grain & scanlines shader

		//	- ported from HLSL to WebGL / GLSL
		//	  http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html

		// Screen Space Static Postprocessor
		//
		// Produces an analogue noise overlay similar to a film grain / TV static
		//
		// Original implementation and noise algorithm
		// Pat 'Hawthorne' Shearon
		//
		// Optimized scanlines + noise version with intensity scaling
		// Georg 'Leviathan' Steinrohder

		// This version is provided under a Creative Commons Attribution 3.0 License
		// http://creativecommons.org/licenses/by/3.0/
		 ------------------------------------------------------------------------- */

		'film': {

			uniforms: {

				tDiffuse:   { type: "t", value: 0, texture: null },
				time: 	    { type: "f", value: 0.0 },
				nIntensity: { type: "f", value: 0.5 },
				sIntensity: { type: "f", value: 0.05 },
				sCount: 	{ type: "f", value: 4096 },
				grayscale:  { type: "i", value: 1 }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",
				"uniform sampler2D tDiffuse;",

				// control parameter
				"uniform float time;",

				"uniform bool grayscale;",

				// noise effect intensity value (0 = no effect, 1 = full effect)
				"uniform float nIntensity;",

				// scanlines effect intensity value (0 = no effect, 1 = full effect)
				"uniform float sIntensity;",

				// scanlines effect count value (0 = no effect, 4096 = full effect)
				"uniform float sCount;",

				"void main() {",

					// sample the source
					"vec4 cTextureScreen = texture2D( tDiffuse, vUv );",

					// make some noise
					"float x = vUv.x * vUv.y * time *  1000.0;",
					"x = mod( x, 13.0 ) * mod( x, 123.0 );",
					"float dx = mod( x, 0.01 );",

					// add noise
					"vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",

					// get us a sine and cosine
					"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

					// add scanlines
					"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

					// interpolate between source and result by intensity
					"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

					// convert to grayscale if desired
					"if( grayscale ) {",
						"cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",
					"}",

					"gl_FragColor =  vec4( cResult, cTextureScreen.a );",

				"}"

			].join("\n")

		},

		/* -------------------------------------------------------------------------
		//	Full-screen textured quad shader
		 ------------------------------------------------------------------------- */

		'screen': {

			uniforms: {

				tDiffuse: { type: "t", value: 0, texture: null },
				opacity: { type: "f", value: 1.0 }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",
				"uniform sampler2D tDiffuse;",
				"uniform float opacity;",

				"void main() {",

					"vec4 texel = texture2D( tDiffuse, vUv );",
					"gl_FragColor = opacity * texel;",

				"}"

			].join("\n")

		},


		/* -------------------------------------------------------------------------
		//	Simple test shader
		 ------------------------------------------------------------------------- */

		'basic': {

			uniforms: {},

			vertexShader: [

				"void main() {",

					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"void main() {",

					"gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );",

				"}"

			].join("\n")

		}

	},

	buildKernel: function( sigma ) {

		// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

		function gauss( x, sigma ) {

			return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

		}

		var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

		if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
		halfWidth = ( kernelSize - 1 ) * 0.5

		values = new Array( kernelSize );
		sum = 0.0;
		for ( i = 0; i < kernelSize; ++i ) {

			values[ i ] = gauss( i - halfWidth, sigma );
			sum += values[ i ];

		}

		// normalize the kernel

		for ( i = 0; i < kernelSize; ++i ) values[ i ] /= sum;

		return values;

	}

};

};/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.AnimationHandler = (function() {

	var playing = [];
	var library = {};
	var that    = {};


	//--- update ---

	that.update = function( deltaTimeMS ) {

		for( var i = 0; i < playing.length; i++ )
			playing[ i ].update( deltaTimeMS );

	};


	//--- add ---

	that.addToUpdate = function( animation ) {

		if( playing.indexOf( animation ) === -1 )
			playing.push( animation );

	};


	//--- remove ---

	that.removeFromUpdate = function( animation ) {

		var index = playing.indexOf( animation );

		if( index !== -1 )
			playing.splice( index, 1 );

	};


	//--- add ---
	
	that.add = function( data ) {

		if( library[ data.name ] !== undefined )
			console.log( "THREE.AnimationHandler.add: Warning! " + data.name + " already exists in library. Overwriting." );

		library[ data.name ] = data;
		initData( data );

	};


	//--- get ---
	
	that.get = function( name ) {
		
		if( typeof name === "string" ) {
			
			if( library[ name ] ) {
				
				return library[ name ];
			
			} else {
				
				console.log( "THREE.AnimationHandler.get: Couldn't find animation " + name );
				return null;

			}

		} else {
			
			// todo: add simple tween library

		}
		
	};

	//--- parse ---
	
	that.parse = function( root ) {
		
		// setup hierarchy

		var hierarchy = [];
	
		if ( root instanceof THREE.SkinnedMesh ) {
	
			for( var b = 0; b < root.bones.length; b++ ) {
	
				hierarchy.push( root.bones[ b ] );
	
			}
	
		} else {
	
			parseRecurseHierarchy( root, hierarchy );
	
		}
		
		return hierarchy;

	};

	var parseRecurseHierarchy = function( root, hierarchy ) {
		
		hierarchy.push( root );
		
		for( var c = 0; c < root.children.length; c++ ) 
			parseRecurseHierarchy( root.children[ c ], hierarchy );

	}


	//--- init data ---

	var initData = function( data ) {
 
		if( data.initialized === true )
			return;
		

		// loop through all keys

		for( var h = 0; h < data.hierarchy.length; h++ ) {

			for( var k = 0; k < data.hierarchy[ h ].keys.length; k++ ) {

				// remove minus times

				if( data.hierarchy[ h ].keys[ k ].time < 0 )
					data.hierarchy[ h ].keys[ k ].time = 0;


				// create quaternions

				if( data.hierarchy[ h ].keys[ k ].rot !== undefined &&
				 !( data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion ) ) {

					var quat = data.hierarchy[ h ].keys[ k ].rot;
					data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion( quat[0], quat[1], quat[2], quat[3] );

				}
			}


			// prepare morph target keys
			
			if( data.hierarchy[ h ].keys[ 0 ].morphTargets !== undefined ) {

				// get all used

				var usedMorphTargets = {};
				
				for( var k = 0; k < data.hierarchy[ h ].keys.length; k++ ) {
	
					for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m++ ) {
						
						var morphTargetName = data.hierarchy[ h ].keys[ k ].morphTargets[ m ];
						usedMorphTargets[ morphTargetName ] = -1;
					}					
				
				}
				
				data.hierarchy[ h ].usedMorphTargets = usedMorphTargets;
				
				
				// set all used on all frames
				
				for( var k = 0; k < data.hierarchy[ h ].keys.length; k++ ) {
	
					var influences = {};
	
					for( var morphTargetName in usedMorphTargets ) {
			
						for( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m++ ) {
	
							if( data.hierarchy[ h ].keys[ k ].morphTargets[ m ] === morphTargetName ) {
								
								influences[ morphTargetName ] = data.hierarchy[ h ].keys[ k ].morphTargetsInfluences[ m ];
								break;	
							}
					
						}
						
						if( m === data.hierarchy[ h ].keys[ k ].morphTargets.length ) {
							
							influences[ morphTargetName ] = 0;
						}
	
					}
				
					data.hierarchy[ h ].keys[ k ].morphTargetsInfluences = influences;
				}
			
			}
			
			
			// remove all keys that are on the same time
			
			for( var k = 1; k < data.hierarchy[ h ].keys.length; k++ ) {
				
				if( data.hierarchy[ h ].keys[ k ].time === data.hierarchy[ h ].keys[ k - 1 ].time ) {
					
					data.hierarchy[ h ].keys.splice( k, 1 );
					k--;
				
				}
				
			}


			// set index
			
			for( var k = 1; k < data.hierarchy[ h ].keys.length; k++ ) {
				
				data.hierarchy[ h ].keys[ k ].index = k;
				
			}

		}


		// JIT

		var lengthInFrames = parseInt( data.length * data.fps, 10 );

		data.JIT = {};
		data.JIT.hierarchy = [];

		for( var h = 0; h < data.hierarchy.length; h++ )
			data.JIT.hierarchy.push( new Array( lengthInFrames ));


		// done

		data.initialized = true;

	};


	// interpolation types

	that.LINEAR = 0;
	that.CATMULLROM = 1;
	that.CATMULLROM_FORWARD = 2;

	return that;
}());
/**
 * @author mikael emtinger / http://gomo.se/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Animation = function( root, data, interpolationType, JITCompile ) {

	this.root = root;
	this.data = THREE.AnimationHandler.get( data );
	this.hierarchy = THREE.AnimationHandler.parse( root );
	this.currentTime = 0;
	this.timeScale = 1;
	this.isPlaying = false;
	this.isPaused = true;
	this.loop = true;
	this.interpolationType = interpolationType !== undefined ? interpolationType : THREE.AnimationHandler.LINEAR;
	this.JITCompile = JITCompile !== undefined ? JITCompile : true;

	this.points = [];
	this.target = new THREE.Vector3();

};

// Play

THREE.Animation.prototype.play = function( loop, startTimeMS ) {

	if( !this.isPlaying ) {

		this.isPlaying = true;
		this.loop = loop !== undefined ? loop : true;
		this.currentTime = startTimeMS !== undefined ? startTimeMS : 0;


		// reset key cache

		var h, hl = this.hierarchy.length,
			object;
		
		for ( h = 0; h < hl; h++ ) {

			object = this.hierarchy[ h ];
			
			if ( this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD ) {

				object.useQuaternion = true;

			}
			
			object.matrixAutoUpdate = true;

			if ( object.animationCache === undefined ) {

				object.animationCache = {};
				object.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.originalMatrix = object instanceof THREE.Bone ? object.skinMatrix : object.matrix;

			}

			var prevKey = object.animationCache.prevKey;
			var nextKey = object.animationCache.nextKey;

			prevKey.pos = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.rot = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.scl = this.data.hierarchy[ h ].keys[ 0 ];

			nextKey.pos = this.getNextKeyWith( "pos", h, 1 );
			nextKey.rot = this.getNextKeyWith( "rot", h, 1 );
			nextKey.scl = this.getNextKeyWith( "scl", h, 1 );

		}

		this.update( 0 );

	}

	this.isPaused = false;

	THREE.AnimationHandler.addToUpdate( this );

};



// Pause

THREE.Animation.prototype.pause = function() {

	if( this.isPaused ) {
		
		THREE.AnimationHandler.addToUpdate( this );
		
	} else {
		
		THREE.AnimationHandler.removeFromUpdate( this );
		
	}
	
	this.isPaused = !this.isPaused;

};


// Stop

THREE.Animation.prototype.stop = function() {

	this.isPlaying = false;
	this.isPaused  = false;
	THREE.AnimationHandler.removeFromUpdate( this );
	
	
	// reset JIT matrix and remove cache
	
	for ( var h = 0; h < this.hierarchy.length; h++ ) {
		
		if ( this.hierarchy[ h ].animationCache !== undefined ) {
			
			if( this.hierarchy[ h ] instanceof THREE.Bone ) {
			
				this.hierarchy[ h ].skinMatrix = this.hierarchy[ h ].animationCache.originalMatrix;
				
			} else {
				
				this.hierarchy[ h ].matrix = this.hierarchy[ h ].animationCache.originalMatrix;

			}
			
			
			delete this.hierarchy[ h ].animationCache;

		}

	}
 	
};


// Update

THREE.Animation.prototype.update = function( deltaTimeMS ) {

	// early out

	if( !this.isPlaying ) return;


	// vars

	var types = [ "pos", "rot", "scl" ];
	var type;
	var scale;
	var vector;
	var prevXYZ, nextXYZ;
	var prevKey, nextKey;
	var object;
	var animationCache;
	var frame;
	var JIThierarchy = this.data.JIT.hierarchy;
	var currentTime, unloopedCurrentTime;
	var currentPoint, forwardPoint, angle;
	

	// update
	
	this.currentTime += deltaTimeMS * this.timeScale;

	unloopedCurrentTime = this.currentTime;
	currentTime         = this.currentTime = this.currentTime % this.data.length;
	frame               = parseInt( Math.min( currentTime * this.data.fps, this.data.length * this.data.fps ), 10 );


	// update

	for ( var h = 0, hl = this.hierarchy.length; h < hl; h++ ) {

		object = this.hierarchy[ h ];
		animationCache = object.animationCache;
	
		// use JIT?
	
		if ( this.JITCompile && JIThierarchy[ h ][ frame ] !== undefined ) {

			if( object instanceof THREE.Bone ) {
				
				object.skinMatrix = JIThierarchy[ h ][ frame ];
				
				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = false;

			} else {
			
				object.matrix = JIThierarchy[ h ][ frame ];
				
				object.matrixAutoUpdate = false;
				object.matrixWorldNeedsUpdate = true;

			}
			
		// use interpolation
	
		} else {

			// make sure so original matrix and not JIT matrix is set

			if ( this.JITCompile ) {
				
				if( object instanceof THREE.Bone ) {
					
					object.skinMatrix = object.animationCache.originalMatrix;
					
				} else {
					
					object.matrix = object.animationCache.originalMatrix;
					
				}

			}


			// loop through pos/rot/scl

			for ( var t = 0; t < 3; t++ ) {

				// get keys

				type    = types[ t ];
				prevKey = animationCache.prevKey[ type ];
				nextKey = animationCache.nextKey[ type ];

				// switch keys?

				if ( nextKey.time <= unloopedCurrentTime ) {

					// did we loop?

					if ( currentTime < unloopedCurrentTime ) {

						if ( this.loop ) {

							prevKey = this.data.hierarchy[ h ].keys[ 0 ];
							nextKey = this.getNextKeyWith( type, h, 1 );

							while( nextKey.time < currentTime ) {
	
								prevKey = nextKey;
								nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );
	
							}

						} else {

							this.stop();
							return;

						}

					} else {

						do {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						} while( nextKey.time < currentTime )

					}

					animationCache.prevKey[ type ] = prevKey;
					animationCache.nextKey[ type ] = nextKey;

				}


				object.matrixAutoUpdate = true;
				object.matrixWorldNeedsUpdate = true;

				scale = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
				prevXYZ = prevKey[ type ];
				nextXYZ = nextKey[ type ];


				// check scale error

				if ( scale < 0 || scale > 1 ) {

					console.log( "THREE.Animation.update: Warning! Scale out of bounds:" + scale + " on bone " + h ); 
					scale = scale < 0 ? 0 : 1;

				}

				// interpolate

				if ( type === "pos" ) {

					vector = object.position; 

					if( this.interpolationType === THREE.AnimationHandler.LINEAR ) {
						
						vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
						vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
						vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

					} else if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
							    this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {						
		
						this.points[ 0 ] = this.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
						this.points[ 1 ] = prevXYZ;
						this.points[ 2 ] = nextXYZ;
						this.points[ 3 ] = this.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

						scale = scale * 0.33 + 0.33;

						currentPoint = this.interpolateCatmullRom( this.points, scale );
						
						vector.x = currentPoint[ 0 ];
						vector.y = currentPoint[ 1 ];
						vector.z = currentPoint[ 2 ];
						
						if( this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
							
							forwardPoint = this.interpolateCatmullRom( this.points, scale * 1.01 );							
							
							this.target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
							this.target.subSelf( vector );
							this.target.y = 0;
							this.target.normalize();
							
							angle = Math.atan2( this.target.x, this.target.z );
							object.rotation.set( 0, angle, 0 );
							
						}

					}

				} else if ( type === "rot" ) {

					THREE.Quaternion.slerp( prevXYZ, nextXYZ, object.quaternion, scale );

				} else if( type === "scl" ) {

					vector = object.scale;
					
					vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
					vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
					vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

				}

			}

		}

	}

	// update JIT?

	if ( this.JITCompile ) {
		
		if ( JIThierarchy[ 0 ][ frame ] === undefined ) {
	
			this.hierarchy[ 0 ].update( undefined, true );
	
			for ( var h = 0; h < this.hierarchy.length; h++ ) {
	
				if( this.hierarchy[ h ] instanceof THREE.Bone ) {
	
					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].skinMatrix.clone();
					
				} else {
	
					JIThierarchy[ h ][ frame ] = this.hierarchy[ h ].matrix.clone();
				
				}
	
			}
	
		}

	}

};

// Catmull-Rom spline
 
THREE.Animation.prototype.interpolateCatmullRom = function ( points, scale ) {

	var c = [], v3 = [],
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;
	
	point = ( points.length - 1 ) * scale;
	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

	pa = points[ c[ 0 ] ];
	pb = points[ c[ 1 ] ];
	pc = points[ c[ 2 ] ];
	pd = points[ c[ 3 ] ];

	w2 = weight * weight;
	w3 = weight * w2;
	
	v3[ 0 ] = this.interpolate( pa[ 0 ], pb[ 0 ], pc[ 0 ], pd[ 0 ], weight, w2, w3 );
	v3[ 1 ] = this.interpolate( pa[ 1 ], pb[ 1 ], pc[ 1 ], pd[ 1 ], weight, w2, w3 );
	v3[ 2 ] = this.interpolate( pa[ 2 ], pb[ 2 ], pc[ 2 ], pd[ 2 ], weight, w2, w3 );
	
	return v3;

};

THREE.Animation.prototype.interpolate = function( p0, p1, p2, p3, t, t2, t3 ) {

	var v0 = ( p2 - p0 ) * 0.5,
		v1 = ( p3 - p1 ) * 0.5;

	return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

};



// Get next key with

THREE.Animation.prototype.getNextKeyWith = function( type, h, key ) {
	
	var keys = this.data.hierarchy[ h ].keys;
	
	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
			 
		key = key < keys.length - 1 ? key : keys.length - 1;

	} else {
		
		key = key % keys.length;

	}

	for ( ; key < keys.length; key++ ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ 0 ];

};

// Get previous key with

THREE.Animation.prototype.getPrevKeyWith = function( type, h, key ) {
	
	var keys = this.data.hierarchy[ h ].keys;
	
	if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
		 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {
			 
		key = key > 0 ? key : 0;

	} else {
		
		key = key >= 0 ? key : key + keys.length;

	}


	for ( ; key >= 0; key-- ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 *
 * parameters = {
 *  fov: <float>,
 *  aspect: <float>,
 *  near: <float>,
 *  far: <float>,
 *  target: <THREE.Object3D>,

 *  movementSpeed: <float>,
 *  lookSpeed: <float>,

 *  noFly: <bool>,
 *  lookVertical: <bool>,
 *  autoForward: <bool>,

 *  constrainVertical: <bool>,
 *  verticalMin: <float>,
 *  verticalMax: <float>,

 *  heightSpeed: <bool>,
 *  heightCoef: <float>,
 *  heightMin: <float>,
 *  heightMax: <float>,

 *  domElement: <HTMLElement>,
 * }
 */

THREE.FirstPersonCamera = function ( parameters ) {

	THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.noFly = false;
	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = 3.14;

	this.domElement = document;

	this.lastUpdate = new Date().getTime();
	this.tdiff = 0;

	if ( parameters ) {

		if ( parameters.movementSpeed !== undefined ) this.movementSpeed = parameters.movementSpeed;
		if ( parameters.lookSpeed !== undefined ) this.lookSpeed  = parameters.lookSpeed;
		if ( parameters.noFly !== undefined ) this.noFly = parameters.noFly;
		if ( parameters.lookVertical !== undefined ) this.lookVertical = parameters.lookVertical;

		if ( parameters.autoForward !== undefined ) this.autoForward = parameters.autoForward;

		if ( parameters.activeLook !== undefined ) this.activeLook = parameters.activeLook;

		if ( parameters.heightSpeed !== undefined ) this.heightSpeed = parameters.heightSpeed;
		if ( parameters.heightCoef !== undefined ) this.heightCoef = parameters.heightCoef;
		if ( parameters.heightMin !== undefined ) this.heightMin = parameters.heightMin;
		if ( parameters.heightMax !== undefined ) this.heightMax = parameters.heightMax;

		if ( parameters.constrainVertical !== undefined ) this.constrainVertical = parameters.constrainVertical;
		if ( parameters.verticalMin !== undefined ) this.verticalMin = parameters.verticalMin;
		if ( parameters.verticalMax !== undefined ) this.verticalMax = parameters.verticalMax;

		if ( parameters.domElement !== undefined ) this.domElement = parameters.domElement;

	}

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.windowHalfX = window.innerWidth / 2;
	this.windowHalfY = window.innerHeight / 2;

	this.onMouseDown = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		this.mouseX = event.clientX - this.windowHalfX;
		this.mouseY = event.clientY - this.windowHalfY;

	};

	this.onKeyDown = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 81: this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

		}

	};

	this.update = function() {

		var now = new Date().getTime();
		this.tdiff = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;
		
		if ( !this.freeze ) {


			if ( this.heightSpeed ) {

				var y = clamp( this.position.y, this.heightMin, this.heightMax ),
					delta = y - this.heightMin;

				this.autoSpeedFactor = this.tdiff * ( delta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = this.tdiff * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.translateZ( actualMoveSpeed );
			if ( this.moveLeft ) this.translateX( - actualMoveSpeed );
			if ( this.moveRight ) this.translateX( actualMoveSpeed );

			var actualLookSpeed = this.tdiff * this.lookSpeed;

			if ( !this.activeLook ) {

				actualLookSpeed = 0;

			}

			this.lon += this.mouseX * actualLookSpeed;
			if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = ( 90 - this.lat ) * Math.PI / 180;
			this.theta = this.lon * Math.PI / 180;

			var targetPosition = this.target.position,
				position = this.position;

			targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
			targetPosition.y = position.y + 100 * Math.cos( this.phi );
			targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = ( 90 - this.lat ) * Math.PI / 180;
		this.theta = this.lon * Math.PI / 180;

		if ( this.constrainVertical ) {

			this.phi = map_linear( this.phi, 0, 3.14, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target.position,
			position = this.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.supr.update.call( this );

	};


	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
	this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
	this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	function map_linear( x, sa, sb, ea, eb ) {

		return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;

	};

	function clamp_bottom( x, a ) {

		return x < a ? a : x;

	};

	function clamp( x, a, b ) {

		return x < a ? a : ( x > b ? b : x );

	};

};


THREE.FirstPersonCamera.prototype = new THREE.Camera();
THREE.FirstPersonCamera.prototype.constructor = THREE.FirstPersonCamera;
THREE.FirstPersonCamera.prototype.supr = THREE.Camera.prototype;


THREE.FirstPersonCamera.prototype.translate = function ( distance, axis ) {

	this.matrix.rotateAxis( axis );

	if ( this.noFly ) {

		axis.y = 0;

	}

	this.position.addSelf( axis.multiplyScalar( distance ) );
	this.target.position.addSelf( axis.multiplyScalar( distance ) );

};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  fov: <float>,
 *  aspect: <float>,
 *  near: <float>,
 *  far: <float>,
 *  target: <THREE.Object3D>,

 *  waypoints: <Array>,	// [ [x,y,z], [x,y,z] ... ]
 *  duration: <float>, 	// seconds

 *  useConstantSpeed: <bool>,
 *  resamplingCoef: <float>,

 *  createDebugPath: <bool>,
 *  createDebugDummy: <bool>,

 *  lookSpeed: <float>,
 *  lookVertical: <bool>,
 *  lookHorizontal: <bool>,
 *  verticalAngleMap: { srcRange: [ <float>, <float> ], dstRange: [ <float>, <float> ] }
 *  horizontalAngleMap: { srcRange: [ <float>, <float> ], dstRange: [ <float>, <float> ] }

 *  domElement: <HTMLElement>,
 * }
 */

THREE.PathCamera = function ( parameters ) {

	THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

	this.id = "PathCamera" + THREE.PathCameraIdCounter ++;

	this.duration = 10 * 1000; // milliseconds
	this.waypoints = [];

	this.useConstantSpeed = true;
	this.resamplingCoef = 50;

	this.debugPath = new THREE.Object3D();
	this.debugDummy = new THREE.Object3D();

	this.animationParent = new THREE.Object3D();

	this.lookSpeed = 0.005;
	this.lookVertical = true;
	this.lookHorizontal = true;
	this.verticalAngleMap   = { srcRange: [ 0, 6.28 ], dstRange: [ 0, 6.28 ] };
	this.horizontalAngleMap = { srcRange: [ 0, 6.28 ], dstRange: [ 0, 6.28 ] };

	this.domElement = document;

	if ( parameters ) {

		if ( parameters.duration !== undefined ) this.duration = parameters.duration * 1000;
		if ( parameters.waypoints !== undefined ) this.waypoints = parameters.waypoints;

		if ( parameters.useConstantSpeed !== undefined ) this.useConstantSpeed = parameters.useConstantSpeed;
		if ( parameters.resamplingCoef !== undefined ) this.resamplingCoef = parameters.resamplingCoef;

		if ( parameters.createDebugPath !== undefined ) this.createDebugPath = parameters.createDebugPath;
		if ( parameters.createDebugDummy !== undefined ) this.createDebugDummy = parameters.createDebugDummy;

		if ( parameters.lookSpeed !== undefined ) this.lookSpeed = parameters.lookSpeed;
		if ( parameters.lookVertical !== undefined ) this.lookVertical = parameters.lookVertical;
		if ( parameters.lookHorizontal !== undefined ) this.lookHorizontal = parameters.lookHorizontal;
		if ( parameters.verticalAngleMap !== undefined ) this.verticalAngleMap = parameters.verticalAngleMap;
		if ( parameters.horizontalAngleMap !== undefined ) this.horizontalAngleMap = parameters.horizontalAngleMap;

		if ( parameters.domElement !== undefined ) this.domElement = parameters.domElement;

	}

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;

	this.phi = 0;
	this.theta = 0;

	this.windowHalfX = window.innerWidth / 2;
	this.windowHalfY = window.innerHeight / 2;

	var PI2 = Math.PI * 2,
		PI180 = Math.PI / 180;

	// methods

	this.update = function ( parentMatrixWorld, forceUpdate, camera ) {

		var srcRange, dstRange;

		if( this.lookHorizontal ) this.lon += this.mouseX * this.lookSpeed;
		if( this.lookVertical )   this.lat -= this.mouseY * this.lookSpeed;

		this.lon = Math.max( 0, Math.min( 360, this.lon ) );
		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );

		this.phi = ( 90 - this.lat ) * PI180;
		this.theta = this.lon * PI180;

		this.phi = normalize_angle_rad( this.phi );

		// constrain vertical look angle

		srcRange = this.verticalAngleMap.srcRange;
		dstRange = this.verticalAngleMap.dstRange;

		//this.phi = map_linear( this.phi, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		
		var tmpPhi = map_linear( this.phi, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpPhiFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpPhiNormalized = ( tmpPhi - dstRange[ 0 ] ) / tmpPhiFullRange;
		
		this.phi = TWEEN.Easing.Quadratic.EaseInOut( tmpPhiNormalized ) * tmpPhiFullRange + dstRange[ 0 ];
		
		// constrain horizontal look angle

		srcRange = this.horizontalAngleMap.srcRange;
		dstRange = this.horizontalAngleMap.dstRange;

		//this.theta = map_linear( this.theta, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		
		var tmpTheta = map_linear( this.theta, srcRange[ 0 ], srcRange[ 1 ], dstRange[ 0 ], dstRange[ 1 ] );
		var tmpThetaFullRange = dstRange[ 1 ] - dstRange[ 0 ];
		var tmpThetaNormalized = ( tmpTheta - dstRange[ 0 ] ) / tmpThetaFullRange;
		
		this.theta = TWEEN.Easing.Quadratic.EaseInOut( tmpThetaNormalized ) * tmpThetaFullRange + dstRange[ 0 ];

		var targetPosition = this.target.position,
			position = this.position;

		/*
		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );
		*/

		targetPosition.x = 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = 100 * Math.cos( this.phi );
		targetPosition.z = 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.supr.update.call( this, parentMatrixWorld, forceUpdate, camera );

	};

	this.onMouseMove = function ( event ) {

		this.mouseX = event.clientX - this.windowHalfX;
		this.mouseY = event.clientY - this.windowHalfY;

	};

	// utils

	function normalize_angle_rad( a ) {

		var b = a % PI2;
		return b >= 0 ? b : b + PI2;

	};

	function cap( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	};

	function map_linear( x, sa, sb, ea, eb ) {

		return ( x  - sa ) * ( eb - ea ) / ( sb - sa ) + ea;

	};

	function distance( a, b ) {

		var dx = a[ 0 ] - b[ 0 ],
			dy = a[ 1 ] - b[ 1 ],
			dz = a[ 2 ] - b[ 2 ];

		return Math.sqrt( dx * dx + dy * dy + dz * dz );

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	function initAnimationPath( parent, spline, name, duration ) {

		var animationData = {

		   name: name,
		   fps: 0.6,
		   length: duration,

		   hierarchy: []

		};

		var i,
			parentAnimation, childAnimation,
			path = spline.getControlPointsArray(),
			sl = spline.getLength(),
			pl = path.length,
			t = 0,
			first = 0,
			last  = pl - 1;

		parentAnimation = { parent: -1, keys: [] };
		parentAnimation.keys[ first ] = { time: 0,        pos: path[ first ], rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };
		parentAnimation.keys[ last  ] = { time: duration, pos: path[ last ],  rot: [ 0, 0, 0, 1 ], scl: [ 1, 1, 1 ] };

		for ( i = 1; i < pl - 1; i++ ) {

			// real distance (approximation via linear segments)

			t = duration * sl.chunks[ i ] / sl.total;

			// equal distance

			//t = duration * ( i / pl );

			// linear distance

			//t += duration * distance( path[ i ], path[ i - 1 ] ) / sl.total;

			parentAnimation.keys[ i ] = { time: t, pos: path[ i ] };

		}

		animationData.hierarchy[ 0 ] = parentAnimation;

		THREE.AnimationHandler.add( animationData );

		return new THREE.Animation( parent, name, THREE.AnimationHandler.CATMULLROM_FORWARD, false );

	};


	function createSplineGeometry( spline, n_sub ) {

		var i, index, position,
			geometry = new THREE.Geometry();

		for ( i = 0; i < spline.points.length * n_sub; i ++ ) {

			index = i / ( spline.points.length * n_sub );
			position = spline.getPoint( index );

			geometry.vertices[ i ] = new THREE.Vertex( new THREE.Vector3( position.x, position.y, position.z ) );

		}

		return geometry;

	};

	function createPath( parent, spline ) {

		var lineGeo = createSplineGeometry( spline, 10 ),
			particleGeo = createSplineGeometry( spline, 10 ),
			lineMat = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 3 } );
			lineObj = new THREE.Line( lineGeo, lineMat );
			particleObj = new THREE.ParticleSystem( particleGeo, new THREE.ParticleBasicMaterial( { color: 0xffaa00, size: 3 } ) );

		lineObj.scale.set( 1, 1, 1 );
		parent.addChild( lineObj );

		particleObj.scale.set( 1, 1, 1 );
		parent.addChild( particleObj );

		var waypoint,
			geo = new THREE.SphereGeometry( 1, 16, 8 ),
			mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

		for ( i = 0; i < spline.points.length; i++ ) {

			waypoint = new THREE.Mesh( geo, mat );
			waypoint.position.copy( spline.points[ i ] );
			waypoint.updateMatrix();
			parent.addChild( waypoint );

		}

	};

	// constructor

	this.spline = new THREE.Spline();
	this.spline.initFromArray( this.waypoints );

	if ( this.useConstantSpeed ) {

		this.spline.reparametrizeByArcLength( this.resamplingCoef );

	}

	if ( this.createDebugDummy ) {

		var dummyParentMaterial = new THREE.MeshLambertMaterial( { color: 0x0077ff } ),
		dummyChildMaterial  = new THREE.MeshLambertMaterial( { color: 0x00ff00 } ),
		dummyParentGeo = new THREE.CubeGeometry( 10, 10, 20 ),
		dummyChildGeo  = new THREE.CubeGeometry( 2, 2, 10 );

		this.animationParent = new THREE.Mesh( dummyParentGeo, dummyParentMaterial );

		var dummyChild = new THREE.Mesh( dummyChildGeo, dummyChildMaterial );
		dummyChild.position.set( 0, 10, 0 );

		this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );

		this.animationParent.addChild( this );
		this.animationParent.addChild( this.target );
		this.animationParent.addChild( dummyChild );

	} else {

		this.animation = initAnimationPath( this.animationParent, this.spline, this.id, this.duration );
		this.animationParent.addChild( this.target );
		this.animationParent.addChild( this );

	}

	if ( this.createDebugPath ) {

		createPath( this.debugPath, this.spline );

	}

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );

};

THREE.PathCamera.prototype = new THREE.Camera();
THREE.PathCamera.prototype.constructor = THREE.PathCamera;
THREE.PathCamera.prototype.supr = THREE.Camera.prototype;

THREE.PathCameraIdCounter = 0;
/**
 * @author James Baicoianu / http://www.baicoianu.com/

 * parameters = {
 *	fov: <float>,
 *	aspect: <float>,
 *	near: <float>,
 *	far: <float>,
 *	target: <THREE.Object3D>,

 *	movementSpeed: <float>,
 *	rollSpeed: <float>,

 *	noFly: <bool>,
 *	lookVertical: <bool>,
 *	autoForward: <bool>,

 *	heightSpeed: <bool>,
 *	heightCoef: <float>,
 *	heightMin: <float>,
 *	heightMax: <float>,

 *	domElement: <HTMLElement>,
 * }
 */

THREE.FlyCamera = function ( parameters ) {

	THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

	this.tmpQuaternion = new THREE.Quaternion();
	
	this.movementSpeed = 1.0;
	this.rollSpeed = 0.005;

	this.dragToLook = false;
	this.autoForward = false;
	
	this.domElement = document;

	if ( parameters ) {

		if ( parameters.movementSpeed !== undefined ) this.movementSpeed = parameters.movementSpeed;
		if ( parameters.rollSpeed !== undefined ) this.rollSpeed	= parameters.rollSpeed;

		if ( parameters.dragToLook !== undefined ) this.dragToLook = parameters.dragToLook;
		if ( parameters.autoForward !== undefined ) this.autoForward = parameters.autoForward;

		if ( parameters.domElement !== undefined ) this.domElement = parameters.domElement;

	}

	this.useTarget = false;
	this.useQuaternion = true;

	this.mouseStatus = 0;

	this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );

	this.lastUpdate = -1;
	this.tdiff = 0;

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.keydown = function( event ) {

		if ( event.altKey ) {

			return;

		}

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

			case 87: /*W*/ this.moveState.forward = 1; break;
			case 83: /*S*/ this.moveState.back = 1; break;

			case 65: /*A*/ this.moveState.left = 1; break;
			case 68: /*D*/ this.moveState.right = 1; break;

			case 82: /*R*/ this.moveState.up = 1; break;
			case 70: /*F*/ this.moveState.down = 1; break;

			case 38: /*up*/ this.moveState.pitchUp = 1; break;
			case 40: /*down*/ this.moveState.pitchDown = 1; break;

			case 37: /*left*/ this.moveState.yawLeft = 1; break;
			case 39: /*right*/ this.moveState.yawRight = 1; break;

			case 81: /*Q*/ this.moveState.rollLeft = 1; break;
			case 69: /*E*/ this.moveState.rollRight = 1; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.keyup = function( event ) {

		switch( event.keyCode ) {

			case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

			case 87: /*W*/ this.moveState.forward = 0; break;
			case 83: /*S*/ this.moveState.back = 0; break;

			case 65: /*A*/ this.moveState.left = 0; break;
			case 68: /*D*/ this.moveState.right = 0; break;

			case 82: /*R*/ this.moveState.up = 0; break;
			case 70: /*F*/ this.moveState.down = 0; break;

			case 38: /*up*/ this.moveState.pitchUp = 0; break;
			case 40: /*down*/ this.moveState.pitchDown = 0; break;

			case 37: /*left*/ this.moveState.yawLeft = 0; break;
			case 39: /*right*/ this.moveState.yawRight = 0; break;

			case 81: /*Q*/ this.moveState.rollLeft = 0; break;
			case 69: /*E*/ this.moveState.rollRight = 0; break;

		}

		this.updateMovementVector();
		this.updateRotationVector();

	};

	this.mousedown = function(event) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus ++;

		} else {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

	};

	this.mousemove = function( event ) {

		if ( !this.dragToLook || this.mouseStatus > 0 ) {

			var container = this.getContainerDimensions();
			var halfWidth  = container.size[ 0 ] / 2;
			var halfHeight = container.size[ 1 ] / 2;
			
			this.moveState.yawLeft   = - ( ( event.clientX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
			this.moveState.pitchDown =   ( ( event.clientY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;
			this.updateRotationVector();

		}

	};

	this.mouseup = function( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.dragToLook ) {

			this.mouseStatus --;

			//this.mouseX = this.mouseY = 0;
			this.moveState.yawLeft = this.moveState.pitchDown = 0;

		} else {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.updateRotationVector();

	};
	
	this.update = function( parentMatrixWorld, forceUpdate, camera ) {

		var now = new Date().getTime();
		
		if ( this.lastUpdate == -1 ) this.lastUpdate = now;
		
		this.tdiff = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;

		//this.position.addSelf( this.moveVector.multiplyScalar( tdiff ) );
		var moveMult = this.tdiff * this.movementSpeed;
		var rotMult = this.tdiff * this.rollSpeed;

		this.translateX( this.moveVector.x * moveMult );
		this.translateY( this.moveVector.y * moveMult );
		this.translateZ( this.moveVector.z * moveMult );

		this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
		this.quaternion.multiplySelf( this.tmpQuaternion );
		
		this.matrix.setPosition( this.position );
		this.matrix.setRotationFromQuaternion( this.quaternion );
		this.matrixWorldNeedsUpdate = true;

		this.supr.update.call( this );

	};

	this.updateMovementVector = function() {

		var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;
		
		this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
		this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
		this.moveVector.z = ( -forward + this.moveState.back );

		//console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

	};

	this.updateRotationVector = function() {

		this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
		this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
		this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

		//console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

	};

	this.getContainerDimensions = function() {

		if ( this.domElement != document ) {
			
			return {
				size	: [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
				offset	: [ this.domElement.offsetLeft,  this.domElement.offsetTop ] 
			};

		} else {

			return {
				size	: [ window.innerWidth, window.innerHeight ],
				offset	: [ 0, 0 ] 
			};

		}

	};

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};
	
	this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

	window.addEventListener( 'keydown', bind( this, this.keydown ), false );
	window.addEventListener( 'keyup',   bind( this, this.keyup ), false );
	
	this.updateMovementVector();
	this.updateRotationVector();	

};

THREE.FlyCamera.prototype = new THREE.Camera();
THREE.FlyCamera.prototype.constructor = THREE.FlyCamera;
THREE.FlyCamera.prototype.supr = THREE.Camera.prototype;
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  fov: <float>,
 *  aspect: <float>,
 *  near: <float>,
 *  far: <float>,

 *  movementSpeed: <float>,
 *  lookSpeed: <float>,
 *  rollSpeed: <float>,

 *  autoForward: <bool>,
 * 	mouseLook: <bool>,

 *  domElement: <HTMLElement>,
 * }
 */

THREE.RollCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this, fov, aspect, near, far );

	// API

	this.mouseLook = true;
	this.autoForward = false;

	this.lookSpeed = 1;
	this.movementSpeed = 1;
	this.rollSpeed = 1;

	this.constrainVertical = [ -0.9, 0.9 ];

	this.domElement = document;

	// disable default camera behavior

	this.useTarget = false;
	this.matrixAutoUpdate = false;

	// internals

	this.forward = new THREE.Vector3( 0, 0, 1 );
	this.roll = 0;

	this.lastUpdate = -1;
	this.delta = 0;
	
	var xTemp = new THREE.Vector3();
	var yTemp = new THREE.Vector3();
	var zTemp = new THREE.Vector3();
	var rollMatrix = new THREE.Matrix4();

	var doRoll = false, rollDirection = 1, forwardSpeed = 0, sideSpeed = 0, upSpeed = 0;

	var mouseX = 0, mouseY = 0;
	
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	// custom update

	this.update = function() {

		var now = new Date().getTime();

		if ( this.lastUpdate == -1 ) this.lastUpdate = now;
		
		this.delta = ( now - this.lastUpdate ) / 1000;
		this.lastUpdate = now;

		if ( this.mouseLook ) {
		
			var actualLookSpeed = this.delta * this.lookSpeed;
			
			this.rotateHorizontally( actualLookSpeed * mouseX );
			this.rotateVertically( actualLookSpeed * mouseY );

		}

		var actualSpeed = this.delta * this.movementSpeed;
		var forwardOrAuto = ( forwardSpeed > 0 || ( this.autoForward && ! ( forwardSpeed < 0 ) ) ) ? 1 : forwardSpeed;
		
		this.translateZ( actualSpeed * forwardOrAuto );
		this.translateX( actualSpeed * sideSpeed );
		this.translateY( actualSpeed * upSpeed );

		if( doRoll ) {
			
			this.roll += this.rollSpeed * this.delta * rollDirection;

		}
		
		// cap forward up / down
		
		if( this.forward.y > this.constrainVertical[ 1 ] ) {
			
			this.forward.y = this.constrainVertical[ 1 ];
			this.forward.normalize();
			
		} else if( this.forward.y < this.constrainVertical[ 0 ] ) {
			
			this.forward.y = this.constrainVertical[ 0 ];
			this.forward.normalize();
			
		}


		// construct unrolled camera matrix
	
		zTemp.copy( this.forward );
		yTemp.set( 0, 1, 0 );
	
		xTemp.cross( yTemp, zTemp ).normalize();
		yTemp.cross( zTemp, xTemp ).normalize();
	
		this.matrix.n11 = xTemp.x; this.matrix.n12 = yTemp.x; this.matrix.n13 = zTemp.x;
		this.matrix.n21 = xTemp.y; this.matrix.n22 = yTemp.y; this.matrix.n23 = zTemp.y;
		this.matrix.n31 = xTemp.z; this.matrix.n32 = yTemp.z; this.matrix.n33 = zTemp.z;
		
		
		// calculate roll matrix
	
		rollMatrix.identity();
		rollMatrix.n11 = Math.cos( this.roll ); rollMatrix.n12 = -Math.sin( this.roll );
		rollMatrix.n21 = Math.sin( this.roll ); rollMatrix.n22 =  Math.cos( this.roll );
	
	
		// multiply camera with roll
	
		this.matrix.multiplySelf( rollMatrix );
		this.matrixWorldNeedsUpdate = true;
	
		
		// set position
	
		this.matrix.n14 = this.position.x;
		this.matrix.n24 = this.position.y;
		this.matrix.n34 = this.position.z;
		
		
		// call supr

		this.supr.update.call( this );

	};
	
	this.translateX = function ( distance ) {
		
		this.position.x += this.matrix.n11 * distance;
		this.position.y += this.matrix.n21 * distance;
		this.position.z += this.matrix.n31 * distance;
		
	};
	
	this.translateY = function ( distance ) {
		
		this.position.x += this.matrix.n12 * distance;
		this.position.y += this.matrix.n22 * distance;
		this.position.z += this.matrix.n32 * distance;
		
	};

	this.translateZ = function ( distance ) {
	
		this.position.x -= this.matrix.n13 * distance;
		this.position.y -= this.matrix.n23 * distance;
		this.position.z -= this.matrix.n33 * distance;
	
	};
	

	this.rotateHorizontally = function ( amount ) {
		
		// please note that the amount is NOT degrees, but a scale value
		
		xTemp.set( this.matrix.n11, this.matrix.n21, this.matrix.n31 );
		xTemp.multiplyScalar( amount );

		this.forward.subSelf( xTemp );
		this.forward.normalize();
	
	};
	
	this.rotateVertically = function ( amount ) {
		
		// please note that the amount is NOT degrees, but a scale value
		
		yTemp.set( this.matrix.n12, this.matrix.n22, this.matrix.n32 );
		yTemp.multiplyScalar( amount );
		
		this.forward.addSelf( yTemp );
		this.forward.normalize();
	
	};

	function onKeyDown( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 1; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = -1; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = -1; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 1; break;

			case 81: /*Q*/ doRoll = true; rollDirection = 1; break;
			case 69: /*E*/ doRoll = true; rollDirection = -1; break;

			case 82: /*R*/ upSpeed = 1; break;
			case 70: /*F*/ upSpeed = -1; break;

		}

	};

	function onKeyUp( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ forwardSpeed = 0; break;

			case 37: /*left*/
			case 65: /*A*/ sideSpeed = 0; break;

			case 40: /*down*/
			case 83: /*S*/ forwardSpeed = 0; break;

			case 39: /*right*/
			case 68: /*D*/ sideSpeed = 0; break;

			case 81: /*Q*/ doRoll = false; break;
			case 69: /*E*/ doRoll = false; break;

			case 82: /*R*/ upSpeed = 0; break;
			case 70: /*F*/ upSpeed = 0; break;

		}

	};

	function onMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / window.innerWidth;
		mouseY = ( event.clientY - windowHalfY ) / window.innerHeight;

	};
	
	function onMouseDown ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 1; break;
			case 2: forwardSpeed = -1; break;

		}

	};

	function onMouseUp ( event ) {

		event.preventDefault();
		event.stopPropagation();

		switch ( event.button ) {

			case 0: forwardSpeed = 0; break;
			case 2: forwardSpeed = 0; break;

		}

	};
	
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', onMouseUp, false );
	this.domElement.addEventListener( 'keydown', onKeyDown, false );
	this.domElement.addEventListener( 'keyup', onKeyUp, false );	

};


THREE.RollCamera.prototype = new THREE.Camera();
THREE.RollCamera.prototype.constructor = THREE.RollCamera;
THREE.RollCamera.prototype.supr = THREE.Camera.prototype;


/**
 * @author Eberhard Graether / http://egraether.com/

 * parameters = {
 *	fov: <float>,
 *	aspect: <float>,
 *	near: <float>,
 *	far: <float>,
 *	target: <THREE.Object3D>,

 *	radius: <float>,
 *	screen: { width : <float>, height : <float>, offsetLeft : <float>, offsetTop : <float> },

 *	rotateSpeed: <float>,
 *	zoomSpeed: <float>,
 *	panSpeed: <float>,

 *	noZoom: <bool>,
 *	noPan: <bool>,

 *	staticMoving: <bool>,
 *	dynamicDampingFactor: <float>,

 *	minDistance: <float>,
 *	maxDistance: <float>,

 *	keys: <Array>, // [ rotateKey, zoomKey, panKey ],

 *	domElement: <HTMLElement>,
 * }
 */

THREE.TrackballCamera = function ( parameters ) {

	// target.position is modified when panning

	parameters = parameters || {};

	THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

	this.domElement = parameters.domElement || document;

	this.screen = parameters.screen || { width : window.innerWidth, height : window.innerHeight, offsetLeft : 0, offsetTop : 0 };
	this.radius = parameters.radius || ( this.screen.width + this.screen.height ) / 4;

	this.rotateSpeed = parameters.rotateSpeed || 1.0;
	this.zoomSpeed = parameters.zoomSpeed || 1.2;
	this.panSpeed = parameters.panSpeed || 0.3;

	this.noZoom = parameters.noZoom || false;
	this.noPan = parameters.noPan || false;

	this.staticMoving = parameters.staticMoving || false;
	this.dynamicDampingFactor = parameters.dynamicDampingFactor || 0.2;

	this.minDistance = parameters.minDistance || 0;
	this.maxDistance = parameters.maxDistance || Infinity;

	this.keys = parameters.keys || [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	this.useTarget = true;


	//internals

	var _keyPressed = false,
	_state = this.STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();


	// methods

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function( clientX, clientY ) {

		return new THREE.Vector2(
			( clientX - this.screen.offsetLeft ) / this.radius * 0.5,
			( clientY - this.screen.offsetTop ) / this.radius * 0.5
		);

	};

	this.getMouseProjectionOnBall = function( clientX, clientY ) {

		var mouseOnBall = new THREE.Vector3(
			( clientX - this.screen.width * 0.5 - this.screen.offsetLeft ) / this.radius,
			( this.screen.height * 0.5 + this.screen.offsetTop - clientY ) / this.radius,
			0.0
		);

		var length = mouseOnBall.length();

		if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye = this.position.clone().subSelf( this.target.position );

		var projection = this.up.clone().setLength( mouseOnBall.y );
		projection.addSelf( this.up.clone().crossSelf( _eye ).setLength( mouseOnBall.x ) );
		projection.addSelf( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function() {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = (new THREE.Vector3()).cross( _rotateStart, _rotateEnd ).normalize(),
			quaternion = new THREE.Quaternion();

			angle *= this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			quaternion.multiplyVector3( _eye );
			quaternion.multiplyVector3( this.up );

			quaternion.multiplyVector3( _rotateEnd );

			if ( this.staticMoving ) {

				_rotateStart = _rotateEnd;

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( this.dynamicDampingFactor - 1.0 ) );
				quaternion.multiplyVector3( _rotateStart );

			}

		}

	};

	this.zoomCamera = function() {

		var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * this.zoomSpeed;

		if ( factor !== 1.0 && factor > 0.0 ) {

			_eye.multiplyScalar( factor );

			if ( this.staticMoving ) {

				_zoomStart = _zoomEnd;

			} else {

				_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	this.panCamera = function() {

		var mouseChange = _panEnd.clone().subSelf( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * this.panSpeed );

			var pan = _eye.clone().crossSelf( this.up ).setLength( mouseChange.x );
			pan.addSelf( this.up.clone().setLength( mouseChange.y ) );

			this.position.addSelf( pan );
			this.target.position.addSelf( pan );

			if ( this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.addSelf( mouseChange.sub( _panEnd, _panStart ).multiplyScalar( this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function() {

		if ( !this.noZoom || !this.noPan ) {

			if ( this.position.lengthSq() > this.maxDistance * this.maxDistance ) {

				this.position.setLength( this.maxDistance );

			}

			if ( _eye.lengthSq() < this.minDistance * this.minDistance ) {

				this.position.add( this.target.position, _eye.setLength( this.minDistance ) );

			}

		}

	};

	this.update = function( parentMatrixWorld, forceUpdate, camera ) {

		_eye = this.position.clone().subSelf( this.target.position ),

		this.rotateCamera();

		if ( !this.noZoom ) {

			this.zoomCamera();

		}

		if ( !this.noPan ) {

			this.panCamera();

		}

		this.position.add( this.target.position, _eye );

		this.checkDistances();

		this.supr.update.call( this, parentMatrixWorld, forceUpdate, camera );

	};


	// listeners

	function keydown( event ) {

		if ( _state !== this.STATE.NONE ) {

			return;

		} else if ( event.keyCode === this.keys[ this.STATE.ROTATE ] ) {

			_state = this.STATE.ROTATE;

		} else if ( event.keyCode === this.keys[ this.STATE.ZOOM ] && !this.noZoom ) {

			_state = this.STATE.ZOOM;

		} else if ( event.keyCode === this.keys[ this.STATE.PAN ] && !this.noPan ) {

			_state = this.STATE.PAN;

		}

		if ( _state !== this.STATE.NONE ) {

			_keyPressed = true;

		}

	};

	function keyup( event ) {

		if ( _state !== this.STATE.NONE ) {

			_state = this.STATE.NONE;

		}

	};

	function mousedown(event) {

		event.preventDefault();
		event.stopPropagation();

		if ( _state === this.STATE.NONE ) {

			_state = event.button;

			if ( _state === this.STATE.ROTATE ) {

				_rotateStart = _rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

			} else if ( _state === this.STATE.ZOOM && !this.noZoom ) {

				_zoomStart = _zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			} else if ( !this.noPan ) {

				_panStart = _panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			}

		}

	};

	function mousemove( event ) {

		if ( _keyPressed ) {

			_rotateStart = _rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_zoomStart = _zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );
			_panStart = _panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

			_keyPressed = false;

		}

		if ( _state === this.STATE.NONE ) {

			return;

		} else if ( _state === this.STATE.ROTATE ) {

			_rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === this.STATE.ZOOM && !this.noZoom ) {

			_zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

		} else if ( _state === this.STATE.PAN && !this.noPan ) {

			_panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

		}

	};

	function mouseup( event ) {

		event.preventDefault();
		event.stopPropagation();

		_state = this.STATE.NONE;

	};
	
	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, mousemove ), false );
	this.domElement.addEventListener( 'mousedown', bind( this, mousedown ), false );
	this.domElement.addEventListener( 'mouseup',   bind( this, mouseup ), false );

	window.addEventListener( 'keydown', bind( this, keydown ), false );
	window.addEventListener( 'keyup',   bind( this, keyup ), false );

};

THREE.TrackballCamera.prototype = new THREE.Camera();
THREE.TrackballCamera.prototype.constructor = THREE.TrackballCamera;
THREE.TrackballCamera.prototype.supr = THREE.Camera.prototype;

THREE.TrackballCamera.prototype.STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };
/**
 * @author chriskillpack / http://chriskillpack.com/
 *
 * QuakeCamera has been renamed FirstPersonCamera. This property exists for backwards
 * compatibility only.
 */
THREE.QuakeCamera = THREE.FirstPersonCamera;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.CubeGeometry = function ( width, height, depth, segmentsWidth, segmentsHeight, segmentsDepth, materials, flipped, sides ) {

	THREE.Geometry.call( this );

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2,
	flip = flipped ? - 1 : 1;

	if ( materials !== undefined ) {

		if ( materials instanceof Array ) {

			this.materials = materials;

		} else {

			this.materials = [];

			for ( var i = 0; i < 6; i ++ ) {

				this.materials.push( [ materials ] );

			}

		}

	} else {

		this.materials = [];

	}

	this.sides = { px: true, nx: true, py: true, ny: true, pz: true, nz: true };

	if( sides != undefined ) {

		for( var s in sides ) {

			if ( this.sides[ s ] != undefined ) {

				this.sides[ s ] = sides[ s ];

			}

		}

	}

	this.sides.px && buildPlane( 'z', 'y',   1 * flip, - 1, depth, height, - width_half, this.materials[ 0 ] ); // px
	this.sides.nx && buildPlane( 'z', 'y', - 1 * flip, - 1, depth, height, width_half, this.materials[ 1 ] );   // nx
	this.sides.py && buildPlane( 'x', 'z',   1 * flip,   1, width, depth, height_half, this.materials[ 2 ] );   // py
	this.sides.ny && buildPlane( 'x', 'z',   1 * flip, - 1, width, depth, - height_half, this.materials[ 3 ] ); // ny
	this.sides.pz && buildPlane( 'x', 'y',   1 * flip, - 1, width, height, depth_half, this.materials[ 4 ] );   // pz
	this.sides.nz && buildPlane( 'x', 'y', - 1 * flip, - 1, width, height, - depth_half, this.materials[ 5 ] ); // nz

	mergeVertices();

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var w, ix, iy,
		gridX = segmentsWidth || 1,
		gridY = segmentsHeight || 1,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u == 'x' && v == 'y' ) || ( u == 'y' && v == 'x' ) ) {

			w = 'z';

		} else if ( ( u == 'x' && v == 'z' ) || ( u == 'z' && v == 'x' ) ) {

			w = 'y';
			gridY = segmentsDepth || 1;

		} else if ( ( u == 'z' && v == 'y' ) || ( u == 'y' && v == 'z' ) ) {

			w = 'x';
			gridX = segmentsDepth || 1;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY;

		for( iy = 0; iy < gridY1; iy++ ) {

			for( ix = 0; ix < gridX1; ix++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for( iy = 0; iy < gridY; iy++ ) {

			for( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				scope.faces.push( new THREE.Face4( a + offset, b + offset, c + offset, d + offset, null, null, material ) );
				scope.faceVertexUvs[ 0 ].push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}

	function mergeVertices() {

		var unique = [], changes = [];

		for ( var i = 0, il = scope.vertices.length; i < il; i ++ ) {

			var v = scope.vertices[ i ],
			duplicate = false;

			for ( var j = 0, jl = unique.length; j < jl; j ++ ) {

				var vu = unique[ j ];

				if( v.position.x == vu.position.x && v.position.y == vu.position.y && v.position.z == vu.position.z ) {

					changes[ i ] = j;
					duplicate = true;
					break;

				}

			}

			if ( ! duplicate ) {

				changes[ i ] = unique.length;
				unique.push( new THREE.Vertex( v.position.clone() ) );

			}

		}

		for ( i = 0, il = scope.faces.length; i < il; i ++ ) {

			var face = scope.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];
			face.d = changes[ face.d ];

		}

		scope.vertices = unique;

	}

	this.computeCentroids();
	this.computeFaceNormals();

};

THREE.CubeGeometry.prototype = new THREE.Geometry();
THREE.CubeGeometry.prototype.constructor = THREE.CubeGeometry;
/**
 * @author kile / http://kile.stravaganza.org/
 * @author mr.doob / http://mrdoob.com/
 * @author fuzzthink
 */

THREE.CylinderGeometry = function ( numSegs, topRad, botRad, height, topOffset, botOffset ) {

	THREE.Geometry.call( this );

	var scope = this, i, PI2 = Math.PI * 2, halfHeight = height / 2;

	// Top circle vertices

	for ( i = 0; i < numSegs; i ++ ) {

		v( Math.sin( PI2 * i / numSegs ) * topRad, Math.cos( PI2 * i / numSegs ) * topRad, - halfHeight );

	}

	// Bottom circle vertices

	for ( i = 0; i < numSegs; i ++ ) {

		v( Math.sin( PI2 * i / numSegs ) * botRad, Math.cos( PI2 * i / numSegs ) * botRad, halfHeight );

	}

	// Body faces

	for ( i = 0; i < numSegs; i++ ) {

		f4(
			i,
			i + numSegs,
			numSegs + ( i + 1 ) % numSegs,
			( i + 1 ) % numSegs
		);

	}

	// Bottom circle faces

	if ( botRad > 0 ) {

		v( 0, 0, - halfHeight - ( botOffset || 0 ) );

		for ( i = numSegs; i < numSegs + ( numSegs / 2 ); i++ ) {

			f4(
				2 * numSegs,
				( 2 * i - 2 * numSegs ) % numSegs,
				( 2 * i - 2 * numSegs + 1 ) % numSegs,
				( 2 * i - 2 * numSegs + 2 ) % numSegs
			);

		}

	}

	// Top circle faces

	if ( topRad > 0 ) {

		v( 0, 0, halfHeight + ( topOffset || 0 ) );

		for ( i = numSegs + ( numSegs / 2 ); i < 2 * numSegs; i ++ ) {

			f4(
				2 * numSegs + 1,
				( 2 * i - 2 * numSegs + 2 ) % numSegs + numSegs,
				( 2 * i - 2 * numSegs + 1 ) % numSegs + numSegs,
				( 2 * i - 2 * numSegs ) % numSegs + numSegs
			);

		}

	}

	// Cylindrical mapping

	for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

		var uvs = [], face = this.faces[ i ],
		a = this.vertices[ face.a ],
		b = this.vertices[ face.b ],
		c = this.vertices[ face.c ],
		d = this.vertices[ face.d ];

		uvs.push( new THREE.UV( 0.5 + Math.atan2( a.position.x, a.position.y ) / PI2, 0.5 + ( a.position.z / height ) ) );
		uvs.push( new THREE.UV( 0.5 + Math.atan2( b.position.x, b.position.y ) / PI2, 0.5 + ( b.position.z / height ) ) );
		uvs.push( new THREE.UV( 0.5 + Math.atan2( c.position.x, c.position.y ) / PI2, 0.5 + ( c.position.z / height ) ) );

		if ( face instanceof THREE.Face4 ) {

			uvs.push( new THREE.UV( 0.5 + ( Math.atan2( d.position.x, d.position.y ) / PI2 ), 0.5 + ( d.position.z / height ) ) );

		}

		this.faceVertexUvs[ 0 ].push( uvs );

	}

	this.computeCentroids();
	this.computeFaceNormals();
	// this.computeVertexNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f4( a, b, c, d ) {

		scope.faces.push( new THREE.Face4( a, b, c, d ) );

	}

};

THREE.CylinderGeometry.prototype = new THREE.Geometry();
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;
/**
 * @author oosmoxiecode

 * uvs are messed up in this one, and commented away for now. There is an ugly "seam" by the shared vertices
 * when it "wraps" around, that needs to be fixed. It´s because they share the first and the last vertices
 * so it draws the entire texture on the seam-faces, I think...
 */

THREE.IcosahedronGeometry = function ( subdivisions ) {

	var scope = this;
	var tempScope = new THREE.Geometry();
	var tempFaces;
	this.subdivisions = subdivisions || 0;

	//var temp_uv = [];

	THREE.Geometry.call(this);

	// create 12 vertices of a Icosahedron
	var t = (1 + Math.sqrt(5)) / 2;

	v(-1,  t,  0);
	v( 1,  t,  0);
	v(-1, -t,  0);
	v( 1, -t,  0);

	v( 0, -1,  t);
	v( 0,  1,  t);
	v( 0, -1, -t);
	v( 0,  1, -t);

	v( t,  0, -1);
	v( t,  0,  1);
	v(-t,  0, -1);
	v(-t,  0,  1);

	// 5 faces around point 0
	f3(0, 11, 5, tempScope);
	f3(0, 5, 1, tempScope);
	f3(0, 1, 7, tempScope);
	f3(0, 7, 10, tempScope);
	f3(0, 10, 11, tempScope);

	// 5 adjacent faces
	f3(1, 5, 9, tempScope);
	f3(5, 11, 4, tempScope);
	f3(11, 10, 2, tempScope);
	f3(10, 7, 6, tempScope);
	f3(7, 1, 8, tempScope);

	// 5 faces around point 3
	f3(3, 9, 4, tempScope);
	f3(3, 4, 2, tempScope);
	f3(3, 2, 6, tempScope);
	f3(3, 6, 8, tempScope);
	f3(3, 8, 9, tempScope);

	// 5 adjacent faces
	f3(4, 9, 5, tempScope);
	f3(2, 4, 11, tempScope);
	f3(6, 2, 10, tempScope);
	f3(8, 6, 7, tempScope);
	f3(9, 8, 1, tempScope);

	// subdivide faces to refine the triangles
	for (var i=0; i < this.subdivisions; i++) {
		tempFaces = new THREE.Geometry();
		for (var tri in tempScope.faces) {
			// replace each triangle by 4 triangles
			var a = getMiddlePoint(tempScope.faces[tri].a, tempScope.faces[tri].b);
			var b = getMiddlePoint(tempScope.faces[tri].b, tempScope.faces[tri].c);
			var c = getMiddlePoint(tempScope.faces[tri].c, tempScope.faces[tri].a);

			f3(tempScope.faces[tri].a, a, c, tempFaces);
			f3(tempScope.faces[tri].b, b, a, tempFaces);
			f3(tempScope.faces[tri].c, c, b, tempFaces);
			f3(a, b, c, tempFaces);
		}
		tempScope.faces = tempFaces.faces;
		//tempScope.uvs = tempFaces.uvs;
	}

	scope.faces = tempScope.faces;
	//scope.uvs = tempScope.uvs;

	delete tempScope;
	delete tempFaces;

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function v( x, y, z ) {
		var length = Math.sqrt(x * x + y * y + z * z);
		var i = scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x/length, y/length, z/length ) ) );

		//var uv = getUv(x, y, z);
		//temp_uv.push(uv);

		return i-1;
	}

	function f3( a, b, c, inscope ) {
		inscope.faces.push( new THREE.Face3( a, b, c ) );

		/*inscope.uvs.push( [new THREE.UV( temp_uv[a].u, temp_uv[a].v ),
						   new THREE.UV( temp_uv[b].u, temp_uv[b].v ),
						   new THREE.UV( temp_uv[c].u, temp_uv[c].v )
						  ] );
		*/
	}

	function getMiddlePoint(p1,p2) {
		var pos1 = scope.vertices[p1].position;
		var pos2 = scope.vertices[p2].position;

		var x = (pos1.x + pos2.x) / 2;
		var y = (pos1.y + pos2.y) / 2;
		var z = (pos1.z + pos2.z) / 2;

		var i = v(x, y, z);
		return i;
	}

	/*function getUv(x,y,z) {

		var u,v;
		var px,py,pz,d;

		d = Math.sqrt( x*x+y*y+z*z );

		px = x/d;
		py = y/d;
		pz = z/d;

		var normalisedX = 0;
		var normalisedZ = -1;

		if (((px * px) + (pz * pz)) > 0) {
			normalisedX = Math.sqrt((px * px) / ((px * px) + (pz * pz)));

			if (px < 0) {
				normalisedX = -normalisedX;
			}

			normalisedZ = Math.sqrt((pz * pz) / ((px * px) + (pz * pz)));

			if (pz < 0)	{
				normalisedZ = -normalisedZ;
			}
		}

		if (normalisedZ == 0) {
			u = ((normalisedX * Math.PI) / 2);
		} else {
			u = Math.atan(normalisedX / normalisedZ);

			if (normalisedZ < 0) {
				u += Math.PI;
			}
		}

		if (u < 0) {
			u += 2 * Math.PI;
		}

		u /= 2 * Math.PI;
		v = (-py + 1) / 2;

		return {u:u,v:v};
	}*/

}

THREE.IcosahedronGeometry.prototype = new THREE.Geometry();
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;
/**
 * @author astrodud / http://astrodud.isgreat.org/
 */

THREE.LatheGeometry = function ( points, steps, angle ) {

	THREE.Geometry.call( this );

	this.steps = steps || 12;
	this.angle = angle || 2 * Math.PI;

	var stepSize = this.angle / this.steps,
	newV = [], oldInds = [], newInds = [], startInds = [],
	matrix = new THREE.Matrix4().setRotationZ( stepSize );

	for ( var j = 0; j < points.length; j ++ ) {

		this.vertices.push( new THREE.Vertex( points[ j ] ) );

		newV[ j ] = points[ j ].clone();
		oldInds[ j ] = this.vertices.length - 1;

	}

	for ( var r = 0; r <= this.angle + 0.001; r += stepSize ) { // need the +0.001 for it go up to angle

		for ( var j = 0; j < newV.length; j ++ ) {

			if ( r < this.angle ) {

				newV[ j ] = matrix.multiplyVector3( newV[ j ].clone() );
				this.vertices.push( new THREE.Vertex( newV[ j ] ) );
				newInds[ j ] = this.vertices.length - 1;

			} else {

				newInds = startInds; // wrap it up!

			}

		}

		if ( r == 0 ) startInds = oldInds;

		for ( var j = 0; j < oldInds.length - 1; j ++ ) {

			this.faces.push( new THREE.Face4( newInds[ j ], newInds[ j + 1 ], oldInds[ j + 1 ], oldInds[ j ] ) );
			this.faceVertexUvs[ 0 ].push( [

				new THREE.UV( 1 - r / this.angle, j / points.length ),
				new THREE.UV( 1 - r / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, ( j + 1 ) / points.length ),
				new THREE.UV( 1 - ( r - stepSize ) / this.angle, j / points.length )

			] );

		}

		oldInds = newInds;
		newInds = [];

	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.LatheGeometry.prototype = new THREE.Geometry();
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneGeometry = function ( width, height, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var ix, iy,
	width_half = width / 2,
	height_half = height / 2,
	gridX = segmentsWidth || 1,
	gridY = segmentsHeight || 1,
	gridX1 = gridX + 1,
	gridY1 = gridY + 1,
	segment_width = width / gridX,
	segment_height = height / gridY;


	for( iy = 0; iy < gridY1; iy++ ) {

		for( ix = 0; ix < gridX1; ix++ ) {

			var x = ix * segment_width - width_half;
			var y = iy * segment_height - height_half;

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, - y, 0 ) ) );

		}

	}

	for( iy = 0; iy < gridY; iy++ ) {

		for( ix = 0; ix < gridX; ix++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [
						new THREE.UV( ix / gridX, iy / gridY ),
						new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
						new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
					] );

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

};

THREE.PlaneGeometry.prototype = new THREE.Geometry();
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;
/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Sphere.as
 */

THREE.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var radius = radius || 50,
	gridX = segmentsWidth || 8,
	gridY = segmentsHeight || 6;

	var i, j, pi = Math.PI;
	var iHor = Math.max( 3, gridX );
	var iVer = Math.max( 2, gridY );
	var aVtc = [];

	for ( j = 0; j < ( iVer + 1 ) ; j++ ) {

		var fRad1 = j / iVer;
		var fZ = radius * Math.cos( fRad1 * pi );
		var fRds = radius * Math.sin( fRad1 * pi );
		var aRow = [];
		var oVtx = 0;

		for ( i = 0; i < iHor; i++ ) {

			var fRad2 = 2 * i / iHor;
			var fX = fRds * Math.sin( fRad2 * pi );
			var fY = fRds * Math.cos( fRad2 * pi );

			if ( !( ( j == 0 || j == iVer ) && i > 0 ) ) {

				oVtx = this.vertices.push( new THREE.Vertex( new THREE.Vector3( fY, fZ, fX ) ) ) - 1;

			}

			aRow.push( oVtx );

		}

		aVtc.push( aRow );

	}

	var n1, n2, n3, iVerNum = aVtc.length;

	for ( j = 0; j < iVerNum; j++ ) {

		var iHorNum = aVtc[ j ].length;

		if ( j > 0 ) {

			for ( i = 0; i < iHorNum; i++ ) {

				var bEnd = i == ( iHorNum - 1 );
				var aP1 = aVtc[ j ][ bEnd ? 0 : i + 1 ];
				var aP2 = aVtc[ j ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP3 = aVtc[ j - 1 ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP4 = aVtc[ j - 1 ][ bEnd ? 0 : i + 1 ];

				var fJ0 = j / ( iVerNum - 1 );
				var fJ1 = ( j - 1 ) / ( iVerNum - 1 );
				var fI0 = ( i + 1 ) / iHorNum;
				var fI1 = i / iHorNum;

				var aP1uv = new THREE.UV( 1 - fI0, fJ0 );
				var aP2uv = new THREE.UV( 1 - fI1, fJ0 );
				var aP3uv = new THREE.UV( 1 - fI1, fJ1 );
				var aP4uv = new THREE.UV( 1 - fI0, fJ1 );

				if ( j < ( aVtc.length - 1 ) ) {

					n1 = this.vertices[ aP1 ].position.clone();
					n2 = this.vertices[ aP2 ].position.clone();
					n3 = this.vertices[ aP3 ].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP2, aP3, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP2uv, aP3uv ] );

				}

				if ( j > 1 ) {

					n1 = this.vertices[aP1].position.clone();
					n2 = this.vertices[aP3].position.clone();
					n3 = this.vertices[aP4].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP3, aP4, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP3uv, aP4uv ] );

				}

			}
		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	this.boundingSphere = { radius: radius };

};

THREE.SphereGeometry.prototype = new THREE.Geometry();
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For creating 3D text geometry in three.js
 *
 * Text = 3D Text
 *
 * parameters = {
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bezelEnabled:	<bool>,			// turn on bezel
 *  bezelThickness: <float>, 		// how deep into text bezel goes
 *  bezelSize:		<float>, 		// how far from text outline is bezel
 *  }
 *  
 * It uses techniques used in
 * 
 * 	typeface.js and canvastext
 * 		For converting fonts and rendering with javascript 
 *		http://typeface.neocracy.org
 * 
 *	Triangulation ported from AS3
 *		Simple Polygon Triangulation
 *		http://actionsnippet.com/?p=1462
 *
 * 	A Method to triangulate shapes with holes 
 *		http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/
 *
 */
 
THREE.TextGeometry = function ( text, parameters ) {

	THREE.Geometry.call( this );

	this.parameters = parameters || {};
	this.set( text );

};

THREE.TextGeometry.prototype = new THREE.Geometry();
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;

THREE.TextGeometry.prototype.set = function ( text, parameters ) {

	this.text = text;
	var parameters = parameters || this.parameters;

	var size = parameters.size !== undefined ? parameters.size : 100;
	var height = parameters.height !== undefined ? parameters.height : 50;
	var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments: 4;

	var font = parameters.font !== undefined ? parameters.font : "helvetiker";
	var weight = parameters.weight !== undefined ? parameters.weight : "normal";
	var style = parameters.style !== undefined ? parameters.style : "normal";

	var bezelThickness = parameters.bezelThickness !== undefined ? parameters.bezelThickness : 10;
	var bezelSize = parameters.bezelSize !== undefined ? parameters.bezelSize : 8;
	var bezelEnabled = parameters.bezelEnabled !== undefined ? parameters.bezelEnabled : false;

	THREE.FontUtils.size = size;
	THREE.FontUtils.divisions = curveSegments;

	THREE.FontUtils.face = font;
	THREE.FontUtils.weight = weight;
	THREE.FontUtils.style = style;

	THREE.FontUtils.bezelSize = bezelSize;

	// Get a Font data json object

	var data = THREE.FontUtils.drawText( text );

	var vertices = data.points;
	var faces = data.faces;
	var contour = data.contour;
	var bezelPoints = data.bezel;

	var scope = this;

	scope.vertices = [];
	scope.faces = [];

	var i, 
		vert, vlen = vertices.length, 
		face, flen = faces.length,
		bezelPt, blen = bezelPoints.length;

	// Back facing vertices

	for ( i = 0; i < vlen; i++ ) {

		vert = vertices[ i ];
		v( vert.x, vert.y, 0 );

	}

	// Front facing vertices

	for ( i = 0; i < vlen; i++ ) {
	
		vert = vertices[ i ];
		v( vert.x, vert.y, height );

	}

	if ( bezelEnabled ) {

		for ( i = 0; i < blen; i++ ) {

			bezelPt = bezelPoints[ i ];
			v( bezelPt.x, bezelPt.y, bezelThickness );

		}

		for ( i = 0; i < blen; i++ ) {

			bezelPt = bezelPoints[ i ];
			v( bezelPt.x, bezelPt.y, height - bezelThickness );

		}

	}

	// Bottom faces

	for ( i = 0; i < flen; i++ ) {

		face = faces[ i ];
		f3( face[ 2 ], face[ 1 ], face[ 0 ] );

	}

	// Top faces

	for ( i = 0; i < flen; i++ ) {

		face = faces[ i ];
		f3( face[ 0 ] + vlen, face[ 1 ] + vlen, face[ 2 ] + vlen );

	}

	var lastV;
	var j, k, l, m;

	if ( bezelEnabled ) {

		i = bezelPoints.length;

		while ( --i > 0 ) {

			if ( !lastV ) {

				lastV = contour[ i ];

			} else if ( lastV.equals( contour[ i ] ) ) {

				// We reached the last point of a closed loop

				lastV = null;
				continue;

			}

			l = vlen * 2 + i;
			m = l - 1;

			// Create faces for the z-sides of the text

			f4( l, m, m + blen, l + blen );

			for ( j = 0; j < vlen; j++ ) {

				if ( vertices[ j ].equals( contour[ i ] ) ) break;

			}

			for ( k = 0; k < vlen; k++ ) {

				if ( vertices[ k ].equals( contour[ i - 1 ] ) ) break;

			}

			// Create faces for the z-sides of the text

			f4( j, k, m, l );
			f4( l + blen, m + blen, k + vlen, j + vlen );

		}

	} else {

		i = contour.length;

		while ( --i > 0 ) {

			if ( !lastV ) {

				lastV = contour[ i ];

			} else if ( lastV.equals( contour[ i ] ) ) {

				// We reached the last point of a closed loop

				lastV = null;
				continue;

			}

			for ( j = 0; j < vlen; j++ ) {

				if ( vertices[ j ].equals( contour[ i ] ) ) break;

			}

			for ( k = 0; k < vlen; k++ ) {

				if ( vertices[ k ].equals( contour[ i - 1 ] ) ) break;

			}

			// Create faces for the z-sides of the text

			f4( j, k, k + vlen, j + vlen );

		}
	}


	// UVs to be added

	this.computeCentroids();
	this.computeFaceNormals();
	//this.computeVertexNormals();

	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	}

	function f3( a, b, c ) {

		scope.faces.push( new THREE.Face3( a, b, c) );

	}

	function f4( a, b, c, d ) {

		scope.faces.push( new THREE.Face4( a, b, c, d) );

	}


};

THREE.FontUtils = {

	faces : {},

	// Just for now. face[weight][style]

	face : "helvetiker",
	weight: "normal",
	style : "normal",
	size : 150,
	divisions : 10,

	getFace : function() {

		return this.faces[ this.face ][ this.weight ][ this.style ];

	},

	loadFace : function( data ) {

		var family = data.familyName.toLowerCase();

		var ThreeFont = this;

		ThreeFont.faces[ family ] = ThreeFont.faces[ family ] || {};
	
		ThreeFont.faces[ family ][ data.cssFontWeight ] = ThreeFont.faces[ family ][ data.cssFontWeight ] || {};
		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		var face = ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		return data;

	},


	extractPoints : function( allPoints, charactersPoints ) {

		// Quick exit

		if ( allPoints.length < 3 ) {

			//throw "not valid polygon";

			console.log( "not valid polygon" );

			return {

				points: allPoints,
				faces: []

			};

		}

		// Try to split shapes and holes.

		var p, point, shape,
			all,
			ch, singleCharPoints,
			isolatedShapes = [];

		// Use a quick hashmap for locating duplicates

		for ( var c = 0; c < charactersPoints.length; c ++ ) {

			singleCharPoints = charactersPoints[ c ];

			all = [];

			// Use a quick hashmap for locating duplicates

			for ( var p = 0; p < singleCharPoints.length; p ++ ) {

				point = singleCharPoints[ p ];
				all.push( point.x + "," + point.y );

			}

			var firstIndex, firstPt, endPt, holes;

			// We check the first loop whether its CW or CCW direction to determine
			// whether its shapes or holes first

			endPt = all.slice( 1 ).indexOf( all[ 0 ] );
			var shapesFirst = this.Triangulate.area( singleCharPoints.slice( 0, endPt + 1 ) ) < 0;

			//console.log( singleCharPoints.length, "shapesFirst", shapesFirst );

			holes = [];
			endPt = -1;

			while ( endPt < all.length ) {

				firstIndex = endPt + 1;
				firstPt = all[ firstIndex ];
				endPt = all.slice( firstIndex + 1 ).indexOf( firstPt ) + firstIndex;

				if ( endPt <= firstIndex ) break; 

				var contours = singleCharPoints.slice( firstIndex, endPt + 1 );

				if ( shapesFirst ) {

					if ( this.Triangulate.area( contours ) < 0 ) {

						// we got new isolated shape

						if ( firstIndex > 0 ) {

							isolatedShapes.push( { shape: shape, holes: holes } );

						}

						// Save the old shapes, then work on new additional separated shape

						shape = contours;
						holes = [];

					} else {

						holes.push( contours );

					}

				} else {

					if ( this.Triangulate.area( contours ) < 0 ) {

						isolatedShapes.push( { shape: contours, holes: holes } );
						holes = [];

					} else {

						holes.push( contours );

					}

				}

				endPt++;

			}

			if ( shapesFirst ) {

				isolatedShapes.push( { shape: shape, holes: holes } );

			}

		}

		//console.log("isolatedShapes", isolatedShapes);

		/* For each isolated shape, find the closest points and break to the hole to allow triangulation*/

		// Find closest points between holes

		// we could optimize with
		// http://en.wikipedia.org/wiki/Proximity_problems
		// http://en.wikipedia.org/wiki/Closest_pair_of_points
		// http://stackoverflow.com/questions/1602164/shortest-distance-between-points-algorithm

		var prevShapeVert, nextShapeVert,
			prevHoleVert, nextHoleVert,
			holeIndex, shapeIndex,
			shapeId, shapeGroup,
			h, h2,
			hole, shortest, d,
			p, pts1, pts2,
			tmpShape1, tmpShape2,
			tmpHole1, tmpHole2,
			verts = [];

		for ( shapeId = 0; shapeId < isolatedShapes.length; shapeId ++ ) {

			shapeGroup = isolatedShapes[ shapeId ];

			shape = shapeGroup.shape;
			holes = shapeGroup.holes;

			for ( h = 0; h < holes.length; h++ ) {

				// we slice to each hole when neccessary

				hole = holes[ h ];
				shortest = Number.POSITIVE_INFINITY;

				for ( h2 = 0; h2 < hole.length; h2++ ) {

					pts1 = hole[ h2 ];

					for ( p = 0; p < shape.length; p++ ) {

						pts2 = shape[ p ];
						d = pts1.distanceTo( pts2 );

						if ( d < shortest ) {

							shortest = d;
							holeIndex = h2;
							shapeIndex = p;

						}

					}

				}

				prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
				nextShapeVert = ( shapeIndex + 1 ) < shape.length ? shapeIndex + 1 : 0;

				prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1; 
				nextHoleVert = ( holeIndex + 1 ) < hole.length ? holeIndex + 1 : 0 ;

				var areaapts = [];
				areaapts.push( hole[ holeIndex ] );
				areaapts.push( shape[ shapeIndex ] );
				areaapts.push( shape[ prevShapeVert ] );

				var areaa = this.Triangulate.area( areaapts );

				var areabpts = [];
				areabpts.push( hole[ holeIndex ] );
				areabpts.push( hole[ prevHoleVert ] );
				areabpts.push( shape[ shapeIndex ] );

				var areab = this.Triangulate.area( areabpts );

				var shapeOffset =1;
				var holeOffset = -1;

				var oldShapeIndex = shapeIndex, oldHoleIndex = holeIndex;
				shapeIndex += shapeOffset;
				holeIndex += holeOffset;
				
				if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
				shapeIndex %= shape.length;

				if ( holeIndex < 0 ) { holeIndex += hole.length;  }
				holeIndex %= shape.length;

				prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
				nextShapeVert = ( shapeIndex + 1 ) < shape.length ? shapeIndex + 1 : 0;

				prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1; 
				nextHoleVert = ( holeIndex + 1 ) < hole.length ? holeIndex + 1 : 0 ;


				areaapts = [];
				areaapts.push( hole[ holeIndex ] );
				areaapts.push( shape[ shapeIndex ] );
				areaapts.push( shape[ prevShapeVert ] );

				var areaa2 = this.Triangulate.area( areaapts );

				areabpts = [];
				areabpts.push( hole[ holeIndex ] );
				areabpts.push( hole[ prevHoleVert ] );
				areabpts.push( shape[ shapeIndex ] );

				var areab2 = this.Triangulate.area( areabpts );

				if ( ( areaa + areab ) > ( areaa2 + areab2 ) ) {

					shapeIndex = oldShapeIndex;
					holeIndex = oldHoleIndex ;

					if ( shapeIndex < 0 ) { shapeIndex += shape.length;  }
					shapeIndex %= shape.length;

					if ( holeIndex < 0 ) { holeIndex += hole.length;  }
					holeIndex %= shape.length;


					prevShapeVert = ( shapeIndex - 1 ) >= 0 ? shapeIndex - 1 : shape.length - 1;
					nextShapeVert = ( shapeIndex + 1 ) < shape.length ? shapeIndex + 1 : 0;

					prevHoleVert = ( holeIndex - 1 ) >= 0 ? holeIndex - 1 : hole.length - 1; 
					nextHoleVert = ( holeIndex + 1 ) < hole.length ? holeIndex + 1 : 0 ;

				}

				tmpShape1 = shape.slice( 0, shapeIndex );
				tmpShape2 = shape.slice( shapeIndex );
				tmpHole1 = hole.slice( holeIndex );
				tmpHole2 = hole.slice( 0, holeIndex );

				verts.push( hole[ holeIndex ] );
				verts.push( shape[ shapeIndex ] );
				verts.push( shape[ prevShapeVert ] );

				verts.push( hole[ holeIndex ] );
				verts.push( hole[ prevHoleVert ] );
				verts.push( shape[ shapeIndex ] );

				shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

			}

			shapeGroup.shape = shape;

		}
	
		var triangulatedPoints = [];
		var triangulatedFaces = [];
		var lastTriangles = 0;

		for ( shapeId = 0; shapeId < isolatedShapes.length; shapeId ++ ) {

			shapeGroup = isolatedShapes[ shapeId ];

			shape = shapeGroup.shape;
			triangulatedPoints = triangulatedPoints.concat( shape );

			var triangles = THREE.FontUtils.Triangulate( shape, true );

			// We need to offset vertex indices for faces

			for ( var v = 0; v < triangles.length; v++ ) {

				var face = triangles[ v ];

				face[ 0 ] += lastTriangles;
				face[ 1 ] += lastTriangles;
				face[ 2 ] += lastTriangles;

			}

			triangulatedFaces = triangulatedFaces.concat( triangles );
			lastTriangles += shape.length;

		}
  

		// Now we push the "cut" vertices back to the triangulated indices.

		//console.log("we have verts.length",verts.length,verts);

		var v, j, k, l, found, face;

		for ( v = 0; v < verts.length / 3; v++ ) {

			face = [];

			for ( k = 0; k < 3; k++ ) {

				found = false;

				for ( j = 0; j < triangulatedPoints.length && !found; j++ ) {

					l = v * 3 + k;

					if ( triangulatedPoints[ j ].equals( verts[ l ] ) ) {

						face.push( j );
						found = true;

					}

				}

				// you would not wish to reach this point of code, something went wrong

				if ( !found ) {

					triangulatedPoints.push( verts[ l ] );
					face.push( triangulatedPoints.length - 1 );

					console.log( "not found" )

				}

			}

			triangulatedFaces.push( face );

		}


		//console.log( "triangles", triangulatedFaces.length, "points", triangulatedPoints );

		return {

			points: triangulatedPoints,
			faces: triangulatedFaces

		};

	},

	drawText : function( text ) {

		var characterPts = [], allPts = [];

		// RenderText

		var i, p,
			face = this.getFace(),
			scale = this.size / face.resolution,
			offset = 0, 
			chars = String( text ).split( '' ), 
			length = chars.length;

		for ( i = 0; i < length; i++ ) {

			var ret = this.extractGlyphPoints( chars[ i ], face, scale, offset );
			offset += ret.offset;
			characterPts.push( ret.points );
			allPts = allPts.concat( ret.points );

		}

		// get the width 

		var width = offset / 2;

		for ( p = 0; p < allPts.length; p++ ) {

			allPts[ p ].x -= width;

		}

		var extract = this.extractPoints( allPts, characterPts );
		extract.contour = allPts;

		var bezelPoints = [];

		var centroids = [], forCentroids = [], expandOutwards = [], sum = new THREE.Vector2(), lastV;

		i = allPts.length;

		while ( --i >= 0 ) {

			if ( !lastV ) {

				lastV = allPts[ i ];

			} else if ( lastV.equals( allPts[ i ] ) ) {

				// We reached the last point of a closed loop

				lastV = null;

				var bool = this.Triangulate.area( forCentroids ) > 0;
				expandOutwards.push( bool );
				centroids.push( sum.divideScalar( forCentroids.length ) );
				forCentroids = [];

				sum = new THREE.Vector2();
				continue;

			}

			sum.addSelf( allPts[ i ] );
			forCentroids.push( allPts[ i ] );

		}


		i = allPts.length;
		p = 0;
		var pt, centroid ;
		var dirV, adj;

		while ( --i >= 0 ) {

			pt = allPts[ i ];
			centroid = centroids[ p ];

			dirV = pt.clone().subSelf( centroid );
			adj = this.bezelSize / dirV.length();

			if ( expandOutwards[ p ] ) {

				adj += 1;

			}  else {

				adj = 1 - adj;

			}

			adj = dirV.multiplyScalar( adj ).addSelf( centroid );
			bezelPoints.unshift( adj );


			if ( !lastV ) {

				lastV = allPts[ i ];

			} else if ( lastV.equals( allPts[ i ] ) ) {

				// We reached the last point of a closed loop

				lastV = null;
				p++;
				continue;

			}

		}


		/*
		for ( p = 0; p < allPts.length; p++ ) {

			pt = allPts[ p ];
			bezelPoints.push( new THREE.Vector2( pt.x + this.bezelSize, pt.y + this.bezelSize ) );

		}
		*/

		extract.bezel = bezelPoints;

		return extract;

	},


	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions

	b2p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * p;

	},

	b2p1: function ( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	},

	b2p2: function ( t, p ) {

		return t * t * p;

	},

	b2: function ( t, p0, p1, p2 ) {

		return this.b2p0( t, p0 ) + this.b2p1( t, p1 ) + this.b2p2( t, p2 );

	},

	// Cubic Bezier Functions

	b3p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * k * p;

	},

	b3p1: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * k * t * p;

	},

	b3p2: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * t * t * p;

	},

	b3p3: function ( t, p ) {

		return t * t * t * p;

	},

	b3: function ( t, p0, p1, p2, p3 ) {

		return this.b3p0( t, p0 ) + this.b3p1( t, p1 ) + this.b3p2( t, p2 ) +  this.b3p3( t, p3 );

	},


	extractGlyphPoints : function( c, face, scale, offset ) {

		var pts = [];

		var i, i2,
			outline, action, length,
			scaleX, scaleY,
			x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2,
			laste,
			glyph = face.glyphs[ c ] || face.glyphs[ ctxt.options.fallbackCharacter ];
	
		if ( !glyph ) return;
  
		if ( glyph.o ) {
	  
			outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );
			length = outline.length;
		
			scaleX = scale;
			scaleY = scale;
		 
			for ( i = 0; i < length; ) {

				action = outline[ i++ ];
  
				switch( action ) {

				case 'm':

					// Move To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;
					pts.push( new THREE.Vector2( x, y ) );
					break;

				case 'l':

					// Line To

					x = outline[ i++ ] * scaleX + offset;
					y = outline[ i++ ] * scaleY;
					pts.push( new THREE.Vector2( x, y ) );
					break;
					
				case 'q':

					// QuadraticCurveTo
				  
					cpx  = outline[ i++ ] * scaleX + offset;
					cpy  = outline[ i++ ] * scaleY;
					cpx1 = outline[ i++ ] * scaleX + offset;
					cpy1 = outline[ i++ ] * scaleY;
			  
					laste = pts[ pts.length - 1 ];
			  
					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;
				
						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2++ ) {

							var t = i2 / divisions;
							var tx = THREE.FontUtils.b2( t, cpx0, cpx1, cpx );
							var ty = THREE.FontUtils.b2( t, cpy0, cpy1, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

					  }

				  }              
			  
				  break;

				case 'b':

					// Cubic Bezier Curve
				  
					cpx  = outline[ i++ ] *  scaleX + offset;
					cpy  = outline[ i++ ] *  scaleY;
					cpx1 = outline[ i++ ] *  scaleX + offset;
					cpy1 = outline[ i++ ] * -scaleY;
					cpx2 = outline[ i++ ] *  scaleX + offset;
					cpy2 = outline[ i++ ] * -scaleY;
			  
					laste = pts[ pts.length - 1 ];
			  
					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;
				
						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2++ ) {

							var t = i2 / divisions;
							var tx = THREE.FontUtils.b3( t, cpx0, cpx1, cpx2, cpx );
							var ty = THREE.FontUtils.b3( t, cpy0, cpy1, cpy2, cpy );
							pts.push( new THREE.Vector2( tx, ty ) );

						}

					}

					break;

				}

			}
		}

		return { offset: glyph.ha*scale, points:pts };
	}

};



/**
 * This code is a quick port of code written in C++ which was submitted to 
 * flipcode.com by John W. Ratcliff  // July 22, 2000 
 * See original code and more information here:
 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 * 
 * ported to actionscript by Zevan Rosser
 * www.actionsnippet.com
 * 
 * ported to javascript by Joshua Koo
 * http://www.lab4games.net/zz85/blog
 * 
 */


( function( namespace ) {

	var EPSILON = 0.0000000001;

	// takes in an contour array and returns 

	var process = function( contour, indices ) {

		var n = contour.length;

		if ( n < 3 ) return null;

		var result = [],
			verts = [], 
			vertIndices = [];

		/* we want a counter-clockwise polygon in verts */

		var u, v, w;

		if ( area( contour ) > 0.0 ) {

			for ( v = 0; v < n; v++ ) verts[ v ] = v;

		} else {

			for ( v = 0; v < n; v++ ) verts[ v ] = ( n - 1 ) - v;

		}

		var nv = n;

		/*  remove nv - 2 vertices, creating 1 triangle every time */

		var count = 2 * nv;   /* error detection */

		for( v = nv - 1; nv > 2; ) {

			/* if we loop, it is probably a non-simple polygon */

			if ( ( count-- ) <= 0 ) {

				//** Triangulate: ERROR - probable bad polygon!

				//throw ( "Warning, unable to triangulate polygon!" );
				//return null;

				console.log( "Warning, unable to triangulate polygon!" );

				if ( indices ) return vertIndices;
				return result;

			}

			/* three consecutive vertices in current polygon, <u,v,w> */
			
			u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
			v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
			w = v + 1;  if ( nv <= w ) w = 0;     /* next     */
			
			if ( snip( contour, u, v, w, nv, verts ) ) {

				var a, b, c, s, t;
			
				/* true names of the vertices */

				a = verts[ u ]; 
				b = verts[ v ]; 
				c = verts[ w ];

				/* output Triangle */

				result.push( contour[ a ] );
				result.push( contour[ b ] );
				result.push( contour[ c ] );

				vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );
			
				/* remove v from the remaining polygon */

				for( s = v, t = v + 1; t < nv; s++, t++ ) {
					
					verts[ s ] = verts[ t ]; 

				}

				nv--;
			
				/* reset error detection counter */

				count = 2 * nv;

			}

		}
		
		if ( indices ) return vertIndices;
		return result;

	};
	
	// calculate area of the contour polygon

	var area = function ( contour ) {

		var n = contour.length;
		var a = 0.0;
		
		for( var p = n - 1, q = 0; q < n; p = q++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	};
	
	// see if p is inside triangle abc

	var insideTriangle = function( ax, ay,
								   bx, by,
								   cx, cy,
								   px, py ) {

		  var aX, aY, bX, bY;
		  var cX, cY, apx, apy;
		  var bpx, bpy, cpx, cpy;
		  var cCROSSap, bCROSScp, aCROSSbp;
		
		  aX = cx - bx;  aY = cy - by;
		  bX = ax - cx;  bY = ay - cy;
		  cX = bx - ax;  cY = by - ay;
		  apx= px  -ax;  apy= py - ay;
		  bpx= px - bx;  bpy= py - by;
		  cpx= px - cx;  cpy= py - cy;
		
		  aCROSSbp = aX*bpy - aY*bpx;
		  cCROSSap = cX*apy - cY*apx;
		  bCROSScp = bX*cpy - bY*cpx;
		
		  return ( (aCROSSbp >= 0.0) && (bCROSScp >= 0.0) && (cCROSSap >= 0.0) );

	};
	
	
	var snip = function ( contour, u, v, w, n, verts ) {

		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;

		ax = contour[ verts[ u ] ].x;
		ay = contour[ verts[ u ] ].y;

		bx = contour[ verts[ v ] ].x;
		by = contour[ verts[ v ] ].y;

		cx = contour[ verts[ w ] ].x;
		cy = contour[ verts[ w ] ].y;
		
		if ( EPSILON > (((bx-ax)*(cy-ay)) - ((by-ay)*(cx-ax))) ) return false;
		
			for ( p = 0; p < n; p++ ) {

				if( (p == u) || (p == v) || (p == w) ) continue;
			
				px = contour[ verts[ p ] ].x
				py = contour[ verts[ p ] ].y

				if ( insideTriangle( ax, ay, bx, by, cx, cy, px, py ) ) return false;

		  }

		  return true;

	};
	
	
	namespace.Triangulate = process;
	namespace.Triangulate.area = area;
	
	return namespace;

})(THREE.FontUtils);

// To use the typeface.js face files, hook up the API
window._typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

THREE.TorusGeometry = function ( radius, tube, segmentsR, segmentsT ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 100;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 8;
	this.segmentsT = segmentsT || 6;

	var temp_uv = [];

	for ( var j = 0; j <= this.segmentsR; ++j ) {

		for ( var i = 0; i <= this.segmentsT; ++i ) {

			var u = i / this.segmentsT * 2 * Math.PI;
			var v = j / this.segmentsR * 2 * Math.PI;
			var x = (this.radius + this.tube*Math.cos(v))*Math.cos(u);
			var y = (this.radius + this.tube*Math.cos(v))*Math.sin(u);
			var z = this.tube*Math.sin(v);

			vert( x, y, z );

			temp_uv.push( [i/this.segmentsT, 1 - j/this.segmentsR] );

		}
	}


	for ( var j = 1; j <= this.segmentsR; ++j ) {

		for ( var i = 1; i <= this.segmentsT; ++i ) {

			var a = (this.segmentsT + 1)*j + i;
			var b = (this.segmentsT + 1)*j + i - 1;
			var c = (this.segmentsT + 1)*(j - 1) + i - 1;
			var d = (this.segmentsT + 1)*(j - 1) + i;

			f4( a, b, c,d );

			this.faceVertexUvs[ 0 ].push( [new THREE.UV( temp_uv[a][0], temp_uv[a][1] ),
							new THREE.UV( temp_uv[b][0], temp_uv[b][1] ),
							new THREE.UV( temp_uv[c][0], temp_uv[c][1] ),
							new THREE.UV( temp_uv[d][0], temp_uv[d][1] )
							] );
		}

	}

	delete temp_uv;

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert( x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	};

	function f4( a, b, c, d ) {

		scope.faces.push( new THREE.Face4( a, b, c, d ) );

	};

};

THREE.TorusGeometry.prototype = new THREE.Geometry();
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;
/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
 */

THREE.TorusKnotGeometry = function ( radius, tube, segmentsR, segmentsT, p, q, heightScale ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.radius = radius || 200;
	this.tube = tube || 40;
	this.segmentsR = segmentsR || 64;
	this.segmentsT = segmentsT || 8;
	this.p = p || 2;
	this.q = q || 3;
	this.heightScale = heightScale || 1;
	this.grid = new Array(this.segmentsR);

	var tang = new THREE.Vector3();
	var n = new THREE.Vector3();
	var bitan = new THREE.Vector3();

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		this.grid[ i ] = new Array( this.segmentsT );

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var u = i / this.segmentsR * 2 * this.p * Math.PI;
			var v = j / this.segmentsT * 2 * Math.PI;
			var p = getPos( u, v, this.q, this.p, this.radius, this.heightScale );
			var p2 = getPos( u + 0.01, v, this.q, this.p, this.radius, this.heightScale );
			var cx, cy;

			tang.x = p2.x - p.x; tang.y = p2.y - p.y; tang.z = p2.z - p.z;
			n.x = p2.x + p.x; n.y = p2.y + p.y; n.z = p2.z + p.z; 
			bitan.cross( tang, n );
			n.cross( bitan, tang );
			bitan.normalize();
			n.normalize();

			cx = - this.tube * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = this.tube * Math.sin( v );

			p.x += cx * n.x + cy * bitan.x;
			p.y += cx * n.y + cy * bitan.y;
			p.z += cx * n.z + cy * bitan.z;

			this.grid[ i ][ j ] = vert( p.x, p.y, p.z );

		}

	}

	for ( var i = 0; i < this.segmentsR; ++ i ) {

		for ( var j = 0; j < this.segmentsT; ++ j ) {

			var ip = ( i + 1 ) % this.segmentsR;
			var jp = ( j + 1 ) % this.segmentsT;
			var a = this.grid[ i ][ j ]; 
			var b = this.grid[ ip ][ j ];
			var c = this.grid[ ip ][ jp ];
			var d = this.grid[ i ][ jp ]; 

			var uva = new THREE.UV( i / this.segmentsR, j / this.segmentsT );
			var uvb = new THREE.UV( ( i + 1 ) / this.segmentsR, j / this.segmentsT );
			var uvc = new THREE.UV( ( i + 1 ) / this.segmentsR, ( j + 1 ) / this.segmentsT );
			var uvd = new THREE.UV( i / this.segmentsR, ( j + 1 ) / this.segmentsT );

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva,uvb,uvc, uvd ] );

		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) ) - 1;

	}

	function getPos( u, v, in_q, in_p, radius, heightScale ) {

		var cu = Math.cos( u );
		var cv = Math.cos( v );
		var su = Math.sin( u );
		var quOverP = in_q / in_p * u;
		var cs = Math.cos( quOverP );

		var tx = radius * ( 2 + cs ) * 0.5 * cu;
		var ty = radius * ( 2 + cs ) * su * 0.5;
		var tz = heightScale * radius * Math.sin( quOverP ) * 0.5;

		return new THREE.Vector3( tx, ty, tz );

	}

};

THREE.TorusKnotGeometry.prototype = new THREE.Geometry();
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	addStatusElement: function () {

		var e = document.createElement( "div" );

		e.style.position = "absolute";
		e.style.right = "0px";
		e.style.top = "0px";
		e.style.fontSize = "0.8em";
		e.style.textAlign = "left";
		e.style.background = "rgba(0,0,0,0.25)";
		e.style.color = "#fff";
		e.style.width = "120px";
		e.style.padding = "0.5em 0.5em 0.5em 0.5em";
		e.style.zIndex = 1000;

		e.innerHTML = "Loading ...";

		return e;

	},

	updateProgress: function ( progress ) {

		var message = "Loaded ";

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed(0) + "%";


		} else {

			message += ( progress.loaded / 1000 ).toFixed(2) + " KB";

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlbase: function( url ) {

		var chunks = url.split( "/" );
		chunks.pop();
		return chunks.join( "/" );

	},

	init_materials: function( scope, materials, texture_path ) {

		scope.materials = [];

		for ( var i = 0; i < materials.length; ++i ) {

			scope.materials[ i ] = [ THREE.Loader.prototype.createMaterial( materials[ i ], texture_path ) ];

		}

	},

	hasNormals: function( scope ) {

		var m, i, il = scope.materials.length;

		for( i = 0; i < il; i++ ) {

			m = scope.materials[ i ][ 0 ];

			if ( m instanceof THREE.MeshShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texture_path ) {

		function is_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.floor( l ) == l;

		}

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function load_image( where, url ) {

			var image = new Image();

			image.onload = function () {

				if ( !is_pow2( this.width ) || !is_pow2( this.height ) ) {

					var w = nearest_pow2( this.width ),
						h = nearest_pow2( this.height );

					where.image.width = w;
					where.image.height = h;
					where.image.getContext("2d").drawImage( this, 0, 0, w, h );

				} else {

					where.image = this;

				}

				where.needsUpdate = true;

			};

			image.src = url;

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap ) {

			var texture = document.createElement( 'canvas' );

			where[ name ] = new THREE.Texture( texture );
			where[ name ].sourceFile = sourceFile;

			if( repeat ) {

				where[ name ].repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] != 1 ) where[ name ].wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] != 1 ) where[ name ].wrapT = THREE.RepeatWrapping;

			}

			if( offset ) {

				where[ name ].offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if( wrap ) {

				var wrapMap = {
				"repeat" 	: THREE.RepeatWrapping,
				"mirror"	: THREE.MirroredRepeatWrapping
				}

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) where[ name ].wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) where[ name ].wrapT = wrapMap[ wrap[ 1 ] ];

			}

			load_image( where[ name ], texture_path + "/" + sourceFile );

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		var material, mtype, mpars,
			color, specular, ambient,
			vertexColors;

		// defaults

		mtype = "MeshLambertMaterial";

		// vertexColors

		mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, wireframe: m.wireframe };

		// parameters from model file

		if ( m.shading ) {

			if ( m.shading == "Phong" ) mtype = "MeshPhongMaterial";
			else if ( m.shading == "Basic" ) mtype = "MeshBasicMaterial";

		}

		if ( m.blending ) {

			if ( m.blending == "Additive" ) mpars.blending = THREE.AdditiveBlending;
			else if ( m.blending == "Subtractive" ) mpars.blending = THREE.SubtractiveBlending;
			else if ( m.blending == "Multiply" ) mpars.blending = THREE.MultiplyBlending;

		}

		if ( m.transparent !== undefined || m.opacity < 1.0 ) {

			mpars.transparent = m.transparent;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors == "face" ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorAmbient ) {

			mpars.ambient = rgb2hex( m.colorAmbient );

		}

		// modifiers

		if ( m.transparency ) {

			mpars.opacity = m.transparency;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texture_path ) {

			create_texture( mpars, "map", m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap );

		}

		if ( m.mapLight && texture_path ) {

			create_texture( mpars, "lightMap", m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap );

		}

		if ( m.mapNormal && texture_path ) {

			create_texture( mpars, "normalMap", m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap );

		}

		// special case for normal mapped material

		if ( m.mapNormal ) {

			var shader = THREE.ShaderUtils.lib[ "normal" ];
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			var diffuse = mpars.color;
			var specular = mpars.specular;
			var ambient = mpars.ambient;
			var shininess = mpars.shininess;

			uniforms[ "tNormal" ].texture = mpars.normalMap;

			if ( m.mapNormalFactor ) {

				uniforms[ "uNormalScale" ].value = m.mapNormalFactor;

			}

			if ( mpars.map ) {

				uniforms[ "tDiffuse" ].texture = mpars.map;
				uniforms[ "enableDiffuse" ].value = true;

			}

			// for the moment don't handle specular, AO and displacement textures

			uniforms[ "enableAO" ].value = false;
			uniforms[ "enableSpecular" ].value = false;

			uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
			uniforms[ "uSpecularColor" ].value.setHex( specular );
			uniforms[ "uAmbientColor" ].value.setHex( ambient );

			uniforms[ "uShininess" ].value = shininess;

			if ( mpars.opacity ) {

				uniforms[ "uOpacity" ].value = mpars.opacity;

			}

			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };

			material = new THREE.MeshShaderMaterial( parameters );

		} else {

			material = new THREE[ mtype ]( mpars );

		}

		return material;

	}

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.JSONLoader.prototype = new THREE.Loader();
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;
THREE.JSONLoader.prototype.supr = THREE.Loader.prototype;


/**
 * Load models generated by slim OBJ converter with ASCII option (converter_obj_three_slim.py -t ascii)
 *  - parameters
 *  - model (required)
 *  - callback (required)
 *  - texture_path (optional: if not specified, textures will be assumed to be in the same folder as JS model file)
 */

THREE.JSONLoader.prototype.load = function ( parameters ) {

	var scope = this,
		url = parameters.model,
		callback = parameters.callback,
		texture_path = parameters.texture_path ? parameters.texture_path : this.extractUrlbase( url ),
		worker = new Worker( url );

	worker.onmessage = function ( event ) {

		scope.createModel( event.data, callback, texture_path );
		scope.onLoadComplete();

	};

	this.onLoadStart();
	worker.postMessage( new Date().getTime() );

};

THREE.JSONLoader.prototype.createModel = function ( json, callback, texture_path ) {

	var scope = this,
	geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	this.init_materials( geometry, json.materials, texture_path );

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );
	parseEdges();

	geometry.computeCentroids();
	geometry.computeFaceNormals();

	if ( this.hasNormals( geometry ) ) geometry.computeTangents();

	// geometry.computeEdgeFaces();

	function parseModel( scale ) {

		if ( json.version === undefined || json.version != 2 ) {

			console.error( 'Deprecated file format.' );
			return;

		}

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		};

		var i, j, fi,

		offset, zLength, nVertices,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceUv, hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, color, normal,

		uvLayer, uvs, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		// disregard empty arrays

		for ( i = 0; i < json.uvs.length; i++ ) {

			if ( json.uvs[ i ].length ) nUvLayers ++;

		}

		for ( i = 0; i < nUvLayers; i++ ) {

			geometry.faceUvs[ i ] = [];
			geometry.faceVertexUvs[ i ] = [];

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vertex();

			vertex.position.x = vertices[ offset ++ ] * scale;
			vertex.position.y = vertices[ offset ++ ] * scale;
			vertex.position.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad          	= isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceUv           = isBitSet( type, 2 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	    = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			//console.log("type", type, "bits", isQuad, hasMaterial, hasFaceUv, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				face = new THREE.Face4();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];
				face.d = faces[ offset ++ ];

				nVertices = 4;

			} else {

				face = new THREE.Face3();

				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				nVertices = 3;

			}

			if ( hasMaterial ) {

				materialIndex = faces[ offset ++ ];
				face.materials = geometry.materials[ materialIndex ];

			}

			// to get face <=> uv index correspondence

			fi = geometry.faces.length;

			if ( hasFaceUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvIndex = faces[ offset ++ ];

					u = uvLayer[ uvIndex * 2 ];
					v = uvLayer[ uvIndex * 2 + 1 ];

					geometry.faceUvs[ i ][ fi ] = new THREE.UV( u, v );

				}

			}

			if ( hasFaceVertexUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvs = [];

					for ( j = 0; j < nVertices; j ++ ) {

						uvIndex = faces[ offset ++ ];

						u = uvLayer[ uvIndex * 2 ];
						v = uvLayer[ uvIndex * 2 + 1 ];

						uvs[ j ] = new THREE.UV( u, v );

					}

					geometry.faceVertexUvs[ i ][ fi ] = uvs;

				}

			}

			if ( hasFaceNormal ) {

				normalIndex = faces[ offset ++ ] * 3;

				normal = new THREE.Vector3();

				normal.x = normals[ normalIndex ++ ];
				normal.y = normals[ normalIndex ++ ];
				normal.z = normals[ normalIndex ];

				face.normal = normal;

			}

			if ( hasFaceVertexNormal ) {

				for ( i = 0; i < nVertices; i++ ) {

					normalIndex = faces[ offset ++ ] * 3;

					normal = new THREE.Vector3();

					normal.x = normals[ normalIndex ++ ];
					normal.y = normals[ normalIndex ++ ];
					normal.z = normals[ normalIndex ];

					face.vertexNormals.push( normal );

				}

			}


			if ( hasFaceColor ) {

				colorIndex = faces[ offset ++ ];

				color = new THREE.Color( colors[ colorIndex ] );
				face.color = color;

			}


			if ( hasFaceVertexColor ) {

				for ( i = 0; i < nVertices; i++ ) {

					colorIndex = faces[ offset ++ ];

					color = new THREE.Color( colors[ colorIndex ] );
					face.vertexColors.push( color );

				}

			}

			geometry.faces.push( face );

		}

	};

	function parseSkin() {

		var i, l, x, y, z, w, a, b, c, d;

		if ( json.skinWeights ) {

			for ( i = 0, l = json.skinWeights.length; i < l; i += 2 ) {

				x = json.skinWeights[ i     ];
				y = json.skinWeights[ i + 1 ];
				z = 0;
				w = 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( i = 0, l = json.skinIndices.length; i < l; i += 2 ) {

				a = json.skinIndices[ i     ];
				b = json.skinIndices[ i + 1 ];
				c = 0;
				d = 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;
		geometry.animation = json.animation;

	};

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, x, y, z, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					x = srcVertices[ v ] * scale;
					y = srcVertices[ v + 1 ] * scale;
					z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	};

	function parseEdges() {

		if( json.edges !== undefined ) {

			var i, il, v1, v2;

			for ( i = 0; i < json.edges.length; i+= 2 ) {

				v1 = json.edges[ i ];
				v2 = json.edges[ i + 1 ];

				geometry.edges.push( new THREE.Edge( geometry.vertices[ v1 ], geometry.vertices[ v2 ], v1, v2 ) );

			}

		}

	};

	callback( geometry );

}
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BinaryLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.BinaryLoader.prototype = new THREE.Loader();
THREE.BinaryLoader.prototype.constructor = THREE.BinaryLoader;
THREE.BinaryLoader.prototype.supr = THREE.Loader.prototype;


THREE.BinaryLoader.prototype = {

	// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
	//  - binary models consist of two files: JS and BIN
	//  - parameters
	//		- model (required)
	//		- callback (required)
	//		- bin_path (optional: if not specified, binary file will be assumed to be in the same folder as JS model file)
	//		- texture_path (optional: if not specified, textures will be assumed to be in the same folder as JS model file)

	load: function( parameters ) {

		// #1 load JS part via web worker

		//  This isn't really necessary, JS part is tiny,
		//  could be done by more ordinary means.

		var url = parameters.model,
			callback = parameters.callback,
		    texture_path = parameters.texture_path ? parameters.texture_path : THREE.Loader.prototype.extractUrlbase( url ),
			bin_path = parameters.bin_path ? parameters.bin_path : THREE.Loader.prototype.extractUrlbase( url ),

			s = (new Date).getTime(),
			worker = new Worker( url ),
			callback_progress = this.showProgress ? THREE.Loader.prototype.updateProgress : null;

		worker.onmessage = function( event ) {

			var materials = event.data.materials,
				buffers = event.data.buffers;

			// #2 load BIN part via Ajax

			//  For some reason it is faster doing loading from here than from within the worker.
			//  Maybe passing of ginormous string as message between threads is costly?
			//  Also, worker loading huge data by Ajax still freezes browser. Go figure,
			//  worker with baked ascii JSON data keeps browser more responsive.

			THREE.BinaryLoader.prototype.loadAjaxBuffers( buffers, materials, callback, bin_path, texture_path, callback_progress );

		};

		worker.onerror = function (event) {

			alert( "worker.onerror: " + event.message + "\n" + event.data );
			event.preventDefault();

		};

		worker.postMessage( s );

	},

	// Binary AJAX parser based on Magi binary loader
	// https://github.com/kig/magi

	// Should look more into HTML5 File API
	// See also other suggestions by Gregg Tavares
	// https://groups.google.com/group/o3d-discuss/browse_thread/thread/a8967bc9ce1e0978

	loadAjaxBuffers: function( buffers, materials, callback, bin_path, texture_path, callback_progress ) {

		var xhr = new XMLHttpRequest(),
			url = bin_path + "/" + buffers;

		var length = 0;

		xhr.onreadystatechange = function() {

			if ( xhr.readyState == 4 ) {

				if ( xhr.status == 200 || xhr.status == 0 ) {

					THREE.BinaryLoader.prototype.createBinModel( xhr.responseText, callback, texture_path, materials );

				} else {

					alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

				}

			} else if ( xhr.readyState == 3 ) {

				if ( callback_progress ) {

					if ( length == 0 ) {

						length = xhr.getResponseHeader( "Content-Length" );

					}

					callback_progress( { total: length, loaded: xhr.responseText.length } );

				}

			} else if ( xhr.readyState == 2 ) {

				length = xhr.getResponseHeader( "Content-Length" );

			}

		}

		xhr.open("GET", url, true);
		xhr.overrideMimeType("text/plain; charset=x-user-defined");
		xhr.setRequestHeader("Content-Type", "text/plain");
		xhr.send(null);

	},

	createBinModel: function ( data, callback, texture_path, materials ) {

		var Model = function ( texture_path ) {

			//var s = (new Date).getTime();

			var scope = this,
				currentOffset = 0,
				md,
				normals = [],
				uvs = [],
				tri_b, tri_c, tri_m, tri_na, tri_nb, tri_nc,
				quad_b, quad_c, quad_d, quad_m, quad_na, quad_nb, quad_nc, quad_nd,
				tri_uvb, tri_uvc, quad_uvb, quad_uvc, quad_uvd,
				start_tri_flat, start_tri_smooth, start_tri_flat_uv, start_tri_smooth_uv,
				start_quad_flat, start_quad_smooth, start_quad_flat_uv, start_quad_smooth_uv,
				tri_size, quad_size,
				len_tri_flat, len_tri_smooth, len_tri_flat_uv, len_tri_smooth_uv,
				len_quad_flat, len_quad_smooth, len_quad_flat_uv, len_quad_smooth_uv;


			THREE.Geometry.call( this );

			THREE.Loader.prototype.init_materials( scope, materials, texture_path );

			md = parseMetaData( data, currentOffset );
			currentOffset += md.header_bytes;

			// cache offsets

			tri_b   = md.vertex_index_bytes,
			tri_c   = md.vertex_index_bytes*2,
			tri_m   = md.vertex_index_bytes*3,
			tri_na  = md.vertex_index_bytes*3 + md.material_index_bytes,
			tri_nb  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes,
			tri_nc  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes*2,

			quad_b  = md.vertex_index_bytes,
			quad_c  = md.vertex_index_bytes*2,
			quad_d  = md.vertex_index_bytes*3,
			quad_m  = md.vertex_index_bytes*4,
			quad_na = md.vertex_index_bytes*4 + md.material_index_bytes,
			quad_nb = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes,
			quad_nc = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*2,
			quad_nd = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*3,

			tri_uvb = md.uv_index_bytes,
			tri_uvc = md.uv_index_bytes * 2,

			quad_uvb = md.uv_index_bytes,
			quad_uvc = md.uv_index_bytes * 2,
			quad_uvd = md.uv_index_bytes * 3;

			// buffers sizes

			tri_size =  md.vertex_index_bytes * 3 + md.material_index_bytes;
			quad_size = md.vertex_index_bytes * 4 + md.material_index_bytes;

			len_tri_flat      = md.ntri_flat      * ( tri_size );
			len_tri_smooth    = md.ntri_smooth    * ( tri_size + md.normal_index_bytes * 3 );
			len_tri_flat_uv   = md.ntri_flat_uv   * ( tri_size + md.uv_index_bytes * 3 );
			len_tri_smooth_uv = md.ntri_smooth_uv * ( tri_size + md.normal_index_bytes * 3 + md.uv_index_bytes * 3 );

			len_quad_flat      = md.nquad_flat      * ( quad_size );
			len_quad_smooth    = md.nquad_smooth    * ( quad_size + md.normal_index_bytes * 4 );
			len_quad_flat_uv   = md.nquad_flat_uv   * ( quad_size + md.uv_index_bytes * 4 );
			len_quad_smooth_uv = md.nquad_smooth_uv * ( quad_size + md.normal_index_bytes * 4 + md.uv_index_bytes * 4 );

			// read buffers

			currentOffset += init_vertices( currentOffset );
			currentOffset += init_normals( currentOffset );
			currentOffset += init_uvs( currentOffset );

			start_tri_flat 		= currentOffset;
			start_tri_smooth    = start_tri_flat    + len_tri_flat;
			start_tri_flat_uv   = start_tri_smooth  + len_tri_smooth;
			start_tri_smooth_uv = start_tri_flat_uv + len_tri_flat_uv;

			start_quad_flat     = start_tri_smooth_uv + len_tri_smooth_uv;
			start_quad_smooth   = start_quad_flat     + len_quad_flat;
			start_quad_flat_uv  = start_quad_smooth   + len_quad_smooth;
			start_quad_smooth_uv= start_quad_flat_uv  +len_quad_flat_uv;

			// have to first process faces with uvs
			// so that face and uv indices match

			init_triangles_flat_uv( start_tri_flat_uv );
			init_triangles_smooth_uv( start_tri_smooth_uv );

			init_quads_flat_uv( start_quad_flat_uv );
			init_quads_smooth_uv( start_quad_smooth_uv );

			// now we can process untextured faces

			init_triangles_flat( start_tri_flat );
			init_triangles_smooth( start_tri_smooth );

			init_quads_flat( start_quad_flat );
			init_quads_smooth( start_quad_smooth );

			this.computeCentroids();
			this.computeFaceNormals();

			if ( THREE.Loader.prototype.hasNormals( this ) ) this.computeTangents();

			//var e = (new Date).getTime();

			//log( "binary data parse time: " + (e-s) + " ms" );

			function parseMetaData( data, offset ) {

				var metaData = {

					'signature'               :parseString( data, offset, 8 ),
					'header_bytes'            :parseUChar8( data, offset + 8 ),

					'vertex_coordinate_bytes' :parseUChar8( data, offset + 9 ),
					'normal_coordinate_bytes' :parseUChar8( data, offset + 10 ),
					'uv_coordinate_bytes'     :parseUChar8( data, offset + 11 ),

					'vertex_index_bytes'      :parseUChar8( data, offset + 12 ),
					'normal_index_bytes'      :parseUChar8( data, offset + 13 ),
					'uv_index_bytes'          :parseUChar8( data, offset + 14 ),
					'material_index_bytes'    :parseUChar8( data, offset + 15 ),

					'nvertices'    :parseUInt32( data, offset + 16 ),
					'nnormals'     :parseUInt32( data, offset + 16 + 4*1 ),
					'nuvs'         :parseUInt32( data, offset + 16 + 4*2 ),

					'ntri_flat'      :parseUInt32( data, offset + 16 + 4*3 ),
					'ntri_smooth'    :parseUInt32( data, offset + 16 + 4*4 ),
					'ntri_flat_uv'   :parseUInt32( data, offset + 16 + 4*5 ),
					'ntri_smooth_uv' :parseUInt32( data, offset + 16 + 4*6 ),

					'nquad_flat'      :parseUInt32( data, offset + 16 + 4*7 ),
					'nquad_smooth'    :parseUInt32( data, offset + 16 + 4*8 ),
					'nquad_flat_uv'   :parseUInt32( data, offset + 16 + 4*9 ),
					'nquad_smooth_uv' :parseUInt32( data, offset + 16 + 4*10 )

				};

				/*
				log( "signature: " + metaData.signature );

				log( "header_bytes: " + metaData.header_bytes );
				log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
				log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
				log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

				log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
				log( "normal_index_bytes: " + metaData.normal_index_bytes );
				log( "uv_index_bytes: " + metaData.uv_index_bytes );
				log( "material_index_bytes: " + metaData.material_index_bytes );

				log( "nvertices: " + metaData.nvertices );
				log( "nnormals: " + metaData.nnormals );
				log( "nuvs: " + metaData.nuvs );

				log( "ntri_flat: " + metaData.ntri_flat );
				log( "ntri_smooth: " + metaData.ntri_smooth );
				log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
				log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

				log( "nquad_flat: " + metaData.nquad_flat );
				log( "nquad_smooth: " + metaData.nquad_smooth );
				log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
				log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

				var total = metaData.header_bytes
						  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
						  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
						  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
						  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
						  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
						  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
						  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
						  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
						  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
						  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
						  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
				log( "total bytes: " + total );
				*/

				return metaData;

			}

			function parseString( data, offset, length ) {

				return data.substr( offset, length );

			}

			function parseFloat32( data, offset ) {

				var b3 = parseUChar8( data, offset ),
					b2 = parseUChar8( data, offset + 1 ),
					b1 = parseUChar8( data, offset + 2 ),
					b0 = parseUChar8( data, offset + 3 ),

					sign = 1 - ( 2 * ( b0 >> 7 ) ),
					exponent = ((( b0 << 1 ) & 0xff) | ( b1 >> 7 )) - 127,
					mantissa = (( b1 & 0x7f ) << 16) | (b2 << 8) | b3;

					if (mantissa == 0 && exponent == -127)
						return 0.0;

					return sign * ( 1 + mantissa * Math.pow( 2, -23 ) ) * Math.pow( 2, exponent );

			}

			function parseUInt32( data, offset ) {

				var b0 = parseUChar8( data, offset ),
					b1 = parseUChar8( data, offset + 1 ),
					b2 = parseUChar8( data, offset + 2 ),
					b3 = parseUChar8( data, offset + 3 );

				return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0;
			}

			function parseUInt16( data, offset ) {

				var b0 = parseUChar8( data, offset ),
					b1 = parseUChar8( data, offset + 1 );

				return (b1 << 8) + b0;

			}

			function parseSChar8( data, offset ) {

				var b = parseUChar8( data, offset );
				return b > 127 ? b - 256 : b;

			}

			function parseUChar8( data, offset ) {

				return data.charCodeAt( offset ) & 0xff;
			}

			function init_vertices( start ) {

				var i, x, y, z,
					stride = md.vertex_coordinate_bytes * 3,
					end = start + md.nvertices * stride;

				for( i = start; i < end; i += stride ) {

					x = parseFloat32( data, i );
					y = parseFloat32( data, i + md.vertex_coordinate_bytes );
					z = parseFloat32( data, i + md.vertex_coordinate_bytes*2 );

					THREE.BinaryLoader.prototype.v( scope, x, y, z );

				}

				return md.nvertices * stride;

			}

			function init_normals( start ) {

				var i, x, y, z,
					stride = md.normal_coordinate_bytes * 3,
					end = start + md.nnormals * stride;

				for( i = start; i < end; i += stride ) {

					x = parseSChar8( data, i );
					y = parseSChar8( data, i + md.normal_coordinate_bytes );
					z = parseSChar8( data, i + md.normal_coordinate_bytes*2 );

					normals.push( x/127, y/127, z/127 );

				}

				return md.nnormals * stride;

			}

			function init_uvs( start ) {

				var i, u, v,
					stride = md.uv_coordinate_bytes * 2,
					end = start + md.nuvs * stride;

				for( i = start; i < end; i += stride ) {

					u = parseFloat32( data, i );
					v = parseFloat32( data, i + md.uv_coordinate_bytes );

					uvs.push( u, v );

				}

				return md.nuvs * stride;

			}

			function add_tri( i ) {

				var a, b, c, m;

				a = parseUInt32( data, i );
				b = parseUInt32( data, i + tri_b );
				c = parseUInt32( data, i + tri_c );

				m = parseUInt16( data, i + tri_m );

				THREE.BinaryLoader.prototype.f3( scope, a, b, c, m );

			}

			function add_tri_n( i ) {

				var a, b, c, m, na, nb, nc;

				a  = parseUInt32( data, i );
				b  = parseUInt32( data, i + tri_b );
				c  = parseUInt32( data, i + tri_c );

				m  = parseUInt16( data, i + tri_m );

				na = parseUInt32( data, i + tri_na );
				nb = parseUInt32( data, i + tri_nb );
				nc = parseUInt32( data, i + tri_nc );

				THREE.BinaryLoader.prototype.f3n( scope, normals, a, b, c, m, na, nb, nc );

			}

			function add_quad( i ) {

				var a, b, c, d, m;

				a = parseUInt32( data, i );
				b = parseUInt32( data, i + quad_b );
				c = parseUInt32( data, i + quad_c );
				d = parseUInt32( data, i + quad_d );

				m = parseUInt16( data, i + quad_m );

				THREE.BinaryLoader.prototype.f4( scope, a, b, c, d, m );

			}

			function add_quad_n( i ) {

				var a, b, c, d, m, na, nb, nc, nd;

				a  = parseUInt32( data, i );
				b  = parseUInt32( data, i + quad_b );
				c  = parseUInt32( data, i + quad_c );
				d  = parseUInt32( data, i + quad_d );

				m  = parseUInt16( data, i + quad_m );

				na = parseUInt32( data, i + quad_na );
				nb = parseUInt32( data, i + quad_nb );
				nc = parseUInt32( data, i + quad_nc );
				nd = parseUInt32( data, i + quad_nd );

				THREE.BinaryLoader.prototype.f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

			}

			function add_uv3( i ) {

				var uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

				uva = parseUInt32( data, i );
				uvb = parseUInt32( data, i + tri_uvb );
				uvc = parseUInt32( data, i + tri_uvc );

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				THREE.BinaryLoader.prototype.uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

			}

			function add_uv4( i ) {

				var uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

				uva = parseUInt32( data, i );
				uvb = parseUInt32( data, i + quad_uvb );
				uvc = parseUInt32( data, i + quad_uvc );
				uvd = parseUInt32( data, i + quad_uvd );

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				u4 = uvs[ uvd*2 ];
				v4 = uvs[ uvd*2 + 1 ];

				THREE.BinaryLoader.prototype.uv4( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3, u4, v4 );

			}

			function init_triangles_flat( start ) {

				var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes,
					end = start + md.ntri_flat * stride;

				for( i = start; i < end; i += stride ) {

					add_tri( i );

				}

				return end - start;

			}

			function init_triangles_flat_uv( start ) {

				var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes,
					stride = offset + md.uv_index_bytes * 3,
					end = start + md.ntri_flat_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_tri( i );
					add_uv3( i + offset );

				}

				return end - start;

			}

			function init_triangles_smooth( start ) {

				var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
					end = start + md.ntri_smooth * stride;

				for( i = start; i < end; i += stride ) {

					add_tri_n( i );

				}

				return end - start;

			}

			function init_triangles_smooth_uv( start ) {

				var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
					stride = offset + md.uv_index_bytes * 3,
					end = start + md.ntri_smooth_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_tri_n( i );
					add_uv3( i + offset );

				}

				return end - start;

			}

			function init_quads_flat( start ) {

				var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes,
					end = start + md.nquad_flat * stride;

				for( i = start; i < end; i += stride ) {

					add_quad( i );

				}

				return end - start;

			}

			function init_quads_flat_uv( start ) {

				var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes,
					stride = offset + md.uv_index_bytes * 4,
					end = start + md.nquad_flat_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_quad( i );
					add_uv4( i + offset );

				}

				return end - start;

			}

			function init_quads_smooth( start ) {

				var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4,
					end = start + md.nquad_smooth * stride;

				for( i = start; i < end; i += stride ) {

					add_quad_n( i );
				}

				return end - start;

			}

			function init_quads_smooth_uv( start ) {

				var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4,
					stride =  offset + md.uv_index_bytes * 4,
					end = start + md.nquad_smooth_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_quad_n( i );
					add_uv4( i + offset );

				}

				return end - start;

			}

		}

		Model.prototype = new THREE.Geometry();
		Model.prototype.constructor = Model;

		callback( new Model( texture_path ) );

	},


	v: function( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	},

	f3: function( scope, a, b, c, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face3( a, b, c, null, null, material ) );

	},

	f4: function( scope, a, b, c, d, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face4( a, b, c, d, null, null, material ) );

	},

	f3n: function( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz )],
						  null,
						  material ) );

	},

	f4n: function( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face4( a, b, c, d,
						  [new THREE.Vector3( nax, nay, naz ),
						   new THREE.Vector3( nbx, nby, nbz ),
						   new THREE.Vector3( ncx, ncy, ncz ),
						   new THREE.Vector3( ndx, ndy, ndz )],
						  null,
						  material ) );

	},

	uv3: function( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	},

	uv4: function( where, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		uv.push( new THREE.UV( u4, v4 ) );
		where.push( uv );

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneLoader = function () {

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

	this.callbackSync = function () {};
	this.callbackProgress = function () {};

};

THREE.SceneLoader.prototype = {

	load : function ( url, callbackFinished ) {

		var scope = this;

		var worker = new Worker( url );
		worker.postMessage( 0 );

		var urlBase = THREE.Loader.prototype.extractUrlbase( url );

		worker.onmessage = function( event ) {

			var dg, dm, dd, dl, dc, df, dt,
				g, o, m, l, p, c, t, f, tt, pp,
				geometry, material, camera, fog,
				texture, images,
				materials, light,
				data, binLoader, jsonLoader,
				counter_models, counter_textures,
				total_models, total_textures,
				result;

			data = event.data;

			binLoader = new THREE.BinaryLoader();
			jsonLoader = new THREE.JSONLoader();

			counter_models = 0;
			counter_textures = 0;

			result = {

				scene: new THREE.Scene(),
				geometries: {},
				materials: {},
				textures: {},
				objects: {},
				cameras: {},
				lights: {},
				fogs: {},
				triggers: {},
				empties: {}

			};

			// find out if there are some colliders

			var hasColliders = false;

			for( dd in data.objects ) {

				o = data.objects[ dd ];

				if ( o.meshCollider )  {

					hasColliders = true;
					break;

				}

			}

			if ( hasColliders ) {

				result.scene.collisions = new THREE.CollisionSystem();

			}

			if ( data.transform ) {

				var position = data.transform.position,
					rotation = data.transform.rotation,
					scale = data.transform.scale;

				if ( position )
					result.scene.position.set( position[ 0 ], position[ 1 ], position [ 2 ] );

				if ( rotation )
					result.scene.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation [ 2 ] );

				if ( scale )
					result.scene.scale.set( scale[ 0 ], scale[ 1 ], scale [ 2 ] );

				if ( position || rotation || scale )
					result.scene.updateMatrix();

			}

			function get_url( source_url, url_type ) {

				if ( url_type == "relativeToHTML" ) {

					return source_url;

				} else {

					return urlBase + "/" + source_url;

				}

			};

			function handle_objects() {

				for( dd in data.objects ) {

					if ( !result.objects[ dd ] ) {

						o = data.objects[ dd ];

						if ( o.geometry !== undefined ) {

							geometry = result.geometries[ o.geometry ];

							// geometry already loaded

							if ( geometry ) {

								var hasNormals = false;

								materials = [];
								for( i = 0; i < o.materials.length; i++ ) {

									materials[ i ] = result.materials[ o.materials[i] ];

									hasNormals = materials[ i ] instanceof THREE.MeshShaderMaterial;

								}

								if ( hasNormals ) {

									geometry.computeTangents();

								}

								p = o.position;
								r = o.rotation;
								q = o.quaternion;
								s = o.scale;

								// turn off quaternions, for the moment

								q = 0;

								if ( materials.length == 0 ) {

									materials[ 0 ] = new THREE.MeshFaceMaterial();

								}

								// dirty hack to handle meshes with multiple materials
								// just use face materials defined in model

								if ( materials.length > 1 ) {

									materials = [ new THREE.MeshFaceMaterial() ];

								}

								object = new THREE.Mesh( geometry, materials );
								object.name = dd;
								object.position.set( p[0], p[1], p[2] );

								if ( q ) {

									object.quaternion.set( q[0], q[1], q[2], q[3] );
									object.useQuaternion = true;

								} else {

									object.rotation.set( r[0], r[1], r[2] );

								}

								object.scale.set( s[0], s[1], s[2] );
								object.visible = o.visible;

								result.scene.addObject( object );

								result.objects[ dd ] = object;

								if ( o.meshCollider ) {

									var meshCollider = THREE.CollisionUtils.MeshColliderWBox( object );
									result.scene.collisions.colliders.push( meshCollider );

								}

								if ( o.castsShadow ) {

									//object.visible = true;
									//object.materials = [ new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ];

									var shadow = new THREE.ShadowVolume( geometry )
									result.scene.addChild( shadow );

									shadow.position = object.position;
									shadow.rotation = object.rotation;
									shadow.scale = object.scale;

								}

								if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

									var trigger = {
									"type" 		: o.trigger,
									"object"	: o
									};

									result.triggers[ object.name ] = trigger;

								}

							}

						// pure Object3D

						} else {

							p = o.position;
							r = o.rotation;
							q = o.quaternion;
							s = o.scale;

							// turn off quaternions, for the moment

							q = 0;

							object = new THREE.Object3D();
							object.name = dd;
							object.position.set( p[0], p[1], p[2] );

							if ( q ) {

								object.quaternion.set( q[0], q[1], q[2], q[3] );
								object.useQuaternion = true;

							} else {

								object.rotation.set( r[0], r[1], r[2] );

							}

							object.scale.set( s[0], s[1], s[2] );
							object.visible = ( o.visible !== undefined ) ? o.visible : false;

							result.scene.addObject( object );

							result.objects[ dd ] = object;
							result.empties[ dd ] = object;

							if ( o.trigger && o.trigger.toLowerCase() != "none" ) {

								var trigger = {
								"type" 		: o.trigger,
								"object"	: o
								};

								result.triggers[ object.name ] = trigger;

							}

						}

					}

				}

			};

			function handle_mesh( geo, id ) {

				result.geometries[ id ] = geo;
				handle_objects();

			};

			function create_callback( id ) {

				return function( geo ) {

					handle_mesh( geo, id );

					counter_models -= 1;

					scope.onLoadComplete();

					async_callback_gate();

				}

			};

			function create_callback_embed( id ) {

				return function( geo ) {

					result.geometries[ id ] = geo;

				}

			};

			function async_callback_gate() {

				var progress = {

					totalModels		: total_models,
					totalTextures	: total_textures,
					loadedModels	: total_models - counter_models,
					loadedTextures	: total_textures - counter_textures

				};

				scope.callbackProgress( progress, result );

				scope.onLoadProgress();

				if( counter_models == 0 && counter_textures == 0 ) {

					callbackFinished( result );

				}

			};

			var callbackTexture = function( images ) {

				counter_textures -= 1;
				async_callback_gate();

				scope.onLoadComplete();

			};

			// first go synchronous elements

			// cameras

			for( dc in data.cameras ) {

				c = data.cameras[ dc ];

				if ( c.type == "perspective" ) {

					camera = new THREE.Camera( c.fov, c.aspect, c.near, c.far );

				} else if ( c.type == "ortho" ) {

					camera = new THREE.Camera();
					camera.projectionMatrix = THREE.Matrix4.makeOrtho( c.left, c.right, c.top, c.bottom, c.near, c.far );

				}

				p = c.position;
				t = c.target;
				camera.position.set( p[0], p[1], p[2] );
				camera.target.position.set( t[0], t[1], t[2] );

				result.cameras[ dc ] = camera;

			}

			// lights

			var hex, intensity;

			for ( dl in data.lights ) {

				l = data.lights[ dl ];

				hex = ( l.color !== undefined ) ? l.color : 0xffffff;
				intensity = ( l.intensity !== undefined ) ? l.intensity : 1;

				if ( l.type == "directional" ) {

					p = l.direction;

					light = new THREE.DirectionalLight( hex, intensity );
					light.position.set( p[0], p[1], p[2] );
					light.position.normalize();

				} else if ( l.type == "point" ) {

					p = l.position;
					d = l.distance;

					light = new THREE.PointLight( hex, intensity, d );
					light.position.set( p[0], p[1], p[2] );

				} else if ( l.type == "ambient" ) {

					light = new THREE.AmbientLight( hex );

				}

				result.scene.addLight( light );

				result.lights[ dl ] = light;

			}

			// fogs

			for( df in data.fogs ) {

				f = data.fogs[ df ];

				if ( f.type == "linear" ) {

					fog = new THREE.Fog( 0x000000, f.near, f.far );

				} else if ( f.type == "exp2" ) {

					fog = new THREE.FogExp2( 0x000000, f.density );

				}

				c = f.color;
				fog.color.setRGB( c[0], c[1], c[2] );

				result.fogs[ df ] = fog;

			}

			// defaults

			if ( result.cameras && data.defaults.camera ) {

				result.currentCamera = result.cameras[ data.defaults.camera ];

			}

			if ( result.fogs && data.defaults.fog ) {

				result.scene.fog = result.fogs[ data.defaults.fog ];

			}

			c = data.defaults.bgcolor;
			result.bgColor = new THREE.Color();
			result.bgColor.setRGB( c[0], c[1], c[2] );

			result.bgColorAlpha = data.defaults.bgalpha;

			// now come potentially asynchronous elements

			// geometries

			// count how many models will be loaded asynchronously

			for( dg in data.geometries ) {

				g = data.geometries[ dg ];

				if ( g.type == "bin_mesh" || g.type == "ascii_mesh" ) {

					counter_models += 1;

					scope.onLoadStart();

				}

			}

			total_models = counter_models;

			for ( dg in data.geometries ) {

				g = data.geometries[ dg ];

				if ( g.type == "cube" ) {

					geometry = new THREE.CubeGeometry( g.width, g.height, g.depth, g.segmentsWidth, g.segmentsHeight, g.segmentsDepth, null, g.flipped, g.sides );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "plane" ) {

					geometry = new THREE.PlaneGeometry( g.width, g.height, g.segmentsWidth, g.segmentsHeight );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "sphere" ) {

					geometry = new THREE.SphereGeometry( g.radius, g.segmentsWidth, g.segmentsHeight );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "cylinder" ) {

					geometry = new THREE.CylinderGeometry( g.numSegs, g.topRad, g.botRad, g.height, g.topOffset, g.botOffset );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "torus" ) {

					geometry = new THREE.TorusGeometry( g.radius, g.tube, g.segmentsR, g.segmentsT );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "icosahedron" ) {

					geometry = new THREE.IcosahedronGeometry( g.subdivisions );
					result.geometries[ dg ] = geometry;

				} else if ( g.type == "bin_mesh" ) {

					binLoader.load( { model: get_url( g.url, data.urlBaseType ),
									  callback: create_callback( dg )
									} );

				} else if ( g.type == "ascii_mesh" ) {

					jsonLoader.load( { model: get_url( g.url, data.urlBaseType ),
									   callback: create_callback( dg )
									} );

				} else if ( g.type == "embedded_mesh" ) {

					var modelJson = data.embeds[ g.id ],
						texture_path = "";

					if ( modelJson ) {

						jsonLoader.createModel( modelJson, create_callback_embed( dg ), texture_path );
						
					}

				}

			}

			// textures

			// count how many textures will be loaded asynchronously

			for( dt in data.textures ) {

				tt = data.textures[ dt ];

				if( tt.url instanceof Array ) {

					counter_textures += tt.url.length;

					for( var n = 0; n < tt.url.length; n ++ ) {

						scope.onLoadStart();

					}

				} else {

					counter_textures += 1;

					scope.onLoadStart();

				}

			}

			total_textures = counter_textures;

			for( dt in data.textures ) {

				tt = data.textures[ dt ];

				if ( tt.mapping != undefined && THREE[ tt.mapping ] != undefined  ) {

					tt.mapping = new THREE[ tt.mapping ]();

				}

				if( tt.url instanceof Array ) {

					var url_array = [];

					for( var i = 0; i < tt.url.length; i ++ ) {

						url_array[ i ] = get_url( tt.url[ i ], data.urlBaseType );

					}

					texture = THREE.ImageUtils.loadTextureCube( url_array, tt.mapping, callbackTexture );

				} else {

					texture = THREE.ImageUtils.loadTexture( get_url( tt.url, data.urlBaseType ), tt.mapping, callbackTexture );

					if ( THREE[ tt.minFilter ] != undefined )
						texture.minFilter = THREE[ tt.minFilter ];

					if ( THREE[ tt.magFilter ] != undefined )
						texture.magFilter = THREE[ tt.magFilter ];


					if ( tt.repeat ) {

						texture.repeat.set( tt.repeat[ 0 ], tt.repeat[ 1 ] );

						if ( tt.repeat[ 0 ] != 1 ) texture.wrapS = THREE.RepeatWrapping;
						if ( tt.repeat[ 1 ] != 1 ) texture.wrapT = THREE.RepeatWrapping;

					}

					if ( tt.offset ) {

						texture.offset.set( tt.offset[ 0 ], tt.offset[ 1 ] );

					}

					// handle wrap after repeat so that default repeat can be overriden

					if ( tt.wrap ) {

						var wrapMap = {
						"repeat" 	: THREE.RepeatWrapping,
						"mirror"	: THREE.MirroredRepeatWrapping
						}

						if ( wrapMap[ tt.wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ tt.wrap[ 0 ] ];
						if ( wrapMap[ tt.wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ tt.wrap[ 1 ] ];

					}

				}

				result.textures[ dt ] = texture;

			}

			// materials

			for ( dm in data.materials ) {

				m = data.materials[ dm ];

				for ( pp in m.parameters ) {

					if ( pp == "envMap" || pp == "map" || pp == "lightMap" ) {

						m.parameters[ pp ] = result.textures[ m.parameters[ pp ] ];

					} else if ( pp == "shading" ) {

						m.parameters[ pp ] = ( m.parameters[ pp ] == "flat" ) ? THREE.FlatShading : THREE.SmoothShading;

					} else if ( pp == "blending" ) {

						m.parameters[ pp ] = THREE[ m.parameters[ pp ] ] ? THREE[ m.parameters[ pp ] ] : THREE.NormalBlending;

					} else if ( pp == "combine" ) {

						m.parameters[ pp ] = ( m.parameters[ pp ] == "MixOperation" ) ? THREE.MixOperation : THREE.MultiplyOperation;

					} else if ( pp == "vertexColors" ) {

						if ( m.parameters[ pp ] == "face" ) {

							m.parameters[ pp ] = THREE.FaceColors;

						// default to vertex colors if "vertexColors" is anything else face colors or 0 / null / false

						} else if ( m.parameters[ pp ] )   {

							m.parameters[ pp ] = THREE.VertexColors;

						}

					}

				}

				if ( m.parameters.opacity !== undefined && m.parameters.opacity < 1.0 ) {

					m.parameters.transparent = true;

				}

				if ( m.parameters.normalMap ) {

					var shader = THREE.ShaderUtils.lib[ "normal" ];
					var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

					var diffuse = m.parameters.color;
					var specular = m.parameters.specular;
					var ambient = m.parameters.ambient;
					var shininess = m.parameters.shininess;

					uniforms[ "tNormal" ].texture = result.textures[ m.parameters.normalMap ];

					if ( m.parameters.normalMapFactor ) {

						uniforms[ "uNormalScale" ].value = m.parameters.normalMapFactor;

					}

					if ( m.parameters.map ) {

						uniforms[ "tDiffuse" ].texture = m.parameters.map;
						uniforms[ "enableDiffuse" ].value = true;

					}

					uniforms[ "enableAO" ].value = false;
					uniforms[ "enableSpecular" ].value = false;

					uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
					uniforms[ "uSpecularColor" ].value.setHex( specular );
					uniforms[ "uAmbientColor" ].value.setHex( ambient );

					uniforms[ "uShininess" ].value = shininess;

					if ( m.parameters.opacity ) {

						uniforms[ "uOpacity" ].value = m.parameters.opacity;

					}

					var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true };

					material = new THREE.MeshShaderMaterial( parameters );

				} else {

					material = new THREE[ m.type ]( m.parameters );

				}

				result.materials[ dm ] = material;

			}

			// objects ( synchronous init of procedural primitives )

			handle_objects();

			// synchronous callback

			scope.callbackSync( result );

		};

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

// do not crash if somebody includes the file in oldie browser

THREE.MarchingCubes = function ( resolution, materials ) {

	THREE.Object3D.call( this );

	this.materials = materials instanceof Array ? materials : [ materials ];

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function( resolution ) {

		// parameters

		this.isolation = 80.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );

		// temp buffers used in polygonize

		this.vlist = new Float32Array( 12 * 3 );
		this.nlist = new Float32Array( 12 * 3 );

		this.firstDraw = true;

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray   = new Float32Array( this.maxCount * 3 );		

	};

	///////////////////////
	// Polygonization
	///////////////////////

	this.lerp = function( a, b, t ) { return a + ( b - a ) * t; };

	this.VIntX = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x + mu * this.delta;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q + 3 ], mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

	};

	this.VIntY = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y + mu * this.delta;
		pout[ offset + 2 ] = z;

		var q2 = q + this.yd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.VIntZ = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z + mu * this.delta;

		var q2 = q + this.zd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.compNorm = function( q ) {

		var q3 = q * 3;

		if ( this.normal_cache [ q3 ] == 0.0 ) {

			this.normal_cache[ q3     ] = this.field[ q - 1  ] 	    - this.field[ q + 1 ];
			this.normal_cache[ q3 + 1 ] = this.field[ q - this.yd ] - this.field[ q + this.yd ];
			this.normal_cache[ q3 + 2 ] = this.field[ q - this.zd ] - this.field[ q + this.zd ];

		}

	};

	// Returns total number of triangles. Fills triangles.
	// (this is where most of time is spent - it's inner work of O(n3) loop )

	this.polygonize = function( fx, fy, fz, q, isol, render_callback ) {

		// cache indices
		var q1 = q + 1,
			qy = q + this.yd,
			qz = q + this.zd,
			q1y = q1 + this.yd,
			q1z = q1 + this.zd,
			qyz = q + this.yd + this.zd,
			q1yz = q1 + this.yd + this.zd;

		var cubeindex = 0,
			field0 = this.field[ q ],
			field1 = this.field[ q1 ],
			field2 = this.field[ qy ],
			field3 = this.field[ q1y ],
			field4 = this.field[ qz ],
			field5 = this.field[ q1z ],
			field6 = this.field[ qyz ],
			field7 = this.field[ q1yz ];

		if ( field0 < isol ) cubeindex |= 1;
		if ( field1 < isol ) cubeindex |= 2;
		if ( field2 < isol ) cubeindex |= 8;
		if ( field3 < isol ) cubeindex |= 4;
		if ( field4 < isol ) cubeindex |= 16;
		if ( field5 < isol ) cubeindex |= 32;
		if ( field6 < isol ) cubeindex |= 128;
		if ( field7 < isol ) cubeindex |= 64;

		// if cube is entirely in/out of the surface - bail, nothing to draw

		var bits = THREE.edgeTable[ cubeindex ];
		if ( bits == 0 ) return 0;

		var d = this.delta,
			fx2 = fx + d, 
			fy2 = fy + d, 
			fz2 = fz + d;

		// top of the cube

		if ( bits & 1 ) { 

			this.compNorm( q );
			this.compNorm( q1 );
			this.VIntX( q * 3, this.vlist, this.nlist, 0, isol, fx, fy, fz, field0, field1 );

		};

		if ( bits & 2 ) { 

			this.compNorm( q1 );  
			this.compNorm( q1y );  
			this.VIntY( q1 * 3, this.vlist, this.nlist, 3, isol, fx2, fy, fz, field1, field3 );

		};

		if ( bits & 4 ) { 

			this.compNorm( qy ); 
			this.compNorm( q1y );  
			this.VIntX( qy * 3, this.vlist, this.nlist, 6, isol, fx, fy2, fz, field2, field3 ); 

		};

		if ( bits & 8 ) { 

			this.compNorm( q );
			this.compNorm( qy );
			this.VIntY( q * 3, this.vlist, this.nlist, 9, isol, fx, fy, fz, field0, field2 );

		};

		// bottom of the cube

		if ( bits & 16 )  { 

			this.compNorm( qz );
			this.compNorm( q1z );
			this.VIntX( qz * 3, this.vlist, this.nlist, 12, isol, fx, fy, fz2, field4, field5 ); 

		};

		if ( bits & 32 )  { 

			this.compNorm( q1z );  
			this.compNorm( q1yz ); 
			this.VIntY( q1z * 3,  this.vlist, this.nlist, 15, isol, fx2, fy, fz2, field5, field7 ); 

		};

		if ( bits & 64 ) {

			this.compNorm( qyz );
			this.compNorm( q1yz );
			this.VIntX( qyz * 3, this.vlist, this.nlist, 18, isol, fx, fy2, fz2, field6, field7 ); 

		};

		if ( bits & 128 ) {

			this.compNorm( qz );
			this.compNorm( qyz );
			this.VIntY( qz * 3,  this.vlist, this.nlist, 21, isol, fx, fy, fz2, field4, field6 ); 

		};

		// vertical lines of the cube

		if ( bits & 256 ) {

			this.compNorm( q );
			this.compNorm( qz );
			this.VIntZ( q * 3, this.vlist, this.nlist, 24, isol, fx, fy, fz, field0, field4 );

		};

		if ( bits & 512 ) {

			this.compNorm( q1 );
			this.compNorm( q1z );
			this.VIntZ( q1 * 3,  this.vlist, this.nlist, 27, isol, fx2, fy,  fz, field1, field5 ); 

		};

		if ( bits & 1024 ) {

			this.compNorm( q1y );
			this.compNorm( q1yz );
			this.VIntZ( q1y * 3, this.vlist, this.nlist, 30, isol, fx2, fy2, fz, field3, field7 ); 

		};

		if ( bits & 2048 ) { 

			this.compNorm( qy );
			this.compNorm( qyz );
			this.VIntZ( qy * 3, this.vlist, this.nlist, 33, isol, fx,  fy2, fz, field2, field6 ); 

		};

		cubeindex <<= 4;  // re-purpose cubeindex into an offset into triTable

		var o1, o2, o3, numtris = 0, i = 0;

		// here is where triangles are created

		while ( THREE.triTable[ cubeindex + i ] != -1 ) {

			o1 = cubeindex + i;
			o2 = o1 + 1;
			o3 = o1 + 2;

			this.posnormtriv( this.vlist, this.nlist,
							  3 * THREE.triTable[ o1 ],
							  3 * THREE.triTable[ o2 ],
							  3 * THREE.triTable[ o3 ],
							  render_callback );

			i += 3;
			numtris ++;

		}

		return numtris;

	};

	/////////////////////////////////////
	// Immediate render mode simulator
	/////////////////////////////////////

	this.posnormtriv = function( pos, norm, o1, o2, o3, render_callback ) {

		var c = this.count * 3;

		this.positionArray[ c ] = pos[ o1 ];
		this.positionArray[ c + 1 ] = pos[ o1 + 1 ];
		this.positionArray[ c + 2 ] = pos[ o1 + 2 ];

		this.positionArray[ c + 3 ] = pos[ o2 ];
		this.positionArray[ c + 4 ] = pos[ o2 + 1 ];
		this.positionArray[ c + 5 ] = pos[ o2 + 2 ];

		this.positionArray[ c + 6 ] = pos[ o3 ];
		this.positionArray[ c + 7 ] = pos[ o3 + 1 ];
		this.positionArray[ c + 8 ] = pos[ o3 + 2 ];

		this.normalArray[ c ] = norm[ o1 ]; 
		this.normalArray[ c + 1 ] = norm[ o1 + 1 ];
		this.normalArray[ c + 2 ] = norm[ o1 + 2 ];

		this.normalArray[ c + 3 ] = norm[ o2 ]; 
		this.normalArray[ c + 4 ] = norm[ o2 + 1 ];
		this.normalArray[ c + 5 ] = norm[ o2 + 2 ];

		this.normalArray[ c + 6 ] = norm[ o3 ]; 
		this.normalArray[ c + 7 ] = norm[ o3 + 1 ];
		this.normalArray[ c + 8 ] = norm[ o3 + 2 ];

		this.hasPos = true;
		this.hasNormal = true;

		this.count += 3;

		if ( this.count >= this.maxCount - 3 ) {

			render_callback( this );

		}

	};

	this.begin = function( ) {

		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

	};

	this.end = function( render_callback ) {

		if ( this.count == 0 )
			return;

		for ( var i = this.count * 3; i < this.positionArray.length; i++ )
			this.positionArray[ i ] = 0.0;

		render_callback( this );

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function( ballx, bally, ballz, strength, subtract ) {

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius ); if ( min_x < 1  ) min_x = 1;
		var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

		for ( z = min_z; z < max_z; z++ ) {

			z_offset = this.size2 * z,
			fz = z / this.size - ballz,
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx*fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) this.field[ y_offset + x ] += val;

				}

			}

		}

	};

	this.addPlaneX = function( strength, subtract ) {

		var x, y, z, xx, val, xdiv, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function( strength, subtract ) {

		var x, y, z, yy, val, ydiv, cy, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z++ )
						field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function( strength, subtract ) {

		var x, y, z, zz, val, zdiv, cz, cyz;

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y++ ) {

						cyz = cz + y * yd;

						for ( x = 0; x < size; x++ )
							field[ cyz + x ] += val;

				}

			}

		}

	};

	/////////////////////////////////////
	// Updates
	/////////////////////////////////////

	this.reset = function() {

		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;

		}

	};

	this.render = function( render_callback ) {

		this.begin();

		// Triangulate. Yeah, this is slow.

		var q, x, y, z, fx, fy, fz, y_offset, z_offset, smin2 = this.size - 2;

		for ( z = 1; z < smin2; z++ ) {

			z_offset = this.size2 * z;
			fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( y = 1; y < smin2; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( x = 1; x < smin2; x++ ) {

					fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					q = y_offset + x;

					this.polygonize( fx, fy, fz, q, this.isolation, render_callback );

				}

			}

		}

		this.end( render_callback );

	};

	this.generateGeometry = function() {

		var start = 0, geo = new THREE.Geometry();
		var normals = [];

		var geo_callback = function( object ) {

			var i, x, y, z, vertex, position, normal, 
				face, a, b, c, na, nb, nc;


			for ( i = 0; i < object.count; i++ ) {

				a = i * 3;
				b = a + 1;
				c = a + 2;

				x = object.positionArray[ a ];
				y = object.positionArray[ b ];
				z = object.positionArray[ c ];
				position = new THREE.Vector3( x, y, z );

				x = object.normalArray[ a ];
				y = object.normalArray[ b ];
				z = object.normalArray[ c ];
				normal = new THREE.Vector3( x, y, z );
				normal.normalize();

				vertex = new THREE.Vertex( position );

				geo.vertices.push( vertex );
				normals.push( normal );

			}

			nfaces = object.count / 3;

			for ( i = 0; i < nfaces; i++ ) {

				a = ( start + i ) * 3;
				b = a + 1;
				c = a + 2;

				na = normals[ a ];
				nb = normals[ b ];
				nc = normals[ c ];

				face = new THREE.Face3( a, b, c, [ na, nb, nc ] );

				geo.faces.push( face );

			}

			start += nfaces;
			object.count = 0;

		};

		this.render( geo_callback );

		// console.log( "generated " + geo.faces.length + " triangles" );

		return geo;

	};

	this.init( resolution );

};

THREE.MarchingCubes.prototype = new THREE.Object3D();
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;


/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

THREE.edgeTable = new Int32Array([
0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0])

THREE.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
/**
 * @author sroucheray / http://sroucheray.org/
 */

/**
 * @constructor
 * Three axis representing the cartesian coordinates
 * @param xAxisColor {number}
 * @param yAxisColor {number}
 * @param zAxisColor {number}
 * @param showArrows {Boolean}
 * @param length {number}
 * @param scale {number}
 * 
 * @see THREE.Trident.defaultParams
 */
THREE.Trident = function ( params /** Object */) {

	THREE.Object3D.call( this );
	
	var hPi = Math.PI / 2, cone;
	
	params = params || THREE.Trident.defaultParams;
	
	if(params !== THREE.Trident.defaultParams){
		for ( var key in THREE.Trident.defaultParams) {
			if(!params.hasOwnProperty(key)){
				params[key] = THREE.Trident.defaultParams[key];
			}
		}
	}
	
	this.scale = new THREE.Vector3( params.scale, params.scale, params.scale );
	this.addChild( getSegment( new THREE.Vector3(params.length,0,0), params.xAxisColor ) );
	this.addChild( getSegment( new THREE.Vector3(0,params.length,0), params.yAxisColor ) );
	this.addChild( getSegment( new THREE.Vector3(0,0,params.length), params.zAxisColor ) );
	
	if(params.showArrows){
		cone = getCone(params.xAxisColor);
		cone.rotation.y = - hPi;
		cone.position.x = params.length;
		this.addChild( cone );
		
		cone = getCone(params.yAxisColor);
		cone.rotation.x = hPi;
		cone.position.y = params.length;
		this.addChild( cone );
		
		cone = getCone(params.zAxisColor);
		cone.rotation.y = Math.PI;
		cone.position.z = params.length;
		this.addChild( cone );
	}

	function getCone ( color ) {
		//0.1 required to get a cone with a mapped bottom face
		return new THREE.Mesh( new THREE.CylinderGeometry( 30, 0.1, params.length / 20, params.length / 5 ), new THREE.MeshBasicMaterial( { color : color } ) );
	}

	function getSegment ( point, color ){
		var geom = new THREE.Geometry();
		geom.vertices = [new THREE.Vertex(), new THREE.Vertex(point)];
		return new THREE.Line( geom, new THREE.LineBasicMaterial( { color : color } ) );
	}
};

THREE.Trident.prototype = new THREE.Object3D();
THREE.Trident.prototype.constructor = THREE.Trident;

THREE.Trident.defaultParams = {
		xAxisColor : 0xFF0000,
		yAxisColor : 0x00FF00,
		zAxisColor : 0x0000FF,
		showArrows : true,
		length : 100,
		scale : 1
};
/**
 * @author bartek drozdz / http://everyday3d.com/
 */

THREE.PlaneCollider = function( point, normal ) {

	this.point = point;
	this.normal = normal;

};


THREE.SphereCollider = function( center, radius ) {

	this.center = center;
	this.radius = radius;
	this.radiusSq = radius * radius;

};

THREE.BoxCollider = function( min, max ) {

	this.min = min;
	this.max = max;
	this.dynamic = true;

	this.normal = new THREE.Vector3();

};

THREE.MeshCollider = function( mesh, box ) {

	this.mesh = mesh;
	this.box = box;
	this.numFaces = this.mesh.geometry.faces.length;

	this.normal = new THREE.Vector3();

};

THREE.CollisionSystem = function() {

	this.collisionNormal = new THREE.Vector3();
	this.colliders = [];
	this.hits = [];

	// console.log("Collision system init / 004");

};

THREE.Collisions = new THREE.CollisionSystem();

THREE.CollisionSystem.prototype.merge = function( collisionSystem ) {

	this.colliders = this.colliders.concat( collisionSystem.colliders );
	this.hits = this.hits.concat( collisionSystem.hits );

};

THREE.CollisionSystem.prototype.rayCastAll = function( ray ) {

	ray.direction.normalize();

	this.hits.length = 0;

	var i, l, d, collider,
		ld = 0;

	for ( i = 0, l = this.colliders.length; i < l; i++ ) {

		collider = this.colliders[ i ];

		d = this.rayCast( ray, collider );

		if ( d < Number.MAX_VALUE ) {

			collider.distance = d;

			if ( d > ld )
				this.hits.push( collider );
			else
				this.hits.unshift( collider );

			ld = d;

		}

	}

	return this.hits;

};

THREE.CollisionSystem.prototype.rayCastNearest = function( ray ) {

	var cs = this.rayCastAll( ray );

	if( cs.length == 0 ) return null;

	var i = 0;

	while( cs[ i ] instanceof THREE.MeshCollider ) {

        var dist_index = this.rayMesh ( ray, cs[ i ] );

		if( dist_index.dist < Number.MAX_VALUE ) {

			cs[ i ].distance = dist_index.dist;
            cs[ i ].faceIndex = dist_index.faceIndex;
			break;

		}

		i++;

	}

	if ( i > cs.length ) return null;

	return cs[ i ];

};

THREE.CollisionSystem.prototype.rayCast = function( ray, collider ) {

	if ( collider instanceof THREE.PlaneCollider )
		return this.rayPlane( ray, collider );

	else if ( collider instanceof THREE.SphereCollider )
		return this.raySphere( ray, collider );

	else if ( collider instanceof THREE.BoxCollider )
		return this.rayBox( ray, collider );

	else if ( collider instanceof THREE.MeshCollider && collider.box )
		return this.rayBox( ray, collider.box );

};

THREE.CollisionSystem.prototype.rayMesh = function( r, me ) {

	var rt = this.makeRayLocal( r, me.mesh );

	var d = Number.MAX_VALUE;
    var nearestface;

	for( var i = 0; i < me.numFaces; i++ ) {
        var face = me.mesh.geometry.faces[i];
        var p0 = me.mesh.geometry.vertices[ face.a ].position;
        var p1 = me.mesh.geometry.vertices[ face.b ].position;
        var p2 = me.mesh.geometry.vertices[ face.c ].position;
        var p3 = face instanceof THREE.Face4 ? me.mesh.geometry.vertices[ face.d ].position : null;

        if (face instanceof THREE.Face3) {
            var nd = this.rayTriangle( rt, p0, p1, p2, d, this.collisionNormal, me.mesh );

            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
        
        }
        
        else if (face instanceof THREE.Face4) {
            
            var nd = this.rayTriangle( rt, p0, p1, p3, d, this.collisionNormal, me.mesh );
            
            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
            
            nd = this.rayTriangle( rt, p1, p2, p3, d, this.collisionNormal, me.mesh );
            
            if( nd < d ) {

                d = nd;
                nearestface = i;
                me.normal.copy( this.collisionNormal );
                me.normal.normalize();

            }
            
        }

	}

	return {dist: d, faceIndex: nearestface};

};

THREE.CollisionSystem.prototype.rayTriangle = function( ray, p0, p1, p2, mind, n, mesh ) {

	var e1 = THREE.CollisionSystem.__v1,
		e2 = THREE.CollisionSystem.__v2;
	
	n.set( 0, 0, 0 );

	// do not crash on quads, fail instead

	e1.sub( p1, p0 );
	e2.sub( p2, p1 );
	n.cross( e1, e2 )

	var dot = n.dot( ray.direction );
	if ( !( dot < 0 ) ) {
		
		if ( mesh.doubleSided || mesh.flipSided ) {
		
			n.multiplyScalar (-1.0);
			dot *= -1.0;
		
		} else {
			
			return Number.MAX_VALUE;
		
		}
	
	}

	var d = n.dot( p0 );
	var t = d - n.dot( ray.origin );

	if ( !( t <= 0 ) ) return Number.MAX_VALUE;
	if ( !( t >= dot * mind ) ) return Number.MAX_VALUE;

	t = t / dot;

	var p = THREE.CollisionSystem.__v3;

	p.copy( ray.direction );
	p.multiplyScalar( t );
	p.addSelf( ray.origin );

	var u0, u1, u2, v0, v1, v2;

	if ( Math.abs( n.x ) > Math.abs( n.y ) ) {

		if ( Math.abs( n.x ) > Math.abs( n.z ) ) {

			u0 = p.y  - p0.y;
			u1 = p1.y - p0.y;
			u2 = p2.y - p0.y;

			v0 = p.z  - p0.z;
			v1 = p1.z - p0.z;
			v2 = p2.z - p0.z;

		} else {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.y  - p0.y;
			v1 = p1.y - p0.y;
			v2 = p2.y - p0.y;

		}

	} else {

		if( Math.abs( n.y ) > Math.abs( n.z ) ) {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.z  - p0.z;
			v1 = p1.z - p0.z;
			v2 = p2.z - p0.z;

		} else {

			u0 = p.x  - p0.x;
			u1 = p1.x - p0.x;
			u2 = p2.x - p0.x;

			v0 = p.y  - p0.y;
			v1 = p1.y - p0.y;
			v2 = p2.y - p0.y;

		}

	}

	var temp = u1 * v2 - v1 * u2;
	if( !(temp != 0) ) return Number.MAX_VALUE;
	//console.log("temp: " + temp);
	temp = 1 / temp;

	var alpha = ( u0 * v2 - v0 * u2 ) * temp;
	if( !(alpha >= 0) ) return Number.MAX_VALUE;
	//console.log("alpha: " + alpha);

	var beta = ( u1 * v0 - v1 * u0 ) * temp;
	if( !(beta >= 0) ) return Number.MAX_VALUE;
	//console.log("beta: " + beta);

	var gamma = 1 - alpha - beta;
	if( !(gamma >= 0) ) return Number.MAX_VALUE;
	//console.log("gamma: " + gamma);

	return t;

};

THREE.CollisionSystem.prototype.makeRayLocal = function( ray, m ) {

	var mt = THREE.CollisionSystem.__m;
	THREE.Matrix4.makeInvert( m.matrixWorld, mt );

	var rt = THREE.CollisionSystem.__r;
	rt.origin.copy( ray.origin );
	rt.direction.copy( ray.direction );

	mt.multiplyVector3( rt.origin );
	mt.rotateAxis( rt.direction );
	rt.direction.normalize();
	//m.localRay = rt;

	return rt;

};

THREE.CollisionSystem.prototype.rayBox = function( ray, ab ) {

	var rt;

	if ( ab.dynamic && ab.mesh && ab.mesh.matrixWorld ) {

		rt = this.makeRayLocal( ray, ab.mesh );

	} else {

		rt = THREE.CollisionSystem.__r;
		rt.origin.copy( ray.origin );
		rt.direction.copy( ray.direction );

	}

	var xt = 0, yt = 0, zt = 0;
	var xn = 0, yn = 0, zn = 0;
	var ins = true;

	if( rt.origin.x < ab.min.x ) {

		xt = ab.min.x - rt.origin.x;
		//if(xt > ray.direction.x) return return Number.MAX_VALUE;
		xt /= rt.direction.x;
		ins = false;
		xn = -1;

	} else if( rt.origin.x > ab.max.x ) {

		xt = ab.max.x - rt.origin.x;
		//if(xt < ray.direction.x) return return Number.MAX_VALUE;
		xt /= rt.direction.x;
		ins = false;
		xn = 1;

	}

	if( rt.origin.y < ab.min.y ) {

		yt = ab.min.y - rt.origin.y;
		//if(yt > ray.direction.y) return return Number.MAX_VALUE;
		yt /= rt.direction.y;
		ins = false;
		yn = -1;

	} else if( rt.origin.y > ab.max.y ) {

		yt = ab.max.y - rt.origin.y;
		//if(yt < ray.direction.y) return return Number.MAX_VALUE;
		yt /= rt.direction.y;
		ins = false;
		yn = 1;

	}

	if( rt.origin.z < ab.min.z ) {

		zt = ab.min.z - rt.origin.z;
		//if(zt > ray.direction.z) return return Number.MAX_VALUE;
		zt /= rt.direction.z;
		ins = false;
		zn = -1;

	} else if( rt.origin.z > ab.max.z ) {

		zt = ab.max.z - rt.origin.z;
		//if(zt < ray.direction.z) return return Number.MAX_VALUE;
		zt /= rt.direction.z;
		ins = false;
		zn = 1;

	}

	if( ins ) return -1;

	var which = 0;
	var t = xt;

	if( yt > t ) {

		which = 1;
		t = yt;

	}

	if ( zt > t ) {

		which = 2;
		t = zt;

	}

	switch( which ) {

		case 0:

			var y = rt.origin.y + rt.direction.y * t;
			if ( y < ab.min.y || y > ab.max.y ) return Number.MAX_VALUE;
			var z = rt.origin.z + rt.direction.z * t;
			if ( z < ab.min.z || z > ab.max.z ) return Number.MAX_VALUE;
			ab.normal.set( xn, 0, 0 );
			break;

		case 1:

			var x = rt.origin.x + rt.direction.x * t;
			if ( x < ab.min.x || x > ab.max.x ) return Number.MAX_VALUE;
			var z = rt.origin.z + rt.direction.z * t;
			if ( z < ab.min.z || z > ab.max.z ) return Number.MAX_VALUE;
			ab.normal.set( 0, yn, 0) ;
			break;

		case 2:

			var x = rt.origin.x + rt.direction.x * t;
			if ( x < ab.min.x || x > ab.max.x ) return Number.MAX_VALUE;
			var y = rt.origin.y + rt.direction.y * t;
			if ( y < ab.min.y || y > ab.max.y ) return Number.MAX_VALUE;
			ab.normal.set( 0, 0, zn );
			break;

	}

	return t;

};

THREE.CollisionSystem.prototype.rayPlane = function( r, p ) {

	var t = r.direction.dot( p.normal );
	var d = p.point.dot( p.normal );
	var ds;

	if( t < 0 ) ds = ( d - r.origin.dot( p.normal ) ) / t;
	else return Number.MAX_VALUE;

	if( ds > 0 ) return ds;
	else return Number.MAX_VALUE;

};

THREE.CollisionSystem.prototype.raySphere = function( r, s ) {

	var e = s.center.clone().subSelf( r.origin );
	if ( e.lengthSq < s.radiusSq ) return -1;

	var a = e.dot( r.direction.clone() );
	if ( a <= 0 ) return Number.MAX_VALUE;

	var t = s.radiusSq - ( e.lengthSq() - a * a );
	if ( t >= 0 ) return Math.abs( a ) - Math.sqrt( t );

	return Number.MAX_VALUE;

};

THREE.CollisionSystem.__v1 = new THREE.Vector3();
THREE.CollisionSystem.__v2 = new THREE.Vector3();
THREE.CollisionSystem.__v3 = new THREE.Vector3();
THREE.CollisionSystem.__nr = new THREE.Vector3();
THREE.CollisionSystem.__m = new THREE.Matrix4();
THREE.CollisionSystem.__r = new THREE.Ray();
/**
 * @author bartek drozdz / http://everyday3d.com/
 */

THREE.CollisionUtils = {};

// @params m THREE.Mesh
// @returns CBox dynamic Object Bounding Box

THREE.CollisionUtils.MeshOBB = function( m ) {

	m.geometry.computeBoundingBox();
	var b = m.geometry.boundingBox;
	var min = new THREE.Vector3( b.x[0], b.y[0], b.z[0] );
	var max = new THREE.Vector3( b.x[1], b.y[1], b.z[1] );
	var box = new THREE.BoxCollider( min, max );
	box.mesh = m;
	return box;

}

// @params m THREE.Mesh
// @returns CBox static Axis-Aligned Bounding Box
//
// The AABB is calculated based on current
// position of the object (assumes it won't move)

THREE.CollisionUtils.MeshAABB = function( m ) {

	var box = THREE.CollisionUtils.MeshOBB( m );
	box.min.addSelf( m.position );
	box.max.addSelf( m.position );
	box.dynamic = false;
	return box;

};

// @params m THREE.Mesh
// @returns CMesh with aOOB attached (that speeds up intersection tests)

THREE.CollisionUtils.MeshColliderWBox = function( m ) {

	var mc = new THREE.MeshCollider( m, THREE.CollisionUtils.MeshOBB( m ) );

	return mc;

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.AnaglyphWebGLRenderer = function ( parameters ) {	

		THREE.WebGLRenderer.call( this, parameters );

		var _this = this, _setSize = this.setSize, _render = this.render;
		var _cameraL = new THREE.Camera(), _cameraR = new THREE.Camera();
		var eyeRight = new THREE.Matrix4(),
			eyeLeft = new THREE.Matrix4(),
			focalLength = 125,
			aspect, near, fov;
	
		_cameraL.useTarget = _cameraR.useTarget = false;
		_cameraL.matrixAutoUpdate = _cameraR.matrixAutoUpdate = false;

		var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };
		var _renderTargetL = new THREE.WebGLRenderTarget( 512, 512, _params ), _renderTargetR = new THREE.WebGLRenderTarget( 512, 512, _params );

		var _camera = new THREE.Camera( 53, 1, 1, 10000 );
		_camera.position.z = 2;

		_material = new THREE.MeshShaderMaterial( {

			uniforms: {

				"mapLeft": { type: "t", value: 0, texture: _renderTargetL },
				"mapRight": { type: "t", value: 1, texture: _renderTargetR }

			},
			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = vec2( uv.x, 1.0 - uv.y );",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),
			fragmentShader: [

				"uniform sampler2D mapLeft;",
				"uniform sampler2D mapRight;",
				"varying vec2 vUv;",

				"void main() {",

					"vec4 colorL, colorR;",
					"vec2 uv = vUv;",

					"colorL = texture2D( mapLeft, uv );",
					"colorR = texture2D( mapRight, uv );",

					// http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

					"gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

				"}"

				].join("\n")

		} );

		var _scene = new THREE.Scene();
		_scene.addObject( new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), _material ) );

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_renderTargetL.width = width;
			_renderTargetL.height = height;

			_renderTargetR.width = width;
			_renderTargetR.height = height;

		};

		/*
		 * Renderer now uses an asymmetric perspective projection (http://paulbourke.net/miscellaneous/stereographics/stereorender/). 
		 * Each camera is offset by the eye seperation and its projection matrix is also skewed asymetrically back to converge on the same
		 * projection plane. Added a focal length parameter to, this is where the parallax is equal to 0. 
		 */
		this.render = function ( scene, camera, renderTarget, forceClear ) {	
		
		
			camera.update( null, true );
		
			var hasCameraChanged = 	aspect !== camera.aspect || near !== camera.near || fov !== camera.fov;
								
			if( hasCameraChanged ) {
		
				aspect = camera.aspect;
				near = camera.near;
				fov = camera.fov;	
		
				var projectionMatrix = camera.projectionMatrix.clone(),
					eyeSep = focalLength / 30 * 0.5,
					eyeSepOnProjection = eyeSep * near / focalLength,
					ymax = near * Math.tan( fov * Math.PI / 360 ),
					xmin, xmax;

				//translate xOffset
				eyeRight.n14 = eyeSep;
				eyeLeft.n14 = -eyeSep;
	
				//For left eye
				xmin = -ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;
				projectionMatrix.n11 = 2 * near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );
				_cameraL.projectionMatrix = projectionMatrix.clone();
			
				//for right eye		
				xmin = -ymax * aspect - eyeSepOnProjection;
				xmax = ymax * aspect - eyeSepOnProjection;
				projectionMatrix.n11 = 2 * near / ( xmax - xmin );
				projectionMatrix.n13 = ( xmax + xmin ) / ( xmax - xmin );
				_cameraR.projectionMatrix = projectionMatrix.clone();
				
			}	
		
			_cameraL.matrix = camera.matrixWorld.clone().multiplySelf( eyeLeft );
			_cameraL.update(null, true);
			_cameraL.position.copy( camera.position );
			_cameraL.near = near;
			_cameraL.far = camera.far;
			_render.call( _this, scene, _cameraL, _renderTargetL, true );

			_cameraR.matrix = camera.matrixWorld.clone().multiplySelf( eyeRight );
			_cameraR.update(null, true);
			_cameraR.position.copy( camera.position );
			_cameraR.near = near;
			_cameraR.far = camera.far;
			_render.call( _this, scene, _cameraR, _renderTargetR, true );
		
			_render.call( _this, _scene, _camera );

		};

	};
	
}
/**
 * @author alteredq / http://alteredqualia.com/
 */

if ( THREE.WebGLRenderer ) {

	THREE.CrosseyedWebGLRenderer = function ( parameters ) {

		THREE.WebGLRenderer.call( this, parameters );

		this.autoClear = false;

		var _this = this, _setSize = this.setSize, _render = this.render;

		var _width, _height;
	
		var _cameraL = new THREE.Camera(), 
			_cameraR = new THREE.Camera();

		_this.separation = 10;
		if ( parameters && parameters.separation !== undefined ) _this.separation = parameters.separation;

		var SCREEN_WIDTH  = window.innerWidth;
		var SCREEN_HEIGHT = window.innerHeight;
		var HALF_WIDTH = SCREEN_WIDTH / 2;
	
		var _camera = new THREE.Camera( 53, HALF_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		_camera.position.z = -10;
	

		this.setSize = function ( width, height ) {

			_setSize.call( _this, width, height );

			_width = width/2;
			_height = height;

		};

		this.render = function ( scene, camera, renderTarget, forceClear ) {
		
			this.clear();

			_cameraL.fov = camera.fov;
			_cameraL.aspect = 0.5 * camera.aspect;
			_cameraL.near = camera.near;
			_cameraL.far = camera.far;
			_cameraL.updateProjectionMatrix();
		
			_cameraL.position.copy( camera.position );
			_cameraL.target.position.copy( camera.target.position );
			_cameraL.translateX( _this.separation );

			_cameraR.projectionMatrix = _cameraL.projectionMatrix;

			_cameraR.position.copy( camera.position );
			_cameraR.target.position.copy( camera.target.position );
			_cameraR.translateX( - _this.separation );

			this.setViewport( 0, 0, _width, _height );
			_render.call( _this, scene, _cameraL );
		
			this.setViewport( _width, 0, _width, _height );
			_render.call( _this, scene, _cameraR, false );

		};

	};
	
}
