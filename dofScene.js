/**
 * Initializes the webGL scene. 
 */
window.onload = function() {
	var canvas = document.getElementById('canvas');
	
	// create lights
	var lights = [
		new s3d.Light({position: [0, 50, -50], color: [1,1,1]}),
		new s3d.Light({position: [0, 50, 50], color: [1,1,1]})
	];
	
	// create scene (and gl context)
	var scene = new s3d.WebGLSceneGraph(canvas, {name: 'My nice Scene', lights: lights});
	
	// create shader
	var phongShader = new s3d.ShaderProgram('Phong Shader', 'vertexShader', 'phongFragmentShader', {lightCount : lights.length});
	var toonShader = new s3d.ShaderProgram('Toon Shader', 'vertexShader', 'phongToonFragmentShader', {lightCount : lights.length});
	var texShader = new s3d.ShaderProgram('Textured Phong Shader', 'vertexShader', 'textureFragmentShader', {lightCount : lights.length});
	
	var shaders = [
		phongShader,
		toonShader,
		texShader
	];
	
	var textures = {
		earth: tdl.textures.loadTexture('textures/earth-2k-land-ocean-noshade.png')
	};
	
	var cube = new tdl.models.Model(phongShader, tdl.primitives.createCube(1.7), textures);
	var sphere = new tdl.models.Model(texShader, tdl.primitives.createSphere(1, 27, 27), textures);
	
	var models = [cube, sphere];
	
	// create modelRefs
	var n = 8,
		margin = 7,
		offset = -n * margin / 2.0;
	
	for (var i = 0; i <= n; i++) {
		for (var j = 0; j <= n; j++) {
			for (var k = 0; k <= n; k++) {
				var model = models[scene.modelRefs.length % 2];
					modelRef = new s3d.ModelReference('Object ' + scene.modelRefs.length, model,
									{translation:[offset + i * margin, offset + j * margin, offset + k * margin], color:[1,0,0,1]});
				
				scene.modelRefs.push(modelRef);
			}
		}
	}
	
	// create cameras
	var postProcessorPipeline = [
		new s3d.postProcessor.SimpleColorPostProcessor(),
		new s3d.postProcessor.DepthPostProcessor(),
		new s3d.postProcessor.DepthBlurPostProcessor(),
		new s3d.postProcessor.CoCPostProcessor(),
		new s3d.postProcessor.CoCBlurPostProcessor(),
		//new s3d.postProcessor.BlurPostProcessor(),
		new s3d.postProcessor.DOFPostProcessor()
	];
	
	var postProcessingCamera = new s3d.postProcessor.PostProcessingCamera(scene, postProcessorPipeline);
	postProcessingCamera.position = [0, 15, -41];
	postProcessingCamera.focusDistance = 0.23;
	var cameras = [
			postProcessingCamera
	];
	scene.camera = postProcessingCamera;
	//scene.camera.rotation[1] = 13;
	scene.update();
	
	// animate scene by camera rotation
	scene.animate(function(seconds) {
		scene.camera.rotation[1] = seconds * 5 % 360;
		scene.camera.applyUniforms();
	});
	
	
	// define UI controls ...
	var focusInput = $('#focusDistance');
	focusInput.change(function(e,o) {
		postProcessingCamera.focusDistance = focusInput.val() / 100.0;
	});
	
	var cameraSelector = new s3dCtrls.SelectTree($('#cameraSelector'), cameras, 'navi');

	cameraSelector.onSelect(function(camera) {
		var pp = 'Post Processor', name = camera.toString();
		
		if (name.length > pp.length &&
				name.substring(name.length - pp.length) == pp) {
			camera = postProcessingCamera;
			camera.pipelineLength = 1;
			
			while (camera.pipeline[camera.pipelineLength - 1].toString() != name) {
				camera.pipelineLength++;
			}
		}
		
		scene.camera = camera;
		scene.update();
	});
	
	// hook canvas drag event
	var transformationFn = {
		translation : function(src, target) {
			target[0] += src[0] / 80;
			target[1] += -src[1] / 80;
		},
		rotation : function(src, target) {
			target[0] += src[1] / 5;
			target[1] += src[0] / 5;
		},
		scaling : function(src, target) {
			target[0] += src[0] / 15;
			target[1] += -src[1] / 15;
		}
	};
	
	scene.setMouseMoveListener(function(evt, ctx) {
		var cursorDelta = [
				evt.pageX - ctx.lastPageX,
				evt.pageY - ctx.lastPageY
		];
		
		ctx.lastPageX = evt.pageX;
		ctx.lastPageY = evt.pageY;
		
		var obj = objSelector.getSelected();
		var trns = transformationSelector.getSelected();
		
		transformationFn[trns](cursorDelta, obj[trns]);
		obj.applyTransformations();
		
		scene.draw();
	});
	
	// hook key events
	$(document).keypress(function(e) {
		var k = e.which;
		
		if (k >= 49 && k < 49 + shaders.length) { // 1..9
			shaderSelectFn(shaders[k - 49]);
		}
	});
};
