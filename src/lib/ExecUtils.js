"use strict";

//
//  ExecUtils.js
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
 * @fileOverview Provides utility methods for executing child processes and
 * retrieving the process output.
 *
 * @module ExecUtils
 * @requires child_process
 * @requires StringUtils
 */
const util = require('util');
const exec = require('child_process');
const str = require('./StringUtils.js');

/**
 * Executes the specified command string.
 * @param  {String} command The command to execute.
 * @return {Array}         A string array containing each line of the output.
 */
const executeCommand = function(command) {
  if ((util.isNullOrUndefined(command)) || (command.length === 0) ||
      (typeof command !== 'string')) {
      return [];
  }

  let args = "";
  let cmdLine = command.split(" ");
  if (cmdLine.length > 1) {
    command = cmdLine[0];
    for (var i = 1; i <= (cmdLine.length - 1); i++) {
      args += cmdLine[i] + " ";
    }

    if (str.endsWith(args, " ")) {
      args = args.substring(0, args.length - 1);
    }
  }

  let result = [];
  let cmdSpawn = exec.spawnSync(command, args.split(" "));
  if (cmdSpawn.status === 0) {
    if (!util.isNullOrUndefined(cmdSpawn.stdout)) {
      if (typeof cmdSpawn.stdout === 'string') {
        result = cmdSpawn.stdout.split("\n");
      }
      else {
        result = cmdSpawn.stdout.toString().split("\n");
      }
    }
  }
  return result;
};

module.exports.executeCommand = executeCommand;
