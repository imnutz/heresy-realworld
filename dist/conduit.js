(function () {
                             'use strict';

                             var uhyphen = camel => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))/g, '$2$5-$3$6')
                                                          .toLowerCase();

                             /*! (c) Andrea Giammarchi - ISC */
                             var self$1 = null || /* istanbul ignore next */ {};
                             try { self$1.Event = new Event('.').constructor; }
                             catch (Event) {
                               try {
                                 self$1.Event = new CustomEvent('.').constructor;
                               } catch (Event) {
                                 self$1.Event = function Event(type, init) {
                                   if (!init)
                                     init = {};
                                   var e = document.createEvent('Event');
                                   var bubbles = !!init.bubbles;
                                   var cancelable = !!init.cancelable;
                                   e.initEvent(type, bubbles, cancelable);
                                   try {
                                     e.bubbles = bubbles;
                                     e.cancelable = cancelable;
                                   } catch (e) {}
                                   return e;
                                 };
                               }
                             }
                             var Event$1 = self$1.Event;

                             /*! (c) Andrea Giammarchi - ISC */
                             var self$2 = null || /* istanbul ignore next */ {};
                             try { self$2.WeakSet = WeakSet; }
                             catch (WeakSet) {
                               // requires a global WeakMap (IE11+)
                               (function (WeakMap) {
                                 var all = new WeakMap;
                                 var proto = WeakSet.prototype;
                                 proto.add = function (value) {
                                   return all.get(this).set(value, 1), this;
                                 };
                                 proto.delete = function (value) {
                                   return all.get(this).delete(value);
                                 };
                                 proto.has = function (value) {
                                   return all.get(this).has(value);
                                 };
                                 self$2.WeakSet = WeakSet;
                                 function WeakSet(iterable) {
                                   all.set(this, new WeakMap);
                                   if (iterable)
                                     iterable.forEach(this.add, this);
                                 }
                               }(WeakMap));
                             }
                             var WeakSet$1 = self$2.WeakSet;

                             var isNoOp = typeof document !== 'object';

                             var templateLiteral = function (tl) {
                               var RAW = 'raw';
                               var isBroken = function (UA) {
                                 return /(Firefox|Safari)\/(\d+)/.test(UA) &&
                                       !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
                               };
                               var broken = isBroken((document.defaultView.navigator || {}).userAgent);
                               var FTS = !(RAW in tl) ||
                                         tl.propertyIsEnumerable(RAW) ||
                                         !Object.isFrozen(tl[RAW]);
                               if (broken || FTS) {
                                 var forever = {};
                                 var foreverCache = function (tl) {
                                   for (var key = '.', i = 0; i < tl.length; i++)
                                     key += tl[i].length + '.' + tl[i];
                                   return forever[key] || (forever[key] = tl);
                                 };
                                 // Fallback TypeScript shenanigans
                                 if (FTS)
                                   templateLiteral = foreverCache;
                                 // try fast path for other browsers:
                                 // store the template as WeakMap key
                                 // and forever cache it only when it's not there.
                                 // this way performance is still optimal,
                                 // penalized only when there are GC issues
                                 else {
                                   var wm = new WeakMap;
                                   var set = function (tl, unique) {
                                     wm.set(tl, unique);
                                     return unique;
                                   };
                                   templateLiteral = function (tl) {
                                     return wm.get(tl) || set(tl, foreverCache(tl));
                                   };
                                 }
                               } else {
                                 isNoOp = true;
                               }
                               return TL(tl);
                             };

                             function TL(tl) {
                               return isNoOp ? tl : templateLiteral(tl);
                             }

                             var tta = (...args) => args;

                             /*! (c) Andrea Giammarchi - ISC */

                             // Custom
                             var UID = '-' + Math.random().toFixed(6) + '%';
                             //                           Edge issue!

                             var UID_IE = false;

                             try {
                               if (!(function (template, content, tabindex) {
                                 return content in template && (
                                   (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
                                   template[content].childNodes[0].getAttribute(tabindex) == UID
                                 );
                               }(document.createElement('template'), 'content', 'tabindex'))) {
                                 UID = '_dt: ' + UID.slice(1, -1) + ';';
                                 UID_IE = true;
                               }
                             } catch(meh) {}

                             var UIDC = '<!--' + UID + '-->';

                             // DOM
                             var COMMENT_NODE = 8;
                             var ELEMENT_NODE = 1;
                             var TEXT_NODE = 3;

                             var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
                             var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

                             /*! (c) Andrea Giammarchi - ISC */

                             function domsanitizer (template) {
                               return template.join(UIDC)
                                       .replace(selfClosing, fullClosing)
                                       .replace(attrSeeker, attrReplacer);
                             }

                             var spaces = ' \\f\\n\\r\\t';
                             var almostEverything = '[^' + spaces + '\\/>"\'=]+';
                             var attrName = '[' + spaces + ']+' + almostEverything;
                             var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
                             var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';

                             var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
                             var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
                             var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

                             function attrReplacer($0, $1, $2, $3) {
                               return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
                             }

                             function replaceAttributes($0, $1, $2) {
                               return $1 + ($2 || '"') + UID + ($2 || '"');
                             }

                             function fullClosing($0, $1, $2) {
                               return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
                             }

                             const {isArray} = Array;
                             const {indexOf, slice} = [];

                             var umap = _ => ({
                               // About: get: _.get.bind(_)
                               // It looks like WebKit/Safari didn't optimize bind at all,
                               // so that using bind slows it down by 60%.
                               // Firefox and Chrome are just fine in both cases,
                               // so let's use the approach that works fast everywhere 👍
                               get: key => _.get(key),
                               set: (key, value) => (_.set(key, value), value)
                             });

                             const ELEMENT_NODE$1 = 1;
                             const nodeType = 111;

                             const remove = ({firstChild, lastChild}) => {
                               const range = document.createRange();
                               range.setStartAfter(firstChild);
                               range.setEndAfter(lastChild);
                               range.deleteContents();
                               return firstChild;
                             };

                             const diffable = (node, operation) => node.nodeType === nodeType ?
                               ((1 / operation) < 0 ?
                                 (operation ? remove(node) : node.lastChild) :
                                 (operation ? node.valueOf() : node.firstChild)) :
                               node
                             ;

                             const persistent = fragment => {
                               const {childNodes} = fragment;
                               const {length} = childNodes;
                               // If the fragment has no content
                               // it should return undefined and break
                               if (length < 2)
                                 return childNodes[0];
                               const nodes = slice.call(childNodes, 0);
                               const firstChild = nodes[0];
                               const lastChild = nodes[length - 1];
                               return {
                                 ELEMENT_NODE: ELEMENT_NODE$1,
                                 nodeType,
                                 firstChild,
                                 lastChild,
                                 valueOf() {
                                   if (childNodes.length !== length) {
                                     let i = 0;
                                     while (i < length)
                                       fragment.appendChild(nodes[i++]);
                                   }
                                   return fragment;
                                 }
                               };
                             };

                             const svg = 'http://www.w3.org/2000/svg';
                             const xhtml = 'http://www.w3.org/1999/xhtml';

                             const create = element => document.createElementNS(xhtml, element);

                             const createContent = (markup, type) =>
                                                     (type === 'svg' ? createSVG : createHTML)(markup);

                             const createHTML = html => {
                               const template = create('template');
                               template.innerHTML = html;
                               return template.content;
                             };

                             const createSVG = xml => {
                               const {content} = create('template');
                               const template = create('div');
                               template.innerHTML = '<svg xmlns="' + svg + '">' + xml + '</svg>';
                               const {childNodes} = template.firstChild;
                               let {length} = childNodes;
                               while (length--)
                                 content.appendChild(childNodes[0]);
                               return content;
                             };

                             const append = (get, parent, children, start, end, before) => {
                               const isSelect = 'selectedIndex' in parent;
                               let noSelection = isSelect;
                               while (start < end) {
                                 const child = get(children[start], 1);
                                 parent.insertBefore(child, before);
                                 if (isSelect && noSelection && child.selected) {
                                   noSelection = !noSelection;
                                   let {selectedIndex} = parent;
                                   parent.selectedIndex = selectedIndex < 0 ?
                                     start :
                                     indexOf.call(parent.querySelectorAll('option'), child);
                                 }
                                 start++;
                               }
                             };

                             const eqeq = (a, b) => a == b;

                             const identity = O => O;

                             const indexOf$1 = (
                               moreNodes,
                               moreStart,
                               moreEnd,
                               lessNodes,
                               lessStart,
                               lessEnd,
                               compare
                             ) => {
                               const length = lessEnd - lessStart;
                               /* istanbul ignore if */
                               if (length < 1)
                                 return -1;
                               while ((moreEnd - moreStart) >= length) {
                                 let m = moreStart;
                                 let l = lessStart;
                                 while (
                                   m < moreEnd &&
                                   l < lessEnd &&
                                   compare(moreNodes[m], lessNodes[l])
                                 ) {
                                   m++;
                                   l++;
                                 }
                                 if (l === lessEnd)
                                   return moreStart;
                                 moreStart = m + 1;
                               }
                               return -1;
                             };

                             const isReversed = (
                               futureNodes,
                               futureEnd,
                               currentNodes,
                               currentStart,
                               currentEnd,
                               compare
                             ) => {
                               while (
                                 currentStart < currentEnd &&
                                 compare(
                                   currentNodes[currentStart],
                                   futureNodes[futureEnd - 1]
                                 )) {
                                   currentStart++;
                                   futureEnd--;
                                 }  return futureEnd === 0;
                             };

                             const next = (get, list, i, length, before) => i < length ?
                                           get(list[i], 0) :
                                           (0 < i ?
                                             get(list[i - 1], -0).nextSibling :
                                             before);

                             const remove$1 = (get, children, start, end) => {
                               while (start < end)
                                 drop(get(children[start++], -1));
                             };

                             // - - - - - - - - - - - - - - - - - - -
                             // diff related constants and utilities
                             // - - - - - - - - - - - - - - - - - - -

                             const DELETION = -1;
                             const INSERTION = 1;
                             const SKIP = 0;
                             const SKIP_OND = 50;

                             const HS = (
                               futureNodes,
                               futureStart,
                               futureEnd,
                               futureChanges,
                               currentNodes,
                               currentStart,
                               currentEnd,
                               currentChanges
                             ) => {

                               let k = 0;
                               /* istanbul ignore next */
                               let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
                               const link = Array(minLen++);
                               const tresh = Array(minLen);
                               tresh[0] = -1;

                               for (let i = 1; i < minLen; i++)
                                 tresh[i] = currentEnd;

                               const nodes = currentNodes.slice(currentStart, currentEnd);

                               for (let i = futureStart; i < futureEnd; i++) {
                                 const index = nodes.indexOf(futureNodes[i]);
                                 if (-1 < index) {
                                   const idxInOld = index + currentStart;
                                   k = findK(tresh, minLen, idxInOld);
                                   /* istanbul ignore else */
                                   if (-1 < k) {
                                     tresh[k] = idxInOld;
                                     link[k] = {
                                       newi: i,
                                       oldi: idxInOld,
                                       prev: link[k - 1]
                                     };
                                   }
                                 }
                               }

                               k = --minLen;
                               --currentEnd;
                               while (tresh[k] > currentEnd) --k;

                               minLen = currentChanges + futureChanges - k;
                               const diff = Array(minLen);
                               let ptr = link[k];
                               --futureEnd;
                               while (ptr) {
                                 const {newi, oldi} = ptr;
                                 while (futureEnd > newi) {
                                   diff[--minLen] = INSERTION;
                                   --futureEnd;
                                 }
                                 while (currentEnd > oldi) {
                                   diff[--minLen] = DELETION;
                                   --currentEnd;
                                 }
                                 diff[--minLen] = SKIP;
                                 --futureEnd;
                                 --currentEnd;
                                 ptr = ptr.prev;
                               }
                               while (futureEnd >= futureStart) {
                                 diff[--minLen] = INSERTION;
                                 --futureEnd;
                               }
                               while (currentEnd >= currentStart) {
                                 diff[--minLen] = DELETION;
                                 --currentEnd;
                               }
                               return diff;
                             };

                             // this is pretty much the same petit-dom code without the delete map part
                             // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
                             const OND = (
                               futureNodes,
                               futureStart,
                               rows,
                               currentNodes,
                               currentStart,
                               cols,
                               compare
                             ) => {
                               const length = rows + cols;
                               const v = [];
                               let d, k, r, c, pv, cv, pd;
                               outer: for (d = 0; d <= length; d++) {
                                 /* istanbul ignore if */
                                 if (d > SKIP_OND)
                                   return null;
                                 pd = d - 1;
                                 /* istanbul ignore next */
                                 pv = d ? v[d - 1] : [0, 0];
                                 cv = v[d] = [];
                                 for (k = -d; k <= d; k += 2) {
                                   if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
                                     c = pv[pd + k + 1];
                                   } else {
                                     c = pv[pd + k - 1] + 1;
                                   }
                                   r = c - k;
                                   while (
                                     c < cols &&
                                     r < rows &&
                                     compare(
                                       currentNodes[currentStart + c],
                                       futureNodes[futureStart + r]
                                     )
                                   ) {
                                     c++;
                                     r++;
                                   }
                                   if (c === cols && r === rows) {
                                     break outer;
                                   }
                                   cv[d + k] = c;
                                 }
                               }

                               const diff = Array(d / 2 + length / 2);
                               let diffIdx = diff.length - 1;
                               for (d = v.length - 1; d >= 0; d--) {
                                 while (
                                   c > 0 &&
                                   r > 0 &&
                                   compare(
                                     currentNodes[currentStart + c - 1],
                                     futureNodes[futureStart + r - 1]
                                   )
                                 ) {
                                   // diagonal edge = equality
                                   diff[diffIdx--] = SKIP;
                                   c--;
                                   r--;
                                 }
                                 if (!d)
                                   break;
                                 pd = d - 1;
                                 /* istanbul ignore next */
                                 pv = d ? v[d - 1] : [0, 0];
                                 k = c - r;
                                 if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
                                   // vertical edge = insertion
                                   r--;
                                   diff[diffIdx--] = INSERTION;
                                 } else {
                                   // horizontal edge = deletion
                                   c--;
                                   diff[diffIdx--] = DELETION;
                                 }
                               }
                               return diff;
                             };

                             const applyDiff = (
                               diff,
                               get,
                               parentNode,
                               futureNodes,
                               futureStart,
                               currentNodes,
                               currentStart,
                               currentLength,
                               before
                             ) => {
                               const live = [];
                               const length = diff.length;
                               let currentIndex = currentStart;
                               let i = 0;
                               while (i < length) {
                                 switch (diff[i++]) {
                                   case SKIP:
                                     futureStart++;
                                     currentIndex++;
                                     break;
                                   case INSERTION:
                                     // TODO: bulk appends for sequential nodes
                                     live.push(futureNodes[futureStart]);
                                     append(
                                       get,
                                       parentNode,
                                       futureNodes,
                                       futureStart++,
                                       futureStart,
                                       currentIndex < currentLength ?
                                         get(currentNodes[currentIndex], 0) :
                                         before
                                     );
                                     break;
                                   case DELETION:
                                     currentIndex++;
                                     break;
                                 }
                               }
                               i = 0;
                               while (i < length) {
                                 switch (diff[i++]) {
                                   case SKIP:
                                     currentStart++;
                                     break;
                                   case DELETION:
                                     // TODO: bulk removes for sequential nodes
                                     if (-1 < live.indexOf(currentNodes[currentStart]))
                                       currentStart++;
                                     else
                                       remove$1(
                                         get,
                                         currentNodes,
                                         currentStart++,
                                         currentStart
                                       );
                                     break;
                                 }
                               }
                             };

                             const findK = (ktr, length, j) => {
                               let lo = 1;
                               let hi = length;
                               while (lo < hi) {
                                 const mid = ((lo + hi) / 2) >>> 0;
                                 if (j < ktr[mid])
                                   hi = mid;
                                 else
                                   lo = mid + 1;
                               }
                               return lo;
                             };

                             const smartDiff = (
                               get,
                               parentNode,
                               futureNodes,
                               futureStart,
                               futureEnd,
                               futureChanges,
                               currentNodes,
                               currentStart,
                               currentEnd,
                               currentChanges,
                               currentLength,
                               compare,
                               before
                             ) => {
                               applyDiff(
                                 OND(
                                   futureNodes,
                                   futureStart,
                                   futureChanges,
                                   currentNodes,
                                   currentStart,
                                   currentChanges,
                                   compare
                                 ) ||
                                 HS(
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   futureChanges,
                                   currentNodes,
                                   currentStart,
                                   currentEnd,
                                   currentChanges
                                 ),
                                 get,
                                 parentNode,
                                 futureNodes,
                                 futureStart,
                                 currentNodes,
                                 currentStart,
                                 currentLength,
                                 before
                               );
                             };

                             const drop = node => (node.remove || dropChild).call(node);

                             function dropChild() {
                               const {parentNode} = this;
                               /* istanbul ignore else */
                               if (parentNode)
                                 parentNode.removeChild(this);
                             }

                             /*! (c) 2018 Andrea Giammarchi (ISC) */

                             const domdiff = (
                               parentNode,     // where changes happen
                               currentNodes,   // Array of current items/nodes
                               futureNodes,    // Array of future items/nodes
                               options         // optional object with one of the following properties
                                               //  before: domNode
                                               //  compare(generic, generic) => true if same generic
                                               //  node(generic) => Node
                             ) => {
                               if (!options)
                                 options = {};

                               const compare = options.compare || eqeq;
                               const get = options.node || identity;
                               const before = options.before == null ? null : get(options.before, 0);

                               const currentLength = currentNodes.length;
                               let currentEnd = currentLength;
                               let currentStart = 0;

                               let futureEnd = futureNodes.length;
                               let futureStart = 0;

                               // common prefix
                               while (
                                 currentStart < currentEnd &&
                                 futureStart < futureEnd &&
                                 compare(currentNodes[currentStart], futureNodes[futureStart])
                               ) {
                                 currentStart++;
                                 futureStart++;
                               }

                               // common suffix
                               while (
                                 currentStart < currentEnd &&
                                 futureStart < futureEnd &&
                                 compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
                               ) {
                                 currentEnd--;
                                 futureEnd--;
                               }

                               const currentSame = currentStart === currentEnd;
                               const futureSame = futureStart === futureEnd;

                               // same list
                               if (currentSame && futureSame)
                                 return futureNodes;

                               // only stuff to add
                               if (currentSame && futureStart < futureEnd) {
                                 append(
                                   get,
                                   parentNode,
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   next(get, currentNodes, currentStart, currentLength, before)
                                 );
                                 return futureNodes;
                               }

                               // only stuff to remove
                               if (futureSame && currentStart < currentEnd) {
                                 remove$1(
                                   get,
                                   currentNodes,
                                   currentStart,
                                   currentEnd
                                 );
                                 return futureNodes;
                               }

                               const currentChanges = currentEnd - currentStart;
                               const futureChanges = futureEnd - futureStart;
                               let i = -1;

                               // 2 simple indels: the shortest sequence is a subsequence of the longest
                               if (currentChanges < futureChanges) {
                                 i = indexOf$1(
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   currentNodes,
                                   currentStart,
                                   currentEnd,
                                   compare
                                 );
                                 // inner diff
                                 if (-1 < i) {
                                   append(
                                     get,
                                     parentNode,
                                     futureNodes,
                                     futureStart,
                                     i,
                                     get(currentNodes[currentStart], 0)
                                   );
                                   append(
                                     get,
                                     parentNode,
                                     futureNodes,
                                     i + currentChanges,
                                     futureEnd,
                                     next(get, currentNodes, currentEnd, currentLength, before)
                                   );
                                   return futureNodes;
                                 }
                               }
                               /* istanbul ignore else */
                               else if (futureChanges < currentChanges) {
                                 i = indexOf$1(
                                   currentNodes,
                                   currentStart,
                                   currentEnd,
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   compare
                                 );
                                 // outer diff
                                 if (-1 < i) {
                                   remove$1(
                                     get,
                                     currentNodes,
                                     currentStart,
                                     i
                                   );
                                   remove$1(
                                     get,
                                     currentNodes,
                                     i + futureChanges,
                                     currentEnd
                                   );
                                   return futureNodes;
                                 }
                               }

                               // common case with one replacement for many nodes
                               // or many nodes replaced for a single one
                               /* istanbul ignore else */
                               if ((currentChanges < 2 || futureChanges < 2)) {
                                 append(
                                   get,
                                   parentNode,
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   get(currentNodes[currentStart], 0)
                                 );
                                 remove$1(
                                   get,
                                   currentNodes,
                                   currentStart,
                                   currentEnd
                                 );
                                 return futureNodes;
                               }

                               // the half match diff part has been skipped in petit-dom
                               // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
                               // accordingly, I think it's safe to skip in here too
                               // if one day it'll come out like the speediest thing ever to do
                               // then I might add it in here too

                               // Extra: before going too fancy, what about reversed lists ?
                               //        This should bail out pretty quickly if that's not the case.
                               if (
                                 currentChanges === futureChanges &&
                                 isReversed(
                                   futureNodes,
                                   futureEnd,
                                   currentNodes,
                                   currentStart,
                                   currentEnd,
                                   compare
                                 )
                               ) {
                                 append(
                                   get,
                                   parentNode,
                                   futureNodes,
                                   futureStart,
                                   futureEnd,
                                   next(get, currentNodes, currentEnd, currentLength, before)
                                 );
                                 return futureNodes;
                               }

                               // last resort through a smart diff
                               smartDiff(
                                 get,
                                 parentNode,
                                 futureNodes,
                                 futureStart,
                                 futureEnd,
                                 futureChanges,
                                 currentNodes,
                                 currentStart,
                                 currentEnd,
                                 currentChanges,
                                 currentLength,
                                 compare,
                                 before
                               );

                               return futureNodes;
                             };

                             var importNode = document.importNode;

                             var trim = ''.trim;

                             /* istanbul ignore next */
                             var normalizeAttributes = UID_IE ?
                               function (attributes, parts) {
                                 var html = parts.join(' ');
                                 return parts.slice.call(attributes, 0).sort(function (left, right) {
                                   return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1;
                                 });
                               } :
                               function (attributes, parts) {
                                 return parts.slice.call(attributes, 0);
                               }
                             ;

                             function find(node, path) {
                               var length = path.length;
                               var i = 0;
                               while (i < length)
                                 node = node.childNodes[path[i++]];
                               return node;
                             }

                             function parse(node, holes, parts, path) {
                               var childNodes = node.childNodes;
                               var length = childNodes.length;
                               var i = 0;
                               while (i < length) {
                                 var child = childNodes[i];
                                 switch (child.nodeType) {
                                   case ELEMENT_NODE:
                                     var childPath = path.concat(i);
                                     parseAttributes(child, holes, parts, childPath);
                                     parse(child, holes, parts, childPath);
                                     break;
                                   case COMMENT_NODE:
                                     var textContent = child.textContent;
                                     if (textContent === UID) {
                                       parts.shift();
                                       holes.push(
                                         // basicHTML or other non standard engines
                                         // might end up having comments in nodes
                                         // where they shouldn't, hence this check.
                                         SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ?
                                           Text(node, path) :
                                           Any(child, path.concat(i))
                                       );
                                     } else {
                                       switch (textContent.slice(0, 2)) {
                                         case '/*':
                                           if (textContent.slice(-2) !== '*/')
                                             break;
                                         case '\uD83D\uDC7B': // ghost
                                           node.removeChild(child);
                                           i--;
                                           length--;
                                       }
                                     }
                                     break;
                                   case TEXT_NODE:
                                     // the following ignore is actually covered by browsers
                                     // only basicHTML ends up on previous COMMENT_NODE case
                                     // instead of TEXT_NODE because it knows nothing about
                                     // special style or textarea behavior
                                     /* istanbul ignore if */
                                     if (
                                       SHOULD_USE_TEXT_CONTENT.test(node.nodeName) &&
                                       trim.call(child.textContent) === UIDC
                                     ) {
                                       parts.shift();
                                       holes.push(Text(node, path));
                                     }
                                     break;
                                 }
                                 i++;
                               }
                             }

                             function parseAttributes(node, holes, parts, path) {
                               var attributes = node.attributes;
                               var cache = [];
                               var remove = [];
                               var array = normalizeAttributes(attributes, parts);
                               var length = array.length;
                               var i = 0;
                               while (i < length) {
                                 var attribute = array[i++];
                                 var direct = attribute.value === UID;
                                 var sparse;
                                 if (direct || 1 < (sparse = attribute.value.split(UIDC)).length) {
                                   var name = attribute.name;
                                   // the following ignore is covered by IE
                                   // and the IE9 double viewBox test
                                   /* istanbul ignore else */
                                   if (cache.indexOf(name) < 0) {
                                     cache.push(name);
                                     var realName = parts.shift().replace(
                                       direct ?
                                         /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ :
                                         new RegExp(
                                           '^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")[\\S\\s]*',
                                           'i'
                                         ),
                                         '$1'
                                     );
                                     var value = attributes[realName] ||
                                                   // the following ignore is covered by browsers
                                                   // while basicHTML is already case-sensitive
                                                   /* istanbul ignore next */
                                                   attributes[realName.toLowerCase()];
                                     if (direct)
                                       holes.push(Attr(value, path, realName, null));
                                     else {
                                       var skip = sparse.length - 2;
                                       while (skip--)
                                         parts.shift();
                                       holes.push(Attr(value, path, realName, sparse));
                                     }
                                   }
                                   remove.push(attribute);
                                 }
                               }
                               length = remove.length;
                               i = 0;

                               /* istanbul ignore next */
                               var cleanValue = 0 < length && UID_IE && !('ownerSVGElement' in node);
                               while (i < length) {
                                 // Edge HTML bug #16878726
                                 var attr = remove[i++];
                                 // IE/Edge bug lighterhtml#63 - clean the value or it'll persist
                                 /* istanbul ignore next */
                                 if (cleanValue)
                                   attr.value = '';
                                 // IE/Edge bug lighterhtml#64 - don't use removeAttributeNode
                                 node.removeAttribute(attr.name);
                               }

                               // This is a very specific Firefox/Safari issue
                               // but since it should be a not so common pattern,
                               // it's probably worth patching regardless.
                               // Basically, scripts created through strings are death.
                               // You need to create fresh new scripts instead.
                               // TODO: is there any other node that needs such nonsense?
                               var nodeName = node.nodeName;
                               if (/^script$/i.test(nodeName)) {
                                 // this used to be like that
                                 // var script = createElement(node, nodeName);
                                 // then Edge arrived and decided that scripts created
                                 // through template documents aren't worth executing
                                 // so it became this ... hopefully it won't hurt in the wild
                                 var script = document.createElement(nodeName);
                                 length = attributes.length;
                                 i = 0;
                                 while (i < length)
                                   script.setAttributeNode(attributes[i++].cloneNode(true));
                                 script.textContent = node.textContent;
                                 node.parentNode.replaceChild(script, node);
                               }
                             }

                             function Any(node, path) {
                               return {
                                 type: 'any',
                                 node: node,
                                 path: path
                               };
                             }

                             function Attr(node, path, name, sparse) {
                               return {
                                 type: 'attr',
                                 node: node,
                                 path: path,
                                 name: name,
                                 sparse: sparse
                               };
                             }

                             function Text(node, path) {
                               return {
                                 type: 'text',
                                 node: node,
                                 path: path
                               };
                             }

                             // globals

                             var parsed = umap(new WeakMap);

                             function createInfo(options, template) {
                               var markup = (options.convert || domsanitizer)(template);
                               var transform = options.transform;
                               if (transform)
                                 markup = transform(markup);
                               var content = createContent(markup, options.type);
                               cleanContent(content);
                               var holes = [];
                               parse(content, holes, template.slice(0), []);
                               return {
                                 content: content,
                                 updates: function (content) {
                                   var updates = [];
                                   var len = holes.length;
                                   var i = 0;
                                   var off = 0;
                                   while (i < len) {
                                     var info = holes[i++];
                                     var node = find(content, info.path);
                                     switch (info.type) {
                                       case 'any':
                                         updates.push({fn: options.any(node, []), sparse: false});
                                         break;
                                       case 'attr':
                                         var sparse = info.sparse;
                                         var fn = options.attribute(node, info.name, info.node);
                                         if (sparse === null)
                                           updates.push({fn: fn, sparse: false});
                                         else {
                                           off += sparse.length - 2;
                                           updates.push({fn: fn, sparse: true, values: sparse});
                                         }
                                         break;
                                       case 'text':
                                         updates.push({fn: options.text(node), sparse: false});
                                         node.textContent = '';
                                         break;
                                     }
                                   }
                                   len += off;
                                   return function () {
                                     var length = arguments.length;
                                     if (len !== (length - 1)) {
                                       throw new Error(
                                         (length - 1) + ' values instead of ' + len + '\n' +
                                         template.join('${value}')
                                       );
                                     }
                                     var i = 1;
                                     var off = 1;
                                     while (i < length) {
                                       var update = updates[i - off];
                                       if (update.sparse) {
                                         var values = update.values;
                                         var value = values[0];
                                         var j = 1;
                                         var l = values.length;
                                         off += l - 2;
                                         while (j < l)
                                           value += arguments[i++] + values[j++];
                                         update.fn(value);
                                       }
                                       else
                                         update.fn(arguments[i++]);
                                     }
                                     return content;
                                   };
                                 }
                               };
                             }

                             function createDetails(options, template) {
                               var info = parsed.get(template) || parsed.set(template, createInfo(options, template));
                               return info.updates(importNode.call(document, info.content, true));
                             }

                             var empty = [];
                             function domtagger(options) {
                               var previous = empty;
                               var updates = cleanContent;
                               return function (template) {
                                 if (previous !== template)
                                   updates = createDetails(options, (previous = template));
                                 return updates.apply(null, arguments);
                               };
                             }

                             function cleanContent(fragment) {
                               var childNodes = fragment.childNodes;
                               var i = childNodes.length;
                               while (i--) {
                                 var child = childNodes[i];
                                 if (
                                   child.nodeType !== 1 &&
                                   trim.call(child.textContent).length === 0
                                 ) {
                                   fragment.removeChild(child);
                                 }
                               }
                             }

                             /*! (c) Andrea Giammarchi - ISC */
                             var hyperStyle = (function (){  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
                               var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
                               var hyphen = /([^A-Z])([A-Z]+)/g;
                               return function hyperStyle(node, original) {
                                 return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
                               };
                               function ized($0, $1, $2) {
                                 return $1 + '-' + $2.toLowerCase();
                               }
                               function svg(node, original) {
                                 var style;
                                 if (original)
                                   style = original.cloneNode(true);
                                 else {
                                   node.setAttribute('style', '--hyper:style;');
                                   style = node.getAttributeNode('style');
                                 }
                                 style.value = '';
                                 node.setAttributeNode(style);
                                 return update(style, true);
                               }
                               function toStyle(object) {
                                 var key, css = [];
                                 for (key in object)
                                   css.push(key.replace(hyphen, ized), ':', object[key], ';');
                                 return css.join('');
                               }
                               function update(style, isSVG) {
                                 var oldType, oldValue;
                                 return function (newValue) {
                                   var info, key, styleValue, value;
                                   switch (typeof newValue) {
                                     case 'object':
                                       if (newValue) {
                                         if (oldType === 'object') {
                                           if (!isSVG) {
                                             if (oldValue !== newValue) {
                                               for (key in oldValue) {
                                                 if (!(key in newValue)) {
                                                   style[key] = '';
                                                 }
                                               }
                                             }
                                           }
                                         } else {
                                           if (isSVG)
                                             style.value = '';
                                           else
                                             style.cssText = '';
                                         }
                                         info = isSVG ? {} : style;
                                         for (key in newValue) {
                                           value = newValue[key];
                                           styleValue = typeof value === 'number' &&
                                                               !IS_NON_DIMENSIONAL.test(key) ?
                                                               (value + 'px') : value;
                                           if (!isSVG && /^--/.test(key))
                                             info.setProperty(key, styleValue);
                                           else
                                             info[key] = styleValue;
                                         }
                                         oldType = 'object';
                                         if (isSVG)
                                           style.value = toStyle((oldValue = info));
                                         else
                                           oldValue = newValue;
                                         break;
                                       }
                                     default:
                                       if (oldValue != newValue) {
                                         oldType = 'string';
                                         oldValue = newValue;
                                         if (isSVG)
                                           style.value = newValue || '';
                                         else
                                           style.cssText = newValue || '';
                                       }
                                       break;
                                   }
                                 };
                               }
                             }());

                             const aria = node => value => {
                               for (const key in value)
                                 node.setAttribute(key === 'role' ? key : `aria-${key}`, value[key]);
                             };

                             const attribute = (node, name) => {
                               let oldValue, orphan = true;
                               const attributeNode = document.createAttribute(name);
                               return newValue => {
                                 if (oldValue !== newValue) {
                                   oldValue = newValue;
                                   if (oldValue == null) {
                                     if (!orphan) {
                                       node.removeAttributeNode(attributeNode);
                                       orphan = true;
                                     }
                                   }
                                   else {
                                     attributeNode.value = newValue;
                                     if (orphan) {
                                       node.setAttributeNode(attributeNode);
                                       orphan = false;
                                     }
                                   }
                                 }
                               };
                             };

                             const data = ({dataset}) => value => {
                               for (const key in value)
                                 dataset[key] = value[key];
                             };

                             const event = (node, name) => {
                               let oldValue, type = name.slice(2);
                               if (!(name in node) && name.toLowerCase() in node)
                                 type = type.toLowerCase();
                               return newValue => {
                                 const info = isArray(newValue) ? newValue : [newValue, false];
                                 if (oldValue !== info[0]) {
                                   if (oldValue)
                                     node.removeEventListener(type, oldValue, info[1]);
                                   if (oldValue = info[0])
                                     node.addEventListener(type, oldValue, info[1]);
                                 }
                               };
                             };

                             const ref = node => value => {
                               if (typeof value === 'function')
                                 value(node);
                               else
                                 value.current = node;
                             };

                             const setter = (node, key) => value => {
                               node[key] = value;
                             };

                             // special attributes helpers
                             const hyperProperty = (node, name) => {
                               let oldValue;
                               return newValue => {
                                 if (oldValue !== newValue) {
                                   oldValue = newValue;
                                   if (node[name] !== newValue) {
                                     if (newValue == null) {
                                       // cleanup before dropping the attribute to fix IE/Edge gotcha
                                       node[name] = '';
                                       node.removeAttribute(name);
                                     } else
                                       node[name] = newValue;
                                   }
                                 }
                               };
                             };

                             // list of attributes that should not be directly assigned
                             const readOnly = /^(?:form|list)$/i;

                             // simplifies text node creation
                             const text = (node, text) => node.ownerDocument.createTextNode(text);

                             function Tagger(type) {
                               this.type = type;
                               return domtagger(this);
                             }
                             Tagger.prototype = {

                               // there are four kind of attributes, and related behavior:
                               //  * events, with a name starting with `on`, to add/remove event listeners
                               //  * special, with a name present in their inherited prototype, accessed directly
                               //  * regular, accessed through get/setAttribute standard DOM methods
                               //  * style, the only regular attribute that also accepts an object as value
                               //    so that you can style=${{width: 120}}. In this case, the behavior has been
                               //    fully inspired by Preact library and its simplicity.
                               attribute(node, name, original) {
                                 const isSVG = this.type === 'svg';
                                 switch (name) {
                                   case 'class':
                                     if (isSVG)
                                       return attribute(node, name);
                                     name = 'className';
                                   case 'props':
                                     return setter(node, name);
                                   case 'aria':
                                     return aria(node);
                                   case 'data':
                                     return data(node);
                                   case 'style':
                                     return hyperStyle(node, original, isSVG);
                                   case 'ref':
                                     return ref(node);
                                   default:
                                     if (name.slice(0, 1) === '.')
                                       return setter(node, name.slice(1));
                                     if (name.slice(0, 2) === 'on')
                                       return event(node, name);
                                     if (name in node && !(isSVG || readOnly.test(name)))
                                       return hyperProperty(node, name);
                                     return attribute(node, name);

                                 }
                               },

                               // in a hyper(node)`<div>${content}</div>` case
                               // everything could happen:
                               //  * it's a JS primitive, stored as text
                               //  * it's null or undefined, the node should be cleaned
                               //  * it's a promise, update the content once resolved
                               //  * it's an explicit intent, perform the desired operation
                               //  * it's an Array, resolve all values if Promises and/or
                               //    update the node with the resulting list of content
                               any(node, childNodes) {
                                 const diffOptions = {node: diffable, before: node};
                                 const {type} = this;
                                 let fastPath = false;
                                 let oldValue;
                                 const anyContent = value => {
                                   switch (typeof value) {
                                     case 'string':
                                     case 'number':
                                     case 'boolean':
                                       if (fastPath) {
                                         if (oldValue !== value) {
                                           oldValue = value;
                                           childNodes[0].textContent = value;
                                         }
                                       } else {
                                         fastPath = true;
                                         oldValue = value;
                                         childNodes = domdiff(
                                           node.parentNode,
                                           childNodes,
                                           [text(node, value)],
                                           diffOptions
                                         );
                                       }
                                       break;
                                     case 'function':
                                       anyContent(value(node));
                                       break;
                                     case 'object':
                                     case 'undefined':
                                       if (value == null) {
                                         fastPath = false;
                                         childNodes = domdiff(
                                           node.parentNode,
                                           childNodes,
                                           [],
                                           diffOptions
                                         );
                                         break;
                                       }
                                     default:
                                       fastPath = false;
                                       oldValue = value;
                                       if (isArray(value)) {
                                         if (value.length === 0) {
                                           if (childNodes.length) {
                                             childNodes = domdiff(
                                               node.parentNode,
                                               childNodes,
                                               [],
                                               diffOptions
                                             );
                                           }
                                         } else {
                                           switch (typeof value[0]) {
                                             case 'string':
                                             case 'number':
                                             case 'boolean':
                                               anyContent(String(value));
                                               break;
                                             case 'function':
                                               anyContent(value.map(invoke, node));
                                               break;
                                             case 'object':
                                               if (isArray(value[0])) {
                                                 value = value.concat.apply([], value);
                                               }
                                             default:
                                               childNodes = domdiff(
                                                 node.parentNode,
                                                 childNodes,
                                                 value,
                                                 diffOptions
                                               );
                                               break;
                                           }
                                         }
                                       } else if ('ELEMENT_NODE' in value) {
                                         childNodes = domdiff(
                                           node.parentNode,
                                           childNodes,
                                           value.nodeType === 11 ?
                                             slice.call(value.childNodes) :
                                             [value],
                                           diffOptions
                                         );
                                       } else if ('text' in value) {
                                         anyContent(String(value.text));
                                       } else if ('any' in value) {
                                         anyContent(value.any);
                                       } else if ('html' in value) {
                                         childNodes = domdiff(
                                           node.parentNode,
                                           childNodes,
                                           slice.call(
                                             createContent(
                                               [].concat(value.html).join(''),
                                               type
                                             ).childNodes
                                           ),
                                           diffOptions
                                         );
                                       } else if ('length' in value) {
                                         anyContent(slice.call(value));
                                       }
                                       break;
                                   }
                                 };
                                 return anyContent;
                               },

                               // style or textareas don't accept HTML as content
                               // it's pointless to transform or analyze anything
                               // different from text there but it's worth checking
                               // for possible defined intents.
                               text(node) {
                                 let oldValue;
                                 const textContent = value => {
                                   if (oldValue !== value) {
                                     oldValue = value;
                                     const type = typeof value;
                                     if (type === 'object' && value) {
                                       if ('text' in value) {
                                         textContent(String(value.text));
                                       } else if ('any' in value) {
                                         textContent(value.any);
                                       } else if ('html' in value) {
                                         textContent([].concat(value.html).join(''));
                                       } else if ('length' in value) {
                                         textContent(slice.call(value).join(''));
                                       }
                                     } else if (type === 'function') {
                                       textContent(value(node));
                                     } else {
                                       node.textContent = value == null ? '' : value;
                                     }
                                   }
                                 };
                                 return textContent;
                               }
                             };

                             function invoke(callback) {
                               return callback(this);
                             }

                             const {create: create$1, freeze, keys} = Object;

                             const tProto = Tagger.prototype;

                             const cache = umap(new WeakMap);

                             const createRender = Tagger => ({
                               html: outer('html', Tagger),
                               svg: outer('svg', Tagger),
                               render(where, what) {
                                 const hole = typeof what === 'function' ? what() : what;
                                 const info = cache.get(where) || cache.set(where, createCache());
                                 const wire = hole instanceof LighterHole ?
                                               unroll(Tagger, info, hole) : hole;
                                 if (wire !== info.wire) {
                                   info.wire = wire;
                                   where.textContent = '';
                                   where.appendChild(wire.valueOf());
                                 }
                                 return where;
                               }
                             });

                             const createCache = () => ({stack: [], entry: null, wire: null});

                             const outer = (type, Tagger) => {
                               const cache = umap(new WeakMap);
                               const fixed = info => function () {
                                 return unroll(Tagger, info, hole.apply(null, arguments));
                               };
                               hole.for = (ref, id) => {
                                 const memo = cache.get(ref) || cache.set(ref, create$1(null));
                                 return memo[id] || (memo[id] = fixed(createCache()));
                               };
                               hole.node = function () {
                                 return unroll(
                                   Tagger,
                                   createCache(),
                                   hole.apply(null, arguments)
                                 ).valueOf();
                               };
                               return hole;
                               function hole() {
                                 return new LighterHole(type, tta.apply(null, arguments));
                               }
                             };

                             const unroll = (Tagger, info, {type, template, values}) => {
                               const {length} = values;
                               unrollValues(Tagger, info, values, length);
                               let {entry} = info;
                               if (!entry || (entry.template !== template || entry.type !== type)) {
                                 const tag = new Tagger(type);
                                 info.entry = (entry = {
                                   type,
                                   template,
                                   tag,
                                   wire: persistent(tag(template, ...values))
                                 });
                               }
                               else
                                 entry.tag(template, ...values);
                               return entry.wire;
                             };

                             const unrollValues = (Tagger, {stack}, values, length) => {
                               for (let i = 0; i < length; i++) {
                                 const hole = values[i];
                                 if (hole instanceof Hole)
                                   values[i] = unroll(
                                     Tagger,
                                     stack[i] || (stack[i] = createCache()),
                                     hole
                                   );
                                 else if (isArray(hole))
                                   unrollValues(
                                     Tagger,
                                     stack[i] || (stack[i] = createCache()),
                                     hole,
                                     hole.length
                                   );
                                 else
                                   stack[i] = null;
                               }
                               if (length < stack.length)
                                 stack.splice(length);
                             };

                             freeze(LighterHole);
                             function LighterHole(type, args) {
                               this.type = type;
                               this.template = args.shift();
                               this.values = args;
                             }const Hole = LighterHole;

                             const custom = overrides => {
                               const prototype = create$1(tProto);
                               keys(overrides).forEach(key => {
                                 prototype[key] = overrides[key](
                                   prototype[key] ||
                                   (key === 'convert' ? domsanitizer : String)
                                 );
                               });
                               CustomTagger.prototype = prototype;
                               return createRender(CustomTagger);
                               function CustomTagger() {
                                 return Tagger.apply(this, arguments);
                               }
                             };

                             const {render, html, svg: svg$1} = createRender(Tagger);

                             var compat = typeof cancelAnimationFrame === 'function';
                             var cAF = compat ? cancelAnimationFrame : clearTimeout;
                             var rAF = compat ? requestAnimationFrame : setTimeout;
                             function reraf(limit) {
                               var force, timer, callback, self, args;
                               reset();
                               return function reschedule(_callback, _self, _args) {
                                 callback = _callback;
                                 self = _self;
                                 args = _args;
                                 if (!timer)
                                   timer = rAF(invoke);
                                 if (--force < 0)
                                   stop(true);
                                 return stop;
                               };
                               function invoke() {
                                 reset();
                                 callback.apply(self, args || []);
                               }
                               function reset() {
                                 force = limit || Infinity;
                                 timer = compat ? 0 : null;
                               }
                               function stop(flush) {
                                 var didStop = !!timer;
                                 if (didStop) {
                                   cAF(timer);
                                   if (flush)
                                     invoke();
                                 }
                                 return didStop;
                               }
                             }

                             /*! (c) Andrea Giammarchi - ISC */

                             let state = null;

                             // main exports
                             const augmentor = fn => {
                               const stack = [];
                               return function hook() {
                                 const prev = state;
                                 const after = [];
                                 state = {
                                   hook, args: arguments,
                                   stack, i: 0, length: stack.length,
                                   after
                                 };
                                 try { return fn.apply(null, arguments); }
                                 finally {
                                   state = prev;
                                   for (let i = 0, {length} = after; i < length; i++)
                                     after[i]();
                                 }
                               }
                             };

                             // useState
                             const updates = umap(new WeakMap);

                             const hookdate = (hook, ctx, args) => { hook.apply(ctx, args); };
                             const defaults = {async: false, always: false};

                             const useState = (value, options) => {
                               const i = state.i++;
                               const {hook, args, stack, length} = state;
                               const {async: asy, always} = (options || defaults);
                               if (i === length)
                                 state.length = stack.push({
                                   $: typeof value === 'function' ? value() : value,
                                   _: asy ? (updates.get(hook) || updates.set(hook, reraf())) : hookdate
                                 });
                               const ref = stack[i];
                               return [ref.$, value => {
                                 const $value = typeof value === 'function' ? value(ref.$) : value;
                                 if (always || (ref.$ !== $value)) {
                                   ref.$ = $value;
                                   ref._(hook, null, args);
                                 }
                               }];
                             };

                             // useReducer
                             const useReducer = (reducer, value, init, options) => {
                               const fn = typeof init === 'function';
                               // avoid `cons [state, update] = ...` Babel destructuring bloat
                               const pair = useState(fn ? init(value) : value, fn ? options : init);
                               return [pair[0], value => {
                                 pair[1](reducer(pair[0], value));
                               }];
                             };

                             // useContext
                             const hooks = new WeakMap;

                             const useContext = context => {
                               const {hook, args} = state;
                               const stack = hooks.get(context);
                               const info = {hook, args};
                               if (!stack.some(update, info))
                                 stack.push(info);
                               return context.value;
                             };

                             function update({hook}) {
                               return hook === this.hook;
                             }

                             // dropEffect, hasEffect, useEffect, useLayoutEffect
                             const effects = new WeakMap;
                             const fx = umap(effects);
                             const stop = () => {};

                             const createEffect = asy => (effect, guards) => {
                               const i = state.i++;
                               const {hook, after, stack, length} = state;
                               if (i < length) {
                                 const info = stack[i];
                                 const {update, values, stop} = info;
                                 if (!guards || guards.some(different, values)) {
                                   info.values = guards;
                                   if (asy)
                                     stop(asy);
                                   const {clean} = info;
                                   if (clean) {
                                     info.clean = null;
                                     clean();
                                   }
                                   const invoke = () => { info.clean = effect(); };
                                   if (asy)
                                     update(invoke);
                                   else
                                     after.push(invoke);
                                 }
                               }
                               else {
                                 const update = asy ? reraf() : stop;
                                 const info = {clean: null, update, values: guards, stop};
                                 state.length = stack.push(info);
                                 (fx.get(hook) || fx.set(hook, [])).push(info);
                                 const invoke = () => { info.clean = effect(); };
                                 if (asy)
                                   info.stop = update(invoke);
                                 else
                                   after.push(invoke);
                               }
                             };

                             const dropEffect = hook => {
                               (effects.get(hook) || []).forEach(info => {
                                 const {clean, stop} = info;
                                 stop();
                                 if (clean) {
                                   info.clean = null;
                                   clean();
                                 }
                               });
                             };

                             const hasEffect = effects.has.bind(effects);

                             const useEffect = createEffect(true);

                             const useLayoutEffect = createEffect(false);

                             // useMemo, useCallback
                             const useMemo = (memo, guards) => {
                               const i = state.i++;
                               const {stack, length} = state;
                               if (i === length)
                                 state.length = stack.push({$: memo(), _: guards});
                               else if (!guards || guards.some(different, stack[i]._))
                                 stack[i] = {$: memo(), _: guards};
                               return stack[i].$;
                             };

                             const useCallback = (fn, guards) => useMemo(() => fn, guards);

                             // useRef
                             const useRef = value => {
                               const i = state.i++;
                               const {stack, length} = state;
                               if (i === length)
                                 state.length = stack.push({current: value});
                               return stack[i];
                             };

                             function different(value, i) {
                               return value !== this[i];
                             }

                             let transpiled = null;
                             // the angry koala check @WebReflection/status/1133757401482584064
                             try { transpiled = new {o(){}}.o; } catch($) {}

                             let extend = Super => class extends Super {};
                             if (transpiled) {
                               const {getPrototypeOf, setPrototypeOf} = Object;
                               const {construct} = typeof Reflect === 'object' ? Reflect : {
                                 construct(Super, args, Target) {
                                   const a = [null];
                                   for (let i = 0; i < args.length; i++)
                                     a.push(args[i]);
                                   const Parent = Super.bind.apply(Super, a);
                                   return setPrototypeOf(new Parent, Target.prototype);
                                 }
                               };
                               extend = function (Super, cutTheMiddleMan) {
                                 function Class() {
                                   return construct(
                                     cutTheMiddleMan ?
                                       getPrototypeOf(Super) :
                                       Super,
                                     arguments,
                                     Class
                                   );
                                 }
                                 setPrototypeOf(Class.prototype, Super.prototype);
                                 return setPrototypeOf(Class, Super);
                               };
                             }

                             const hash = s => {
                               const {length} = s;
                               let t = 0;
                               let i = 0;
                               while (i < length) {
                                 t = ((t << 5) - t) + s.charCodeAt(i++);
                                 t = t & t;
                               }
                               return t.toString(36);
                             };

                             const registry = {
                               map: {},
                               re: null
                             };

                             const regExp = keys => new RegExp(
                               `<(/)?(${keys.join('|')})([^A-Za-z0-9:._-])`,
                               'g'
                             );

                             let tmp = null;
                             const replace = (markup, info) => {
                               const {map, re} = (tmp || info);
                               return markup.replace(re, (_, close, name, after) => {
                                 const {tagName, is, element} = map[name];
                                 return element ?
                                   (close ? `</${is}>` : `<${is}${after}`) :
                                   (close ? `</${tagName}>` : `<${tagName} is="${is}"${after}`);
                               });
                             };

                             const selector = ({tagName, is, element}) =>
                                               element ? is : `${tagName}[is="${is}"]`;

                             const getInfo = () => tmp;
                             const setInfo = info => { tmp = info; };

                             const hooks$1 = {
                               useCallback,
                               useContext,
                               useEffect,
                               useLayoutEffect,
                               useMemo,
                               useReducer,
                               useRef,
                               useState
                             };

                             const {
                               render: lighterRender,
                               html: lighterHTML,
                               svg: lighterSVG
                             } = custom({
                               transform: () => markup => replace(markup, registry)
                             });

                             const secret = '_\uD83D\uDD25';

                             const {defineProperties} = Object;

                             const $html = new WeakMap;
                             const $svg = new WeakMap;
                             const $mappedAttributes = new WeakMap;
                             const ws = new WeakSet$1;

                             const configurable = true;

                             const attributeChangedCallback = 'attributeChangedCallback';
                             const connectedCallback = 'connectedCallback';
                             const disconnectedCallback = `dis${connectedCallback}`;

                             const addInit = (prototype, properties, method) => {
                               if (method in prototype) {
                                 const original = prototype[method];
                                 properties[method] = {
                                   configurable,
                                   value() {
                                     init.call(this);
                                     return original.apply(this, arguments);
                                   }
                                 };
                               }
                               else
                                 properties[method] = {
                                   configurable,
                                   value: init
                                 };
                             };

                             const augmented = Class => {

                               const {prototype} = Class;

                               const events = [];
                               const properties = {
                                 html: {
                                   configurable,
                                   get: getHTML
                                 },
                                 svg: {
                                   configurable,
                                   get: getSVG
                                 }
                               };

                               properties[secret] = {
                                 value: {
                                   events,
                                   info: null
                                 }
                               };

                               if (!('handleEvent' in prototype))
                                 properties.handleEvent = {
                                   configurable,
                                   value: handleEvent
                                 };

                               if ('render' in prototype && prototype.render.length) {
                                 const {oninit} = prototype;
                                 defineProperties(prototype, {
                                   oninit: {
                                     configurable,
                                     value() {
                                       const hook = augmentor(this.render.bind(this, hooks$1));
                                       defineProperties(this, {
                                         render: {
                                           configurable,
                                           value: hook
                                         }
                                       });
                                       this.addEventListener(
                                         'disconnected',
                                         dropEffect.bind(null, hook),
                                         false
                                       );
                                       if (oninit)
                                         oninit.apply(this, arguments);
                                     }
                                   }
                                 });
                               }

                               // setup the init dispatch only if needed
                               // ensure render with an init is triggered after
                               if ('oninit' in prototype) {
                                 events.push('init');
                                 addInit(prototype, properties, 'render');
                               }

                               // ensure all other callbacks are dispatched too
                               addInit(prototype, properties, attributeChangedCallback);
                               addInit(prototype, properties, connectedCallback);
                               addInit(prototype, properties, disconnectedCallback);

                               [
                                 [
                                   attributeChangedCallback,
                                   'onattributechanged',
                                   onattributechanged
                                 ],
                                 [
                                   connectedCallback,
                                   'onconnected',
                                   onconnected
                                 ],
                                 [
                                   disconnectedCallback,
                                   'ondisconnected',
                                   ondisconnected
                                 ],
                                 [
                                   connectedCallback,
                                   'render',
                                   onconnectedrender
                                 ]
                               ].forEach(([ce, he, value]) => {
                                 if (!(ce in prototype) && he in prototype) {
                                   if (he !== 'render')
                                     events.push(he.slice(2));
                                   if (ce in properties) {
                                     const original = properties[ce].value;
                                     properties[ce] = {
                                       configurable,
                                       value() {
                                         original.apply(this, arguments);
                                         return value.apply(this, arguments);
                                       }
                                     };
                                   }
                                   else
                                     properties[ce] = {configurable, value};
                                 }
                               });

                               const booleanAttributes = Class.booleanAttributes || [];
                               booleanAttributes.forEach(name => {
                                 if (!(name in prototype))
                                   properties[name] = {
                                     configurable,
                                     get() { return this.hasAttribute(name); },
                                     set(value) {
                                       if (!value || value === 'false')
                                         this.removeAttribute(name);
                                       else
                                         this.setAttribute(name, value);
                                     }
                                   };
                               });

                               const observedAttributes = Class.observedAttributes || [];
                               observedAttributes.forEach(name => {
                                 if (!(name in prototype))
                                   properties[name] = {
                                     configurable,
                                     get() { return this.getAttribute(name); },
                                     set(value) {
                                       if (value == null)
                                         this.removeAttribute(name);
                                       else
                                         this.setAttribute(name, value);
                                     }
                                   };
                               });

                               const mappedAttributes = Class.mappedAttributes || [];
                               mappedAttributes.forEach(name => {
                                 const _ = new WeakMap;
                                 const listening = ('on' + name) in prototype;
                                 if (listening)
                                   events.push(name);
                                 properties[name] = {
                                   configurable,
                                   get() { return _.get(this); },
                                   set(detail) {
                                     _.set(this, detail);
                                     if (listening) {
                                       const e = evt(name);
                                       e.detail = detail;
                                       if (ws.has(this))
                                         this.dispatchEvent(e);
                                       else {
                                         const dispatch = $mappedAttributes.get(this);
                                         if (dispatch)
                                           dispatch.push(e);
                                         else
                                           $mappedAttributes.set(this, [e]);
                                       }
                                     }
                                   }
                                 };
                               });

                               defineProperties(prototype, properties);

                               const attributes = booleanAttributes.concat(observedAttributes);
                               return attributes.length ?
                                 defineProperties(Class, {
                                   observedAttributes: {
                                     configurable,
                                     get: () => attributes
                                   }
                                 }) :
                                 Class;
                             };

                             const evt = type => new Event$1(type);

                             const html$1 = (...args) => new Hole('html', args);
                             html$1.for = lighterHTML.for;

                             const svg$2 = (...args) => new Hole('svg', args);
                             svg$2.for = lighterSVG.for;

                             const setParsed = (wm, template, {info}) => {
                               const value = (
                                 info ?
                                   replace(template.join(secret), info).split(secret) :
                                   template
                               );
                               wm.set(template, value);
                               return value;
                             };

                             const setWrap = (self, type, wm) => {
                               const fn = wrap(self, type, new WeakMap);
                               wm.set(self, fn);
                               return fn;
                             };

                             const wrap = (self, type, wm) => (tpl, ...values) => {
                               const template = TL(tpl);
                               const local = wm.get(template) ||
                                             setParsed(wm, template, self[secret]);
                               return lighterRender(self, () => type(local, ...values));
                             };

                             function addListener(type) {
                               this.addEventListener(type, this);
                             }

                             function dispatchEvent(event) {
                               this.dispatchEvent(event);
                             }

                             function getHTML() {
                               return $html.get(this) || setWrap(this, html$1, $html);
                             }

                             function getSVG() {
                               return $svg.get(this) || setWrap(this, svg$2, $svg);
                             }

                             function handleEvent(event) {
                               this[`on${event.type}`](event);
                             }

                             function init() {
                               if (!ws.has(this)) {
                                 ws.add(this);
                                 this[secret].events.forEach(addListener, this);
                                 this.dispatchEvent(evt('init'));
                                 const events = $mappedAttributes.get(this);
                                 if (events) {
                                   $mappedAttributes.delete(this);
                                   events.forEach(dispatchEvent, this);
                                 }
                               }
                             }

                             function onattributechanged(attributeName, oldValue, newValue) {
                               const event = evt('attributechanged');
                               event.attributeName = attributeName;
                               event.oldValue = oldValue;
                               event.newValue = newValue;
                               this.dispatchEvent(event);
                             }

                             function onconnected() {
                               this.dispatchEvent(evt('connected'));
                             }

                             function onconnectedrender() {
                               this.render();
                             }

                             function ondisconnected() {
                               this.dispatchEvent(evt('disconnected'));
                             }

                             const {
                               create: create$2,
                               defineProperty,
                               defineProperties: defineProperties$1,
                               getOwnPropertyNames,
                               getOwnPropertySymbols,
                               getOwnPropertyDescriptor,
                               keys: keys$1
                             } = Object;

                             const HTML = {
                               element: HTMLElement
                             };

                             const cc = new WeakMap;
                             const dc = new WeakMap;
                             const oc = new WeakMap;

                             const info = (tagName, is) => ({tagName, is, element: tagName === 'element'});

                             const define = ($, definition) => (
                               typeof $ === 'string' ?
                                 register($, definition, '') :
                                 register($.name, $, '')
                             ).Class;

                             const fromClass = constructor => {
                               const Class = extend(constructor, false);
                               cc.set(constructor, augmented(Class));
                               return Class;
                             };

                             const fromObject = (object, tag) => {
                               const {statics, prototype} = grabInfo(object);
                               const Class = extend(
                                 HTML[tag] || (HTML[tag] = document.createElement(tag).constructor),
                                 false
                               );
                               defineProperties$1(Class.prototype, prototype);
                               defineProperties$1(Class, statics);
                               oc.set(object, augmented(Class));
                               return Class;
                             };

                             const grabInfo = object => {
                               const statics = create$2(null);
                               const prototype = create$2(null);
                               const info = {prototype, statics};
                               getOwnPropertyNames(object).concat(
                                 getOwnPropertySymbols(object)
                               ).forEach(name => {
                                 const descriptor = getOwnPropertyDescriptor(object, name);
                                 descriptor.enumerable = false;
                                 switch (name) {
                                   case 'extends':
                                     name = 'tagName';
                                   case 'contains':
                                   case 'includes':
                                   case 'name':
                                   case 'booleanAttributes':
                                   case 'mappedAttributes':
                                   case 'observedAttributes':
                                   case 'style':
                                   case 'tagName':
                                     statics[name] = descriptor;
                                     break;
                                   default:
                                     prototype[name] = descriptor;
                                 }
                               });
                               return info;
                             };

                             const injectStyle = cssText => {
                               if ((cssText || '').length) {
                                 const style = document.createElement('style');
                                 style.type = 'text/css';
                                 if (style.styleSheet)
                                   style.styleSheet.cssText = cssText;
                                 else
                                   style.appendChild(document.createTextNode(cssText));
                                 const head = document.head || document.querySelector('head');
                                 head.insertBefore(style, head.lastChild);
                               }
                             };

                             const ref$1 = (self, name) => self ?
                               (self[name] || (self[name] = {current: null})) :
                               {current: null};

                             const register = ($, definition, uid) => {
                               const validName = /^([A-Z][A-Za-z0-9_]*)(<([A-Za-z0-9:._-]+)>|:([A-Za-z0-9:._-]+))?$/;
                               if (!validName.test($))
                                 throw 'Invalid name';

                               const {$1: name, $3: asTag, $4: asColon} = RegExp;
                               let tagName = asTag ||
                                             asColon ||
                                             definition.tagName ||
                                             definition.extends ||
                                             'element';

                               const isFragment = tagName === 'fragment';
                               if (isFragment)
                                 tagName = 'element';
                               else if (!/^[A-Za-z0-9:._-]+$/.test(tagName))
                                 throw 'Invalid tag';

                               let hyphenizedName = '';
                               let suffix = '';
                               if (tagName.indexOf('-') < 0) {
                                 hyphenizedName = uhyphen(name) + uid;
                                 if (hyphenizedName.indexOf('-') < 0)
                                   suffix = '-heresy';
                               }
                               else {
                                 hyphenizedName = tagName + uid;
                                 tagName = 'element';
                               }
                               const is = hyphenizedName + suffix;

                               if (customElements.get(is))
                                 throw `Duplicated ${is} definition`;

                               const Class = extend(
                                 typeof definition === 'object' ?
                                   (oc.get(definition) || fromObject(definition, tagName)) :
                                   (cc.get(definition) || fromClass(definition)),
                                 true
                               );

                               const element = tagName === 'element';
                               defineProperty(Class, 'new', {
                                 value: element ?
                                   () => document.createElement(is) :
                                   () => document.createElement(tagName, {is})
                               });
                               defineProperty(Class.prototype, 'is', {value: is});

                               // for some reason the class must be fully defined upfront
                               // or components upgraded from the DOM won't have all details
                               if (uid === '') {
                                 const id = hash(hyphenizedName.toUpperCase());
                                 registry.map[name] = setupIncludes(Class, tagName, is, {id, i: 0});
                                 registry.re = regExp(keys$1(registry.map));
                               }

                               if (isFragment) {
                                 const {render} = Class.prototype;
                                 defineProperty(
                                   Class.prototype,
                                   'render',
                                   {
                                     configurable: true,
                                     value() {
                                       if (render)
                                         render.apply(this, arguments);
                                       if (this.parentNode) {
                                         const {firstChild} = this;
                                         let contents = null;
                                         if (firstChild) {
                                           const range = document.createRange();
                                           range.setStartBefore(firstChild);
                                           range.setEndAfter(this.lastChild);
                                           contents = range.extractContents();
                                           this.parentNode.replaceChild(contents, this);
                                         }
                                       }
                                     }
                                   }
                                 );
                               }

                               const args = [is, Class];
                               if (!element)
                                 args.push({extends: tagName});
                               customElements.define(...args);

                               return {Class, is, name, tagName};
                             };

                             const render$1 = (where, what) => lighterRender(
                               where,
                               typeof what === 'function' ?
                                 what :
                                 (what instanceof Hole ? () => what : runtime(what))
                             );

                             let dcid = Math.random();
                             const runtime = Component => {
                               let Class = dc.get(Component);
                               if (!Class) {
                                 const name = ('Heresy' + ++dcid).replace(/[^He-y0-9]/g, '');
                                 dc.set(Component, Class = define(name, Component));
                               }
                               return () => Class.new();
                             };

                             const setupIncludes = (Class, tagName, is, u) => {
                               const {prototype} = Class;
                               const details = info(tagName, is);
                               const styles = [selector(details)];
                               const includes = Class.includes || Class.contains;
                               if (includes) {
                                 const map = {};
                                 keys$1(includes).forEach($ => {
                                   const uid = `-${u.id}-${u.i++}`;
                                   const {Class, is, name, tagName} = register($, includes[$], uid);
                                   styles.push(selector(map[name] = setupIncludes(Class, tagName, is, u)));
                                 });
                                 const re = regExp(keys$1(map));
                                 const {events} = prototype[secret];
                                 const value = {
                                   events,
                                   info: {map, re}
                                 };
                                 defineProperty(prototype, secret, {value});
                                 if ('render' in prototype) {
                                   const {render} = prototype;
                                   const {info} = value;
                                   defineProperty(prototype, 'render', {
                                     configurable: true,
                                     value() {
                                       const tmp = getInfo();
                                       setInfo(info);
                                       const out = render.apply(this, arguments);
                                       setInfo(tmp);
                                       return out;
                                     }
                                   });
                                 }
                               }
                               if ('style' in Class)
                                 injectStyle(Class.style(...styles));
                               return details;
                             };

                             var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

                             function createCommonjsModule(fn, module) {
                             	return module = { exports: {} }, fn(module, module.exports), module.exports;
                             }

                             var SAM = createCommonjsModule(function (module, exports) {
                             (function (global, factory) {
                                module.exports = factory() ;
                             }(commonjsGlobal, function () {
                               // ISC License (ISC)
                               // Copyright 2019 Jean-Jacques Dubray

                               // Permission to use, copy, modify, and/or distribute this software for any purpose
                               // with or without fee is hereby granted, provided that the above copyright notice
                               // and this permission notice appear in all copies.

                               // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
                               // REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
                               // FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
                               // OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
                               // OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
                               // ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


                               // Optional chaining implementation
                               const O = (val, value = {}) => (val && (typeof val === 'object') ? val : value);
                               const A = (val, value = []) => (val && Array.isArray(val) ? val : value);
                               const S = (val, value = '') => (val && (typeof val === 'string') ? val : value);
                               const N = (val, value = 0) => (Number.isNaN(val) ? value : val);
                               const NZ = (val, value = 1) => (val === 0 || Number.isNaN(val) ? value === 0 ? 1 : value : val);
                               const F = (f, f0 = () => null) => (f || f0);

                               // Util functions often used in SAM implementations
                               const first = (arr = []) => arr[0];
                               const or = (acc, current) => acc || current;
                               const and = (acc, current) => acc && current;
                               const match = (conditions, values) => first(conditions.map((condition, index) => (condition ? values[index] : null)).filter(e));
                               const step = () => ({});
                               const doNotRender = model => () => model.continue() === true;
                               const wrap = (s, w) => m => s(w(m));
                               const log = f => (...args) => {
                                 console.log(args);
                                 f(...args);
                               };
                               const e = value => (Array.isArray(value)
                                 ? value.map(e).reduce(and, true)
                                 : value === true || (value !== null && value !== undefined));

                               const i = (value, element) => {
                                 switch (typeof value) {
                                   case 'string': return typeof element === 'string' && value.includes(element)
                                   case 'object': return Array.isArray(value)
                                     ? value.includes(element)
                                     : typeof element === 'string' && e(value[element])
                                 }
                                 return value === element
                               };

                               const E = (value, element) => (e(value) && e(element)
                                 ? i(value, element)
                                 : e(value));

                               const oneOf = (value, f, guard = true) => {
                                 e(value) && guard && f(value);
                                 return mon(e(value))
                               };

                               const on = (value, f, guard = true) => {
                                 e(value) && guard && f(value);
                                 return { on }
                               };

                               const mon = (triggered = true) => ({
                                 oneOf: triggered ? () => mon() : oneOf
                               });

                               const clone = (state) => {
                                 const comps = state.__components;
                                 delete state.__components;
                                 const cln = JSON.parse(JSON.stringify(state));
                                 if (comps) {
                                   cln.__components = [];
                                   if (comps.length > 0) {
                                     comps.forEach((c) => {
                                       delete c.parent;
                                       cln.__components.push(Object.assign(clone(c), { parent: cln }));
                                     });
                                   }
                                 }
                                 return cln
                               };

                               class History {
                                 constructor(h = [], options = {}) {
                                   this.currentIndex = 0;
                                   this.history = h;
                                   this.max = options.max;
                                 }

                                 snap(state, index) {
                                   const snapshot = clone(state);
                                   if (index) {
                                     this.history[index] = snapshot;
                                   } else {
                                     this.history.push(snapshot);
                                     if (this.max && this.history.length > this.max) {
                                       this.history.shift();
                                     }
                                   }
                                   return state
                                 }

                                 travel(index = 0) {
                                   this.currentIndex = index;
                                   return this.history[index]
                                 }

                                 next() {
                                   return this.history[this.currentIndex++]
                                 }

                                 hasNext() {
                                   return E(this.history[this.currentIndex])
                                 }

                                 last() {
                                   this.currentIndex = this.history.length - 1;
                                   return this.history[this.currentIndex]
                                 }
                               }

                               const handlers = {};

                               var events = {
                                 on: (event, handler) => {
                                   if (!E(handlers[event])) {
                                     handlers[event] = [];
                                   }
                                   handlers[event].push(handler);
                                 },

                                 off: (event, handler) => {
                                   A(handlers[event]).forEach((h, i) => {
                                     if (h === handler) {
                                       handlers[event].splice(i, 1);
                                     }
                                   });
                                 },

                                 emit: (events = [], data) => {
                                   if (Array.isArray(events)) {
                                     events.forEach(event => A(handlers[event]).forEach(f => f(data)));
                                   } else {
                                     A(handlers[events]).forEach(f => f(data));
                                   }
                                 }
                               };

                               class Model {
                                 constructor(name) {
                                   this.__components = {};
                                   this.__behavior = [];
                                   this.__name = name;
                                   this.__lastProposalTimestamp = 0;
                                   this.__allowedActions = [];
                                   this.__eventQueue = [];
                                 }

                                 localState(name) {
                                   return E(name) ? this.__components[name] : {}
                                 }

                                 hasError() {
                                   return E(this.__error)
                                 }

                                 error() {
                                   return this.__error || undefined
                                 }

                                 errorMessage() {
                                   return O(this.__error).message
                                 }

                                 clearError() {
                                   return delete this.__error
                                 }

                                 allowedActions() {
                                   return this.__allowedActions
                                 }

                                 clearAllowedActions() {
                                   this.__allowedActions = [];
                                 }

                                 addAllowedActions(a) {
                                   this.__allowedActions.push(a);
                                 }

                                 resetBehavior() {
                                   this.__behavior = [];
                                 }

                                 update(snapshot = {}) {
                                   Object.assign(this, snapshot);
                                 }

                                 setComponentState(component) {
                                   this.__components[component.name] = Object.assign(O(component.localState), { parent: this });
                                   component.localState = component.localState || this.__components[component.name];
                                 }

                                 hasNext(val) {
                                   if (E(val)) {
                                     this.__hasNext = val;
                                   }
                                   return this.__hasNext
                                 }

                                 continue() {
                                   return this.__continue === true
                                 }

                                 renderNextTime() {
                                   delete this.__continue;
                                 }

                                 doNotRender() {
                                   this.__continue = true;
                                 }

                                 setLogger(logger) {
                                   this.__logger = logger;
                                 }

                                 log({
                                   trace, info, warning, error, fatal
                                 }) {
                                   if (this.logger) {
                                     oneOf(trace, this.logger.trace(trace))
                                       .oneOf(info, this.logger.info(info))
                                       .oneOf(warning, this.logger.waring(warning))
                                       .oneOf(error, this.logger.error(warning))
                                       .oneOf(fatal, this.logger.fatal(warning));
                                   }
                                 }

                                 prepareEvent(event, data) {
                                   this.__eventQueue.push([event, data]);
                                 }

                                 resetEventQueue() {
                                   this.__eventQueue = [];
                                 }

                                 flush() {
                                   if (this.continue() === false) {
                                     A(this.__eventQueue).forEach(([event, data]) => events.emit(event, data));
                                     this.__eventQueue = [];
                                   }
                                 }

                                 clone(state = this) {
                                   const comps = state.__components;
                                   delete state.__components;
                                   const cln = JSON.parse(JSON.stringify(state));
                                   if (comps) {
                                     cln.__components = {};

                                     Object.keys(comps).forEach((key) => {
                                       const c = comps[key];
                                       delete c.parent;
                                       cln.__components[key] = Object.assign(this.clone(c), { parent: cln });
                                     });
                                   }
                                   return cln
                                 }

                                 state(name, clone) {
                                   const prop = n => (E(this[n]) ? this[n] : (E(this.__components[n]) ? this.__components[n] : this));
                                   let state;
                                   if (Array.isArray(name)) {
                                     state = name.map(n => prop(n));
                                   } else {
                                     state = prop(name);
                                   }
                                   return clone && state ? this.clone(state) : state
                                 }
                               }

                               // ISC License (ISC)

                               // This is an implementation of SAM using SAM's own principles
                               // - SAM's internal model
                               // - SAM's internal acceptors
                               // - SAM's present function

                               // eslint-disable-next-line arrow-body-style
                               const stringify = (s, pretty) => {
                                 return (pretty ? JSON.stringify(s, null, 4) : JSON.stringify(s))
                               };

                               const display = (json = {}, pretty = false) => {
                                 const keys = Object.keys(json);
                                 return `${keys.map((key) => {
    if (typeof key !== 'string') {
      return ''
    }
    return key.indexOf('__') === 0 ? '' : stringify(json[key], pretty)
  }).filter(val => val !== '').join(', ')
  }`
                               };

                               const react = r => r();
                               const accept = proposal => async a => a(proposal);


                               function createInstance (options = {}) {
                                 const { max } = O(options.timetravel);
                                 const {
                                   hasAsyncActions = true,
                                   instanceName = 'global',
                                   synchronize = false,
                                   clone = false,
                                   requestStateRepresentation
                                 } = options;
                                 const { synchronizeInterval = 5 } = O(synchronize);

                                 // SAM's internal model
                                 let history;
                                 const model = new Model(instanceName);
                                 const mount = (arr = [], elements = [], operand = model) => elements.map(el => arr.push(el(operand)));
                                 let intents;
                                 const acceptors = [
                                   ({ __error }) => {
                                     if (__error) {
                                       if (__error.stack.indexOf('AssertionError') < 0) {
                                         model.__error = __error;
                                       } else {
                                         console.log('--------------------------------------');
                                         console.log(__error);
                                       }
                                     }
                                   }
                                 ];
                                 const reactors = [
                                   () => {
                                     model.hasNext(history ? history.hasNext() : false);
                                   }
                                 ];
                                 const naps = [];

                                 // ancillary
                                 let renderView = m => m.flush();
                                 let _render = m => m.flush();
                                 let storeRenderView = _render;

                                 // State Representation
                                 const state = () => {
                                   try {
                                     // Compute state representation
                                     reactors.forEach(react);

                                     // render state representation (gated by nap)
                                     if (!naps.map(react).reduce(or, false)) {
                                       renderView(clone ? model.clone() : model);
                                     }
                                     model.renderNextTime();
                                   } catch (err) {
                                     if (err.stack.indexOf('AssertionError') < 0) {
                                       setTimeout(() => present({ __error: err }), 0);
                                     } else {
                                       throw err
                                     }
                                   }
                                 };

                                 const storeBehavior = (proposal) => {
                                   if (E(proposal.__name)) {
                                     const actionName = proposal.__name;
                                     delete proposal.__name;
                                     const behavior = model.__formatBehavior
                                       ? model.__formatBehavior(actionName, proposal, model)
                                       : `${actionName}(${display(proposal)}) ==> ${display(model)}`;
                                     model.__behavior.push(behavior);
                                   }
                                 };

                                 const checkForOutOfOrder = (proposal) => {
                                   if (proposal.__startTime) {
                                     if (proposal.__startTime <= model.__lastProposalTimestamp) {
                                       return false
                                     }
                                     proposal.__startTime = model.__lastProposalTimestamp;
                                   }
                                   return true
                                 };

                                 const queue = {
                                   _queue: [],
                                   _rendering: false,
                                   add(args) {
                                     this._queue.push(args);
                                   },

                                   synchronize(present) {
                                     const self = this;
                                     this._interval = setInterval(async () => {
                                       if (!self._rendering && self._queue.length > 0) {
                                         self._rendering = true;
                                         const [proposal] = self._queue.slice(0, 1);
                                         self._queue.shift();
                                         proposal.__rendering = self._rendering;
                                         await present(...proposal);
                                         self._rendering = false;
                                       }
                                     }, synchronizeInterval);

                                     return (...args) => queue.add(args)
                                   },

                                   clear() {
                                     clearInterval(this._interval);
                                   }
                                 };

                                 let present = synchronize ? async (proposal, resolve) => {
                                   if (checkForOutOfOrder(proposal)) {
                                     model.resetEventQueue();
                                     // accept proposal
                                     await Promise.all(acceptors.map(await accept(proposal)));

                                     storeBehavior(proposal);

                                     // Continue to state representation
                                     state();
                                     resolve && resolve();
                                   }
                                 } : (proposal, resolve) => {
                                   if (checkForOutOfOrder(proposal)) {
                                     // accept proposal
                                     acceptors.forEach(accept(proposal));

                                     storeBehavior(proposal);

                                     // Continue to state representation
                                     state();
                                     resolve && resolve();
                                   }
                                 };

                                 if (synchronize) {
                                   present = queue.synchronize(present);
                                 }

                                 // SAM's internal acceptors
                                 const addInitialState = (initialState = {}) => {
                                   model.update(initialState);
                                   if (history) {
                                     history.snap(model, 0);
                                   }
                                   model.resetBehavior();
                                 };

                                 // eslint-disable-next-line no-shadow
                                 const rollback = (conditions = []) => conditions.map(condition => model => () => {
                                   const isNotSafe = condition.expression(model);
                                   if (isNotSafe) {
                                     model.log({ error: { name: condition.name, model } });
                                     // rollback if history is present
                                     if (history) {
                                       model.update(history.last());
                                       renderView(model);
                                     }
                                     return true
                                   }
                                   return false
                                 });

                                 const isAllowed = action => model.allowedActions().length === 0
                                                          || model.allowedActions().map(a => a === action).reduce(or, false);
                                 const acceptLocalState = (component) => {
                                   if (E(component.name)) {
                                     model.setComponentState(component);
                                   }
                                 };

                                 // add one component at a time, returns array of intents from actions
                                 const addComponent = (component = {}) => {
                                   const { ignoreOutdatedProposals = false, debounce = 0, retry } = component.options || {};

                                   if (retry) {
                                     retry.max = NZ(retry.max);
                                     retry.delay = N(retry.delay);
                                   }

                                   const debounceDelay = debounce;

                                   // Add component's private state
                                   acceptLocalState(component);

                                   // Decorate actions to present proposal to the model
                                   if (hasAsyncActions) {
                                     intents = A(component.actions).map((action) => {
                                       let needsDebounce = false;
                                       let retryCount = 0;

                                       const intent = async (...args) => {
                                         const startTime = new Date().getTime();

                                         if (isAllowed(action)) {
                                           if (debounceDelay > 0 && needsDebounce) {
                                             needsDebounce = !O(args[0]).__resetDebounce;
                                             return
                                           }

                                           let proposal = {};
                                           try {
                                             proposal = await action(...args);
                                           } catch (err) {
                                             if (retry) {
                                               retryCount += 1;
                                               if (retryCount < retry.max) {
                                                 setTimeout(() => intent(...args), retry.delay);
                                               }
                                               return
                                             }
                                             if (err.stack.indexOf('AssertionError') < 0) {
                                               proposal.__error = err;
                                             } else {
                                               throw err
                                             }
                                           }

                                           if (ignoreOutdatedProposals) {
                                             proposal.__startTime = startTime;
                                           }

                                           try {
                                             present(proposal);
                                             retryCount = 0;
                                           } catch (err) {
                                             // uncaught exception in an acceptor
                                             if (err.stack.indexOf('AssertionError') < 0) {
                                               present({ __error: err });
                                             } else {
                                               throw err
                                             }
                                           }

                                           if (debounceDelay > 0) {
                                             needsDebounce = true;
                                             setTimeout(() => intent({ __resetDebounce: true }), debounceDelay);
                                           }
                                         }
                                       };
                                       return intent
                                     });
                                   } else {
                                     intents = A(component.actions).map(action => (...args) => {
                                       try {
                                         const proposal = action(...args);
                                         present(proposal);
                                       } catch (err) {
                                         if (err.stack.indexOf('AssertionError') < 0) {
                                           present({ __error: err });
                                         } else {
                                           throw err
                                         }
                                       }
                                     });
                                   }

                                   // Add component's acceptors,  reactors, naps and safety condition to SAM instance
                                   mount(acceptors, component.acceptors, component.localState);
                                   mount(reactors, component.reactors, component.localState);
                                   mount(naps, rollback(component.safety), component.localState);
                                   mount(naps, component.naps, component.localState);
                                 };

                                 const setRender = (render) => {
                                   const flushEventsAndRender = (m) => {
                                     m.flush && m.flush();
                                     render && render(m);
                                   };
                                   renderView = history ? wrap(flushEventsAndRender, s => (history ? history.snap(s) : s)) : flushEventsAndRender;
                                   _render = render;
                                 };

                                 const setLogger = (l) => {
                                   model.setLogger(l);
                                 };

                                 const setHistory = (h) => {
                                   history = new History(h, { max });
                                   model.hasNext(history.hasNext());
                                   model.resetBehavior();
                                   renderView = wrap(_render, s => (history ? history.snap(s) : s));
                                 };

                                 const timetravel = (travel = {}) => {
                                   let travelTo = {};
                                   if (E(history)) {
                                     if (travel.reset) {
                                       travel.index = 0;
                                       model.__behavior = [];
                                     }
                                     if (travel.next) {
                                       travelTo = history.next();
                                     } else if (travel.endOfTime) {
                                       travelTo = history.last();
                                     } else {
                                       travelTo = history.travel(travel.index);
                                     }
                                   }
                                   renderView(Object.assign(model, travelTo));
                                 };

                                 const setCheck = ({ begin = {}, end }) => {
                                   const { render } = begin;
                                   if (E(render)) {
                                     storeRenderView = renderView;
                                     renderView = render;
                                   }

                                   if (E(end)) {
                                     renderView = storeRenderView;
                                   }
                                 };

                                 const allowedActions = ({ actions = [], clear = false }) => {
                                   if (actions.length > 0) {
                                     model.addAllowedActions(actions);
                                   } else if (clear) {
                                     model.clearAllowedActions();
                                   }
                                   return model.allowedActions()
                                 };

                                 const addEventHandler = ([event, handler]) => events.on(event, handler);

                                 // SAM's internal present function
                                 return ({
                                   // eslint-disable-next-line no-shadow
                                   initialState, component, render, history, travel, logger, check, allowed, clearInterval, event
                                 }) => {
                                   intents = [];

                                   on(history, setHistory)
                                     .on(initialState, addInitialState)
                                     .on(component, addComponent)
                                     .on(render, setRender)
                                     .on(travel, timetravel)
                                     .on(logger, setLogger)
                                     .on(check, setCheck)
                                     .on(allowed, allowedActions)
                                     .on(clearInterval, () => queue.clear())
                                     .on(event, addEventHandler);

                                   return {
                                     hasNext: model.hasNext(),
                                     hasError: model.hasError(),
                                     errorMessage: model.errorMessage(),
                                     error: model.error(),
                                     intents,
                                     state: name => model.state(name, clone)
                                   }
                                 }
                               }

                               // ISC License (ISC)

                               const SAM = createInstance();

                               // ISC License (ISC)

                               // A set of methods to use the SAM pattern
                               var api = (SAM$1 = SAM) => ({
                                 // Core SAM API
                                 addInitialState: initialState => SAM$1({ initialState }),
                                 addComponent: component => SAM$1({ component }),
                                 setRender: (render) => {
                                   if (Array.isArray(render)) {
                                     const [display, representation] = render;
                                     render = state => display(typeof representation === 'function' ? representation(state) : state);
                                   }
                                   SAM$1({ render: F(render) });
                                 },
                                 addHandler: (event, handler) => SAM$1({ event: [event, handler] }),
                                 getIntents: actions => SAM$1({ component: { actions } }),
                                 addAcceptors: (acceptors, privateModel) => SAM$1({ component: { acceptors, privateModel } }),
                                 addReactors: (reactors, privateModel) => SAM$1({ component: { reactors, privateModel } }),
                                 addNAPs: (naps, privateModel) => SAM$1({ component: { naps, privateModel } }),
                                 addSafetyConditions: (safety, privateModel) => SAM$1({ component: { safety, privateModel } }),
                                 hasError: () => SAM$1({}).hasError,
                                 allow: actions => SAM$1({ allowed: { actions } }),
                                 clearAllowedActions: () => SAM$1({ allowed: { clear: true } }),
                                 allowedActions: () => SAM$1({ allowed: {} }),

                                 // Time Travel
                                 addTimeTraveler: (history = []) => SAM$1({ history }),
                                 travel: (index = 0) => SAM$1({ travel: { index } }),
                                 next: () => SAM$1({ travel: { next: true } }),
                                 last: () => SAM$1({ travel: { endOfTime: true } }),
                                 hasNext: () => SAM$1({}).hasNext,
                                 reset: initialState => (initialState ? SAM$1({ initialState }) : SAM$1({ travel: { reset: true } })),

                                 // Checker
                                 beginCheck: render => SAM$1({ check: { begin: { render } } }),
                                 endCheck: () => SAM$1({ check: { end: true } })
                               });

                               const permutations = (arr, perms, currentDepth, depthMax, noDuplicateAction, doNotStartWith) => {
                                 const nextLevel = [];
                                 if (perms.length === 0) {
                                   arr.forEach((i) => {
                                     if (doNotStartWith.length > 0) {
                                       const canAdd = doNotStartWith.map(name => i.name !== name).reduce(and, true);
                                       canAdd && nextLevel.push([i]);
                                     } else {
                                       nextLevel.push([i]);
                                     }
                                   });
                                 } else {
                                   perms.forEach(p => arr.forEach((i) => {
                                     const col = p.concat([i]);
                                     if (noDuplicateAction) {
                                       if (p[p.length - 1] !== i) {
                                         nextLevel.push(col);
                                       }
                                     } else {
                                       nextLevel.push(col);
                                     }
                                   }));
                                 }
                                 currentDepth++;
                                 if (currentDepth < depthMax) {
                                   return permutations(arr, nextLevel, currentDepth, depthMax, noDuplicateAction, doNotStartWith)
                                 }
                                 return nextLevel.filter(run => run.length === depthMax)
                               };

                               const prepareValuePermutations = (permutation) => {
                                 const indexMax = permutation.map(intent => A(O(intent).values).length);

                                 const modMax = indexMax.map((val, index) => {
                                   let out = 1;
                                   for (let j = index; j < indexMax.length; j++) {
                                     out *= indexMax[j];
                                   }
                                   return out
                                 });

                                 const increment = currentIndex => modMax.map(
                                   (m, index) => {
                                     if (index === modMax.length - 1) {
                                       return currentIndex % indexMax[index]
                                     }
                                     return Math.floor(currentIndex / modMax[index + 1]) % indexMax[index]
                                   }
                                 );

                                 const kmax = indexMax.reduce((acc, val) => acc * val, 1);
                                 if (kmax === 0) {
                                   throw new Error(['Checker: invalid dataset, one of the intents values has no value.',
                                     'If an intent has no parameter, add an empty array to its values'].join('\n'))
                                 }

                                 return { increment, kmax }
                               };

                               const apply = (perms = [], resetState, setBehavior) => {
                                 perms.forEach((permutation) => {
                                   let k = 0;
                                   const { increment, kmax } = prepareValuePermutations(permutation);
                                   do {
                                     // Process a permutation for all possible values
                                     const currentValueIndex = increment(k++);
                                     const currentValues = permutation.map((i, forIntent) => i.values[currentValueIndex[forIntent]]);
                                     // return to initial state
                                     resetState();
                                     setBehavior([]);

                                     // apply behavior (intent(...values))
                                     permutation.forEach((i, forIntent) => i.intent(...currentValues[forIntent]));
                                   } while (k < kmax)
                                 });
                               };


                               const checker = ({
                                 instance, initialState = {}, intents = [], reset, liveness, safety, options
                               }, success = () => null, err = () => null) => {
                                 const { beginCheck, endCheck } = api(instance);
                                 const {
                                   depthMax = 5, noDuplicateAction = false, doNotStartWith = [], format
                                 } = options;

                                 const [behaviorIntent, formatIntent] = instance({
                                   component: {
                                     actions: [
                                       __behavior => ({ __behavior }),
                                       __setFormatBehavior => ({ __setFormatBehavior })
                                     ],
                                     acceptors: [
                                       model => ({ __behavior }) => {
                                         if (E(__behavior)) {
                                           model.__behavior = __behavior;
                                         }
                                       },
                                       model => ({ __setFormatBehavior }) => {
                                         if (E(__setFormatBehavior)) {
                                           model.__formatBehavior = __setFormatBehavior;
                                         }
                                       }
                                     ]
                                   }
                                 }).intents;

                                 formatIntent(format);

                                 const behavior = [];

                                 beginCheck((state) => {
                                   if (liveness && liveness(state)) {
                                     // console.log('check check', state)
                                     behavior.push({ liveness: state.__behavior });
                                     success(state.__behavior);
                                   }
                                   if (safety && safety(state)) {
                                     behavior.push({ safety: state.__behavior });
                                     err(state.__behavior);
                                   }
                                 });
                                 apply(
                                   permutations(intents, [], 0, depthMax, noDuplicateAction, doNotStartWith),
                                   () => reset(initialState),
                                   behaviorIntent);
                                 endCheck();
                                 return behavior
                               };

                               // ISC License (ISC)

                               const {
                                 addInitialState, addComponent, setRender, addSafetyConditions,
                                 getIntents, addAcceptors, addReactors, addNAPs
                               } = api();

                               var index = {
                                 // Constructors
                                 SAM,
                                 createInstance,
                                 api,

                                 // SAM Core
                                 addInitialState,
                                 addComponent,
                                 addAcceptors,
                                 addReactors,
                                 addNAPs,
                                 addSafetyConditions,
                                 getIntents,
                                 setRender,

                                 // Utils
                                 step,
                                 doNotRender,
                                 first,
                                 match,
                                 on,
                                 oneOf,
                                 utils: {
                                   O, A, N, NZ, S, F, E, or, and, log
                                 },
                                 events: {
                                   on: events.on,
                                   off: events.off,
                                   emit: events.emit
                                 },
                                 checker
                               };

                               return index;

                             }));
                             });
                             var SAM_1 = SAM.createInstance;
                             var SAM_2 = SAM.api;
                             var SAM_3 = SAM.doNotRender;
                             var SAM_4 = SAM.addInitialState;
                             var SAM_5 = SAM.addComponent;
                             var SAM_6 = SAM.setRender;
                             var SAM_7 = SAM.SAM;
                             var SAM_8 = SAM.step;

                             const Header = {
                               extends: "nav",

                               mappedAttributes: ["data"],
                               ondata() { this.render(); },

                               oninit() {
                                 this.classList.add("navbar", "navbar-light");
                               },

                               _renderNavItem(navItem) {
                                 return html$1`
      <li class="nav-item">
        <a class="nav-link" href="${navItem.hash}">${navItem.name}</a>
      </li>
    `;
                               },

                               render() {
                                 this.html`
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          ${this.data.map(navItem => this._renderNavItem(navItem))}
        </ul>
      </div>
    `;
                               }
                             };

                             const SignIn = {
                               extends: "div",

                               oninit() {
                                 this.classList.add("auth-page");

                                 this.emailField = ref$1();
                                 this.passwordField = ref$1();
                               },

                               onclick(evt) {
                                 evt.preventDefault();

                                 console.log(this.emailField.current.value);
                                 console.log(this.passwordField.current.value);

                                 this.intents.signin(this.emailField.current.value, this.passwordField.current.value);
                               },

                               render() {
                                 this.html`
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <a href="#/register">Don't have an account?</a>
            </p>

            <ul class="error-messages">
              <li>That email is already taken</li>
            </ul>

            <form>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" ref=${this.emailField}>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password" ref=${this.passwordField}>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" onclick=${this}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
                               }
                             };

                             const SignUp = {
                               extends: "div",

                               oninit() {
                                 this.classList.add("auth-page");
                               },

                               render() {
                                 this.html`
      <div class="container page">
        <div class="row">

          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign up</h1>
            <p class="text-xs-center">
              <a href="">Have an account?</a>
            </p>

            <ul class="error-messages">
              <li>That email is already taken</li>
            </ul>

            <form>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
                               }
                             };

                             const Home = {
                               extends: "div",

                               oninit() {
                                 this.classList.add("home-page");
                               },

                               render() {
                                 this.html`
      <div class="home-page">

        <div class="banner">
          <div class="container">
            <h1 class="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div class="container page">
          <div class="row">

            <div class="col-md-9">
              <div class="feed-toggle">
                <ul class="nav nav-pills outline-active">
                  <li class="nav-item">
                    <a class="nav-link disabled" href="">Your Feed</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" href="">Global Feed</a>
                  </li>
                </ul>
              </div>

              <div class="article-preview">
                <div class="article-meta">
                  <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                  <div class="info">
                    <a href="" class="author">Eric Simons</a>
                    <span class="date">January 20th</span>
                  </div>
                  <button class="btn btn-outline-primary btn-sm pull-xs-right">
                    <i class="ion-heart"></i> 29
                  </button>
                </div>
                <a href="" class="preview-link">
                  <h1>How to build webapps that scale</h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                </a>
              </div>

              <div class="article-preview">
                <div class="article-meta">
                  <a href="profile.html"><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
                  <div class="info">
                    <a href="" class="author">Albert Pai</a>
                    <span class="date">January 20th</span>
                  </div>
                  <button class="btn btn-outline-primary btn-sm pull-xs-right">
                    <i class="ion-heart"></i> 32
                  </button>
                </div>
                <a href="" class="preview-link">
                  <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
                  <p>This is the description for the post.</p>
                  <span>Read more...</span>
                </a>
              </div>

            </div>

            <div class="col-md-3">
              <div class="sidebar">
                <p>Popular Tags</p>

                <div class="tag-list">
                  <a href="" class="tag-pill tag-default">programming</a>
                  <a href="" class="tag-pill tag-default">javascript</a>
                  <a href="" class="tag-pill tag-default">emberjs</a>
                  <a href="" class="tag-pill tag-default">angularjs</a>
                  <a href="" class="tag-pill tag-default">react</a>
                  <a href="" class="tag-pill tag-default">mean</a>
                  <a href="" class="tag-pill tag-default">node</a>
                  <a href="" class="tag-pill tag-default">rails</a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
                               }
                             };

                             const Footer = {
                               extends: "footer",

                               render() {
                                 this.html`
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    `;
                               }
                             };

                             const Conduit = {
                               extends: "div",
                               includes: {
                                 Header,
                                 Home,
                                 SignIn,
                                 SignUp,
                                 Footer
                               },

                               mappedAttributes: ["state"],
                               onstate() { this.render(); },

                               getPage(hash) {
                                 switch(hash) {
                                   case "#/login":
                                     return html$1`<SignIn .intents=${this.intents}/>`;
                                   case "#/register":
                                     return html$1`<SignUp />`;
                                   default:
                                     return html$1`<Home />`;
                                 }
                               },

                               isAuthorized(user) {
                                 return user && user.token;
                               },

                               render() {
                                 const { currentHash } = this.state.header;
                                 const { user } = this.state;
                                 let navItems;

                                 if (this.isAuthorized(user)) {
                                   navItems = this.state.getAuthorizedNav();
                                 } else {
                                   navItems = this.state.getUnauthorizedNav();
                                 }


                                 this.html`
      <Header .data=${navItems}/>
      ${this.getPage(currentHash)}
      <Footer />
    `;
                               }
                             };

                             var initialState = {
                               header: {
                                 title: 'Conduit',
                                 welcomeMessage: 'A place to share your knowledge.',

                                 nav: {
                                   home: {
                                     name: 'Home',
                                     hash: '#/home'
                                   },
                                   signin: {
                                     name: 'Sign In',
                                     hash: '#/login'
                                   },
                                   singup: {
                                     name: 'Sign Up',
                                     hash: '#/register'
                                   },
                                   settings: {
                                     name: 'Settings',
                                     hash: '#/settings'
                                   },
                                   editor: {
                                     name: 'New Article',
                                     hash: '#/editor'
                                   }
                                 }
                               },

                               getUnauthorizedNav() {
                                 return [
                                   this.header.nav.home,
                                   this.header.nav.signin,
                                   this.header.nav.singup
                                 ];
                               },

                               getAuthorizedNav() {
                                 return [
                                   this.header.nav.home,
                                   this.header.nav.settings,
                                   this.header.nav.editor,
                                   this.header.nav.authorized
                                 ]
                               }
                             };

                             const changePageAction = () => ({ hash: location.hash });

                             var setupRouter = (samApi, intents = {}) => {
                               const [changePage] = samApi.getIntents([ changePageAction ]).intents;

                               intents.changePage = changePage;

                               window.onhashchange = intents.changePage;
                             };

                             const API_ENDPOINT = "https://conduit.productionready.io/api";

                             const resolver = (response) => response.ok ? response.json() : Promise.reject(response);

                             var Api = {
                               login(user) {
                                 const body = {
                                   user
                                 };

                                 return fetch(`${API_ENDPOINT}/users/login`, {
                                   method: "POST",
                                   body: JSON.stringify(body),
                                   headers: {
                                     "Content-Type": "application/json"
                                   }
                                 }).then(resolver);
                               }
                             };

                             const signinAction = (email, password) => ({ authorizing: true, email, password });

                             const apiLoginAction = user => {
                               return Api.login(user).then((user) => ({ authorized: true, user }));
                             };

                             // NAPs
                             const nap = (model) => () => {
                               if (model.authorizing) {
                                 window.intents.apiLogin({
                                   email: model.email,
                                   password: model.password
                                 });

                                 return true;
                               }

                               return false;
                             };

                             var setupSignInAction = (samApi, intents = {}) => {
                               const [ signin, apiLogin ] = samApi.getIntents([ signinAction, apiLoginAction ]).intents;

                               samApi.addNAPs([ nap ]);

                               intents.signin = signin;
                               intents.apiLogin = apiLogin;
                             };

                             var header = {
                               acceptors: [
                                 model => proposal => {
                                   const { hash } = proposal;

                                   if (hash && model.header.currentHash != hash) {
                                     model.header.currentHash = hash;
                                   }

                                   return model;
                                 }
                               ]
                             };

                             var signin = {
                               acceptors: [
                                 model => proposal => {
                                   const { authorizing, authorized, user, email, password } = proposal;

                                   if (authorizing) {
                                     model.authorizing = true;
                                     model.email = email;
                                     model.password = password;
                                   }

                                   if (authorized) {
                                     model.authorizing = false;
                                     model.email = null;
                                     model.password = null;

                                     model.user = user.user;
                                     model.header.nav["authorized"] = {
                                       name: model.user.username,
                                       hash: "#/profile"
                                     };
                                   }

                                   return model;
                                 }
                               ]
                             };

                             const renderer = (state) => {
                               render$1(document.body, html$1`<Conduit .state=${state} .intents=${window.intents}/>`);
                             };

                             // define Conduit component
                             define("Conduit", Conduit);

                             window.intents = window.intents || {};

                             // setup SAM
                             const samApi = SAM_2(SAM_1());
                             samApi.addInitialState(initialState);

                             setupRouter(samApi, intents);
                             setupSignInAction(samApi, intents);

                             samApi.addComponent(header);
                             samApi.addComponent(signin);

                             const [startApplication] = samApi.getIntents([ SAM_8 ]).intents;

                             samApi.setRender(renderer);
                             startApplication();

}());
