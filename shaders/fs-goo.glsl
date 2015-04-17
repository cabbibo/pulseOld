uniform sampler2D t_audio;
uniform sampler2D t_normal;
uniform sampler2D t_matcap;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vPuppyLight;
varying vec3 vCameraLight;
varying vec3 vEye;
varying vec3 vPos;


$uvNormalMap
$semLookup

void main(){

	vec3 fNorm = uvNormalMap( t_normal , vPos , vUv  , vNorm , 4.1 , 1.1 );


  vec2 semLU = semLookup( normalize( vEye ) , fNorm );
  vec4 sem = texture2D( t_matcap , semLU );

  float lamb =max( 0. , dot( fNorm , normalize( -vCameraLight )));
  vec4 audio = texture2D( t_audio , vec2( lamb , 0. ));
  gl_FragColor = vec4( sem.xyz * audio.xyz  * lamb, 1. );


}
