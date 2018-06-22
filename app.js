		if (!Detector.webgl) Detector.addGetWebGLMessage();

		var container, stats;
		var camera, cameraTarget, scene, renderer;

		init();
		animate();

		function init() {

			var mesh;
			var material;
			var loader = new THREE.STLLoader();

			function handleFileSelect(evt) {
				var files = evt.target.files; // FileList object
				// console.log(files)
				// Loop through the FileList and render image files as thumbnails.
				for (var i = 0, f; f = files[i]; i++) {
					// console.log('ffffffffffff')
					// console.log(f)

					var reader = new FileReader();

					// Closure to capture the file information.
					reader.onload = (function (theFile) {
						return function (e) {
							// console.log(escape(theFile.name))

							// THANKS
							// https://www.html5rocks.com/en/tutorials/file/dndfiles/

							// 	loader.load('Vent cover 2_.stl', function (geometry) {
							loader.load(e.target.result, function (geometry) {

								material = new THREE.MeshPhongMaterial({
									color: 0xff5533,
									specular: 0x111111,
									shininess: 200
								});
								mesh = new THREE.Mesh(geometry, material);
								mesh.position.set(0, 0, 0);
								mesh.rotation.set(0, 0, 0);
								mesh.scale.set((19.4 / 20), (19.4 / 20), 1);
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
			// 	document.body.appendChild(container);
			document.getElementById("stl").append(container);

			// camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
			camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
			// camera.position.set( 3, 0.15, 3 );
			camera.position.set(3, 0.15, 120);
			// cameraTarget = new THREE.Vector3( 0, -0.25, 0 );
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
				saveString(result, 'box.stl');
			}

			var params = {
				ExportSTL: function () {
					exportASCII();
				},
				ImportSTL: function () {
					console.log("Import Clicked");
				}
			};

			var gui = new dat.GUI();
		// 	gui.add(params, 'ImportSTL');
			gui.add(params, 'ExportSTL');

			// Lights

			scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
			addShadowedLight(1, 1, 1, 0x999999, 1.35);
				addShadowedLight(0.5, 1, -1, 0xffaa00, 1);
			
			// renderer
			renderer = new THREE.WebGLRenderer({
				antialias: true
			});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			renderer.shadowMap.enabled = true;

			container.appendChild(renderer.domElement);

			// stats

			// 	stats = new Stats();
			// 	container.appendChild(stats.dom);

			//

			window.addEventListener('resize', onWindowResize, false);

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
			camera.aspect = window.innerWidth * .8 / window.innerHeight * .8;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth * .8, window.innerHeight * .8);
		}

		function animate() {
			requestAnimationFrame(animate);
			render();
			// 	stats.update();
		}

		function render() {
			var timer = Date.now() * 0.0005;
			camera.position.x = Math.cos(timer) * 30;
			camera.position.y = Math.sin(timer) * 30;
			camera.lookAt(cameraTarget);
			renderer.render(scene, camera);
		}