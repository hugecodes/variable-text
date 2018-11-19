# Variable Text Site

All frontend code for the Variable Text static site will live here.

The site is built using Hexo, a static site generator, with a small express server to run the site on beanstalk.

### Installation

Installing Hexo CLI and Node modules
```shell
npm install hexo-cli -g
npm i
```

### Development

The local dev server can be started with:
```shell
npm run dev
```

Changes to `_config.yml` will require a server restart.

### Compilation

To compile assets in to a static site, run:
```shell
npm run build
```

The site will be built into the `/public` folder.

### Production

To compile all the site's assets and start a production-grade express server, you can run:

```shell
npm start
```
