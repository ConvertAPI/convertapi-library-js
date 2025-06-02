# ConvertAPI JavaScript Client
## Convert your files with our online file conversion API

The ConvertAPI helps converting various file formats.
Creating PDF and Images from various sources like Word, Excel, Powerpoint, images, web pages.
Merge, Encrypt, Split, Repair and Decrypt PDF files.
And many others files manipulations.
In just few minutes you can integrate it into your application and use it easily.

The ConvertAPI-JS library makes it easier to use the Convert API from your web projects without having to build your own API calls.
You can get your token at https://www.convertapi.com/a/authentication

If you are interested in our old version of **non-module** JavaScript library you can [find it here](https://github.com/ConvertAPI/convertapi-js/tree/last_nonmodule).

## Try it online

You can try this library on **[CodeSandbox](https://codesandbox.io/u/convertapi)**

- [Simple Conversion](https://codesandbox.io/s/pzvhkl)
- [Conversion with additional parameters](https://codesandbox.io/s/hlvnul)
- [Conversion Chaining](https://codesandbox.io/s/ju8dg5)
- [Web Page Conversion](https://codesandbox.io/s/ct44tv)
- [Convert HTML string to PDF](https://codesandbox.io/s/g1ciy)
- [Online PDF converter](https://codesandbox.io/s/pdf-converter-elbulk)
- [All examples](https://codesandbox.io/u/convertapi)


## Installation

Run this line from console:

```sh
npm i convertapi-js@~1.1
```

## Usage

### Configuration

You can get your token at https://www.convertapi.com/a/authentication

```js
import ConvertApi from 'convertapi-js'
let convertApi = ConvertApi.auth('api-token')
```

### File conversion

Example to convert DOCX file to PDF. All supported formats and options can be found 
[here](https://www.convertapi.com/conversions).

```js
let params = convertApi.createParams()
params.add('file', elFileInput.files[0])
let result = await convertApi.convert('docx', 'pdf', params)

// Get result file URL
let url = result.files[0].Url
```

#### Convert remote file

```js
let params = convertApi.createParams()
params.add('file', new URL('https://cdn.convertapi.com/test-files/presentation.pptx'))
let result = await convertApi.convert('pptx', 'pdf', params)

// Get result file URL
let url = result.files[0].Url
```

#### Additional conversion parameters

ConvertAPI accepts extra conversion parameters depending on converted formats. All conversion 
parameters and explanations can be found [here](https://www.convertapi.com/conversions).

```js
// Converting PDF to JPG file
let params = convertApi.createParams()
params.add('file', e.currentTarget.files[0])
params.add('ScaleImage', 'true')
params.add('ScaleProportions', 'true')
params.add('ImageHeight', '300')
params.add('ImageWidth', '300')
let result = await convertApi.convert('pdf', 'jpg', params)

// Get result file URL
let url = result.files[0].Url
```

### Alternative domain

Set the last argument for the `ConvertApi.auth` method to use an alternative domain. Dedicated to the region [domain list](https://www.convertapi.com/doc/servers-location).

```js
let convertApi = ConvertApi.auth('api-token', 'https://eu-v2.convertapi.com/')
```


### Issues &amp; Comments
Please leave all comments, bugs, requests, and issues on the Issues page.
We'll respond to your request ASAP!

### License
The ConvertAPI JS Library is licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php "Read more about the MIT license form") license.
Refere to the [LICENSE](https://github.com/ConvertAPI/convertapi-js/blob/master/LICENSE) file for more information.