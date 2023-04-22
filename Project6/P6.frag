#version 330 compatibility

in vec3 vMCposition;
in float gLightIntensity;
in vec2 gST;

uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler2D Noise2;
uniform float uAlpha;
uniform float Timer;

const vec3 RGB1 = vec3( .5, .8, 0. );
const vec3 RGB2 = vec3(.4, .2, .8);
const vec3 Ta   = vec3(1.,1.,1.);

void
main( )
{   
    float uAd = 0.05;
    float uBd = 0.02;

    float Ar = uAd / 2.;
    float Br = uBd / 2.;

    float s = gST.s;
    float t = gST.t;

    int numins = int(s / uAd);
    int numint = int(t / uBd);
   

    vec4 nv  = texture2D( Noise2, uNoiseFreq*gST*Timer );
    float n = nv.r + nv.g + nv.b + nv.a;         //  1. -> 3.
    n = n - 2.;                                  // -1. -> 1.    
    n *= uNoiseAmp * Timer;

    float sc = float(numins) * uAd  +  Ar;
    float ds = s - sc;                        // wrt ellipse center
    float tc = float(numint) * uBd  +  Br;
    float dt = t - tc;                        // wrt ellipse center

    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = oldDist + n;
    float scale = newDist / oldDist; //this could be < 1., = 1., or > 1.    
    ds *= scale;                     // scale by noise factor
    ds /= Ar;                        // ellipse equation
    dt *= scale;                     // scale by noise factor
    dt /= Br;                        // ellipse equation

    float d = ds*ds + dt*dt;
    float et = smoothstep( 1.-uTol, 1.+uTol, d );
    
     vec3 Tb = vec3(uAlpha, uAlpha, uAlpha);
    vec4 color = mix(vec4(gLightIntensity * RGB2, Ta), vec4(gLightIntensity * RGB1, Tb), et);

   
    if(color == vec4( .5, .8, 0., 0. )){
        discard;
       

    }

   gl_FragColor = color;
    

}