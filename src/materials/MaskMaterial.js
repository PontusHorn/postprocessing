import { NoBlending, ShaderMaterial, Uniform, UnsignedByteType } from "three";
import { ColorChannel, MaskFunction } from "../enums/index.js";

import fragmentShader from "./glsl/mask.frag";
import vertexShader from "./glsl/common.vert";

/**
 * A mask shader material.
 *
 * This material applies a mask texture to a buffer.
 */

export class MaskMaterial extends ShaderMaterial {

	/**
	 * Constructs a new mask material.
	 *
	 * @param {Texture} [maskTexture] - The mask texture.
	 */

	constructor(maskTexture = null) {

		super({
			name: "MaskMaterial",
			uniforms: {
				maskTexture: new Uniform(maskTexture),
				inputBuffer: new Uniform(null),
				strength: new Uniform(1.0)
			},
			blending: NoBlending,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader,
			vertexShader
		});

		this.colorChannel = ColorChannel.RED;
		this.maskFunction = MaskFunction.DISCARD;

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

		this.uniforms.inputBuffer.value = value;

	}

	/**
	 * The mask texture.
	 *
	 * @type {Texture}
	 */

	set maskTexture(value) {

		this.uniforms.maskTexture.value = value;
		delete this.defines.MASK_PRECISION_HIGH;

		if(value.type !== UnsignedByteType) {

			this.defines.MASK_PRECISION_HIGH = "1";

		}

		this.needsUpdate = true;

	}

	/**
	 * Sets the mask texture.
	 *
	 * @deprecated Use maskTexture instead.
	 * @param {Texture} value - The texture.
	 */

	setMaskTexture(value) {

		this.maskTexture = value;

	}

	/**
	 * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
	 *
	 * @type {ColorChannel}
	 */

	set colorChannel(value) {

		this.defines.COLOR_CHANNEL = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the color channel to use for masking. Default is `ColorChannel.RED`.
	 *
	 * @deprecated Use colorChannel instead.
	 * @param {ColorChannel} value - The channel.
	 */

	setColorChannel(value) {

		this.colorChannel = value;

	}

	/**
	 * The masking technique. Default is `MaskFunction.DISCARD`.
	 *
	 * @type {MaskFunction}
	 */

	set maskFunction(value) {

		this.defines.MASK_FUNCTION = value.toFixed(0);
		this.needsUpdate = true;

	}

	/**
	 * Sets the masking technique. Default is `MaskFunction.DISCARD`.
	 *
	 * @deprecated Use maskFunction instead.
	 * @param {MaskFunction} value - The function.
	 */

	setMaskFunction(value) {

		this.maskFunction = value;

	}

	/**
	 * Indicates whether the masking is inverted.
	 *
	 * @type {Boolean}
	 */

	get inverted() {

		return (this.defines.INVERTED !== undefined);

	}

	set inverted(value) {

		if(this.inverted && !value) {

			delete this.defines.INVERTED;

		} else if(value) {

			this.defines.INVERTED = "1";

		}

		this.needsUpdate = true;

	}

	/**
	 * Indicates whether the masking is inverted.
	 *
	 * @deprecated Use inverted instead.
	 * @return {Boolean} Whether the masking is inverted.
	 */

	isInverted() {

		return this.inverted;

	}

	/**
	 * Determines whether the masking should be inverted.
	 *
	 * @deprecated Use inverted instead.
	 * @param {Boolean} value - Whether the masking should be inverted.
	 */

	setInverted(value) {

		this.inverted = value;

	}

	/**
	 * The current mask strength.
	 *
	 * Individual mask values will be clamped to [0.0, 1.0]. Has no effect when the mask function is set to `DISCARD`.
	 *
	 * @type {Number}
	 */

	get strength() {

		return this.uniforms.strength.value;

	}

	set strength(value) {

		this.uniforms.strength.value = value;

	}

	/**
	 * Returns the current mask strength.
	 *
	 * @deprecated Use strength instead.
	 * @return {Number} The mask strength.
	 */

	getStrength() {

		return this.strength;

	}

	/**
	 * Sets the mask strength.
	 *
	 * Has no effect when the mask function is set to `DISCARD`.
	 *
	 * @deprecated Use strength instead.
	 * @param {Number} value - The mask strength.
	 */

	setStrength(value) {

		this.strength = value;

	}

}
