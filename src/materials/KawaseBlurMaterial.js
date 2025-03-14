import { NoBlending, ShaderMaterial, Uniform, Vector4 } from "three";
import { KernelSize } from "../enums/index.js";
import { updateFragmentShader } from "../utils/index.js";

import fragmentShader from "./glsl/convolution.kawase.frag";
import vertexShader from "./glsl/convolution.kawase.vert";

const kernelPresets = [
	new Float32Array([0.0, 0.0]),
	new Float32Array([0.0, 1.0, 1.0]),
	new Float32Array([0.0, 1.0, 1.0, 2.0]),
	new Float32Array([0.0, 1.0, 2.0, 2.0, 3.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 4.0, 5.0]),
	new Float32Array([0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0])
];

/**
 * An optimized convolution shader material.
 *
 * References:
 * Masaki Kawase, Bunkasha Games, GDC2003 Presentation: [Frame Buffer Postprocessing Effects in DOUBLE-S.T.E.A.L
 * (Wreckless)](http://genderi.org/frame-buffer-postprocessing-effects-in-double-s-t-e-a-l-wreckl.html)
 * Filip Strugar, Intel, 2014: [An investigation of fast real-time GPU-based image blur algorithms](
 * https://www.intel.com/content/www/us/en/developer/articles/technical/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms.html)
 *
 * Further modified according to Apple's [Best Practices for Shaders](https://goo.gl/lmRoM5).
 *
 * @implements {Resizable}
 */

export class KawaseBlurMaterial extends ShaderMaterial {

	/**
	 * Constructs a new convolution material.
	 *
	 * TODO Remove texelSize param.
	 * @param {Vector4} [texelSize] - Deprecated.
	 */

	constructor(texelSize = new Vector4()) {

		super({
			name: "KawaseBlurMaterial",
			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector4()),
				scale: new Uniform(1.0),
				kernel: new Uniform(0.0)
			},
			blending: NoBlending,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader,
			vertexShader
		});

		this.fragmentShader = updateFragmentShader(this.fragmentShader);

		this.setTexelSize(texelSize.x, texelSize.y);

		/**
		 * The kernel size.
		 *
		 * @type {KernelSize}
		 */

		this.kernelSize = KernelSize.MEDIUM;

	}

	/**
	 * The input buffer.
	 *
	 * @type {Texture}
	 */

	set inputBuffer(value) {

		this.uniforms.inputBuffer.value = value;

	}

	/**
	 * Sets the input buffer.
	 *
	 * @deprecated Use inputBuffer instead.
	 * @param {Texture} value - The input buffer.
	 */

	setInputBuffer(value) {

		this.inputBuffer = value;

	}

	/**
	 * The kernel sequence for the current kernel size.
	 *
	 * @type {Float32Array}
	 */

	get kernelSequence() {

		return kernelPresets[this.kernelSize];

	}

	/**
	 * The blur scale.
	 *
	 * @type {Number}
	 */

	get scale() {

		return this.uniforms.scale.value;

	}

	set scale(value) {

		this.uniforms.scale.value = value;

	}

	/**
	 * Returns the blur scale.
	 *
	 * @deprecated Use scale instead.
	 * @return {Number} The scale.
	 */

	getScale() {

		return this.uniforms.scale.value;

	}

	/**
	 * Sets the blur scale.
	 *
	 * @deprecated Use scale instead.
	 * @return {Number} value - The scale.
	 */

	setScale(value) {

		this.uniforms.scale.value = value;

	}

	/**
	 * Returns the kernel.
	 *
	 * @return {Float32Array} The kernel.
	 * @deprecated Implementation detail, removed with no replacement.
	 */

	getKernel() {

		return null;

	}

	/**
	 * The current kernel.
	 *
	 * @type {Number}
	 */

	get kernel() {

		return this.uniforms.kernel.value;

	}

	set kernel(value) {

		this.uniforms.kernel.value = value;

	}

	/**
	 * Sets the current kernel.
	 *
	 * @deprecated Use kernel instead.
	 * @param {Number} value - The kernel.
	 */

	setKernel(value) {

		this.kernel = value;

	}

	/**
	 * Sets the texel size.
	 *
	 * @deprecated Use setSize() instead.
	 * @param {Number} x - The texel width.
	 * @param {Number} y - The texel height.
	 */

	setTexelSize(x, y) {

		this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);

	}

	/**
	 * Sets the size of this object.
	 *
	 * @param {Number} width - The width.
	 * @param {Number} height - The height.
	 */

	setSize(width, height) {

		const x = 1.0 / width, y = 1.0 / height;
		this.uniforms.texelSize.value.set(x, y, x * 0.5, y * 0.5);

	}

}
