#!/bin/bash

# The '| cat' is to trick Node that this is an non-TTY terminal
# then react-scripts won't clear the console.
yarn start | cat
