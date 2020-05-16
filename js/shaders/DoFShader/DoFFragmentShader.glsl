

out vec4 OutputColor;


uniform sampler2D previousTexture;
uniform sampler2D volumeTexture;

in vec2 Ct;
in vec2 frag_pos;

uniform float distance;
uniform int FRONT2BACK;

vec4 transform(float greyvalue) {

	vec3 tmpColor = vec3(0);
	float tmpOpac = 0;
	int counter = 0;
	for(int i = 0; i < numberOfTF; i++) {
		if(tf[i].firstValue <= greyvalue && greyvalue < tf[i].secondValue) {
			counter++;
			tmpColor = tf[i].color;
			tmpOpac += tf[i].optValue;
		}
	}

	if(counter > 1)
		tmpOpac /= counter;

	return vec4(tmpColor, tmpOpac);
}

void main()	{
	float gv = texture(volumeTexture, frag_pos).r * 255;
	vec4 shaded = transform(gv);

	vec4 blurred = vec4(0);

	// loop over pi within Ct
	vec2 texCoord = frag_pos.xy;

	vec2 Ct2 = Ct / 2;
	vec2 t1 = texCoord.xy + vec2 (-Ct2.x, -Ct2.y);
	vec2 t2 = texCoord.xy + vec2 (Ct2.x, -Ct2.y);
	vec2 t3 = texCoord.xy + vec2 (-Ct2.x, Ct2.y);
	vec2 t4 = texCoord.xy + vec2 (Ct2.x, Ct2.y);

	blurred = blurred + texture(previousTexture, t1);
	blurred = blurred + texture(previousTexture, t2);
	blurred = blurred + texture(previousTexture, t3);
	blurred = blurred + texture(previousTexture, t4);

	blurred = blurred / 4.0; // N = 4

	vec4 source = shaded * shaded.a;
	source.a = shaded.a;
	vec4 destination = blurred;

	if (FRONT2BACK == 1) {
		OutputColor = source * (1 - destination.a) + destination;
	} else {
		OutputColor = source + destination * (1 - source.a);
	}
}
