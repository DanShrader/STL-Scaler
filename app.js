if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, stats, camera, cameraTarget, scene, renderer;

init();
animate();

function init() {
	var mesh, material, fileName;
	var loader = new THREE.STLLoader();

	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			// Closure to capture the file information.
			reader.onload = (function (theFile) {
				return function (e) {
				  fileName = theFile.name
					loader.load(e.target.result, function (geometry) {
						material = new THREE.MeshPhongMaterial({
							color: 0xff5533,
							specular: 0x111111,
							shininess: 200
						});
						
						if (typeof(mesh) !== 'undefined'){
						  // console.log("Exists")
  						scene.remove(mesh);
						}
						
						mesh = new THREE.Mesh(geometry, material);
						mesh.position.set(0, 0, 0);
						mesh.rotation.set(0, 0, 0);
						mesh.scale.set((20 / 19.4), (20 / 19.4), 1);
						mesh.castShadow = true;
						mesh.receiveShadow = true;
						scene.add(mesh);
					});

				};
			})(f);
			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}
	}
	document.getElementById('file-input').addEventListener('change', handleFileSelect, false);



	container = document.createElement('div');
	document.getElementById("stl").append(container);
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	
// 	var controls = new THREE.OrbitControls( camera );

	
	camera.position.set( 0, 20, 100 );
	
// 	controls.update();
	
	cameraTarget = new THREE.Vector3(0, 0, 0);
	scene = new THREE.Scene();
	var link = document.createElement('a');
	link.style.display = 'none';
	document.body.appendChild(link);

	function save(blob, filename) {
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
	}

	function saveString(text, filename) {
		save(new Blob([text], {
			type: 'text/plain'
		}), filename);
	}

	exporter = new THREE.STLExporter();

	function exportASCII() {
		var result = exporter.parse(mesh);
		var newFileName = fileName.split(".");
		newFileName = newFileName[0]+"-Corrected."+newFileName[1];
		saveString(result, newFileName);
	}

	// Lights
	scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
	addShadowedLight(1, 1, 1, 0x999999, 1.35);
	addShadowedLight(0.5, 1, -1, 0xffaa00, 1);

	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	container.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);

  // Button for the export
	document.getElementById('exportSTL').addEventListener('click', exportASCII, false);

}










function addShadowedLight(x, y, z, color, intensity) {
	var directionalLight = new THREE.DirectionalLight(color, intensity);
	directionalLight.position.set(x, y, z);
	scene.add(directionalLight);
	directionalLight.castShadow = true;
	var d = 1;
	directionalLight.shadow.camera.left = -d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = -d;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 4;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.bias = -0.002;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight * 0.8;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth , window.innerHeight * 0.8);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	var timer = Date.now() * 0.0005;
	camera.position.x = Math.cos(timer) * 30;
	camera.position.y = Math.sin(timer) * 30;
	camera.lookAt(cameraTarget);
	renderer.render(scene, camera);
}