#version 330 compatibility

uniform float uScenter;
uniform float uTcenter;					
uniform float uDs;		
uniform float uDt;		
uniform bool uRec2Cir;				
uniform float uRadius;			
uniform float uMagFactor;			
uniform float uRotAngle;		
uniform float uSharpFactor;				
uniform sampler2D uImageUnit;

in vec2 vST;

void
main( )
{
	vec3 rgb;
	vec2 stp;
	bool testFlag;

	float s = vST.s;
	float t = vST.t;

	//boundary for rec
	float sMin = uScenter - uDs/2;
	float sMax = uScenter + uDs/2;
	float tMin = uTcenter - uDt/2;
	float tMax = uTcenter + uDt/2;
	
	//boundary for cir
	float dist = sqrt( (s-uScenter)*(s-uScenter) + (t-uTcenter)*(t-uTcenter) );
	
	// get resolution
	ivec2 ires = textureSize(uImageUnit, 0); 
	float ResS = float( ires.s );
	float ResT = float( ires.t );

	//For Extra
	if( (!uRec2Cir) )
		testFlag = ((s >= sMin) && (s <= sMax) && (t >= tMin) && (t <= tMax));
	else
		testFlag = (dist <= uRadius);
	
	if(testFlag)
	{
		// Do scale
		stp = vec2(uScenter+(s-uScenter)/uMagFactor, uTcenter+(t-uTcenter)/uMagFactor);
		
		// Do rotate
		stp = vec2((uScenter+((stp.s-uScenter)*cos(uRotAngle)-(stp.t-uTcenter)*sin(uRotAngle))), (uTcenter+((stp.s-uScenter)*sin(uRotAngle)+(stp.t-uTcenter)*cos(uRotAngle))));

		// Do Sharpening
		vec2 stp0 = vec2(1./ResS, 0. );
		vec2 st0p = vec2(0. , 1./ResT);
		vec2 stpp = vec2(1./ResS, 1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		vec3 i00 = texture2D( uImageUnit, stp ).rgb;
		vec3 im1m1 = texture2D( uImageUnit, stp-stpp ).rgb;
		vec3 ip1p1 = texture2D( uImageUnit, stp+stpp ).rgb;
		vec3 im1p1 = texture2D( uImageUnit, stp-stpm ).rgb;
		vec3 ip1m1 = texture2D( uImageUnit, stp+stpm ).rgb;
		vec3 im10 = texture2D( uImageUnit, stp-stp0 ).rgb;
		vec3 ip10 = texture2D( uImageUnit, stp+stp0 ).rgb;
		vec3 i0m1 = texture2D( uImageUnit, stp-st0p ).rgb;
		vec3 i0p1 = texture2D( uImageUnit, stp+st0p ).rgb;
		vec3 target = vec3(0.,0.,0.);
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		//Put color
		rgb = texture2D( uImageUnit, stp ).rgb;
		rgb = mix( target, rgb, uSharpFactor );
	}
	else
	{
		rgb = texture2D( uImageUnit, vST ).rgb;
	}
	gl_FragColor = vec4( rgb, 1. );
}

