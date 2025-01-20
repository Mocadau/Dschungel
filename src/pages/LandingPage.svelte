<script>
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { onMount } from "svelte";

  let container;
  let playerName = '';

  function startAdventure() {
    if (playerName.trim()) {
      // Navigation zur Abenteuerseite mit URL-Parametern
      window.location.href = `#/adventure?name=${encodeURIComponent(playerName)}`;
    }
  }

  onMount(() => {
    // Szene, Kamera und Renderer erstellen
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Beleuchtung hinzufügen
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // GLTF-Modell laden
    const loader = new GLTFLoader();
    loader.load(
      "/models/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        const scale = window.innerWidth / 1000; // Skalieren des Modells basierend auf der Bildschirmbreite
        model.scale.set(scale, scale, scale);
        model.position.set(0, -1, -5); // Position setzen
        scene.add(model);

        // Texturen für jedes Mesh im Modell laden
        model.traverse((child) => {
          if (child.isMesh) {
            const textureLoader = new THREE.TextureLoader();
            const materialName = child.material.name;
            const texturePath = `/models/textures/${materialName}_baseColor.png`;
            child.material.map = textureLoader.load(
              texturePath,
              () => console.log(`Texture ${texturePath} loaded successfully`),
              undefined,
              (err) => console.error(`Error loading texture ${texturePath}`, err)
            );
            child.material.needsUpdate = true;
          }
        });

        // Animations-Loop
        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
        animate();

        // Mausbewegungen
        window.addEventListener("mousemove", (event) => {
          const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
          model.rotation.y = mouseX * 0.5;
          model.rotation.x = mouseY * 0.2;
        });
      },
      undefined,
      (error) => {
        console.error("Fehler beim Laden des Modells:", error);
      }
    );

    camera.position.z = 5;

    // Cleanup beim Entfernen der Komponente
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeChild(renderer.domElement);
    };
  });
</script>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
  }

  .container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  h1,
  p,
  input,
  button {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  }

  input {
    padding: 0.5rem;
    margin: 1rem 0;
    display: block;
    text-align: center;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
</style>

<div class="container" bind:this={container}></div>

<!-- Texte und Buttons -->
<h1>Willkommen im Dschungel-Abenteuer!</h1>
<p>Bitte gib deinen Namen ein, bevor du startest:</p>
<input type="text" bind:value={playerName} placeholder="Dein Name" />
<button on:click={startAdventure} disabled={!playerName.trim()}>Abenteuer starten</button>