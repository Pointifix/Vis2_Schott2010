uniform float u_distance;
uniform float circleOfConf;

out vec2 C_t;
out vec4 frag_pos;

void main()
{
	//Computation as in the paper - Equation 9-11 and pseudo code
	float new_c = 2.0f * tan(radians(10.0f /2.0f)) * u_distance * circleOfConf * 0.01f;
	vec4 C = vec4(new_c, new_c, u_distance, 1);

	mat4 transProjMatrix = mat4(
		0.5, 0.0, 0.0, 0.5,
		0.0, 0.5, 0.0, 0.5,
		0.0, 0.0, 0.5, 0.5,
		0.0, 0.0, 0.0, 1.0
	);

	C = transProjMatrix * C;
	C_t = vec2(C.x / C.w, C.y / C.w);

	frag_pos = modelMatrix * vec4(position, 1.0);

	vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}
