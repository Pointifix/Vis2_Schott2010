/**
 * @author Almar Klein / http://almarklein.org
 *
 * Shaders to render 3D volumes using raycasting.
 * The applied techniques are based on similar implementations in the Visvis and Vispy projects.
 * This is not the only approach, therefore it's marked 1.
 */

import {
	Vector2,
	Vector3
} from "../../../build/three.module.js";
import * as THREE from "../../../build/three.module.js";

var VolumeRenderShader1 = {
	uniforms: {
		"u_size": { value: new Vector3( 1, 1, 1 ) },
		"u_renderstyle": { value: 0 },
		"u_renderthreshold": { value: 0.5 },
		"u_clim": { value: new Vector2( 1, 1 ) },
		"u_data": { value: null },
		"u_cmdata": { value: null }
	},
	vertexShader: null,
	fragmentShader: null
};

var loader = new THREE.FileLoader();
loader.load('jsm/shaders/volumeVertexShader.glsl', function ( data ) { VolumeRenderShader1.vertexShader = data; });
loader.load('jsm/shaders/volumeFragmentShader.glsl', function ( data ) { VolumeRenderShader1.fragmentShader = data;	});

export { VolumeRenderShader1 };
