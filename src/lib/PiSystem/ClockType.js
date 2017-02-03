"use strict";

//
//  ClockType.js
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

/**
 * The various on-board clock types.
 * @enum {String}
 */
const ClockType = {
  /**
   * The ARM clock.
   * @type {String}
   */
  ARM : "ARM",

  /**
   * The core clock.
   * @type {String}
   */
  Core : "Core",

  /**
   * The H264 clock.
   * @type {String}
   */
  H264 : "H264",

  /**
   * The ISP clock.
   * @type {String}
   */
  ISP : "ISP",

  /**
   * The V3D clock.
   * @type {String}
   */
  V3D : "V3D",

  /**
   * The UART clock.
   * @type {String}
   */
  UART : "UART",

  /**
   * The PWM clock.
   * @type {String}
   */
  PWM : "PWM",

  /**
   * The EMMC clock.
   * @type {String}
   */
  EMMC : "EMMC",

  /**
   * The pixel clock.
   * @type {String}
   */
  Pixel : "Pixel",

  /**
   * The VEC clock.
   * @type {String}
   */
  VEC : "VEC",

  /**
   * The HDMI clock.
   * @type {String}
   */
  HDMI : "HDMI",

  /**
   * The DPI clock.
   * @type {String}
   */
  DPI : "DPI"
};

module.exports = ClockType;
