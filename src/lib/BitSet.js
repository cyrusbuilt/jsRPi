"use strict";
//
//  BitSet.js
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
 * Module dependencies.
 */
const util = require('util');
const IllegalArgumentException = require("./IllegalArgumentException.js");
const ArgumentNullException = require("./ArgumentNullException.js");
const StringBuilder = require("string-builder");
const Assert = require('assert');

/**
 * The number of address bits per word.
 * @const {Number}
 * @package
 */
const ADDRESS_BITS_PER_WORD = 6;

/**
 * The number of bits per word.
 * @const {Number}
 * @package
 */
const BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD;

/**
 * Given the specified bit index, returns the word index containing it.
 * @param  {Number} bitIndex The bit index.
 * @return {Number}          The word index containing the specified bit index.
 */
const wordIndex = function(bitIndex) {
  return (bitIndex >> ADDRESS_BITS_PER_WORD);
};

/**
 * Checks to see if the specified "from" index and "to" index are a valid range
 * of bit indices and throws an exception if not.
 * @param  {Number} fromIndex The starting index.
 * @param  {Number} toIndex   The ending index.
 * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
 * @throws {IllegalArgumentException} if either parameter is not a number.
 * @throws {RangeError} if either parameter is less than zero.
 */
const checkRange = function(fromIndex, toIndex) {
  if (util.isNullOrUndefined(fromIndex)) {
    throw new ArgumentNullException("fromIndex cannot be null.");
  }

  if (util.isNullOrUndefined(toIndex)) {
    throw new ArgumentNullException("toIndex cannot be null.");
  }

  if (typeof fromIndex !== 'number') {
    throw new IllegalArgumentException("fromIndex MUST be a number.");
  }

  if (typeof toIndex !== 'number') {
    throw new IllegalArgumentException("toIndex MUST be a number.");
  }

  if (fromIndex < 0) {
    throw new RangeError("fromIndex cannot be less than zero.");
  }

  if (toIndex < 0) {
    throw new RangeError("toIndex cannot be less than zero.");
  }

  if (fromIndex > toIndex) {
    throw new RangeError("fromIndex cannot be greater than toIndex.");
  }
};

/**
 * Gets the number of trailing zeros in the specified number.
 * @param  {Number} n The number value to inspect.
 * @return {Number}   The number of trailing zeros.
 * @throws {IllegalArgumentException} if 'n' parameter is not a number.
 */
const numberOfTrailingZeros = function(n) {
  if (util.isNullOrUndefined(n)) {
    return 0;
  }

  if (typeof n !== 'number') {
    throw new IllegalArgumentException("param 'n' must be a number.");
  }

  let mask = 1;
  let result = 64;
  for (let i = 0; i < 64; i++, mask <<= 1) {
    if ((n & mask) !== 0) {
      result = i;
      break;
    }
  }
  return result;
};

/* jshint latedef: false */
/**
 * Gets a new BitSet from the specified word array.
 * @param  {Array} words An array of bits to convert into a BitSet.
 * @return {BitSet}      A new BitSet containing the specified bits.
 */
const fromWordArray = function(words) {
  if (!util.isArray(words)) {
    return null;
  }
  return new BitSet(words);
};

/**
 * @classdesc
 * An implementation of a vector of bits that grows as needed. Each component of
 * the bit set has a Boolean value. The bits of a BitSet are indexed by
 * non-negative integers. Individual indexed bits can be examined, set, or
 * cleared. One BitSet may be used to modify the contents of another through
 * logical AND, logical inclusive OR, and logical exclusive OR operations. By
 * default, all bits in the set initially have the value of false. Every BitSet
 * has a current size, which is the number of bits of space currently in use by
 * the BitSet. Note that the size is related to the implementation of a BitSet,
 * so it may change with implementation. The length of a BitSet relates to the
 * logical length of a BitSet and is defined independently of implementation.
 * Unless otherwise noted, passing a null parameter to any of the methods in a
 * BitSet will result in a ArgumentNullException.
 */
