# Mandelbrot Set Visualization

https://mandelbrot-set-alpha.vercel.app/

## Requirements

1. Rust
2. wasm-pack
3. Node 18

## Running

1. Step: **Build `wasm` package**

    ```shell
    cd wasm
    wasm-pack build
    ```

2. Step: **Build frontend package**

    ```shell
    cd frontend
    npm run build
    npm run preview
    ```

3. Step: **Visit `http://localhost:4173` in your browser**

## Controls

1. Move: `W`, `A`, `S`, `D`
2. Zoom In/Out: `Q`, `E`