/**
 * @author Almar Klein / http://almarklein.org
 *
 * Shaders to render 3D volumes using raycasting.
 * The applied techniques are based on similar implementations in the Visvis and Vispy projects.
 * This is not the only approach, therefore it's marked 1.
 */

import {
	Vector3
} from "../../../build/three.module.js";
import * as THREE from "../../../build/three.module.js";

let VolumeRenderShader1 = {
	uniforms: {
		"u_size": { value: new Vector3( 0.5, 1, 1 ) },
		"u_volume": { value: null }
	},
	vertexShader: null,
	fragmentShader: null
};

let loader = new THREE.FileLoader();
loader.load("./js/shaders/VolumeShader/volumeVertexShader.glsl", function ( data ) { VolumeRenderShader1.vertexShader = data; });
loader.load("./js/shaders/VolumeShader/volumeFragmentShader.glsl", function ( data ) { VolumeRenderShader1.fragmentShader = data;	});

export { VolumeRenderShader1 };
