#version 330 compatibility

in vec3 vNs;
in vec3 vEs;
in vec3 vMC;
in vec3 vRefractVector;
in vec3 vReflectVector;

uniform float uEta, uMix, uWhiteMix;
uniform float uNoiseAmp, uNoiseFreq;
uniform samplerCube uReflectUnit, uRefractUnit;
uniform sampler3D Noise3; 

const vec3 WHITE = vec3(1., 1., 1.);

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main() {
	vec4 nvx = texture( Noise3, uNoiseFreq * vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    		
	vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

	vec3 reflectColor, refractColor, refractVec, reflectVec;

	refractVec = normalize(gl_NormalMatrix * RotateNormal(angx, angy, vRefractVector));
	reflectVec = normalize(gl_NormalMatrix * RotateNormal(angx, angy, vReflectVector));
	
	reflectColor = texture(uReflectUnit, reflectVec).rgb;

	if(all(equal(refractVec, vec3(0., 0., 0.)))){
		refractColor = reflectColor;
	}
	else{
		refractColor = texture(uRefractUnit, refractVec).rgb;
		refractColor = mix(refractColor, WHITE, uWhiteMix);
	}

	gl_FragColor = vec4(mix(refractColor, reflectColor, uMix), 1.);
}