tdl.require('tdl.framebuffers');

s3d.postProcessor = {
	
	PostProcessingCamera : function(scene, pipeline, camera) {
		camera = camera || new s3d.SkyboxCamera(scene);
		var self = null, planeArrays = tdl.primitives.createPlane(2, 2, 1, 1);
		delete planeArrays.normal;
		tdl.primitives.reorient(planeArrays,
			      [1, 0, 0, 0,
			       0, 0, 1, 0,
			       0,-1, 0, 0,
			       0, 0, 0.99, 1]);
		var imageShader = new s3d.ShaderProgram('Image Shader', 'imageVertexShader', 'imageFragmentShader'),
			imagePlane = new tdl.models.Model(imageShader, planeArrays, {}),
			draw = camera.draw,
			currentCustomProgram = null;
		
		function resolveProgram() {
			return currentCustomProgram;
		}
		
		var drawingContext = {
			frameBuffers : {},
			draw : function(drawDepth) {
				draw.call(this, drawDepth);
			},
			gl : function() {
				return scene.gl();
			},
			drawImage : function(shaderProgram, uniforms, textures) {
				self.drawImage(shaderProgram, uniforms, textures);
			}
		};
		
		return self = s3d.extend(camera, {
			drawingContext : drawingContext,
			imageShader : imageShader,
			imagePlane : imagePlane,
			pipeline : pipeline || [new s3d.postProcessor.MainFramePostProcessor()],
			pipelineLength : pipeline ? pipeline.length : 1,
			children : function() {
				return this.pipeline;
			},
			publishPrograms : function(parent, programs) {
				parent(programs);
				
				for (var i = 0; i < this.pipeline.length; i++) {
					this.pipeline[i].publishPrograms(programs);
				}
			},
			resize : function(parent, width, height) {
				parent(width, height);
				
				for (var i = 0; i < this.pipeline.length; i++) {
					this.pipeline[i].init(this.drawingContext, width, height);
				}
			},
			draw : function(parent) {
				var lastFrameBuffer = null;
				
				for (var i = 0; i < this.pipelineLength; i++) {
					lastFrameBuffer = this.pipeline[i].process(this.drawingContext);
				}
				
				this.drawImage(this.imageShader, {}, {image: lastFrameBuffer.texture});
			},
			drawImage : function(shaderProgram, uniforms, textures) {
				var gl = scene.gl(), p = this.imagePlane;
								
				gl.disable(gl.CULL_FACE);
				gl.disable(gl.DEPTH_TEST);
				gl.disable(gl.BLEND);
				gl.clear(gl.COLOR_BUFFER_BIT);
				
				p.setProgram(shaderProgram);
				p.textures = textures;
				p.drawPrep(uniforms);
				p.draw();
			},
			toString : function() {
				return 'Post Processing Camera';
			}
		});
	},
	
	SimpleColorPostProcessor : function() {
		return {
			init : function(ctx, width, height) {
				ctx.frameBuffers.color = tdl.framebuffers.createFramebuffer(width, height, true);
			},
			process : function(ctx) {
				var gl = ctx.gl(), fb = ctx.frameBuffers;
				
				fb.color.bind();
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				ctx.draw();
				fb.color.unbind();
				
				return fb.color;
			},
			publishPrograms : function(programs) {
			},
			toString : function() {
				return 'Color Post Processor';
			}
		};
	},
	
	DepthPostProcessor : function() {
		return {
			depthShader : new s3d.ShaderProgram('Depth Buffer Shader', 'depthVertexShader', 'depthFragmentShader'),
			init : function(ctx, width, height) {
				ctx.frameBuffers.depth = new tdl.framebuffers.Float32Framebuffer(width, height, true);
				//camera.frameBuffers.depthBuffer = new tdl.framebuffers.createFramebuffer(width, height, true);
			},
			process : function(ctx) {
				var gl = ctx.gl(), fb = ctx.frameBuffers;
				
				fb.depth.bind();
				gl.enable(gl.CULL_FACE);
				gl.enable(gl.DEPTH_TEST);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				ctx.draw(true);
				fb.depth.unbind();
				
				return fb.depth;
			},
			publishPrograms : function(programs) {
				programs.push(this.depthShader);
			},
			toString : function() {
				return 'Depth Post Processor';
			}
		};
	},
	
	DepthBlurPostProcessor : function() {
		return {
			texDownSampling : 2,
			init : function(ctx, width, height) {
				var fb = ctx.frameBuffers,
					downSampledWidth = width / this.texDownSampling,
					downSampledHeight = height / this.texDownSampling;
				
				fb.horizontalDepthBlur = new tdl.framebuffers.Float32Framebuffer(width, height);
				fb.depthBlur = new tdl.framebuffers.Float32Framebuffer(width, height);
				this.horizontalBlurUniforms = {texelSize: new Float32Array([1.0 / width, 0])};
				this.horizontalBlurTexture = {texDepth: fb.depth.texture};
				this.verticalBlurUniforms = {texelSize: new Float32Array([0, 1.0 / height])};
				this.verticalBlurTexture = {texDepth: fb.horizontalDepthBlur.texture};
				
				if (!this.blurShader) {
					this.blurShader = new s3d.ShaderProgram('Blur Depth Shader', 'imageVertexShader', 'depthBlurFragmentShader');
				}
			},
			process : function(ctx) {
				var fb = ctx.frameBuffers;
				
				// draw mainFrameBuffer to horizontalBlurFrameBuffer with width / texDownSampling
				fb.horizontalDepthBlur.bind();
				ctx.drawImage(this.blurShader, this.horizontalBlurUniforms, this.horizontalBlurTexture);
				fb.horizontalDepthBlur.unbind();
				
				// draw horizontalBlurFrameBuffer to verticalBlurFrameBuffer with width / texDownSampling, height / texDownSampling
				fb.depthBlur.bind();
				ctx.drawImage(this.blurShader, this.verticalBlurUniforms, this.verticalBlurTexture);
				fb.depthBlur.unbind();
				
				return fb.depthBlur;
			},
			publishPrograms : function(programs) {
				programs.push(this.blurShader);
			},
			toString : function() {
				return 'Depth Blur Post Processor';
			}
		};
	},
	
	BlurPostProcessor : function(frameBufferName, blurSize) {
		frameBufferName = frameBufferName || 'color';
		blurSize = blurSize || 2.0;
		var texDownSampling = blurSize * 2;
		
		return {
			init : function(ctx, width, height) {
				var fb = ctx.frameBuffers;
				
				fb.horizontalBlur = tdl.framebuffers.createFramebuffer(width / texDownSampling, height);
				fb.blur = tdl.framebuffers.createFramebuffer(width / texDownSampling, height / texDownSampling);
				this.horizontalBlurUniforms = {blurSize: new Float32Array([blurSize / width, 0])};
				this.horizontalBlurTexture = {image: fb[frameBufferName].texture};
				this.verticalBlurUniforms = {blurSize: new Float32Array([0, blurSize / height])};
				this.verticalBlurTexture = {image: fb.horizontalBlur.texture};
				
				if (!this.blurShader) {
					this.blurShader = new s3d.ShaderProgram('Blur Shader', 'imageVertexShader', 'blurFragmentShader');
				}
			},
			process : function(ctx) {
				var fb = ctx.frameBuffers;
				
				// draw mainFrameBuffer to horizontalBlurFrameBuffer with width / texDownSampling
				fb.horizontalBlur.bind();
				ctx.drawImage(this.blurShader, this.horizontalBlurUniforms, this.horizontalBlurTexture);
				fb.horizontalBlur.unbind();
				
				// draw horizontalBlurFrameBuffer to verticalBlurFrameBuffer with width / texDownSampling, height / texDownSampling
				fb.blur.bind();
				ctx.drawImage(this.blurShader, this.verticalBlurUniforms, this.verticalBlurTexture);
				fb.blur.unbind();
				
				return fb.blur;
			},
			publishPrograms : function(programs) {
				programs.push(this.blurShader);
			},
			toString : function() {
				return frameBufferName + ' Blur Post Processor';
			}
		};
	},
	
	CoCBlurPostProcessor : function() {
		var texDownSampling = 2;
		
		return {
			blurShader : new s3d.ShaderProgram('CoC Blur Shader', 'imageVertexShader', 'cocBlurFragmentShader'),
			init : function(ctx, width, height) {
				var fb = ctx.frameBuffers,
					downSampledWidth = width / texDownSampling,
					downSampledHeight = height / texDownSampling;
				
				fb.horizontalBlur = new tdl.framebuffers.Float32Framebuffer(downSampledWidth, height);
				fb.blur = new tdl.framebuffers.Float32Framebuffer(downSampledWidth, downSampledHeight);
				
				this.horizontalUniforms = {
					texelSize:		new Float32Array([1.0 / downSampledWidth, 0]),
				};
				this.verticalUniforms = {
					texelSize:		new Float32Array([0, 1.0 / downSampledHeight]),
				};
				this.horizontalTextures = {
					image: 			fb.dofMask.texture
				};
				this.verticalTextures = {
					image: 			fb.horizontalBlur.texture
				};
			},
			process : function(ctx) {
				var fb = ctx.frameBuffers;
				
				// draw mainFrameBuffer to horizontalBlurFrameBuffer with width / texDownSampling
				fb.horizontalBlur.bind();
				ctx.drawImage(this.blurShader, this.horizontalUniforms, this.horizontalTextures);
				fb.horizontalBlur.unbind();
				
				// draw horizontalBlurFrameBuffer to verticalBlurFrameBuffer with width / texDownSampling, height / texDownSampling
				fb.blur.bind();
				ctx.drawImage(this.blurShader, this.verticalUniforms, this.verticalTextures);
				fb.blur.unbind();
				
				return fb.blur;
			},
			publishPrograms : function(programs) {
				programs.push(this.blurShader);
			},
			toString : function() {
				return 'Circle of Confusion masked Blur Post Processor';
			}
		};
	},
	
	CoCPostProcessor : function() {
		return {
			dofMaskShader : new s3d.ShaderProgram('Color + CoC Shader', 'imageVertexShader', 'cocFragmentShader'),
			uniforms : {
				focusSize: 0.005,
				near: 0.01,
				far: 0.61
			},
			init : function(ctx, width, height) {
				var fb = ctx.frameBuffers;
				
				fb.dofMask = new tdl.framebuffers.Float32Framebuffer(width, height);
				
				this.textures = {
						texColor: fb.color.texture,
						texDepth: fb.depth.texture
				};
			},
			process : function(ctx) {
				var fb = ctx.frameBuffers;
				
				fb.dofMask.bind();
				ctx.drawImage(this.dofMaskShader, this.uniforms, this.textures);
				fb.dofMask.unbind();
				
				return fb.dofMask;
			},
			publishPrograms : function(programs) {
				programs.push(this.dofMaskShader);
			},
			toString : function() {
				return 'Color with Circle of Confusion Post Processor';
			}
		};
	},
	
	DOFPostProcessor : function() {
		return {
			dofShader : new s3d.ShaderProgram('DOF Shader', 'imageVertexShader', 'dofFragmentShader'),
			uniforms : {
				innerRange: 0.07,
				outerRange: 0.1
			},
			init : function(ctx, width, height) {
				var fb = ctx.frameBuffers;
				
				fb.dof = tdl.framebuffers.createFramebuffer(width, height);
				
				this.textures = {
						texBlur: fb.blur.texture,
						texDOFMask: fb.dofMask.texture
				};
			},
			process : function(ctx) {
				var fb = ctx.frameBuffers;
				
				fb.dof.bind();
				ctx.drawImage(this.dofShader, this.uniforms, this.textures);
				fb.dof.unbind();
				
				return fb.dof;
			},
			publishPrograms : function(programs) {
				programs.push(this.dofShader);
			},
			toString : function() {
				return 'DOF Post Processor';
			}
		};
	}
};
