jsRPi
======

Raspberry Pi library framework for NodeJS
======
jsRPi v0.1.0 ALPHA
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
This framework has several dependencies (such as extend, underscore, timespan,
pi-spi, etc) and several developer dependencies if you intend to build jsRPi
yourself. You can install all of these dependencies using the install-deps.cmd
script (Windows only). I will be adding Unix/Linux shell scripts for building
on MacOS, Linux (ie. Raspbian), BSD, etc. However, much of the framework testing
and execution will need to occur on the Raspberry Pi.

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
