#!/bin/sh

git pull

runuser -l nodeuser -c "forever restart sale"
