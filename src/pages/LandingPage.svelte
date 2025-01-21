<!-- src/pages/LandingPage.svelte -->
<script>
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { onMount } from "svelte";
  import { playerName } from "../store.js";
  import { push } from "svelte-spa-router";

  let container;

  // Svelte-Store: Spielername
  $: $playerName;

  function startAdventure() {
    if ($playerName.trim()) {
      push("/adventure");
    }
  }

  onMount(() => {
    // 1) Szene, Kamera & Renderer
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

    // 2) Beleuchtung
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 3) Boden hinzufügen
    //    Plane-Geometrie (50x50), grünes Material, Rotation um -90° und Position so, 
    //    dass das Modell später auf y=-1 steht.
    const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI / 2; // horizontaler Boden
    plane.position.y = -1;          // leicht abgesenkt
    scene.add(plane);

    // 4) GLTF-Modell laden
    const loader = new GLTFLoader();
    loader.load(
      "/models/scene.gltf",
      (gltf) => {
        const model = gltf.scene;
        
        // Skalierung: Beispielhaft basierend auf Bildschirmbreite
        const scale = window.innerWidth / 1000;
        model.scale.set(scale, scale, scale);

        // Position: y=-1 und z=-5 => direkt auf dem Boden
        model.position.set(0, -1, -5);

        scene.add(model);

        // Texturen je nach Material laden
        model.traverse((child) => {
          if (child.isMesh) {
            const textureLoader = new THREE.TextureLoader();
            const materialName = child.material.name;
            const texturePath = `/models/textures/${materialName}_baseColor.png`;
            child.material.map = textureLoader.load(texturePath);
            child.material.needsUpdate = true;
          }
        });

        // Animationsloop
        function animate() {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        }
        animate();

        // Mausbewegungen → NUR link/rechts Rotation (Y-Achse)
        // Keine Rotation in X, damit nichts nach oben/unten geneigt wird.
        window.addEventListener("mousemove", (event) => {
          const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          //const mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Wird NICHT mehr genutzt

          // Nur Y-Rotation (links/rechts)
          model.rotation.y = mouseX * 0.5;
        });
      },
      undefined,
      (error) => {
        console.error("Fehler beim Laden des Modells:", error);
      }
    );

    camera.position.z = 5;

    return () => {
      // Cleanup, falls die Komponente entladen wird
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
    font-family: sans-serif;
  }

  input {
    padding: 0.5rem;
    margin: 1rem 0;
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

<h1>Willkommen im Dschungel-Abenteuer!</h1>
<p>Bitte gib deinen Namen ein, bevor du startest:</p>
<input type="text" bind:value={$playerName} placeholder="Dein Name" />
<button on:click={startAdventure} disabled={!$playerName.trim()}>
  Abenteuer starten
</button>