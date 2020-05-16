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

let DoFShader = {
    uniforms: {
        "depthCoord": {value: null},
        "circleOfConf": {value: null}
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
