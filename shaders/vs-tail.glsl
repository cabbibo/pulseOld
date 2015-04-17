uniform sampler2D t_pos;
varying float vDepth;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];


void main(){

  vec3 p = vec3( 0. );
  for( int i = 0; i < depth; i++ ){ 
    if( i == int( position.z )){
      p = texture2D( t_posArray[i] , position.xy ).xyz;
    }
     /* if( 5 == int( position.z )){
      p = texture2D( t_posArray[5] , position.xy ).xyz;
    }*/

  }

  vDepth = float( position.z ) / float( depth );
  gl_PointSize = 10.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
