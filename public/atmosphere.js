/* The original ocean artwork stays intact. This layer animates it at runtime. */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const scenes = [];
let frame = 0;
let arrivalStart = -10000;
let arrivalActive = false;
document.addEventListener('moonlight:scene',()=>{if(document.body.classList.contains('entering')){if(!arrivalActive){arrivalStart=performance.now();arrivalActive=true;}}else arrivalActive=false;});
let lastFrame = 0;
let pointerX = 0;
let pointerY = 0;
let smoothX = 0;
let smoothY = 0;

const vertex = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 uv;
uniform sampler2D artwork;
uniform vec2 resolution;
uniform vec2 imageSize;
uniform vec2 pointer;
uniform float time;
uniform float arrival;
void main() {
  vec2 p = vec2(uv.x, 1.0 - uv.y);
  float viewportRatio = resolution.x / resolution.y;
  float imageRatio = imageSize.x / imageSize.y;
  vec2 fit = viewportRatio > imageRatio
    ? vec2(1.0, imageRatio / viewportRatio)
    : vec2(viewportRatio / imageRatio, 1.0);
  p = (p - 0.5) * fit * 0.974 + 0.5 + pointer * 0.003;
  // A ten-second breath gently expands the moon and its surrounding halo.
  float breath = 0.5 + 0.5 * sin(time * 0.6283185 - 1.5707963);
  vec2 moonCenter = vec2(0.504, 0.242);
  vec2 moonOffset = p - moonCenter;
  float moonRadius = length(moonOffset * vec2(imageRatio, 1.0));
  float moonMask = 1.0 - smoothstep(0.13, 0.23, moonRadius);
  p = moonCenter + moonOffset / (1.0 + moonMask * breath * 0.018);
  float cloudBand = smoothstep(0.25, 0.34, p.y) * (1.0 - smoothstep(0.46, 0.495, p.y));
  p.x += cloudBand * (1.0 - moonMask) * (sin(time * 0.12) * 0.002 + sin(p.y * 22.0 + time * 0.16) * 0.001);
  float water = smoothstep(0.494, 0.65, p.y);
  float depth = max(0.0, p.y - 0.48);
  float ripples = sin(p.y * 112.0 - time * 0.85 + sin(p.x * 13.0));
  float swell = sin(p.x * 18.0 + p.y * 30.0 + time * 0.48);
  p.x += water * (ripples * 0.0014 + swell * depth * 0.005);
  p.y += water * sin(p.y * 68.0 + p.x * 22.0 - time * 0.58) * depth * 0.003;
  vec3 color = texture2D(artwork, clamp(p, 0.001, 0.999)).rgb;
  float reflection = exp(-pow((p.x - 0.5) / (0.02 + depth * 0.4), 2.0));
  float shimmer = sin(p.y * 210.0 - time * 1.1 + sin(p.x * 56.0)) * 0.018;
  color += vec3(0.25, 0.66, 0.85) * shimmer * reflection * water;
  float glow = exp(-moonRadius * 10.0);
  color *= 1.0 + moonMask * (breath - 0.5) * 0.055;
  color += vec3(0.012, 0.043, 0.068) * glow * (0.3 + breath * 0.7);
  color += vec3(0.024, 0.075, 0.12) * reflection * water * breath;
  float moonReveal=smoothstep(0.22,0.8,arrival);
  float waterReveal=smoothstep(0.4,1.0,arrival);
  color *= mix(0.06,1.0,arrival);
  color *= mix(1.0,moonReveal,moonMask);
  color *= mix(1.0,waterReveal,reflection*water*.85);
  gl_FragColor = vec4(color, 1.0);
}`;

function makeShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error('Ocean shader unavailable');
  }
  return shader;
}

function makeScene(surface, artwork) {
  const canvas = document.createElement('canvas');
  canvas.className = 'ocean-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, stencil: false,
    preserveDrawingBuffer: false, powerPreference: 'low-power'
  });
  if (!gl) return;
  const program = gl.createProgram();
  const shaders = [];
  try {
    shaders.push(makeShader(gl, gl.VERTEX_SHADER, vertex));
    shaders.push(makeShader(gl, gl.FRAGMENT_SHADER, fragment));
    shaders.forEach(shader => gl.attachShader(program, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Ocean unavailable');
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, artwork);
    gl.uniform1i(gl.getUniformLocation(program, 'artwork'), 0);
    gl.uniform2f(gl.getUniformLocation(program, 'imageSize'), artwork.naturalWidth, artwork.naturalHeight);
    const uniforms = Object.fromEntries(['resolution', 'pointer', 'time', 'arrival'].map(name => [name, gl.getUniformLocation(program, name)]));
    const scene = { surface, canvas, gl, uniforms, lost: false };
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      scene.lost = true;
      canvas.classList.remove('ready');
      // Keep the original CSS image visible if the GPU releases this context.
    });
    surface.prepend(canvas);
    scenes.push(scene);
  } catch {
    shaders.forEach(shader => gl.deleteShader(shader));
    gl.deleteProgram(program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

function enabled() {
  return document.documentElement.dataset.motion !== 'off'
    && document.documentElement.dataset.liveWallpaper !== 'off'
    && !reducedMotion.matches && !document.hidden;
}

function isVisible(scene) {
  if (scene.lost || scene.surface.dataset.theme !== 'moonlight') return false;
  const welcome = document.querySelector('#welcome-screen');
  if (scene.surface.id === 'welcome-wallpaper') return !welcome.hidden;
  return welcome.hidden || document.body.classList.contains('entering');
}

function draw(now) {
  frame = 0;
  if (!enabled()) return;
  const visible = scenes.filter(isVisible);
  if (!visible.length) return;
  if (now - lastFrame > 32) {
    lastFrame = now;
    smoothX += (pointerX - smoothX) * 0.035;
    smoothY += (pointerY - smoothY) * 0.035;
    for (const scene of visible) {
      const { canvas, gl, uniforms, surface } = scene;
      const rect = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25, 1800 / Math.max(rect.width, 1));
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.pointer, smoothX, smoothY);
      gl.uniform1f(uniforms.time, (now / 1000) % 3600);
      gl.uniform1f(uniforms.arrival,Math.min(1,Math.max(0,(now-arrivalStart-1700)/3100)));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.classList.add('ready');
    }
  }
  frame = requestAnimationFrame(draw);
}

function sync() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (enabled()) frame = requestAnimationFrame(draw);
  else for (const { canvas } of scenes) canvas.classList.remove('ready');
}

// Sparse, slow stars add depth without covering the artwork's moon.
document.querySelectorAll('.star-field').forEach(field => {
  for (let i = 0; i < 22; i++) {
    const star = document.createElement('span');
    star.style.cssText = `left:${(i * 41 + 7) % 97}%;top:${(i * 23 + 5) % 43}%;--delay:-${i * 0.73}s;--duration:${5 + i % 7}s;--size:${i % 5 === 0 ? 2 : 1}px`;
    field.append(star);
  }
});

const artwork = new Image();
artwork.onload = () => {
  document.querySelectorAll('.wallpaper,.welcome-wallpaper').forEach(surface => makeScene(surface, artwork));
  sync();
};
artwork.src = '/moonlight-ocean.png';

window.addEventListener('pointermove', event => {
  if (!enabled() || !finePointer.matches) return;
  pointerX = (event.clientX / innerWidth - 0.5) * 2;
  pointerY = (event.clientY / innerHeight - 0.5) * 2;
}, { passive: true });
document.addEventListener('pointerleave', () => { pointerX = pointerY = 0; });
document.addEventListener('visibilitychange', sync);
document.addEventListener('moonlight:scene', sync);
reducedMotion.addEventListener('change', sync);
window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
window.addEventListener('pageshow', sync);
