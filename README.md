jsRPi
======

Raspberry Pi library framework for NodeJS
======
jsRPi v0.1.2 ALPHA
Copyright (c) CyrusBuilt 2015

A Raspberry Pi GPIO and device/component library framework for NodeJS. This is a
port of the the MonoPi Framework (https://github.com/cyrusbuilt/MonoPi), which
is largely based in the pi4j project (https://github.com/Pi4J/pi4j/). The
purpose of this framework is to provide the ability to read/write the GPIO pins
on the Raspberry Pi, as well as interface with various devices, and to provide
APIs for a number of add-on devices and components as well as interfaces and
abstractions for creating your own. This library is under development and not
ready for production use. This library has grown into a bit of a "Swiss Army
Knife" given the breadth of functionality that is still growing as it is
adapted. Most of it is ready, however, I'd love some feed back. This framework
will soon be release as a Node Module and will be installable via NPM.

Note:
======
This framework has several dependencies (such as underscore, timespan, pi-spi, etc)
and several developer dependencies if you intend to build jsRPi yourself. You can
install all of these dependencies using the install-deps.cmd script (Windows only)
or the install_deps.sh (*NIX and Mac OS X). A suite of unit tests are available in
the "tests" directory which do simulated testing of most of the framework's classes
and functions. However, these tests are platform agnostic and make use of simulated
hardware interactions.  To test the framework against actual hardware, you will need
to run these tests on the Raspberry Pi itself and modify the tests to not use the
"fake" hardware (see tests/IO/GpioBase-tests.js for an example), or write your own
tests.

A note about (a)synchronous operations:
======
This framework implements asynchronous operations wherever it can, BUT:
there are many operations that are timing sensitive and must occur in
a specific order, such as reading/writing from the I2C or SPI bus in a
specific order (thus requiring one operation to complete before another)
and therefore, these operations currently happen synchronously, which in
general goes against the non-blocking nature of NodeJS. Unfortunately, this
could not be avoided in many cases but I do have plans try and refactor some of
this code in an attempt to make it more asynchronous wherever possible.

A note about object inheritance:
======
Coming from the world of Java/.NET/C++ and other languages where one class
can extend multpile classes and implement multiple interfaces, I struggled a
great deal to port this framework from the MonoPi project. There are a number
of interfaces and base classes (well... the JS implementation of such constructs)
that many other classes are built off of.  For example, most of the classes in
src/lib/Components all derive from a base class called "ComponentBase", of which
implements the "Component" interface. The problem is, when you want to implement
an interface, and then also extend 2 base classes (such as ComponentBase and
EventEmitter) it all falls apart. I've done a ton of research into this and the
only effective solution I've come up with is to inherit from the "primary"
interface using util.inherits so that the instanceof keyword will work, but then
instanceof will be false for ComponentBase and EventEmitter. Then internally, I
create instances of both ComponentBase and EventEmitter and wrap the necessary
methods the "derived" class like so:

```JavaScript
var inherits = require('util').inherits;
var Switch = require('./Switch.js');
var ComponentBase = require('../ComponentBase.js');
var EventEmitter = require('events').EventEmitter;

function SwitchBase() {
	Switch.call(this);
	
	// NOTE this class' content is drastically reduced for brevity
	
	var self = this;
	var _base = new ComponentBase();
	var _emitter = new EventEmitter();
	
	this.isDisposed = function() {
		return _base.isDisposed();
	};
	
	this.dispose = function() {
		if (_base.isDisposed()) {
			return;
		}
		
		// ...
		// Dispose stuff
		
		_base.dispose();
	};
	
	this.removeAllListensers = function() {
		_emitter.removeAllListeners();
	};
	
	this.on = function(event, callback) {
		_emitter.on(event, callback);
	};
	
	this.emit = function(event, args) {
		_emitter.emit(event, args);
	};
}

SwitchBase.prototype.constructor = SwitchBase;
inherits(SwitchBase, Switch);

module.exports = SwitchBase;
```

I hope to find a more elegant solution moving forward because I feel
like this method uses more memory that it really should and also
because I can hear the seasoned JS developers out there screaming in
agony just looking at this code.

ES6 Comliance:
======
This framework was written to be ES5 compliant, but there are plans
to refactor this framework to ES6 in the future. This (I'm hoping)
will not only bring it closer in resemblance to the original MonoPi
code, but also address at least *some* of the inheritance issues I've
encountered.

Building jsRPi:
======
Some scripts have been included to setup and build jsRPi.
* install_deps.cmd (Windows only)
* install_deps.sh (*NIX and Mac OS X)
* make.cmd (Windows only)
* build.sh (*NIX and Mac OS X)

To setup the evironment, you will need to do the following:
* Install NodeJS if you haven't already (https://nodejs.org)
* Make sure you have the Node Package Manager (npm) installed. This is included in any modern distribution of NodeJS.
* If on *NIX/OSX you will likely need to make the install_deps script executable by doing the following:
```
chmod +rx install_deps.sh
```

You can then just call the script like so:
```
./install_deps.sh
```

On Windows, just right-click on the install_deps.cmd file and click "Run as Administrator".
* Once all the dependencies are successfully installed, run the appropriate build script.
On *NIX/OSX, you will likely need to make build.sh executable, just like install_deps.sh
as shown above and then call it like so:
```
./buid.sh
```
On Windows, you can just double-click the make.cmd script, or call it from the command line. The build script
will use JSHint to check the code, generate API documentation in the docs/ folder using JSDoc, and then build
a single condensed file in the build/ folder using WebPack. You don't have to use the single file. It is only
provided for convenience for those who would rather deal with a single file instead of a huge source tree.

Also, if you just want to run unit tests, just navigate to the jsRPi directory from a command line and type:
```
grunt nodeunit
```

LICENSE:
======
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
