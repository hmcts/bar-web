# Get the root directory of this Makefile
ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

dev-angular:
	yarn start:angular-dev
dev-express:
	yarn start:express-dev
