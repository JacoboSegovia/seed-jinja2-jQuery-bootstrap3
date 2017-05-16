# Seed - jina2 , jQuery , bootstrap3 -

## Previous

1. Install python3
  Download from https://www.python.org/
2. Install pip3
 `sudo apt-get install python3-pip`
3. Install staticjinja
 `pip3 install staticjinja`
4. Install jinja2
 `pip3 install jinja2`

## Installation

1. To install dependencies, assuming that you already have installed node, npm and ruby at least.

   Check what gems are installed with `gem list` should be, at least,

      ```
      sass (3.4.13)
      scss-lint (0.37.0)
      ```

   if not, install or update sass and scss-lint

   Check if bower is available with `bower -v` if it is missing, install it

   globally with `npm install -g bower`

   Check if gulp is available with `gulp -v` if it is missing, install it

   globally with `npm install -g gulp`


2. To install project

   You need to run: `npm install`

   ¡¡¡ IMPORTANT   !!!

   If u are getting this error:

   ```
   Error: EACCES: permission denied, open '/Users/USERNAME/.config/configstore/bower-github.json'
   You don't have access to this file.
   ```
   Just type in terminal:

   ```
   sudo chown -R $USER:$GROUP ~/.npm
   sudo chown -R $USER:$GROUP ~/.config
   ```

   and try it again.

3. Gulp: `gulp [task] [option]`
    * The default `[task]`, build the project on dist folder in app directory of the project and run the APP on localhost.

        > You can add a `[option]` `--uglify` to minimize css and uglify js code.

    * The build `[task]`, build the project on dist folder in app directory of the project.

        > You can add a `[option]` `--uglify` to minimize css and uglify js code.

        > You can add a `[option]` `--release` to build in a release folder and upload on a repository a release with the settings inserted on terminal.

4. Notes:
  * To use gulp --release is necessary change the info of package.json

## Useful links

1. Resources

  * [HTML5 W3C Reference](http://dev.w3.org/html5/html-author)
  * [HTML5 MDN guide](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) and [tags reference](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/HTML5_element_list)
  * [SASS](http://sass-lang.com/guide) language reference.
  * [CSS Guide Lines](http://cssguidelin.es) is **the main guidelines to follow in the project to successfully complete it in a sane, manageable and scalable way**.
  * [BEM notation](https://bem.info/method/definitions) applyed to css naming, but it must be used [carefully](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax)
  * [OOCSS](http://appendto.com/2014/04/oocss) introduction
  * [Javascript patterns](http://shichuan.github.io/javascript-patterns)

2. Gulp plugins

  * [child_process](https://nodejs.org/api/child_process.html)
  * [autoprefixer](https://www.npmjs.org/package/gulp-autoprefixer/)
  * [concat](https://www.npmjs.org/package/gulp-concat/)
  * [connect](https://www.npmjs.com/package/gulp-connect/)
  * [github-release](https://www.npmjs.com/package/gulp-github-release/)
  * [gulp-htmlhint](https://www.npmjs.com/package/gulp-htmlhint/)
  * [del](https://www.npmjs.org/package/del/)
  * [if](https://github.com/robrich/gulp-if/)
  * [jshint](https://www.npmjs.org/package/gulp-jshint/)
  * [minifycss](https://www.npmjs.org/package/gulp-minify-css/)
  * [notify](https://www.npmjs.org/package/gulp-notify/)
  * [prompt](https://www.npmjs.com/package/gulp-prompt)
  * [htmlhint-stylish](https://www.npmjs.com/package/htmlhint-stylish/)
  * [jshint-stylish](https://www.npmjs.com/package/jshint-stylish/)
  * [runSequence](https://www.npmjs.org/package/run-sequence/)
  * [sass](https://www.npmjs.org/package/gulp-sass/)
  * [uglify](https://www.npmjs.org/package/gulp-uglify/)
  * [zip](https://www.npmjs.com/package/gulp-zip/)

3. Font Icons

  * [icomoon](https://icomoon.io/app/#/select)

    ```
    Font Name: 
    Class Prefix: icon-
    Support IE 8 checked
    CSS Selector: Use Attribute Selectors
    Font Metrics 1024; 6.25; 50;
    Version 1.0
    ```


## Repo releases

* Merge `dev` in `master` :

```
git checkout dev
git pull origin dev
git checkout master
git pull origin master
git merge dev
git push origin master
```


* Execute release command **in the releases repo**

```
gulp build --release
```

* Set tag number

* Set your github token
