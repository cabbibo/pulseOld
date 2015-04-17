uniform sampler2D t_audio;
uniform float bumpSize;
uniform float bumpSpeed;
uniform float bumpHeight;
uniform float time;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vMPos;

$simplex


vec3 noisePos( vec3 pos , vec2 offset , float cutoff , vec4 audioValue ){

  float multiplier = snoise( pos.xy * vec2( bumpSize , bumpSize * .7 ) + offset);
  multiplier += .2 * snoise( pos.xy * 2. * vec2( bumpSize , bumpSize * .7 ) + offset);

  vec3 p = pos + vec3( 0 , 0 , 1 ) *( multiplier+4.) * .3 * bumpHeight * cutoff * ( length( audioValue ) + 2. );

  return p;

}


void main(){


  vec2 centerUV = abs( uv - vec2( .5 , .5 ) );
 
  float dCutoff = max( 0. , (1. - pow((length( centerUV )*3.), 2. )));

  dCutoff = (.5 - centerUV.x ) * uv.y;
  vec2 offset = vec2( time , time ) * vec2( bumpSpeed * .1 , bumpSpeed * -1. );


  vec4 audioValue = texture2D( t_audio , vec2( uv.y , 0. ) ); 

  vec3 fPos = noisePos( position, offset , dCutoff , audioValue );

  vec3 pXUp = noisePos( position + vec3( 1.  , 0.  , 0. ) , offset , dCutoff , audioValue );
  vec3 pXDo = noisePos( position + vec3( -1. , 0.  , 0. ) , offset , dCutoff , audioValue );
  vec3 pYUp = noisePos( position + vec3( .0  , 1.  , 0. ) , offset , dCutoff , audioValue );
  vec3 pYDo = noisePos( position + vec3( .0  , -1. , 0. ) , offset , dCutoff , audioValue );


  vec3 dX = pXUp - pXDo;
  vec3 dY = pYUp - pYDo;

  vec3 norm = normalize( cross( dX , dY ));

  vNorm = -( modelMatrix * vec4( norm , 0. )).xyz;
  vUv   = uv;
  vPos  = position;
  vMPos  = ( modelMatrix * vec4( fPos , 1.  )).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( fPos , 1. );

}
