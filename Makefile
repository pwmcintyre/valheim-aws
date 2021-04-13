build:
	npm install
	npm run build
	cp package.json dist
	( cd dist && npm i --production )

test:
	npm run test

deploy:
	sam deploy --guided

redeploy:
	sam deploy
