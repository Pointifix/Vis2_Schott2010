uniform float depthCoord;
uniform float circleOfConf;

out vec2 Ct;
out vec4 frag_pos;

void main()
{
    // CIRCLE OF CONFUSION
	float newC = 2.0f * tan(radians(5.0f /2.0f)) * circleOfConf;
	vec4 C = vec4(newC, newC, depthCoord, 1);

	// this bias is correct
	mat4 transProjMatrix = mat4( 0.5, 0.0, 0.0, 0.5,  0.0, 0.5, 0.0, 0.5,  0.0, 0.0, 0.5, 0.5,  0.0, 0.0, 0.0, 1.0);

	C = transProjMatrix * C;
	Ct = vec2(C.x / C.w, C.y / C.w);

	frag_pos = modelMatrix * vec4(position, 1.0);

	vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * modelViewPosition;
}
