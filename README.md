## UIConsult

GL02 project starter


### IDE

- `vscode`
- `webstorm`


### Development

- `install npm or yarn (yarn is better), nvm`
- `nvm use`
- `fork this project`
- `git clone https://github.com/youraccount/UIConsult && cd UIConsult`
- `yarn OR npm install`
- `develop and commit`
- `push to your own repo`
- `send PR to this repo


### Dependencies

Learn these cool packages so that you can use it in this project

- `commander`
- `table`
- `vega, vega-lite, vega-embeded`
- `walkdir`

And you need also to learn `mocha` and `chai` so that you can write unit test


### Caveats

1. Don't develop on windows, if you must, please download `dos2unix` on sf and execute on every file

2. You need to write unit test for most functions you've added

3. By default we will use ES6 and babel, so you need to use `import` and `export` to replace `require`

4. Install `editorconfig` plugin for your IDE to make sure that we have a common basic code format

5. `vega` requires `libcairo2-dev` `libjpeg-dev` `libgif-dev` installed, you need to install them by yourself. On ubuntu, you can install them bu running:

    ```bash
    sudo apt install libcairo2-dev libjpeg-dev libgif-dev
    ```


### API design[exprimental]

The executable will be named as `uic`.

1. `uic --help, -h`                               :           display help information
2. `uic --version, -v`                            :           display version
3. `uic --date-from, --date-to, -df, -dt`         :           specify period of time, e.g.`2018-10-05 11:40:20`, by default it's included
4. `uic --employee, -e`                           :           specify empolyee name
5. `uic --out-dir`                                :           specify where the svg/png file should be put in
6. `uic --output-format`                          :           specify which format should be used (svg/png)    
....



### Build && Compile && Test

`bundle this project`

```bash
npm run build
```

`compile to generate an executable`

```bash
npm run compile
# it will generate executables for linux, win and  macos. See the executable in bin
```

`unit test`

```bash
npm run test
# now there is no test

```



