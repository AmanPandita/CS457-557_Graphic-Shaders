#version 330 compatibility

uniform float uK, uP, uEta;

out vec3 vNs;
out vec3 vEs;
out vec3 vMC;
out vec3 vRefractVector;
out vec3 vReflectVector;

const float PI = 3.14159265359;

void
main()
{
	
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	
	vec4 dmp = vec4(x, y, uK * (1. - y) * sin(2 * PI * x / uP), 1.);
	vMC = dmp.xyz;

	vec4 ECposition = gl_ModelViewMatrix * dmp;
	
	float dzdx = uK * (1.-y) * (2.*PI/uP) * cos( 2.*PI*x/uP );
	float dzdy = -uK * sin( 2.*PI*x/uP );

	vec3 normal = normalize(gl_NormalMatrix * (cross( vec3(1., 0., dzdx), vec3(0., 1., dzdy ))));
	vec3 eyeDir = normalize(ECposition.xyz);

	vNs = normal;
	vEs = ECposition.xyz - vec3(0., 0., 0.);
	
	vRefractVector = refract(eyeDir, normal, uEta);
	vReflectVector = reflect(eyeDir, normal);

	gl_Position = gl_ModelViewProjectionMatrix * dmp;
}