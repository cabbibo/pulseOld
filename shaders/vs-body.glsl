
attribute vec2 info;
varying float vDepth;

varying vec2 vRibbonUV;
varying vec2 vLookupUV;

const int depth = @DEPTH;

uniform sampler2D t_posArray[ depth ];

$cubicCurve


void main(){


  // uv.y is if ribbon is top or bottom
  // uv.x is depth

  vRibbonUV = uv.xy;
  vLookupUV = position.xy;

  float base = uv.x * float(depth);
  float baseUp = floor( base );
  float baseDown   = ceil( base );
  float amount = base - baseUp;

  vec3 p = vec3( 0. );

  vec3 p0 = vec3(0.);
  vec3 v0 = vec3(0.);
  vec3 p1 = vec3(0.);
  vec3 v1 = vec3(0.);

  vec3 p2 = vec3(0.);


  // the 'head' of the creature
  if( baseUp == 0. ){


    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown + 1. )){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v1 = .5 * ( p2 - p0 );

  // the 'tail' of the creature
  }else if( int( baseDown ) == depth ){

    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseUp - 1. )){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v0 = .5 * ( p1 - p2 );

  // The 'middle' of the creature
  }else{

    vec3 pMinus;
    // Loop through to find values we need to sample
    for( int i = 0; i < depth; i++ ){

      if( i == int( baseUp ) ){
        p0 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown ) ){
        p1 = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseUp - 1. )){
        pMinus = texture2D( t_posArray[i] , position.xy ).xyz;
      }else if( i == int( baseDown + 1. ) ){
        p2 = texture2D( t_posArray[i] , position.xy ).xyz;
      }

    }

    v1 = .5 * ( p2 - p0 );
    v0 = .5 * ( p1 - pMinus );

  }


  vec3 c0 = p0;
  vec3 c1 = p0 + v0/3.;
  vec3 c2 = p1 - v1/3.;
  vec3 c3 = p1;

  vec3 centerOfCircle = cubicCurve( amount , c0 , c1 , c2 , c3 );
  vec3 forNormal      = cubicCurve( amount - .1 , c0 , c1 , c2 , c3 );

  vec3 dirNorm = normalize( forNormal - centerOfCircle );
  //vec3 columnPos = centerOfCircle;
  //vec3 columnToPos = pos.xyz - columnPos;


  vec3  upVector = vec3( 0. , 1. , 0. );
  float upVectorProj = dot( upVector , dirNorm );
  vec3  upVectorPara = upVectorProj * dirNorm;
  vec3  upVectorPerp = upVector - upVectorPara;

  vec3 basisX = normalize( upVectorPerp );
  vec3 basisY = cross( dirNorm , basisX );


  p = centerOfCircle + basisY * uv.y * .5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p , 1. );


}
