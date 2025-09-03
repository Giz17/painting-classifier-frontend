// src/components/OGLCanvas.jsx
import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Box, Program, Mesh } from 'ogl';

const OGLCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderer = new Renderer({ canvas: canvasRef.current });
    const gl = renderer.gl;
    gl.clearColor(0.1, 0.1, 0.1, 1);

    const camera = new Camera(gl);
    camera.position.z = 5;

    const scene = new Transform();

    const geometry = new Box(gl);
    const program = new Program(gl, {
      vertex: /* glsl */`
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragment: /* glsl */`
        void main() {
          gl_FragColor = vec4(0.4, 0.8, 1.0, 1.0);
        }`,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    requestAnimationFrame(update);
    function update() {
      requestAnimationFrame(update);
      mesh.rotation.y += 0.02;
      mesh.rotation.x += 0.01;
      renderer.render({ scene, camera });
    }

    return () => {
      // Optional cleanup if needed
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default OGLCanvas;
