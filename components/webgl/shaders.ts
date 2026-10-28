// GLSL sources. LOW is #2F5BFF and HIGH is #F4F4F4 as 0..1 components.

export const orbVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// A lit sphere drawn as a halftone: staggered rows of dots whose radius follows
// the brightness at the dot's centre. Mirrors the approved concept image.
export const halftoneFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uLight;
uniform float uStep;
uniform vec2 uResolution;
varying vec2 vUv;

const vec3 LOW = vec3(0.184, 0.357, 1.0);
const vec3 HIGH = vec3(0.957, 0.957, 0.957);

void main() {
  vec2 px = vUv * uResolution;
  float cell = uStep * (uResolution.y / 900.0);
  float row = floor(px.y / cell);
  float shift = mod(row, 2.0) * 0.5 * cell;
  float colIndex = floor((px.x - shift) / cell);
  vec2 center = vec2((colIndex + 0.5) * cell + shift, (row + 0.5) * cell);

  vec2 p = (center - 0.5 * uResolution) / (0.44 * uResolution.y);
  float d2 = dot(p, p);
  if (d2 >= 1.0) discard;

  vec3 light = normalize(uLight + vec3(0.12 * sin(uTime * 0.35), 0.08 * cos(uTime * 0.27), 0.0));
  vec3 n = vec3(p, sqrt(1.0 - d2));
  float v = max(0.0, dot(n, light));
  v *= 0.82 + 0.18 * sin(p.y * 9.0);
  v = 0.06 + 0.94 * v;

  float radius = cell * 0.52 * pow(v, 0.7);
  float dist = length(px - center);
  float edge = 1.0 - smoothstep(radius - 1.0, radius, dist);
  if (edge <= 0.0) discard;

  vec3 color = mix(LOW, HIGH, pow(v, 1.6));
  gl_FragColor = vec4(color, edge * min(1.0, 0.35 + v));
}
`;

// A soft navy-to-blue glow that breathes slowly, for behind the FifthSense diagram.
export const glowFragment = /* glsl */ `
precision highp float;

uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 p = vUv - vec2(0.5, 0.5);
  float d = length(p * vec2(1.0, 1.15));
  float pulse = 0.92 + 0.08 * sin(uTime * 0.6);
  float g = smoothstep(0.62, 0.0, d) * pulse;
  vec3 navy = vec3(0.075, 0.149, 0.267);
  vec3 blue = vec3(0.184, 0.357, 1.0);
  gl_FragColor = vec4(mix(navy, blue, g * g), g * 0.55);
}
`;