class BitSet {
  /**
   * Initializes a new instance of the jsrpi.BitSet class with an optional size
   * or the internal array or an array of words to compose this BitSet from.
   * @param {Number|Array} bits The initial size of the BitSet - or - an array
   * (words) to compose this instance from.
   * @throws {IllegalArgumentException} if 'bits' param is not a valid type (must
   * be a number or array of bits).
   * @throws {RangeError} if 'bits' is a number but is less than zero.
   * @constructor
   */
  constructor(bits) {
    this._bits = [];
    this._wordsInUse = 0;
    this._sizeIsSticky = false;
    this.name = "BitSet";
    this.BIT_INDEX_MASK = BITS_PER_WORD - 1;
    this.LONG_MASK = 0x3f;

    // Main constructor logic.
    if (util.isNullOrUndefined(bits)) {
      this._bits = new Array(BITS_PER_WORD);
    }
    else {
      if (typeof bits === 'number') {
        if (bits < 0) {
          throw new RangeError("'bits' param must not be negative.");
        }

        this._bits = new Array(wordIndex(bits - 1) + 1);
        this._sizeIsSticky = true;
      }
      else if (util.isArray(bits)) {
        this._bits = bits;
        this._wordsInUse = this._bits.length;
        this._checkInvariants();
      }
      else {
        throw new IllegalArgumentException("param 'bits' must be a number or an array of bits.");
      }
    }
  }

  /**
   * Every public method must preserve invariants. This method checks to see if
   * this is true using assertions. Assertion errors are thrown if any of the
   * assertions fail.
   * @private
   */
  _checkInvariants() {
    Assert.ok((this._wordsInUse === 0) || (this._bits[this._wordsInUse - 1] !== 0));
    Assert.ok((this._wordsInUse >= 0) && (this._wordsInUse <= this._bits.length));
    Assert.ok((this._wordsInUse === this._bits.length) || (this._bits[this._wordsInUse] === 0));
  }

  /**
   * Gets a value indicating whether is BitSet is empty.
   * @property {Boolean} isEmpty - true if empty; Otherwise, false.
   * @readonly
   */
  get isEmpty() {
    return (this._wordsInUse === 0);
  }

  /**
   * Gets the "logical size" of this bit set: the index of the highest set bit
   * in the BitSet plus one.
   * @property {Number} length - Returns the logical size of this BitSet or zero
   * if this instance contains no bits.
   * @readonly
   */
  get length() {
    if (this._wordsInUse === 0) {
      return 0;
    }

    if ((this._bits === null) || (this._bits.length === 0)) {
      this._wordsInUse = 0;
      return this._wordsInUse;
    }

    let positions = numberOfTrailingZeros(this._bits[this._wordsInUse - 1]);
    return (this.BITS_PER_WORD * (this._wordsInUse - 1) + (this.BITS_PER_WORD - positions));
  }

  /**
   * Gets the number of bits of space actually in use by this BitSet to
   * represent bit values.
   * @property {Number} size - Returns The maximum element in the set is the
   * size minus the first element.
   * @readonly
   */
  get size() {
    return (this._bits.length * this.BITS_PER_WORD);
  }

  /**
   * Sets the internal word count field to the logical size in words of the
   * BitSet. WARNING: This method assumes that the number of words actually in
   * use is less than or equal to the current value of the words in use field!!!
   * @private
   */
  _recalcualteWordsInUse() {
    let i = 0;
    for (i = this._wordsInUse - 1; i >= 0; i--) {
      if (this._bits[i] !== 0) {
        break;
      }
    }

    this._wordsInUse = i + 1;
  }

  /**
   * Ensures that this BitSet can hold enough words.
   * @param  {Number} lastElt The minimum acceptable number of words.
   * @private
   */
  _ensureCapacity(lastElt) {
    let nd = [];
    if (lastElt >= this._bits.length) {
      nd = new Array(lastElt + 1);
      nd = (this._bits || []).concat();
      this._bits = nd;
      this._sizeIsSticky = false;
    }
  }

  /**
   * Ensures that the BitSet can accomodate a given word index, temporarily
   * violating the invariants. The caller must restore the invariants before
   * returning to the user, possibly using recalcualteWordsInUse().
   * @param  {Number} wordIndex The index to be accomodated.
   * @private
   */
  _expandTo(wordIndex) {
    let required = (wordIndex + 1);
    if (this._wordsInUse < required) {
      this._ensureCapacity(required);
      this._wordsInUse = required;
    }
  }

