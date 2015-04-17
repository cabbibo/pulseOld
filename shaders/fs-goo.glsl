varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vPos;

void main(){


  gl_FragColor = vec4( vNorm * .5 + .5 , 1. );


}
