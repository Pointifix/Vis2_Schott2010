import {
	Uniform
} from '../../../../build/three';

export const VolumeRenderShader1: {
	uniforms: {
		u_size: Uniform;
		u_volume: Uniform;
	};
	vertexShader: string;
	fragmentShader: string;
};