  /**
   * Attempts to reduce internal storage used for the bits in this BitSet.
   * Calling this method may, but is not required to, affect the value returned
   * by a subsequent call to the size() property.
   * @private
   */
  _trimToSize() {
    if (this._wordsInUse !== this._bits.length) {
      let copy = (this._bits || []).concat().slice(0, this._wordsInUse);
      this._bits = copy;
      this._checkInvariants();
    }
  }

  /**
   * Gets the number of words in use.
   * @return {Number} The number of words in use.
   */
  getWordsInUse() {
    return this._wordsInUse;
  }

  /**
   * Gets the internal bit array.
   * @return {Array} The internal bit array.
   */
  getBits() {
    return this._bits;
  }

  /**
   * Returns the number of bits set to true in this BitSet.
   * @property {Number} cardinality - The number of bits set true.
   * @readonly
   */
  get cardinality() {
    let card = 0;
    let a = 0;
    let b = 0;
    for (let i = this._bits.length - 1; i >= 0; i--) {
      a = this._bits[i];
      // Take care of common cases.
      if (a === 0) {
        continue;
      }

      if (a === -1) {
        card += 64;
        continue;
      }

      // Successively collapse alternating bit groups into a sum.
      a = ((a >> 1) & 0x5555555555555555) + (a & 0x5555555555555555);
      a = ((a >> 2) & 0x3333333333333333) + (a & 0x3333333333333333);
      b = ((a >> 32) + a);
      b = ((b >> 4) & 0x0f0f0f0f) + (b & 0x0f0f0f0f);
      b = ((b >> 8) & 0x00ff00ff) + (b & 0x00ff00ff);
      card += ((b >> 16) & 0x0000ffff) + (b & 0x0000ffff);
    }
    return card;
  }

