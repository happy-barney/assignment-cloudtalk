#!/bin/bash

rm -rf build;
tsc
node build/lib/app-assignment.js
