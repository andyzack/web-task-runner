# CT Web Task Runner
> using grunt...
> * Compiles your SCSS to CSS
> * Builds your widget templates
> * Inlines your CSS
> * Minify your images
> * Creates image spritesheets
> * Sends you a test email to your inbox

## Requirements

* [node.js](http://nodejs.org/)
* [ruby 1.9.3](http://rubyinstaller.org/)
* [sass 3.2.12](http://sass-lang.com/install) `gem install sass --version 3.2.12` 
* [compass 0.12.2](http://compass-style.org/install/) `gem install compass --version 0.12.2`
* [modularscale 1.0.6](http://rubyinstaller.org/) `gem install modular-scale --version 1.0.6`
* [grunt](http://gruntjs.com/getting-started) `npm install grunt-cli -g` - task runner
* [ruby devkit](http://rubyinstaller.org/) download DevKit for ruby 1.93 and install [follow instructions] (https://github.com/oneclick/rubyinstaller/wiki/Development-Kit) - required for premailer
* [premailer](https://github.com/premailer/premailer) `gem install premailer hpricot nokogiri` - inlines css
* [mailgun](http://www.mailgun.com) (optional) - sends email


## Getting started

1. Go to directory `microsites-web/ctwtr` 
2. `ctwtr` is already available as submodule, just update to get the latest version (`git submodule update`) 
3. run `npm install` from ctwtr folder, this will install the necessary packages automatically.


```
cd C:\git\microsites-web
git submodule update
npm install
grunt watch --project=[PROJECTNAME]
```

## Compiling sass and widget template files

### Sass files

Keep all source css files including partial files in `sass` directory. The source files will be compiled automatically and output generated in the `css` directory. 

### Widget template files

Keep all template files using the format `widget_[clientId]_html.hbs` along with other html file in `microsites/[PROJECTNAME]` directory. The source files will be processed and output generated in the `widgets/[PROJECTNAME]` directory.

#### template file
```
microsites-web/app/views/microsites/[PROJECTNAME]/widget_[clientId]_html.hbs
```
#### Output file
```
microsites-web/app/views/widgets/[PROJECTNAME]/widget_[clientId]_html.html
microsites-web/app/views/widgets/[PROJECTNAME]/widget_[clientId]_js.html
```

Note: For changes to CSS, modify .scss files in the working directory. Media queries and responsive styles are in a separate style sheet so that they don't get inlined. Note that only a few clients support media queries.


## File structure 

	microsites-web
		|___ app
			|___ views
				|___ microsites ***
					|___ [PROJECTNAME]
						|___ common
						|___ conf
						|___ assets                        
							|___ css                    ->(compiled css or the dest for css)
							|___ img                    ->(dest for images)
							|___ sass                   ->(Source css)
								ctwdk.scss
								ctwdk-rtl.scss
								_custom.scss
								_settings.scss
								_settings-ms.scss
								_widget-reset.scss
								_widget-custom.scss

						index.html
						book.html
						offers.html
						widget_[clientId]_html.hbs    ->(Widgets html Source file - working file)
						widget_[clientId]_js.hbs      ->(Widgets js Source file - automtically generated)

				|___ widgets
					|___ [PROJECTNAME]
						
						widget_[clientId]_html.html   ->(Output file)
						widget_[clientId]_js.html     ->(Output file)

		|___ assets ***
		|___ lib
		|___ modules
		|___ public
		|___ conf
		|___ ctwdk
		|___ ctwtr
			|___ node_modules

			Gruntfile.js
			package.json
			README.md



## Build Widget

In terminal, run `grunt watch --project=[PROJECTNAME]`. This will check for any changes you make to your .scss or .html templates, then automatically run the tasks. Saves you having to run grunt every time.

```
grunt watch --project=[PROJECTNAME] 
```


## Useful grunt commands

compile generic sites
```
grunt --project=genericsites
```

create new project using boilerplate
```
grunt createsite --project=[PROJECTNAME] --clientId=[1234] --locale=[2LETTERCODE] --currency=[3LETTERCODE] --campaignId=[5678] --campaignName=[CAMPAIGNCODE]
```

create new project by copying existing project
```
grunt createsite --project=[PROJECTNAME] --copysite=[PROJECTCOPY]
```

copy sass folder
```
grunt copysass --project=[PROJECTNAME]
```

copy sass folder to every project, ensure folderlist** is updated
```
grunt copysassall
```

recompile toolkit ctwdk in every project, ensure folderlist** is updated
```
grunt compilesassall --force
```

**generates folderlist
```
grunt folderlist
```


## Preview Widget
```
http://localhost:9000/[PROJECTNAME]/widget?type=html&clientId=XXXX&num=3&locCode=DUB&lang=EN&currency=EUR&residencyId=IE&pkDateTime=201410221000&rtDateTime=201410231000&testToken=&passengers=1
```


#### Widget Viewer
```
http://www.cartrawler.com/microsites/dev/widget.html
```

#### Send the email to yourself

```
grunt send --project=[PROJECTNAME] --template=widget.html
```

In `Gruntfile.js` change sender and recipient to your own email address (or whoever you want to send it to) and run command, this will email out the template you specify.

Change 'widget.html' to the name of the template you want to send.



## Tools for image optimization

### Initial setup

Install spritesmith
```
npm install grunt-spritesmith 
```

Download phantomjs and extract (unzip) the content, setup your PATH environment variable
```
http://phantomjs.org/download.html
npm install phantomjssmith
```

Install GraphicsMagick
```
ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/GraphicsMagick-1.3.21-Q16-win64-dll.exe
npm install gmsmith
```

Install free Visual Studio edition, binaries are built using Microsoft compilers, Visual C++
```
https://www.visualstudio.com/products/visual-studio-community-vs
```

## Grunt commands for image optimisation

#### Spriting to reduce HTTP requests:
Save individual images in a separate folder and run following grunt task
```
grunt sprite --project=[PROJECTNAME] --foldername=[FOLDERNAME]
```

#### Minifying images(jpg/gif/png/svg) to save on bytes:

Minify images in a particular project
```
grunt imagemin --project=[PROJECTNAME]
```

Minify images in all projects, ensure folderlist** is updated
```
grunt folderlist

grunt imageminall
```

Minify images in common assets
```
grunt imagemincommon
```

Minify images in generic sites
```
grunt imagemingenericsites
```


## References

If you haven't used [Grunt](http://gruntjs.com/) before check out Chris Coyier's post on [getting started with Grunt](http://24ways.org/2013/grunt-is-not-weird-and-hard/).

https://github.com/twolfson/phantomjssmith

https://github.com/twolfson/gmsmith


