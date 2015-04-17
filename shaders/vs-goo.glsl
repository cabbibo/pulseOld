uniform sampler2D t_audio;
uniform float bumpSize;
uniform float bumpSpeed;
uniform float bumpHeight;
uniform float time;

uniform vec3 cameraLight;
uniform vec3 puppyLight;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vPuppyLight;
varying vec3 vEye;
varying vec3 vCameraLight;

$simplex


vec3 noisePos( vec3 pos , vec2 offset , float cutoff , vec4 audioValue ){

  float multiplier = snoise( pos.xz * vec2( bumpSize , bumpSize * .7 ) * 5. + offset);

  vec3 p = pos + vec3( 0 , 1 , 0 ) *( multiplier+1.) * bumpHeight  * length( audioValue ) * .03* cutoff;

  return p;

}


void main(){


  vec2 centerUV = abs( uv - vec2( .5 , .5 ) );
 
  float dCutoff = max( 0. , (1. - pow((length( centerUV )*3.), 2. )));

  dCutoff = min( 1. ,  .001 / pow( length( position.xz ) , 4. ));
 // dCutoff = 1.;
  vec2 offset = vec2( time , time ) * vec2( bumpSpeed , bumpSpeed * .7 ) * .3;


  vec4 audioValue = texture2D( t_audio , vec2( length( position.xz ) , 0. )  );


  offset += audioValue.xy;

  vec3 fPos = noisePos( position, offset , dCutoff , audioValue );

  vec3 pXUp = noisePos( position + vec3( .01  , 0.  , 0. ) , offset , dCutoff , audioValue );
  vec3 pXDo = noisePos( position + vec3( -.01 , 0.  , 0. ) , offset , dCutoff , audioValue );
  vec3 pYUp = noisePos( position + vec3( .0  , 0. , 0.01 ) , offset , dCutoff , audioValue );
  vec3 pYDo = noisePos( position + vec3( .0  , 0. , -.01 ) , offset , dCutoff , audioValue );


  vec3 dX = pXUp - pXDo;
  vec3 dY = pYUp - pYDo;

  vec3 norm = normalize( cross( dX , dY ));

  vNorm = -( modelMatrix * vec4( norm , 0. )).xyz;
  vUv   = position.xz;
  vPos  = fPos;
  vMPos  = ( modelMatrix * vec4( fPos , 1.  )).xyz;

  vEye = vMPos - cameraPosition;
  vPuppyLight = vMPos - puppyLight;
  vCameraLight = vMPos - cameraLight;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( fPos , 1. );

}
