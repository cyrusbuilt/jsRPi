"use strict";

//
//  Pin.js
//
//  Author:
//       Chris Brunner <cyrusbuilt at gmail dot com>
//
//  Copyright (c) 2015 CyrusBuilt
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
//

const Disposable = require('../Disposable.js');
const PinMode = require('./PinMode.js');
const PinState = require('./PinState.js');

/**
 * A physical pin interface.
 * @interface
 * @extends {Disposable}
 */
class Pin extends Disposable {
  /**
   * Initializes a new instance of the jsrpi.IO.Pin interface.
   * @constructor
   */
  constructor() {
    super();

    this._pinName = "";
    this._tag = null;
  }

  /**
   * Gets or sets the pin name.
   * @property {String} pinName - The pin name.
   */
  get pinName() {
    return this._pinName;
  }

  set pinName(name) {
    this._pinName = name;
  }

  /**
   * Gets or sets the tag.
   * @property {Object} tag - The tag.
   */
  get tag() {
    return this._tag;
  }

  set tag(t) {
    this._tag = t;
  }

  /**
   * Gets the state of the pin.
   * @property {PinState} state - The pin state.
   * @readonly
   */
  get state() { return PinState.Low; }

  /**
   * Gets the pin mode.
   * @property {PinMode} mode - The pin mode.
   * @readonly
   */
  get mode() { return PinMode.TRI; }

  /**
   * Gets the pin address.
   * @property {Number} address - The pin address.
   * @readonly
   */
  get address() { return 0; }
}

module.exports = Pin;
