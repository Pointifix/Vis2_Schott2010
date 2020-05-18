precision highp float;
precision mediump sampler3D;

uniform sampler2D u_f2b, u_b2f;
uniform vec2 u_screen_size;

in vec4 frag_pos;

void main()	{
    vec4 f2b = texture(u_f2b, gl_FragCoord.xy / u_screen_size);
    vec4 b2f = texture(u_b2f, gl_FragCoord.xy / u_screen_size);

    gl_FragColor = (f2b + b2f);
}
