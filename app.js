// Animated reflective surface, rendered with WebGL.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused=reduced;
const canvas = document.getElementById('orb');
const gl = canvas.getContext('webgl', {alpha:true, antialias:true});
if(gl){
const vert='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const frag=`precision mediump float;uniform vec2 res;uniform float time;
void main(){vec2 uv=(gl_FragCoord.xy-.5*res)/res.y;uv.y+=.37; float a=atan(uv.y,uv.x); float r=.72+.028*sin(a*5.+time*.3)+.016*cos(a*3.-time*.25);float d=length(uv);float edge=1.-smoothstep(r-.007,r+.007,d); if(edge<.01){gl_FragColor=vec4(0.);return;} float z=sqrt(max(0.,1.-d*d/(r*r)));vec3 n=normalize(vec3(uv/r,z));float rim=pow(1.-z,3.);float stripe=pow(max(0.,sin(n.x*3.5+n.y*2.5+z*5.+time*.12)),18.); vec3 color=vec3(.016,.035,.072)+vec3(.13,.25,.39)*pow(z,2.)*.35; color+=vec3(.86,.63,.30)*stripe*.8; color+=vec3(.9,.78,.52)*rim*.55;float light=pow(max(0.,dot(n,normalize(vec3(-.6,.8,.25)))),32.);color+=vec3(1.,.92,.75)*light*1.7;gl_FragColor=vec4(color,edge);}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);return s;}const pr=gl.createProgram();gl.attachShader(pr,shader(gl.VERTEX_SHADER,vert));gl.attachShader(pr,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(pr);gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const p=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);let phase=0,last=0;function draw(t){if(!motionPaused)phase+=Math.min((t-last)*.001,.05);last=t;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=canvas.clientWidth*dpr;canvas.height=canvas.clientHeight*dpr;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(gl.getUniformLocation(pr,'res'),canvas.width,canvas.height);gl.uniform1f(gl.getUniformLocation(pr,'time'),phase);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(draw);}requestAnimationFrame(draw);if(reduced)addEventListener('resize',()=>draw(0));}

