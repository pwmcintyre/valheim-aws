build:
	npm install
	npm run build

test:
	npm run test

deploy:
	sam deploy --guided

redeploy:
	sam deploy
