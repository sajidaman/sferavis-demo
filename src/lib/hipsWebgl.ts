import { colorMapLookup, fitsPixelAtSky, type FitsImage } from './hipsSky';

const TILE_SIZE = 512;
const TILE_MAP_SIZE = 1024;
const TILE_MAP_WIDTH = 256;
const MAX_ATLAS_COLUMNS = 8;

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;

uniform vec2 uResolution;
uniform float uRa;
uniform float uDec;
uniform float uFov;
uniform int uProjection;
uniform int uMaxOrder;
uniform int uSpherex;
uniform int uHasSky;
uniform int uHasPatch;
uniform vec3 uPatchInfo;
uniform int uAtlasSide;
uniform int uAtlasColumns;
uniform sampler2D uAtlas;
uniform usampler2D uTileMap;
uniform sampler2D uColorMap;
uniform sampler2D uPatch;

out vec4 outColor;
const float PI = 3.14159265358979323846;
const float D2R = PI / 180.0;

int spreadBits(int value, int bits) {
  int result = 0;
  for (int bit = 0; bit < 8; bit++) {
    if (bit < bits) result |= ((value >> bit) & 1) << (bit * 2);
  }
  return result;
}

ivec3 healpixPosition(float ra, float dec) {
  int order = uMaxOrder + 9;
  int nside = 1 << order;
  float z = sin(dec);
  float absZ = abs(z);
  float phi = mod(mod(ra, 2.0 * PI) + 2.0 * PI, 2.0 * PI);
  float tt = phi / (PI / 2.0);
  int face;
  int x;
  int y;

  if (absZ <= 2.0 / 3.0) {
    float jp = floor(float(nside) * (0.5 + tt) - float(nside) * z * 0.75);
    float jm = floor(float(nside) * (0.5 + tt) + float(nside) * z * 0.75);
    int ifp = int(floor(jp / float(nside)));
    int ifm = int(floor(jm / float(nside)));
    if (ifp == ifm) face = (ifp & 3) + 4;
    else if (ifp < ifm) face = ifp & 3;
    else face = (ifm & 3) + 8;
    x = int(jm) & (nside - 1);
    y = nside - (int(jp) & (nside - 1)) - 1;
  } else {
    int quadrant = min(int(floor(tt)), 3);
    float tp = tt - float(quadrant);
    float tmp = float(nside) * sqrt(3.0 * (1.0 - absZ));
    int jp = min(nside - 1, int(floor(tp * tmp)));
    int jm = min(nside - 1, int(floor((1.0 - tp) * tmp)));
    if (z >= 0.0) {
      face = quadrant;
      x = nside - jm - 1;
      y = nside - jp - 1;
    } else {
      face = quadrant + 8;
      x = jp;
      y = jm;
    }
  }
  return ivec3(face, x, y);
}

int findTile(int order, int pixel) {
  uint index = (uint(pixel) * 9u + uint(order)) % ${TILE_MAP_SIZE}u;
  for (int probe = 0; probe < 64; probe++) {
    uvec4 entry = texelFetch(uTileMap, ivec2(int(index % ${TILE_MAP_WIDTH}u), int(index / ${TILE_MAP_WIDTH}u)), 0);
    if (entry.z == 0u) return -1;
    if (entry.x == uint(order) && entry.y == uint(pixel)) return int(entry.z) - 1;
    index = (index + 1u) % ${TILE_MAP_SIZE}u;
  }
  return -1;
}

