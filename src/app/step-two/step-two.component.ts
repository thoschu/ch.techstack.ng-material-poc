import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements AfterViewInit {
  @ViewChild('canvas') protected canvas!: ElementRef<HTMLCanvasElement>

  ngAfterViewInit(): void {
    /* Step1: Prepare the canvas and get WebGL context */
    const gl = this.canvas.nativeElement.getContext('experimental-webgl');

    /* Step2: Define the geometry and store it in buffer objects */
    const vertices: number[] = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];

    let vertex_buffer: WebGLBuffer | null = null;
    // Create a new buffer object
    if ("createBuffer" in gl!) {
      vertex_buffer = gl.createBuffer();
    }

    // Bind an empty array buffer to it
    if ("ARRAY_BUFFER" in gl!) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    }

    // Pass the vertices data to the buffer
    if ("bufferData" in gl!) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    // Unbind the buffer
    if ("ARRAY_BUFFER" in gl!) {
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    /* Step3: Create and compile Shader programs */

    // Vertex shader source code
    const vertCode: string = 'attribute vec2 coordinates;' + 'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';

    //Create a vertex shader object
    let vertShader: WebGLShader | null;
    if ("createShader" in gl!) {
      vertShader = gl.createShader(gl.VERTEX_SHADER);
    }

    //Attach vertex shader source code
    if ("shaderSource" in gl!) {
      gl.shaderSource(vertShader!, vertCode);
    }

    //Compile the vertex shader
    if ("compileShader" in gl!) {
      gl.compileShader(vertShader!);
    }

    //Fragment shader source code
    const fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';

    // Create fragment shader object
    let fragShader = null;1
    if ("createShader" in gl!) {
      fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    }

    // Attach fragment shader source code
    // @ts-ignore
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    // @ts-ignore
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    // @ts-ignore
    const shaderProgram = gl.createProgram();

    // Attach a vertex shader
    // @ts-ignore
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    // @ts-ignore
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    // @ts-ignore
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    // @ts-ignore
    gl.useProgram(shaderProgram);

    /* Step 4: Associate the shader programs to buffer objects */

    //Bind vertex buffer object
    // @ts-ignore
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    //Get the attribute location
    // @ts-ignore
    const coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    // @ts-ignore
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    // @ts-ignore
    gl.enableVertexAttribArray(coord);

    /* Step5: Drawing the required object (triangle) */

    // Clear the canvas
    // @ts-ignore
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    // @ts-ignore
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    // @ts-ignore
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    // @ts-ignore
    gl.viewport(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw the triangle
    // @ts-ignore
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
