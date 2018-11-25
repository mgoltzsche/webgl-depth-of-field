tdl.require('tdl.buffers');
tdl.require('tdl.fast');
tdl.require('tdl.log');
tdl.require('tdl.math');
tdl.require('tdl.models');
tdl.require('tdl.primitives');
tdl.require('tdl.programs');
tdl.require('tdl.textures');
tdl.require('tdl.webgl');

var s3d = {
	/**
	 * Creates a scene managing object
	 * @param gl
	 * @param attr {name, color, lights, camera, modelRefs}
	 * @returns {init(), initShaders(), draw(), animate()}
	 */
	WebGLSceneGraph : function(canvas, attr) {
		// init model-view and perspective transformation matrices
		var gl = animator = self = viewportWidth = viewportHeight = null,
			activePrograms = [], mouseMoveListener, mouseMoveCtx = null;
		
		attr = attr || {};
		
		function collectActiveShaderPrograms() {
			activePrograms = [];
			self.camera.publishPrograms(activePrograms);
			collectModelShaderPrograms(self.modelRefs);
		}
		
		function collectModelShaderPrograms(modelRefs) {
			nextModelRef : for (var i = 0; i < modelRefs.length; i++) {
				var program = modelRefs[i].model.program;
				
				if (program) {
					for (var j = 0; j < activePrograms.length; j++) {
						if (activePrograms[j] === program) {
							continue nextModelRef;
						}
					}
					
					activePrograms.push(program);
					collectModelShaderPrograms(modelRefs[i].modelRefs);
				}
			}
		}
		
		function resize() {
			viewportWidth = canvas.offsetWidth;
			viewportHeight = canvas.offsetHeight;
			canvas.width = viewportWidth;
			canvas.height = viewportHeight;
			self.update();
		}
	
		function performAnimation() {
			if (animator !== null) {
				animator((new Date()).getTime() * 0.001);
				self.draw();
				tdl.webgl.requestAnimationFrame(performAnimation, gl.canvas);
			}
		}
		
		function mouseMoveListenerWrapper(evt) {
			mouseMoveListener(evt, mouseMoveCtx);
		}
		
		function startMouseMoveListening(evt) {
			mouseMoveCtx = {lastPageX : evt.pageX, lastPageY : evt.pageY};
			$(document).bind('mousemove', mouseMoveListenerWrapper);
		}
		
		function stopMouseMoveListening() {
			$(document).unbind('mousemove', mouseMoveListenerWrapper);
		}
		
		self = {
			name : attr.name ? attr.name : 'Scene3D ' + (++Scene3D.idCount),
			color : new Float32Array(attr.color ? attr.color : [0.0, 0.0, 0.0, 0.0]),
			camera : attr.camera,
			lights : attr.lights ? attr.lights : [new s3d.Light()],
			modelRefs : attr.modelRefs ? attr.modelRefs : [],
			/**
			 * Applies the new viewport size
			 */
			update : function() {
				this.camera.resize(viewportWidth, viewportHeight);
				this.updateShaders();
			},
			/**
			 * Detects active shader programs and sets global scene uniforms
			 */
			updateShaders : function() {
				collectActiveShaderPrograms();
				this.camera.applyUniforms();
				this.applyLights();
				this.draw();
			},
			applyLights : function() {
				for (var i = 0; i < activePrograms.length; i++) {
					var activeShader = activePrograms[i];
					activeShader.use();
					activeShader.setUniformArrays(this.lights, 'light');
				}
			},
			gl : function() {
				return gl;
			},
			activePrograms : function() {
				return activePrograms;
			},
			/**
			 * Draws current scene
			 */
			draw : function() {
				gl.viewport(0, 0, viewportWidth, viewportHeight);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				
				this.camera.draw();
			},
			/**
			 * Draws the scene animated while calling the given function.
			 * @params animatorFn function(seconds) {}
			 */
			animate : function(animatorFn) {
				animator = animatorFn;
				performAnimation();
			},
			viewportWidth : function() {
				return viewportWidth;
			},
			viewportHeight : function() {
				return viewportHeight;
			},
			setMouseMoveListener : function(fn) {
				if (fn == null) {
					stopMouseMoveListening();
					$(canvas).unbind('mousedown', startMouseMoveListening);
					$(document).unbind('mouseup', stopMouseMoveListening);
					mouseMoveListener = fn;
				} else {
					mouseMoveListener = fn;
					$(canvas).bind('mousedown', startMouseMoveListening);
					$(document).bind('mouseup', stopMouseMoveListening);
				}
			},
			toString : function() {
				return this.name;
			}
		};
		
		if (!canvas) {
			throw 'No canvas given';
		}
		
		gl = tdl.webgl.setupWebGL(canvas);
		
		if (!gl) {
			throw 'Could not initialize WebGL';
		}
		
		self.camera = self.camera || new s3d.Camera(self);
		
		// resize and draw
		resize();
		$(window).resize(resize);
		
		return self;
	},

	/**
	 * Creates a new Camera instance.
	 * @param attr {position, focus, top, rotation}
	 * @returns cameraInstance
	 */
	Camera : function(scene, attr) {
		attr = attr || {};
		
		var transformation = new Float32Array(16),
			uniforms = attr.uniforms || {},
			negFocus = new Float32Array(3),
			eyePos = new Float32Array(3),
			eyePosTmp = new Float32Array(4),
			eyeFocus = new Float32Array(3),
			eyeFocusTmp = new Float32Array(4),
			fast = tdl.fast,
			mat4 = fast.matrix4,
			math = tdl.math,
			depthShader = new s3d.ShaderProgram('Depth Buffer Shader', 'depthVertexShader', 'depthFragmentShader');
		
		uniforms.view = new Float32Array(16);
		uniforms.projection = new Float32Array(16);
		uniforms.eyePosition = new Float32Array(3);
		uniforms.eyeFocus = new Float32Array(3);
		
		return {
			position : new Float32Array(attr.position || [0, 1, 7]),
			focus : new Float32Array(attr.focus || [0, -1, 0]),
			focusDistance : 0.05,
			top : new Float32Array(attr.top || [0, 1, 0]),
			maxDepth : 130,
			rotation : new Float32Array(attr.rotation || [0, 60, 0]),
			uniforms : uniforms,
			publishPrograms : function(programs) {
			},
			resize : function(width, height) {
				this.updateUniforms();
			},
			/**
			 * Applies transformations to current 
			 */
			applyUniforms : function() {
				this.updateUniforms();
				
				// apply uniforms on active shaders
				var activePrograms = scene.activePrograms();
				
				for (var i = 0; i < activePrograms.length; i++) {
					var activeShader = activePrograms[i];
					activeShader.use();
					activeShader.setUniforms(this.uniforms);
				}
			},
			updateUniforms : function() {
				// reset projection matrix
				mat4.perspective(this.uniforms.projection, math.degToRad(45), scene.viewportWidth() / scene.viewportHeight(), 1, this.maxDepth);
				
				// set camera rotation
				eyePosTmp[3] = 1;
				fast.copyVector(eyePosTmp, this.position);
				fast.negativeVector(negFocus, this.focus);
				mat4.identity(transformation);
				mat4.translate(transformation, negFocus);
				mat4.rotateX(transformation, math.degToRad(this.rotation[0]));
				mat4.rotateY(transformation, math.degToRad(this.rotation[1]));
				mat4.rotateZ(transformation, math.degToRad(this.rotation[2]));
				tdl.fast.columnMajor.mulMatrix4Vector(eyePos, transformation, eyePosTmp);
				
				// set view matrix and apply transformed eyePosition, eyeFocus
				var eyePosition = this.uniforms.eyePosition;
				this.uniforms.eyeFocus = this.focus;
				mat4.lookAt(this.uniforms.view, eyePos, this.focus, this.top);
				eyePosition[0] = eyePos[0];
				eyePosition[1] = eyePos[1];
				eyePosition[2] = eyePos[2];
				
				// apply transformed eyeFocus and eyeFocusDistance
				/*eyeFocusTmp[3] = 1;
				fast.copyVector(eyeFocusTmp, this.focus);
				tdl.fast.columnMajor.mulMatrix4Vector(eyeFocus, this.uniforms.view, eyeFocusTmp);
				fast.copyVector(eyeFocusTmp, eyeFocus);
				tdl.fast.columnMajor.mulMatrix4Vector(eyeFocus, this.uniforms.projection, eyeFocusTmp);
				this.uniforms.focusDistance = eyeFocus[2] / this.maxDepth;*/
				this.uniforms.focusDistance = this.focusDistance;
				this.uniforms.maxDepth = this.maxDepth;
			},
			applyDefaultGLProperties : function() {
				var gl = scene.gl(), bg = scene.color;
				gl.colorMask(true, true, true, true);
				gl.depthMask(true);
				gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
				gl.clearDepth(1);
				gl.depthFunc(gl.LESS);
				gl.enable(gl.CULL_FACE);
				gl.enable(gl.DEPTH_TEST);
			},
			draw : function(depth) {
				this.applyDefaultGLProperties();
				this.drawModels(depth ? this.resolveDepthShader : this.resolveProgram);
			},
			drawModels : function(programResolver) {
				for (var i = 0; i < scene.modelRefs.length; i++) {
					scene.modelRefs[i].draw(programResolver);
				}
			},
			resolveProgram : function(shader) {
				return shader;
			},
			resolveDepthShader : function() {
				return depthShader;
			},
			toString : function() {
				return 'Simple Camera';
			}
		};
	},
	
	SkyboxCamera : function(scene, camera) {
		camera = camera || new s3d.Camera(scene);
		var mat4 = tdl.fast.matrix4, viewProjection = new Float32Array(16),
			plane = tdl.primitives.createPlane(2, 2, 1, 1);
		delete plane.normal;
		delete plane.texCoord;
		tdl.primitives.reorient(plane,
			      [1, 0, 0, 0,
			       0, 0, 1, 0,
			       0,-1, 0, 0,
			       0, 0, 0.99, 1]);
		var textures = {
			skybox: tdl.textures.loadTexture([
				'textures/skybox/mid.png',
				'textures/skybox/mid.png',
				'textures/skybox/top.png',
				'textures/skybox/bottom.png',
				'textures/skybox/mid.png',
				'textures/skybox/mid.png'])
			};
		
		var self = s3d.extend(camera, {
			updateUniforms : function(parent) {
				// delegate method call
				parent();
				
				// calculates inverse viewProjection matrix (for skybox)
				var u = this.uniforms;
				mat4.copy(viewProjection, u.view);
				mat4.setTranslation(viewProjection, [0, 0, 0]);
				mat4.mul(viewProjection, viewProjection, u.projection);
				mat4.inverse(u.viewDirectionProjectionInverse, viewProjection);
			},
			draw : function(parent, depth) {
				this.applyDefaultGLProperties();
				
				this.uniforms.drawDepth = depth;
				this.skyboxModel.drawPrep(this.uniforms);
				this.skyboxModel.draw();
				
				this.drawModels(depth ? this.resolveDepthShader : this.resolveProgram);
			},
			toString : function() {
				return 'Skybox Camera';
			}
		});
		
		self.skyboxShader = new s3d.ShaderProgram('Skybox Shader', 'skyboxVertexShader', 'skyboxFragmentShader');
		self.skyboxModel = new tdl.models.Model(self.skyboxShader, plane, textures);
		self.uniforms.viewDirectionProjectionInverse = new Float32Array(16);
		
		return self;
	},

	/**
	 * Creates a new transformable model reference.
	 * @param name The models screen name
	 * @param model The tdl model
	 * @param attr {rotation, scaling, translation, modelRefs}
	 * @returns modelRef
	 */
	ModelReference : function(name, model, attr) {
		attr = attr || {};
		
		// init uniform values
		var uniforms = attr.uniforms ? attr.uniforms : {},
			mat4 = tdl.fast.matrix4,
			math = tdl.math;
		
		uniforms.model = new Float32Array(16);
		uniforms.color = uniforms.color || new Float32Array(attr.color || [0.5, 0.5, 0.5, 1]);
		
		var self = {
			name : name,
			parent : null,
			model : model,
			uniforms : uniforms,
			parentModelMatrix : mat4.identity(new Float32Array(16)),
			rotation : new Float32Array(attr.rotation || [0, 0, 0]),
			scaling : new Float32Array(attr.scaling || [ 1, 1, 1]),
			translation : new Float32Array(attr.translation || [0.0, 0.0, 0.0]),
			modelRefs : attr.modelRefs || [],
			children : function() {
				return this.modelRefs;
			},
			applyTransformations : function() {
				var modelMatrix = this.uniforms.model;
				
				mat4.copy(modelMatrix, this.parentModelMatrix); // make relative to parent if exists
				mat4.translate(modelMatrix, this.translation);
				mat4.scale(modelMatrix, this.scaling);
				mat4.rotateX(modelMatrix, math.degToRad(this.rotation[0]));
				mat4.rotateY(modelMatrix, math.degToRad(this.rotation[1]));
				mat4.rotateZ(modelMatrix, math.degToRad(this.rotation[2]));
				
				for (var i = 0; i < this.modelRefs.length; i++) {
					this.modelRefs[i].parentModelMatrix = modelMatrix;
					this.modelRefs[i].applyTransformations();
				}
			},
			/**
			 * Draws the model without its children.
			 */
			drawModel : function(programResolver) {
				var orgShader = this.model.program;
				this.model.program = programResolver(orgShader);
				
				// bind buffers
				this.model.drawPrep();
				// draw polygons with given shader uniforms
				this.model.draw(this.uniforms);
				
				this.model.program = orgShader;
			},
			/**
			 * Draws the model with its children.
			 */
			draw : function(programResolver) {					
				this.drawModel(programResolver);
				
				// draw children recursive
				for (var i = 0; i < this.modelRefs.length; i++) {
					this.modelRefs[i].draw(programResolver);
				}
			},
			toString : function() {
				return this.name;
			}
		};
		
		self.applyTransformations();
		
		return self;
	},

	/**
	 * Creates a new Light instance.
	 * @param attr {name, lightPosition, color}
	 * @returns lightInstance
	 */
	Light : function(attr) {
		s3d._lightCount++;
		attr = attr || {};
		
		var name = attr.name ? attr.name : 'Light ' + s3d._lightCount;
		
		return {
			position : new Float32Array(attr.position || [7, 7, 7]),
			color : new Float32Array(attr.color || [1, 1, 1]),
			enabled : attr.enabled === false ? false : true,
			toString : function() {
				return name;
			}
		};
	},
	
	_lightCount : 0,
	
	/**
	 * Returns a printable compiled shader program reference object
	 * (see tdl.programs.Program) with a universal setUniforms method.
	 * @param vertexShader - id or code
	 * @param fragmentShader - id or code
	 * @param params - precompiler parameters
	 * @returns programReference
	 */
	ShaderProgram : function(name, vertexShader, fragmentShader, params) {
		function precompile(code) {
			var re = /\$([\w]+)/g;
			
			while (m = re.exec(code)) {
				var p = m[1];
				
				if (!params || !params[p]) {
					throw 'IllegalArgumentException: Missing shader precompiler param: ' + p;
				}
				
				code = code.replace(new RegExp('\\$' + p + '([^\\w])', 'g'), params[p] + '$1');
			}
			
			return code;
		}
		
		function uniformNameWithoutPrefix(name, prefix) {
			if (name.length > prefix.length && name.substring(0, prefix.length) == prefix) {
				name = name.substring(prefix.length);
				return name.substring(0,1).toLowerCase() + name.substring(1);
			} else {
				return name;
			}
		}
		
		function uniformName(name) {
			return name;
		}
		
		function varyings(code) {
			var m, r = {}, re = /[^\w]varying\s+[\w]+\s+([\w]+(\[[0-9]+\])?);/g;
			while (m = re.exec(code)) {
				r[m[1]] = true;
			}
			return r;
		}
		
		function uniforms(code, r) {
			var m, re = /[^\w]uniform\s+[\w]+\s+([\w]+)(\[[0-9]+\])?;/g;
			while (m = re.exec(code)) {
				r[m[1]] = true;
			}
			return r;
		}
		
		var vertexShaderCode = vertexShader.match(/^[\w\-_]+$/) ? $('script[id='+vertexShader+']').text() : vertexShader;
		var fragmentShaderCode = fragmentShader.match(/^[\w\-_]+$/) ? $('script[id='+fragmentShader+']').text() : fragmentShader;
		
		// replace $vars with values
		vertexShaderCode = precompile(vertexShaderCode);
		fragmentShaderCode = precompile(fragmentShaderCode);
		
		// detect undefined varying vars
		var vertexVaryings = varyings(vertexShaderCode);
		var fragmentVaryings = varyings(fragmentShaderCode);
		
		for (var varying in fragmentVaryings) {
			if (!vertexVaryings[varying]) {
				throw 'ShaderCompilationException: fragment shader variable ' + varying + ' is not declared in vertex shader';
			}
		}
		
		// compile program
		var program = tdl.programs.loadProgram(vertexShaderCode, fragmentShaderCode);
		
		// make printable
		program.toString = function() {
			return name;
		};
		
		// add method to set uniforms
		var uniformNames = uniforms(vertexShaderCode, {});
		uniforms(fragmentShaderCode, uniformNames);
		
		/**
		 * Applies all uniform values from a given object.
		 * (similar to tdl.models.Model.prototype.applyUniforms_)
		 * @param values object containing uniform values
		 * @param prefix uniform name prefix (optional)
		 */
		program.setUniforms = function(values, prefix) {
			var v,propNameFn = prefix ? uniformNameWithoutPrefix : uniformName;
			
			for (var uniform in uniformNames) {
				if (typeof (v = values[propNameFn(uniform, prefix)]) != 'undefined') {
					this.setUniform(uniform, v);
				}
			}
		};
		
		/**
		 * Applies all uniform values from a given array of objects.
		 * @param values array containing uniform values
		 * @param prefix uniform name prefix (optional)
		 */
		program.setUniformArrays = function(values, prefix) {
			var propNameFn = prefix ? uniformNameWithoutPrefix : uniformName;
			
			for (var uniform in uniformNames) {
				var v, value = [], propName = propNameFn(uniform, prefix);
				
				for (var i = 0; i < values.length; i++) {
					if (typeof (v = values[i][propName]) != 'undefined') {
						if (v instanceof Float32Array) {
							for (var j = 0; j < v.length; j++) {
								value.push(v[j]);
							}
						} else {
							value.push(v);
						}
					}
				}
				
				if (value.length > 0) {
					this.setUniform(uniform, value);
				}
			}
		};
		
		return program;
	},

	extend : function(obj, extension) {
		for (var prop in extension) {
			if (typeof extension[prop] == 'function') {
				obj[prop] = typeof obj[prop] == 'function'
						? s3d.extensionMethod(obj, prop, extension[prop])
						: extension[prop];
			} else {
				obj[prop] = extension[prop];
			}
		}
		
		return obj;
	},
	
	extensionMethod : function(obj, fnName, extFn) {
		var superFn = s3d.objectFnClosure(obj, obj[fnName]);
		
		return function(a, b, c) {
			return extFn.call(obj, superFn, a, b, c);
		};
	},
	
	objectFnClosure : function(obj, fn) {
		return function(a, b, c) {
			return fn.call(obj, a, b, c);
		};
	}
};