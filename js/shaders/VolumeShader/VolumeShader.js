/**
 * @author Almar Klein / http://almarklein.org
 *
 * Shaders to render 3D volumes using raycasting.
 * The applied techniques are based on similar implementations in the Visvis and Vispy projects.
 * This is not the only approach, therefore it's marked 1.
 */

import {
    Vector3,
    Vector2
} from "../../../build/three.module.js";
import * as THREE from "../../../build/three.module.js";

let VolumeShader = {
    uniforms: {
        "u_screen_size": {value: new Vector2(1, 1)},
        "u_f2b": {value: null},
        "u_b2f": {value: null}
    },
    vertexShader: null,
    fragmentShader: null,
};

let request = new XMLHttpRequest();

request.open('GET', "./js/shaders/VolumeShader/volumeVertexShader.glsl", false);
request.send('');
VolumeShader.vertexShader = request.responseText;

request.open('GET', "./js/shaders/VolumeShader/volumeFragmentShader.glsl", false);
request.send('');
VolumeShader.fragmentShader = request.responseText;

export {VolumeShader};
