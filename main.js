/**
 * Initializes the webGL scene. 
 */
window.onload = function() {
	var canvas = document.getElementById('canvas');
	
	// create lights
	var lights = [
		new s3d.Light(),
		new s3d.Light({position: [-10, -17, 7], color: [1,0,0]}),
		new s3d.Light({position: [-20, 5, 7], color: [0,1,0]}),
		new s3d.Light({position: [20, -5, 7], color: [0,0,1]})
	];
	
	// create scene (and gl context)
	var scene = new s3d.WebGLSceneGraph(canvas, {name: 'My nice Scene', lights: lights});
	
	// create shader
	var phongShader = new s3d.ShaderProgram('Phong Shader', 'simpleVertexShader', 'phongFragmentShader', {lightCount : lights.length});
	var simplePhongShader = new s3d.ShaderProgram('Simple Phong Shader', 'vertexShader', 'simplePhongFragmentShader', {lightCount : lights.length});
	var toonShader = new s3d.ShaderProgram('Toon Shader', 'simpleVertexShader', 'phongToonFragmentShader', {lightCount : lights.length});
	var lambertShader = new s3d.ShaderProgram('Lambert Shader', 'vertexShader', 'ambientFragmentShader', {lightCount : lights.length});
	var texShader = new s3d.ShaderProgram('Textured Phong Shader', 'simpleVertexShader', 'textureFragmentShader', {lightCount : lights.length});
	var sphericTexShader = new s3d.ShaderProgram('Spheric Texture Phong Shader', 'sphericTexVertexShader', 'sphericTexFragmentShader', {lightCount : lights.length});
	var genTexShader = new s3d.ShaderProgram('Generated Texture Shader', 'simpleVertexShader', 'generatedTextureFragmentShader', {lightCount : lights.length});
	
	
	// set shader parameters
	var defaultTexGenParams = {
		pointColor: new Float32Array([1, 1, 0]),
		pointDensity: 5,
		pointRadius: 50
	};
	genTexShader.use();
	genTexShader.setUniforms(defaultTexGenParams);
	
	var shaders = [
		phongShader,
		simplePhongShader,
		toonShader,
		lambertShader,
		texShader,
		sphericTexShader,
		genTexShader
	];
	
	var textures = {
		earth: tdl.textures.loadTexture('textures/earth-2k-land-ocean-noshade.png'),
		sphere: tdl.textures.loadTexture('textures/sphere04.png')
	};
	
	// create tdl primitives
	var torus = new tdl.models.Model(toonShader, tdl.primitives.createTorus(0.7, 0.5, 25, 25), textures);
	var torusRef = new s3d.ModelReference('Torus', torus, {translation:[-1.7, 0, 0], rotation:[90,0,0], color:[0.2,0.2,0.5,1]});
	var cube = new tdl.models.Model(genTexShader, tdl.primitives.createCube(2), textures);
	var cubeRef = new s3d.ModelReference('Cube', cube, {translation:[-2, -1.7, -2]});
	var sphere = new tdl.models.Model(sphericTexShader, tdl.primitives.createSphere(1.2, 35, 35), textures);
	var sphereRef = new s3d.ModelReference('Sphere', sphere, {translation:[1.7, 0, 0], modelRefs:[cubeRef], color:[1,0,0,1]});
	
	scene.modelRefs = [sphereRef, torusRef];
	
	// create cameras
	var postProcessorPipeline = [
		new s3d.postProcessor.SimpleColorPostProcessor(),
		new s3d.postProcessor.DepthPostProcessor(),
		new s3d.postProcessor.DepthBlurPostProcessor(),
		/*new s3d.postProcessor.CoCPostProcessor(),
		//new s3d.postProcessor.BlurPostProcessor('color', 4.0),
		new s3d.postProcessor.CoCBlurPostProcessor(),
		new s3d.postProcessor.DOFPostProcessor()*/
	];
	var postProcessingCamera = new s3d.postProcessor.PostProcessingCamera(scene, postProcessorPipeline);
	var cameras = [
			scene.camera,
			new s3d.SkyboxCamera(scene),
			postProcessingCamera
	];
	scene.camera = postProcessingCamera;
	postProcessingCamera.rotation[1] = 110;
	postProcessingCamera.applyUniforms();
	// animate scene by camera rotation
	/*scene.animate(function(seconds) {
		scene.camera.rotation[1] = seconds * 15 % 360;
		scene.camera.applyUniforms();
	});*/
	
	
	// define UI controls ...	
	var objSelector = new s3dCtrls.SelectTree($('#objectSelector'), scene.modelRefs, 'navi');
	var transformationSelector = new s3dCtrls.SelectTree($('#transformationSelector'), [ 'translation', 'rotation', 'scaling' ], 'navi');
	var cameraSelector = new s3dCtrls.SelectTree($('#cameraSelector'), cameras, 'navi');
	var shaderSelector = new s3dCtrls.SelectTree($('#shaderSelector'), shaders, 'navi');
	var lightSelector = new s3dCtrls.SelectTree($('#lightSelector'), lights, 'navi', true);
	var lightPositionEditor = new s3dCtrls.VectorEditor($('#lightPositionEditor'));
	var lightColorEditor = new s3dCtrls.VectorEditor($('#lightColorEditor'));
	var pColorEditor = new s3dCtrls.VectorEditor($('#pColorEditor'));
	var pDensityEditor = new s3dCtrls.FloatEditor($('#pDensityEditor'), 'Density');
	var pRadiusEditor = new s3dCtrls.FloatEditor($('#pRadiusEditor'), 'Radius');
	pColorEditor.setValues(defaultTexGenParams.pointColor);
	pDensityEditor.val(defaultTexGenParams.pointDensity);
	pRadiusEditor.val(defaultTexGenParams.pointRadius);
	
	var applyLightProperties = function() {
		var light = lightSelector.getSelected();
		light.position = lightPositionEditor.getValues();
		light.color = lightColorEditor.getValues();
		scene.applyLights();
	};
	
	var applyShaderParam = function() {
		genTexShader.use();
		genTexShader.setUniforms({
			pointColor: pColorEditor.getValues(),
			pointDensity: pDensityEditor.val(),
			pointRadius: pRadiusEditor.val()
		});
	};
	
	var shaderParamApplyBtn = $('<button type="submit">apply tex gen params</button>').click(applyShaderParam);
	shaderSelector.append($('<li/>').append(shaderParamApplyBtn));
	
	var lightApplyBtn = $('<button type="submit">apply</button>').click(applyLightProperties);
	lightSelector.append($('<li/>').append(lightApplyBtn));
	
	
	
	var showSelection = function() {
		var info = $('#info');
		info.css('display', 'block');
		info.html('SELECTION: object: ' + objSelector.getSelected() +
				', transformation: ' + transformationSelector.getSelected() +
				', light: ' + lightSelector.getSelected());
	};
	
	objSelector.onSelect(showSelection);
	transformationSelector.onSelect(showSelection);
	
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
	
	lightSelector.onSelect(function(light) {
		showSelection();
		lightPositionEditor.setValues(light.position);
		lightColorEditor.setValues(light.color);
	});
	
	lightSelector.onCheck(function(light, checked) {
		light.enabled = checked;
		scene.applyLights();
	});
	
	var shaderSelectFn = function(shader) {
		objSelector.getSelected().model.setProgram(shader);
		scene.updateShaders();
	};
	
	shaderSelector.onSelect(shaderSelectFn);
	
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