  /**
   * Performs a logical AND of this target BitSet with the argument BitSet. This
   * BitSet is modified so that each bit in it has the value ture if (and only
   * if) it both initially had the value true and the corresponding bit in the
   * specified BitSet also had the value true.
   * @param  {BitSet} bs A BitSet. Throws ArgumentNullException if null.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  and(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (this === bs) {
      return;
    }

    if (!(bs instanceof BitSet)) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    while (this._wordsInUse > bs.getWordsInUse()) {
      this._bits[--this._wordsInUse] = 0;
    }

    for (let i = 0; i < this._wordsInUse; i++) {
      this._bits[i] &= bs.getBits()[i];
    }

    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Clears all of the bits in this BitSet whose corresponding bit is set in the
   * specified BitSet.
   * @param  {BitSet} bs The BitSet with which to mask this instance.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  andNot(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (!(bs instanceof BitSet)) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    let i = Math.min(this._bits.length, bs.getBits().length);
    while (--i >= 0) {
      this._bits[i] &= ~bs.getBits()[i];
    }

    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Performs a logical OR of this BitSet with the specified BitSet. This BitSet
   * is modified so that a bit in it has the value true if (and only if) it
   * either already had the value ture or the corresponding bit in the specified
   * BitSet has the value true.
   * @param  {BitSet} bs A BitSet.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  or(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (this === bs) {
      return;
    }

    if (!(bs instanceof BitSet)) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    let wordsInCommon = Math.min(this._wordsInUse, bs.getWordsInUse());
    if (this._wordsInUse < bs.getWordsInUse()) {
      this._ensureCapacity(bs.getWordsInUse());
      this._wordsInUse = bs.getWordsInUse();
    }

    for (let i = 0; i < wordsInCommon; i++) {
      this._bits[i] |= bs.getBits()[i];
    }

    if (wordsInCommon < bs.getWordsInUse()) {
      this._bits = (this._bits || []).concat().slice(0, this._wordsInUse - wordsInCommon);
    }

    this._checkInvariants();
  }

  /**
   * Performs a logical XOR of this BitSet with the specified BitSet. This
   * BitSet is modified so that bit in it has the value true if (and only if)
   * one of the following statements holds true:
   * - The bit initially has the value true, and the corresponding bit in the
   * specified BitSet has the value false.
   * - The bit initially has the value false, and the corresponding bit in the
   * specified BitSet has the value true.
   * @param  {BitSet} bs A BitSet.
   * @throws {ArgumentNullException} if bs is null.
   * @throws {IllegalArgumentException} if bs is not a BitSet.
   */
  xOr(bs) {
    if (util.isNullOrUndefined(bs)) {
      throw new ArgumentNullException("param 'bs' cannot be null");
    }

    if (!(bs instanceof BitSet)) {
      throw new IllegalArgumentException("param 'bs' must be a BitSet.");
    }

    // Calculate how many words which have in common with the other bit set.
    let wordsInCommon = Math.min(this._wordsInUse, bs.getWordsInUse());
    if (this._wordsInUse < bs.getWordsInUse()) {
      this._ensureCapacity(bs.getWordsInUse());
      this._wordsInUse = bs.getWordsInUse();
    }

    // Perform logical XOR on words in common.
    for (let i = 0; i < wordsInCommon; i++) {
      this._bits[i] ^= bs.getBits()[i];
    }

    // Copy any remaining words.
    if (wordsInCommon < bs.getWordsInUse()) {
      this._bits = (this._bits || []).concat().slice(0, bs.getWordsInUse() - wordsInCommon);
    }

    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Sets the bit at the specified position (index) to false, or clears the
   * entire BitSet if no value given.
   * @param  {Number} pos The index of the bit to be cleared. If null or less
   * than one, clears the entire BitSet.
   * @throws {RangeError} if pos is greater than the last index.
   */
  clear(pos) {
    if ((util.isNullOrUndefined(pos)) || (pos < 1)) {
      for (var i = 0; i < this._bits.length; i++) {
        this._bits[i] = 0;
      }
      this._wordsInUse = 0;
    }
    else {
      if (pos > this._bits.length - 1) {
        throw new RangeError("param 'pos' cannot be greater than the last index.");
      }

      let offset = wordIndex(pos);
      if (offset >= this._wordsInUse) {
        return;
      }

      this._bits[offset] &= ~(1 << pos);
      this._recalcualteWordsInUse();
      this._checkInvariants();
    }
  }

  /**
   * Sets the bits from the specified 'from' index (inclusive) to the specified
   * 'to' index (exclusive) to false.
   * @param  {Number} fromIndex The starting index. Throws ArgumentNullException
   * if null. Throws IllegalArgumentException if not a number. Throws RangeError
   * if less than zero or greater than toIndex.
   * @param  {Number} toIndex   The ending index. Throws ArgumentNullException if
   * null. Throws IllegalArgumentException if not a number. Throws RangeError if
   * less than zero.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  clearFromTo(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    let startWordIndex = wordIndex(fromIndex);
    if (startWordIndex >= this._wordsInUse) {
      return;
    }

    let endWordIndex = wordIndex(toIndex - 1);
    if (endWordIndex >= this._wordsInUse) {
      toIndex = this.length;
      endWordIndex = this._wordsInUse - 1;
    }

    let firstWordMask = this.LONG_MASK << fromIndex;
    let lastWordMask = this.LONG_MASK >> -toIndex;
    if (startWordIndex === endWordIndex) {
      // Case 1: Single word.
      this._bits[startWordIndex] &= ~(firstWordMask & lastWordMask);
    }
    else {
      // Case 2: Multiple words.
      // Handle first word.
      this._bits[startWordIndex] &= ~firstWordMask;

      // Handle intermediate words, if any.
      for (let i = startWordIndex + 1; i < endWordIndex; i++) {
        this._bits[i] = 0;
      }

      // Handle last word.
      this._bits[endWordIndex] &= ~lastWordMask;
    }

    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Public method for performing invariant checks. Every public method must
   * preserve the invariants. This method checks to see if this is true using
   * assertions. Assertion errors are thrown if any of the assertions fail.
   */
  doCheckInvariants() {
    this._checkInvariants();
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @return {BitSet} A new BitSet that is a copy of this instance.
   */
  clone() {
    if (this._sizeIsSticky) {
      this._trimToSize();
    }

    try {
      return fromWordArray(this._bits);
    }
    catch(e) {
      return null;
    }
  }

  /**
   * Determines whether the specified object is equal to the current BitSet.
   * @param  {Object} obj The object to compare with the current BitSet.
   * Generally, this method should be used to check against other BitSet
   * instances.
   * @return {Boolean}     true if equal; Otherwise, false.
   */
  equals(obj) {
    if (util.isNullOrUndefined(obj)) {
      return false;
    }

    if (!(obj instanceof BitSet)) {
      return false;
    }

    this._checkInvariants();
    obj.doCheckInvariants();

    if (this._wordsInUse !== obj.getWordsInUse()) {
      return false;
    }

    let result = true;
    for (let i = 0; i < this._wordsInUse; i++) {
      if (this._bits[i] !== obj.getBits()[i]) {
        result = false;
        break;
      }
    }

    return result;
  }

  /**
   * Sets the bit at the specified index to the compliment of its current value.
   * @param  {Number} index The index of the bit to flip.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  flip(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    let offset = wordIndex(index);
    this._expandTo(offset);
    this._bits[offset] ^= 1 << index;
    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Sets each bit from the specified "from" (inclusive) index to the specified
   * "to" (exclusive) index to the compliment of its current value.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * flip.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to flip.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  flipFromTo(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    let startWordIndex = wordIndex(fromIndex);
    let lastWordIndex = wordIndex(toIndex - 1);
    this._expandTo(lastWordIndex);

    let firstWordMask = this.LONG_MASK << fromIndex;
    let lastWordMask = this.LONG_MASK >> -toIndex;
    if (startWordIndex === lastWordIndex) {
      // Case 1: single word.
      this._bits[startWordIndex] ^= (firstWordMask & lastWordMask);
    }
    else {
      // Case 2: multiple words.
      // Handle first word.
      this._bits[startWordIndex] ^= firstWordMask;

      // Handle intermediate words, if any.
      for (let i = startWordIndex + 1; i < lastWordIndex; i++) {
        this._bits[i] ^= this.LONG_MASK;
      }

      // Handle last word.
      this._bits[lastWordIndex] ^= lastWordMask;
    }

    this._recalcualteWordsInUse();
    this._checkInvariants();
  }

  /**
   * Sets the raw bit value at the specified index. Avoid using this method
   * whenever possible. Instead use either set() or setFromTo() so as to
   * preserve invariants.
   * @param  {Number} index The index at which to set the specified bit.
   * @param  {Number|Boolean} bit   Set true or 1 to set the bit, or false or 0
   * to clear the bit.
   * @throws {IllegalArgumentException} if index is not a number - or - bit is
   * is not a number (0 or 1) or boolean.
   * @throws {RangeError} if index is less than zero or greater than the last
   * index.
   */
  setBitValueRaw(index, bit) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if ((index < 0) || (index > this._bits.length - 1)) {
      throw new RangeError("index must be greater than zero and less than or " +
                            "equal to the last index in the bit set.");
    }

    if (typeof bit === 'number') {
      if (bit < 0) {
        bit = 0;
      }

      if (bit > 1) {
        bit = 1;
      }
    }
    else if (typeof bit === 'boolean') {
      if (bit === true) {
        bit = 1;
      }
      else {
        bit = 0;
      }
    }
    else {
      throw new IllegalArgumentException("bit must be a number (0 or 1) or boolean.");
    }
    this._bits[index] = bit;
  }

  /**
   * Gets the value of the bit at the specified index.
   * @param  {Number} index The index at which to get the bit value.
   * @return {Boolean}       true if the requested bit is set; Otherwise, false.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  get(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    this._checkInvariants();
    let offset = wordIndex(index);
    return ((offset < this._wordsInUse) &&
            ((this._bits[index] & (1 << index)) !== 0));
  }

  /**
   * Public method for recalculating the words in use. Sets the internal word
   * count field to the logical size in words of the BitSet. WARNING: This
   * method assumes that the number of words actually in use is less than or
   * equal to the current value of the words in use field!!!
   */
  doRecalculateWordsInUse() {
    this._recalcualteWordsInUse();
  }

  /**
   * Returns a new BitSet composed of bits from this BitSet from the specified
   * the specified "from" (inclusive) index to the specified "to" (exclusive)
   * index.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * include.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to include.
   * @return {BitSet}           A new BitSet instance composed of the specified
   * range of bits from this instance.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  getFromTo(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    this._checkInvariants();

    // If no set bits in range, then return the empty BitSet.
    let len = this.length;
    if ((len <= fromIndex) || (fromIndex === toIndex)) {
      return fromWordArray(new Array(0));
    }

    // Optimize.
    if (toIndex > len) {
      toIndex = len;
    }

    let bs = new BitSet(toIndex - fromIndex);
    let targetWords = wordIndex(toIndex - fromIndex - 1) + 1;
    let sourceIndex = wordIndex(fromIndex);
    let aligned = ((fromIndex & this.BIT_INDEX_MASK) === 0);

    // Process all words but the last one.
    let setBit = 0;
    for (let i = 0; i < targetWords - 1; i++, sourceIndex++) {
      setBit = aligned ? this._bits[sourceIndex] :
          (this._bits[sourceIndex] >> fromIndex) |
          (this._bits[sourceIndex + 1] << -fromIndex);
      bs.setBitValueRaw(i, setBit);
    }

    // Process last word.
    let lastWordMask = this.LONG_MASK >> -toIndex;
    setBit = ((toIndex - 1) & this.BIT_INDEX_MASK) < (fromIndex & this.BIT_INDEX_MASK) ?
              ((this._bits[sourceIndex] >> fromIndex) |
                (this._bits[sourceIndex + 1] & lastWordMask) << -fromIndex) :
                ((this._bits[sourceIndex] & lastWordMask) >> fromIndex);

    bs.setBitValueRaw(targetWords - 1, setBit);
    bs.doCheckInvariants();
    bs.doRecalculateWordsInUse();
    return bs;
  }

  /**
   * Sets the bit at the specified index to true.
   * @param  {Number} index The index at which to set the bit.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  set(index) {
    if (typeof index !== 'number') {
      throw new IllegalArgumentException("index must be a valid number.");
    }

    if (index < 0) {
      throw new RangeError("index cannot be less than zero.");
    }

    let offset = wordIndex(index);
    this._expandTo(offset);
    this._bits[offset] |= (1 << index);  // Restores invariants;
    this._checkInvariants();
  }

  /**
   * Sets the bit at the specified index to the specified value.
   * @param  {Number} index The index at which to set the bit.
   * @param  {Boolean} value The value to set.
   * @throws {IllegalArgumentException} if index is not a number.
   * @throws {RangeError} if index is less than zero.
   */
  setValue(index, value) {
    if (value) {
      this.set(index);
    }
    else {
      this.clear(index);
    }
  }

  /**
   * Sets the bits from the specified "from" index (inclusive) to the specified
   * "to" index (exclusive) to true.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * set.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to set.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  setFromTo(fromIndex, toIndex) {
    checkRange(fromIndex, toIndex);
    if (fromIndex === toIndex) {
      return;
    }

    let startWordIndex = wordIndex(fromIndex);
    let endWordIndex = wordIndex(toIndex - 1);
    this._expandTo(endWordIndex);

    let firstWordMask = this.LONG_MASK << fromIndex;
    let lastWordMask = this.LONG_MASK >> -toIndex;
    if (startWordIndex === endWordIndex) {
      // Case 1: single word.
      this._bits[startWordIndex] |= (firstWordMask & lastWordMask);
    }
    else {
      // Case 2: multiple words.
      // Handle first word.
      this._bits[startWordIndex] |= firstWordMask;

      // Handle intermediate words, if any.
      for (let i = startWordIndex + 1; i < endWordIndex; i++) {
        this._bits[i] = this.LONG_MASK;
      }

      // Handle last word (restores invariants).
      this._bits[endWordIndex] |= lastWordMask;
    }

    this._checkInvariants();
  }

  /**
   * Sets the bits from the specified "from" index (inclusive) to the specified
   * "to" index (exclusive) to the specified value.
   * @param  {Number} fromIndex The starting index. This is the first bit to
   * set.
   * @param  {Number} toIndex   The ending index. This is the index after the
   * last bit to set.
   * @param  {Boolean} value The value to set.
   * @throws {ArgumentNullException} if fromIndex is null or toIndex is null.
   * @throws {IllegalArgumentException} if either parameter is not a number.
   * @throws {RangeError} if either parameter is less than zero.
   */
  setValueFromTo(fromIndex, toIndex, value) {
    if (value) {
      this.setFromTo(fromIndex, toIndex);
    }
    else {
      this.clearFromTo(fromIndex, toIndex);
    }
  }

  /**
   * Gets a hash code value for this BitSet. The hash code depends only on which
   * bits are set within this instance.
   * @return {Number} The hash code value for this BitSet.
   */
  getHashCode() {
    let h = 1234;
    for (let i = this._bits.length; --i >= 0;) {
      h ^= this._bits[i] * (i + 1);
    }

    return ((h >> 32) ^ h);
  }

  /**
   * Determines whether or not the specified BitSet has any bits set to true
   * that are also set to true in this BitSet.
   * @param  {BitSet} bs The BitSet to intersect with.
   * @return {Boolean}   true if this instance intersects with the specified
   * BitSet.
   */
  intersects(bs) {
    if (util.isNullOrUndefined(bs)) {
      return false;
    }

    if (!(bs instanceof BitSet)) {
      return false;
    }

    let goodBits = false;
    let i = Math.min(this._bits.length, bs.getBits().length);
    while (--i >= 0) {
      if ((this._bits[i] & bs.getBits()[i]) !== 0) {
        goodBits = true;
        break;
      }
    }
    return goodBits;
  }

  /**
   * Returns the index of the first bit that is set to false that occurs on or
   * after the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * @return {Number}           The index of the next clear bit; Otherwise, -1
   * if no such bit is found.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  nextClearBit(fromIndex) {
    if (fromIndex < 0) {
      throw new RangeError("'from' index cannot be less than zero.");
    }

    this._checkInvariants();
    let offset = wordIndex(fromIndex);
    if (offset >= this._wordsInUse) {
      return fromIndex;
    }

    let result = -1;
    let w = ~this._bits[offset] & (this.LONG_MASK << fromIndex);
    while (true) {
      if (w !== 0) {
        result = (offset * BITS_PER_WORD) + numberOfTrailingZeros(w);
        break;
      }

      if (++offset === this._wordsInUse) {
        result = this._wordsInUse * BITS_PER_WORD;
        break;
      }

      w = ~this._bits[offset];
    }
    return result;
  }

  /**
   * Returns the index of the first bit that is set to true that occurs on or
   * after the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if less than zero.
   * @return {Number}           The index of the next set bit after the
   * specified index. If no such bit exists, then returns -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  nextSetBit(fromIndex) {
    if (fromIndex < 0) {
      throw new RangeError("'from' index cannot be less than zero.");
    }

    this._checkInvariants();
    let offset = wordIndex(fromIndex);
    if (offset >= this._wordsInUse) {
      return -1;
    }

    let result = -1;
    let w = this._bits[offset] & (this.LONG_MASK << fromIndex);
    while (true) {
      if (w !== 0) {
        result = (offset * BITS_PER_WORD) + numberOfTrailingZeros(w);
        break;
      }

      if (++offset === this._wordsInUse) {
        break;
      }

      w = this._bits[offset];
    }
    return result;
  }

  /**
   * Returns the index of the nearest bit that is set to true that occurs on or
   * before the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if less than zero.
   * @return {Number}           The index of the previous set bit, or -1 if
   * there is no such bit or if fromIndex is set to -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  previousSetBit(fromIndex) {
    if (fromIndex < 0) {
      if (fromIndex === -1) {
        return -1;
      }
      throw new RangeError("'from' index cannot be less than zero.");
    }

    this._checkInvariants();
    let offset = wordIndex(fromIndex);
    if (offset >= this._wordsInUse) {
      return (this.length - 1);
    }

    let result = -1;
    let w = this._bits[offset] & (this.LONG_MASK >> -(fromIndex + 1));
    while (true) {
      if (w !== 0) {
        result = (offset + 1) * BITS_PER_WORD - 1 - numberOfTrailingZeros(w);
        break;
      }

      if (offset-- === 0) {
        break;
      }

      w = this._bits[offset];
    }
    return result;
  }

  /**
   * Returns the index of the nearest bit that is set to false that occurs on or
   * before the specified starting index.
   * @param  {Number} fromIndex The index to start checking from (inclusive).
   * Throws RangeError if fromIndex is less than -1.
   * @return {Number}           The index of the previous clear bit, or -1 if
   * there is no such bit or fromIndex is -1.
   * @throws {RangeError} if fromIndex is less than zero.
   */
  previousClearBit(fromIndex) {
    if (fromIndex < 0) {
      if (fromIndex === -1) {
        return -1;
      }
      throw new RangeError("'from' index cannot be less than zero.");
    }

    this._checkInvariants();
    let offset = wordIndex(fromIndex);
    if (offset >= this._wordsInUse) {
      return fromIndex;
    }

    let result = -1;
    let w = ~this._bits[offset] & (this.LONG_MASK >> -(fromIndex + 1));
    while (true) {
      if (w !== 0) {
        result = (offset + 1) * BITS_PER_WORD - 1 - numberOfTrailingZeros(w);
        break;
      }

      if (offset-- === 0) {
        break;
      }

      w = ~this._bits[offset];
    }
    return result;
  }

  /**
   * This method is used for efficiency. It checks to see if this instance
   * contains all the same bits as the specified BitSet.
   * @param  {BitSet} otherBS The BitSet to check.
   * @return {Boolean}         true if the specified BitSet contains all the same
   * bits; Otherwise, false.
   */
  containsAll(otherBS) {
    if (util.isNullOrUndefined(otherBS)) {
      return false;
    }

    let result = true;
    for (let i = 0; i < otherBS.getBits().length; i++) {
      if ((this._bits[i] & otherBS.getBits()[i]) !== otherBS.getBits()[i]) {
        result = false;
        break;
      }
    }
    return result;
  }

  /**
   * Returns a String that represents the current BitSet. For every index for
   * which this BitSet contains a bit in the set state, the decimal
   * representation of that index is included in the result. Such indices are
   * listed in order from lowest to highest, separated by a ", " (a comma and a
   * space) and surrounded by braces, resulting in the usual mathematical
   * notation for a set of integers.
   * @return {String} A String that represents the current BitSet.
   */
  toString() {
    let sb = new StringBuilder();
    sb.append("{");

    let first = true;
    let bit = 0;
    let word = 0;
    for (let i = 0; i < this._bits.length; ++i) {
      bit = 1;
      word = this._bits[i];
      if (word === 0) {
        continue;
      }

      for (var j = 0; j < 64; ++j) {
        if ((word & bit) !== 0) {
          if (!first) {
            sb.append(", ");
          }
          sb.append((64 * i + j).toString());
          first = false;
        }
        bit <<= 1;
      }
    }

    sb.append("}");
    return sb.toString();
  }

  /**
   * Returns a new array of bits containing all the bits in this BitSet.
   * @return {Array} An array of bits containing little-endian representation of
   * all the bits in this BitSet.
   */
  toBitArray() {
    return (this._bits || []).concat();
  }
}

/**
 * Returns a new BitSet containing all the bits in the specified array of
 * numbers (bits).
 * @param  {Array} words The array of bits to construct a BitSet from. If null,
 * then this function will return null.
 * @return {BitSet}      A new BitSet containing the specified array of bits.
 * @throws {IllegalArgumentException} if not an array.
 */
const valueOf = function(words) {
  if (util.isNullOrUndefined(words)) {
    return null;
  }

  if (!util.isArray(words)) {
    throw new IllegalArgumentException("param 'words' must be an array of bits.");
  }

  let n = 0;
  for (n = words.length; n > 0 && words[n - 1] === 0; n--) {
  }

  let wordsCopy = (words || []).concat();
  return new BitSet(wordsCopy);
};
/* jshint latedef: true */

module.exports.WordIndex = wordIndex;
module.exports.CheckRange = checkRange;
module.exports.valueOf = valueOf;
module.exports.numberOfTrailingZeros = numberOfTrailingZeros;
module.exports.fromWordArray = fromWordArray;
module.exports.BitSet = BitSet;
