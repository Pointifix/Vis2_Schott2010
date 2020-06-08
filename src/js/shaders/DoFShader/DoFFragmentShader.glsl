precision highp float;
precision mediump sampler3D;

uniform sampler3D u_volume;
uniform vec3 u_size;

uniform sampler2D u_prev;
uniform vec2 u_screen_size;

uniform sampler2D u_transfer;

uniform bool u_front_to_back;
uniform float u_threshold;

in vec4 frag_pos;
in vec2 C_t;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.3846153846) * direction;
    vec2 off2 = vec2(3.2307692308) * direction;
    color += texture2D(image, uv) * 0.2270270270;
    color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
    color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
    color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
    color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
    return color;
}

void main()
{
    vec4 volume_sample = texture(u_volume, ((frag_pos.xyz + u_size / 2.0f) / u_size));
    vec2 texCoord2 = (gl_FragCoord.xy / u_screen_size);
    vec4 blurred = vec4(0.0);

    blurred += blur9(u_prev, texCoord2, u_screen_size, vec2(0, C_t.x * u_screen_size.y));
    blurred += blur9(u_prev, texCoord2, u_screen_size, vec2(C_t.y * u_screen_size.x, 0));
    blurred = blurred / 2.0;

    vec4 source = vec4(0.0);
    if (volume_sample.r > u_threshold) source = vec4(volume_sample.r) * 0.1f;

    vec4 outColor = vec4(0.0);

    if (u_front_to_back)
    {
        outColor = source + blurred * (1.0 - source.a);
    }
    else
    {
        outColor = source * (1.0 - blurred.a) + blurred;
    }

    gl_FragColor = outColor;
}
