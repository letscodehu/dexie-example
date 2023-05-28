build:
	cd shared && npm install && npm run build
	cd web && npm install && npm run build
	cd server && npm install 
test:
	cd shared && npm test
clean:
	cd shared && npm run clean 
	cd web && npm run clean 
	cd server && npm run clean 
