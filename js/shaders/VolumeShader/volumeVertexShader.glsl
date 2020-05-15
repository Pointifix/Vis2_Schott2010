varying vec4 v_nearpos;
varying vec4 v_farpos;
varying vec3 v_position;

out vec4 frag_pos;

void main() {
    frag_pos = modelMatrix * vec4(position, 1.0);

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