vec3 toSky(float nx, float ny) {
  float aspect = uResolution.x / max(1.0, uResolution.y);
  float center;
  float east;
  float north;

  if (uProjection == 1) {
    float halfHeight = tan(clamp(uFov, 0.02, 170.0) * D2R * 0.5);
    east = nx * aspect * halfHeight;
    north = ny * halfHeight;
    float norm = inversesqrt(1.0 + east * east + north * north);
    center = norm;
    east *= norm;
    north *= norm;
  } else if (uProjection == 2) {
    float horizontalFov = min(360.0, uFov * aspect);
    float longitude = nx * horizontalFov * D2R * 0.5;
    float latitude = ny * clamp(uFov, 0.02, 180.0) * D2R * 0.5;
    float cosLatitude = cos(latitude);
    center = cosLatitude * cos(longitude);
    east = cosLatitude * sin(longitude);
    north = sin(latitude);
  } else {
    float horizontalFov = min(360.0, uFov * max(2.0, aspect * 2.0));
    float mapX = nx * 2.0 * sqrt(2.0) * horizontalFov / 360.0;
    float mapY = ny * sqrt(2.0) * clamp(uFov, 0.02, 180.0) / 180.0;
    float zSquared = 1.0 - mapX * mapX / 16.0 - mapY * mapY / 4.0;
    if (zSquared < 0.0) return vec3(-2.0);
    float z = sqrt(zSquared);
    float longitudeA = z * mapX;
    float longitudeB = 2.0 * (2.0 * z * z - 1.0);
    float longitudeNorm = longitudeA * longitudeA + longitudeB * longitudeB;
    float cosLongitude = longitudeNorm > 0.0
      ? (longitudeB * longitudeB - longitudeA * longitudeA) / longitudeNorm
      : 1.0;
    float sinLongitude = longitudeNorm > 0.0
      ? 2.0 * longitudeA * longitudeB / longitudeNorm
      : 0.0;
    north = clamp(z * mapY, -1.0, 1.0);
    float cosLatitude = sqrt(1.0 - north * north);
    center = cosLatitude * cosLongitude;
    east = cosLatitude * sinLongitude;
  }

  float cosRa = cos(uRa), sinRa = sin(uRa);
  float cosDec = cos(uDec), sinDec = sin(uDec);
  return normalize(vec3(
    center * cosDec * cosRa - east * sinRa - north * sinDec * cosRa,
    center * cosDec * sinRa + east * cosRa - north * sinDec * sinRa,
    center * sinDec + north * cosDec
  ));
}

