precision highp float;
precision mediump sampler3D;

uniform sampler3D u_volume;
uniform vec3 u_size;

uniform sampler2D u_prev;
uniform vec2 u_screen_size;

uniform int FRONT2BACK;

in vec4 frag_pos;

in vec2 Ct;

void main()    {
    vec4 volume_sample = texture(u_volume, ((frag_pos.xyz + u_size / 2.0f) / u_size));
    vec2 texCoord2 = (gl_FragCoord.xy / u_screen_size);
    vec4 blurred = vec4(0);

    vec2 Ct2 = Ct / 2.0;
    vec2 t1 = texCoord2.xy + vec2 (-Ct2.x, -Ct2.y);
    vec2 t2 = texCoord2.xy + vec2 (Ct2.x, -Ct2.y);
    vec2 t3 = texCoord2.xy + vec2 (-Ct2.x, Ct2.y);
    vec2 t4 = texCoord2.xy + vec2 (Ct2.x, Ct2.y);

    blurred = blurred + texture(u_prev, t1);
    blurred = blurred + texture(u_prev, t2);
    blurred = blurred + texture(u_prev, t3);
    blurred = blurred + texture(u_prev, t4);

    blurred = blurred / 4.0;

    vec4 source = volume_sample;
    source.a = volume_sample.r;
    vec4 outColor = vec4(0.0);

    if (FRONT2BACK != 1)
    {
        outColor = source + blurred * (1.0 - source.a);
    }
    else
    {
        outColor = source * (1.0 - blurred.a) + blurred;
    }

    gl_FragColor = outColor;
}
