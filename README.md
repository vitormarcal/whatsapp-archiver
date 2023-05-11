# whatsapp-archiver

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).


Create archive midia dir:
```shell
curl --location 'localhost:3000/api/parameters' \
--header 'Content-Type: application/json' \
--data '{
"name": "ARCHIVE_DIR",
"value": "/path/to/archive/media"
}'
```



Create archive midia dir:

```shell
curl --location 'localhost:3000/api/parameters' \
--header 'Content-Type: application/json' \
--data '{
"name": "SRC_DIR",
"value": "path/to/source/media"
}'
```