void main() {
  vec2 q = (gl_FragCoord.xy - 0.5 * uResolution) / (0.5 * uResolution.y);
  vec3 direction = toSky(-q.x / (uResolution.x / max(1.0, uResolution.y)), q.y);
  vec3 color = vec3(0.008, 0.012, 0.022);

  if (direction.z > -1.5) {
    float ra = atan(direction.y, direction.x);
    float dec = asin(clamp(direction.z, -1.0, 1.0));

    if (uHasSky == 1) {
      ivec3 hp = healpixPosition(ra, dec);
      int slot = -1;
      int tileX = 0;
      int tileY = 0;
      for (int order = 8; order >= 0; order--) {
        if (order > uMaxOrder) continue;
        int shift = 9 + uMaxOrder - order;
        int x = hp.y >> shift;
        int y = hp.z >> shift;
        int pixel = hp.x * (1 << (2 * order)) + spreadBits(x, order) + 2 * spreadBits(y, order);
        slot = findTile(order, pixel);
        if (slot >= 0) {
          tileX = hp.y & 511;
          tileY = hp.z & 511;
          break;
        }
      }

      if (slot >= 0) {
        int col = slot % uAtlasColumns;
        int row = slot / uAtlasColumns;
        vec2 uv = (vec2(float(col * 512 + tileX), float(row * 512 + tileY)) + 0.5) / float(uAtlasSide);
        vec3 sampleColor = texture(uAtlas, uv).rgb;
        if (uSpherex == 1) {
          float intensity = dot(sampleColor, vec3(0.3333333333));
          sampleColor = texture(uColorMap, vec2(intensity, 0.5)).rgb;
        }
        color = sampleColor;
      }
    }

    if (uHasPatch == 1) {
      float ra0 = uPatchInfo.x, dec0 = uPatchInfo.y, patchSize = uPatchInfo.z;
      float dra = ra - ra0;
      float cosc = sin(dec0) * sin(dec) + cos(dec0) * cos(dec) * cos(dra);
      if (cosc > 0.2) {
        float xi = cos(dec) * sin(dra) / cosc;
        float eta = (cos(dec0) * sin(dec) - sin(dec0) * cos(dec) * cos(dra)) / cosc;
        vec2 uv = vec2(0.5 - xi / patchSize, 0.5 - eta / patchSize);
        float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
        if (edge > 0.0) {
          vec4 patchSample = texture(uPatch, uv);
          color = mix(color, patchSample.rgb, smoothstep(0.0, 0.04, edge) * patchSample.a);
        }
      }
    }
  }
  outColor = vec4(color, 1.0);
}`;

export interface WebGLTile {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
  lastUsed: number;
}

export interface WebGLPatch {
  pixels: Uint8Array;
  width: number;
  height: number;
  ra: number;
  dec: number;
  fov: number;
}

export interface WebGLView {
  ra: number;
  dec: number;
  fov: number;
  projection: 'AIT' | 'TAN' | 'CAR';
}

function shader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const result = gl.createShader(type);
  if (!result) throw new Error('The WebGL shader could not be created.');
  gl.shaderSource(result, source);
  gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(result) || 'Unknown shader compilation error.';
    gl.deleteShader(result);
    throw new Error(`The WebGL sky shader failed to compile: ${message}`);
  }
  return result;
}

export class HipsWebGLRenderer {
  readonly capacity: number;
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly vertexArray: WebGLVertexArrayObject;
  private readonly uniforms: Record<string, WebGLUniformLocation | null> = {};
  private readonly atlas: WebGLTexture;
  private readonly tileMapTexture: WebGLTexture;
  private readonly colorMapTexture: WebGLTexture;
  private readonly patchTexture: WebGLTexture;
  private readonly atlasSide: number;
  private readonly atlasColumns: number;
  private readonly tiles = new Map<string, { slot: number; tile: WebGLTile; order: number; pixel: number }>();
  private readonly freeSlots: number[] = [];
  private readonly tileMap = new Uint32Array(TILE_MAP_SIZE * 4);
  private patch: WebGLPatch | null = null;
  private colorMap: 'grayscale' | 'magma' | null = null;
  private hasSky = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error('This browser does not support WebGL 2, which the GPU sky renderer requires.');
    this.gl = gl;

    const columns = Math.min(MAX_ATLAS_COLUMNS, Math.floor(gl.getParameter(gl.MAX_TEXTURE_SIZE) / TILE_SIZE));
    if (columns < 1) throw new Error('This device cannot allocate a HiPS tile texture.');
    this.atlasColumns = columns;
    this.atlasSide = columns * TILE_SIZE;
    this.capacity = columns * columns;
    for (let slot = this.capacity - 1; slot >= 0; slot -= 1) this.freeSlots.push(slot);

    const vertex = shader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!program) throw new Error('The WebGL sky program could not be created.');
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Unknown program link error.';
      gl.deleteProgram(program);
      throw new Error(`The WebGL sky program failed to link: ${message}`);
    }
    this.program = program;
    gl.useProgram(program);
    const vertexArray = gl.createVertexArray();
    if (!vertexArray) throw new Error('The WebGL vertex array could not be created.');
    this.vertexArray = vertexArray;
    gl.bindVertexArray(vertexArray);

    const names = [
      'uResolution', 'uRa', 'uDec', 'uFov', 'uProjection', 'uMaxOrder', 'uSpherex',
      'uHasSky', 'uHasPatch', 'uPatchInfo', 'uAtlasSide', 'uAtlasColumns',
      'uAtlas', 'uTileMap', 'uColorMap', 'uPatch',
    ];
    for (const name of names) this.uniforms[name] = gl.getUniformLocation(program, name);

    this.atlas = this.createTexture(gl.TEXTURE0, gl.LINEAR, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, this.atlasSide, this.atlasSide, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    this.tileMapTexture = this.createTexture(gl.TEXTURE1, gl.NEAREST, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32UI, TILE_MAP_WIDTH, TILE_MAP_SIZE / TILE_MAP_WIDTH, 0, gl.RGBA_INTEGER, gl.UNSIGNED_INT, this.tileMap);
    this.colorMapTexture = this.createTexture(gl.TEXTURE2, gl.NEAREST, gl.CLAMP_TO_EDGE);
    this.patchTexture = this.createTexture(gl.TEXTURE3, gl.LINEAR, gl.CLAMP_TO_EDGE);
    gl.uniform1i(this.uniforms.uAtlas, 0);
    gl.uniform1i(this.uniforms.uTileMap, 1);
    gl.uniform1i(this.uniforms.uColorMap, 2);
    gl.uniform1i(this.uniforms.uPatch, 3);
    gl.uniform1i(this.uniforms.uAtlasSide, this.atlasSide);
    gl.uniform1i(this.uniforms.uAtlasColumns, this.atlasColumns);
    this.setColorMap('grayscale');
  }

  private createTexture(unit: number, filter: number, wrap: number): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error('The WebGL sky texture could not be created.');
    gl.activeTexture(unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return texture;
  }

  resize(width: number, height: number, pixelRatio: number): void {
    const nextWidth = Math.max(1, Math.round(width * pixelRatio));
    const nextHeight = Math.max(1, Math.round(height * pixelRatio));
    if (this.canvas.width === nextWidth && this.canvas.height === nextHeight) return;
    this.canvas.width = nextWidth;
    this.canvas.height = nextHeight;
    this.gl.viewport(0, 0, nextWidth, nextHeight);
  }

  setColorMap(name: 'grayscale' | 'magma'): void {
    if (this.colorMap === name) return;
    this.colorMap = name;
    const rgb = colorMapLookup(name);
    const rgba = new Uint8Array(256 * 4);
    for (let index = 0; index < 256; index += 1) {
      rgba[index * 4] = rgb[index * 3];
      rgba[index * 4 + 1] = rgb[index * 3 + 1];
      rgba[index * 4 + 2] = rgb[index * 3 + 2];
      rgba[index * 4 + 3] = 255;
    }
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.colorMapTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
  }

  setPatch(patch: WebGLPatch | null): void {
    if (this.patch === patch) return;
    this.patch = patch;
    if (!patch) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.patchTexture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, patch.width, patch.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, patch.pixels);
  }

  syncTiles(entries: Iterable<[string, WebGLTile]>, prefix: string): void {
    const requested = [...entries]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, tile]) => {
        const [, , orderText, pixelText] = key.split(':');
        return { key, tile, order: Number(orderText), pixel: Number(pixelText) };
      })
      .sort((left, right) => right.tile.lastUsed - left.tile.lastUsed || right.order - left.order)
      .slice(0, this.capacity);
    const wanted = new Set(requested.map(({ key }) => key));
    let changed = false;

    for (const [key, gpuTile] of this.tiles) {
      if (wanted.has(key)) continue;
      this.tiles.delete(key);
      this.freeSlots.push(gpuTile.slot);
      changed = true;
    }

    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.atlas);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    for (const item of requested) {
      const existing = this.tiles.get(item.key);
      if (existing?.tile === item.tile) continue;
      const slot = existing?.slot ?? this.freeSlots.pop();
      if (slot === undefined) continue;
      if (existing) this.tiles.delete(item.key);
      const x = (slot % this.atlasColumns) * TILE_SIZE;
      const y = Math.floor(slot / this.atlasColumns) * TILE_SIZE;
      const pixels = new Uint8Array(item.tile.pixels.buffer, item.tile.pixels.byteOffset, item.tile.pixels.byteLength);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, item.tile.width, item.tile.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      this.tiles.set(item.key, { slot, tile: item.tile, order: item.order, pixel: item.pixel });
      changed = true;
    }

    if (changed) this.updateTileMap();
    this.hasSky = this.tiles.size > 0;
  }

  private updateTileMap(): void {
    this.tileMap.fill(0);
    for (const { slot, order, pixel } of this.tiles.values()) {
      let index = (pixel * 9 + order) % TILE_MAP_SIZE;
      while (this.tileMap[index * 4 + 3] !== 0) index = (index + 1) % TILE_MAP_SIZE;
      this.tileMap[index * 4] = order;
      this.tileMap[index * 4 + 1] = pixel;
      this.tileMap[index * 4 + 2] = slot + 1;
      this.tileMap[index * 4 + 3] = 1;
    }
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.tileMapTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TILE_MAP_WIDTH, TILE_MAP_SIZE / TILE_MAP_WIDTH, gl.RGBA_INTEGER, gl.UNSIGNED_INT, this.tileMap);
  }

  render(view: WebGLView, maxOrder: number, spherex: boolean): void {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.uRa, view.ra * Math.PI / 180);
    gl.uniform1f(this.uniforms.uDec, view.dec * Math.PI / 180);
    gl.uniform1f(this.uniforms.uFov, view.fov);
    gl.uniform1i(this.uniforms.uProjection, view.projection === 'TAN' ? 1 : view.projection === 'CAR' ? 2 : 0);
    gl.uniform1i(this.uniforms.uMaxOrder, maxOrder);
    gl.uniform1i(this.uniforms.uSpherex, spherex ? 1 : 0);
    gl.uniform1i(this.uniforms.uHasSky, this.hasSky ? 1 : 0);
    gl.uniform1i(this.uniforms.uHasPatch, this.patch ? 1 : 0);
    if (this.patch) {
      gl.uniform3f(
        this.uniforms.uPatchInfo,
        this.patch.ra * Math.PI / 180,
        this.patch.dec * Math.PI / 180,
        this.patch.fov * Math.PI / 180,
      );
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.atlas);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.tileMapTexture);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.colorMapTexture);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.patchTexture);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteTexture(this.atlas);
    gl.deleteTexture(this.tileMapTexture);
    gl.deleteTexture(this.colorMapTexture);
    gl.deleteTexture(this.patchTexture);
    gl.deleteVertexArray(this.vertexArray);
    gl.deleteProgram(this.program);
  }
}

export function makeWebGLPatch(
  image: FitsImage,
  range: [number, number],
  fieldOfView: number,
  colorMap: 'grayscale' | 'magma',
): WebGLPatch {
  const width = Math.min(512, image.width);
  const height = Math.min(512, image.height);
  const pixels = new Uint8Array(width * height * 4);
  const lookup = colorMapLookup(colorMap);
  const ra0 = image.header.get('CRVAL1') ?? 0;
  const dec0 = image.header.get('CRVAL2') ?? 0;
  const ra0Rad = ra0 * Math.PI / 180;
  const dec0Rad = dec0 * Math.PI / 180;
  const patchSize = fieldOfView * Math.PI / 180;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const xi = (0.5 - (x + 0.5) / width) * patchSize;
      const eta = (0.5 - (y + 0.5) / height) * patchSize;
      const rho = Math.hypot(xi, eta);
      const c = Math.atan(rho);
      const dec = rho === 0
        ? dec0Rad
        : Math.asin(clampUnit(
          Math.cos(c) * Math.sin(dec0Rad) + eta * Math.sin(c) * Math.cos(dec0Rad) / rho,
        ));
      const ra = rho === 0
        ? ra0Rad
        : ra0Rad + Math.atan2(
          xi * Math.sin(c),
          rho * Math.cos(dec0Rad) * Math.cos(c) - eta * Math.sin(dec0Rad) * Math.sin(c),
        );
      const source = fitsPixelAtSky(image, ra * 180 / Math.PI, dec * 180 / Math.PI);
      const destination = (y * width + x) * 4;
      if (!source || source[0] < 0 || source[1] < 0 || source[0] >= image.width || source[1] >= image.height) continue;
      const value = image.values[Math.floor(source[1]) * image.width + Math.floor(source[0])];
      if (!Number.isFinite(value)) continue;
      const intensity = Math.round(clampUnit((value - range[0]) / (range[1] - range[0])) * 255);
      pixels[destination] = lookup[intensity * 3];
      pixels[destination + 1] = lookup[intensity * 3 + 1];
      pixels[destination + 2] = lookup[intensity * 3 + 2];
      pixels[destination + 3] = 255;
    }
  }

  return { pixels, width, height, ra: ra0, dec: dec0, fov: fieldOfView };
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}
