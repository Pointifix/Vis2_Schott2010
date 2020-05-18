precision highp float;
precision mediump sampler3D;

uniform sampler3D u_volume;
uniform vec3 u_size;

uniform sampler2D u_prev;
uniform vec2 u_screen_size;

in vec4 frag_pos;

void main()	{
	vec4 volume_sample = texture(u_volume, ((frag_pos.xyz + u_size / 2.0f) / u_size));

	vec4 outColor = texture(u_prev, gl_FragCoord.xy / u_screen_size);

	if (volume_sample.r > 0.15) outColor += vec4(1.0);

	gl_FragColor = outColor;
}
