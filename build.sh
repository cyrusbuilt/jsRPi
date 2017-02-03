#!/bin/sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
MODULES=$SCRIPT_DIR/node_modules
if [ -d "$MODULES" ]  && [ -x "$MODULES" ]; then
	cd "${SCRIPT_DIR}"
	npm run build
	exit
fi

echo "Required dependencies not installed."
echo "Please run ./install_deps.sh first and the try ./build.sh again."
exit