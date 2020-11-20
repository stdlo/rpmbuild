name = hello-typescript
target = artifacts/$(name)
meta_files = package.json package-lock.json $(name)

build:
	npm run build

bundle:
	mkdir -p $(target)
	cp -a dist $(meta_files) $(target)/
	npm --prefix $(target) install --production

zip:
	tar -zcf $(target).tar.gz -C artifacts $(name)
