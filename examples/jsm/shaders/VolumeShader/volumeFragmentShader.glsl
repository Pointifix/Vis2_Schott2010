precision highp float;
precision mediump sampler3D;

uniform sampler3D u_volume;
uniform vec3 u_size;

in vec4 frag_pos;

void main()	{
    vec4 volume_sample = texture(u_volume, ((frag_pos.xyz + u_size / 2.0f) / u_size));

    if (volume_sample.r > 0.15) gl_FragColor = vec4(1, 1, 1, 1.0);
    else discard;
}
