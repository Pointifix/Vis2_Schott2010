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

let DoFShader = {
    uniforms: {
        "u_size": {value: new Vector3(1, 1, 1)},
        "u_screen_size": {value: new Vector2(1, 1)},
        "u_volume": {value: null},
        "u_prev": {value: null},
        "depthCoord": {value: null},
        "distance": {value: null},
        "circleOfConf": {value: null},
        "u_transfer": {value: null},
        "FRONT2BACK": {value: null}
    },
    vertexShader: null,
    fragmentShader: null,
};

let request = new XMLHttpRequest();

request.open('GET', "./js/shaders/DoFShader/DoFVertexShader.glsl", false);
request.send('');
DoFShader.vertexShader = request.responseText;

request.open('GET', "./js/shaders/DoFShader/DoFFragmentShader.glsl", false);
request.send('');
DoFShader.fragmentShader = request.responseText;

export {DoFShader};
