echo "Installing rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
echo "Rustup installed."
echo "Installing wasm-pack..."
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
echo "wasm-pack installed."
echo "Building wasm..."
cd wasm
wasm-pack build
cd ..
echo "completed."
echo "Building vite..."
cd frontend
npm run build
cd ..
echo "completed."
