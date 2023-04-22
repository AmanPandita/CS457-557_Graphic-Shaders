#version 330 compatibility

out vec3  vMCposition;
out vec3 vNormal;
out vec2  vST;

const vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vNormal    = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	

	vMCposition  = gl_Vertex.xyz;
	gl_Position = gl_Vertex;
}