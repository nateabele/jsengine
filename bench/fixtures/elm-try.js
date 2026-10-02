(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.eO.co === region.fA.co)
	{
		return 'on line ' + region.eO.co;
	}
	return 'on lines ' + region.eO.co + ' through ' + region.fA.co;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ja,
		impl.k9,
		impl.kJ,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $author$project$Try$Got = $elm$core$Basics$identity;
var $elm$core$Basics$True = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.A) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.E),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.E);
		} else {
			var treeLen = builder.A * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.F) : builder.F;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.A);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.E) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.E);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{F: nodeList, A: (len / $elm$core$Array$branchFactor) | 0, E: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $author$project$Typesystem$Types$TEmpty = {$: 10};
var $elm$core$String$length = _String_length;
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Typesystem$Env$nameOf = F2(
	function (env, id) {
		return A2(
			$elm$core$Maybe$withDefault,
			id,
			A2($elm$core$Dict$get, id, env.gs));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Try$Pretty$axisName = F2(
	function (env, id) {
		var strip = function (segment) {
			var bare = A3($elm$core$String$replace, '#', '', segment);
			var hashes = A2(
				$elm$core$String$repeat,
				$elm$core$String$length(segment) - $elm$core$String$length(bare),
				'#');
			return _Utils_ap(
				A2($author$project$Typesystem$Env$nameOf, env, bare),
				hashes);
		};
		var _v0 = A2($elm$core$String$split, ':', id);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var prefix = _v0.a;
			var _v1 = _v0.b;
			var rest = _v1.a;
			return prefix + (':' + A2(
				$elm$core$String$join,
				'/',
				A2(
					$elm$core$List$map,
					strip,
					A2($elm$core$String$split, '/', rest))));
		} else {
			return A2(
				$elm$core$String$join,
				'/',
				A2(
					$elm$core$List$map,
					strip,
					A2($elm$core$String$split, '/', id)));
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$round = _Basics_round;
var $author$project$Try$Pretty$showNumber = function (n) {
	return ($elm$core$Basics$abs(n) < 1.0e9) ? $elm$core$String$fromFloat(
		$elm$core$Basics$round(n * 1000000) / 1000000) : $elm$core$String$fromFloat(n);
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Typesystem$Wire$Date$civilFromDays = function (days) {
	var z = days + 719468;
	var era = ((z - A2($elm$core$Basics$modBy, 146097, z)) / 146097) | 0;
	var doe = z - (era * 146097);
	var yoe = ((((doe - ((doe / 1460) | 0)) + ((doe / 36524) | 0)) - ((doe / 146096) | 0)) / 365) | 0;
	var doy = doe - (((365 * yoe) + ((yoe / 4) | 0)) - ((yoe / 100) | 0));
	var mp = (((5 * doy) + 2) / 153) | 0;
	var month = (mp < 10) ? (mp + 3) : (mp - 9);
	var year = (yoe + (era * 400)) + ((month <= 2) ? 1 : 0);
	var day = (doy - ((((153 * mp) + 2) / 5) | 0)) + 1;
	return _Utils_Tuple3(year, month, day);
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$Typesystem$Wire$Date$toIso = function (days) {
	var _v0 = $author$project$Typesystem$Wire$Date$civilFromDays(days);
	var year = _v0.a;
	var month = _v0.b;
	var day = _v0.c;
	var yearText = ((year >= 0) && (year <= 9999)) ? A3(
		$elm$core$String$padLeft,
		4,
		'0',
		$elm$core$String$fromInt(year)) : _Utils_ap(
		(year < 0) ? '-' : '+',
		A3(
			$elm$core$String$padLeft,
			6,
			'0',
			$elm$core$String$fromInt(
				$elm$core$Basics$abs(year))));
	return yearText + ('-' + (A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(month)) + ('-' + A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(day)))));
};
var $author$project$Try$Pretty$showValue = F2(
	function (env, value) {
		switch (value.$) {
			case 0:
				var n = value.a;
				return $author$project$Try$Pretty$showNumber(n);
			case 1:
				var s = value.a;
				return '\"' + (s + '\"');
			case 2:
				var b = value.a;
				return b ? 'true' : 'false';
			case 3:
				var days = value.a;
				return $author$project$Typesystem$Wire$Date$toIso(days);
			case 8:
				return '∅';
			case 4:
				var fields = value.a;
				return '{' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var v = _v1.b;
							return A2($author$project$Typesystem$Env$nameOf, env, k) + (': ' + A2($author$project$Try$Pretty$showValue, env, v));
						},
						$elm$core$Dict$toList(fields))) + '}');
			case 6:
				var items = value.a;
				return '[' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						$author$project$Try$Pretty$showValue(env),
						items)) + ']');
			case 7:
				var entries = value.a;
				return '{' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v2) {
							var k = _v2.a;
							var v = _v2.b;
							return A2($author$project$Try$Pretty$showValue, env, k) + (': ' + A2($author$project$Try$Pretty$showValue, env, v));
						},
						entries)) + '}');
			default:
				var tag = value.a;
				var payload = value.b;
				return _Utils_ap(
					tag,
					A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function (p) {
								return '(' + (A2($author$project$Try$Pretty$showValue, env, p) + ')');
							},
							payload)));
		}
	});
var $author$project$Try$Pretty$showType = F2(
	function (env, _var) {
		var isShorthand = function (members) {
			return ($elm$core$List$length(members) === 2) && A2($elm$core$List$member, $author$project$Typesystem$Types$TEmpty, members);
		};
		var axisLabel = function (axis) {
			if (!axis.$) {
				var id = axis.a;
				return A2($author$project$Try$Pretty$axisName, env, id);
			} else {
				var v = axis.a;
				return _var(v);
			}
		};
		var atom = function (t) {
			switch (t.$) {
				case 6:
					var members = t.a;
					return isShorthand(members) ? go(t) : ('(' + (go(t) + ')'));
				case 7:
					return '(' + (go(t) + ')');
				case 8:
					return '(' + (go(t) + ')');
				default:
					return go(t);
			}
		};
		var go = function (t) {
			switch (t.$) {
				case 0:
					return 'Number';
				case 1:
					return 'Text';
				case 2:
					return 'Bool';
				case 3:
					return 'Date';
				case 10:
					return 'Empty';
				case 11:
					var v = t.a;
					return A2($author$project$Try$Pretty$showValue, env, v);
				case 9:
					var v = t.a;
					return _var(v);
				case 4:
					var fields = t.a;
					return '{' + (A2(
						$elm$core$String$join,
						', ',
						A2(
							$elm$core$List$map,
							function (_v1) {
								var k = _v1.a;
								var v = _v1.b;
								return A2($author$project$Typesystem$Env$nameOf, env, k) + (': ' + go(v));
							},
							$elm$core$Dict$toList(fields))) + '}');
				case 5:
					var id = t.a;
					var args = t.b;
					return _Utils_ap(
						A2($author$project$Typesystem$Env$nameOf, env, id),
						$elm$core$List$isEmpty(args) ? '' : ('[' + (A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, go, args)) + ']')));
				case 6:
					var members = t.a;
					var _v2 = A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq($author$project$Typesystem$Types$TEmpty),
						members);
					if (_v2.b && (!_v2.b.b)) {
						var single = _v2.a;
						return isShorthand(members) ? (atom(single) + '?') : A2(
							$elm$core$String$join,
							' | ',
							A2($elm$core$List$map, go, members));
					} else {
						return A2(
							$elm$core$String$join,
							' | ',
							A2($elm$core$List$map, go, members));
					}
				case 7:
					var params = t.a;
					var result = t.b;
					return '(' + (A2(
						$elm$core$String$join,
						', ',
						A2(
							$elm$core$List$map,
							function (_v3) {
								var k = _v3.a;
								var v = _v3.b;
								return A2($author$project$Typesystem$Env$nameOf, env, k) + (': ' + go(v));
							},
							$elm$core$Dict$toList(params))) + (') -> ' + go(result)));
				default:
					if (!t.a.$) {
						var _v4 = t.a;
						var axis = t.b;
						var inner = t.c;
						return 'List<' + (axisLabel(axis) + ('> ' + atom(inner)));
					} else {
						var key = t.a.a;
						var axis = t.b;
						var inner = t.c;
						return 'Dict<' + (axisLabel(axis) + ('> ' + (atom(key) + (' ' + atom(inner)))));
					}
			}
		};
		return go;
	});
var $author$project$Try$sizeOf = function (value) {
	switch (value.$) {
		case 6:
			var items = value.a;
			return $elm$core$String$fromInt(
				$elm$core$List$length(items)) + ' rows';
		case 7:
			var entries = value.a;
			return $elm$core$String$fromInt(
				$elm$core$List$length(entries)) + ' entries';
		default:
			return 'scalar or record';
	}
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Try$tableJson = F2(
	function (model, table) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(table.jD)),
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string(
						A3($author$project$Try$Pretty$showType, model.aB, $elm$core$Basics$never, table.dy))),
					_Utils_Tuple2(
					'size',
					$elm$json$Json$Encode$string(
						$author$project$Try$sizeOf(table.hp)))
				]));
	});
var $author$project$Try$loadedReply = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ok',
				$elm$json$Json$Encode$bool(true)),
				_Utils_Tuple2(
				'tables',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$Try$tableJson(model),
					model.bU))
			]));
};
var $author$project$Try$dataReply = $author$project$Try$loadedReply;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Try$failure = function (message) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ok',
				$elm$json$Json$Encode$bool(false)),
				_Utils_Tuple2(
				'error',
				$elm$json$Json$Encode$string(message))
			]));
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Try$adapt = F2(
	function (ground, json) {
		if (ground.$ === 8) {
			if (ground.a.$ === 1) {
				var inner = ground.c;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$value),
					json);
				if (!_v1.$) {
					var pairs = _v1.a;
					return A2(
						$elm$json$Json$Encode$list,
						$elm$core$Basics$identity,
						A2(
							$elm$core$List$map,
							function (_v2) {
								var k = _v2.a;
								var v = _v2.b;
								return A2(
									$elm$json$Json$Encode$list,
									$elm$core$Basics$identity,
									_List_fromArray(
										[
											$elm$json$Json$Encode$string(k),
											A2($author$project$Try$adapt, inner, v)
										]));
							},
							pairs));
				} else {
					return json;
				}
			} else {
				var _v3 = ground.a;
				var inner = ground.c;
				var _v4 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($elm$json$Json$Decode$value),
					json);
				if (!_v4.$) {
					var items = _v4.a;
					return A2(
						$elm$json$Json$Encode$list,
						$author$project$Try$adapt(inner),
						items);
				} else {
					return json;
				}
			}
		} else {
			return json;
		}
	});
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Typesystem$Value$VList = function (a) {
	return {$: 6, a: a};
};
var $author$project$Typesystem$Value$VRecord = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Value$VVariant = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Typesystem$Value$VDict = function (a) {
	return {$: 7, a: a};
};
var $author$project$Typesystem$Value$VText = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Semantics$boolRank = function (b) {
	return b ? 1 : 0;
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Typesystem$Semantics$codepoints = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$toList,
	$elm$core$List$map($elm$core$Char$toCode));
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $author$project$Typesystem$Semantics$compareFloat = F2(
	function (x, y) {
		var _v0 = _Utils_Tuple2(
			$elm$core$Basics$isNaN(x),
			$elm$core$Basics$isNaN(y));
		if (_v0.a) {
			if (_v0.b) {
				return 1;
			} else {
				return 2;
			}
		} else {
			if (_v0.b) {
				return 0;
			} else {
				return A2($elm$core$Basics$compare, x, y);
			}
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Typesystem$Semantics$rank = function (v) {
	switch (v.$) {
		case 2:
			return 0;
		case 0:
			return 1;
		case 3:
			return 2;
		case 1:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		case 7:
			return 7;
		default:
			return 8;
	}
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Typesystem$Semantics$compare = F2(
	function (a, b) {
		var _v4 = _Utils_Tuple2(a, b);
		_v4$8:
		while (true) {
			switch (_v4.a.$) {
				case 0:
					if (!_v4.b.$) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2($author$project$Typesystem$Semantics$compareFloat, x, y);
					} else {
						break _v4$8;
					}
				case 1:
					if (_v4.b.$ === 1) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2(
							$elm$core$Basics$compare,
							$author$project$Typesystem$Semantics$codepoints(x),
							$author$project$Typesystem$Semantics$codepoints(y));
					} else {
						break _v4$8;
					}
				case 2:
					if (_v4.b.$ === 2) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2(
							$elm$core$Basics$compare,
							$author$project$Typesystem$Semantics$boolRank(x),
							$author$project$Typesystem$Semantics$boolRank(y));
					} else {
						break _v4$8;
					}
				case 3:
					if (_v4.b.$ === 3) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2($elm$core$Basics$compare, x, y);
					} else {
						break _v4$8;
					}
				case 6:
					if (_v4.b.$ === 6) {
						var xs = _v4.a.a;
						var ys = _v4.b.a;
						return A2($author$project$Typesystem$Semantics$compareLists, xs, ys);
					} else {
						break _v4$8;
					}
				case 7:
					if (_v4.b.$ === 7) {
						var xs = _v4.a.a;
						var ys = _v4.b.a;
						return A2(
							$author$project$Typesystem$Semantics$compareLists,
							A2(
								$elm$core$List$concatMap,
								function (_v5) {
									var k = _v5.a;
									var v = _v5.b;
									return _List_fromArray(
										[k, v]);
								},
								xs),
							A2(
								$elm$core$List$concatMap,
								function (_v6) {
									var k = _v6.a;
									var v = _v6.b;
									return _List_fromArray(
										[k, v]);
								},
								ys));
					} else {
						break _v4$8;
					}
				case 4:
					if (_v4.b.$ === 4) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2(
							$author$project$Typesystem$Semantics$compareLists,
							A2(
								$elm$core$List$concatMap,
								function (_v7) {
									var k = _v7.a;
									var v = _v7.b;
									return _List_fromArray(
										[
											$author$project$Typesystem$Value$VText(k),
											v
										]);
								},
								$elm$core$Dict$toList(x)),
							A2(
								$elm$core$List$concatMap,
								function (_v8) {
									var k = _v8.a;
									var v = _v8.b;
									return _List_fromArray(
										[
											$author$project$Typesystem$Value$VText(k),
											v
										]);
								},
								$elm$core$Dict$toList(y)));
					} else {
						break _v4$8;
					}
				case 5:
					if (_v4.b.$ === 5) {
						var _v9 = _v4.a;
						var t1 = _v9.a;
						var p1 = _v9.b;
						var _v10 = _v4.b;
						var t2 = _v10.a;
						var p2 = _v10.b;
						var _v11 = A2($elm$core$Basics$compare, t1, t2);
						if (_v11 === 1) {
							return A2(
								$author$project$Typesystem$Semantics$compareLists,
								A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									A2($elm$core$Maybe$map, $elm$core$List$singleton, p1)),
								A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									A2($elm$core$Maybe$map, $elm$core$List$singleton, p2)));
						} else {
							var o = _v11;
							return o;
						}
					} else {
						break _v4$8;
					}
				default:
					break _v4$8;
			}
		}
		return A2(
			$elm$core$Basics$compare,
			$author$project$Typesystem$Semantics$rank(a),
			$author$project$Typesystem$Semantics$rank(b));
	});
var $author$project$Typesystem$Semantics$compareLists = F2(
	function (xs, ys) {
		compareLists:
		while (true) {
			var _v0 = _Utils_Tuple2(xs, ys);
			if (!_v0.a.b) {
				if (!_v0.b.b) {
					return 1;
				} else {
					return 0;
				}
			} else {
				if (!_v0.b.b) {
					return 2;
				} else {
					var _v1 = _v0.a;
					var x = _v1.a;
					var xr = _v1.b;
					var _v2 = _v0.b;
					var y = _v2.a;
					var yr = _v2.b;
					var _v3 = A2($author$project$Typesystem$Semantics$compare, x, y);
					if (_v3 === 1) {
						var $temp$xs = xr,
							$temp$ys = yr;
						xs = $temp$xs;
						ys = $temp$ys;
						continue compareLists;
					} else {
						var o = _v3;
						return o;
					}
				}
			}
		}
	});
var $author$project$Typesystem$Semantics$equal = F2(
	function (a, b) {
		return A2($author$project$Typesystem$Semantics$compare, a, b) === 1;
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Typesystem$Semantics$dictFromList = function (entries) {
	return $author$project$Typesystem$Value$VDict(
		A2(
			$elm$core$List$sortWith,
			F2(
				function (_v2, _v3) {
					var k1 = _v2.a;
					var k2 = _v3.a;
					return A2($author$project$Typesystem$Semantics$compare, k1, k2);
				}),
			A3(
				$elm$core$List$foldl,
				F2(
					function (_v0, acc) {
						var k = _v0.a;
						var v = _v0.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(k, v),
							A2(
								$elm$core$List$filter,
								function (_v1) {
									var k2 = _v1.a;
									return !A2($author$project$Typesystem$Semantics$equal, k, k2);
								},
								acc));
					}),
				_List_Nil,
				entries)));
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Try$canonical = function (value) {
	switch (value.$) {
		case 7:
			var entries = value.a;
			return $author$project$Typesystem$Semantics$dictFromList(
				A2(
					$elm$core$List$map,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						return _Utils_Tuple2(
							$author$project$Try$canonical(k),
							$author$project$Try$canonical(v));
					},
					entries));
		case 6:
			var items = value.a;
			return $author$project$Typesystem$Value$VList(
				A2($elm$core$List$map, $author$project$Try$canonical, items));
		case 4:
			var fields = value.a;
			return $author$project$Typesystem$Value$VRecord(
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v2, v) {
							return $author$project$Try$canonical(v);
						}),
					fields));
		case 5:
			var tag = value.a;
			var payload = value.b;
			return A2(
				$author$project$Typesystem$Value$VVariant,
				tag,
				A2($elm$core$Maybe$map, $author$project$Try$canonical, payload));
		default:
			return value;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Typesystem$Types$TBool = {$: 2};
var $author$project$Typesystem$Types$TDate = {$: 3};
var $author$project$Typesystem$Types$TNumber = {$: 0};
var $author$project$Typesystem$Types$TText = {$: 1};
var $author$project$Typesystem$Value$VEmpty = {$: 8};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Typesystem$Semantics$canonicalDict = function (entries) {
	var sorted = A2(
		$elm$core$List$sortWith,
		F2(
			function (_v2, _v3) {
				var k1 = _v2.a;
				var k2 = _v3.a;
				return A2($author$project$Typesystem$Semantics$compare, k1, k2);
			}),
		entries);
	var hasDuplicate = A2(
		$elm$core$List$any,
		$elm$core$Basics$identity,
		A3(
			$elm$core$List$map2,
			F2(
				function (_v0, _v1) {
					var k1 = _v0.a;
					var k2 = _v1.a;
					return A2($author$project$Typesystem$Semantics$equal, k1, k2);
				}),
			sorted,
			A2($elm$core$List$drop, 1, sorted)));
	return hasDuplicate ? $elm$core$Result$Err('a dict has a duplicate key') : $elm$core$Result$Ok(
		$author$project$Typesystem$Value$VDict(sorted));
};
var $author$project$Typesystem$Value$VBool = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Value$VDate = function (a) {
	return {$: 3, a: a};
};
var $author$project$Typesystem$Value$VNumber = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Wire$Codec$Codec = $elm$core$Basics$identity;
var $author$project$Typesystem$Wire$Codec$SBool = {$: 3};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Typesystem$Wire$Codec$bool = {c: $elm$json$Json$Decode$bool, d: $elm$json$Json$Encode$bool, e: $author$project$Typesystem$Wire$Codec$SBool};
var $author$project$Typesystem$Wire$Codec$STagged = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Typesystem$Wire$Codec$lookup = F2(
	function (key, pairs) {
		lookup:
		while (true) {
			if (!pairs.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v1 = pairs.a;
				var k = _v1.a;
				var v = _v1.b;
				var rest = pairs.b;
				if (_Utils_eq(k, key)) {
					return $elm$core$Maybe$Just(v);
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue lookup;
				}
			}
		}
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Typesystem$Wire$Codec$buildCustom = function (_v0) {
	var cc = _v0;
	return {
		c: A2(
			$elm$json$Json$Decode$andThen,
			function (tag) {
				var _v1 = A2($author$project$Typesystem$Wire$Codec$lookup, tag, cc.cS);
				if (!_v1.$) {
					var variantDecoder = _v1.a;
					return variantDecoder;
				} else {
					return $elm$json$Json$Decode$fail('unknown ' + (cc.M + (' \"' + (tag + '\"'))));
				}
			},
			A2($elm$json$Json$Decode$field, cc.M, $elm$json$Json$Decode$string)),
		d: cc.am,
		e: A2($author$project$Typesystem$Wire$Codec$STagged, cc.M, cc.dC)
	};
};
var $author$project$Typesystem$Wire$Value$canonicalizeDict = function (value) {
	if (value.$ === 7) {
		var entries = value.a;
		return $author$project$Typesystem$Semantics$canonicalDict(entries);
	} else {
		return $elm$core$Result$Ok(value);
	}
};
var $author$project$Typesystem$Wire$Codec$SPattern = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Typesystem$Wire$Codec$SString = {$: 0};
var $author$project$Typesystem$Wire$Date$daysFromCivil = F3(
	function (year, month, day) {
		var y = (month <= 2) ? (year - 1) : year;
		var shiftedMonth = (month > 2) ? (month - 3) : (month + 9);
		var era = ((y - A2($elm$core$Basics$modBy, 400, y)) / 400) | 0;
		var yoe = y - (era * 400);
		var doy = (((((153 * shiftedMonth) + 2) / 5) | 0) + day) - 1;
		var doe = (((yoe * 365) + ((yoe / 4) | 0)) - ((yoe / 100) | 0)) + doy;
		return ((era * 146097) + doe) - 719468;
	});
var $author$project$Typesystem$Wire$Date$isLeap = function (year) {
	return ((!A2($elm$core$Basics$modBy, 4, year)) && (!(!A2($elm$core$Basics$modBy, 100, year)))) || (!A2($elm$core$Basics$modBy, 400, year));
};
var $author$project$Typesystem$Wire$Date$daysInMonth = F2(
	function (year, month) {
		switch (month) {
			case 2:
				return $author$project$Typesystem$Wire$Date$isLeap(year) ? 29 : 28;
			case 4:
				return 30;
			case 6:
				return 30;
			case 9:
				return 30;
			case 11:
				return 30;
			default:
				return 31;
		}
	});
var $elm$core$String$toInt = _String_toInt;
var $author$project$Typesystem$Wire$Date$digitsToInt = function (digits) {
	return A2(
		$elm$core$String$all,
		function (c) {
			return (c >= '0') && (c <= '9');
		},
		digits) ? $elm$core$String$toInt(digits) : $elm$core$Maybe$Nothing;
};
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $author$project$Typesystem$Wire$Date$partsOf = function (monthDay) {
	return (($elm$core$String$length(monthDay) === 5) && (A3($elm$core$String$slice, 2, 3, monthDay) === '-')) ? A3(
		$elm$core$Maybe$map2,
		$elm$core$Tuple$pair,
		$author$project$Typesystem$Wire$Date$digitsToInt(
			A2($elm$core$String$left, 2, monthDay)),
		$author$project$Typesystem$Wire$Date$digitsToInt(
			A2($elm$core$String$right, 2, monthDay))) : $elm$core$Maybe$Nothing;
};
var $author$project$Typesystem$Wire$Date$signed = F2(
	function (sign, magnitude) {
		return (sign === '-') ? (-magnitude) : magnitude;
	});
var $author$project$Typesystem$Wire$Date$parseParts = function (text) {
	var malformed = $elm$core$Result$Err('malformed date \"' + (text + '\"'));
	var _v0 = $elm$core$String$uncons(text);
	if (!_v0.$) {
		var _v1 = _v0.a;
		var sign = _v1.a;
		var rest = _v1.b;
		if ((sign === '+') || (sign === '-')) {
			var _v2 = A2($elm$core$String$split, '-', rest);
			if (((_v2.b && _v2.b.b) && _v2.b.b.b) && (!_v2.b.b.b.b)) {
				var yearDigits = _v2.a;
				var _v3 = _v2.b;
				var month = _v3.a;
				var _v4 = _v3.b;
				var day = _v4.a;
				var _v5 = _Utils_Tuple2(
					$author$project$Typesystem$Wire$Date$digitsToInt(yearDigits),
					$author$project$Typesystem$Wire$Date$partsOf(month + ('-' + day)));
				if ((!_v5.a.$) && (!_v5.b.$)) {
					var magnitude = _v5.a.a;
					var _v6 = _v5.b.a;
					var m = _v6.a;
					var d = _v6.b;
					return ($elm$core$String$length(yearDigits) < 6) ? malformed : ((($elm$core$String$length(yearDigits) > 6) && (A2($elm$core$String$left, 1, yearDigits) === '0')) ? $elm$core$Result$Err('non-canonical expanded year in \"' + (text + '\"')) : ((((sign === '+') && (magnitude <= 9999)) || ((sign === '-') && (!magnitude))) ? $elm$core$Result$Err('non-canonical expanded year in \"' + (text + '\"')) : $elm$core$Result$Ok(
						_Utils_Tuple3(
							A2($author$project$Typesystem$Wire$Date$signed, sign, magnitude),
							m,
							d))));
				} else {
					return malformed;
				}
			} else {
				return malformed;
			}
		} else {
			var _v7 = _Utils_Tuple3(
				($elm$core$String$length(text) === 10) && (A3($elm$core$String$slice, 4, 5, text) === '-'),
				$author$project$Typesystem$Wire$Date$digitsToInt(
					A2($elm$core$String$left, 4, text)),
				$author$project$Typesystem$Wire$Date$partsOf(
					A2($elm$core$String$dropLeft, 5, text)));
			if ((_v7.a && (!_v7.b.$)) && (!_v7.c.$)) {
				var year = _v7.b.a;
				var _v8 = _v7.c.a;
				var month = _v8.a;
				var day = _v8.b;
				return $elm$core$Result$Ok(
					_Utils_Tuple3(year, month, day));
			} else {
				return malformed;
			}
		}
	} else {
		return malformed;
	}
};
var $author$project$Typesystem$Wire$Date$fromIso = function (text) {
	return A2(
		$elm$core$Result$andThen,
		function (_v0) {
			var year = _v0.a;
			var month = _v0.b;
			var day = _v0.c;
			return ((month < 1) || (month > 12)) ? $elm$core$Result$Err('invalid month in date \"' + (text + '\"')) : (((day < 1) || (_Utils_cmp(
				day,
				A2($author$project$Typesystem$Wire$Date$daysInMonth, year, month)) > 0)) ? $elm$core$Result$Err('invalid day in date \"' + (text + '\"')) : $elm$core$Result$Ok(
				A3($author$project$Typesystem$Wire$Date$daysFromCivil, year, month, day)));
		},
		$author$project$Typesystem$Wire$Date$parseParts(text));
};
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $author$project$Typesystem$Wire$Date$codec = {
	c: A2(
		$elm$json$Json$Decode$andThen,
		function (s) {
			var _v0 = $author$project$Typesystem$Wire$Date$fromIso(s);
			if (!_v0.$) {
				var days = _v0.a;
				return $elm$json$Json$Decode$succeed(days);
			} else {
				var message = _v0.a;
				return $elm$json$Json$Decode$fail(message);
			}
		},
		$elm$json$Json$Decode$string),
	d: A2($elm$core$Basics$composeR, $author$project$Typesystem$Wire$Date$toIso, $elm$json$Json$Encode$string),
	e: A2($author$project$Typesystem$Wire$Codec$SPattern, '^([0-9]{4}|[+-]([0-9]{6}|[1-9][0-9]{6,}))-[0-9]{2}-[0-9]{2}$', $author$project$Typesystem$Wire$Codec$SString)
};
var $author$project$Typesystem$Wire$Codec$SNumber = {$: 2};
var $author$project$Typesystem$Wire$Codec$SOneOf = function (a) {
	return {$: 14, a: a};
};
var $author$project$Typesystem$Wire$Codec$SStringEnum = function (a) {
	return {$: 7, a: a};
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $author$project$Typesystem$Wire$Number$isNegativeZero = function (x) {
	return (!x) && ((1 / x) < 0);
};
var $author$project$Typesystem$Wire$Number$encode = function (x) {
	return $elm$core$Basics$isNaN(x) ? $elm$json$Json$Encode$string('nan') : ($elm$core$Basics$isInfinite(x) ? $elm$json$Json$Encode$string(
		(x > 0) ? 'inf' : '-inf') : ($author$project$Typesystem$Wire$Number$isNegativeZero(x) ? $elm$json$Json$Encode$string('-0') : $elm$json$Json$Encode$float(x)));
};
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Typesystem$Wire$Number$plainDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (x) {
		return ($elm$core$Basics$isNaN(x) || $elm$core$Basics$isInfinite(x)) ? $elm$json$Json$Decode$fail('number must be finite; use \"nan\", \"inf\" or \"-inf\"') : ($author$project$Typesystem$Wire$Number$isNegativeZero(x) ? $elm$json$Json$Decode$fail('negative zero must be written \"-0\"') : $elm$json$Json$Decode$succeed(x));
	},
	$elm$json$Json$Decode$float);
var $author$project$Typesystem$Wire$Number$specialDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		switch (s) {
			case 'nan':
				return $elm$json$Json$Decode$succeed(0 / 0);
			case 'inf':
				return $elm$json$Json$Decode$succeed(1 / 0);
			case '-inf':
				return $elm$json$Json$Decode$succeed((-1) / 0);
			case '-0':
				return $elm$json$Json$Decode$succeed(-0.0);
			default:
				return $elm$json$Json$Decode$fail('unknown number \"' + (s + '\"'));
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Typesystem$Wire$Number$specials = _List_fromArray(
	['nan', 'inf', '-inf', '-0']);
var $author$project$Typesystem$Wire$Number$codec = {
	c: $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[$author$project$Typesystem$Wire$Number$plainDecoder, $author$project$Typesystem$Wire$Number$specialDecoder])),
	d: $author$project$Typesystem$Wire$Number$encode,
	e: $author$project$Typesystem$Wire$Codec$SOneOf(
		_List_fromArray(
			[
				$author$project$Typesystem$Wire$Codec$SNumber,
				$author$project$Typesystem$Wire$Codec$SStringEnum($author$project$Typesystem$Wire$Number$specials)
			]))
};
var $author$project$Typesystem$Wire$Codec$CustomCodec = $elm$core$Basics$identity;
var $author$project$Typesystem$Wire$Codec$custom = F2(
	function (discriminator, match) {
		return {cS: _List_Nil, M: discriminator, am: match, dC: _List_Nil};
	});
var $author$project$Typesystem$Wire$Codec$SArray = function (a) {
	return {$: 8, a: a};
};
var $author$project$Typesystem$Wire$Codec$list = function (_v0) {
	var c = _v0;
	return {
		c: $elm$json$Json$Decode$list(c.c),
		d: $elm$json$Json$Encode$list(c.d),
		e: $author$project$Typesystem$Wire$Codec$SArray(c.e)
	};
};
var $author$project$Typesystem$Wire$Codec$strictKeys = F2(
	function (allowed, inner) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (pairs) {
				var _v0 = A2(
					$elm$core$List$filter,
					function (_v1) {
						var k = _v1.a;
						return !A2($elm$core$List$member, k, allowed);
					},
					pairs);
				if (!_v0.b) {
					return inner;
				} else {
					var _v2 = _v0.a;
					var k = _v2.a;
					return $elm$json$Json$Decode$fail('unexpected field \"' + (k + '\"'));
				}
			},
			$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$value));
	});
var $author$project$Typesystem$Wire$Codec$addVariant = F5(
	function (name, fields, variantDecoder, next, _v0) {
		var cc = _v0;
		return {
			cS: _Utils_ap(
				cc.cS,
				_List_fromArray(
					[
						_Utils_Tuple2(
						name,
						A2(
							$author$project$Typesystem$Wire$Codec$strictKeys,
							A2(
								$elm$core$List$cons,
								cc.M,
								A2(
									$elm$core$List$map,
									function ($) {
										return $.jD;
									},
									fields)),
							variantDecoder))
					])),
			M: cc.M,
			am: next,
			dC: _Utils_ap(
				cc.dC,
				_List_fromArray(
					[
						_Utils_Tuple2(name, fields)
					]))
		};
	});
var $author$project$Typesystem$Wire$Codec$tagged = F3(
	function (discriminator, name, fields) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					discriminator,
					$elm$json$Json$Encode$string(name)),
				fields));
	});
var $author$project$Typesystem$Wire$Codec$namedVariant0 = F3(
	function (name, value, _v0) {
		var cc = _v0;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_Nil,
			$elm$json$Json$Decode$succeed(value),
			cc.am(
				A3($author$project$Typesystem$Wire$Codec$tagged, cc.M, name, _List_Nil)),
			cc);
	});
var $elm$json$Json$Decode$map = _Json_map1;
var $author$project$Typesystem$Wire$Codec$requiredShape = F2(
	function (name, s) {
		return {jD: name, bR: true, e: s};
	});
var $author$project$Typesystem$Wire$Codec$namedVariant1 = F4(
	function (name, ctor, _v0, _v1) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var cc = _v1;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e)
				]),
			A2(
				$elm$json$Json$Decode$map,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c)),
			cc.am(
				function (a) {
					return A3(
						$author$project$Typesystem$Wire$Codec$tagged,
						cc.M,
						name,
						_List_fromArray(
							[
								_Utils_Tuple2(
								n1,
								c1.d(a))
							]));
				}),
			cc);
	});
var $elm$json$Json$Decode$map2 = _Json_map2;
var $author$project$Typesystem$Wire$Codec$optionalDecoder = F2(
	function (name, inner) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (pairs) {
				return A2(
					$elm$core$List$any,
					function (_v0) {
						var k = _v0.a;
						return _Utils_eq(k, name);
					},
					pairs) ? A2(
					$elm$json$Json$Decode$map,
					$elm$core$Maybe$Just,
					A2($elm$json$Json$Decode$field, name, inner)) : $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing);
			},
			$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$value));
	});
var $author$project$Typesystem$Wire$Codec$namedVariant2Maybe = F5(
	function (name, ctor, _v0, _v1, _v2) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var n2 = _v1.a;
		var c2 = _v1.b;
		var cc = _v2;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e),
					{jD: n2, bR: false, e: c2.e}
				]),
			A3(
				$elm$json$Json$Decode$map2,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c),
				A2($author$project$Typesystem$Wire$Codec$optionalDecoder, n2, c2.c)),
			cc.am(
				F2(
					function (a, mb) {
						return A3(
							$author$project$Typesystem$Wire$Codec$tagged,
							cc.M,
							name,
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									n1,
									c1.d(a)),
								function () {
									if (!mb.$) {
										var b = mb.a;
										return _List_fromArray(
											[
												_Utils_Tuple2(
												n2,
												c2.d(b))
											]);
									} else {
										return _List_Nil;
									}
								}()));
					})),
			cc);
	});
var $author$project$Typesystem$Wire$Codec$STuple = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Wire$Value$liftResult = function (result) {
	if (!result.$) {
		var x = result.a;
		return $elm$json$Json$Decode$succeed(x);
	} else {
		var e = result.a;
		return $elm$json$Json$Decode$fail(
			$elm$json$Json$Decode$errorToString(e));
	}
};
var $author$project$Typesystem$Wire$Value$pair = F2(
	function (_v0, _v1) {
		var a = _v0;
		var b = _v1;
		return {
			c: A2(
				$elm$json$Json$Decode$andThen,
				function (items) {
					if ((items.b && items.b.b) && (!items.b.b.b)) {
						var x = items.a;
						var _v3 = items.b;
						var y = _v3.a;
						return A3(
							$elm$json$Json$Decode$map2,
							$elm$core$Tuple$pair,
							$author$project$Typesystem$Wire$Value$liftResult(
								A2($elm$json$Json$Decode$decodeValue, a.c, x)),
							$author$project$Typesystem$Wire$Value$liftResult(
								A2($elm$json$Json$Decode$decodeValue, b.c, y)));
					} else {
						return $elm$json$Json$Decode$fail('expected a two-element array');
					}
				},
				$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
			d: function (_v4) {
				var x = _v4.a;
				var y = _v4.b;
				return A2(
					$elm$json$Json$Encode$list,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							a.d(x),
							b.d(y)
						]));
			},
			e: $author$project$Typesystem$Wire$Codec$STuple(
				_List_fromArray(
					[a.e, b.e]))
		};
	});
var $author$project$Typesystem$Wire$Codec$SRef = function (a) {
	return {$: 15, a: a};
};
var $author$project$Typesystem$Wire$Codec$decoder = function (_v0) {
	var c = _v0;
	return c.c;
};
var $author$project$Typesystem$Wire$Codec$encoder = function (_v0) {
	var c = _v0;
	return c.d;
};
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
var $author$project$Typesystem$Wire$Codec$ref = F2(
	function (name, thunk) {
		return {
			c: $elm$json$Json$Decode$lazy(
				function (_v0) {
					return $author$project$Typesystem$Wire$Codec$decoder(
						thunk(0));
				}),
			d: function (a) {
				return A2(
					$author$project$Typesystem$Wire$Codec$encoder,
					thunk(0),
					a);
			},
			e: $author$project$Typesystem$Wire$Codec$SRef(name)
		};
	});
var $author$project$Typesystem$Wire$Codec$string = {c: $elm$json$Json$Decode$string, d: $elm$json$Json$Encode$string, e: $author$project$Typesystem$Wire$Codec$SString};
var $author$project$Typesystem$Wire$Codec$validate = F2(
	function (check, _v0) {
		var c = _v0;
		return _Utils_update(
			c,
			{
				c: A2(
					$elm$json$Json$Decode$andThen,
					function (a) {
						var _v1 = check(a);
						if (!_v1.$) {
							var b = _v1.a;
							return $elm$json$Json$Decode$succeed(b);
						} else {
							var message = _v1.a;
							return $elm$json$Json$Decode$fail(message);
						}
					},
					c.c)
			});
	});
var $author$project$Typesystem$Wire$Id$withShape = F2(
	function (s, _v0) {
		var c = _v0;
		return _Utils_update(
			c,
			{e: s});
	});
var $author$project$Typesystem$Wire$Id$checked = F3(
	function (message, ok, pattern) {
		return A2(
			$author$project$Typesystem$Wire$Id$withShape,
			A2($author$project$Typesystem$Wire$Codec$SPattern, pattern, $author$project$Typesystem$Wire$Codec$SString),
			A2(
				$author$project$Typesystem$Wire$Codec$validate,
				function (id) {
					return ok(id) ? $elm$core$Result$Ok(id) : $elm$core$Result$Err(message + (' \"' + (id + '\"')));
				},
				$author$project$Typesystem$Wire$Codec$string));
	});
var $author$project$Typesystem$Id$matches = F2(
	function (allowed, id) {
		return (id !== '') && (A2($elm$core$String$all, allowed, id) && (!A2($elm$core$String$all, $elm$core$Char$isDigit, id)));
	});
var $author$project$Typesystem$Id$isUser = $author$project$Typesystem$Id$matches(
	function (c) {
		return $elm$core$Char$isAlphaNum(c) || ((c === '_') || (c === '-'));
	});
var $author$project$Typesystem$Wire$Id$isUser = $author$project$Typesystem$Id$isUser;
var $author$project$Typesystem$Wire$Id$user = A3($author$project$Typesystem$Wire$Id$checked, 'invalid id', $author$project$Typesystem$Wire$Id$isUser, '^(?!\\d+$)[A-Za-z0-9_-]+$');
var $author$project$Typesystem$Wire$Codec$SKeyedMap = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$Typesystem$Wire$Codec$SMap = function (a) {
	return {$: 10, a: a};
};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Typesystem$Wire$Codec$dict = function (_v0) {
	var c = _v0;
	return {
		c: $elm$json$Json$Decode$dict(c.c),
		d: function (d) {
			return $elm$json$Json$Encode$object(
				A2(
					$elm$core$List$map,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						return _Utils_Tuple2(
							k,
							c.d(v));
					},
					$elm$core$Dict$toList(d)));
		},
		e: $author$project$Typesystem$Wire$Codec$SMap(c.e)
	};
};
var $author$project$Typesystem$Wire$Codec$shape = function (_v0) {
	var c = _v0;
	return c.e;
};
var $author$project$Typesystem$Wire$Id$userDict = function (inner) {
	var _v0 = $author$project$Typesystem$Wire$Codec$dict(inner);
	var c = _v0;
	return _Utils_update(
		c,
		{
			c: A2(
				$elm$json$Json$Decode$andThen,
				function (entries) {
					var _v1 = A2(
						$elm$core$List$filter,
						A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Typesystem$Wire$Id$isUser),
						$elm$core$Dict$keys(entries));
					if (!_v1.b) {
						return $elm$json$Json$Decode$succeed(entries);
					} else {
						var bad = _v1.a;
						return $elm$json$Json$Decode$fail('invalid id \"' + (bad + '\"'));
					}
				},
				c.c),
			e: A2(
				$author$project$Typesystem$Wire$Codec$SKeyedMap,
				'^(?!\\d+$)[A-Za-z0-9_-]+$',
				$author$project$Typesystem$Wire$Codec$shape(inner))
		});
};
function $author$project$Typesystem$Wire$Value$cyclic$body() {
	return A2(
		$author$project$Typesystem$Wire$Codec$validate,
		$author$project$Typesystem$Wire$Value$canonicalizeDict,
		$author$project$Typesystem$Wire$Codec$buildCustom(
			A3(
				$author$project$Typesystem$Wire$Codec$namedVariant0,
				'empty',
				$author$project$Typesystem$Value$VEmpty,
				A4(
					$author$project$Typesystem$Wire$Codec$namedVariant1,
					'dict',
					$author$project$Typesystem$Value$VDict,
					_Utils_Tuple2(
						'entries',
						$author$project$Typesystem$Wire$Codec$list(
							A2(
								$author$project$Typesystem$Wire$Value$pair,
								$author$project$Typesystem$Wire$Value$cyclic$codec(),
								$author$project$Typesystem$Wire$Value$cyclic$codec()))),
					A4(
						$author$project$Typesystem$Wire$Codec$namedVariant1,
						'list',
						$author$project$Typesystem$Value$VList,
						_Utils_Tuple2(
							'items',
							$author$project$Typesystem$Wire$Codec$list(
								$author$project$Typesystem$Wire$Value$cyclic$codec())),
						A5(
							$author$project$Typesystem$Wire$Codec$namedVariant2Maybe,
							'variant',
							$author$project$Typesystem$Value$VVariant,
							_Utils_Tuple2('tag', $author$project$Typesystem$Wire$Id$user),
							_Utils_Tuple2(
								'payload',
								$author$project$Typesystem$Wire$Value$cyclic$codec()),
							A4(
								$author$project$Typesystem$Wire$Codec$namedVariant1,
								'record',
								$author$project$Typesystem$Value$VRecord,
								_Utils_Tuple2(
									'fields',
									$author$project$Typesystem$Wire$Value$cyclic$fieldsCodec()),
								A4(
									$author$project$Typesystem$Wire$Codec$namedVariant1,
									'date',
									$author$project$Typesystem$Value$VDate,
									_Utils_Tuple2('value', $author$project$Typesystem$Wire$Date$codec),
									A4(
										$author$project$Typesystem$Wire$Codec$namedVariant1,
										'bool',
										$author$project$Typesystem$Value$VBool,
										_Utils_Tuple2('value', $author$project$Typesystem$Wire$Codec$bool),
										A4(
											$author$project$Typesystem$Wire$Codec$namedVariant1,
											'text',
											$author$project$Typesystem$Value$VText,
											_Utils_Tuple2('value', $author$project$Typesystem$Wire$Codec$string),
											A4(
												$author$project$Typesystem$Wire$Codec$namedVariant1,
												'number',
												$author$project$Typesystem$Value$VNumber,
												_Utils_Tuple2('value', $author$project$Typesystem$Wire$Number$codec),
												A2(
													$author$project$Typesystem$Wire$Codec$custom,
													'kind',
													function (vNumber) {
														return function (vText) {
															return function (vBool) {
																return function (vDate) {
																	return function (vRecord) {
																		return function (vVariant) {
																			return function (vList) {
																				return function (vDict) {
																					return function (vEmpty) {
																						return function (value) {
																							switch (value.$) {
																								case 0:
																									var x = value.a;
																									return vNumber(x);
																								case 1:
																									var s = value.a;
																									return vText(s);
																								case 2:
																									var b = value.a;
																									return vBool(b);
																								case 3:
																									var days = value.a;
																									return vDate(days);
																								case 4:
																									var fields = value.a;
																									return vRecord(fields);
																								case 5:
																									var tag = value.a;
																									var payload = value.b;
																									return A2(vVariant, tag, payload);
																								case 6:
																									var items = value.a;
																									return vList(items);
																								case 7:
																									var entries = value.a;
																									return vDict(entries);
																								default:
																									return vEmpty;
																							}
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													}))))))))))));
}
function $author$project$Typesystem$Wire$Value$cyclic$fieldsCodec() {
	return $author$project$Typesystem$Wire$Id$userDict(
		$author$project$Typesystem$Wire$Value$cyclic$codec());
}
function $author$project$Typesystem$Wire$Value$cyclic$codec() {
	return A2(
		$author$project$Typesystem$Wire$Codec$ref,
		'Value',
		function (_v0) {
			return $author$project$Typesystem$Wire$Value$cyclic$body();
		});
}
var $author$project$Typesystem$Wire$Value$body = $author$project$Typesystem$Wire$Value$cyclic$body();
$author$project$Typesystem$Wire$Value$cyclic$body = function () {
	return $author$project$Typesystem$Wire$Value$body;
};
var $author$project$Typesystem$Wire$Value$fieldsCodec = $author$project$Typesystem$Wire$Value$cyclic$fieldsCodec();
$author$project$Typesystem$Wire$Value$cyclic$fieldsCodec = function () {
	return $author$project$Typesystem$Wire$Value$fieldsCodec;
};
var $author$project$Typesystem$Wire$Value$codec = $author$project$Typesystem$Wire$Value$cyclic$codec();
$author$project$Typesystem$Wire$Value$cyclic$codec = function () {
	return $author$project$Typesystem$Wire$Value$codec;
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$Typesystem$Wire$Data$isNull = function (json) {
	return _Utils_eq(
		A2(
			$elm$json$Json$Decode$decodeValue,
			$elm$json$Json$Decode$null(0),
			json),
		$elm$core$Result$Ok(0));
};
var $author$project$Typesystem$Wire$Data$decodeNull = function (json) {
	return $author$project$Typesystem$Wire$Data$isNull(json) ? $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty) : $elm$core$Result$Err('expected null');
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $author$project$Typesystem$Wire$Data$decodeWith = F2(
	function (d, json) {
		return A2(
			$elm$core$Result$mapError,
			$elm$json$Json$Decode$errorToString,
			A2($elm$json$Json$Decode$decodeValue, d, json));
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $author$project$Typesystem$Wire$Data$decodeScalar = F2(
	function (type_, json) {
		switch (type_.$) {
			case 0:
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VNumber,
					A2(
						$author$project$Typesystem$Wire$Data$decodeWith,
						$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Number$codec),
						json));
			case 1:
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VText,
					A2($author$project$Typesystem$Wire$Data$decodeWith, $elm$json$Json$Decode$string, json));
			case 2:
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VBool,
					A2($author$project$Typesystem$Wire$Data$decodeWith, $elm$json$Json$Decode$bool, json));
			default:
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VDate,
					A2(
						$author$project$Typesystem$Wire$Data$decodeWith,
						$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Date$codec),
						json));
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Typesystem$Wire$Data$FBool = {$: 2};
var $author$project$Typesystem$Wire$Data$FDate = {$: 3};
var $author$project$Typesystem$Wire$Data$FDict = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$Typesystem$Wire$Data$FEmpty = {$: 4};
var $author$project$Typesystem$Wire$Data$FList = function (a) {
	return {$: 10, a: a};
};
var $author$project$Typesystem$Wire$Data$FLiteral = function (a) {
	return {$: 5, a: a};
};
var $author$project$Typesystem$Wire$Data$FNone = {$: 13};
var $author$project$Typesystem$Wire$Data$FNumber = {$: 0};
var $author$project$Typesystem$Wire$Data$FRecord = function (a) {
	return {$: 8, a: a};
};
var $author$project$Typesystem$Wire$Data$FTagged = {$: 12};
var $author$project$Typesystem$Wire$Data$FText = {$: 1};
var $author$project$Typesystem$Wire$Data$FVariants = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Types$Axis = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Types$DeclRecord = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Types$DeclVariants = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Types$TUnion = function (a) {
	return {$: 6, a: a};
};
var $author$project$Typesystem$Types$DictF = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Types$ListF = {$: 0};
var $author$project$Typesystem$Types$TFn = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Typesystem$Types$TFrame = F3(
	function (a, b, c) {
		return {$: 8, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Types$TLiteral = function (a) {
	return {$: 11, a: a};
};
var $author$project$Typesystem$Types$TNamed = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Typesystem$Types$TRecord = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Types$mapVars = F2(
	function (f, t) {
		var go = $author$project$Typesystem$Types$mapVars(f);
		switch (t.$) {
			case 0:
				return $author$project$Typesystem$Types$TNumber;
			case 1:
				return $author$project$Typesystem$Types$TText;
			case 2:
				return $author$project$Typesystem$Types$TBool;
			case 3:
				return $author$project$Typesystem$Types$TDate;
			case 10:
				return $author$project$Typesystem$Types$TEmpty;
			case 11:
				var v = t.a;
				return $author$project$Typesystem$Types$TLiteral(v);
			case 9:
				var v = t.a;
				return f.k6(v);
			case 4:
				var fields = t.a;
				return $author$project$Typesystem$Types$TRecord(
					A2(
						$elm$core$Dict$map,
						F2(
							function (_v1, x) {
								return go(x);
							}),
						fields));
			case 5:
				var id = t.a;
				var args = t.b;
				return A2(
					$author$project$Typesystem$Types$TNamed,
					id,
					A2($elm$core$List$map, go, args));
			case 6:
				var ts = t.a;
				return $author$project$Typesystem$Types$TUnion(
					A2($elm$core$List$map, go, ts));
			case 7:
				var params = t.a;
				var result = t.b;
				return A2(
					$author$project$Typesystem$Types$TFn,
					A2(
						$elm$core$Dict$map,
						F2(
							function (_v2, x) {
								return go(x);
							}),
						params),
					go(result));
			default:
				var kind = t.a;
				var axis = t.b;
				var inner = t.c;
				return A3(
					$author$project$Typesystem$Types$TFrame,
					function () {
						if (!kind.$) {
							return $author$project$Typesystem$Types$ListF;
						} else {
							var key = kind.a;
							return $author$project$Typesystem$Types$DictF(
								go(key));
						}
					}(),
					function () {
						if (!axis.$) {
							var id = axis.a;
							return $author$project$Typesystem$Types$Axis(id);
						} else {
							var v = axis.a;
							return f.hV(v);
						}
					}(),
					go(inner));
		}
	});
var $author$project$Typesystem$Conforms$declBody = F2(
	function (decl, args) {
		var bindings = $elm$core$Dict$fromList(
			A3($elm$core$List$map2, $elm$core$Tuple$pair, decl.gK, args));
		var ground = $author$project$Typesystem$Types$mapVars(
			{
				hV: function (_v2) {
					return $author$project$Typesystem$Types$Axis('?');
				},
				k6: function (v) {
					return A2(
						$elm$core$Maybe$withDefault,
						$author$project$Typesystem$Types$TUnion(_List_Nil),
						A2($elm$core$Dict$get, v, bindings));
				}
			});
		var _v0 = decl.h1;
		if (!_v0.$) {
			var fields = _v0.a;
			return $author$project$Typesystem$Types$DeclRecord(
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v1, t) {
							return ground(t);
						}),
					fields));
		} else {
			var variants = _v0.a;
			return $author$project$Typesystem$Types$DeclVariants(
				A2(
					$elm$core$List$map,
					function (v) {
						return {
							eC: A2($elm$core$Maybe$map, ground, v.eC),
							kL: v.kL
						};
					},
					variants));
		}
	});
var $author$project$Typesystem$Wire$Data$isScalar = function (v) {
	switch (v.$) {
		case 0:
			return true;
		case 1:
			return true;
		case 2:
			return true;
		case 3:
			return true;
		default:
			return false;
	}
};
var $author$project$Typesystem$Wire$Data$FEnum = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Typesystem$Wire$Data$FNullable = function (a) {
	return {$: 7, a: a};
};
var $author$project$Typesystem$Wire$Data$isUnion = function (t) {
	if (t.$ === 6) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Typesystem$Wire$Data$tagged = $author$project$Typesystem$Wire$Codec$encoder($author$project$Typesystem$Wire$Value$codec);
var $author$project$Typesystem$Wire$Data$scalar = function (value) {
	switch (value.$) {
		case 0:
			var x = value.a;
			return A2($author$project$Typesystem$Wire$Codec$encoder, $author$project$Typesystem$Wire$Number$codec, x);
		case 1:
			var s = value.a;
			return $elm$json$Json$Encode$string(s);
		case 2:
			var b = value.a;
			return $elm$json$Json$Encode$bool(b);
		case 3:
			var days = value.a;
			return A2($author$project$Typesystem$Wire$Codec$encoder, $author$project$Typesystem$Wire$Date$codec, days);
		default:
			return $author$project$Typesystem$Wire$Data$tagged(value);
	}
};
var $author$project$Typesystem$Wire$Data$scalarType = function (value) {
	switch (value.$) {
		case 0:
			return $author$project$Typesystem$Types$TNumber;
		case 2:
			return $author$project$Typesystem$Types$TBool;
		case 3:
			return $author$project$Typesystem$Types$TDate;
		default:
			return $author$project$Typesystem$Types$TText;
	}
};
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Typesystem$Wire$Data$sharesSpelling = function (literals) {
	return A2(
		$elm$core$List$any,
		function (a) {
			return A2(
				$elm$core$List$any,
				function (b) {
					return (!_Utils_eq(a, b)) && A2(
						$elm$core$Result$withDefault,
						false,
						A2(
							$elm$core$Result$map,
							$author$project$Typesystem$Semantics$equal(b),
							A2(
								$author$project$Typesystem$Wire$Data$decodeScalar,
								$author$project$Typesystem$Wire$Data$scalarType(b),
								$author$project$Typesystem$Wire$Data$scalar(a))));
				},
				literals);
		},
		literals);
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Typesystem$Types$baseType = function (value) {
	switch (value.$) {
		case 0:
			return $elm$core$Maybe$Just($author$project$Typesystem$Types$TNumber);
		case 1:
			return $elm$core$Maybe$Just($author$project$Typesystem$Types$TText);
		case 2:
			return $elm$core$Maybe$Just($author$project$Typesystem$Types$TBool);
		case 3:
			return $elm$core$Maybe$Just($author$project$Typesystem$Types$TDate);
		case 8:
			return $elm$core$Maybe$Just($author$project$Typesystem$Types$TEmpty);
		case 4:
			var fields = value.a;
			return A2(
				$elm$core$Maybe$map,
				$author$project$Typesystem$Types$TRecord,
				A3(
					$elm$core$Dict$foldr,
					F3(
						function (k, v, acc) {
							return A3(
								$elm$core$Maybe$map2,
								$elm$core$Dict$insert(k),
								$author$project$Typesystem$Types$baseType(v),
								acc);
						}),
					$elm$core$Maybe$Just($elm$core$Dict$empty),
					fields));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Typesystem$Types$axisToString = F2(
	function (_var, axis) {
		if (!axis.$) {
			var id = axis.a;
			return id;
		} else {
			var n = axis.a;
			return '?' + _var(n);
		}
	});
var $author$project$Typesystem$Semantics$boolText = function (b) {
	return b ? 'true' : 'false';
};
var $author$project$Typesystem$Semantics$floorDiv = F2(
	function (a, b) {
		return (a >= 0) ? ((a / b) | 0) : (-(((((-a) + b) - 1) / b) | 0));
	});
var $author$project$Typesystem$Semantics$dateToText = function (days) {
	var z = days + 719468;
	var era = A2($author$project$Typesystem$Semantics$floorDiv, z, 146097);
	var doe = z - (era * 146097);
	var yoe = ((((doe - ((doe / 1460) | 0)) + ((doe / 36524) | 0)) - ((doe / 146096) | 0)) / 365) | 0;
	var doy = doe - (((365 * yoe) + ((yoe / 4) | 0)) - ((yoe / 100) | 0));
	var mp = (((5 * doy) + 2) / 153) | 0;
	var month = (mp < 10) ? (mp + 3) : (mp - 9);
	var year = (yoe + (era * 400)) + ((month <= 2) ? 1 : 0);
	var day = (doy - ((((153 * mp) + 2) / 5) | 0)) + 1;
	return A3(
		$elm$core$String$padLeft,
		4,
		'0',
		$elm$core$String$fromInt(year)) + ('-' + (A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(month)) + ('-' + A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(day)))));
};
var $author$project$Typesystem$Semantics$isNegativeZero = function (x) {
	return (1 / x) < 0;
};
var $elm$core$String$startsWith = _String_startsWith;
var $author$project$Typesystem$Semantics$dropLeft0 = function (s) {
	dropLeft0:
	while (true) {
		if (A2($elm$core$String$startsWith, '0', s)) {
			var $temp$s = A2($elm$core$String$dropLeft, 1, s);
			s = $temp$s;
			continue dropLeft0;
		} else {
			return s;
		}
	}
};
var $author$project$Typesystem$Semantics$dropPlus = function (s) {
	return A2($elm$core$String$startsWith, '+', s) ? A2($elm$core$String$dropLeft, 1, s) : s;
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$Typesystem$Semantics$dropRight0 = function (s) {
	dropRight0:
	while (true) {
		if (A2($elm$core$String$endsWith, '0', s)) {
			var $temp$s = A2($elm$core$String$dropRight, 1, s);
			s = $temp$s;
			continue dropRight0;
		} else {
			return s;
		}
	}
};
var $author$project$Typesystem$Semantics$decompose = function (x) {
	var _v0 = function () {
		var _v1 = A2(
			$elm$core$String$split,
			'e',
			$elm$core$String$fromFloat(x));
		if ((_v1.b && _v1.b.b) && (!_v1.b.b.b)) {
			var m = _v1.a;
			var _v2 = _v1.b;
			var e = _v2.a;
			return _Utils_Tuple2(
				m,
				A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$String$toInt(
						$author$project$Typesystem$Semantics$dropPlus(e))));
		} else {
			return _Utils_Tuple2(
				$elm$core$String$fromFloat(x),
				0);
		}
	}();
	var mantissa = _v0.a;
	var exponent = _v0.b;
	var _v3 = function () {
		var _v4 = A2($elm$core$String$split, '.', mantissa);
		if ((_v4.b && _v4.b.b) && (!_v4.b.b.b)) {
			var i = _v4.a;
			var _v5 = _v4.b;
			var f = _v5.a;
			return _Utils_Tuple2(i, f);
		} else {
			return _Utils_Tuple2(mantissa, '');
		}
	}();
	var intPart = _v3.a;
	var fracPart = _v3.b;
	var allDigits = _Utils_ap(intPart, fracPart);
	var leadingZeros = $elm$core$String$length(allDigits) - $elm$core$String$length(
		$author$project$Typesystem$Semantics$dropLeft0(allDigits));
	var significant = $author$project$Typesystem$Semantics$dropRight0(
		$author$project$Typesystem$Semantics$dropLeft0(allDigits));
	return _Utils_Tuple2(
		significant,
		($elm$core$String$length(intPart) + exponent) - leadingZeros);
};
var $author$project$Typesystem$Semantics$plain = F2(
	function (digits, pointPos) {
		var len = $elm$core$String$length(digits);
		return (pointPos <= 0) ? ('0.' + (A2($elm$core$String$repeat, -pointPos, '0') + digits)) : ((_Utils_cmp(pointPos, len) > -1) ? (digits + (A2($elm$core$String$repeat, pointPos - len, '0') + '.0')) : (A2($elm$core$String$left, pointPos, digits) + ('.' + A2($elm$core$String$dropLeft, pointPos, digits))));
	});
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $author$project$Typesystem$Semantics$scientific = F2(
	function (digits, exp10) {
		var rest = A2($elm$core$String$dropLeft, 1, digits);
		var mantissa = _Utils_ap(
			A2($elm$core$String$left, 1, digits),
			$elm$core$String$isEmpty(rest) ? '' : ('.' + rest));
		var magnitude = $elm$core$String$fromInt(
			$elm$core$Basics$abs(exp10));
		return mantissa + ('e' + (((exp10 < 0) ? '-' : '+') + A3($elm$core$String$padLeft, 2, '0', magnitude)));
	});
var $author$project$Typesystem$Semantics$positiveToText = function (x) {
	var _v0 = $author$project$Typesystem$Semantics$decompose(x);
	var digits = _v0.a;
	var pointPos = _v0.b;
	return ((x >= 1.0e16) || (x < 1.0e-4)) ? A2($author$project$Typesystem$Semantics$scientific, digits, pointPos - 1) : A2($author$project$Typesystem$Semantics$plain, digits, pointPos);
};
var $author$project$Typesystem$Semantics$numberToText = function (x) {
	return $elm$core$Basics$isNaN(x) ? 'nan' : ($elm$core$Basics$isInfinite(x) ? ((x > 0) ? 'inf' : '-inf') : ((!x) ? ($author$project$Typesystem$Semantics$isNegativeZero(x) ? '-0.0' : '0.0') : ((x < 0) ? ('-' + $author$project$Typesystem$Semantics$positiveToText(
		$elm$core$Basics$abs(x))) : $author$project$Typesystem$Semantics$positiveToText(x))));
};
var $author$project$Typesystem$Semantics$duckText = function (v) {
	switch (v.$) {
		case 0:
			var n = v.a;
			return $author$project$Typesystem$Semantics$numberToText(n);
		case 1:
			var s = v.a;
			return s;
		case 2:
			var b = v.a;
			return $author$project$Typesystem$Semantics$boolText(b);
		case 3:
			var d = v.a;
			return $author$project$Typesystem$Semantics$dateToText(d);
		case 8:
			return 'NULL';
		case 6:
			var items = v.a;
			return '[' + (A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $author$project$Typesystem$Semantics$duckText, items)) + ']');
		case 4:
			var fields = v.a;
			return '{' + (A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (_v1) {
						var k = _v1.a;
						var x = _v1.b;
						return '\'' + (k + ('\': ' + $author$project$Typesystem$Semantics$duckText(x)));
					},
					$elm$core$Dict$toList(fields))) + '}');
		case 7:
			var entries = v.a;
			return '{' + (A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (_v2) {
						var k = _v2.a;
						var x = _v2.b;
						return $author$project$Typesystem$Semantics$duckText(k) + ('=' + $author$project$Typesystem$Semantics$duckText(x));
					},
					entries)) + '}');
		default:
			var tag = v.a;
			var payload = v.b;
			return A2(
				$elm$core$Maybe$withDefault,
				tag,
				A2($elm$core$Maybe$map, $author$project$Typesystem$Semantics$duckText, payload));
	}
};
var $author$project$Typesystem$Semantics$toText = function (v) {
	if (v.$ === 8) {
		return '';
	} else {
		return $author$project$Typesystem$Semantics$duckText(v);
	}
};
var $author$project$Typesystem$Types$valueToString = function (value) {
	switch (value.$) {
		case 1:
			var s = value.a;
			return A2(
				$elm$json$Json$Encode$encode,
				0,
				$elm$json$Json$Encode$string(s));
		case 4:
			var fields = value.a;
			return '{' + (A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						return k + (': ' + $author$project$Typesystem$Types$valueToString(v));
					},
					$elm$core$Dict$toList(fields))) + '}');
		case 5:
			if (value.b.$ === 1) {
				var tag = value.a;
				var _v2 = value.b;
				return tag;
			} else {
				var tag = value.a;
				var payload = value.b.a;
				return tag + ('(' + ($author$project$Typesystem$Types$valueToString(payload) + ')'));
			}
		case 6:
			var items = value.a;
			return '[' + (A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $author$project$Typesystem$Types$valueToString, items)) + ']');
		case 7:
			var entries = value.a;
			return '{' + (A2(
				$elm$core$String$join,
				', ',
				A2(
					$elm$core$List$map,
					function (_v3) {
						var k = _v3.a;
						var v = _v3.b;
						return $author$project$Typesystem$Types$valueToString(k) + (' => ' + $author$project$Typesystem$Types$valueToString(v));
					},
					entries)) + '}');
		case 8:
			return 'Empty';
		default:
			return $author$project$Typesystem$Semantics$toText(value);
	}
};
var $author$project$Typesystem$Types$toStringBy = F2(
	function (_var, t) {
		var go = $author$project$Typesystem$Types$toStringBy(_var);
		switch (t.$) {
			case 0:
				return 'Number';
			case 1:
				return 'Text';
			case 2:
				return 'Bool';
			case 3:
				return 'Date';
			case 10:
				return 'Empty';
			case 11:
				var v = t.a;
				return $author$project$Typesystem$Types$valueToString(v);
			case 9:
				var v = t.a;
				return 't' + _var(v);
			case 4:
				var fields = t.a;
				return '{' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var v = _v1.b;
							return k + (': ' + go(v));
						},
						$elm$core$Dict$toList(fields))) + '}');
			case 5:
				var id = t.a;
				var args = t.b;
				return _Utils_ap(
					id,
					$elm$core$List$isEmpty(args) ? '' : ('[' + (A2(
						$elm$core$String$join,
						', ',
						A2($elm$core$List$map, go, args)) + ']')));
			case 6:
				var ts = t.a;
				return '(' + (A2(
					$elm$core$String$join,
					' | ',
					A2($elm$core$List$map, go, ts)) + ')');
			case 7:
				var params = t.a;
				var result = t.b;
				return '(' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v2) {
							var k = _v2.a;
							var v = _v2.b;
							return k + (': ' + go(v));
						},
						$elm$core$Dict$toList(params))) + (') -> ' + go(result)));
			default:
				if (!t.a.$) {
					var _v3 = t.a;
					var axis = t.b;
					var inner = t.c;
					return 'List[' + (A2($author$project$Typesystem$Types$axisToString, _var, axis) + ('] ' + go(inner)));
				} else {
					var key = t.a.a;
					var axis = t.b;
					var inner = t.c;
					return 'Dict[' + (A2($author$project$Typesystem$Types$axisToString, _var, axis) + ('] ' + (go(key) + (' ' + go(inner)))));
				}
		}
	});
var $author$project$Typesystem$Types$union = function (types) {
	var flat = A2(
		$elm$core$List$concatMap,
		function (t) {
			if (t.$ === 6) {
				var ts = t.a;
				return ts;
			} else {
				return _List_fromArray(
					[t]);
			}
		},
		types);
	var deduped = A3(
		$elm$core$List$foldl,
		F2(
			function (t, acc) {
				return A2($elm$core$List$member, t, acc) ? acc : _Utils_ap(
					acc,
					_List_fromArray(
						[t]));
			}),
		_List_Nil,
		flat);
	var absorbed = A2(
		$elm$core$List$filter,
		function (t) {
			if (t.$ === 11) {
				var v = t.a;
				return !A2(
					$elm$core$List$any,
					function (base) {
						return _Utils_eq(
							$elm$core$Maybe$Just(base),
							$author$project$Typesystem$Types$baseType(v));
					},
					deduped);
			} else {
				return true;
			}
		},
		deduped);
	var _v0 = A2(
		$elm$core$List$sortBy,
		$author$project$Typesystem$Types$toStringBy(
			$elm$core$Basics$always('t')),
		absorbed);
	if (_v0.b && (!_v0.b.b)) {
		var single = _v0.a;
		return single;
	} else {
		var sorted = _v0;
		return $author$project$Typesystem$Types$TUnion(sorted);
	}
};
var $author$project$Typesystem$Types$stripEmpty = function (t) {
	if (t.$ === 6) {
		var ts = t.a;
		return $author$project$Typesystem$Types$union(
			A2(
				$elm$core$List$filter,
				$elm$core$Basics$neq($author$project$Typesystem$Types$TEmpty),
				ts));
	} else {
		return t;
	}
};
var $author$project$Typesystem$Wire$Data$unionForm = F2(
	function (type_, members) {
		var rest = $author$project$Typesystem$Types$stripEmpty(type_);
		var literals = A2(
			$elm$core$List$filterMap,
			function (m) {
				if (m.$ === 11) {
					var v = m.a;
					return $author$project$Typesystem$Wire$Data$isScalar(v) ? $elm$core$Maybe$Just(v) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			A2(
				$elm$core$List$filter,
				$elm$core$Basics$neq($author$project$Typesystem$Types$TEmpty),
				members));
		var hasEmpty = A2($elm$core$List$member, $author$project$Typesystem$Types$TEmpty, members);
		return (hasEmpty && (!$author$project$Typesystem$Wire$Data$isUnion(rest))) ? $author$project$Typesystem$Wire$Data$FNullable(rest) : (((!$elm$core$List$isEmpty(literals)) && (_Utils_eq(
			$elm$core$List$length(literals),
			$elm$core$List$length(members) - (hasEmpty ? 1 : 0)) && (!$author$project$Typesystem$Wire$Data$sharesSpelling(literals)))) ? A2($author$project$Typesystem$Wire$Data$FEnum, literals, hasEmpty) : $author$project$Typesystem$Wire$Data$FTagged);
	});
var $author$project$Typesystem$Wire$Data$form = F2(
	function (env, type_) {
		switch (type_.$) {
			case 0:
				return $author$project$Typesystem$Wire$Data$FNumber;
			case 1:
				return $author$project$Typesystem$Wire$Data$FText;
			case 2:
				return $author$project$Typesystem$Wire$Data$FBool;
			case 3:
				return $author$project$Typesystem$Wire$Data$FDate;
			case 10:
				return $author$project$Typesystem$Wire$Data$FEmpty;
			case 11:
				var v = type_.a;
				return $author$project$Typesystem$Wire$Data$isScalar(v) ? $author$project$Typesystem$Wire$Data$FLiteral(v) : $author$project$Typesystem$Wire$Data$FTagged;
			case 4:
				var fields = type_.a;
				return $author$project$Typesystem$Wire$Data$FRecord(fields);
			case 5:
				var id = type_.a;
				var args = type_.b;
				var _v1 = A2($elm$core$Dict$get, id, env.fv);
				if (!_v1.$) {
					var decl = _v1.a;
					if (!_Utils_eq(
						$elm$core$List$length(args),
						$elm$core$List$length(decl.gK))) {
						return $author$project$Typesystem$Wire$Data$FNone;
					} else {
						var _v2 = A2($author$project$Typesystem$Conforms$declBody, decl, args);
						if (!_v2.$) {
							var fields = _v2.a;
							return $author$project$Typesystem$Wire$Data$FRecord(fields);
						} else {
							var variants = _v2.a;
							return $author$project$Typesystem$Wire$Data$FVariants(variants);
						}
					}
				} else {
					return $author$project$Typesystem$Wire$Data$FNone;
				}
			case 8:
				if (!type_.a.$) {
					var _v3 = type_.a;
					var cell = type_.c;
					return $author$project$Typesystem$Wire$Data$FList(cell);
				} else {
					var key = type_.a.a;
					var cell = type_.c;
					return A2($author$project$Typesystem$Wire$Data$FDict, key, cell);
				}
			case 6:
				var members = type_.a;
				return A2($author$project$Typesystem$Wire$Data$unionForm, type_, members);
			case 7:
				return $author$project$Typesystem$Wire$Data$FNone;
			default:
				var v = type_.a;
				return $elm$core$Basics$never(v);
		}
	});
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $author$project$Typesystem$Types$groundToString = $author$project$Typesystem$Types$toStringBy($elm$core$Basics$never);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $author$project$Typesystem$Wire$Data$nonNullKey = function (key) {
	return _Utils_eq(key, $author$project$Typesystem$Value$VEmpty) ? $elm$core$Result$Err('a dict key cannot be null: no dict key is Empty') : $elm$core$Result$Ok(key);
};
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Typesystem$Wire$Data$traverse = F2(
	function (f, items) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (item, acc) {
					return A3(
						$elm$core$Result$map2,
						$elm$core$List$cons,
						f(item),
						acc);
				}),
			$elm$core$Result$Ok(_List_Nil),
			items);
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Typesystem$Conforms$declConforms = F4(
	function (env, decl, args, val) {
		if (!_Utils_eq(
			$elm$core$List$length(args),
			$elm$core$List$length(decl.gK))) {
			return false;
		} else {
			var _v14 = _Utils_Tuple2(
				A2($author$project$Typesystem$Conforms$declBody, decl, args),
				val);
			_v14$2:
			while (true) {
				if (!_v14.a.$) {
					if (_v14.b.$ === 4) {
						var fieldTypes = _v14.a.a;
						var fields = _v14.b.a;
						return A3($author$project$Typesystem$Conforms$recordConforms, env, fieldTypes, fields);
					} else {
						break _v14$2;
					}
				} else {
					if (_v14.b.$ === 5) {
						var variants = _v14.a.a;
						var _v15 = _v14.b;
						var tag = _v15.a;
						var payload = _v15.b;
						return A2(
							$elm$core$List$any,
							function (v) {
								return _Utils_eq(v.kL, tag) && function () {
									var _v16 = _Utils_Tuple2(v.eC, payload);
									_v16$2:
									while (true) {
										if (_v16.a.$ === 1) {
											if (_v16.b.$ === 1) {
												var _v17 = _v16.a;
												var _v18 = _v16.b;
												return true;
											} else {
												break _v16$2;
											}
										} else {
											if (!_v16.b.$) {
												var t = _v16.a.a;
												var p = _v16.b.a;
												return A3($author$project$Typesystem$Conforms$value, env, t, p);
											} else {
												break _v16$2;
											}
										}
									}
									return false;
								}();
							},
							variants);
					} else {
						break _v14$2;
					}
				}
			}
			return false;
		}
	});
var $author$project$Typesystem$Conforms$recordConforms = F3(
	function (env, fieldTypes, fields) {
		return _Utils_eq(
			$elm$core$Dict$keys(fieldTypes),
			$elm$core$Dict$keys(fields)) && A2(
			$elm$core$List$all,
			function (_v13) {
				var id = _v13.a;
				var t = _v13.b;
				return A2(
					$elm$core$Maybe$withDefault,
					false,
					A2(
						$elm$core$Maybe$map,
						A2($author$project$Typesystem$Conforms$value, env, t),
						A2($elm$core$Dict$get, id, fields)));
			},
			$elm$core$Dict$toList(fieldTypes));
	});
var $author$project$Typesystem$Conforms$value = F3(
	function (env, type_, val) {
		var _v0 = _Utils_Tuple2(type_, val);
		_v0$4:
		while (true) {
			_v0$13:
			while (true) {
				switch (_v0.a.$) {
					case 9:
						var v = _v0.a.a;
						return $elm$core$Basics$never(v);
					case 6:
						var members = _v0.a.a;
						return A2(
							$elm$core$List$any,
							function (m) {
								return A3($author$project$Typesystem$Conforms$value, env, m, val);
							},
							members);
					case 11:
						var expected = _v0.a.a;
						return A2($author$project$Typesystem$Semantics$equal, expected, val);
					case 10:
						if (_v0.b.$ === 8) {
							var _v1 = _v0.a;
							var _v2 = _v0.b;
							return true;
						} else {
							break _v0$13;
						}
					case 0:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 0:
								var _v4 = _v0.a;
								return true;
							default:
								break _v0$13;
						}
					case 1:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 1:
								var _v5 = _v0.a;
								return true;
							default:
								break _v0$13;
						}
					case 2:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 2:
								var _v6 = _v0.a;
								return true;
							default:
								break _v0$13;
						}
					case 3:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 3:
								var _v7 = _v0.a;
								return true;
							default:
								break _v0$13;
						}
					case 4:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 4:
								var fieldTypes = _v0.a.a;
								var fields = _v0.b.a;
								return A3($author$project$Typesystem$Conforms$recordConforms, env, fieldTypes, fields);
							default:
								break _v0$13;
						}
					case 8:
						switch (_v0.b.$) {
							case 8:
								break _v0$4;
							case 6:
								if (!_v0.a.a.$) {
									var _v8 = _v0.a;
									var _v9 = _v8.a;
									var cell = _v8.c;
									var items = _v0.b.a;
									return A2(
										$elm$core$List$all,
										A2($author$project$Typesystem$Conforms$value, env, cell),
										items);
								} else {
									break _v0$13;
								}
							case 7:
								if (_v0.a.a.$ === 1) {
									var _v10 = _v0.a;
									var keyType = _v10.a.a;
									var cell = _v10.c;
									var entries = _v0.b.a;
									return A2(
										$elm$core$List$all,
										function (_v11) {
											var k = _v11.a;
											var v = _v11.b;
											return A3($author$project$Typesystem$Conforms$value, env, keyType, k) && A3($author$project$Typesystem$Conforms$value, env, cell, v);
										},
										entries);
								} else {
									break _v0$13;
								}
							default:
								break _v0$13;
						}
					case 5:
						if (_v0.b.$ === 8) {
							break _v0$4;
						} else {
							var _v12 = _v0.a;
							var id = _v12.a;
							var args = _v12.b;
							return A2(
								$elm$core$Maybe$withDefault,
								false,
								A2(
									$elm$core$Maybe$map,
									function (decl) {
										return A4($author$project$Typesystem$Conforms$declConforms, env, decl, args, val);
									},
									A2($elm$core$Dict$get, id, env.fv)));
						}
					default:
						if (_v0.b.$ === 8) {
							break _v0$4;
						} else {
							break _v0$13;
						}
				}
			}
			return false;
		}
		var _v3 = _v0.b;
		return false;
	});
var $author$project$Typesystem$Wire$Data$variantPayload = F2(
	function (tag, variants) {
		return A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.eC;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (v) {
						return _Utils_eq(v.kL, tag);
					},
					variants)));
	});
var $author$project$Typesystem$Wire$Data$decodeAt = F3(
	function (env, type_, json) {
		decodeAt:
		while (true) {
			var _v12 = A2($author$project$Typesystem$Wire$Data$form, env, type_);
			switch (_v12.$) {
				case 0:
					return A2($author$project$Typesystem$Wire$Data$decodeScalar, $author$project$Typesystem$Types$TNumber, json);
				case 1:
					return A2($author$project$Typesystem$Wire$Data$decodeScalar, $author$project$Typesystem$Types$TText, json);
				case 2:
					return A2($author$project$Typesystem$Wire$Data$decodeScalar, $author$project$Typesystem$Types$TBool, json);
				case 3:
					return A2($author$project$Typesystem$Wire$Data$decodeScalar, $author$project$Typesystem$Types$TDate, json);
				case 4:
					return $author$project$Typesystem$Wire$Data$decodeNull(json);
				case 5:
					var literal = _v12.a;
					return A2(
						$elm$core$Result$andThen,
						function (value) {
							return A2($author$project$Typesystem$Semantics$equal, literal, value) ? $elm$core$Result$Ok(value) : $elm$core$Result$Err('value is not the expected literal');
						},
						A2(
							$author$project$Typesystem$Wire$Data$decodeScalar,
							$author$project$Typesystem$Wire$Data$scalarType(literal),
							json));
				case 6:
					var literals = _v12.a;
					var hasEmpty = _v12.b;
					return $author$project$Typesystem$Wire$Data$isNull(json) ? (hasEmpty ? $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty) : $elm$core$Result$Err('null is not a member of the enum')) : A2(
						$elm$core$Result$fromMaybe,
						'value is not a member of the enum',
						$elm$core$List$head(
							A2(
								$elm$core$List$filterMap,
								function (literal) {
									return A2(
										$elm$core$Maybe$andThen,
										function (value) {
											return A2($author$project$Typesystem$Semantics$equal, literal, value) ? $elm$core$Maybe$Just(value) : $elm$core$Maybe$Nothing;
										},
										$elm$core$Result$toMaybe(
											A2(
												$author$project$Typesystem$Wire$Data$decodeScalar,
												$author$project$Typesystem$Wire$Data$scalarType(literal),
												json)));
								},
								literals)));
				case 7:
					var inner = _v12.a;
					if ($author$project$Typesystem$Wire$Data$isNull(json)) {
						return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
					} else {
						var $temp$env = env,
							$temp$type_ = inner,
							$temp$json = json;
						env = $temp$env;
						type_ = $temp$type_;
						json = $temp$json;
						continue decodeAt;
					}
				case 8:
					var fieldTypes = _v12.a;
					return A3($author$project$Typesystem$Wire$Data$decodeRecord, env, fieldTypes, json);
				case 9:
					var variants = _v12.a;
					return A3($author$project$Typesystem$Wire$Data$decodeVariant, env, variants, json);
				case 10:
					var cell = _v12.a;
					return A2(
						$elm$core$Result$map,
						$author$project$Typesystem$Value$VList,
						A2(
							$elm$core$Result$andThen,
							$author$project$Typesystem$Wire$Data$traverse(
								A2($author$project$Typesystem$Wire$Data$decodeAt, env, cell)),
							A2(
								$author$project$Typesystem$Wire$Data$decodeWith,
								$elm$json$Json$Decode$list($elm$json$Json$Decode$value),
								json)));
				case 11:
					var keyType = _v12.a;
					var cell = _v12.b;
					return A2(
						$elm$core$Result$andThen,
						$author$project$Typesystem$Semantics$canonicalDict,
						A2(
							$elm$core$Result$andThen,
							$author$project$Typesystem$Wire$Data$traverse(
								A3($author$project$Typesystem$Wire$Data$decodeEntry, env, keyType, cell)),
							A2(
								$author$project$Typesystem$Wire$Data$decodeWith,
								$elm$json$Json$Decode$list($elm$json$Json$Decode$value),
								json)));
				case 12:
					return A2(
						$elm$core$Result$andThen,
						function (value) {
							return A3($author$project$Typesystem$Conforms$value, env, type_, value) ? $elm$core$Result$Ok(value) : $elm$core$Result$Err('value does not inhabit the union');
						},
						A2(
							$author$project$Typesystem$Wire$Data$decodeWith,
							$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Value$codec),
							json));
				default:
					return $elm$core$Result$Err(
						'no data form for type ' + $author$project$Typesystem$Types$groundToString(type_));
			}
		}
	});
var $author$project$Typesystem$Wire$Data$decodeEntry = F4(
	function (env, keyType, cell, json) {
		var _v9 = A2(
			$author$project$Typesystem$Wire$Data$decodeWith,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$value),
			json);
		if (!_v9.$) {
			if ((_v9.a.b && _v9.a.b.b) && (!_v9.a.b.b.b)) {
				var _v10 = _v9.a;
				var k = _v10.a;
				var _v11 = _v10.b;
				var v = _v11.a;
				return A3(
					$elm$core$Result$map2,
					$elm$core$Tuple$pair,
					A2(
						$elm$core$Result$andThen,
						$author$project$Typesystem$Wire$Data$nonNullKey,
						A3($author$project$Typesystem$Wire$Data$decodeAt, env, keyType, k)),
					A3($author$project$Typesystem$Wire$Data$decodeAt, env, cell, v));
			} else {
				return $elm$core$Result$Err('a dict entry is a [key, value] pair');
			}
		} else {
			var e = _v9.a;
			return $elm$core$Result$Err(e);
		}
	});
var $author$project$Typesystem$Wire$Data$decodeRecord = F3(
	function (env, fieldTypes, json) {
		return A2(
			$elm$core$Result$andThen,
			function (fields) {
				return (!_Utils_eq(
					$elm$core$Dict$keys(fields),
					$elm$core$Dict$keys(fieldTypes))) ? $elm$core$Result$Err(
					'record fields must be exactly ' + A2(
						$elm$core$String$join,
						', ',
						$elm$core$Dict$keys(fieldTypes))) : A2(
					$elm$core$Result$map,
					A2($elm$core$Basics$composeR, $elm$core$Dict$fromList, $author$project$Typesystem$Value$VRecord),
					A2(
						$author$project$Typesystem$Wire$Data$traverse,
						function (_v8) {
							var id = _v8.a;
							var fieldType = _v8.b;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(id),
								A2(
									$elm$core$Maybe$withDefault,
									$elm$core$Result$Err('missing field ' + id),
									A2(
										$elm$core$Maybe$map,
										A2($author$project$Typesystem$Wire$Data$decodeAt, env, fieldType),
										A2($elm$core$Dict$get, id, fields))));
						},
						$elm$core$Dict$toList(fieldTypes)));
			},
			A2(
				$author$project$Typesystem$Wire$Data$decodeWith,
				$elm$json$Json$Decode$dict($elm$json$Json$Decode$value),
				json));
	});
var $author$project$Typesystem$Wire$Data$decodeVariant = F3(
	function (env, variants, json) {
		return A2(
			$elm$core$Result$andThen,
			function (object) {
				var _v0 = _Utils_Tuple2(
					A2(
						$elm$core$Maybe$map,
						$author$project$Typesystem$Wire$Data$decodeWith($elm$json$Json$Decode$string),
						A2($elm$core$Dict$get, 'tag', object)),
					A2(
						$elm$core$List$filter,
						function (k) {
							return (k !== 'tag') && (k !== 'payload');
						},
						$elm$core$Dict$keys(object)));
				if (_v0.b.b) {
					var _v1 = _v0.b;
					var bad = _v1.a;
					return $elm$core$Result$Err('unexpected field ' + bad);
				} else {
					if ((!_v0.a.$) && (!_v0.a.a.$)) {
						var tag = _v0.a.a.a;
						var _v2 = _Utils_Tuple2(
							A2($author$project$Typesystem$Wire$Data$variantPayload, tag, variants),
							A2($elm$core$Dict$get, 'payload', object));
						if (!_v2.a.$) {
							if (_v2.a.a.$ === 1) {
								if (_v2.b.$ === 1) {
									var _v3 = _v2.a.a;
									var _v4 = _v2.b;
									return $elm$core$Result$Ok(
										A2($author$project$Typesystem$Value$VVariant, tag, $elm$core$Maybe$Nothing));
								} else {
									var _v5 = _v2.a.a;
									return $elm$core$Result$Err('variant ' + (tag + ' has no payload'));
								}
							} else {
								if (!_v2.b.$) {
									var payloadType = _v2.a.a.a;
									var inner = _v2.b.a;
									return A2(
										$elm$core$Result$map,
										A2(
											$elm$core$Basics$composeR,
											$elm$core$Maybe$Just,
											$author$project$Typesystem$Value$VVariant(tag)),
										A3($author$project$Typesystem$Wire$Data$decodeAt, env, payloadType, inner));
								} else {
									var _v6 = _v2.b;
									return $elm$core$Result$Err('variant ' + (tag + ' needs a payload'));
								}
							}
						} else {
							var _v7 = _v2.a;
							return $elm$core$Result$Err('unknown variant tag ' + tag);
						}
					} else {
						return $elm$core$Result$Err('a variant needs a string tag');
					}
				}
			},
			A2(
				$author$project$Typesystem$Wire$Data$decodeWith,
				$elm$json$Json$Decode$dict($elm$json$Json$Decode$value),
				json));
	});
var $author$project$Typesystem$Wire$Data$decoder = F2(
	function (env, type_) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (json) {
				var _v0 = A3($author$project$Typesystem$Wire$Data$decodeAt, env, type_, json);
				if (!_v0.$) {
					var value = _v0.a;
					return $elm$json$Json$Decode$succeed(value);
				} else {
					var message = _v0.a;
					return $elm$json$Json$Decode$fail(message);
				}
			},
			$elm$json$Json$Decode$value);
	});
var $author$project$Typesystem$Types$AxisVar = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Types$TVar = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Types$open = $author$project$Typesystem$Types$mapVars(
	{
		hV: function (v) {
			return $author$project$Typesystem$Types$AxisVar(
				$elm$core$Basics$never(v));
		},
		k6: function (v) {
			return $author$project$Typesystem$Types$TVar(
				$elm$core$Basics$never(v));
		}
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Typesystem$Types$collect = function (t) {
	var add = F2(
		function (v, vs) {
			return A2($elm$core$List$member, v, vs) ? vs : _Utils_ap(
				vs,
				_List_fromArray(
					[v]));
		});
	var merge = F2(
		function (_v3, _v4) {
			var ts1 = _v3.a;
			var as1 = _v3.b;
			var ts2 = _v4.a;
			var as2 = _v4.b;
			return _Utils_Tuple2(
				A3($elm$core$List$foldl, add, ts1, ts2),
				A3($elm$core$List$foldl, add, as1, as2));
		});
	var many = function (ts) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (x, acc) {
					return A2(
						merge,
						acc,
						$author$project$Typesystem$Types$collect(x));
				}),
			_Utils_Tuple2(_List_Nil, _List_Nil),
			ts);
	};
	switch (t.$) {
		case 9:
			var v = t.a;
			return _Utils_Tuple2(
				_List_fromArray(
					[v]),
				_List_Nil);
		case 4:
			var fields = t.a;
			return many(
				$elm$core$Dict$values(fields));
		case 5:
			var args = t.b;
			return many(args);
		case 6:
			var ts = t.a;
			return many(ts);
		case 7:
			var params = t.a;
			var result = t.b;
			return many(
				_Utils_ap(
					$elm$core$Dict$values(params),
					_List_fromArray(
						[result])));
		case 8:
			var kind = t.a;
			var axis = t.b;
			var inner = t.c;
			var own = function () {
				if (axis.$ === 1) {
					var v = axis.a;
					return _Utils_Tuple2(
						_List_Nil,
						_List_fromArray(
							[v]));
				} else {
					return _Utils_Tuple2(_List_Nil, _List_Nil);
				}
			}();
			var key = function () {
				if (kind.$ === 1) {
					var k = kind.a;
					return _List_fromArray(
						[k]);
				} else {
					return _List_Nil;
				}
			}();
			return A2(
				merge,
				own,
				many(
					_Utils_ap(
						key,
						_List_fromArray(
							[inner]))));
		default:
			return _Utils_Tuple2(_List_Nil, _List_Nil);
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Typesystem$Types$axisVars = A2($elm$core$Basics$composeR, $author$project$Typesystem$Types$collect, $elm$core$Tuple$second);
var $author$project$Typesystem$Types$typeVars = A2($elm$core$Basics$composeR, $author$project$Typesystem$Types$collect, $elm$core$Tuple$first);
var $author$project$Typesystem$Wire$Type$toGround = function (t) {
	return ($elm$core$List$isEmpty(
		$author$project$Typesystem$Types$typeVars(t)) && $elm$core$List$isEmpty(
		$author$project$Typesystem$Types$axisVars(t))) ? $elm$core$Maybe$Just(
		A2(
			$author$project$Typesystem$Types$mapVars,
			{
				hV: function (_v0) {
					return $author$project$Typesystem$Types$Axis('');
				},
				k6: function (_v1) {
					return $author$project$Typesystem$Types$TEmpty;
				}
			},
			t)) : $elm$core$Maybe$Nothing;
};
var $author$project$Typesystem$Wire$Type$asGround = function (_v0) {
	var c = _v0;
	return {
		c: A2(
			$elm$json$Json$Decode$andThen,
			function (t) {
				var _v1 = $author$project$Typesystem$Wire$Type$toGround(t);
				if (!_v1.$) {
					var g = _v1.a;
					return $elm$json$Json$Decode$succeed(g);
				} else {
					return $elm$json$Json$Decode$fail('variable in a ground type');
				}
			},
			c.c),
		d: function (g) {
			return c.d(
				$author$project$Typesystem$Types$open(g));
		},
		e: c.e
	};
};
var $author$project$Typesystem$Wire$Type$canonicalMembers = function (members) {
	return ($elm$core$List$length(members) < 2) ? $elm$core$Result$Err('a union needs at least two members') : ((!_Utils_eq(
		$author$project$Typesystem$Types$union(members),
		$author$project$Typesystem$Types$TUnion(members))) ? $elm$core$Result$Err('non-canonical union (members must be flat, distinct and sorted)') : $elm$core$Result$Ok(members));
};
var $author$project$Typesystem$Wire$Codec$SInt = {$: 1};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Typesystem$Wire$Codec$rejectNegativeZero = function (n) {
	return ((!n) && ((1 / n) < 0)) ? $elm$json$Json$Decode$fail('negative zero is not an integer') : $elm$json$Json$Decode$succeed(n);
};
var $author$project$Typesystem$Wire$Codec$int = {
	c: A2($elm$json$Json$Decode$andThen, $author$project$Typesystem$Wire$Codec$rejectNegativeZero, $elm$json$Json$Decode$int),
	d: function (n) {
		return $elm$json$Json$Encode$int(n + 0);
	},
	e: $author$project$Typesystem$Wire$Codec$SInt
};
var $author$project$Typesystem$Wire$Codec$namedVariant2 = F5(
	function (name, ctor, _v0, _v1, _v2) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var n2 = _v1.a;
		var c2 = _v1.b;
		var cc = _v2;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n2, c2.e)
				]),
			A3(
				$elm$json$Json$Decode$map2,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c),
				A2($elm$json$Json$Decode$field, n2, c2.c)),
			cc.am(
				F2(
					function (a, b) {
						return A3(
							$author$project$Typesystem$Wire$Codec$tagged,
							cc.M,
							name,
							_List_fromArray(
								[
									_Utils_Tuple2(
									n1,
									c1.d(a)),
									_Utils_Tuple2(
									n2,
									c2.d(b))
								]));
					})),
			cc);
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Typesystem$Wire$Codec$namedVariant3 = F6(
	function (name, ctor, _v0, _v1, _v2, _v3) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var n2 = _v1.a;
		var c2 = _v1.b;
		var n3 = _v2.a;
		var c3 = _v2.b;
		var cc = _v3;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n2, c2.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n3, c3.e)
				]),
			A4(
				$elm$json$Json$Decode$map3,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c),
				A2($elm$json$Json$Decode$field, n2, c2.c),
				A2($elm$json$Json$Decode$field, n3, c3.c)),
			cc.am(
				F3(
					function (a, b, c) {
						return A3(
							$author$project$Typesystem$Wire$Codec$tagged,
							cc.M,
							name,
							_List_fromArray(
								[
									_Utils_Tuple2(
									n1,
									c1.d(a)),
									_Utils_Tuple2(
									n2,
									c2.d(b)),
									_Utils_Tuple2(
									n3,
									c3.d(c))
								]));
					})),
			cc);
	});
var $author$project$Typesystem$Id$isStructural = $author$project$Typesystem$Id$matches(
	function (c) {
		return $elm$core$Char$isAlphaNum(c) || ((c === '_') || ((c === '-') || ((c === '/') || ((c === ':') || (c === '#')))));
	});
var $author$project$Typesystem$Wire$Id$isStructural = $author$project$Typesystem$Id$isStructural;
var $author$project$Typesystem$Wire$Id$structural = A3($author$project$Typesystem$Wire$Id$checked, 'invalid structural id', $author$project$Typesystem$Wire$Id$isStructural, '^(?!\\d+$)[A-Za-z0-9_/:#-]+$');
var $author$project$Typesystem$Wire$Type$axisBody = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'axisVar',
		$author$project$Typesystem$Types$AxisVar,
		_Utils_Tuple2('id', $author$project$Typesystem$Wire$Codec$int),
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'axis',
			$author$project$Typesystem$Types$Axis,
			_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$structural),
			A2(
				$author$project$Typesystem$Wire$Codec$custom,
				'kind',
				F3(
					function (vAxis, vAxisVar, axis) {
						if (!axis.$) {
							var id = axis.a;
							return vAxis(id);
						} else {
							var n = axis.a;
							return vAxisVar(n);
						}
					})))));
var $author$project$Typesystem$Wire$Type$openAxisCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Axis',
	function (_v0) {
		return $author$project$Typesystem$Wire$Type$axisBody;
	});
function $author$project$Typesystem$Wire$Type$cyclic$body() {
	return $author$project$Typesystem$Wire$Codec$buildCustom(
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'literal',
			$author$project$Typesystem$Types$TLiteral,
			_Utils_Tuple2('value', $author$project$Typesystem$Wire$Value$codec),
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariant1,
				'var',
				$author$project$Typesystem$Types$TVar,
				_Utils_Tuple2('id', $author$project$Typesystem$Wire$Codec$int),
				A6(
					$author$project$Typesystem$Wire$Codec$namedVariant3,
					'frame',
					$author$project$Typesystem$Types$TFrame,
					_Utils_Tuple2(
						'frame',
						$author$project$Typesystem$Wire$Type$cyclic$frameKindCodec()),
					_Utils_Tuple2('axis', $author$project$Typesystem$Wire$Type$openAxisCodec),
					_Utils_Tuple2(
						'of',
						$author$project$Typesystem$Wire$Type$cyclic$openCodec()),
					A5(
						$author$project$Typesystem$Wire$Codec$namedVariant2,
						'fn',
						$author$project$Typesystem$Types$TFn,
						_Utils_Tuple2(
							'params',
							$author$project$Typesystem$Wire$Id$userDict(
								$author$project$Typesystem$Wire$Type$cyclic$openCodec())),
						_Utils_Tuple2(
							'result',
							$author$project$Typesystem$Wire$Type$cyclic$openCodec()),
						A4(
							$author$project$Typesystem$Wire$Codec$namedVariant1,
							'union',
							$author$project$Typesystem$Types$TUnion,
							_Utils_Tuple2(
								'members',
								A2(
									$author$project$Typesystem$Wire$Codec$validate,
									$author$project$Typesystem$Wire$Type$canonicalMembers,
									$author$project$Typesystem$Wire$Codec$list(
										$author$project$Typesystem$Wire$Type$cyclic$openCodec()))),
							A5(
								$author$project$Typesystem$Wire$Codec$namedVariant2,
								'named',
								$author$project$Typesystem$Types$TNamed,
								_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
								_Utils_Tuple2(
									'args',
									$author$project$Typesystem$Wire$Codec$list(
										$author$project$Typesystem$Wire$Type$cyclic$openCodec())),
								A4(
									$author$project$Typesystem$Wire$Codec$namedVariant1,
									'record',
									$author$project$Typesystem$Types$TRecord,
									_Utils_Tuple2(
										'fields',
										$author$project$Typesystem$Wire$Id$userDict(
											$author$project$Typesystem$Wire$Type$cyclic$openCodec())),
									A3(
										$author$project$Typesystem$Wire$Codec$namedVariant0,
										'empty',
										$author$project$Typesystem$Types$TEmpty,
										A3(
											$author$project$Typesystem$Wire$Codec$namedVariant0,
											'date',
											$author$project$Typesystem$Types$TDate,
											A3(
												$author$project$Typesystem$Wire$Codec$namedVariant0,
												'bool',
												$author$project$Typesystem$Types$TBool,
												A3(
													$author$project$Typesystem$Wire$Codec$namedVariant0,
													'text',
													$author$project$Typesystem$Types$TText,
													A3(
														$author$project$Typesystem$Wire$Codec$namedVariant0,
														'number',
														$author$project$Typesystem$Types$TNumber,
														A2(
															$author$project$Typesystem$Wire$Codec$custom,
															'kind',
															function (vNumber) {
																return function (vText) {
																	return function (vBool) {
																		return function (vDate) {
																			return function (vEmpty) {
																				return function (vRecord) {
																					return function (vNamed) {
																						return function (vUnion) {
																							return function (vFn) {
																								return function (vFrame) {
																									return function (vVar) {
																										return function (vLiteral) {
																											return function (t) {
																												switch (t.$) {
																													case 0:
																														return vNumber;
																													case 1:
																														return vText;
																													case 2:
																														return vBool;
																													case 3:
																														return vDate;
																													case 10:
																														return vEmpty;
																													case 4:
																														var fields = t.a;
																														return vRecord(fields);
																													case 5:
																														var id = t.a;
																														var args = t.b;
																														return A2(vNamed, id, args);
																													case 6:
																														var members = t.a;
																														return vUnion(members);
																													case 7:
																														var params = t.a;
																														var result = t.b;
																														return A2(vFn, params, result);
																													case 8:
																														var kind = t.a;
																														var axis = t.b;
																														var inner = t.c;
																														return A3(vFrame, kind, axis, inner);
																													case 9:
																														var n = t.a;
																														return vVar(n);
																													default:
																														var v = t.a;
																														return vLiteral(v);
																												}
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															}))))))))))))));
}
function $author$project$Typesystem$Wire$Type$cyclic$frameKindBody() {
	return $author$project$Typesystem$Wire$Codec$buildCustom(
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'dict',
			$author$project$Typesystem$Types$DictF,
			_Utils_Tuple2(
				'key',
				$author$project$Typesystem$Wire$Type$cyclic$openCodec()),
			A3(
				$author$project$Typesystem$Wire$Codec$namedVariant0,
				'list',
				$author$project$Typesystem$Types$ListF,
				A2(
					$author$project$Typesystem$Wire$Codec$custom,
					'kind',
					F3(
						function (vList, vDict, kind) {
							if (!kind.$) {
								return vList;
							} else {
								var key = kind.a;
								return vDict(key);
							}
						})))));
}
function $author$project$Typesystem$Wire$Type$cyclic$frameKindCodec() {
	return A2(
		$author$project$Typesystem$Wire$Codec$ref,
		'FrameKind',
		function (_v1) {
			return $author$project$Typesystem$Wire$Type$cyclic$frameKindBody();
		});
}
function $author$project$Typesystem$Wire$Type$cyclic$openCodec() {
	return A2(
		$author$project$Typesystem$Wire$Codec$ref,
		'Type',
		function (_v0) {
			return $author$project$Typesystem$Wire$Type$cyclic$body();
		});
}
var $author$project$Typesystem$Wire$Type$body = $author$project$Typesystem$Wire$Type$cyclic$body();
$author$project$Typesystem$Wire$Type$cyclic$body = function () {
	return $author$project$Typesystem$Wire$Type$body;
};
var $author$project$Typesystem$Wire$Type$frameKindBody = $author$project$Typesystem$Wire$Type$cyclic$frameKindBody();
$author$project$Typesystem$Wire$Type$cyclic$frameKindBody = function () {
	return $author$project$Typesystem$Wire$Type$frameKindBody;
};
var $author$project$Typesystem$Wire$Type$frameKindCodec = $author$project$Typesystem$Wire$Type$cyclic$frameKindCodec();
$author$project$Typesystem$Wire$Type$cyclic$frameKindCodec = function () {
	return $author$project$Typesystem$Wire$Type$frameKindCodec;
};
var $author$project$Typesystem$Wire$Type$openCodec = $author$project$Typesystem$Wire$Type$cyclic$openCodec();
$author$project$Typesystem$Wire$Type$cyclic$openCodec = function () {
	return $author$project$Typesystem$Wire$Type$openCodec;
};
var $author$project$Typesystem$Wire$Type$groundCodec = $author$project$Typesystem$Wire$Type$asGround($author$project$Typesystem$Wire$Type$openCodec);
var $author$project$Typesystem$Wire$Type$groundDecoder = $author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Type$groundCodec);
var $author$project$Designer$Json$collectKeys = F2(
	function (j, acc) {
		switch (j.$) {
			case 5:
				var kvs = j.a;
				return A3(
					$elm$core$List$foldl,
					F2(
						function (_v1, a) {
							var k = _v1.a;
							var v = _v1.b;
							return A2(
								$author$project$Designer$Json$collectKeys,
								v,
								A2($elm$core$List$member, k, a) ? a : _Utils_ap(
									a,
									_List_fromArray(
										[k])));
						}),
					acc,
					kvs);
			case 4:
				var xs = j.a;
				return A3($elm$core$List$foldl, $author$project$Designer$Json$collectKeys, acc, xs);
			default:
				return acc;
		}
	});
var $author$project$Designer$Json$listMember = function (t) {
	_v0$2:
	while (true) {
		switch (t.$) {
			case 8:
				if (!t.a.$) {
					var _v1 = t.a;
					var axis = t.b;
					var inner = t.c;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(axis, inner));
				} else {
					break _v0$2;
				}
			case 6:
				var ts = t.a;
				return $elm$core$List$head(
					A2($elm$core$List$filterMap, $author$project$Designer$Json$listMember, ts));
			default:
				break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Designer$Json$recordMember = function (t) {
	switch (t.$) {
		case 4:
			var d = t.a;
			return $elm$core$Maybe$Just(d);
		case 6:
			var ts = t.a;
			return $elm$core$List$head(
				A2($elm$core$List$filterMap, $author$project$Designer$Json$recordMember, ts));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Designer$Json$fill = F2(
	function (t, value) {
		switch (value.$) {
			case 4:
				var d = value.a;
				var _v1 = $author$project$Designer$Json$recordMember(t);
				if (!_v1.$) {
					var fields = _v1.a;
					return $author$project$Typesystem$Value$VRecord(
						A2(
							$elm$core$Dict$map,
							F2(
								function (f, ft) {
									return A2(
										$elm$core$Maybe$withDefault,
										$author$project$Typesystem$Value$VEmpty,
										A2(
											$elm$core$Maybe$map,
											$author$project$Designer$Json$fill(ft),
											A2($elm$core$Dict$get, f, d)));
								}),
							fields));
				} else {
					return value;
				}
			case 6:
				var xs = value.a;
				var _v2 = $author$project$Designer$Json$listMember(t);
				if (!_v2.$) {
					var _v3 = _v2.a;
					var inner = _v3.b;
					return $author$project$Typesystem$Value$VList(
						A2(
							$elm$core$List$map,
							$author$project$Designer$Json$fill(inner),
							xs));
				} else {
					return value;
				}
			default:
				return value;
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $author$project$Designer$Json$finalize = function (t) {
	switch (t.$) {
		case 10:
			return $author$project$Typesystem$Types$union(
				_List_fromArray(
					[$author$project$Typesystem$Types$TText, $author$project$Typesystem$Types$TEmpty]));
		case 6:
			if (!t.a.b) {
				return $author$project$Typesystem$Types$TText;
			} else {
				var ts = t.a;
				return $author$project$Typesystem$Types$union(
					A2(
						$elm$core$List$map,
						function (member) {
							return _Utils_eq(member, $author$project$Typesystem$Types$TEmpty) ? $author$project$Typesystem$Types$TEmpty : $author$project$Designer$Json$finalize(member);
						},
						ts));
			}
		case 4:
			var d = t.a;
			return $author$project$Typesystem$Types$TRecord(
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v1, x) {
							return $author$project$Designer$Json$finalize(x);
						}),
					d));
		case 8:
			var kind = t.a;
			var axis = t.b;
			var inner = t.c;
			return A3(
				$author$project$Typesystem$Types$TFrame,
				kind,
				axis,
				$author$project$Designer$Json$finalize(inner));
		default:
			return t;
	}
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Designer$Json$mergeRecords = function (records) {
	var total = $elm$core$List$length(records);
	var keys = $elm$core$Set$toList(
		$elm$core$Set$fromList(
			A2($elm$core$List$concatMap, $elm$core$Dict$keys, records)));
	return $author$project$Typesystem$Types$TRecord(
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (k) {
					var present = A2(
						$elm$core$List$filterMap,
						$elm$core$Dict$get(k),
						records);
					return _Utils_Tuple2(
						k,
						(_Utils_cmp(
							$elm$core$List$length(present),
							total) < 0) ? $author$project$Designer$Json$unify(
							A2($elm$core$List$cons, $author$project$Typesystem$Types$TEmpty, present)) : $author$project$Designer$Json$unify(present));
				},
				keys)));
};
var $author$project$Designer$Json$unify = function (types) {
	var members = A2(
		$elm$core$List$concatMap,
		function (t) {
			if (t.$ === 6) {
				var ts = t.a;
				return ts;
			} else {
				return _List_fromArray(
					[t]);
			}
		},
		types);
	var others = A2(
		$elm$core$List$filter,
		function (t) {
			_v5$2:
			while (true) {
				switch (t.$) {
					case 4:
						return false;
					case 8:
						if ((!t.a.$) && (!t.b.$)) {
							var _v6 = t.a;
							return false;
						} else {
							break _v5$2;
						}
					default:
						break _v5$2;
				}
			}
			return true;
		},
		members);
	var records = A2(
		$elm$core$List$filterMap,
		function (t) {
			if (t.$ === 4) {
				var d = t.a;
				return $elm$core$Maybe$Just(d);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		members);
	var mergedRecord = $elm$core$List$isEmpty(records) ? _List_Nil : _List_fromArray(
		[
			$author$project$Designer$Json$mergeRecords(records)
		]);
	var frames = A2(
		$elm$core$List$filterMap,
		function (t) {
			if (((t.$ === 8) && (!t.a.$)) && (!t.b.$)) {
				var _v3 = t.a;
				var a = t.b.a;
				var inner = t.c;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(a, inner));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		members);
	var axes = A3(
		$elm$core$List$foldl,
		F2(
			function (_v1, acc) {
				var a = _v1.a;
				return A2($elm$core$List$member, a, acc) ? acc : _Utils_ap(
					acc,
					_List_fromArray(
						[a]));
			}),
		_List_Nil,
		frames);
	var mergedFrames = A2(
		$elm$core$List$map,
		function (a) {
			return A3(
				$author$project$Typesystem$Types$TFrame,
				$author$project$Typesystem$Types$ListF,
				$author$project$Typesystem$Types$Axis(a),
				$author$project$Designer$Json$unify(
					A2(
						$elm$core$List$filterMap,
						function (_v0) {
							var b = _v0.a;
							var inner = _v0.b;
							return _Utils_eq(a, b) ? $elm$core$Maybe$Just(inner) : $elm$core$Maybe$Nothing;
						},
						frames)));
		},
		axes);
	return $author$project$Typesystem$Types$union(
		_Utils_ap(
			others,
			_Utils_ap(mergedRecord, mergedFrames)));
};
var $author$project$Designer$Json$infer = F2(
	function (axis, value) {
		switch (value.$) {
			case 0:
				return $author$project$Typesystem$Types$TNumber;
			case 1:
				return $author$project$Typesystem$Types$TText;
			case 2:
				return $author$project$Typesystem$Types$TBool;
			case 3:
				return $author$project$Typesystem$Types$TDate;
			case 8:
				return $author$project$Typesystem$Types$TEmpty;
			case 4:
				var fields = value.a;
				return $author$project$Typesystem$Types$TRecord(
					A2(
						$elm$core$Dict$map,
						F2(
							function (f, v) {
								return A2($author$project$Designer$Json$infer, axis + ('/' + f), v);
							}),
						fields));
			case 6:
				var xs = value.a;
				return A3(
					$author$project$Typesystem$Types$TFrame,
					$author$project$Typesystem$Types$ListF,
					$author$project$Typesystem$Types$Axis(axis),
					$author$project$Designer$Json$unify(
						A2(
							$elm$core$List$map,
							$author$project$Designer$Json$inferElement(axis),
							xs)));
			case 7:
				var pairs = value.a;
				return A3(
					$author$project$Typesystem$Types$TFrame,
					$author$project$Typesystem$Types$DictF(
						$author$project$Designer$Json$unify(
							A2(
								$elm$core$List$map,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Tuple$first,
									$author$project$Designer$Json$infer(axis + '#')),
								pairs))),
					$author$project$Typesystem$Types$Axis(axis),
					$author$project$Designer$Json$unify(
						A2(
							$elm$core$List$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$second,
								$author$project$Designer$Json$inferElement(axis)),
							pairs)));
			default:
				return $author$project$Typesystem$Types$TUnion(_List_Nil);
		}
	});
var $author$project$Designer$Json$inferElement = F2(
	function (axis, value) {
		if (value.$ === 6) {
			return A2($author$project$Designer$Json$infer, axis + '#', value);
		} else {
			return A2($author$project$Designer$Json$infer, axis, value);
		}
	});
var $author$project$Designer$Json$inferType = F2(
	function (axis, value) {
		return $author$project$Designer$Json$finalize(
			A2($author$project$Designer$Json$infer, axis, value));
	});
var $author$project$Designer$Json$JArr = function (a) {
	return {$: 4, a: a};
};
var $author$project$Designer$Json$JBool = function (a) {
	return {$: 2, a: a};
};
var $author$project$Designer$Json$JNull = {$: 3};
var $author$project$Designer$Json$JNum = function (a) {
	return {$: 0, a: a};
};
var $author$project$Designer$Json$JObj = function (a) {
	return {$: 5, a: a};
};
var $author$project$Designer$Json$JStr = function (a) {
	return {$: 1, a: a};
};
function $author$project$Designer$Json$cyclic$jDecoder() {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $author$project$Designer$Json$JStr, $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$map, $author$project$Designer$Json$JBool, $elm$json$Json$Decode$bool),
				$elm$json$Json$Decode$null($author$project$Designer$Json$JNull),
				A2($elm$json$Json$Decode$map, $author$project$Designer$Json$JNum, $elm$json$Json$Decode$float),
				A2(
				$elm$json$Json$Decode$map,
				$author$project$Designer$Json$JArr,
				$elm$json$Json$Decode$list(
					$elm$json$Json$Decode$lazy(
						function (_v0) {
							return $author$project$Designer$Json$cyclic$jDecoder();
						}))),
				A2(
				$elm$json$Json$Decode$map,
				$author$project$Designer$Json$JObj,
				$elm$json$Json$Decode$keyValuePairs(
					$elm$json$Json$Decode$lazy(
						function (_v1) {
							return $author$project$Designer$Json$cyclic$jDecoder();
						})))
			]));
}
var $author$project$Designer$Json$jDecoder = $author$project$Designer$Json$cyclic$jDecoder();
$author$project$Designer$Json$cyclic$jDecoder = function () {
	return $author$project$Designer$Json$jDecoder;
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$Designer$Json$freshId = F2(
	function (used, base) {
		var go = function (n) {
			go:
			while (true) {
				var candidate = base + ('_' + $elm$core$String$fromInt(n));
				if (A2($elm$core$Set$member, candidate, used)) {
					var $temp$n = n + 1;
					n = $temp$n;
					continue go;
				} else {
					return candidate;
				}
			}
		};
		return A2($elm$core$Set$member, base, used) ? go(2) : base;
	});
var $author$project$Typesystem$Id$reservedPrefixes = _List_fromArray(
	['by:', 'rows:', 'ax:', 'flat:']);
var $author$project$Typesystem$Id$isReserved = function (id) {
	return A2(
		$elm$core$List$any,
		function (prefix) {
			return A2($elm$core$String$startsWith, prefix, id);
		},
		$author$project$Typesystem$Id$reservedPrefixes);
};
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm$core$String$map = _String_map;
var $author$project$Designer$Json$sanitize = function (key) {
	var mapped = A2(
		$elm$core$String$map,
		function (c) {
			return ($elm$core$Char$isAlphaNum(c) || ((c === '_') || (c === '-'))) ? c : '_';
		},
		key);
	return (mapped === '') ? 'field' : (A2($elm$core$String$all, $elm$core$Char$isDigit, mapped) ? ('f_' + mapped) : mapped);
};
var $author$project$Designer$Json$mintIds = function (keys) {
	var isSafe = function (k) {
		return $author$project$Typesystem$Id$isUser(k) && (!$author$project$Typesystem$Id$isReserved(k));
	};
	var _v0 = A2($elm$core$List$partition, isSafe, keys);
	var safe = _v0.a;
	var unsafe = _v0.b;
	var start = _Utils_Tuple2(
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (k) {
					return _Utils_Tuple2(k, k);
				},
				safe)),
		$elm$core$Set$fromList(safe));
	return A3(
		$elm$core$List$foldl,
		F2(
			function (k, _v1) {
				var map = _v1.a;
				var used = _v1.b;
				var id = A2(
					$author$project$Designer$Json$freshId,
					used,
					$author$project$Designer$Json$sanitize(k));
				return _Utils_Tuple2(
					A3($elm$core$Dict$insert, k, id, map),
					A2($elm$core$Set$insert, id, used));
			}),
		start,
		unsafe).a;
};
var $author$project$Designer$Json$isArr = function (j) {
	if (j.$ === 4) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Designer$Json$lookup = F2(
	function (k, kvs) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			$elm$core$List$head(
				$elm$core$List$reverse(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var k2 = _v0.a;
							return _Utils_eq(k2, k);
						},
						kvs))));
	});
var $author$project$Designer$Json$walk = F4(
	function (idOf, owner, instances, table) {
		return A4(
			$author$project$Designer$Json$walkArrays,
			idOf,
			owner,
			A2($elm$core$List$filter, $author$project$Designer$Json$isArr, instances),
			A4($author$project$Designer$Json$walkObjects, idOf, owner, instances, table));
	});
var $author$project$Designer$Json$walkArrays = F4(
	function (idOf, owner, arrays, table) {
		var elements = A2(
			$elm$core$List$concatMap,
			function (j) {
				if (j.$ === 4) {
					var xs = j.a;
					return xs;
				} else {
					return _List_Nil;
				}
			},
			arrays);
		return $elm$core$List$isEmpty(elements) ? table : A4(
			$author$project$Designer$Json$walkArrays,
			idOf,
			owner + '#',
			A2($elm$core$List$filter, $author$project$Designer$Json$isArr, elements),
			A4($author$project$Designer$Json$walkObjects, idOf, owner, elements, table));
	});
var $author$project$Designer$Json$walkObjects = F4(
	function (idOf, owner, instances, table) {
		var objects = A2(
			$elm$core$List$filterMap,
			function (j) {
				if (j.$ === 5) {
					var kvs = j.a;
					return $elm$core$Maybe$Just(kvs);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			instances);
		var keys = A3(
			$elm$core$List$foldl,
			F2(
				function (kvs, acc) {
					return A3(
						$elm$core$List$foldl,
						F2(
							function (_v0, a) {
								var k = _v0.a;
								return A2($elm$core$List$member, k, a) ? a : _Utils_ap(
									a,
									_List_fromArray(
										[k]));
							}),
						acc,
						kvs);
				}),
			_List_Nil,
			objects);
		return $elm$core$List$isEmpty(objects) ? table : A3(
			$elm$core$List$foldl,
			F2(
				function (k, acc) {
					var children = A2(
						$elm$core$List$filterMap,
						function (kvs) {
							return A2($author$project$Designer$Json$lookup, k, kvs);
						},
						objects);
					return A4(
						$author$project$Designer$Json$walk,
						idOf,
						owner + ('/' + idOf(k)),
						children,
						acc);
				}),
			A3(
				$elm$core$Dict$insert,
				owner,
				A2($elm$core$List$map, idOf, keys),
				table),
			keys);
	});
var $author$project$Designer$Json$orderTable = F3(
	function (idOf, root, tree) {
		return A4(
			$author$project$Designer$Json$walk,
			idOf,
			root,
			_List_fromArray(
				[tree]),
			$elm$core$Dict$empty);
	});
var $author$project$Designer$Json$toValue = F2(
	function (idOf, j) {
		switch (j.$) {
			case 0:
				var x = j.a;
				return $author$project$Typesystem$Value$VNumber(x);
			case 1:
				var s = j.a;
				return $author$project$Typesystem$Value$VText(s);
			case 2:
				var b = j.a;
				return $author$project$Typesystem$Value$VBool(b);
			case 3:
				return $author$project$Typesystem$Value$VEmpty;
			case 4:
				var xs = j.a;
				return $author$project$Typesystem$Value$VList(
					A2(
						$elm$core$List$map,
						$author$project$Designer$Json$toValue(idOf),
						xs));
			default:
				var kvs = j.a;
				return $author$project$Typesystem$Value$VRecord(
					$elm$core$Dict$fromList(
						A2(
							$elm$core$List$map,
							function (_v1) {
								var k = _v1.a;
								var v = _v1.b;
								return _Utils_Tuple2(
									idOf(k),
									A2($author$project$Designer$Json$toValue, idOf, v));
							},
							kvs)));
		}
	});
var $author$project$Designer$Json$import_ = F2(
	function (objectId, json) {
		if (!$author$project$Typesystem$Id$isUser(objectId)) {
			return $elm$core$Result$Err('not a valid object id: ' + objectId);
		} else {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Designer$Json$jDecoder, json);
			if (_v0.$ === 1) {
				var err = _v0.a;
				return $elm$core$Result$Err(
					$elm$json$Json$Decode$errorToString(err));
			} else {
				var tree = _v0.a;
				var keys = A2($author$project$Designer$Json$collectKeys, tree, _List_Nil);
				var ids = $author$project$Designer$Json$mintIds(keys);
				var idOf = function (k) {
					return A2(
						$elm$core$Maybe$withDefault,
						k,
						A2($elm$core$Dict$get, k, ids));
				};
				var value = A2($author$project$Designer$Json$toValue, idOf, tree);
				var type_ = A2($author$project$Designer$Json$inferType, objectId, value);
				return $elm$core$Result$Ok(
					{
						gs: A3(
							$elm$core$Dict$foldl,
							F3(
								function (k, id, acc) {
									return A3($elm$core$Dict$insert, id, k, acc);
								}),
							$elm$core$Dict$empty,
							ids),
						j_: A3($author$project$Designer$Json$orderTable, idOf, objectId, tree),
						dy: type_,
						hp: A2($author$project$Designer$Json$fill, type_, value)
					});
			}
		}
	});
var $author$project$Try$LoadRequest = F3(
	function (name, json, type_) {
		return {d4: json, jD: name, dy: type_};
	});
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Try$loadDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Try$LoadRequest,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'json', $elm$json$Json$Decode$value),
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$value)));
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Try$keepFirst = F2(
	function (i, existing) {
		return $elm$core$Maybe$Just(
			A2(
				$elm$core$Basics$min,
				i,
				A2($elm$core$Maybe$withDefault, i, existing)));
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Typesystem$Env$withName = F3(
	function (id, name, env) {
		return _Utils_update(
			env,
			{
				gs: A3($elm$core$Dict$insert, id, name, env.gs)
			});
	});
var $author$project$Typesystem$Env$withObject = F4(
	function (id, name, type_, env) {
		return A3(
			$author$project$Typesystem$Env$withName,
			id,
			name,
			_Utils_update(
				env,
				{
					gz: A3(
						$elm$core$Dict$insert,
						id,
						{c_: id, dy: type_},
						env.gz)
				}));
	});
var $author$project$Try$register = F4(
	function (model, table, names, order) {
		var rank = A3(
			$elm$core$Dict$foldl,
			F3(
				function (_v0, ids, acc) {
					return A3(
						$elm$core$List$foldl,
						F2(
							function (_v1, a) {
								var i = _v1.a;
								var field = _v1.b;
								return A3(
									$elm$core$Dict$update,
									field,
									$author$project$Try$keepFirst(i),
									a);
							}),
						acc,
						A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, ids));
				}),
			model.cs,
			order);
		var env = A4(
			$author$project$Typesystem$Env$withObject,
			table.c_,
			table.jD,
			table.dy,
			A3($elm$core$Dict$foldl, $author$project$Typesystem$Env$withName, model.aB, names));
		return _Utils_update(
			model,
			{
				aB: env,
				cs: rank,
				bU: _Utils_ap(
					A2(
						$elm$core$List$filter,
						function (t) {
							return !_Utils_eq(t.c_, table.c_);
						},
						model.bU),
					_List_fromArray(
						[table])),
				cD: A3($elm$core$Dict$insert, table.c_, table.hp, model.cD)
			});
	});
var $author$project$Try$load = F2(
	function (request, model) {
		return A2(
			$elm$core$Result$map,
			function (next) {
				return _Utils_Tuple2(
					next,
					$author$project$Try$loadedReply(next));
			},
			A2(
				$elm$core$Result$andThen,
				function (req) {
					var id = 'o_' + req.jD;
					if (!$author$project$Typesystem$Id$isUser(id)) {
						return $elm$core$Result$Err('not a valid table name: ' + (req.jD + ' (letters, digits, _ and - only)'));
					} else {
						var _v0 = req.dy;
						if (_v0.$ === 1) {
							return A2(
								$elm$core$Result$map,
								function (imported) {
									return A4(
										$author$project$Try$register,
										model,
										{c_: id, jD: req.jD, dy: imported.dy, hp: imported.hp},
										imported.gs,
										imported.j_);
								},
								A2($author$project$Designer$Json$import_, id, req.d4));
						} else {
							var typeWire = _v0.a;
							return A2(
								$elm$core$Result$andThen,
								function (ground) {
									return A2(
										$elm$core$Result$map,
										function (value) {
											return A4(
												$author$project$Try$register,
												model,
												{
													c_: id,
													jD: req.jD,
													dy: ground,
													hp: $author$project$Try$canonical(value)
												},
												$elm$core$Dict$empty,
												$elm$core$Dict$empty);
										},
										A2(
											$elm$core$Result$mapError,
											function (e) {
												return 'data does not fit the type: ' + $elm$json$Json$Decode$errorToString(e);
											},
											A2(
												$elm$json$Json$Decode$decodeValue,
												A2($author$project$Typesystem$Wire$Data$decoder, model.aB, ground),
												A2($author$project$Try$adapt, ground, req.d4))));
								},
								A2(
									$elm$core$Result$mapError,
									function (e) {
										return 'type file: ' + $elm$json$Json$Decode$errorToString(e);
									},
									A2($elm$json$Json$Decode$decodeValue, $author$project$Typesystem$Wire$Type$groundDecoder, typeWire)));
						}
					}
				},
				A2(
					$elm$core$Result$mapError,
					$elm$json$Json$Decode$errorToString,
					A2($elm$json$Json$Decode$decodeValue, $author$project$Try$loadDecoder, request))));
	});
var $author$project$Try$output = _Platform_outgoingPort('output', $elm$core$Basics$identity);
var $author$project$Try$RunRequest = F3(
	function (source, choices, alignments) {
		return {dJ: alignments, U: choices, g9: source};
	});
var $author$project$Typesystem$Algebra$DropExtras = {$: 1};
var $author$project$Typesystem$Algebra$PadEmpty = {$: 0};
var $author$project$Typesystem$Algebra$PadWith = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Wire$Algebra$alignmentDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'padWith',
		$author$project$Typesystem$Algebra$PadWith,
		_Utils_Tuple2('value', $author$project$Typesystem$Wire$Value$codec),
		A3(
			$author$project$Typesystem$Wire$Codec$namedVariant0,
			'dropExtras',
			$author$project$Typesystem$Algebra$DropExtras,
			A3(
				$author$project$Typesystem$Wire$Codec$namedVariant0,
				'padEmpty',
				$author$project$Typesystem$Algebra$PadEmpty,
				A2(
					$author$project$Typesystem$Wire$Codec$custom,
					'kind',
					F4(
						function (vPadEmpty, vDropExtras, vPadWith, alignment) {
							switch (alignment.$) {
								case 0:
									return vPadEmpty;
								case 1:
									return vDropExtras;
								default:
									var v = alignment.a;
									return vPadWith(v);
							}
						}))))));
var $author$project$Typesystem$Wire$Algebra$alignmentCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Alignment',
	function (_v0) {
		return $author$project$Typesystem$Wire$Algebra$alignmentDefinition;
	});
var $author$project$Typesystem$Surface$Arg = F2(
	function (label, value) {
		return {f1: label, hp: value};
	});
var $author$project$Typesystem$Surface$SCall = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Surface$SCompose = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Surface$SField = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Surface$SHole = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Surface$SList = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Typesystem$Surface$SLit = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Typesystem$Surface$SMissing = function (a) {
	return {$: 11, a: a};
};
var $author$project$Typesystem$Surface$SPipe = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Surface$SRecord = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Typesystem$Surface$SRef = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Typesystem$Surface$STemplate = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Typesystem$Surface$SVariant = F3(
	function (a, b, c) {
		return {$: 10, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Surface$TPExpr = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Surface$TPText = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Wire$Codec$SObject = function (a) {
	return {$: 12, a: a};
};
var $author$project$Typesystem$Wire$Codec$buildObject = function (_v0) {
	var o = _v0;
	return {
		c: A2(
			$author$project$Typesystem$Wire$Codec$strictKeys,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.jD;
				},
				o.fE),
			o.c),
		d: function (a) {
			return $elm$json$Json$Encode$object(
				o.d(a));
		},
		e: $author$project$Typesystem$Wire$Codec$SObject(o.fE)
	};
};
var $author$project$Typesystem$Wire$Codec$ObjectCodec = $elm$core$Basics$identity;
var $author$project$Typesystem$Wire$Codec$field = F4(
	function (name, get, _v0, _v1) {
		var c = _v0;
		var o = _v1;
		return {
			c: A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (f, x) {
						return f(x);
					}),
				o.c,
				A2($elm$json$Json$Decode$field, name, c.c)),
			d: function (a) {
				return _Utils_ap(
					o.d(a),
					_List_fromArray(
						[
							_Utils_Tuple2(
							name,
							c.d(
								get(a)))
						]));
			},
			fE: _Utils_ap(
				o.fE,
				_List_fromArray(
					[
						{jD: name, bR: true, e: c.e}
					]))
		};
	});
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Typesystem$Wire$Codec$namedVariant4Maybe = F7(
	function (name, ctor, _v0, _v1, _v2, _v3, _v4) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var n2 = _v1.a;
		var c2 = _v1.b;
		var n3 = _v2.a;
		var c3 = _v2.b;
		var n4 = _v3.a;
		var c4 = _v3.b;
		var cc = _v4;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n2, c2.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n3, c3.e),
					{jD: n4, bR: false, e: c4.e}
				]),
			A5(
				$elm$json$Json$Decode$map4,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c),
				A2($elm$json$Json$Decode$field, n2, c2.c),
				A2($elm$json$Json$Decode$field, n3, c3.c),
				A2($author$project$Typesystem$Wire$Codec$optionalDecoder, n4, c4.c)),
			cc.am(
				F4(
					function (a, b, c, md) {
						return A3(
							$author$project$Typesystem$Wire$Codec$tagged,
							cc.M,
							name,
							_Utils_ap(
								_List_fromArray(
									[
										_Utils_Tuple2(
										n1,
										c1.d(a)),
										_Utils_Tuple2(
										n2,
										c2.d(b)),
										_Utils_Tuple2(
										n3,
										c3.d(c))
									]),
								function () {
									if (!md.$) {
										var d = md.a;
										return _List_fromArray(
											[
												_Utils_Tuple2(
												n4,
												c4.d(d))
											]);
									} else {
										return _List_Nil;
									}
								}()));
					})),
			cc);
	});
var $author$project$Typesystem$Wire$Codec$object = function (constructor) {
	return {
		c: $elm$json$Json$Decode$succeed(constructor),
		d: function (_v0) {
			return _List_Nil;
		},
		fE: _List_Nil
	};
};
var $author$project$Typesystem$Wire$Codec$optionalField = F4(
	function (name, get, _v0, _v1) {
		var c = _v0;
		var o = _v1;
		return {
			c: A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (f, x) {
						return f(x);
					}),
				o.c,
				A2($author$project$Typesystem$Wire$Codec$optionalDecoder, name, c.c)),
			d: function (a) {
				var _v2 = get(a);
				if (!_v2.$) {
					var x = _v2.a;
					return _Utils_ap(
						o.d(a),
						_List_fromArray(
							[
								_Utils_Tuple2(
								name,
								c.d(x))
							]));
				} else {
					return o.d(a);
				}
			},
			fE: _Utils_ap(
				o.fE,
				_List_fromArray(
					[
						{jD: name, bR: false, e: c.e}
					]))
		};
	});
var $author$project$Typesystem$Surface$ById = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Surface$ByName = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Wire$Surface$refDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'name',
		$author$project$Typesystem$Surface$ByName,
		_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'id',
			$author$project$Typesystem$Surface$ById,
			_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
			A2(
				$author$project$Typesystem$Wire$Codec$custom,
				'kind',
				F3(
					function (vId, vName, ref) {
						if (!ref.$) {
							var id = ref.a;
							return vId(id);
						} else {
							var name = ref.a;
							return vName(name);
						}
					})))));
var $author$project$Typesystem$Wire$Surface$refCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Ref',
	function (_v0) {
		return $author$project$Typesystem$Wire$Surface$refDefinition;
	});
function $author$project$Typesystem$Wire$Surface$cyclic$definition() {
	return $author$project$Typesystem$Wire$Codec$buildCustom(
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'missing',
			$author$project$Typesystem$Surface$SMissing,
			_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
			A7(
				$author$project$Typesystem$Wire$Codec$namedVariant4Maybe,
				'variant',
				F4(
					function (id, decl, tag, payload) {
						return A3(
							$author$project$Typesystem$Surface$SVariant,
							id,
							{fu: decl, kL: tag},
							payload);
					}),
				_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
				_Utils_Tuple2('decl', $author$project$Typesystem$Wire$Id$user),
				_Utils_Tuple2('tag', $author$project$Typesystem$Wire$Id$user),
				_Utils_Tuple2('payload', $author$project$Typesystem$Wire$Value$codec),
				A4(
					$author$project$Typesystem$Wire$Codec$namedVariant1,
					'hole',
					$author$project$Typesystem$Surface$SHole,
					_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
					A5(
						$author$project$Typesystem$Wire$Codec$namedVariant2,
						'template',
						$author$project$Typesystem$Surface$STemplate,
						_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
						_Utils_Tuple2(
							'parts',
							$author$project$Typesystem$Wire$Codec$list(
								$author$project$Typesystem$Wire$Surface$cyclic$partCodec())),
						A5(
							$author$project$Typesystem$Wire$Codec$namedVariant2,
							'record',
							$author$project$Typesystem$Surface$SRecord,
							_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
							_Utils_Tuple2(
								'entries',
								$author$project$Typesystem$Wire$Codec$list(
									$author$project$Typesystem$Wire$Surface$cyclic$entryCodec())),
							A5(
								$author$project$Typesystem$Wire$Codec$namedVariant2,
								'list',
								$author$project$Typesystem$Surface$SList,
								_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
								_Utils_Tuple2(
									'items',
									$author$project$Typesystem$Wire$Codec$list(
										$author$project$Typesystem$Wire$Surface$cyclic$codec())),
								A6(
									$author$project$Typesystem$Wire$Codec$namedVariant3,
									'compose',
									$author$project$Typesystem$Surface$SCompose,
									_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
									_Utils_Tuple2(
										'first',
										$author$project$Typesystem$Wire$Surface$cyclic$codec()),
									_Utils_Tuple2(
										'second',
										$author$project$Typesystem$Wire$Surface$cyclic$codec()),
									A6(
										$author$project$Typesystem$Wire$Codec$namedVariant3,
										'pipe',
										$author$project$Typesystem$Surface$SPipe,
										_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
										_Utils_Tuple2(
											'input',
											$author$project$Typesystem$Wire$Surface$cyclic$codec()),
										_Utils_Tuple2(
											'function',
											$author$project$Typesystem$Wire$Surface$cyclic$codec()),
										A6(
											$author$project$Typesystem$Wire$Codec$namedVariant3,
											'call',
											$author$project$Typesystem$Surface$SCall,
											_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
											_Utils_Tuple2('function', $author$project$Typesystem$Wire$Surface$refCodec),
											_Utils_Tuple2(
												'args',
												$author$project$Typesystem$Wire$Codec$list(
													$author$project$Typesystem$Wire$Surface$cyclic$argCodec())),
											A6(
												$author$project$Typesystem$Wire$Codec$namedVariant3,
												'field',
												$author$project$Typesystem$Surface$SField,
												_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
												_Utils_Tuple2(
													'target',
													$author$project$Typesystem$Wire$Surface$cyclic$codec()),
												_Utils_Tuple2('field', $author$project$Typesystem$Wire$Surface$refCodec),
												A5(
													$author$project$Typesystem$Wire$Codec$namedVariant2,
													'ref',
													$author$project$Typesystem$Surface$SRef,
													_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
													_Utils_Tuple2('ref', $author$project$Typesystem$Wire$Surface$refCodec),
													A5(
														$author$project$Typesystem$Wire$Codec$namedVariant2,
														'literal',
														$author$project$Typesystem$Surface$SLit,
														_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
														_Utils_Tuple2('value', $author$project$Typesystem$Wire$Value$codec),
														A2(
															$author$project$Typesystem$Wire$Codec$custom,
															'kind',
															function (vLiteral) {
																return function (vRef) {
																	return function (vField) {
																		return function (vCall) {
																			return function (vPipe) {
																				return function (vCompose) {
																					return function (vList) {
																						return function (vRecord) {
																							return function (vTemplate) {
																								return function (vHole) {
																									return function (vVariant) {
																										return function (vMissing) {
																											return function (surface) {
																												switch (surface.$) {
																													case 0:
																														var id = surface.a;
																														var v = surface.b;
																														return A2(vLiteral, id, v);
																													case 1:
																														var id = surface.a;
																														var r = surface.b;
																														return A2(vRef, id, r);
																													case 2:
																														var id = surface.a;
																														var target = surface.b;
																														var r = surface.c;
																														return A3(vField, id, target, r);
																													case 3:
																														var id = surface.a;
																														var _function = surface.b;
																														var args = surface.c;
																														return A3(vCall, id, _function, args);
																													case 4:
																														var id = surface.a;
																														var input = surface.b;
																														var _function = surface.c;
																														return A3(vPipe, id, input, _function);
																													case 5:
																														var id = surface.a;
																														var first = surface.b;
																														var second = surface.c;
																														return A3(vCompose, id, first, second);
																													case 6:
																														var id = surface.a;
																														var items = surface.b;
																														return A2(vList, id, items);
																													case 7:
																														var id = surface.a;
																														var entries = surface.b;
																														return A2(vRecord, id, entries);
																													case 8:
																														var id = surface.a;
																														var parts = surface.b;
																														return A2(vTemplate, id, parts);
																													case 9:
																														var id = surface.a;
																														return vHole(id);
																													case 10:
																														var id = surface.a;
																														var variant = surface.b;
																														var payload = surface.c;
																														return A4(vVariant, id, variant.fu, variant.kL, payload);
																													default:
																														var id = surface.a;
																														return vMissing(id);
																												}
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															}))))))))))))));
}
function $author$project$Typesystem$Wire$Surface$cyclic$argCodec() {
	return $author$project$Typesystem$Wire$Codec$buildObject(
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'value',
			function ($) {
				return $.hp;
			},
			$author$project$Typesystem$Wire$Surface$cyclic$codec(),
			A4(
				$author$project$Typesystem$Wire$Codec$optionalField,
				'label',
				function ($) {
					return $.f1;
				},
				$author$project$Typesystem$Wire$Surface$refCodec,
				$author$project$Typesystem$Wire$Codec$object($author$project$Typesystem$Surface$Arg))));
}
function $author$project$Typesystem$Wire$Surface$cyclic$partCodec() {
	return $author$project$Typesystem$Wire$Codec$buildCustom(
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'expr',
			$author$project$Typesystem$Surface$TPExpr,
			_Utils_Tuple2(
				'value',
				$author$project$Typesystem$Wire$Surface$cyclic$codec()),
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariant1,
				'text',
				$author$project$Typesystem$Surface$TPText,
				_Utils_Tuple2('value', $author$project$Typesystem$Wire$Codec$string),
				A2(
					$author$project$Typesystem$Wire$Codec$custom,
					'kind',
					F3(
						function (vText, vExpr, part) {
							if (!part.$) {
								var text = part.a;
								return vText(text);
							} else {
								var surface = part.a;
								return vExpr(surface);
							}
						})))));
}
function $author$project$Typesystem$Wire$Surface$cyclic$entryCodec() {
	return $author$project$Typesystem$Wire$Codec$buildObject(
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'value',
			$elm$core$Tuple$second,
			$author$project$Typesystem$Wire$Surface$cyclic$codec(),
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'key',
				$elm$core$Tuple$first,
				$author$project$Typesystem$Wire$Surface$refCodec,
				$author$project$Typesystem$Wire$Codec$object($elm$core$Tuple$pair))));
}
function $author$project$Typesystem$Wire$Surface$cyclic$codec() {
	return A2(
		$author$project$Typesystem$Wire$Codec$ref,
		'Surface',
		function (_v0) {
			return $author$project$Typesystem$Wire$Surface$cyclic$definition();
		});
}
var $author$project$Typesystem$Wire$Surface$definition = $author$project$Typesystem$Wire$Surface$cyclic$definition();
$author$project$Typesystem$Wire$Surface$cyclic$definition = function () {
	return $author$project$Typesystem$Wire$Surface$definition;
};
var $author$project$Typesystem$Wire$Surface$argCodec = $author$project$Typesystem$Wire$Surface$cyclic$argCodec();
$author$project$Typesystem$Wire$Surface$cyclic$argCodec = function () {
	return $author$project$Typesystem$Wire$Surface$argCodec;
};
var $author$project$Typesystem$Wire$Surface$partCodec = $author$project$Typesystem$Wire$Surface$cyclic$partCodec();
$author$project$Typesystem$Wire$Surface$cyclic$partCodec = function () {
	return $author$project$Typesystem$Wire$Surface$partCodec;
};
var $author$project$Typesystem$Wire$Surface$entryCodec = $author$project$Typesystem$Wire$Surface$cyclic$entryCodec();
$author$project$Typesystem$Wire$Surface$cyclic$entryCodec = function () {
	return $author$project$Typesystem$Wire$Surface$entryCodec;
};
var $author$project$Typesystem$Wire$Surface$codec = $author$project$Typesystem$Wire$Surface$cyclic$codec();
$author$project$Typesystem$Wire$Surface$cyclic$codec = function () {
	return $author$project$Typesystem$Wire$Surface$codec;
};
var $author$project$Data$Internal$NodeTypes$Field = F3(
	function (a, b, c) {
		return {$: 10, a: a, b: b, c: c};
	});
var $author$project$Data$Internal$NodeTypes$Group = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Data$Internal$NodeTypes$Ident = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Data$Internal$NodeTypes$Lit = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Data$Internal$NodeTypes$Op = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $author$project$Data$Internal$NodeTypes$Pipe = F3(
	function (a, b, c) {
		return {$: 9, a: a, b: b, c: c};
	});
var $author$project$Data$Internal$NodeTypes$Placeholder = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Data$Internal$NodeTypes$Seq = F4(
	function (a, b, c, d) {
		return {$: 7, a: a, b: b, c: c, d: d};
	});
var $author$project$Data$Internal$NodeTypes$Template = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Data$Internal$NodeTypes$TplChar = function (a) {
	return {$: 0, a: a};
};
var $author$project$Data$Internal$NodeTypes$TplNode = function (a) {
	return {$: 1, a: a};
};
var $author$project$Data$Internal$NodeTypes$Unary = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Data$Internal$NodeTypes$Fn = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $author$project$Expression$Node$decodeFn = F3(
	function (id, name, args) {
		return A3(
			$author$project$Data$Internal$NodeTypes$Fn,
			id,
			name,
			A2(
				$elm$core$List$map,
				function (n) {
					return {jD: $elm$core$Maybe$Nothing, jG: n};
				},
				args));
	});
var $author$project$Expression$Node$decodeLitValue = A2(
	$elm$json$Json$Decode$andThen,
	function (v) {
		switch (v.$) {
			case 0:
				return $elm$json$Json$Decode$succeed(v);
			case 1:
				return $elm$json$Json$Decode$succeed(v);
			case 2:
				return $elm$json$Json$Decode$succeed(v);
			case 3:
				return $elm$json$Json$Decode$succeed(v);
			default:
				return $elm$json$Json$Decode$fail('a lit value must be a number, text, bool or date Value');
		}
	},
	$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Value$codec));
var $author$project$Data$Internal$NodeTypes$Incomplete = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Data$Internal$NodeTypes$Missing = {$: 0};
var $author$project$Data$Internal$NodeTypes$Unparseable = function (a) {
	return {$: 1, a: a};
};
var $author$project$Data$Internal$NodeTypes$ExpectedGroup = 1;
var $author$project$Data$Internal$NodeTypes$ExpectedString = 0;
var $author$project$Data$Internal$NodeTypes$ExpectedTemplate = 2;
var $author$project$Generated$AstTags$expectedKindFromTag = function (tag) {
	switch (tag) {
		case 'string':
			return $elm$core$Maybe$Just(0);
		case 'group':
			return $elm$core$Maybe$Just(1);
		case 'template':
			return $elm$core$Maybe$Just(2);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Expression$Node$decodeExpectedKind = function (s) {
	var _v0 = $author$project$Generated$AstTags$expectedKindFromTag(s);
	if (!_v0.$) {
		var kind = _v0.a;
		return $elm$json$Json$Decode$succeed(kind);
	} else {
		return $elm$json$Json$Decode$fail('Unknown expected kind: ' + s);
	}
};
var $author$project$Expression$Node$decodePlaceholderError = A2(
	$elm$json$Json$Decode$andThen,
	function (t) {
		switch (t) {
			case 'missing':
				return $elm$json$Json$Decode$succeed($author$project$Data$Internal$NodeTypes$Missing);
			case 'unparseable':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Data$Internal$NodeTypes$Unparseable,
					A2($elm$json$Json$Decode$field, 'text', $elm$json$Json$Decode$string));
			case 'incomplete':
				return A3(
					$elm$json$Json$Decode$map2,
					$author$project$Data$Internal$NodeTypes$Incomplete,
					A2($elm$json$Json$Decode$field, 'text', $elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$andThen,
						$author$project$Expression$Node$decodeExpectedKind,
						A2($elm$json$Json$Decode$field, 'expected', $elm$json$Json$Decode$string)));
			default:
				return $elm$json$Json$Decode$fail('Unknown placeholder error type: ' + t);
		}
	},
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Data$Internal$NodeTypes$CStyleCall = 6;
var $author$project$Data$Internal$NodeTypes$ImplicitMultiplication = 5;
var $author$project$Data$Internal$NodeTypes$MissingCloseDelim = 3;
var $author$project$Data$Internal$NodeTypes$MissingComma = 2;
var $author$project$Data$Internal$NodeTypes$MissingOperator = 0;
var $author$project$Data$Internal$NodeTypes$MissingSeparator = 1;
var $author$project$Data$Internal$NodeTypes$TrailingGarbage = 4;
var $author$project$Data$Internal$NodeTypes$UnknownOperator = 7;
var $author$project$Generated$AstTags$seqHintFromTag = function (tag) {
	switch (tag) {
		case 'missingOperator':
			return $elm$core$Maybe$Just(0);
		case 'missingSeparator':
			return $elm$core$Maybe$Just(1);
		case 'missingComma':
			return $elm$core$Maybe$Just(2);
		case 'missingCloseDelim':
			return $elm$core$Maybe$Just(3);
		case 'trailingGarbage':
			return $elm$core$Maybe$Just(4);
		case 'implicitMultiplication':
			return $elm$core$Maybe$Just(5);
		case 'cStyleCall':
			return $elm$core$Maybe$Just(6);
		case 'unknownOperator':
			return $elm$core$Maybe$Just(7);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Expression$Node$decodeSeqError = A2(
	$elm$json$Json$Decode$andThen,
	function (maybeHint) {
		if (maybeHint.$ === 1) {
			return $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing);
		} else {
			var hintStr = maybeHint.a;
			var _v1 = $author$project$Generated$AstTags$seqHintFromTag(hintStr);
			if (!_v1.$) {
				var hint = _v1.a;
				return $elm$json$Json$Decode$succeed(
					$elm$core$Maybe$Just(hint));
			} else {
				return $elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing);
			}
		}
	},
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'hint', $elm$json$Json$Decode$string)));
var $author$project$Data$Internal$Identifier$Input = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Data$Internal$Identifier$KeyRef = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Expression$Identifier$buildKeyPath = function (segments) {
	if (!segments.b) {
		return A2($author$project$Data$Internal$Identifier$KeyRef, '', $elm$core$Maybe$Nothing);
	} else {
		if (!segments.b.b) {
			var last = segments.a;
			return A2($author$project$Data$Internal$Identifier$KeyRef, last, $elm$core$Maybe$Nothing);
		} else {
			var head = segments.a;
			var rest = segments.b;
			return A2(
				$author$project$Data$Internal$Identifier$KeyRef,
				head,
				$elm$core$Maybe$Just(
					$author$project$Expression$Identifier$buildKeyPath(rest)));
		}
	}
};
var $author$project$Util$Basics$flip = F3(
	function (fn, a, b) {
		return A2(fn, b, a);
	});
var $author$project$Expression$Identifier$fromId = A2($author$project$Util$Basics$flip, $author$project$Data$Internal$Identifier$Input, $elm$core$Maybe$Nothing);
var $author$project$Expression$Identifier$fromString = function (s) {
	var _v0 = A2($elm$core$String$split, '.', s);
	if (!_v0.b) {
		return $author$project$Expression$Identifier$fromId('');
	} else {
		if (!_v0.b.b) {
			var single = _v0.a;
			return $author$project$Expression$Identifier$fromId(single);
		} else {
			var head = _v0.a;
			var rest = _v0.b;
			return A2(
				$author$project$Data$Internal$Identifier$Input,
				head,
				$elm$core$Maybe$Just(
					$author$project$Expression$Identifier$buildKeyPath(rest)));
		}
	}
};
var $author$project$Expression$Node$decodeByKind = function (kind) {
	var idField = A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string);
	switch (kind) {
		case 'ident':
			return A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (id, name) {
						return A2(
							$author$project$Data$Internal$NodeTypes$Ident,
							id,
							$author$project$Expression$Identifier$fromString(name));
					}),
				idField,
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
		case 'lit':
			return A4(
				$elm$json$Json$Decode$map3,
				$author$project$Data$Internal$NodeTypes$Lit,
				idField,
				A2($elm$json$Json$Decode$field, 'value', $author$project$Expression$Node$decodeLitValue),
				$elm$json$Json$Decode$maybe(
					A2($elm$json$Json$Decode$field, 'raw', $elm$json$Json$Decode$string)));
		case 'op':
			return A5(
				$elm$json$Json$Decode$map4,
				$author$project$Data$Internal$NodeTypes$Op,
				idField,
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
				A2(
					$elm$json$Json$Decode$field,
					'left',
					$elm$json$Json$Decode$lazy(
						function (_v3) {
							return $author$project$Expression$Node$cyclic$decode();
						})),
				A2(
					$elm$json$Json$Decode$field,
					'right',
					$elm$json$Json$Decode$lazy(
						function (_v4) {
							return $author$project$Expression$Node$cyclic$decode();
						})));
		case 'unary':
			return A4(
				$elm$json$Json$Decode$map3,
				$author$project$Data$Internal$NodeTypes$Unary,
				idField,
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
				A2(
					$elm$json$Json$Decode$field,
					'operand',
					$elm$json$Json$Decode$lazy(
						function (_v5) {
							return $author$project$Expression$Node$cyclic$decode();
						})));
		case 'group':
			return A3(
				$elm$json$Json$Decode$map2,
				$author$project$Data$Internal$NodeTypes$Group,
				idField,
				A2(
					$elm$json$Json$Decode$field,
					'child',
					$elm$json$Json$Decode$lazy(
						function (_v6) {
							return $author$project$Expression$Node$cyclic$decode();
						})));
		case 'fn':
			return A4(
				$elm$json$Json$Decode$map3,
				$author$project$Expression$Node$decodeFn,
				idField,
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
				A2(
					$elm$json$Json$Decode$field,
					'args',
					$elm$json$Json$Decode$list(
						$elm$json$Json$Decode$lazy(
							function (_v7) {
								return $author$project$Expression$Node$cyclic$decode();
							}))));
		case 'placeholder':
			return A3(
				$elm$json$Json$Decode$map2,
				$author$project$Data$Internal$NodeTypes$Placeholder,
				idField,
				A2($elm$json$Json$Decode$field, 'error', $author$project$Expression$Node$decodePlaceholderError));
		case 'seq':
			return A5(
				$elm$json$Json$Decode$map4,
				$author$project$Data$Internal$NodeTypes$Seq,
				idField,
				A2(
					$elm$json$Json$Decode$field,
					'left',
					$elm$json$Json$Decode$lazy(
						function (_v8) {
							return $author$project$Expression$Node$cyclic$decode();
						})),
				A2(
					$elm$json$Json$Decode$field,
					'right',
					$elm$json$Json$Decode$lazy(
						function (_v9) {
							return $author$project$Expression$Node$cyclic$decode();
						})),
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$Maybe$andThen($elm$core$Basics$identity),
					$elm$json$Json$Decode$maybe(
						A2($elm$json$Json$Decode$field, 'error', $author$project$Expression$Node$decodeSeqError))));
		case 'pipe':
			return A4(
				$elm$json$Json$Decode$map3,
				$author$project$Data$Internal$NodeTypes$Pipe,
				idField,
				A2(
					$elm$json$Json$Decode$field,
					'input',
					$elm$json$Json$Decode$lazy(
						function (_v10) {
							return $author$project$Expression$Node$cyclic$decode();
						})),
				A2(
					$elm$json$Json$Decode$field,
					'fn',
					$elm$json$Json$Decode$lazy(
						function (_v11) {
							return $author$project$Expression$Node$cyclic$decode();
						})));
		case 'field':
			return A4(
				$elm$json$Json$Decode$map3,
				$author$project$Data$Internal$NodeTypes$Field,
				idField,
				A2(
					$elm$json$Json$Decode$field,
					'target',
					$elm$json$Json$Decode$lazy(
						function (_v12) {
							return $author$project$Expression$Node$cyclic$decode();
						})),
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
		case 'template':
			return A3(
				$elm$json$Json$Decode$map2,
				$author$project$Data$Internal$NodeTypes$Template,
				idField,
				A2(
					$elm$json$Json$Decode$map,
					$elm$core$List$concat,
					A2(
						$elm$json$Json$Decode$field,
						'parts',
						$elm$json$Json$Decode$list(
							$author$project$Expression$Node$cyclic$templatePartDecoder()))));
		default:
			return $elm$json$Json$Decode$fail('Unknown node kind: ' + kind);
	}
};
function $author$project$Expression$Node$cyclic$decode() {
	return A2(
		$elm$json$Json$Decode$andThen,
		$author$project$Expression$Node$decodeByKind,
		A2($elm$json$Json$Decode$field, 'kind', $elm$json$Json$Decode$string));
}
function $author$project$Expression$Node$cyclic$templatePartDecoder() {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (kind) {
			switch (kind) {
				case 'text':
					return A2(
						$elm$json$Json$Decode$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$toList,
							$elm$core$List$map($author$project$Data$Internal$NodeTypes$TplChar)),
						A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string));
				case 'expr':
					return A2(
						$elm$json$Json$Decode$map,
						A2($elm$core$Basics$composeR, $author$project$Data$Internal$NodeTypes$TplNode, $elm$core$List$singleton),
						A2(
							$elm$json$Json$Decode$field,
							'node',
							$elm$json$Json$Decode$lazy(
								function (_v1) {
									return $author$project$Expression$Node$cyclic$decode();
								})));
				default:
					return $elm$json$Json$Decode$fail('Unknown template part kind: ' + kind);
			}
		},
		A2($elm$json$Json$Decode$field, 'kind', $elm$json$Json$Decode$string));
}
var $author$project$Expression$Node$decode = $author$project$Expression$Node$cyclic$decode();
$author$project$Expression$Node$cyclic$decode = function () {
	return $author$project$Expression$Node$decode;
};
var $author$project$Expression$Node$templatePartDecoder = $author$project$Expression$Node$cyclic$templatePartDecoder();
$author$project$Expression$Node$cyclic$templatePartDecoder = function () {
	return $author$project$Expression$Node$templatePartDecoder;
};
var $author$project$Expression$ToSurface$IdMap = $elm$core$Basics$identity;
var $author$project$Expression$ToSurface$nodeId = function (node) {
	switch (node.$) {
		case 0:
			var id = node.a;
			return id;
		case 1:
			var id = node.a;
			return id;
		case 2:
			var id = node.a;
			return id;
		case 3:
			var id = node.a;
			return id;
		case 4:
			var id = node.a;
			return id;
		case 5:
			var id = node.a;
			return id;
		case 6:
			var id = node.a;
			return id;
		case 7:
			var id = node.a;
			return id;
		case 8:
			var id = node.a;
			return id;
		case 9:
			var id = node.a;
			return id;
		default:
			var id = node.a;
			return id;
	}
};
var $author$project$Expression$ToSurface$syntheticFieldIds = F2(
	function (id, name) {
		var count = $elm$core$List$length(
			A2($elm$core$String$split, '.', name));
		return A2(
			$elm$core$List$map,
			function (k) {
				return _Utils_Tuple2(
					id + ('#' + $elm$core$String$fromInt(k)),
					id);
			},
			A2($elm$core$List$range, 1, count - 1));
	});
var $author$project$Expression$ToSurface$keys = function (path) {
	keys:
	while (true) {
		if (!path.$) {
			if (!path.a.$) {
				var _v1 = path.a;
				var key = _v1.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					key,
					$author$project$Expression$ToSurface$keys(rest));
			} else {
				var rest = path.a.a;
				var $temp$path = rest;
				path = $temp$path;
				continue keys;
			}
		} else {
			return _List_Nil;
		}
	}
};
var $author$project$Expression$ToSurface$syntheticIds = F2(
	function (id, identifier) {
		var count = function () {
			var path = identifier.b;
			return $elm$core$List$length(
				$author$project$Expression$ToSurface$keys(path));
		}();
		return (!count) ? _List_Nil : A2(
			$elm$core$List$map,
			function (k) {
				return _Utils_Tuple2(
					id + ('#' + $elm$core$String$fromInt(k)),
					id);
			},
			A2($elm$core$List$range, 0, count - 1));
	});
var $author$project$Expression$ToSurface$syntheticNames = function (node) {
	switch (node.$) {
		case 0:
			var id = node.a;
			var identifier = node.b;
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($author$project$Expression$ToSurface$syntheticIds, id, identifier));
		case 10:
			var id = node.a;
			var name = node.c;
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($author$project$Expression$ToSurface$syntheticFieldIds, id, name));
		default:
			return _List_Nil;
	}
};
var $author$project$Expression$ToSurface$descendantIds = function (node) {
	switch (node.$) {
		case 0:
			return _List_Nil;
		case 1:
			return _List_Nil;
		case 6:
			return _List_Nil;
		case 2:
			var l = node.c;
			var r = node.d;
			return _Utils_ap(
				$author$project$Expression$ToSurface$subtree(l),
				$author$project$Expression$ToSurface$subtree(r));
		case 3:
			var x = node.c;
			return $author$project$Expression$ToSurface$subtree(x);
		case 4:
			var x = node.b;
			return $author$project$Expression$ToSurface$subtree(x);
		case 5:
			var args = node.c;
			return A2(
				$elm$core$List$concatMap,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.jG;
					},
					$author$project$Expression$ToSurface$subtree),
				args);
		case 7:
			var l = node.b;
			var r = node.c;
			return _Utils_ap(
				$author$project$Expression$ToSurface$subtree(l),
				$author$project$Expression$ToSurface$subtree(r));
		case 9:
			var input = node.b;
			var stage = node.c;
			return _Utils_ap(
				$author$project$Expression$ToSurface$subtree(input),
				$author$project$Expression$ToSurface$subtree(stage));
		case 10:
			var target = node.b;
			return $author$project$Expression$ToSurface$subtree(target);
		default:
			var values = node.b;
			return A2(
				$elm$core$List$concatMap,
				function (v) {
					if (!v.$) {
						return _List_Nil;
					} else {
						var child = v.a;
						return $author$project$Expression$ToSurface$subtree(child);
					}
				},
				values);
	}
};
var $author$project$Expression$ToSurface$subtree = function (node) {
	return A2(
		$elm$core$List$cons,
		$author$project$Expression$ToSurface$nodeId(node),
		_Utils_ap(
			$author$project$Expression$ToSurface$syntheticNames(node),
			$author$project$Expression$ToSurface$descendantIds(node)));
};
var $author$project$Expression$ToSurface$absorb = F2(
	function (surfaceId, node) {
		return A2(
			$elm$core$List$map,
			function (d) {
				return _Utils_Tuple2(d, surfaceId);
			},
			$author$project$Expression$ToSurface$descendantIds(node));
	});
var $author$project$Generated$Operators$Left = 0;
var $author$project$Generated$Operators$Right = 1;
var $author$project$Generated$Operators$binary = _List_fromArray(
	[
		{hE: _List_Nil, hU: 0, id: '*', I: '×', j7: 20, kv: 'mul', L: 'Multiply'},
		{hE: _List_Nil, hU: 0, id: '/', I: '÷', j7: 20, kv: 'div', L: 'Divide'},
		{hE: _List_Nil, hU: 0, id: '%', I: '%', j7: 20, kv: 'mod', L: 'Modulo'},
		{hE: _List_Nil, hU: 1, id: '^', I: '^', j7: 35, kv: 'pow', L: 'Power'},
		{hE: _List_Nil, hU: 0, id: '+', I: '+', j7: 10, kv: 'add', L: 'Add'},
		{hE: _List_Nil, hU: 0, id: '-', I: '-', j7: 10, kv: 'sub', L: 'Subtract'},
		{hE: _List_Nil, hU: 0, id: '=', I: '=', j7: 5, kv: 'eq', L: 'Equals'},
		{hE: _List_Nil, hU: 0, id: '!=', I: '≠', j7: 5, kv: 'neq', L: 'Not Equal To'},
		{hE: _List_Nil, hU: 0, id: '/=', I: '≠', j7: 5, kv: 'neq', L: 'Not Equal To'},
		{hE: _List_Nil, hU: 0, id: '<=', I: '≤', j7: 6, kv: 'lte', L: 'Less Than or Equal To'},
		{hE: _List_Nil, hU: 0, id: '>=', I: '≥', j7: 6, kv: 'gte', L: 'Greater Than or Equal To'},
		{hE: _List_Nil, hU: 0, id: '<', I: '<', j7: 7, kv: 'lt', L: 'Less Than'},
		{hE: _List_Nil, hU: 0, id: '>', I: '>', j7: 7, kv: 'gt', L: 'Greater Than'},
		{
		hE: _List_fromArray(
			['and', '&&']),
		hU: 0,
		id: '&',
		I: '&',
		j7: 3,
		kv: 'and',
		L: 'And'
	},
		{
		hE: _List_fromArray(
			['or', '||']),
		hU: 0,
		id: '|',
		I: 'or',
		j7: 2,
		kv: 'or',
		L: 'Or'
	}
	]);
var $author$project$Expression$ToSurface$binarySig = function (name) {
	return A2(
		$elm$core$Maybe$map,
		function ($) {
			return $.kv;
		},
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (o) {
					return _Utils_eq(o.id, name) || A2($elm$core$List$member, name, o.hE);
				},
				$author$project$Generated$Operators$binary)));
};
var $author$project$Expression$ToSurface$stepId = F3(
	function (id, total, k) {
		return _Utils_eq(k, total) ? id : (id + ('#' + $elm$core$String$fromInt(k)));
	});
var $author$project$Expression$ToSurface$convertField = F3(
	function (id, target, name) {
		var steps = A2($elm$core$String$split, '.', name);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, inner) {
					var i = _v0.a;
					var key = _v0.b;
					return A3(
						$author$project$Typesystem$Surface$SField,
						A3(
							$author$project$Expression$ToSurface$stepId,
							id,
							$elm$core$List$length(steps),
							i + 1),
						inner,
						$author$project$Typesystem$Surface$ByName(key));
				}),
			target,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, steps));
	});
var $author$project$Expression$ToSurface$convertIdentifier = F2(
	function (id, identifier) {
		var _v0 = function () {
			var head = identifier.a;
			var path = identifier.b;
			return _Utils_Tuple2(
				head,
				$author$project$Expression$ToSurface$keys(path));
		}();
		var root = _v0.a;
		var steps = _v0.b;
		var _v2 = _Utils_Tuple2(identifier, steps);
		_v2$2:
		while (true) {
			if (_v2.a.b.$ === 1) {
				switch (_v2.a.a) {
					case 'true':
						var _v3 = _v2.a;
						var _v4 = _v3.b;
						return A2(
							$author$project$Typesystem$Surface$SLit,
							id,
							$author$project$Typesystem$Value$VBool(true));
					case 'false':
						var _v5 = _v2.a;
						var _v6 = _v5.b;
						return A2(
							$author$project$Typesystem$Surface$SLit,
							id,
							$author$project$Typesystem$Value$VBool(false));
					default:
						break _v2$2;
				}
			} else {
				break _v2$2;
			}
		}
		if (!steps.b) {
			return A2(
				$author$project$Typesystem$Surface$SRef,
				id,
				$author$project$Typesystem$Surface$ByName(root));
		} else {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (_v8, target) {
						var i = _v8.a;
						var key = _v8.b;
						return A3(
							$author$project$Typesystem$Surface$SField,
							A3(
								$author$project$Expression$ToSurface$stepId,
								id,
								$elm$core$List$length(steps),
								i + 1),
							target,
							$author$project$Typesystem$Surface$ByName(key));
					}),
				A2(
					$author$project$Typesystem$Surface$SRef,
					id + '#0',
					$author$project$Typesystem$Surface$ByName(root)),
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, steps));
		}
	});
var $author$project$Typesystem$Surface$nodeId = function (surface) {
	switch (surface.$) {
		case 0:
			var id = surface.a;
			return id;
		case 1:
			var id = surface.a;
			return id;
		case 2:
			var id = surface.a;
			return id;
		case 3:
			var id = surface.a;
			return id;
		case 4:
			var id = surface.a;
			return id;
		case 5:
			var id = surface.a;
			return id;
		case 6:
			var id = surface.a;
			return id;
		case 7:
			var id = surface.a;
			return id;
		case 8:
			var id = surface.a;
			return id;
		case 9:
			var id = surface.a;
			return id;
		case 10:
			var id = surface.a;
			return id;
		default:
			var id = surface.a;
			return id;
	}
};
var $author$project$Expression$ToSurface$positional = function (value) {
	return {f1: $elm$core$Maybe$Nothing, hp: value};
};
var $author$project$Generated$Operators$unarySigs = _List_fromArray(
	[
		_Utils_Tuple2('-', 'neg')
	]);
var $author$project$Expression$ToSurface$convert = function (node) {
	switch (node.$) {
		case 0:
			var id = node.a;
			var identifier = node.b;
			return _Utils_Tuple2(
				A2($author$project$Expression$ToSurface$convertIdentifier, id, identifier),
				A2($author$project$Expression$ToSurface$syntheticIds, id, identifier));
		case 1:
			var id = node.a;
			var value = node.b;
			return _Utils_Tuple2(
				A2($author$project$Typesystem$Surface$SLit, id, value),
				_List_Nil);
		case 2:
			var id = node.a;
			var name = node.b;
			var left = node.c;
			var right = node.d;
			var callee = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Typesystem$Surface$ByName(name),
				A2(
					$elm$core$Maybe$map,
					$author$project$Typesystem$Surface$ById,
					$author$project$Expression$ToSurface$binarySig(name)));
			var _v8 = $author$project$Expression$ToSurface$convert(right);
			var r = _v8.a;
			var rp = _v8.b;
			var _v9 = $author$project$Expression$ToSurface$convert(left);
			var l = _v9.a;
			var lp = _v9.b;
			return _Utils_Tuple2(
				A3(
					$author$project$Typesystem$Surface$SCall,
					id,
					callee,
					_List_fromArray(
						[
							$author$project$Expression$ToSurface$positional(l),
							$author$project$Expression$ToSurface$positional(r)
						])),
				_Utils_ap(lp, rp));
		case 3:
			var id = node.a;
			var name = node.b;
			var operand = node.c;
			var callee = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Typesystem$Surface$ByName(name),
				A2(
					$elm$core$Maybe$map,
					A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Typesystem$Surface$ById),
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (_v11) {
								var spelling = _v11.a;
								return _Utils_eq(spelling, name);
							},
							$author$project$Generated$Operators$unarySigs))));
			var _v10 = $author$project$Expression$ToSurface$convert(operand);
			var x = _v10.a;
			var xp = _v10.b;
			return _Utils_Tuple2(
				A3(
					$author$project$Typesystem$Surface$SCall,
					id,
					callee,
					_List_fromArray(
						[
							$author$project$Expression$ToSurface$positional(x)
						])),
				xp);
		case 4:
			var id = node.a;
			var child = node.b;
			var _v12 = $author$project$Expression$ToSurface$convert(child);
			var c = _v12.a;
			var cp = _v12.b;
			return _Utils_Tuple2(
				c,
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						id,
						$author$project$Typesystem$Surface$nodeId(c)),
					cp));
		case 5:
			if (node.b === '[]') {
				var id = node.a;
				var args = node.c;
				var _v13 = $author$project$Expression$ToSurface$convertAll(
					A2(
						$elm$core$List$map,
						function ($) {
							return $.jG;
						},
						args));
				var items = _v13.a;
				var ip = _v13.b;
				return _Utils_Tuple2(
					A2($author$project$Typesystem$Surface$SList, id, items),
					ip);
			} else {
				var id = node.a;
				var name = node.b;
				var args = node.c;
				var _v14 = $author$project$Expression$ToSurface$convertAll(
					A2(
						$elm$core$List$map,
						function ($) {
							return $.jG;
						},
						args));
				var values = _v14.a;
				var vp = _v14.b;
				var surfaceArgs = A3(
					$elm$core$List$map2,
					F2(
						function (arg, value) {
							return {
								f1: A2($elm$core$Maybe$map, $author$project$Typesystem$Surface$ByName, arg.jD),
								hp: value
							};
						}),
					args,
					values);
				return _Utils_Tuple2(
					A3(
						$author$project$Typesystem$Surface$SCall,
						id,
						$author$project$Typesystem$Surface$ByName(name),
						surfaceArgs),
					vp);
			}
		case 6:
			var id = node.a;
			return _Utils_Tuple2(
				$author$project$Typesystem$Surface$SMissing(id),
				_List_Nil);
		case 7:
			var id = node.a;
			return _Utils_Tuple2(
				$author$project$Typesystem$Surface$SMissing(id),
				A2($author$project$Expression$ToSurface$absorb, id, node));
		case 8:
			var id = node.a;
			var parts = node.b;
			return A2($author$project$Expression$ToSurface$convertTemplate, id, parts);
		case 9:
			var id = node.a;
			var input = node.b;
			var stage = node.c;
			var _v15 = $author$project$Expression$ToSurface$convert(input);
			var i = _v15.a;
			var ip = _v15.b;
			var _v16 = $author$project$Expression$ToSurface$convert(stage);
			var f = _v16.a;
			var fp = _v16.b;
			return _Utils_Tuple2(
				A3($author$project$Typesystem$Surface$SPipe, id, i, f),
				_Utils_ap(ip, fp));
		default:
			var id = node.a;
			var target = node.b;
			var name = node.c;
			var _v17 = $author$project$Expression$ToSurface$convert(target);
			var t = _v17.a;
			var tp = _v17.b;
			return _Utils_Tuple2(
				A3($author$project$Expression$ToSurface$convertField, id, t, name),
				_Utils_ap(
					A2($author$project$Expression$ToSurface$syntheticFieldIds, id, name),
					tp));
	}
};
var $author$project$Expression$ToSurface$convertAll = function (nodes) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (n, _v5) {
				var surfaces = _v5.a;
				var pairs = _v5.b;
				var _v6 = $author$project$Expression$ToSurface$convert(n);
				var s = _v6.a;
				var p = _v6.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, s, surfaces),
					_Utils_ap(p, pairs));
			}),
		_Utils_Tuple2(_List_Nil, _List_Nil),
		nodes);
};
var $author$project$Expression$ToSurface$convertTemplate = F2(
	function (id, values) {
		var _v0 = A3(
			$elm$core$List$foldr,
			F2(
				function (value, _v1) {
					var acc = _v1.a;
					var ps = _v1.b;
					if (!value.$) {
						var c = value.a;
						if (acc.b && (!acc.a.$)) {
							var s = acc.a.a;
							var rest = acc.b;
							return _Utils_Tuple2(
								A2(
									$elm$core$List$cons,
									$author$project$Typesystem$Surface$TPText(
										_Utils_ap(
											$elm$core$String$fromChar(c),
											s)),
									rest),
								ps);
						} else {
							return _Utils_Tuple2(
								A2(
									$elm$core$List$cons,
									$author$project$Typesystem$Surface$TPText(
										$elm$core$String$fromChar(c)),
									acc),
								ps);
						}
					} else {
						var child = value.a;
						var _v4 = $author$project$Expression$ToSurface$convert(child);
						var s = _v4.a;
						var p = _v4.b;
						return _Utils_Tuple2(
							A2(
								$elm$core$List$cons,
								$author$project$Typesystem$Surface$TPExpr(s),
								acc),
							_Utils_ap(p, ps));
					}
				}),
			_Utils_Tuple2(_List_Nil, _List_Nil),
			values);
		var parts = _v0.a;
		var pairs = _v0.b;
		return _Utils_Tuple2(
			A2($author$project$Typesystem$Surface$STemplate, id, parts),
			pairs);
	});
var $author$project$Expression$ToSurface$children = function (node) {
	switch (node.$) {
		case 0:
			return _List_Nil;
		case 1:
			return _List_Nil;
		case 6:
			return _List_Nil;
		case 2:
			var l = node.c;
			var r = node.d;
			return _List_fromArray(
				[l, r]);
		case 3:
			var x = node.c;
			return _List_fromArray(
				[x]);
		case 4:
			var x = node.b;
			return _List_fromArray(
				[x]);
		case 5:
			var args = node.c;
			return A2(
				$elm$core$List$map,
				function ($) {
					return $.jG;
				},
				args);
		case 7:
			var l = node.b;
			var r = node.c;
			return _List_fromArray(
				[l, r]);
		case 9:
			var input = node.b;
			var stage = node.c;
			return _List_fromArray(
				[input, stage]);
		case 10:
			var target = node.b;
			return _List_fromArray(
				[target]);
		default:
			var values = node.b;
			return A2(
				$elm$core$List$filterMap,
				function (v) {
					if (!v.$) {
						return $elm$core$Maybe$Nothing;
					} else {
						var child = v.a;
						return $elm$core$Maybe$Just(child);
					}
				},
				values);
	}
};
var $author$project$Expression$ToSurface$seqHints = function (node) {
	var own = function () {
		if ((node.$ === 7) && (!node.d.$)) {
			var id = node.a;
			var h = node.d.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(id, h)
				]);
		} else {
			return _List_Nil;
		}
	}();
	return _Utils_ap(
		own,
		A2(
			$elm$core$List$concatMap,
			$author$project$Expression$ToSurface$seqHints,
			$author$project$Expression$ToSurface$children(node)));
};
var $author$project$Expression$ToSurface$fromNode = function (node) {
	var _v0 = $author$project$Expression$ToSurface$convert(node);
	var surface = _v0.a;
	var pairs = _v0.b;
	return _Utils_Tuple2(
		surface,
		{
			hE: $elm$core$Dict$fromList(pairs),
			d1: $elm$core$Dict$fromList(
				$author$project$Expression$ToSurface$seqHints(node))
		});
};
var $author$project$Try$runDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Try$RunRequest,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$map,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Expression$ToSurface$fromNode,
					A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$Result$Ok)),
				A2($elm$json$Json$Decode$field, 'node', $author$project$Expression$Node$decode)),
				A2(
				$elm$json$Json$Decode$map,
				$elm$core$Result$Ok,
				A2(
					$elm$json$Json$Decode$field,
					'surface',
					$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Surface$codec))),
				$elm$json$Json$Decode$fail('run needs a node or a surface')
			])),
	A2(
		$elm$json$Json$Decode$field,
		'choices',
		$elm$json$Json$Decode$dict($author$project$Typesystem$Wire$Type$groundDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'alignments',
		$elm$json$Json$Decode$dict(
			$author$project$Typesystem$Wire$Codec$decoder($author$project$Typesystem$Wire$Algebra$alignmentCodec))));
var $author$project$Typesystem$Budget$defaultBudget = 100000;
var $author$project$Typesystem$Unify$empty = {e9: $elm$core$Dict$empty, ho: $elm$core$Dict$empty};
var $author$project$Typesystem$Types$emptyOrigins = {e9: $elm$core$Dict$empty, ho: $elm$core$Dict$empty};
var $author$project$Typesystem$Budget$new = function (limit) {
	return {eg: limit, bZ: 0};
};
var $author$project$Typesystem$Infer$State$initial = {
	e7: $elm$core$Dict$empty,
	dM: $elm$core$Dict$empty,
	b6: $author$project$Typesystem$Budget$new($author$project$Typesystem$Budget$defaultBudget),
	U: _List_Nil,
	cf: _List_Nil,
	aS: _List_Nil,
	gx: 0,
	aa: $author$project$Typesystem$Types$emptyOrigins,
	eN: _List_Nil,
	kC: {c4: 0, $7: 0, dz: 0},
	hd: _List_Nil,
	bl: $author$project$Typesystem$Unify$empty,
	bZ: $elm$core$Set$empty
};
var $author$project$Typesystem$Infer$State$initialFor = function (env) {
	return _Utils_update(
		$author$project$Typesystem$Infer$State$initial,
		{
			b6: $author$project$Typesystem$Budget$new(env.b6)
		});
};
var $author$project$Typesystem$Infer$initialFor = $author$project$Typesystem$Infer$State$initialFor;
var $author$project$Typesystem$Budget$exhausted = function (budget) {
	return _Utils_cmp(budget.bZ, budget.eg) > 0;
};
var $author$project$Typesystem$Choice$narrowLimit = 64;
var $elm$core$List$product = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$mul, 1, numbers);
};
var $author$project$Typesystem$Choice$remember = F2(
	function (p, seen) {
		return A2(
			$elm$core$List$any,
			function (q) {
				return _Utils_eq(q.jG, p.jG);
			},
			seen) ? A2(
			$elm$core$List$map,
			function (q) {
				return _Utils_eq(q.jG, p.jG) ? _Utils_update(
					q,
					{
						jZ: _Utils_ap(
							q.jZ,
							A2(
								$elm$core$List$filter,
								function (o) {
									return !A2(
										$elm$core$List$any,
										A2(
											$elm$core$Basics$composeR,
											function ($) {
												return $.jn;
											},
											$elm$core$Basics$eq(o.jn)),
										q.jZ);
								},
								p.jZ))
					}) : q;
			},
			seen) : _Utils_ap(
			seen,
			_List_fromArray(
				[p]));
	});
var $author$project$Typesystem$Choice$explore = F4(
	function (run, assigned, current, search) {
		var seen = A3($elm$core$List$foldl, $author$project$Typesystem$Choice$remember, search.bj, current.gO);
		var pending = A2(
			$elm$core$List$filter,
			function (p) {
				return !A2(
					$elm$core$List$any,
					function (_v4) {
						var a = _v4.a;
						return _Utils_eq(a.jG, p.jG);
					},
					assigned);
			},
			current.gO);
		var space = $elm$core$List$product(
			_Utils_ap(
				A2(
					$elm$core$List$map,
					function (_v3) {
						var p = _v3.a;
						return $elm$core$List$length(p.jZ);
					},
					assigned),
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.jZ;
						},
						$elm$core$List$length),
					pending)));
		if (search.aK || (_Utils_cmp(space, $author$project$Typesystem$Choice$narrowLimit) > 0)) {
			return _Utils_update(
				search,
				{aK: true});
		} else {
			if (!pending.b) {
				return current.lb ? _Utils_update(
					search,
					{
						bj: seen,
						lb: _Utils_ap(
							search.lb,
							_List_fromArray(
								[
									_Utils_Tuple2(assigned, current)
								]))
					}) : _Utils_update(
					search,
					{bj: seen});
			} else {
				var point = pending.a;
				return A3(
					$elm$core$List$foldl,
					F2(
						function (option, acc) {
							if (acc.aK || $author$project$Typesystem$Budget$exhausted(acc.b6)) {
								return _Utils_update(
									acc,
									{aK: true});
							} else {
								var next = _Utils_ap(
									assigned,
									_List_fromArray(
										[
											_Utils_Tuple2(point, option)
										]));
								var _v1 = A2(
									run,
									$elm$core$Dict$fromList(
										A2(
											$elm$core$List$map,
											function (_v2) {
												var p = _v2.a;
												var o = _v2.b;
												return _Utils_Tuple2(p.jG, o.dy);
											},
											next)),
									acc.b6);
								var r = _v1.a;
								var b = _v1.b;
								return A4(
									$author$project$Typesystem$Choice$explore,
									run,
									next,
									r,
									_Utils_update(
										acc,
										{
											b6: b,
											a8: _Utils_ap(
												acc.a8,
												A2(
													$elm$core$List$filter,
													function (n) {
														return !(A2($elm$core$List$member, n, acc.d2) || A2($elm$core$List$member, n, acc.a8));
													},
													r.dq))
										}));
							}
						}),
					_Utils_update(
						search,
						{bj: seen}),
					point.jZ);
			}
		}
	});
var $author$project$Typesystem$Choice$reported = function (search) {
	return A2(
		$elm$core$List$filterMap,
		function (p) {
			var viableKeys = A2(
				$elm$core$List$concatMap,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$filter(
							function (_v0) {
								var a = _v0.a;
								return _Utils_eq(a.jG, p.jG);
							}),
						$elm$core$List$map(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$second,
								function ($) {
									return $.jn;
								})))),
				search.lb);
			var kept = A2(
				$elm$core$List$filter,
				function (o) {
					return A2($elm$core$List$member, o.jn, viableKeys);
				},
				p.jZ);
			return ($elm$core$List$length(kept) >= 2) ? $elm$core$Maybe$Just(
				_Utils_update(
					p,
					{jZ: kept})) : $elm$core$Maybe$Nothing;
		},
		search.bj);
};
var $author$project$Typesystem$Choice$narrow = F2(
	function (run, budget) {
		var _v0 = A3(run, _List_Nil, $elm$core$Dict$empty, budget);
		var _default = _v0.a;
		var afterDefault = _v0.b;
		var attempt = F2(
			function (ignored, b) {
				attempt:
				while (true) {
					var search = A4(
						$author$project$Typesystem$Choice$explore,
						run(ignored),
						_List_Nil,
						_default,
						{aK: false, b6: b, a8: _List_Nil, d2: ignored, bj: _List_Nil, lb: _List_Nil});
					if ($elm$core$List$isEmpty(search.lb) && ((!search.aK) && (!$elm$core$List$isEmpty(search.a8)))) {
						var $temp$ignored = _Utils_ap(ignored, search.a8),
							$temp$b = search.b6;
						ignored = $temp$ignored;
						b = $temp$b;
						continue attempt;
					} else {
						return _Utils_Tuple2(search, ignored);
					}
				}
			});
		var _v1 = A2(attempt, _default.dq, afterDefault);
		var found = _v1.a;
		var stale = _v1.b;
		var fallback = function (b) {
			return {b6: b, im: _default, gO: _default.gO, dq: _default.dq};
		};
		if (found.aK) {
			return fallback(found.b6);
		} else {
			var _v2 = found.lb;
			if (!_v2.b) {
				return fallback(found.b6);
			} else {
				var _v3 = _v2.a;
				var first = _v3.b;
				return {
					b6: found.b6,
					im: first,
					gO: $author$project$Typesystem$Choice$reported(found),
					dq: stale
				};
			}
		}
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $author$project$Typesystem$Diagnostic$MissingNode = {$: 4};
var $author$project$Typesystem$Diagnostic$code = function (problem) {
	switch (problem.$) {
		case 0:
			return 'type-mismatch';
		case 1:
			return 'unknown-name';
		case 2:
			return 'ambiguous-name';
		case 3:
			return 'ambiguous-arguments';
		case 4:
			return 'missing-node';
		case 5:
			return 'mixed-frame-kinds';
		case 6:
			return 'needs-narrowing';
		case 7:
			return 'not-a-function-slot';
		case 8:
			return 'occurs-check';
		case 9:
			return 'unknown-function';
		case 10:
			return 'unknown-selector';
		case 11:
			return 'unresolved-type';
		case 12:
			return 'too-complex';
		case 13:
			return 'bad-path';
		case 14:
			return 'wrong-arity';
		default:
			return 'nullable-key';
	}
};
var $author$project$Typesystem$Check$diagnostic = F2(
	function (node, problem) {
		return {
			ir: $author$project$Typesystem$Diagnostic$code(problem),
			iS: $elm$core$Maybe$Nothing,
			jG: node,
			gL: _List_Nil,
			j9: problem
		};
	});
var $author$project$Typesystem$Unify$applyAxis = F2(
	function (s, axis) {
		applyAxis:
		while (true) {
			if (axis.$ === 1) {
				var n = axis.a;
				var _v1 = A2($elm$core$Dict$get, n, s.e9);
				if (!_v1.$) {
					var bound = _v1.a;
					var $temp$s = s,
						$temp$axis = bound;
					s = $temp$s;
					axis = $temp$axis;
					continue applyAxis;
				} else {
					return axis;
				}
			} else {
				return axis;
			}
		}
	});
var $author$project$Typesystem$Unify$apply = F2(
	function (s, t) {
		apply:
		while (true) {
			switch (t.$) {
				case 9:
					var v = t.a;
					var _v2 = A2($elm$core$Dict$get, v, s.ho);
					if (!_v2.$) {
						var bound = _v2.a;
						var $temp$s = s,
							$temp$t = bound;
						s = $temp$s;
						t = $temp$t;
						continue apply;
					} else {
						return t;
					}
				case 4:
					var fields = t.a;
					return $author$project$Typesystem$Types$TRecord(
						A2(
							$elm$core$Dict$map,
							F2(
								function (_v3, f) {
									return A2($author$project$Typesystem$Unify$apply, s, f);
								}),
							fields));
				case 5:
					var id = t.a;
					var args = t.b;
					return A2(
						$author$project$Typesystem$Types$TNamed,
						id,
						A2(
							$elm$core$List$map,
							$author$project$Typesystem$Unify$apply(s),
							args));
				case 6:
					var ts = t.a;
					return $author$project$Typesystem$Types$union(
						A2(
							$elm$core$List$map,
							$author$project$Typesystem$Unify$apply(s),
							ts));
				case 7:
					var params = t.a;
					var result = t.b;
					return A2(
						$author$project$Typesystem$Types$TFn,
						A2(
							$elm$core$Dict$map,
							F2(
								function (_v4, p) {
									return A2($author$project$Typesystem$Unify$apply, s, p);
								}),
							params),
						A2($author$project$Typesystem$Unify$apply, s, result));
				case 8:
					var kind = t.a;
					var axis = t.b;
					var inner = t.c;
					return A3(
						$author$project$Typesystem$Types$TFrame,
						A2($author$project$Typesystem$Unify$applyKind, s, kind),
						A2($author$project$Typesystem$Unify$applyAxis, s, axis),
						A2($author$project$Typesystem$Unify$apply, s, inner));
				default:
					return t;
			}
		}
	});
var $author$project$Typesystem$Unify$applyKind = F2(
	function (s, kind) {
		if (!kind.$) {
			return $author$project$Typesystem$Types$ListF;
		} else {
			var key = kind.a;
			return $author$project$Typesystem$Types$DictF(
				A2($author$project$Typesystem$Unify$apply, s, key));
		}
	});
var $author$project$Typesystem$Check$collect = function (results) {
	return A3(
		$elm$core$List$foldr,
		F2(
			function (r, acc) {
				var _v0 = _Utils_Tuple2(r, acc);
				if (!_v0.a.$) {
					if (!_v0.b.$) {
						var x = _v0.a.a;
						var xs = _v0.b.a;
						return $elm$core$Result$Ok(
							A2($elm$core$List$cons, x, xs));
					} else {
						var es = _v0.b.a;
						return $elm$core$Result$Err(es);
					}
				} else {
					if (!_v0.b.$) {
						var e = _v0.a.a;
						return $elm$core$Result$Err(e);
					} else {
						var e = _v0.a.a;
						var es = _v0.b.a;
						return $elm$core$Result$Err(
							_Utils_ap(e, es));
					}
				}
			}),
		$elm$core$Result$Ok(_List_Nil),
		results);
};
var $author$project$Typesystem$Types$axisName = F2(
	function (origins, v) {
		var _v0 = A2($elm$core$Dict$get, v, origins.e9);
		if (!_v0.$) {
			var origin = _v0.a;
			var introducedHere = $elm$core$List$length(
				A2(
					$elm$core$List$filter,
					function (_v1) {
						var w = _v1.a;
						var o = _v1.b;
						return _Utils_eq(o.jG, origin.jG) && (_Utils_cmp(w, v) < 1);
					},
					$elm$core$Dict$toList(origins.e9)));
			return 'ax:' + (origin.jG + ((introducedHere > 1) ? ('/' + $elm$core$String$fromInt(introducedHere)) : ''));
		} else {
			return 'ax:unknown';
		}
	});
var $author$project$Typesystem$Types$ground = F2(
	function (origins, t) {
		var entry = F2(
			function (v, origin) {
				return {
					jG: A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.jG;
							},
							origin)),
					g6: A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.g6;
							},
							origin)),
					hq: v
				};
			});
		var unresolvedAxes = A2(
			$elm$core$List$map,
			function (v) {
				return A2(entry, v, $elm$core$Maybe$Nothing);
			},
			A2(
				$elm$core$List$filter,
				function (v) {
					return !A2($elm$core$Dict$member, v, origins.e9);
				},
				$author$project$Typesystem$Types$axisVars(t)));
		var unresolvedTypes = A2(
			$elm$core$List$map,
			function (v) {
				return A2(
					entry,
					v,
					A2($elm$core$Dict$get, v, origins.ho));
			},
			$author$project$Typesystem$Types$typeVars(t));
		var _v0 = _Utils_ap(unresolvedTypes, unresolvedAxes);
		if (!_v0.b) {
			return $elm$core$Result$Ok(
				A2(
					$author$project$Typesystem$Types$mapVars,
					{
						hV: function (v) {
							return $author$project$Typesystem$Types$Axis(
								A2($author$project$Typesystem$Types$axisName, origins, v));
						},
						k6: function (_v1) {
							return $author$project$Typesystem$Types$TUnion(_List_Nil);
						}
					},
					t));
		} else {
			var unresolved = _v0;
			return $elm$core$Result$Err(unresolved);
		}
	});
var $author$project$Typesystem$Wire$Type$groundEncoder = $author$project$Typesystem$Wire$Codec$encoder($author$project$Typesystem$Wire$Type$groundCodec);
var $author$project$Typesystem$Choice$key = function (ground) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$author$project$Typesystem$Wire$Type$groundEncoder(ground));
};
var $author$project$Typesystem$Choice$options = function (grounds) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (ground, acc) {
				return A2(
					$elm$core$List$any,
					function (o) {
						return _Utils_eq(
							o.jn,
							$author$project$Typesystem$Choice$key(ground));
					},
					acc) ? acc : _Utils_ap(
					acc,
					_List_fromArray(
						[
							{
							jn: $author$project$Typesystem$Choice$key(ground),
							dy: ground
						}
						]));
			}),
		_List_Nil,
		grounds);
};
var $author$project$Typesystem$Check$groundChoice = F2(
	function (st, c) {
		return A2(
			$elm$core$Result$map,
			function (options) {
				return {
					jG: c.jG,
					jZ: $author$project$Typesystem$Choice$options(options)
				};
			},
			$author$project$Typesystem$Check$collect(
				A3(
					$elm$core$List$map2,
					F2(
						function (option, named) {
							return A2(
								$elm$core$Maybe$withDefault,
								A2(
									$author$project$Typesystem$Types$ground,
									st.aa,
									A2($author$project$Typesystem$Unify$apply, st.bl, option)),
								A2($elm$core$Maybe$map, $elm$core$Result$Ok, named));
						}),
					c.jZ,
					c.jE)));
	});
var $author$project$Typesystem$Surface$PArg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Surface$PEntry = function (a) {
	return {$: 7, a: a};
};
var $author$project$Typesystem$Surface$PFirst = {$: 4};
var $author$project$Typesystem$Surface$PFunction = {$: 3};
var $author$project$Typesystem$Surface$PInput = {$: 2};
var $author$project$Typesystem$Surface$PItem = function (a) {
	return {$: 6, a: a};
};
var $author$project$Typesystem$Surface$PPart = function (a) {
	return {$: 8, a: a};
};
var $author$project$Typesystem$Surface$PSecond = {$: 5};
var $author$project$Typesystem$Surface$PTarget = {$: 0};
var $author$project$Typesystem$Surface$children = function (surface) {
	switch (surface.$) {
		case 2:
			var target = surface.b;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PTarget, target)
				]);
		case 3:
			var args = surface.c;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, a) {
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PArg(i),
							a.hp);
					}),
				args);
		case 4:
			var x = surface.b;
			var f = surface.c;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PInput, x),
					_Utils_Tuple2($author$project$Typesystem$Surface$PFunction, f)
				]);
		case 5:
			var f = surface.b;
			var g = surface.c;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PFirst, f),
					_Utils_Tuple2($author$project$Typesystem$Surface$PSecond, g)
				]);
		case 6:
			var items = surface.b;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, item) {
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PItem(i),
							item);
					}),
				items);
		case 7:
			var fields = surface.b;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, _v1) {
						var v = _v1.b;
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PEntry(i),
							v);
					}),
				fields);
		case 8:
			var parts = surface.b;
			return $elm$core$List$concat(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, part) {
							if (part.$ === 1) {
								var x = part.a;
								return _List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$Typesystem$Surface$PPart(i),
										x)
									]);
							} else {
								return _List_Nil;
							}
						}),
					parts));
		default:
			return _List_Nil;
	}
};
var $author$project$Typesystem$Surface$search = F2(
	function (node, surface) {
		return _Utils_eq(
			$author$project$Typesystem$Surface$nodeId(surface),
			node) ? $elm$core$Maybe$Just(_List_Nil) : $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var step = _v0.a;
					var child = _v0.b;
					return A2(
						$elm$core$Maybe$map,
						$elm$core$List$cons(step),
						A2($author$project$Typesystem$Surface$search, node, child));
				},
				$author$project$Typesystem$Surface$children(surface)));
	});
var $author$project$Typesystem$Surface$pathTo = F2(
	function (node, surface) {
		var _v0 = A2($author$project$Typesystem$Surface$search, node, surface);
		if (!_v0.$) {
			var path = _v0.a;
			return $elm$core$Maybe$Just(path);
		} else {
			var _v1 = A2($elm$core$String$split, '#', node);
			if (_v1.b && _v1.b.b) {
				var owner = _v1.a;
				var _v2 = _v1.b;
				return A2($author$project$Typesystem$Surface$search, owner, surface);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Typesystem$Check$located = F2(
	function (surface, d) {
		return _Utils_update(
			d,
			{
				gL: A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($author$project$Typesystem$Surface$pathTo, d.jG, surface))
			});
	});
var $author$project$Typesystem$Check$originsOf = F2(
	function (known, partial) {
		var problemTypes = function (d) {
			var _v1 = d.j9;
			switch (_v1.$) {
				case 0:
					var t = _v1.a;
					return _List_fromArray(
						[t.dV, t.e2]);
				case 6:
					var n = _v1.a;
					return _List_fromArray(
						[n.k8, n.dV]);
				default:
					return _List_Nil;
			}
		};
		var keep = F2(
			function (vars, table) {
				return A2(
					$elm$core$Dict$filter,
					F2(
						function (v, _v0) {
							return A2($elm$core$List$member, v, vars);
						}),
					table);
			});
		var annotationTypes = A2(
			$elm$core$List$concatMap,
			function (a) {
				return A2(
					$elm$core$List$cons,
					a.dy,
					A2(
						$elm$core$List$map,
						function (axis) {
							return A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, axis, $author$project$Typesystem$Types$TEmpty);
						},
						a.bg));
			},
			$elm$core$Dict$values(partial.e7));
		var types = _Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Maybe$map, $elm$core$List$singleton, partial.dy)),
			_Utils_ap(
				annotationTypes,
				A2($elm$core$List$concatMap, problemTypes, partial.cf)));
		return {
			e9: A2(
				keep,
				A2($elm$core$List$concatMap, $author$project$Typesystem$Types$axisVars, types),
				known.e9),
			ho: A2(
				keep,
				A2($elm$core$List$concatMap, $author$project$Typesystem$Types$typeVars, types),
				known.ho)
		};
	});
var $author$project$Typesystem$Check$resolveAnnotation = F2(
	function (subst, a) {
		return _Utils_update(
			a,
			{
				bg: A2(
					$elm$core$List$map,
					$author$project$Typesystem$Unify$applyAxis(subst),
					a.bg),
				dy: A2($author$project$Typesystem$Unify$apply, subst, a.dy)
			});
	});
var $author$project$Typesystem$Diagnostic$NeedsNarrowing = function (a) {
	return {$: 6, a: a};
};
var $author$project$Typesystem$Diagnostic$TypeMismatch = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Check$resolveDiagnostic = F2(
	function (subst, d) {
		var apply = $author$project$Typesystem$Unify$apply(subst);
		return _Utils_update(
			d,
			{
				j9: function () {
					var _v0 = d.j9;
					switch (_v0.$) {
						case 0:
							var t = _v0.a;
							return $author$project$Typesystem$Diagnostic$TypeMismatch(
								{
									e2: apply(t.e2),
									dV: apply(t.dV)
								});
						case 6:
							var n = _v0.a;
							return $author$project$Typesystem$Diagnostic$NeedsNarrowing(
								{
									dV: apply(n.dV),
									k8: apply(n.k8)
								});
						default:
							var other = _v0;
							return other;
					}
				}()
			});
	});
var $author$project$Typesystem$Check$failed = F4(
	function (surface, st, result, diagnostics) {
		var resolved = {
			e7: A2(
				$elm$core$Dict$map,
				F2(
					function (_v0, a) {
						return A2($author$project$Typesystem$Check$resolveAnnotation, st.bl, a);
					}),
				st.e7),
			U: A2(
				$elm$core$List$filterMap,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Typesystem$Check$groundChoice(st),
					$elm$core$Result$toMaybe),
				st.U),
			cf: A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Typesystem$Check$located(surface),
					$author$project$Typesystem$Check$resolveDiagnostic(st.bl)),
				diagnostics),
			dy: A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					$author$project$Typesystem$Unify$apply(st.bl)),
				result)
		};
		return {
			e7: resolved.e7,
			U: resolved.U,
			cf: resolved.cf,
			aa: A2($author$project$Typesystem$Check$originsOf, st.aa, resolved),
			dy: resolved.dy
		};
	});
var $author$project$Typesystem$Check$collectDict = function (results) {
	return A2(
		$elm$core$Result$map,
		$elm$core$Dict$fromList,
		$author$project$Typesystem$Check$collect(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var k = _v0.a;
					var r = _v0.b;
					return A2(
						$elm$core$Result$map,
						$elm$core$Tuple$pair(k),
						r);
				},
				$elm$core$Dict$toList(results))));
};
var $author$project$Typesystem$Diagnostic$UnresolvedType = {$: 11};
var $author$project$Typesystem$Check$diagnose = F2(
	function (root, survivors) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (u, _v0) {
					var seen = _v0.a;
					var acc = _v0.b;
					return A2($elm$core$List$member, u.hq, seen) ? _Utils_Tuple2(seen, acc) : _Utils_Tuple2(
						A2($elm$core$List$cons, u.hq, seen),
						_Utils_ap(
							acc,
							_List_fromArray(
								[
									A2(
									$author$project$Typesystem$Check$diagnostic,
									(u.jG === '') ? root : u.jG,
									$author$project$Typesystem$Diagnostic$UnresolvedType)
								])));
				}),
			_Utils_Tuple2(_List_Nil, _List_Nil),
			survivors).b;
	});
var $author$project$Typesystem$Types$groundAxis = F2(
	function (origins, axis) {
		if (!axis.$) {
			var id = axis.a;
			return $elm$core$Result$Ok(
				$author$project$Typesystem$Types$Axis(id));
		} else {
			var v = axis.a;
			return A2($elm$core$Dict$member, v, origins.e9) ? $elm$core$Result$Ok(
				$author$project$Typesystem$Types$Axis(
					A2($author$project$Typesystem$Types$axisName, origins, v))) : $elm$core$Result$Err(
				_List_fromArray(
					[
						{jG: '', g6: '', hq: v}
					]));
		}
	});
var $author$project$Typesystem$Check$unresolved = function (result) {
	if (!result.$) {
		return _List_Nil;
	} else {
		var vars = result.a;
		return vars;
	}
};
var $author$project$Typesystem$Check$groundResult = F4(
	function (surface, st, type_, core) {
		var groundType = function (t) {
			return A2(
				$author$project$Typesystem$Types$ground,
				st.aa,
				A2($author$project$Typesystem$Unify$apply, st.bl, t));
		};
		var groundAxes = function (axes) {
			return $author$project$Typesystem$Check$collect(
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Typesystem$Unify$applyAxis(st.bl),
						$author$project$Typesystem$Types$groundAxis(st.aa)),
					axes));
		};
		var groundAnnotation = function (a) {
			return A3(
				$elm$core$Result$map2,
				F2(
					function (t, lifted) {
						return {h0: a.h0, i$: a.i$, bg: lifted, dy: t};
					}),
				groundType(a.dy),
				groundAxes(a.bg));
		};
		var _v0 = _Utils_Tuple3(
			groundType(type_),
			$author$project$Typesystem$Check$collectDict(
				A2(
					$elm$core$Dict$map,
					function (_v1) {
						return groundAnnotation;
					},
					st.e7)),
			$author$project$Typesystem$Check$collect(
				A2(
					$elm$core$List$map,
					$author$project$Typesystem$Check$groundChoice(st),
					st.U)));
		if (((!_v0.a.$) && (!_v0.b.$)) && (!_v0.c.$)) {
			var grounded = _v0.a.a;
			var annotations = _v0.b.a;
			var choices = _v0.c.a;
			return $elm$core$Result$Ok(
				{e7: annotations, U: choices, iw: core, eN: st.eN, dy: grounded});
		} else {
			var t = _v0.a;
			var annotations = _v0.b;
			var choices = _v0.c;
			return $elm$core$Result$Err(
				A2(
					$author$project$Typesystem$Check$diagnose,
					$author$project$Typesystem$Surface$nodeId(surface),
					_Utils_ap(
						$author$project$Typesystem$Check$unresolved(t),
						_Utils_ap(
							$author$project$Typesystem$Check$unresolved(annotations),
							$author$project$Typesystem$Check$unresolved(choices)))));
		}
	});
var $author$project$Typesystem$Check$outcome = F2(
	function (surface, _v0) {
		var result = _v0.a;
		var st = _v0.b;
		var _v1 = _Utils_Tuple2(st.cf, result);
		if (!_v1.a.b) {
			if (!_v1.b.$) {
				var _v2 = _v1.b.a;
				var type_ = _v2.a;
				var core = _v2.b;
				return A2(
					$elm$core$Result$mapError,
					A3($author$project$Typesystem$Check$failed, surface, st, result),
					A4($author$project$Typesystem$Check$groundResult, surface, st, type_, core));
			} else {
				var _v3 = _v1.b;
				return $elm$core$Result$Err(
					A4(
						$author$project$Typesystem$Check$failed,
						surface,
						st,
						result,
						_List_fromArray(
							[
								A2(
								$author$project$Typesystem$Check$diagnostic,
								$author$project$Typesystem$Surface$nodeId(surface),
								$author$project$Typesystem$Diagnostic$MissingNode)
							])));
			}
		} else {
			var diagnostics = _v1.a;
			return $elm$core$Result$Err(
				A4($author$project$Typesystem$Check$failed, surface, st, result, diagnostics));
		}
	});
var $author$project$Typesystem$Check$finish = F2(
	function (surface, run) {
		return A2(
			$elm$core$Result$mapError,
			function (f) {
				return {e7: f.e7, cf: f.cf, aa: f.aa};
			},
			A2($author$project$Typesystem$Check$outcome, surface, run));
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $author$project$Typesystem$Check$replayRun = F6(
	function (env, surface, synth, ignored, replay, budget) {
		var stored = A2(
			$elm$core$Dict$filter,
			F2(
				function (node, _v1) {
					return !A2($elm$core$List$member, node, ignored);
				}),
			env.U);
		var initial = $author$project$Typesystem$Infer$initialFor(env);
		var _v0 = A2(
			synth,
			_Utils_update(
				env,
				{
					U: A2($elm$core$Dict$union, replay, stored)
				}),
			_Utils_update(
				initial,
				{b6: budget}));
		var result = _v0.a;
		var st = _v0.b;
		var checked = A2(
			$author$project$Typesystem$Check$finish,
			surface,
			_Utils_Tuple2(result, st));
		var deadEnd = (!$elm$core$Dict$isEmpty(replay)) && (!$elm$core$List$isEmpty(st.eN));
		return _Utils_Tuple2(
			{
				d3: _Utils_Tuple2(checked, st.kC),
				gO: deadEnd ? _List_Nil : A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Typesystem$Check$groundChoice(st),
						$elm$core$Result$toMaybe),
					st.U),
				dq: st.eN,
				lb: (!deadEnd) && (!_Utils_eq(
					$elm$core$Result$toMaybe(checked),
					$elm$core$Maybe$Nothing))
			},
			st.b6);
	});
var $author$project$Typesystem$Budget$spent = function (budget) {
	return budget.bZ;
};
var $author$project$Typesystem$Check$narrowed = F3(
	function (env, surface, synth) {
		var initial = $author$project$Typesystem$Infer$initialFor(env);
		var narrowing = A2(
			$author$project$Typesystem$Choice$narrow,
			A3($author$project$Typesystem$Check$replayRun, env, surface, synth),
			initial.b6);
		var _v0 = narrowing.im.d3;
		var chosen = _v0.a;
		var stats = _v0.b;
		return _Utils_Tuple3(
			A2(
				$elm$core$Result$map,
				function (c) {
					return _Utils_update(
						c,
						{U: narrowing.gO, eN: narrowing.dq});
				},
				chosen),
			stats,
			$author$project$Typesystem$Budget$spent(narrowing.b6));
	});
var $author$project$Typesystem$Core$CLit = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Diagnostic$NotAFunctionSlot = {$: 7};
var $author$project$Typesystem$Infer$State$annotate = F3(
	function (node, annotation, st) {
		return _Utils_update(
			st,
			{
				e7: A3($elm$core$Dict$insert, node, annotation, st.e7)
			});
	});
var $author$project$Typesystem$Infer$State$applied = function (st) {
	return $author$project$Typesystem$Unify$apply(st.bl);
};
var $author$project$Typesystem$Diagnostic$NotAHole = 0;
var $author$project$Typesystem$Infer$State$plain = function (t) {
	return {h0: _List_Nil, i$: 0, bg: _List_Nil, dy: t};
};
var $author$project$Typesystem$Infer$State$annotateWith = F2(
	function (node, _v0) {
		var result = _v0.a;
		var st = _v0.b;
		if (!result.$) {
			var _v2 = result.a;
			var t = _v2.a;
			return _Utils_Tuple2(
				result,
				A3(
					$author$project$Typesystem$Infer$State$annotate,
					node,
					$author$project$Typesystem$Infer$State$plain(
						A2($author$project$Typesystem$Infer$State$applied, st, t)),
					st));
		} else {
			return _Utils_Tuple2(result, st);
		}
	});
var $author$project$Typesystem$Infer$State$fresh = function (st) {
	return _Utils_Tuple2(
		st.gx,
		_Utils_update(
			st,
			{gx: st.gx + 1}));
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $author$project$Typesystem$Infer$State$freshBinder = function (st) {
	return A2(
		$elm$core$Tuple$mapFirst,
		function (n) {
			return 'b' + $elm$core$String$fromInt(n);
		},
		$author$project$Typesystem$Infer$State$fresh(st));
};
var $author$project$Typesystem$Infer$State$originate = F6(
	function (get, set, node, slot, v, origins) {
		var table = get(origins);
		var taken = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (o) {
					return _Utils_eq(o.jG, node) && (_Utils_eq(o.g6, slot) || A2($elm$core$String$startsWith, slot + '/', o.g6));
				},
				$elm$core$Dict$values(table)));
		var named = (!taken) ? slot : (slot + ('/' + $elm$core$String$fromInt(taken + 1)));
		return A2(
			set,
			origins,
			A3(
				$elm$core$Dict$insert,
				v,
				{jG: node, g6: named},
				table));
	});
var $author$project$Typesystem$Infer$State$freshVar = F3(
	function (node, slot, st) {
		var _v0 = $author$project$Typesystem$Infer$State$fresh(st);
		var v = _v0.a;
		var st2 = _v0.b;
		return _Utils_Tuple2(
			$author$project$Typesystem$Types$TVar(v),
			_Utils_update(
				st2,
				{
					aa: A6(
						$author$project$Typesystem$Infer$State$originate,
						function (o) {
							return o.ho;
						},
						F2(
							function (o, types) {
								return _Utils_update(
									o,
									{ho: types});
							}),
						node,
						slot,
						v,
						st2.aa)
				}));
	});
var $author$project$Typesystem$Infer$Classify$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Typesystem$Diagnostic$AmbiguousName = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Diagnostic$UnknownFunction = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Diagnostic$WrongArity = function (a) {
	return {$: 14, a: a};
};
var $author$project$Typesystem$Resolve$nameTiers = F4(
	function (displayOf, idOf, name, items) {
		return _Utils_Tuple2(
			A2(
				$elm$core$List$filter,
				function (item) {
					return _Utils_eq(
						displayOf(item),
						$elm$core$Maybe$Just(name));
				},
				items),
			A2(
				$elm$core$List$filter,
				function (item) {
					return _Utils_eq(
						idOf(item),
						name);
				},
				items));
	});
var $author$project$Typesystem$Resolve$byNameOrId = F4(
	function (displayOf, idOf, name, items) {
		var _v0 = A4($author$project$Typesystem$Resolve$nameTiers, displayOf, idOf, name, items);
		if (!_v0.a.b) {
			var byId = _v0.b;
			return byId;
		} else {
			var named = _v0.a;
			return named;
		}
	});
var $author$project$Typesystem$Resolve$displayNameOf = F2(
	function (env, id) {
		return A2($elm$core$Dict$get, id, env.gs);
	});
var $author$project$Typesystem$Signature$params = function (sig) {
	return sig.g1.h1.gK;
};
var $author$project$Typesystem$Infer$State$refName = function (ref) {
	if (!ref.$) {
		var id = ref.a;
		return id;
	} else {
		var name = ref.a;
		return name;
	}
};
var $author$project$Typesystem$Infer$Sig$lookupSignature = F3(
	function (env, ref, argCount) {
		var named = function () {
			if (!ref.$) {
				var id = ref.a;
				return A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						$elm$core$List$singleton,
						A2($elm$core$Dict$get, id, env.ao)));
			} else {
				var name = ref.a;
				return A4(
					$author$project$Typesystem$Resolve$byNameOrId,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.c_;
						},
						$author$project$Typesystem$Resolve$displayNameOf(env)),
					function ($) {
						return $.c_;
					},
					name,
					$elm$core$Dict$values(env.ao));
			}
		}();
		var accepting = A2(
			$elm$core$List$filter,
			function (sig) {
				return _Utils_cmp(
					$elm$core$List$length(
						$author$project$Typesystem$Signature$params(sig)),
					argCount) > -1;
			},
			named);
		var exact = A2(
			$elm$core$List$filter,
			function (sig) {
				return _Utils_eq(
					$elm$core$List$length(
						$author$project$Typesystem$Signature$params(sig)),
					argCount);
			},
			accepting);
		var _v0 = $elm$core$List$isEmpty(exact) ? accepting : exact;
		if (_v0.b) {
			if (!_v0.b.b) {
				var sig = _v0.a;
				return $elm$core$Result$Ok(sig);
			} else {
				var many = _v0;
				return $elm$core$Result$Err(
					$author$project$Typesystem$Diagnostic$AmbiguousName(
						{
							ic: A2(
								$elm$core$List$map,
								function ($) {
									return $.c_;
								},
								many),
							jD: $author$project$Typesystem$Infer$State$refName(ref)
						}));
			}
		} else {
			return $elm$core$List$isEmpty(named) ? $elm$core$Result$Err(
				$author$project$Typesystem$Diagnostic$UnknownFunction(
					$author$project$Typesystem$Infer$State$refName(ref))) : $elm$core$Result$Err(
				$author$project$Typesystem$Diagnostic$WrongArity(
					{
						e2: argCount,
						dV: $elm$core$Set$toList(
							$elm$core$Set$fromList(
								A2(
									$elm$core$List$map,
									A2($elm$core$Basics$composeR, $author$project$Typesystem$Signature$params, $elm$core$List$length),
									named))),
						iY: $author$project$Typesystem$Infer$State$refName(ref)
					}));
		}
	});
var $author$project$Typesystem$Resolve$NotFound = {$: 3};
var $author$project$Typesystem$Resolve$Ambiguous = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Resolve$ToBinder = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Resolve$ToBinderField = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Resolve$ToObject = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $author$project$Typesystem$Resolve$recordFields = F3(
	function (env, subst, type_) {
		var _v0 = subst(type_);
		switch (_v0.$) {
			case 4:
				var fields = _v0.a;
				return $elm$core$Dict$toList(fields);
			case 5:
				var id = _v0.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.h1;
					},
					A2($elm$core$Dict$get, id, env.fv));
				if ((!_v1.$) && (!_v1.a.$)) {
					var fields = _v1.a.a;
					return $elm$core$Dict$toList(fields);
				} else {
					return _List_Nil;
				}
			default:
				return _List_Nil;
		}
	});
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Typesystem$Resolve$resolve = F4(
	function (env, scopes, subst, ref) {
		if (!ref.$) {
			var id = ref.a;
			var _v1 = A2(
				$elm$core$List$filter,
				function (b) {
					return _Utils_eq(b.b4, id);
				},
				scopes);
			if (_v1.b) {
				var b = _v1.a;
				return $author$project$Typesystem$Resolve$ToBinder(b);
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					$author$project$Typesystem$Resolve$NotFound,
					A2(
						$elm$core$Maybe$map,
						$author$project$Typesystem$Resolve$ToObject,
						A2($elm$core$Dict$get, id, env.gz)));
			}
		} else {
			var name = ref.a;
			var object = function (o) {
				return _Utils_Tuple2(
					o.c_,
					$author$project$Typesystem$Resolve$ToObject(o));
			};
			var objects = A3(
				$elm$core$Tuple$mapBoth,
				$elm$core$List$map(object),
				$elm$core$List$map(object),
				A4(
					$author$project$Typesystem$Resolve$nameTiers,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.c_;
						},
						$author$project$Typesystem$Resolve$displayNameOf(env)),
					function ($) {
						return $.c_;
					},
					name,
					$elm$core$Dict$values(env.gz)));
			var field = F2(
				function (b, _v7) {
					var f = _v7.a;
					var t = _v7.b;
					return _Utils_Tuple2(
						b.b4 + ('.' + f),
						A3($author$project$Typesystem$Resolve$ToBinderField, b, f, t));
				});
			var fields = A2(
				$elm$core$List$map,
				function (b) {
					return A3(
						$elm$core$Tuple$mapBoth,
						$elm$core$List$map(
							field(b)),
						$elm$core$List$map(
							field(b)),
						A4(
							$author$project$Typesystem$Resolve$nameTiers,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								$author$project$Typesystem$Resolve$displayNameOf(env)),
							$elm$core$Tuple$first,
							name,
							A3($author$project$Typesystem$Resolve$recordFields, env, subst, b.dy)));
				},
				scopes);
			var idMatches = _Utils_ap(
				A2($elm$core$List$concatMap, $elm$core$Tuple$second, fields),
				objects.b);
			var binders = A2(
				$elm$core$List$map,
				function (b) {
					return _Utils_Tuple2(
						b.b4,
						$author$project$Typesystem$Resolve$ToBinder(b));
				},
				A2(
					$elm$core$List$filter,
					function (b) {
						return A2($elm$core$List$member, name, b.gs);
					},
					scopes));
			var displayMatches = _Utils_ap(
				binders,
				_Utils_ap(
					A2($elm$core$List$concatMap, $elm$core$Tuple$first, fields),
					objects.a));
			var _v2 = _Utils_Tuple2(displayMatches, idMatches);
			if (_v2.a.b) {
				if (!_v2.a.b.b) {
					var _v3 = _v2.a;
					var _v4 = _v3.a;
					var single = _v4.b;
					return single;
				} else {
					var many = _v2.a;
					return $author$project$Typesystem$Resolve$Ambiguous(
						$elm$core$List$sort(
							A2($elm$core$List$map, $elm$core$Tuple$first, many)));
				}
			} else {
				if (!_v2.b.b) {
					return $author$project$Typesystem$Resolve$NotFound;
				} else {
					if (!_v2.b.b.b) {
						var _v5 = _v2.b;
						var _v6 = _v5.a;
						var single = _v6.b;
						return single;
					} else {
						var many = _v2.b;
						return $author$project$Typesystem$Resolve$Ambiguous(
							$elm$core$List$sort(
								A2($elm$core$List$map, $elm$core$Tuple$first, many)));
					}
				}
			}
		}
	});
var $author$project$Typesystem$Infer$Synth$namesFunction = F4(
	function (ctx, ref, arity, st) {
		return _Utils_eq(
			A4(
				$author$project$Typesystem$Resolve$resolve,
				ctx.aB,
				ctx.h0,
				$author$project$Typesystem$Infer$State$applied(st),
				ref),
			$author$project$Typesystem$Resolve$NotFound) && $author$project$Typesystem$Infer$Classify$isOk(
			A3($author$project$Typesystem$Infer$Sig$lookupSignature, ctx.aB, ref, arity));
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$Typesystem$Infer$State$reportWith = F4(
	function (node, problem, fix, st) {
		return _Utils_update(
			st,
			{
				cf: _Utils_ap(
					st.cf,
					_List_fromArray(
						[
							{
							ir: $author$project$Typesystem$Diagnostic$code(problem),
							iS: fix,
							jG: node,
							gL: _List_Nil,
							j9: problem
						}
						]))
			});
	});
var $author$project$Typesystem$Infer$State$report = F2(
	function (node, problem) {
		return A3($author$project$Typesystem$Infer$State$reportWith, node, problem, $elm$core$Maybe$Nothing);
	});
var $author$project$Typesystem$Diagnostic$TooComplex = {$: 12};
var $author$project$Typesystem$Infer$Synth$reportTooComplex = F2(
	function (node, st) {
		return A2(
			$elm$core$List$any,
			function (d) {
				return _Utils_eq(d.j9, $author$project$Typesystem$Diagnostic$TooComplex);
			},
			st.cf) ? st : A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$TooComplex, st);
	});
var $author$project$Typesystem$Diagnostic$UnknownName = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Diagnostic$NullableKey = function (a) {
	return {$: 15, a: a};
};
var $author$project$Typesystem$Budget$spend = F2(
	function (cost, budget) {
		return _Utils_update(
			budget,
			{bZ: budget.bZ + cost});
	});
var $author$project$Typesystem$Infer$State$countUnify = function (st) {
	var stats = st.kC;
	return _Utils_update(
		st,
		{
			b6: A2($author$project$Typesystem$Budget$spend, 1, st.b6),
			kC: _Utils_update(
				stats,
				{dz: stats.dz + 1})
		});
};
var $author$project$Typesystem$Infer$State$freshAxis = F3(
	function (node, slot, st) {
		var _v0 = $author$project$Typesystem$Infer$State$fresh(st);
		var v = _v0.a;
		var st2 = _v0.b;
		return _Utils_Tuple2(
			$author$project$Typesystem$Types$AxisVar(v),
			_Utils_update(
				st2,
				{
					aa: A6(
						$author$project$Typesystem$Infer$State$originate,
						function (o) {
							return o.e9;
						},
						F2(
							function (o, axes) {
								return _Utils_update(
									o,
									{e9: axes});
							}),
						node,
						slot,
						v,
						st2.aa)
				}));
	});
var $author$project$Typesystem$Diagnostic$MixedFrameKinds = {$: 5};
var $author$project$Typesystem$Diagnostic$OccursCheck = {$: 8};
var $author$project$Typesystem$Unify$firstJust = A2(
	$elm$core$Basics$composeR,
	$elm$core$List$filterMap($elm$core$Basics$identity),
	$elm$core$List$head);
var $author$project$Typesystem$Unify$Mismatch = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Typesystem$Unify$MixedFrameKinds = {$: 1};
var $author$project$Typesystem$Unify$Occurs = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Typesystem$Unify$occurs = F2(
	function (v, t) {
		switch (t.$) {
			case 9:
				var w = t.a;
				return _Utils_eq(v, w);
			case 4:
				var fields = t.a;
				return A2(
					$elm$core$List$any,
					$author$project$Typesystem$Unify$occurs(v),
					$elm$core$Dict$values(fields));
			case 5:
				var args = t.b;
				return A2(
					$elm$core$List$any,
					$author$project$Typesystem$Unify$occurs(v),
					args);
			case 6:
				var ts = t.a;
				return A2(
					$elm$core$List$any,
					$author$project$Typesystem$Unify$occurs(v),
					ts);
			case 7:
				var params = t.a;
				var result = t.b;
				return A2($author$project$Typesystem$Unify$occurs, v, result) || A2(
					$elm$core$List$any,
					$author$project$Typesystem$Unify$occurs(v),
					$elm$core$Dict$values(params));
			case 8:
				var kind = t.a;
				var inner = t.c;
				return A2($author$project$Typesystem$Unify$occurs, v, inner) || function () {
					if (kind.$ === 1) {
						var key = kind.a;
						return A2($author$project$Typesystem$Unify$occurs, v, key);
					} else {
						return false;
					}
				}();
			default:
				return false;
		}
	});
var $author$project$Typesystem$Unify$bindVar = F3(
	function (v, t, s) {
		return A2($author$project$Typesystem$Unify$occurs, v, t) ? $elm$core$Result$Err(
			A2($author$project$Typesystem$Unify$Occurs, v, t)) : $elm$core$Result$Ok(
			_Utils_update(
				s,
				{
					ho: A3($elm$core$Dict$insert, v, t, s.ho)
				}));
	});
var $author$project$Typesystem$Unify$AxisClash = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Typesystem$Unify$unifyAxis = F3(
	function (a1Raw, a2Raw, s) {
		var a2 = A2($author$project$Typesystem$Unify$applyAxis, s, a2Raw);
		var a1 = A2($author$project$Typesystem$Unify$applyAxis, s, a1Raw);
		if (_Utils_eq(a1, a2)) {
			return $elm$core$Result$Ok(s);
		} else {
			var _v0 = _Utils_Tuple2(a1, a2);
			if (_v0.a.$ === 1) {
				if (_v0.b.$ === 1) {
					var n = _v0.a.a;
					var m = _v0.b.a;
					return (_Utils_cmp(n, m) < 0) ? $elm$core$Result$Ok(
						_Utils_update(
							s,
							{
								e9: A3($elm$core$Dict$insert, m, a1, s.e9)
							})) : $elm$core$Result$Ok(
						_Utils_update(
							s,
							{
								e9: A3($elm$core$Dict$insert, n, a2, s.e9)
							}));
				} else {
					var n = _v0.a.a;
					return $elm$core$Result$Ok(
						_Utils_update(
							s,
							{
								e9: A3($elm$core$Dict$insert, n, a2, s.e9)
							}));
				}
			} else {
				if (_v0.b.$ === 1) {
					var n = _v0.b.a;
					return $elm$core$Result$Ok(
						_Utils_update(
							s,
							{
								e9: A3($elm$core$Dict$insert, n, a1, s.e9)
							}));
				} else {
					return $elm$core$Result$Err(
						A2($author$project$Typesystem$Unify$AxisClash, a1, a2));
				}
			}
		}
	});
var $author$project$Typesystem$Unify$firstFit = F3(
	function (members, actual, s) {
		firstFit:
		while (true) {
			if (!members.b) {
				return $elm$core$Result$Err(
					A2(
						$author$project$Typesystem$Unify$Mismatch,
						$author$project$Typesystem$Types$TUnion(_List_Nil),
						actual));
			} else {
				var m = members.a;
				var rest = members.b;
				var _v16 = A3($author$project$Typesystem$Unify$unify, m, actual, s);
				if (!_v16.$) {
					var s2 = _v16.a;
					return $elm$core$Result$Ok(s2);
				} else {
					var $temp$members = rest,
						$temp$actual = actual,
						$temp$s = s;
					members = $temp$members;
					actual = $temp$actual;
					s = $temp$s;
					continue firstFit;
				}
			}
		}
	});
var $author$project$Typesystem$Unify$unify = F3(
	function (expectedRaw, actualRaw, s) {
		var expected = A2($author$project$Typesystem$Unify$apply, s, expectedRaw);
		var actual = A2($author$project$Typesystem$Unify$apply, s, actualRaw);
		if (_Utils_eq(expected, actual)) {
			return $elm$core$Result$Ok(s);
		} else {
			var _v4 = _Utils_Tuple2(expected, actual);
			_v4$0:
			while (true) {
				_v4$1:
				while (true) {
					_v4$3:
					while (true) {
						_v4$11:
						while (true) {
							switch (_v4.b.$) {
								case 9:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$1;
										default:
											break _v4$1;
									}
								case 6:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											var actuals = _v4.b.a;
											return A2(
												$elm$core$Result$mapError,
												function (_v5) {
													return A2($author$project$Typesystem$Unify$Mismatch, expected, actual);
												},
												A3(
													$elm$core$List$foldl,
													F2(
														function (a, acc) {
															return A2(
																$elm$core$Result$andThen,
																A2($author$project$Typesystem$Unify$unify, expected, a),
																acc);
														}),
													$elm$core$Result$Ok(s),
													actuals));
										default:
											var actuals = _v4.b.a;
											return A2(
												$elm$core$Result$mapError,
												function (_v7) {
													return A2($author$project$Typesystem$Unify$Mismatch, expected, actual);
												},
												A2(
													$author$project$Typesystem$Unify$unifyPairs,
													A2(
														$elm$core$List$map,
														$elm$core$Tuple$pair(expected),
														actuals),
													s));
									}
								case 11:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										case 11:
											var v = _v4.a.a;
											var w = _v4.b.a;
											return A2($author$project$Typesystem$Semantics$equal, v, w) ? $elm$core$Result$Ok(s) : $elm$core$Result$Err(
												A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
										default:
											var w = _v4.b.a;
											return _Utils_eq(
												$author$project$Typesystem$Types$baseType(w),
												$elm$core$Maybe$Just(expected)) ? $elm$core$Result$Ok(s) : $elm$core$Result$Err(
												A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
									}
								case 8:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										case 8:
											var _v8 = _v4.a;
											var k1 = _v8.a;
											var a1 = _v8.b;
											var i1 = _v8.c;
											var _v9 = _v4.b;
											var k2 = _v9.a;
											var a2 = _v9.b;
											var i2 = _v9.c;
											return A2(
												$elm$core$Result$andThen,
												A2($author$project$Typesystem$Unify$unify, i1, i2),
												A2(
													$elm$core$Result$andThen,
													A2($author$project$Typesystem$Unify$unifyAxis, a1, a2),
													A3($author$project$Typesystem$Unify$unifyKind, k1, k2, s)));
										default:
											break _v4$11;
									}
								case 4:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										case 4:
											var f1 = _v4.a.a;
											var f2 = _v4.b.a;
											return _Utils_eq(
												$elm$core$Dict$keys(f1),
												$elm$core$Dict$keys(f2)) ? A2(
												$author$project$Typesystem$Unify$unifyPairs,
												A3(
													$elm$core$List$map2,
													$elm$core$Tuple$pair,
													$elm$core$Dict$values(f1),
													$elm$core$Dict$values(f2)),
												s) : $elm$core$Result$Err(
												A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
										default:
											break _v4$11;
									}
								case 5:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										case 5:
											var _v10 = _v4.a;
											var id1 = _v10.a;
											var args1 = _v10.b;
											var _v11 = _v4.b;
											var id2 = _v11.a;
											var args2 = _v11.b;
											return (_Utils_eq(id1, id2) && _Utils_eq(
												$elm$core$List$length(args1),
												$elm$core$List$length(args2))) ? A2(
												$author$project$Typesystem$Unify$unifyPairs,
												A3($elm$core$List$map2, $elm$core$Tuple$pair, args1, args2),
												s) : $elm$core$Result$Err(
												A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
										default:
											break _v4$11;
									}
								case 7:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										case 7:
											var _v12 = _v4.a;
											var p1 = _v12.a;
											var r1 = _v12.b;
											var _v13 = _v4.b;
											var p2 = _v13.a;
											var r2 = _v13.b;
											if (_Utils_eq(
												$elm$core$Dict$keys(p1),
												$elm$core$Dict$keys(p2))) {
												var pairs = A3(
													$elm$core$List$map2,
													$elm$core$Tuple$pair,
													$elm$core$Dict$values(p1),
													$elm$core$Dict$values(p2));
												return A2(
													$elm$core$Result$andThen,
													A2($author$project$Typesystem$Unify$unify, r1, r2),
													A2(
														$elm$core$Result$andThen,
														$author$project$Typesystem$Unify$unifyPairs(
															A2(
																$elm$core$List$map,
																function (_v14) {
																	var x = _v14.a;
																	var y = _v14.b;
																	return _Utils_Tuple2(y, x);
																},
																pairs)),
														A2($author$project$Typesystem$Unify$unifyPairs, pairs, s)));
											} else {
												return $elm$core$Result$Err(
													A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
											}
										default:
											break _v4$11;
									}
								default:
									switch (_v4.a.$) {
										case 9:
											break _v4$0;
										case 6:
											break _v4$3;
										default:
											break _v4$11;
									}
							}
						}
						return $elm$core$Result$Err(
							A2($author$project$Typesystem$Unify$Mismatch, expected, actual));
					}
					var es = _v4.a.a;
					return A2(
						$elm$core$Result$mapError,
						function (_v6) {
							return A2($author$project$Typesystem$Unify$Mismatch, expected, actual);
						},
						A3($author$project$Typesystem$Unify$firstFit, es, actual, s));
				}
				var v = _v4.b.a;
				return A3($author$project$Typesystem$Unify$bindVar, v, expected, s);
			}
			var v = _v4.a.a;
			return A3($author$project$Typesystem$Unify$bindVar, v, actual, s);
		}
	});
var $author$project$Typesystem$Unify$unifyKind = F3(
	function (k1, k2, s) {
		var _v1 = _Utils_Tuple2(k1, k2);
		_v1$2:
		while (true) {
			if (!_v1.a.$) {
				if (!_v1.b.$) {
					var _v2 = _v1.a;
					var _v3 = _v1.b;
					return $elm$core$Result$Ok(s);
				} else {
					break _v1$2;
				}
			} else {
				if (_v1.b.$ === 1) {
					var key1 = _v1.a.a;
					var key2 = _v1.b.a;
					return A3($author$project$Typesystem$Unify$unify, key1, key2, s);
				} else {
					break _v1$2;
				}
			}
		}
		return $elm$core$Result$Err($author$project$Typesystem$Unify$MixedFrameKinds);
	});
var $author$project$Typesystem$Unify$unifyPairs = F2(
	function (pairs, s) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, acc) {
					var e = _v0.a;
					var a = _v0.b;
					return A2(
						$elm$core$Result$andThen,
						A2($author$project$Typesystem$Unify$unify, e, a),
						acc);
				}),
			$elm$core$Result$Ok(s),
			pairs);
	});
var $author$project$Typesystem$Unify$narrowing = F3(
	function (expectedRaw, actualRaw, s) {
		narrowing:
		while (true) {
			var expected = A2($author$project$Typesystem$Unify$apply, s, expectedRaw);
			var actual = $author$project$Typesystem$Types$stripEmpty(
				A2($author$project$Typesystem$Unify$apply, s, actualRaw));
			var _v0 = _Utils_Tuple2(expected, actual);
			_v0$0:
			while (true) {
				_v0$6:
				while (true) {
					switch (_v0.b.$) {
						case 6:
							if (_v0.a.$ === 9) {
								break _v0$0;
							} else {
								var members = _v0.b.a;
								var fitting = A3(
									$elm$core$List$foldl,
									F2(
										function (m, _v1) {
											var s2 = _v1.a;
											var flags = _v1.b;
											var _v2 = A3($author$project$Typesystem$Unify$unify, expected, m, s2);
											if (!_v2.$) {
												var s3 = _v2.a;
												return _Utils_Tuple2(
													s3,
													_Utils_ap(
														flags,
														_List_fromArray(
															[true])));
											} else {
												return _Utils_Tuple2(
													s2,
													_Utils_ap(
														flags,
														_List_fromArray(
															[false])));
											}
										}),
									_Utils_Tuple2(s, _List_Nil),
									members).b;
								return (A2($elm$core$List$member, true, fitting) && A2($elm$core$List$member, false, fitting)) ? $elm$core$Maybe$Just(
									_Utils_Tuple2(actual, expected)) : $elm$core$Maybe$Nothing;
							}
						case 4:
							switch (_v0.a.$) {
								case 9:
									break _v0$0;
								case 4:
									var f1 = _v0.a.a;
									var f2 = _v0.b.a;
									return _Utils_eq(
										$elm$core$Dict$keys(f1),
										$elm$core$Dict$keys(f2)) ? $author$project$Typesystem$Unify$firstJust(
										A3(
											$elm$core$List$map2,
											F2(
												function (e, a) {
													return A3($author$project$Typesystem$Unify$narrowing, e, a, s);
												}),
											$elm$core$Dict$values(f1),
											$elm$core$Dict$values(f2))) : $elm$core$Maybe$Nothing;
								default:
									break _v0$6;
							}
						case 5:
							switch (_v0.a.$) {
								case 9:
									break _v0$0;
								case 5:
									var _v5 = _v0.a;
									var id1 = _v5.a;
									var args1 = _v5.b;
									var _v6 = _v0.b;
									var id2 = _v6.a;
									var args2 = _v6.b;
									return (_Utils_eq(id1, id2) && _Utils_eq(
										$elm$core$List$length(args1),
										$elm$core$List$length(args2))) ? $author$project$Typesystem$Unify$firstJust(
										A3(
											$elm$core$List$map2,
											F2(
												function (e, a) {
													return A3($author$project$Typesystem$Unify$narrowing, e, a, s);
												}),
											args1,
											args2)) : $elm$core$Maybe$Nothing;
								default:
									break _v0$6;
							}
						case 8:
							switch (_v0.a.$) {
								case 9:
									break _v0$0;
								case 8:
									var _v3 = _v0.a;
									var i1 = _v3.c;
									var _v4 = _v0.b;
									var i2 = _v4.c;
									var $temp$expectedRaw = i1,
										$temp$actualRaw = i2,
										$temp$s = s;
									expectedRaw = $temp$expectedRaw;
									actualRaw = $temp$actualRaw;
									s = $temp$s;
									continue narrowing;
								default:
									var _v7 = _v0.b;
									var inner = _v7.c;
									var $temp$expectedRaw = expected,
										$temp$actualRaw = inner,
										$temp$s = s;
									expectedRaw = $temp$expectedRaw;
									actualRaw = $temp$actualRaw;
									s = $temp$s;
									continue narrowing;
							}
						default:
							if (_v0.a.$ === 9) {
								break _v0$0;
							} else {
								break _v0$6;
							}
					}
				}
				return $elm$core$Maybe$Nothing;
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$State$mismatch = F2(
	function (expected, actual) {
		var _v0 = A3($author$project$Typesystem$Unify$narrowing, expected, actual, $author$project$Typesystem$Unify$empty);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var union = _v1.a;
			var wanted = _v1.b;
			return $author$project$Typesystem$Diagnostic$NeedsNarrowing(
				{dV: wanted, k8: union});
		} else {
			return $author$project$Typesystem$Diagnostic$TypeMismatch(
				{e2: actual, dV: expected});
		}
	});
var $author$project$Typesystem$Infer$State$fromFailure = F3(
	function (expected, actual, failure) {
		switch (failure.$) {
			case 0:
				return A2($author$project$Typesystem$Infer$State$mismatch, expected, actual);
			case 3:
				return A2($author$project$Typesystem$Infer$State$mismatch, expected, actual);
			case 1:
				return $author$project$Typesystem$Diagnostic$MixedFrameKinds;
			default:
				return $author$project$Typesystem$Diagnostic$OccursCheck;
		}
	});
var $author$project$Typesystem$Infer$Variant$instantiate = F3(
	function (node, decl, st) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (p, _v1) {
					var acc = _v1.a;
					var s = _v1.b;
					return A2(
						$elm$core$Tuple$mapFirst,
						function (t) {
							return _Utils_ap(
								acc,
								_List_fromArray(
									[t]));
						},
						A3(
							$author$project$Typesystem$Infer$State$freshVar,
							node,
							'param/' + $elm$core$String$fromInt(p),
							s));
				}),
			_Utils_Tuple2(_List_Nil, st),
			decl.gK);
		var args = _v0.a;
		var st2 = _v0.b;
		return _Utils_Tuple2(
			_Utils_Tuple2(
				A2($author$project$Typesystem$Types$TNamed, decl.c_, args),
				args),
			st2);
	});
var $author$project$Typesystem$Types$isNullable = function (t) {
	switch (t.$) {
		case 10:
			return true;
		case 6:
			var ts = t.a;
			return A2($elm$core$List$member, $author$project$Typesystem$Types$TEmpty, ts);
		default:
			return false;
	}
};
var $author$project$Typesystem$Infer$Variant$nonEmptyPart = function (t) {
	return _Utils_eq(t, $author$project$Typesystem$Types$TEmpty) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
		$author$project$Typesystem$Types$stripEmpty(t));
};
var $author$project$Typesystem$Infer$Variant$joinTypes = F3(
	function (node, types, st) {
		if (!types.b) {
			return A3($author$project$Typesystem$Infer$State$freshVar, node, 'elem', st);
		} else {
			var first = types.a;
			var rest = types.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (t, _v1) {
						var acc = _v1.a;
						var s = _v1.b;
						var s2 = function () {
							var _v2 = _Utils_Tuple2(
								$author$project$Typesystem$Infer$Variant$nonEmptyPart(
									A2($author$project$Typesystem$Infer$State$applied, s, acc)),
								$author$project$Typesystem$Infer$Variant$nonEmptyPart(
									A2($author$project$Typesystem$Infer$State$applied, s, t)));
							if ((!_v2.a.$) && (!_v2.b.$)) {
								var a = _v2.a.a;
								var b = _v2.b.a;
								var _v3 = A3($author$project$Typesystem$Unify$unify, a, b, s.bl);
								if (!_v3.$) {
									var subst = _v3.a;
									return $author$project$Typesystem$Infer$State$countUnify(
										_Utils_update(
											s,
											{bl: subst}));
								} else {
									return $author$project$Typesystem$Infer$State$countUnify(s);
								}
							} else {
								return s;
							}
						}();
						return _Utils_Tuple2(
							$author$project$Typesystem$Types$union(
								_List_fromArray(
									[
										A2($author$project$Typesystem$Infer$State$applied, s2, acc),
										A2($author$project$Typesystem$Infer$State$applied, s2, t)
									])),
							s2);
					}),
				_Utils_Tuple2(first, st),
				rest);
		}
	});
var $author$project$Typesystem$Infer$State$traverse = F3(
	function (step, items, st0) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (item, _v0) {
					var acc = _v0.a;
					var st = _v0.b;
					var _v1 = A2(step, item, st);
					var result = _v1.a;
					var st2 = _v1.b;
					return _Utils_Tuple2(
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (xs, x) {
									return _Utils_ap(
										xs,
										_List_fromArray(
											[x]));
								}),
							acc,
							result),
						st2);
				}),
			_Utils_Tuple2(
				$elm$core$Maybe$Just(_List_Nil),
				st0),
			items);
	});
var $author$project$Typesystem$Infer$Variant$typeVariant = F6(
	function (env, node, decl, variant, payload, st) {
		var _v36 = A3($author$project$Typesystem$Infer$Variant$instantiate, node, decl, st);
		var _v37 = _v36.a;
		var named = _v37.a;
		var args = _v37.b;
		var st2 = _v36.b;
		var fromDecl = $author$project$Typesystem$Types$mapVars(
			{
				hV: $author$project$Typesystem$Types$AxisVar,
				k6: function (v) {
					return A2(
						$elm$core$Maybe$withDefault,
						$author$project$Typesystem$Types$TVar(v),
						A2(
							$elm$core$Dict$get,
							v,
							$elm$core$Dict$fromList(
								A3($elm$core$List$map2, $elm$core$Tuple$pair, decl.gK, args))));
				}
			});
		var _v38 = _Utils_Tuple2(
			A2($elm$core$Maybe$map, fromDecl, variant.eC),
			payload);
		if (!_v38.a.$) {
			if (!_v38.b.$) {
				var expected = _v38.a.a;
				var v = _v38.b.a;
				var _v41 = A4($author$project$Typesystem$Infer$Variant$valueType, env, node, v, st2);
				if (!_v41.a.$) {
					var _v42 = _v41.a.a;
					var actual = _v42.a;
					var resolved = _v42.b;
					var st3 = _v41.b;
					var _v43 = A3($author$project$Typesystem$Unify$unify, expected, actual, st3.bl);
					if (!_v43.$) {
						var subst = _v43.a;
						return _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(
									named,
									A2(
										$author$project$Typesystem$Value$VVariant,
										variant.kL,
										$elm$core$Maybe$Just(resolved)))),
							$author$project$Typesystem$Infer$State$countUnify(
								_Utils_update(
									st3,
									{bl: subst})));
					} else {
						var failure = _v43.a;
						return _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A3(
								$author$project$Typesystem$Infer$State$report,
								node,
								A3(
									$author$project$Typesystem$Infer$State$fromFailure,
									A2($author$project$Typesystem$Infer$State$applied, st3, expected),
									A2($author$project$Typesystem$Infer$State$applied, st3, actual),
									failure),
								$author$project$Typesystem$Infer$State$countUnify(st3)));
					}
				} else {
					var _v44 = _v41.a;
					var st3 = _v41.b;
					return _Utils_Tuple2($elm$core$Maybe$Nothing, st3);
				}
			} else {
				var expected = _v38.a.a;
				var _v45 = _v38.b;
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3(
						$author$project$Typesystem$Infer$State$report,
						node,
						$author$project$Typesystem$Diagnostic$TypeMismatch(
							{
								e2: $author$project$Typesystem$Types$TEmpty,
								dV: A2($author$project$Typesystem$Infer$State$applied, st2, expected)
							}),
						st2));
			}
		} else {
			if (_v38.b.$ === 1) {
				var _v39 = _v38.a;
				var _v40 = _v38.b;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(
							named,
							A2($author$project$Typesystem$Value$VVariant, variant.kL, $elm$core$Maybe$Nothing))),
					st2);
			} else {
				var _v46 = _v38.a;
				var v = _v38.b.a;
				var _v47 = A4($author$project$Typesystem$Infer$Variant$valueType, env, node, v, st2);
				if (!_v47.a.$) {
					var _v48 = _v47.a.a;
					var actual = _v48.a;
					var st3 = _v47.b;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A3(
							$author$project$Typesystem$Infer$State$report,
							node,
							$author$project$Typesystem$Diagnostic$TypeMismatch(
								{
									e2: A2($author$project$Typesystem$Infer$State$applied, st3, actual),
									dV: $author$project$Typesystem$Types$TEmpty
								}),
							st3));
				} else {
					var _v49 = _v47.a;
					var st3 = _v47.b;
					return _Utils_Tuple2($elm$core$Maybe$Nothing, st3);
				}
			}
		}
	});
var $author$project$Typesystem$Infer$Variant$valueType = F4(
	function (env, node, value, st) {
		switch (value.$) {
			case 0:
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Typesystem$Types$TNumber, value)),
					st);
			case 1:
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Typesystem$Types$TText, value)),
					st);
			case 2:
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Typesystem$Types$TBool, value)),
					st);
			case 3:
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Typesystem$Types$TDate, value)),
					st);
			case 8:
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Typesystem$Types$TEmpty, value)),
					st);
			case 5:
				var name = value.a;
				var payload = value.b;
				return A6($author$project$Typesystem$Infer$Variant$variantLiteral, env, node, $elm$core$Maybe$Nothing, name, payload, st);
			case 4:
				var fields = value.a;
				return A2(
					$elm$core$Tuple$mapFirst,
					$elm$core$Maybe$map(
						function (entries) {
							return _Utils_Tuple2(
								$author$project$Typesystem$Types$TRecord(
									$elm$core$Dict$fromList(
										A2(
											$elm$core$List$map,
											function (_v23) {
												var f = _v23.a;
												var t = _v23.b;
												return _Utils_Tuple2(f, t);
											},
											entries))),
								$author$project$Typesystem$Value$VRecord(
									$elm$core$Dict$fromList(
										A2(
											$elm$core$List$map,
											function (_v24) {
												var f = _v24.a;
												var v = _v24.c;
												return _Utils_Tuple2(f, v);
											},
											entries))));
						}),
					A3(
						$author$project$Typesystem$Infer$State$traverse,
						F2(
							function (_v21, s) {
								var f = _v21.a;
								var v = _v21.b;
								return A2(
									$elm$core$Tuple$mapFirst,
									$elm$core$Maybe$map(
										function (_v22) {
											var t = _v22.a;
											var resolved = _v22.b;
											return _Utils_Tuple3(f, t, resolved);
										}),
									A4($author$project$Typesystem$Infer$Variant$valueType, env, node, v, s));
							}),
						$elm$core$Dict$toList(fields),
						st));
			case 6:
				var items = value.a;
				var _v25 = A3($author$project$Typesystem$Infer$State$freshAxis, node, 'axis', st);
				var axis = _v25.a;
				var st2 = _v25.b;
				var _v26 = A4($author$project$Typesystem$Infer$Variant$valuesType, env, node, items, st2);
				if (!_v26.a.$) {
					var _v27 = _v26.a.a;
					var elem = _v27.a;
					var resolved = _v27.b;
					var st3 = _v26.b;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(
							_Utils_Tuple2(
								A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, axis, elem),
								$author$project$Typesystem$Value$VList(resolved))),
						st3);
				} else {
					var _v28 = _v26.a;
					var st3 = _v26.b;
					return _Utils_Tuple2($elm$core$Maybe$Nothing, st3);
				}
			default:
				var entries = value.a;
				var _v29 = A3($author$project$Typesystem$Infer$State$freshAxis, node, 'axis', st);
				var axis = _v29.a;
				var st2 = _v29.b;
				var _v30 = A4(
					$author$project$Typesystem$Infer$Variant$valuesType,
					env,
					node,
					A2($elm$core$List$map, $elm$core$Tuple$first, entries),
					st2);
				if (!_v30.a.$) {
					var _v31 = _v30.a.a;
					var key = _v31.a;
					var keys = _v31.b;
					var st3 = _v30.b;
					if ($author$project$Typesystem$Types$isNullable(key)) {
						return _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A3(
								$author$project$Typesystem$Infer$State$report,
								node,
								$author$project$Typesystem$Diagnostic$NullableKey(
									{jn: 'Empty', kK: 'a dict literal cannot have an Empty key'}),
								st3));
					} else {
						var _v32 = A4(
							$author$project$Typesystem$Infer$Variant$valuesType,
							env,
							node,
							A2($elm$core$List$map, $elm$core$Tuple$second, entries),
							st3);
						if (!_v32.a.$) {
							var _v33 = _v32.a.a;
							var elem = _v33.a;
							var values = _v33.b;
							var st4 = _v32.b;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										A3(
											$author$project$Typesystem$Types$TFrame,
											$author$project$Typesystem$Types$DictF(key),
											axis,
											elem),
										$author$project$Typesystem$Value$VDict(
											A3($elm$core$List$map2, $elm$core$Tuple$pair, keys, values)))),
								st4);
						} else {
							var _v34 = _v32.a;
							var st4 = _v32.b;
							return _Utils_Tuple2($elm$core$Maybe$Nothing, st4);
						}
					}
				} else {
					var _v35 = _v30.a;
					var st3 = _v30.b;
					return _Utils_Tuple2($elm$core$Maybe$Nothing, st3);
				}
		}
	});
var $author$project$Typesystem$Infer$Variant$valuesType = F4(
	function (env, node, values, st) {
		var _v18 = A3(
			$author$project$Typesystem$Infer$State$traverse,
			A2($author$project$Typesystem$Infer$Variant$valueType, env, node),
			values,
			st);
		if (!_v18.a.$) {
			var typed = _v18.a.a;
			var st2 = _v18.b;
			return A2(
				$elm$core$Tuple$mapFirst,
				function (joined) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							joined,
							A2($elm$core$List$map, $elm$core$Tuple$second, typed)));
				},
				A3(
					$author$project$Typesystem$Infer$Variant$joinTypes,
					node,
					A2($elm$core$List$map, $elm$core$Tuple$first, typed),
					st2));
		} else {
			var _v19 = _v18.a;
			var st2 = _v18.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		}
	});
var $author$project$Typesystem$Infer$Variant$variantLiteral = F6(
	function (env, node, expected, name, payload, st) {
		var candidates = A2(
			$elm$core$List$filterMap,
			function (decl) {
				var _v17 = decl.h1;
				if (_v17.$ === 1) {
					var variants = _v17.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(decl, variants));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			A2(
				$elm$core$List$filter,
				function (decl) {
					return _Utils_eq(expected, $elm$core$Maybe$Nothing) || _Utils_eq(
						expected,
						$elm$core$Maybe$Just(decl.c_));
				},
				$elm$core$Dict$values(env.fv)));
		var matching = function (pick) {
			return A2(
				$elm$core$List$filterMap,
				function (_v16) {
					var decl = _v16.a;
					var variants = _v16.b;
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(decl),
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (v) {
									return _Utils_eq(
										A2(pick, decl, v.kL),
										name);
								},
								variants)));
				},
				candidates);
		};
		var declaring = function () {
			var _v14 = matching(
				F2(
					function (decl, tag) {
						return A2(
							$elm$core$Maybe$withDefault,
							'',
							A2($elm$core$Dict$get, decl.c_ + ('.' + tag), env.gs));
					}));
			if (!_v14.b) {
				return matching(
					F2(
						function (_v15, tag) {
							return tag;
						}));
			} else {
				var named = _v14;
				return named;
			}
		}();
		if (!declaring.b) {
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					node,
					$author$project$Typesystem$Diagnostic$UnknownName(name),
					st));
		} else {
			if (!declaring.b.b) {
				var _v1 = declaring.a;
				var decl = _v1.a;
				var variant = _v1.b;
				return A6($author$project$Typesystem$Infer$Variant$typeVariant, env, node, decl, variant, payload, st);
			} else {
				var many = declaring;
				var stored = A2(
					$elm$core$Maybe$andThen,
					function (ground) {
						if (ground.$ === 5) {
							var id = ground.a;
							return $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (_v13) {
										var decl = _v13.a;
										return _Utils_eq(decl.c_, id);
									},
									many));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					},
					A2($elm$core$Dict$get, node, env.U));
				var _v2 = _Utils_Tuple2(stored, many);
				if (!_v2.a.$) {
					var _v3 = _v2.a.a;
					var decl = _v3.a;
					var variant = _v3.b;
					return A6($author$project$Typesystem$Infer$Variant$typeVariant, env, node, decl, variant, payload, st);
				} else {
					if (_v2.b.b) {
						var _v4 = _v2.a;
						var _v5 = _v2.b;
						var _v6 = _v5.a;
						var decl = _v6.a;
						var variant = _v6.b;
						var _v7 = A3(
							$elm$core$List$foldl,
							F2(
								function (_v8, _v9) {
									var d = _v8.a;
									var acc = _v9.a;
									var s = _v9.b;
									return A2(
										$elm$core$Tuple$mapFirst,
										function (_v10) {
											var args = _v10.b;
											return _Utils_ap(
												acc,
												_List_fromArray(
													[
														A2($author$project$Typesystem$Types$TNamed, d.c_, args)
													]));
										},
										A3($author$project$Typesystem$Infer$Variant$instantiate, node, d, s));
								}),
							_Utils_Tuple2(_List_Nil, st),
							many);
						var options = _v7.a;
						var st2 = _v7.b;
						var named = A2(
							$elm$core$List$map,
							function (option) {
								return $elm$core$Result$toMaybe(
									A2($author$project$Typesystem$Types$ground, st2.aa, option));
							},
							options);
						return A6(
							$author$project$Typesystem$Infer$Variant$typeVariant,
							env,
							node,
							decl,
							variant,
							payload,
							_Utils_update(
								st2,
								{
									U: _Utils_ap(
										st2.U,
										_List_fromArray(
											[
												{jE: named, jG: node, jZ: options}
											])),
									eN: _Utils_ap(
										st2.eN,
										A2($elm$core$Dict$member, node, env.U) ? _List_fromArray(
											[node]) : _List_Nil)
								}));
					} else {
						var _v11 = _v2.a;
						return _Utils_Tuple2($elm$core$Maybe$Nothing, st);
					}
				}
			}
		}
	});
var $author$project$Typesystem$Infer$Variant$resolvedVariant = F5(
	function (env, node, ref, payload, st) {
		var declared = A2(
			$elm$core$Maybe$andThen,
			function (decl) {
				var _v2 = decl.h1;
				if (_v2.$ === 1) {
					var variants = _v2.a;
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(decl),
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.kL;
									},
									$elm$core$Basics$eq(ref.kL)),
								variants)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			A2($elm$core$Dict$get, ref.fu, env.fv));
		if (!declared.$) {
			var _v1 = declared.a;
			var decl = _v1.a;
			var variant = _v1.b;
			return A6($author$project$Typesystem$Infer$Variant$typeVariant, env, node, decl, variant, payload, st);
		} else {
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					node,
					$author$project$Typesystem$Diagnostic$UnknownName(ref.fu + ('.' + ref.kL)),
					st));
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$Typesystem$Diagnostic$AmbiguousArguments = function (a) {
	return {$: 3, a: a};
};
var $author$project$Typesystem$Infer$Sig$objectName = F2(
	function (ctx, surface) {
		if (surface.$ === 1) {
			var ref = surface.b;
			var _v1 = A4($author$project$Typesystem$Resolve$resolve, ctx.aB, ctx.h0, $elm$core$Basics$identity, ref);
			if (_v1.$ === 2) {
				var o = _v1.a;
				return $elm$core$Maybe$Just(
					A2($author$project$Typesystem$Env$nameOf, ctx.aB, o.c_));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$Sig$binderNames = F5(
	function (ctx, sig, values, slot, param) {
		var declared = function () {
			var _v2 = slot.dy;
			if (_v2.$ === 7) {
				var params = _v2.a;
				return A2($elm$core$Dict$get, param, params);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		var source = function (p) {
			var _v0 = _Utils_Tuple2(p.dy, declared);
			if ((((_v0.a.$ === 8) && (_v0.a.c.$ === 9)) && (!_v0.b.$)) && (_v0.b.a.$ === 9)) {
				var _v1 = _v0.a;
				var cell = _v1.c.a;
				var v = _v0.b.a.a;
				return _Utils_eq(cell, v) ? A2(
					$elm$core$Maybe$andThen,
					$author$project$Typesystem$Infer$Sig$objectName(ctx),
					A2($elm$core$Dict$get, p.c_, values)) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		return A2(
			$elm$core$List$cons,
			A2(
				$elm$core$Maybe$withDefault,
				param,
				A2($elm$core$Dict$get, sig.c_ + ('.' + param), ctx.aB.gs)),
			A2(
				$elm$core$List$filterMap,
				source,
				$author$project$Typesystem$Signature$params(sig)));
	});
var $author$project$Typesystem$Signature$instantiate = F2(
	function (scheme, next) {
		var typeIds = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, v) {
						return _Utils_Tuple2(v, next + i);
					}),
				scheme.eV));
		var body = scheme.h1;
		var axisStart = next + $elm$core$List$length(scheme.eV);
		var axisIds = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, v) {
						return _Utils_Tuple2(v, axisStart + i);
					}),
				scheme.fb));
		var rename = $author$project$Typesystem$Types$mapVars(
			{
				hV: function (v) {
					return $author$project$Typesystem$Types$AxisVar(
						A2(
							$elm$core$Maybe$withDefault,
							v,
							A2($elm$core$Dict$get, v, axisIds)));
				},
				k6: function (v) {
					return $author$project$Typesystem$Types$TVar(
						A2(
							$elm$core$Maybe$withDefault,
							v,
							A2($elm$core$Dict$get, v, typeIds)));
				}
			});
		return _Utils_Tuple2(
			{
				gK: A2(
					$elm$core$List$map,
					function (p) {
						return _Utils_update(
							p,
							{
								dy: rename(p.dy)
							});
					},
					body.gK),
				cu: rename(body.cu)
			},
			axisStart + $elm$core$List$length(scheme.fb));
	});
var $author$project$Typesystem$Infer$Sig$instantiate = F4(
	function (ctx, node, sig, st) {
		var typeStart = st.gx;
		var slotName = function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				't' + $elm$core$String$fromInt(i),
				A2(
					$elm$core$Dict$get,
					sig.c_ + ('.t' + $elm$core$String$fromInt(i)),
					ctx.aB.gs));
		};
		var scheme = sig.g1;
		var origins = st.aa;
		var axisStart = st.gx + $elm$core$List$length(scheme.eV);
		var withOrigins = {
			e9: A3(
				$elm$core$List$foldl,
				function (i) {
					return A2(
						$elm$core$Dict$insert,
						axisStart + i,
						{
							jG: node,
							g6: 'axis' + $elm$core$String$fromInt(i)
						});
				},
				origins.e9,
				A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(scheme.fb) - 1)),
			ho: A3(
				$elm$core$List$foldl,
				function (i) {
					return A2(
						$elm$core$Dict$insert,
						typeStart + i,
						{
							jG: node,
							g6: slotName(i)
						});
				},
				origins.ho,
				A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(scheme.eV) - 1))
		};
		var _v0 = A2($author$project$Typesystem$Signature$instantiate, scheme, st.gx);
		var body = _v0.a;
		var next = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				sig,
				{
					g1: {fb: _List_Nil, h1: body, eV: _List_Nil}
				}),
			_Utils_update(
				st,
				{gx: next, aa: withOrigins}));
	});
var $author$project$Typesystem$Infer$Sig$isFnType = function (t) {
	if (t.$ === 7) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Typesystem$Infer$Classify$ViaLift = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Infer$Classify$alternativeSubst = function (alt) {
	switch (alt.$) {
		case 0:
			var combo = alt.a;
			return combo.bl;
		case 1:
			var combo = alt.c;
			return combo.bl;
		default:
			var flat = alt.a;
			return flat.bl;
	}
};
var $author$project$Typesystem$Infer$Classify$alternativeType = function (alt) {
	switch (alt.$) {
		case 0:
			var combo = alt.a;
			return A2($author$project$Typesystem$Unify$apply, combo.bl, combo.dy);
		case 1:
			var combo = alt.c;
			return A2($author$project$Typesystem$Unify$apply, combo.bl, combo.dy);
		default:
			var flat = alt.a;
			return A2($author$project$Typesystem$Unify$apply, flat.bl, flat.dy);
	}
};
var $author$project$Typesystem$Core$CLam = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Typesystem$Infer$Check$isFunctionName = F2(
	function (env, ref) {
		var _v0 = A3($author$project$Typesystem$Infer$Sig$lookupSignature, env, ref, 0);
		if ((_v0.$ === 1) && (_v0.a.$ === 9)) {
			return false;
		} else {
			return true;
		}
	});
var $author$project$Typesystem$Infer$Sig$labelTarget = F3(
	function (env, sig, label) {
		var params = $author$project$Typesystem$Signature$params(sig);
		return A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.c_;
			},
			$elm$core$List$head(
				function () {
					if (!label.$) {
						var id = label.a;
						return A2(
							$elm$core$List$filter,
							function (p) {
								return _Utils_eq(p.c_, id);
							},
							params);
					} else {
						var name = label.a;
						return A4(
							$author$project$Typesystem$Resolve$byNameOrId,
							function (p) {
								return $elm$core$Maybe$Just(
									A2($author$project$Typesystem$Env$nameOf, env, sig.c_ + ('.' + p.c_)));
							},
							function ($) {
								return $.c_;
							},
							name,
							params);
					}
				}()));
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Typesystem$Infer$Check$withMissingHoles = F6(
	function (ctx, arity, node, fn, args, lookupArity) {
		var _v0 = A3($author$project$Typesystem$Infer$Sig$lookupSignature, ctx.aB, fn, lookupArity);
		if (!_v0.$) {
			var sig = _v0.a;
			var unlabeled = $elm$core$List$length(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.f1;
						},
						$elm$core$Basics$eq($elm$core$Maybe$Nothing)),
					args));
			var labeled = A2(
				$elm$core$List$filterMap,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.f1;
					},
					$elm$core$Maybe$andThen(
						A2($author$project$Typesystem$Infer$Sig$labelTarget, ctx.aB, sig))),
				args);
			var open = A2(
				$elm$core$List$filter,
				function (p) {
					return !A2($elm$core$List$member, p.c_, labeled);
				},
				$author$project$Typesystem$Signature$params(sig));
			var missingValues = $elm$core$List$length(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.dy;
						},
						A2($elm$core$Basics$composeR, $author$project$Typesystem$Infer$Sig$isFnType, $elm$core$Basics$not)),
					open));
			var holeIds = A2(
				$elm$core$List$map,
				function (i) {
					return node + ('#' + $elm$core$String$fromInt(i));
				},
				A2(
					$elm$core$List$range,
					1,
					A2(
						$elm$core$Maybe$withDefault,
						0,
						$elm$core$List$minimum(
							_List_fromArray(
								[
									arity,
									missingValues,
									$elm$core$List$length(open) - unlabeled
								])))));
			return _Utils_Tuple2(
				A3(
					$author$project$Typesystem$Surface$SCall,
					node,
					fn,
					_Utils_ap(
						args,
						A2(
							$elm$core$List$map,
							function (h) {
								return {
									f1: $elm$core$Maybe$Nothing,
									hp: $author$project$Typesystem$Surface$SHole(h)
								};
							},
							holeIds))),
				holeIds);
		} else {
			return _Utils_Tuple2(
				A3($author$project$Typesystem$Surface$SCall, node, fn, args),
				_List_Nil);
		}
	});
var $author$project$Typesystem$Infer$Check$abstractable = F4(
	function (ctx, arity, surface, st) {
		switch (surface.$) {
			case 3:
				var node = surface.a;
				var fn = surface.b;
				var args = surface.c;
				return A6(
					$author$project$Typesystem$Infer$Check$withMissingHoles,
					ctx,
					arity,
					node,
					fn,
					args,
					$elm$core$List$length(args));
			case 1:
				var node = surface.a;
				var ref = surface.b;
				return (_Utils_eq(
					A4(
						$author$project$Typesystem$Resolve$resolve,
						ctx.aB,
						ctx.h0,
						$author$project$Typesystem$Infer$State$applied(st),
						ref),
					$author$project$Typesystem$Resolve$NotFound) && A2($author$project$Typesystem$Infer$Check$isFunctionName, ctx.aB, ref)) ? A6($author$project$Typesystem$Infer$Check$withMissingHoles, ctx, arity, node, ref, _List_Nil, arity) : _Utils_Tuple2(surface, _List_Nil);
			case 5:
				var node = surface.a;
				var f = surface.b;
				var g = surface.c;
				var hole = node + '#in';
				return _Utils_Tuple2(
					A3(
						$author$project$Typesystem$Surface$SPipe,
						node,
						A3(
							$author$project$Typesystem$Surface$SPipe,
							node,
							$author$project$Typesystem$Surface$SHole(hole),
							f),
						g),
					_List_fromArray(
						[hole]));
			default:
				return _Utils_Tuple2(surface, _List_Nil);
		}
	});
var $author$project$Typesystem$Infer$Check$binderScopes = F3(
	function (names, params, st) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, _v1) {
					var param = _v0.a;
					var t = _v0.b;
					var acc = _v1.a;
					var s = _v1.b;
					var _v2 = $author$project$Typesystem$Infer$State$freshBinder(s);
					var binder = _v2.a;
					var s2 = _v2.b;
					return _Utils_Tuple2(
						_Utils_ap(
							acc,
							_List_fromArray(
								[
									{
									b4: binder,
									gs: names(param),
									gI: param,
									dy: A2($author$project$Typesystem$Infer$State$applied, s, t)
								}
								])),
						s2);
				}),
			_Utils_Tuple2(_List_Nil, st),
			$elm$core$Dict$toList(params));
	});
var $author$project$Typesystem$Core$CRecord = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Infer$Check$literalFits = F2(
	function (surface, expected) {
		var _v0 = _Utils_Tuple2(surface, expected);
		_v0$2:
		while (true) {
			if (!_v0.a.$) {
				switch (_v0.b.$) {
					case 11:
						var _v1 = _v0.a;
						var v = _v1.b;
						var w = _v0.b.a;
						return A2($author$project$Typesystem$Semantics$equal, v, w);
					case 6:
						var _v2 = _v0.a;
						var members = _v0.b.a;
						return A2(
							$elm$core$List$any,
							$author$project$Typesystem$Infer$Check$literalFits(surface),
							members);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return false;
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Typesystem$Core$CField = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Typesystem$Core$CVar = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Diagnostic$ProposeMapping = $elm$core$Basics$identity;
var $author$project$Typesystem$Infer$Check$recordFields = F2(
	function (env, t) {
		switch (t.$) {
			case 4:
				var fields = t.a;
				return $elm$core$Maybe$Just(
					$elm$core$Dict$toList(fields));
			case 5:
				var id = t.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.h1;
					},
					A2($elm$core$Dict$get, id, env.fv));
				if ((!_v1.$) && (!_v1.a.$)) {
					var fields = _v1.a.a;
					return $elm$core$Maybe$Just(
						$elm$core$Dict$toList(fields));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$Check$proposeMapping = F6(
	function (env, node, failure, expected, actual, subst) {
		var line = F2(
			function (_v7, acc) {
				var f = _v7.a;
				var t = _v7.b;
				return A2(
					$elm$core$Maybe$andThen,
					function (_v3) {
						var fields = _v3.a;
						var s = _v3.b;
						var _v4 = A2(
							$elm$core$List$filter,
							function (_v5) {
								var g = _v5.a;
								return _Utils_eq(
									A2($author$project$Typesystem$Env$nameOf, env, g),
									A2($author$project$Typesystem$Env$nameOf, env, f));
							},
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2($author$project$Typesystem$Infer$Check$recordFields, env, actual)));
						if (_v4.b && (!_v4.b.b)) {
							var _v6 = _v4.a;
							var g = _v6.a;
							var u = _v6.b;
							return A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$pair(
									A3(
										$elm$core$Dict$insert,
										f,
										A2(
											$author$project$Typesystem$Core$CField,
											g,
											$author$project$Typesystem$Core$CVar('source')),
										fields)),
								$elm$core$Result$toMaybe(
									A3($author$project$Typesystem$Unify$unify, t, u, s)));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					},
					acc);
			});
		var _v0 = _Utils_Tuple3(
			failure,
			A2($author$project$Typesystem$Infer$Check$recordFields, env, expected),
			A2($author$project$Typesystem$Infer$Check$recordFields, env, actual));
		if ((((!_v0.a.$) && (!_v0.b.$)) && _v0.b.a.b) && (!_v0.c.$)) {
			var _v1 = _v0.a;
			var wanted = _v0.b.a;
			return A2(
				$elm$core$Maybe$map,
				function (_v2) {
					var fields = _v2.a;
					return {fE: fields, iW: actual, c_: 'proposed:' + node, k3: expected};
				},
				A3(
					$elm$core$List$foldl,
					line,
					$elm$core$Maybe$Just(
						_Utils_Tuple2($elm$core$Dict$empty, subst)),
					wanted));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$Check$checkPlain = F5(
	function (synth, ctx, surface, expected, st) {
		var _v6 = function () {
			var _v7 = _Utils_Tuple2(
				surface,
				A2($author$project$Typesystem$Infer$State$applied, st, expected));
			_v7$2:
			while (true) {
				switch (_v7.a.$) {
					case 7:
						if (_v7.b.$ === 4) {
							var _v8 = _v7.a;
							var node = _v8.a;
							var fields = _v8.b;
							var fs = _v7.b.a;
							return A2(
								$author$project$Typesystem$Infer$State$annotateWith,
								node,
								A5(
									$author$project$Typesystem$Infer$Check$synthRecord,
									synth,
									ctx,
									$elm$core$Maybe$Just(fs),
									fields,
									st));
						} else {
							break _v7$2;
						}
					case 0:
						if ((_v7.a.b.$ === 5) && (_v7.b.$ === 5)) {
							var _v9 = _v7.a;
							var node = _v9.a;
							var _v10 = _v9.b;
							var name = _v10.a;
							var payload = _v10.b;
							var _v11 = _v7.b;
							var decl = _v11.a;
							return A2(
								$author$project$Typesystem$Infer$State$annotateWith,
								node,
								A2(
									$elm$core$Tuple$mapFirst,
									$elm$core$Maybe$map(
										function (_v12) {
											var t = _v12.a;
											var resolved = _v12.b;
											return _Utils_Tuple2(
												t,
												$author$project$Typesystem$Core$CLit(resolved));
										}),
									A6(
										$author$project$Typesystem$Infer$Variant$variantLiteral,
										ctx.aB,
										node,
										$elm$core$Maybe$Just(decl),
										name,
										payload,
										st)));
						} else {
							break _v7$2;
						}
					default:
						break _v7$2;
				}
			}
			return A3(synth, ctx, surface, st);
		}();
		var result = _v6.a;
		var st2 = _v6.b;
		if (result.$ === 1) {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var _v14 = result.a;
			var actual = _v14.a;
			var core = _v14.b;
			if (A2(
				$author$project$Typesystem$Infer$Check$literalFits,
				surface,
				A2($author$project$Typesystem$Infer$State$applied, st2, expected))) {
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(core),
					st2);
			} else {
				var _v15 = A3($author$project$Typesystem$Unify$unify, expected, actual, st2.bl);
				if (!_v15.$) {
					var subst = _v15.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(core),
						$author$project$Typesystem$Infer$State$countUnify(
							_Utils_update(
								st2,
								{bl: subst})));
				} else {
					var failure = _v15.a;
					var _v16 = _Utils_Tuple2(
						A2($author$project$Typesystem$Infer$State$applied, st2, expected),
						A2($author$project$Typesystem$Infer$State$applied, st2, actual));
					var wanted = _v16.a;
					var found = _v16.b;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A4(
							$author$project$Typesystem$Infer$State$reportWith,
							$author$project$Typesystem$Surface$nodeId(surface),
							A3($author$project$Typesystem$Infer$State$fromFailure, wanted, found, failure),
							A6(
								$author$project$Typesystem$Infer$Check$proposeMapping,
								ctx.aB,
								$author$project$Typesystem$Surface$nodeId(surface),
								failure,
								wanted,
								found,
								st2.bl),
							$author$project$Typesystem$Infer$State$countUnify(st2)));
				}
			}
		}
	});
var $author$project$Typesystem$Infer$Check$synthRecord = F5(
	function (synth, ctx, expected, fields, st) {
		var fieldId = function (ref) {
			var _v3 = _Utils_Tuple2(ref, expected);
			if (!_v3.a.$) {
				var f = _v3.a.a;
				return $elm$core$Result$Ok(f);
			} else {
				if (_v3.b.$ === 1) {
					var n = _v3.a.a;
					var _v4 = _v3.b;
					return $elm$core$Result$Ok(n);
				} else {
					var n = _v3.a.a;
					var fs = _v3.b.a;
					var _v5 = A4(
						$author$project$Typesystem$Resolve$byNameOrId,
						$author$project$Typesystem$Resolve$displayNameOf(ctx.aB),
						$elm$core$Basics$identity,
						n,
						$elm$core$Dict$keys(fs));
					if (!_v5.b) {
						return $elm$core$Result$Ok(n);
					} else {
						if (!_v5.b.b) {
							var f = _v5.a;
							return $elm$core$Result$Ok(f);
						} else {
							var many = _v5;
							return $elm$core$Result$Err(
								$author$project$Typesystem$Diagnostic$AmbiguousName(
									{ic: many, jD: n}));
						}
					}
				}
			}
		};
		var step = F2(
			function (_v2, s) {
				var ref = _v2.a;
				var value = _v2.b;
				var _v0 = fieldId(ref);
				if (_v0.$ === 1) {
					var problem = _v0.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A3(
							$author$project$Typesystem$Infer$State$report,
							$author$project$Typesystem$Surface$nodeId(value),
							problem,
							s));
				} else {
					var f = _v0.a;
					var _v1 = A2(
						$elm$core$Maybe$andThen,
						$elm$core$Dict$get(f),
						expected);
					if (!_v1.$) {
						var fieldType = _v1.a;
						return A2(
							$elm$core$Tuple$mapFirst,
							$elm$core$Maybe$map(
								function (core) {
									return _Utils_Tuple2(
										f,
										_Utils_Tuple2(fieldType, core));
								}),
							A5($author$project$Typesystem$Infer$Check$checkPlain, synth, ctx, value, fieldType, s));
					} else {
						return A2(
							$elm$core$Tuple$mapFirst,
							$elm$core$Maybe$map(
								$elm$core$Tuple$pair(f)),
							A3(synth, ctx, value, s));
					}
				}
			});
		return A2(
			$elm$core$Tuple$mapFirst,
			$elm$core$Maybe$map(
				function (typed) {
					return _Utils_Tuple2(
						$author$project$Typesystem$Types$TRecord(
							$elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									$elm$core$Tuple$mapSecond($elm$core$Tuple$first),
									typed))),
						$author$project$Typesystem$Core$CRecord(
							$elm$core$Dict$fromList(
								A2(
									$elm$core$List$map,
									$elm$core$Tuple$mapSecond($elm$core$Tuple$second),
									typed))));
				}),
			A3($author$project$Typesystem$Infer$State$traverse, step, fields, st));
	});
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $elm$core$Set$diff = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$diff, dict1, dict2);
	});
var $elm$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			$elm$core$Dict$filter,
			F2(
				function (k, _v0) {
					return A2($elm$core$Dict$member, k, t2);
				}),
			t1);
	});
var $elm$core$Set$intersect = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$intersect, dict1, dict2);
	});
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$Typesystem$Infer$Check$lamBinders = function (scopes) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (b) {
				return _Utils_Tuple2(b.gI, b.b4);
			},
			scopes));
};
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Typesystem$Infer$State$withBinders = F3(
	function (node, binders, st) {
		return _Utils_update(
			st,
			{
				e7: A3(
					$elm$core$Dict$update,
					node,
					$elm$core$Maybe$map(
						function (a) {
							return _Utils_update(
								a,
								{h0: binders});
						}),
					st.e7)
			});
	});
var $author$project$Typesystem$Infer$Check$abstract = F7(
	function (synth, ctx, names, surface, params, result, st) {
		var _v0 = A3($author$project$Typesystem$Infer$Check$binderScopes, names, params, st);
		var scopes = _v0.a;
		var st2 = _v0.b;
		var own = $elm$core$Set$fromList(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.b4;
				},
				scopes));
		var _v1 = A4(
			$author$project$Typesystem$Infer$Check$abstractable,
			ctx,
			$elm$core$Dict$size(params),
			surface,
			st2);
		var body = _v1.a;
		var holeIds = _v1.b;
		var _v2 = A3(
			synth,
			_Utils_update(
				ctx,
				{
					h0: _Utils_ap(scopes, ctx.h0)
				}),
			body,
			_Utils_update(
				st2,
				{aS: scopes}));
		var sandboxed = _v2.a;
		var st3 = _v2.b;
		var restore = function (s) {
			return _Utils_update(
				s,
				{
					e7: A3($elm$core$List$foldl, $elm$core$Dict$remove, s.e7, holeIds),
					aS: st.aS,
					bZ: A2(
						$elm$core$Set$union,
						st.bZ,
						A2($elm$core$Set$diff, s.bZ, own))
				});
		};
		if ($elm$core$Set$isEmpty(
			A2($elm$core$Set$intersect, own, st3.bZ))) {
			return A5(
				$author$project$Typesystem$Infer$Check$checkPlain,
				synth,
				ctx,
				surface,
				A2($author$project$Typesystem$Types$TFn, params, result),
				_Utils_update(
					st,
					{gx: st3.gx}));
		} else {
			if (sandboxed.$ === 1) {
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					restore(st3));
			} else {
				var _v4 = sandboxed.a;
				var actual = _v4.a;
				var core = _v4.b;
				var _v5 = A3($author$project$Typesystem$Unify$unify, result, actual, st3.bl);
				if (!_v5.$) {
					var subst = _v5.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(
							A2(
								$author$project$Typesystem$Core$CLam,
								$author$project$Typesystem$Infer$Check$lamBinders(scopes),
								core)),
						A3(
							$author$project$Typesystem$Infer$State$withBinders,
							$author$project$Typesystem$Surface$nodeId(surface),
							A2(
								$elm$core$List$map,
								function ($) {
									return $.b4;
								},
								scopes),
							restore(
								$author$project$Typesystem$Infer$State$countUnify(
									_Utils_update(
										st3,
										{bl: subst})))));
				} else {
					var failure = _v5.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A3(
							$author$project$Typesystem$Infer$State$report,
							$author$project$Typesystem$Surface$nodeId(surface),
							A3(
								$author$project$Typesystem$Infer$State$fromFailure,
								A2($author$project$Typesystem$Infer$State$applied, st3, result),
								A2($author$project$Typesystem$Infer$State$applied, st3, actual),
								failure),
							restore(
								$author$project$Typesystem$Infer$State$countUnify(st3))));
				}
			}
		}
	});
var $author$project$Typesystem$Infer$Check$checkAlways = F7(
	function (synth, ctx, node, value, params, result, st) {
		var _v0 = A3($author$project$Typesystem$Infer$Check$binderScopes, $elm$core$List$singleton, params, st);
		var scopes = _v0.a;
		var st2 = _v0.b;
		var _v1 = A5(
			$author$project$Typesystem$Infer$Check$checkPlain,
			synth,
			ctx,
			value,
			result,
			_Utils_update(
				st2,
				{aS: _List_Nil}));
		var checked = _v1.a;
		var st3 = _v1.b;
		if (checked.$ === 1) {
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				_Utils_update(
					st3,
					{aS: st.aS}));
		} else {
			var core = checked.a;
			var st4 = _Utils_update(
				st3,
				{aS: st.aS});
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					A2(
						$author$project$Typesystem$Core$CLam,
						$author$project$Typesystem$Infer$Check$lamBinders(scopes),
						core)),
				A3(
					$author$project$Typesystem$Infer$State$annotate,
					node,
					{
						h0: A2(
							$elm$core$List$map,
							function ($) {
								return $.b4;
							},
							scopes),
						i$: 0,
						bg: _List_Nil,
						dy: A2(
							$author$project$Typesystem$Infer$State$applied,
							st4,
							A2($author$project$Typesystem$Types$TFn, params, result))
					},
					st4));
		}
	});
var $author$project$Typesystem$Infer$Check$constantFunction = F2(
	function (ctx, surface) {
		if (((surface.$ === 3) && surface.c.b) && (!surface.c.b.b)) {
			var node = surface.a;
			var fn = surface.b;
			var _v1 = surface.c;
			var a = _v1.a;
			var _v2 = A3($author$project$Typesystem$Infer$Sig$lookupSignature, ctx.aB, fn, 1);
			if (!_v2.$) {
				var sig = _v2.a;
				return ((sig.c_ === 'always') && (_Utils_eq(a.f1, $elm$core$Maybe$Nothing) || (!_Utils_eq(
					A2(
						$elm$core$Maybe$andThen,
						A2($author$project$Typesystem$Infer$Sig$labelTarget, ctx.aB, sig),
						a.f1),
					$elm$core$Maybe$Nothing)))) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(node, a.hp)) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$Check$checkFn = F7(
	function (synth, ctx, names, surface, params, result, st) {
		var _v0 = _Utils_Tuple2(
			A2($author$project$Typesystem$Infer$Check$constantFunction, ctx, surface),
			surface);
		if (!_v0.a.$) {
			var _v1 = _v0.a.a;
			var node = _v1.a;
			var value = _v1.b;
			return A7($author$project$Typesystem$Infer$Check$checkAlways, synth, ctx, node, value, params, result, st);
		} else {
			if (_v0.b.$ === 5) {
				var _v2 = _v0.a;
				var _v3 = _v0.b;
				var node = _v3.a;
				if ($elm$core$Dict$size(params) === 1) {
					return A7($author$project$Typesystem$Infer$Check$abstract, synth, ctx, names, surface, params, result, st);
				} else {
					var _v4 = A3($author$project$Typesystem$Infer$State$freshVar, node, 'input', st);
					var input = _v4.a;
					var st2 = _v4.b;
					var _v5 = A3($author$project$Typesystem$Infer$State$freshVar, node, 'output', st2);
					var output = _v5.a;
					var st3 = _v5.b;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A3(
							$author$project$Typesystem$Infer$State$report,
							node,
							$author$project$Typesystem$Diagnostic$TypeMismatch(
								{
									e2: A2(
										$author$project$Typesystem$Types$TFn,
										A2($elm$core$Dict$singleton, 'entry', input),
										output),
									dV: A2(
										$author$project$Typesystem$Infer$State$applied,
										st3,
										A2($author$project$Typesystem$Types$TFn, params, result))
								}),
							st3));
				}
			} else {
				var _v6 = _v0.a;
				return A7($author$project$Typesystem$Infer$Check$abstract, synth, ctx, names, surface, params, result, st);
			}
		}
	});
var $author$project$Typesystem$Infer$Elaborate$checkSlot = F6(
	function (synth, ctx, names, surface, expected, st) {
		if (expected.$ === 7) {
			var params = expected.a;
			var result = expected.b;
			return A7($author$project$Typesystem$Infer$Check$checkFn, synth, ctx, names, surface, params, result, st);
		} else {
			return A5($author$project$Typesystem$Infer$Check$checkPlain, synth, ctx, surface, expected, st);
		}
	});
var $author$project$Typesystem$Infer$Elaborate$checkSlots = F4(
	function (synth, ctx, slots, st) {
		return A3(
			$author$project$Typesystem$Infer$State$traverse,
			F2(
				function (_v0, s) {
					var p = _v0.a;
					var surface = _v0.b;
					return A2(
						$elm$core$Tuple$mapFirst,
						$elm$core$Maybe$map(
							$elm$core$Tuple$pair(p.c_)),
						A6(
							$author$project$Typesystem$Infer$Elaborate$checkSlot,
							synth,
							ctx,
							slots.gs(p),
							surface,
							A2($author$project$Typesystem$Infer$State$applied, s, p.dy),
							s));
				}),
			slots.hS,
			st);
	});
var $author$project$Typesystem$Infer$Elaborate$maxJoinIterations = 3;
var $author$project$Typesystem$Infer$Elaborate$joinEmpty = F2(
	function (expected, actual) {
		var _v0 = _Utils_Tuple2(expected, actual);
		if ((_v0.a.$ === 8) && (_v0.b.$ === 8)) {
			var _v1 = _v0.a;
			var k1 = _v1.a;
			var x1 = _v1.b;
			var c1 = _v1.c;
			var _v2 = _v0.b;
			var k2 = _v2.a;
			var x2 = _v2.b;
			var c2 = _v2.c;
			return (_Utils_eq(k1, k2) && _Utils_eq(x1, x2)) ? A2(
				$elm$core$Maybe$map,
				A2($author$project$Typesystem$Types$TFrame, k1, x1),
				A2($author$project$Typesystem$Infer$Elaborate$joinEmpty, c1, c2)) : $elm$core$Maybe$Nothing;
		} else {
			var members = function (t) {
				if (t.$ === 6) {
					var ts = t.a;
					return ts;
				} else {
					return _List_fromArray(
						[t]);
				}
			};
			var known = members(expected);
			return ((!A2($elm$core$List$member, $author$project$Typesystem$Types$TEmpty, known)) && (A2(
				$elm$core$List$member,
				$author$project$Typesystem$Types$TEmpty,
				members(actual)) && A2(
				$elm$core$List$all,
				function (t) {
					return _Utils_eq(t, $author$project$Typesystem$Types$TEmpty) || A2($elm$core$List$member, t, known);
				},
				members(actual)))) ? $elm$core$Maybe$Just(
				$author$project$Typesystem$Types$union(
					_List_fromArray(
						[expected, $author$project$Typesystem$Types$TEmpty]))) : $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Infer$Elaborate$widened = F3(
	function (slots, before, failed) {
		var widen = F2(
			function (v, m) {
				return _Utils_eq(
					A2(
						$author$project$Typesystem$Infer$State$applied,
						before,
						$author$project$Typesystem$Types$TVar(v)),
					m.dV) ? A2(
					$elm$core$Maybe$map,
					function (joined) {
						var s = before.bl;
						return _Utils_update(
							s,
							{
								ho: A3($elm$core$Dict$insert, v, joined, s.ho)
							});
					},
					A2($author$project$Typesystem$Infer$Elaborate$joinEmpty, m.dV, m.e2)) : $elm$core$Maybe$Nothing;
			});
		var resultVars = A2(
			$elm$core$List$filterMap,
			function (_v1) {
				var p = _v1.a;
				var _v2 = p.dy;
				if ((_v2.$ === 7) && (_v2.b.$ === 9)) {
					var v = _v2.b.a;
					return $elm$core$Maybe$Just(v);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			slots.hS);
		var mismatches = A2(
			$elm$core$List$filterMap,
			function (d) {
				var _v0 = d.j9;
				if (!_v0.$) {
					var m = _v0.a;
					return $elm$core$Maybe$Just(m);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			A2(
				$elm$core$List$drop,
				$elm$core$List$length(before.cf),
				failed.cf));
		return $elm$core$List$head(
			A2(
				$elm$core$List$concatMap,
				function (v) {
					return A2(
						$elm$core$List$filterMap,
						widen(v),
						mismatches);
				},
				resultVars));
	});
var $author$project$Typesystem$Infer$Elaborate$checkSlotsJoined = F5(
	function (synth, ctx, slots, iteration, st0) {
		checkSlotsJoined:
		while (true) {
			var _v0 = A4($author$project$Typesystem$Infer$Elaborate$checkSlots, synth, ctx, slots, st0);
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				var failed = _v0.b;
				var _v2 = _Utils_Tuple2(
					_Utils_cmp(iteration, $author$project$Typesystem$Infer$Elaborate$maxJoinIterations) < 0,
					A3($author$project$Typesystem$Infer$Elaborate$widened, slots, st0, failed));
				if (_v2.a && (!_v2.b.$)) {
					var subst = _v2.b.a;
					var $temp$synth = synth,
						$temp$ctx = ctx,
						$temp$slots = slots,
						$temp$iteration = iteration + 1,
						$temp$st0 = _Utils_update(
						st0,
						{bl: subst});
					synth = $temp$synth;
					ctx = $temp$ctx;
					slots = $temp$slots;
					iteration = $temp$iteration;
					st0 = $temp$st0;
					continue checkSlotsJoined;
				} else {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, failed);
				}
			} else {
				var ok = _v0;
				return ok;
			}
		}
	});
var $author$project$Typesystem$Core$CGroup = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $author$project$Typesystem$Core$CLift = function (a) {
	return {$: 9, a: a};
};
var $author$project$Typesystem$Core$CPrim = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Typesystem$Core$GFlattenTo = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Types$axisBase = function (id) {
	var _v0 = $elm$core$List$reverse(
		A2($elm$core$String$split, '#', id));
	if (_v0.b && _v0.b.b) {
		var last = _v0.a;
		var rest = _v0.b;
		return (!_Utils_eq(
			$elm$core$String$toInt(last),
			$elm$core$Maybe$Nothing)) ? A2(
			$elm$core$String$join,
			'#',
			$elm$core$List$reverse(rest)) : id;
	} else {
		return id;
	}
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Typesystem$Types$distinctEach = function (seen) {
	return A2(
		$elm$core$List$foldr,
		F2(
			function (member, _v3) {
				var ts = _v3.a;
				var renames = _v3.b;
				return A3(
					$elm$core$Tuple$mapBoth,
					function (m) {
						return A2($elm$core$List$cons, m, ts);
					},
					function (r) {
						return _Utils_ap(r, renames);
					},
					A2($author$project$Typesystem$Types$distinctUnder, seen, member));
			}),
		_Utils_Tuple2(_List_Nil, _List_Nil));
};
var $author$project$Typesystem$Types$distinctUnder = F2(
	function (seen, t) {
		switch (t.$) {
			case 8:
				if (!t.b.$) {
					var kind = t.a;
					var id = t.b.a;
					var inner = t.c;
					var base = $author$project$Typesystem$Types$axisBase(id);
					var k = 1 + A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Dict$get, base, seen));
					var numbered = (k === 1) ? base : (base + ('#' + $elm$core$String$fromInt(k)));
					var _v1 = A2(
						$author$project$Typesystem$Types$distinctUnder,
						A3($elm$core$Dict$insert, base, k, seen),
						inner);
					var inner2 = _v1.a;
					var renames = _v1.b;
					return _Utils_Tuple2(
						A3(
							$author$project$Typesystem$Types$TFrame,
							kind,
							$author$project$Typesystem$Types$Axis(numbered),
							inner2),
						_Utils_ap(
							((k > 1) && (!_Utils_eq(numbered, id))) ? _List_fromArray(
								[
									_Utils_Tuple2(numbered, base)
								]) : _List_Nil,
							renames));
				} else {
					var kind = t.a;
					var axis = t.b;
					var inner = t.c;
					return A2(
						$elm$core$Tuple$mapFirst,
						A2($author$project$Typesystem$Types$TFrame, kind, axis),
						A2($author$project$Typesystem$Types$distinctUnder, seen, inner));
				}
			case 6:
				var members = t.a;
				return A2(
					$elm$core$Tuple$mapFirst,
					$author$project$Typesystem$Types$union,
					A2($author$project$Typesystem$Types$distinctEach, seen, members));
			case 4:
				var fields = t.a;
				var _v2 = $elm$core$List$unzip(
					$elm$core$Dict$toList(fields));
				var names = _v2.a;
				var types = _v2.b;
				return A2(
					$elm$core$Tuple$mapFirst,
					function (ts) {
						return $author$project$Typesystem$Types$TRecord(
							$elm$core$Dict$fromList(
								A3($elm$core$List$map2, $elm$core$Tuple$pair, names, ts)));
					},
					A2($author$project$Typesystem$Types$distinctEach, seen, types));
			case 5:
				var id = t.a;
				var args = t.b;
				return A2(
					$elm$core$Tuple$mapFirst,
					$author$project$Typesystem$Types$TNamed(id),
					A2($author$project$Typesystem$Types$distinctEach, seen, args));
			default:
				return _Utils_Tuple2(t, _List_Nil);
		}
	});
var $author$project$Typesystem$Types$distinctAxes = $author$project$Typesystem$Types$distinctUnder($elm$core$Dict$empty);
var $author$project$Typesystem$Infer$Elaborate$distinctAxes = F2(
	function (ctx, _v0) {
		var t = _v0.a;
		var st = _v0.b;
		var current = A2($author$project$Typesystem$Infer$State$applied, st, t);
		var _v1 = $author$project$Typesystem$Types$distinctAxes(current);
		var renamed = _v1.a;
		var renames = _v1.b;
		if (_Utils_eq(renamed, current)) {
			return _Utils_Tuple2(t, st);
		} else {
			var env = ctx.aB;
			var named = _Utils_update(
				env,
				{
					gs: A2($elm$core$Dict$union, st.dM, env.gs)
				});
			return _Utils_Tuple2(
				renamed,
				_Utils_update(
					st,
					{
						dM: A3(
							$elm$core$List$foldl,
							function (_v2) {
								var numbered = _v2.a;
								var base = _v2.b;
								return A2(
									$elm$core$Dict$insert,
									numbered,
									A2($author$project$Typesystem$Env$nameOf, named, base));
							},
							st.dM,
							renames)
					}));
		}
	});
var $author$project$Typesystem$Core$DictTag = 1;
var $author$project$Typesystem$Core$ListTag = 0;
var $author$project$Typesystem$Infer$Classify$frameTag = function (kind) {
	if (!kind.$) {
		return 0;
	} else {
		return 1;
	}
};
var $author$project$Typesystem$Types$peelLiftable = function (t) {
	var level = F4(
		function (kind, axis, nullable_, inner) {
			var _v3 = $author$project$Typesystem$Types$peelLiftable(inner);
			var rest = _v3.a;
			var cell = _v3.b;
			return _Utils_Tuple2(
				A2(
					$elm$core$List$cons,
					{fa: axis, jp: kind, aW: nullable_},
					rest),
				cell);
		});
	switch (t.$) {
		case 8:
			var kind = t.a;
			var axis = t.b;
			var inner = t.c;
			return A4(level, kind, axis, false, inner);
		case 6:
			var members = t.a;
			var _v1 = A2(
				$elm$core$List$filter,
				$elm$core$Basics$neq($author$project$Typesystem$Types$TEmpty),
				members);
			if ((_v1.b && (_v1.a.$ === 8)) && (!_v1.b.b)) {
				var _v2 = _v1.a;
				var kind = _v2.a;
				var axis = _v2.b;
				var inner = _v2.c;
				return A2($elm$core$List$member, $author$project$Typesystem$Types$TEmpty, members) ? A4(level, kind, axis, true, inner) : _Utils_Tuple2(_List_Nil, t);
			} else {
				return _Utils_Tuple2(_List_Nil, t);
			}
		default:
			return _Utils_Tuple2(_List_Nil, t);
	}
};
var $author$project$Typesystem$Core$GLiftPivot = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Typesystem$Lift$relativeDepths = function (depths) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, depth) {
				return depth - $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						function (moved) {
							return _Utils_cmp(moved, depth) < 0;
						},
						A2($elm$core$List$take, i, depths)));
			}),
		depths);
};
var $author$project$Typesystem$Lift$pivotSelectors = function (lifted) {
	return A3(
		$elm$core$List$map2,
		$author$project$Typesystem$Core$GLiftPivot,
		$author$project$Typesystem$Lift$relativeDepths(
			A2($elm$core$List$map, $elm$core$Tuple$first, lifted)),
		A2($elm$core$List$map, $elm$core$Tuple$second, lifted));
};
var $author$project$Typesystem$Infer$Classify$pivoted = F2(
	function (order, core) {
		return _Utils_eq(
			A2($elm$core$List$map, $elm$core$Tuple$first, order),
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(order) - 1)) ? core : A2(
			$author$project$Typesystem$Core$CGroup,
			$author$project$Typesystem$Lift$pivotSelectors(order),
			core);
	});
var $author$project$Typesystem$Infer$Elaborate$elaborateOwn = F7(
	function (ctx, node, sig, valueArgs, slotCores, alt, st) {
		var prim = function (cores) {
			return A2(
				$author$project$Typesystem$Core$CPrim,
				sig.c_,
				$elm$core$Dict$fromList(
					_Utils_ap(
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, _v12) {
									var p = _v12.a;
									var a = _v12.b;
									return _Utils_Tuple2(
										p.c_,
										A2(
											$elm$core$Maybe$withDefault,
											a.iw,
											A2($elm$core$Dict$get, i, cores)));
								}),
							valueArgs),
						slotCores)));
		};
		var _v0 = function () {
			switch (alt.$) {
				case 2:
					var flat = alt.a;
					return _Utils_Tuple3(
						{bg: _List_Nil, dy: flat.dy},
						prim(
							$elm$core$Dict$fromList(
								A2(
									$elm$core$List$indexedMap,
									F2(
										function (i, _v2) {
											var a = _v2.b;
											return _Utils_Tuple2(
												i,
												A2(
													$author$project$Typesystem$Core$CGroup,
													_List_fromArray(
														[
															$author$project$Typesystem$Core$GFlattenTo(flat.fx)
														]),
													a.iw));
										}),
									valueArgs))),
						st);
				case 1:
					return _Utils_Tuple3(
						{bg: _List_Nil, dy: $author$project$Typesystem$Types$TEmpty},
						$author$project$Typesystem$Core$CLit($author$project$Typesystem$Value$VEmpty),
						st);
				default:
					var combo = alt.a;
					var sources = $elm$core$Dict$fromList(
						A2(
							$elm$core$List$indexedMap,
							$elm$core$Tuple$pair,
							A3(
								$elm$core$List$map2,
								F2(
									function (_v10, order) {
										var a = _v10.b;
										return A2($author$project$Typesystem$Infer$Classify$pivoted, order, a.iw);
									}),
								valueArgs,
								combo.gE)));
					var align = A2(
						$elm$core$Maybe$withDefault,
						$author$project$Typesystem$Algebra$PadEmpty,
						A2($elm$core$Dict$get, node, ctx.aB.dJ));
					var build = F3(
						function (classes, cores, s) {
							if (!classes.b) {
								return _Utils_Tuple2(
									prim(cores),
									s);
							} else {
								var c = classes.a;
								var rest = classes.b;
								var _v4 = A3(
									$elm$core$List$foldl,
									F2(
										function (_v5, _v6) {
											var i = _v5.a;
											var acc = _v6.a;
											var cs = _v6.b;
											var s0 = _v6.c;
											var _v7 = $author$project$Typesystem$Infer$State$freshBinder(s0);
											var binder = _v7.a;
											var s1 = _v7.b;
											return _Utils_Tuple3(
												_Utils_ap(
													acc,
													_List_fromArray(
														[
															_Utils_Tuple2(
															binder,
															A2(
																$elm$core$Maybe$withDefault,
																$author$project$Typesystem$Core$CLit($author$project$Typesystem$Value$VEmpty),
																A2($elm$core$Dict$get, i, cs)))
														])),
												A3(
													$elm$core$Dict$insert,
													i,
													$author$project$Typesystem$Core$CVar(binder),
													cs),
												s1);
										}),
									_Utils_Tuple3(_List_Nil, cores, s),
									c.aD);
								var bound = _v4.a;
								var cores2 = _v4.b;
								var s2 = _v4.c;
								var _v8 = A3(build, rest, cores2, s2);
								var inner = _v8.a;
								var s3 = _v8.b;
								return _Utils_Tuple2(
									$author$project$Typesystem$Core$CLift(
										{
											dG: align,
											h1: inner,
											iU: $author$project$Typesystem$Infer$Classify$frameTag(c.jp),
											ha: bound
										}),
									s3);
							}
						});
					var _v9 = A3(build, combo.fn, sources, st);
					var lifted = _v9.a;
					var s4 = _v9.b;
					return _Utils_Tuple3(
						{
							bg: A2(
								$elm$core$List$map,
								function ($) {
									return $.fa;
								},
								combo.fn),
							dy: combo.dy
						},
						lifted,
						s4);
			}
		}();
		var result = _v0.a;
		var core = _v0.b;
		var st2 = _v0.c;
		var _v11 = A2(
			$author$project$Typesystem$Infer$Elaborate$distinctAxes,
			ctx,
			_Utils_Tuple2(result.dy, st2));
		var type_ = _v11.a;
		var st3 = _v11.b;
		var liftedAxes = A2(
			$elm$core$List$map,
			function ($) {
				return $.fa;
			},
			A2(
				$elm$core$List$take,
				$elm$core$List$length(result.bg),
				$author$project$Typesystem$Types$peelLiftable(
					A2($author$project$Typesystem$Infer$State$applied, st3, type_)).a));
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(
				_Utils_Tuple2(type_, core)),
			A3(
				$author$project$Typesystem$Infer$State$annotate,
				node,
				{
					h0: _List_Nil,
					i$: 0,
					bg: liftedAxes,
					dy: A2($author$project$Typesystem$Infer$State$applied, st3, type_)
				},
				st3));
	});
var $author$project$Typesystem$Infer$Elaborate$elaborateLifts = F7(
	function (ctx, node, sig, valueArgs, slotCores, alt, st) {
		elaborateLifts:
		while (true) {
			if (alt.$ === 1) {
				var overload = alt.a;
				var pairs = alt.b;
				var combo = alt.c;
				var $temp$ctx = ctx,
					$temp$node = node,
					$temp$sig = overload,
					$temp$valueArgs = pairs,
					$temp$slotCores = slotCores,
					$temp$alt = $author$project$Typesystem$Infer$Classify$ViaLift(combo),
					$temp$st = st;
				ctx = $temp$ctx;
				node = $temp$node;
				sig = $temp$sig;
				valueArgs = $temp$valueArgs;
				slotCores = $temp$slotCores;
				alt = $temp$alt;
				st = $temp$st;
				continue elaborateLifts;
			} else {
				return A7($author$project$Typesystem$Infer$Elaborate$elaborateOwn, ctx, node, sig, valueArgs, slotCores, alt, st);
			}
		}
	});
var $author$project$Typesystem$Infer$Elaborate$elaborate = F9(
	function (synth, ctx, node, sig, valueArgs, slots, alt, subst, st0) {
		var _v0 = A5(
			$author$project$Typesystem$Infer$Elaborate$checkSlotsJoined,
			synth,
			ctx,
			slots,
			1,
			_Utils_update(
				st0,
				{bl: subst}));
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			var failed = _v0.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, failed);
		} else {
			var slotCores = _v0.a.a;
			var st = _v0.b;
			return A7($author$project$Typesystem$Infer$Elaborate$elaborateLifts, ctx, node, sig, valueArgs, slotCores, alt, st);
		}
	});
var $author$project$Typesystem$Infer$Classify$ViaFlatten = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Lift$stripCells = function (t) {
	if (t.$ === 8) {
		var kind = t.a;
		var axis = t.b;
		var inner = t.c;
		return A3(
			$author$project$Typesystem$Types$TFrame,
			kind,
			axis,
			$author$project$Typesystem$Lift$stripCells(
				$author$project$Typesystem$Types$stripEmpty(inner)));
	} else {
		return t;
	}
};
var $author$project$Typesystem$Lift$fitCells = F4(
	function (subst, residual, paramType, reductionParam) {
		var _v0 = A3($author$project$Typesystem$Unify$unify, paramType, residual, subst);
		if (!_v0.$) {
			var s = _v0.a;
			return $elm$core$Maybe$Just(s);
		} else {
			return reductionParam ? $elm$core$Result$toMaybe(
				A3(
					$author$project$Typesystem$Unify$unify,
					paramType,
					$author$project$Typesystem$Lift$stripCells(residual),
					subst)) : $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Lift$fit = F4(
	function (subst, residual, paramType, reductionParam) {
		return _Utils_eq(residual, $author$project$Typesystem$Types$TEmpty) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(true, subst)) : (($author$project$Typesystem$Types$isNullable(residual) && (!$author$project$Typesystem$Types$isNullable(
			A2($author$project$Typesystem$Unify$apply, subst, paramType)))) ? A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$pair(true),
			A4(
				$author$project$Typesystem$Lift$fitCells,
				subst,
				$author$project$Typesystem$Types$stripEmpty(residual),
				paramType,
				reductionParam)) : A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$pair(false),
			A4($author$project$Typesystem$Lift$fitCells, subst, residual, paramType, reductionParam)));
	});
var $author$project$Typesystem$Types$nullable = function (t) {
	return $author$project$Typesystem$Types$union(
		_List_fromArray(
			[t, $author$project$Typesystem$Types$TEmpty]));
};
var $author$project$Typesystem$Types$swapLevels = F3(
	function (at, levels, cell) {
		var _v0 = A2($elm$core$List$drop, at, levels);
		if (_v0.b && _v0.b.b) {
			var x = _v0.a;
			var _v1 = _v0.b;
			var y = _v1.a;
			var below = _v1.b;
			var _v2 = function () {
				if (below.b) {
					var next = below.a;
					var rest = below.b;
					return _Utils_Tuple2(
						A2(
							$elm$core$List$cons,
							_Utils_update(
								next,
								{aW: true}),
							rest),
						cell);
				} else {
					return _Utils_Tuple2(
						_List_Nil,
						$author$project$Typesystem$Types$nullable(cell));
				}
			}();
			var below2 = _v2.a;
			var cell2 = _v2.b;
			return _Utils_Tuple2(
				_Utils_ap(
					A2($elm$core$List$take, at, levels),
					A2(
						$elm$core$List$cons,
						_Utils_update(
							y,
							{aW: x.aW}),
						A2(
							$elm$core$List$cons,
							_Utils_update(
								x,
								{aW: false}),
							below2))),
				cell2);
		} else {
			return _Utils_Tuple2(levels, cell);
		}
	});
var $author$project$Typesystem$Types$pivotLevel = F4(
	function (above, relative, levels, cell) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (k, _v0) {
					var ls = _v0.a;
					var c = _v0.b;
					return A3($author$project$Typesystem$Types$swapLevels, above + k, ls, c);
				}),
			_Utils_Tuple2(levels, cell),
			$elm$core$List$reverse(
				A2($elm$core$List$range, 0, relative - 1)));
	});
var $author$project$Typesystem$Lift$pivotAll = F3(
	function (order, levels, cell) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, _v1) {
					var i = _v0.a;
					var relative = _v0.b;
					var ls = _v1.a;
					var c = _v1.b;
					return A4($author$project$Typesystem$Types$pivotLevel, i, relative, ls, c);
				}),
			_Utils_Tuple2(levels, cell),
			A2(
				$elm$core$List$indexedMap,
				$elm$core$Tuple$pair,
				$author$project$Typesystem$Lift$relativeDepths(order)));
	});
var $author$project$Typesystem$Types$wrapLevels = F2(
	function (levels, cell) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (l, acc) {
					return l.aW ? $author$project$Typesystem$Types$nullable(
						A3($author$project$Typesystem$Types$TFrame, l.jp, l.fa, acc)) : A3($author$project$Typesystem$Types$TFrame, l.jp, l.fa, acc);
				}),
			cell,
			levels);
	});
var $author$project$Typesystem$Lift$fitOrder = F5(
	function (subst, argType, paramType, reductionParam, order) {
		var _v0 = $author$project$Typesystem$Types$peelLiftable(
			A2($author$project$Typesystem$Unify$apply, subst, argType));
		var levels = _v0.a;
		var cell = _v0.b;
		var _v1 = A3($author$project$Typesystem$Lift$pivotAll, order, levels, cell);
		var pivoted = _v1.a;
		var cell2 = _v1.b;
		var _v2 = _Utils_Tuple2(
			A2(
				$elm$core$List$take,
				$elm$core$List$length(order),
				pivoted),
			A2(
				$elm$core$List$drop,
				$elm$core$List$length(order),
				pivoted));
		var lifted = _v2.a;
		var kept = _v2.b;
		return A2(
			$elm$core$Maybe$map,
			function (_v3) {
				var nullableArg = _v3.a;
				var s = _v3.b;
				return {
					iV: A2(
						$elm$core$List$map,
						$elm$core$Tuple$second,
						A2(
							$elm$core$List$sortBy,
							$elm$core$Tuple$first,
							A3($elm$core$List$map2, $elm$core$Tuple$pair, order, lifted))),
					bg: $elm$core$List$sort(order),
					jP: nullableArg,
					j_: order,
					bl: s
				};
			},
			A4(
				$author$project$Typesystem$Lift$fit,
				subst,
				A2($author$project$Typesystem$Types$wrapLevels, kept, cell2),
				paramType,
				reductionParam));
	});
var $author$project$Typesystem$Lift$subsets = F2(
	function (k, items) {
		if (!k) {
			return _List_fromArray(
				[_List_Nil]);
		} else {
			if (!items.b) {
				return _List_Nil;
			} else {
				var x = items.a;
				var rest = items.b;
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						$elm$core$List$cons(x),
						A2($author$project$Typesystem$Lift$subsets, k - 1, rest)),
					A2($author$project$Typesystem$Lift$subsets, k, rest));
			}
		}
	});
var $author$project$Typesystem$Lift$optionsAt = F5(
	function (k, subst, argType, paramType, reductionParam) {
		var depth = $elm$core$List$length(
			$author$project$Typesystem$Types$peelLiftable(
				A2($author$project$Typesystem$Unify$apply, subst, argType)).a);
		return A2(
			$elm$core$List$filterMap,
			function (depths) {
				return A5($author$project$Typesystem$Lift$fitOrder, subst, argType, paramType, reductionParam, depths);
			},
			A2(
				$author$project$Typesystem$Lift$subsets,
				k,
				A2($elm$core$List$range, 0, depth - 1)));
	});
var $author$project$Typesystem$Signature$result = function (sig) {
	return sig.g1.h1.cu;
};
var $author$project$Typesystem$Infer$Classify$resultCell = F2(
	function (sig, absorbs) {
		return absorbs ? $author$project$Typesystem$Types$nullable(
			$author$project$Typesystem$Signature$result(sig)) : $author$project$Typesystem$Signature$result(sig);
	});
var $author$project$Typesystem$Infer$Elaborate$flattenOption = F4(
	function (node, sig, valueArgs, st) {
		var _v0 = _Utils_Tuple2(sig.jp, valueArgs);
		if (((_v0.a.$ === 1) && _v0.b.b) && (!_v0.b.b.b)) {
			var _v1 = _v0.b;
			var _v2 = _v1.a;
			var param = _v2.a;
			var a = _v2.b;
			var _v3 = $author$project$Typesystem$Types$peelLiftable(
				A2($author$project$Typesystem$Infer$State$applied, st, a.dy));
			var frames = _v3.a;
			var cell = _v3.b;
			var tags = A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.jp;
					},
					$author$project$Typesystem$Infer$Classify$frameTag),
				frames);
			var repeats = function (tag) {
				return $elm$core$List$length(
					A2(
						$elm$core$List$filter,
						$elm$core$Basics$eq(tag),
						tags)) >= 2;
			};
			if (repeats(0) || repeats(1)) {
				var _v4 = A3($author$project$Typesystem$Infer$State$freshAxis, node, 'flatten', st);
				var axis = _v4.a;
				var st2 = _v4.b;
				var _v5 = A5(
					$author$project$Typesystem$Lift$optionsAt,
					0,
					st.bl,
					A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, axis, cell),
					param.dy,
					true);
				if (_v5.b) {
					var option = _v5.a;
					return _Utils_Tuple2(
						_List_fromArray(
							[
								$author$project$Typesystem$Infer$Classify$ViaFlatten(
								{
									fx: $elm$core$List$length(frames),
									bl: option.bl,
									dy: A2($author$project$Typesystem$Infer$Classify$resultCell, sig, option.jP)
								})
							]),
						st2);
				} else {
					return _Utils_Tuple2(_List_Nil, st2);
				}
			} else {
				return _Utils_Tuple2(_List_Nil, st);
			}
		} else {
			return _Utils_Tuple2(_List_Nil, st);
		}
	});
var $author$project$Typesystem$Infer$Elaborate$offeredKey = F2(
	function (st, alt) {
		return A2(
			$elm$core$Maybe$map,
			$author$project$Typesystem$Choice$key,
			$elm$core$Result$toMaybe(
				A2(
					$author$project$Typesystem$Types$ground,
					st.aa,
					$author$project$Typesystem$Infer$Classify$alternativeType(alt))));
	});
var $author$project$Typesystem$Types$toString = $author$project$Typesystem$Types$toStringBy($elm$core$String$fromInt);
var $author$project$Typesystem$Infer$Elaborate$choose = F9(
	function (synth, ctx, node, sig, valueArgs, slots, combos, overloaded, st) {
		var key = function (combo) {
			return $author$project$Typesystem$Types$toString(
				A2($author$project$Typesystem$Unify$apply, combo.bl, combo.dy));
		};
		var distinct = A2(
			$elm$core$List$sortBy,
			key,
			A3(
				$elm$core$List$foldl,
				F2(
					function (c, acc) {
						return A2(
							$elm$core$List$any,
							function (d) {
								return _Utils_eq(
									key(d),
									key(c));
							},
							acc) ? acc : _Utils_ap(
							acc,
							_List_fromArray(
								[c]));
					}),
				_List_Nil,
				combos));
		var alternativeKey = function (alt) {
			return $author$project$Typesystem$Types$toString(
				$author$project$Typesystem$Infer$Classify$alternativeType(alt));
		};
		var overloads = A2(
			$elm$core$List$sortBy,
			alternativeKey,
			A3(
				$elm$core$List$foldl,
				F2(
					function (c, acc) {
						return A2(
							$elm$core$List$any,
							function (d) {
								return _Utils_eq(
									alternativeKey(d),
									alternativeKey(c));
							},
							acc) ? acc : _Utils_ap(
							acc,
							_List_fromArray(
								[c]));
					}),
				_List_Nil,
				overloaded));
		var _v0 = _Utils_Tuple2(distinct, overloads);
		_v0$2:
		while (true) {
			if (_v0.a.b) {
				if ((!_v0.a.b.b) && (!_v0.b.b)) {
					var _v1 = _v0.a;
					var combo = _v1.a;
					return A9(
						$author$project$Typesystem$Infer$Elaborate$elaborate,
						synth,
						ctx,
						node,
						sig,
						valueArgs,
						slots,
						$author$project$Typesystem$Infer$Classify$ViaLift(combo),
						combo.bl,
						st);
				} else {
					break _v0$2;
				}
			} else {
				if (_v0.b.b && (!_v0.b.b.b)) {
					var _v2 = _v0.b;
					var alt = _v2.a;
					return A9(
						$author$project$Typesystem$Infer$Elaborate$elaborate,
						synth,
						ctx,
						node,
						sig,
						valueArgs,
						slots,
						alt,
						$author$project$Typesystem$Infer$Classify$alternativeSubst(alt),
						st);
				} else {
					break _v0$2;
				}
			}
		}
		var _v3 = A4($author$project$Typesystem$Infer$Elaborate$flattenOption, node, sig, valueArgs, st);
		var flatten = _v3.a;
		var st2 = _v3.b;
		var alternatives = _Utils_ap(
			A2($elm$core$List$map, $author$project$Typesystem$Infer$Classify$ViaLift, distinct),
			_Utils_ap(flatten, overloads));
		var matching = A2(
			$elm$core$Maybe$map,
			function (ground) {
				return A2(
					$elm$core$List$filter,
					function (alt) {
						return _Utils_eq(
							A2($author$project$Typesystem$Infer$Elaborate$offeredKey, st2, alt),
							$elm$core$Maybe$Just(
								$author$project$Typesystem$Choice$key(ground)));
					},
					alternatives);
			},
			A2($elm$core$Dict$get, node, ctx.aB.U));
		var _v4 = _Utils_Tuple2(matching, alternatives);
		_v4$0:
		while (true) {
			if (_v4.b.b) {
				if ((!_v4.a.$) && _v4.a.a.b) {
					break _v4$0;
				} else {
					var _v6 = _v4.b;
					var first = _v6.a;
					return A9(
						$author$project$Typesystem$Infer$Elaborate$elaborate,
						synth,
						ctx,
						node,
						sig,
						valueArgs,
						slots,
						first,
						$author$project$Typesystem$Infer$Classify$alternativeSubst(first),
						_Utils_update(
							st2,
							{
								U: _Utils_ap(
									st2.U,
									_List_fromArray(
										[
											{
											jE: A2(
												$elm$core$List$map,
												A2(
													$elm$core$Basics$composeR,
													$author$project$Typesystem$Infer$Classify$alternativeType,
													A2(
														$elm$core$Basics$composeR,
														$author$project$Typesystem$Types$ground(st2.aa),
														$elm$core$Result$toMaybe)),
												alternatives),
											jG: node,
											jZ: A2($elm$core$List$map, $author$project$Typesystem$Infer$Classify$alternativeType, alternatives)
										}
										])),
								eN: _Utils_eq(matching, $elm$core$Maybe$Nothing) ? st2.eN : _Utils_ap(
									st2.eN,
									_List_fromArray(
										[node]))
							}));
				}
			} else {
				if ((!_v4.a.$) && _v4.a.a.b) {
					break _v4$0;
				} else {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
				}
			}
		}
		var _v5 = _v4.a.a;
		var alt = _v5.a;
		return A9(
			$author$project$Typesystem$Infer$Elaborate$elaborate,
			synth,
			ctx,
			node,
			sig,
			valueArgs,
			slots,
			alt,
			$author$project$Typesystem$Infer$Classify$alternativeSubst(alt),
			st2);
	});
var $author$project$Typesystem$Infer$State$countSolve = F2(
	function (options, st) {
		var stats = st.kC;
		return _Utils_update(
			st,
			{
				b6: A2($author$project$Typesystem$Budget$spend, options, st.b6),
				kC: _Utils_update(
					stats,
					{c4: stats.c4 + options, $7: stats.$7 + 1})
			});
	});
var $author$project$Typesystem$Infer$Classify$ViaOverload = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Typesystem$Signature$overloads = function (sig) {
	return (sig.c_ === 'concat') ? _List_fromArray(
		['concatList']) : _List_Nil;
};
var $author$project$Typesystem$Infer$Classify$frameCount = F2(
	function (subst, t) {
		return $elm$core$List$length(
			$author$project$Typesystem$Types$peelLiftable(
				A2($author$project$Typesystem$Unify$apply, subst, t)).a);
	});
var $author$project$Typesystem$Infer$Classify$isReduction = function (kind) {
	if (kind.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Typesystem$Infer$Classify$optionsFor = F4(
	function (sig, param, a, subst) {
		return A2(
			$elm$core$List$concatMap,
			function (k) {
				return A5(
					$author$project$Typesystem$Lift$optionsAt,
					k,
					subst,
					a.dy,
					param.dy,
					$author$project$Typesystem$Infer$Classify$isReduction(sig.jp));
			},
			A2(
				$elm$core$List$range,
				0,
				A2($author$project$Typesystem$Infer$Classify$frameCount, subst, a.dy)));
	});
var $author$project$Typesystem$Infer$Classify$fitArgs = F3(
	function (sig, valueArgs, subst) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, _v1) {
					var param = _v0.a;
					var a = _v0.b;
					var partials = _v1.a;
					var mismatches = _v1.b;
					var generated = _v1.c;
					var _v2 = A2(
						$elm$core$List$concatMap,
						function (_v3) {
							var options = _v3.a;
							var s = _v3.b;
							return A2(
								$elm$core$List$map,
								function (o) {
									return _Utils_Tuple2(
										_Utils_ap(
											options,
											_List_fromArray(
												[o])),
										o.bl);
								},
								A4($author$project$Typesystem$Infer$Classify$optionsFor, sig, param, a, s));
						},
						partials);
					if (!_v2.b) {
						var s = A2(
							$elm$core$Maybe$withDefault,
							subst,
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$second,
								$elm$core$List$head(partials)));
						return _Utils_Tuple3(
							partials,
							_Utils_ap(
								mismatches,
								_List_fromArray(
									[
										_Utils_Tuple2(
										a.jG,
										A2(
											$author$project$Typesystem$Infer$State$mismatch,
											A2($author$project$Typesystem$Unify$apply, s, param.dy),
											A2($author$project$Typesystem$Unify$apply, s, a.dy)))
									])),
							generated);
					} else {
						var next = _v2;
						return _Utils_Tuple3(
							next,
							mismatches,
							generated + $elm$core$List$length(next));
					}
				}),
			_Utils_Tuple3(
				_List_fromArray(
					[
						_Utils_Tuple2(_List_Nil, subst)
					]),
				_List_Nil,
				0),
			valueArgs);
	});
var $author$project$Typesystem$Infer$Classify$absorbedArg = F3(
	function (sig, valueArgs, options) {
		return A2(
			$elm$core$List$any,
			function (_v0) {
				var _v1 = _v0.a;
				var param = _v1.a;
				var option = _v0.b;
				return option.jP && (!((sig.c_ === 'coalesce') && (param.c_ === 'x')));
			},
			A3($elm$core$List$map2, $elm$core$Tuple$pair, valueArgs, options));
	});
var $author$project$Typesystem$Infer$Classify$isObjectAxis = F2(
	function (env, axis) {
		if (!axis.$) {
			return A2(
				$elm$core$List$any,
				function (o) {
					var _v1 = $author$project$Typesystem$Types$open(o.dy);
					if (_v1.$ === 8) {
						var objectAxis = _v1.b;
						return _Utils_eq(objectAxis, axis);
					} else {
						return false;
					}
				},
				$elm$core$Dict$values(env.gz));
		} else {
			return false;
		}
	});
var $author$project$Typesystem$Infer$Classify$paddedClasses = function (env) {
	return $elm$core$List$indexedMap(
		F2(
			function (depth, c) {
				var _v0 = A2($elm$core$List$map, $elm$core$Tuple$second, c.aD);
				if (_v0.b && _v0.b.b) {
					var first = _v0.a;
					var rest = _v0.b;
					return !((!depth) && (A2($author$project$Typesystem$Infer$Classify$isObjectAxis, env, first) && A2(
						$elm$core$List$all,
						$elm$core$Basics$eq(first),
						rest)));
				} else {
					return false;
				}
			}));
};
var $author$project$Typesystem$Infer$Classify$paddedIndexes = function (padded) {
	return A2(
		$elm$core$List$map,
		$elm$core$Tuple$first,
		A2(
			$elm$core$List$filter,
			$elm$core$Tuple$second,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, padded)));
};
var $author$project$Typesystem$Infer$Classify$padsWithEmpty = function (alignment) {
	switch (alignment.$) {
		case 0:
			return true;
		case 1:
			return false;
		default:
			var v = alignment.a;
			return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty);
	}
};
var $author$project$Typesystem$Infer$Classify$nullableClasses = F3(
	function (env, alignment, classes) {
		var padded = $author$project$Typesystem$Infer$Classify$padsWithEmpty(alignment) ? A2($author$project$Typesystem$Infer$Classify$paddedClasses, env, classes) : A2(
			$elm$core$List$map,
			$elm$core$Basics$always(false),
			classes);
		var nextClass = F2(
			function (i, j) {
				return A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$first,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (_v2) {
								var k = _v2.a;
								var c = _v2.b;
								return (_Utils_cmp(k, j) > 0) && A2(
									$elm$core$List$any,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Tuple$first,
										$elm$core$Basics$eq(i)),
									c.aD);
							},
							A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, classes))));
			});
		var reached = A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var j = _v0.a;
				var c = _v0.b;
				return A2(
					$elm$core$List$member,
					j,
					$author$project$Typesystem$Infer$Classify$paddedIndexes(padded)) ? A2(
					$elm$core$List$map,
					function (_v1) {
						var i = _v1.a;
						return A2(nextClass, i, j);
					},
					c.aD) : _List_Nil;
			},
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, classes));
		return _Utils_Tuple2(
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (k, c) {
						return c.aW || A2(
							$elm$core$List$member,
							$elm$core$Maybe$Just(k),
							reached);
					}),
				classes),
			A2($elm$core$List$member, $elm$core$Maybe$Nothing, reached));
	});
var $author$project$Typesystem$Infer$Classify$nullableMember = F3(
	function (sig, valueArgs, subst) {
		return A2(
			$elm$core$List$member,
			sig.c_,
			_List_fromArray(
				['contains', 'hasKey'])) && A2(
			$elm$core$List$any,
			function (_v0) {
				var param = _v0.a;
				var a = _v0.b;
				return A2(
					$elm$core$List$member,
					param.c_,
					_List_fromArray(
						['x', 'key'])) && $author$project$Typesystem$Types$isNullable(
					$author$project$Typesystem$Types$peelLiftable(
						A2($author$project$Typesystem$Unify$apply, subst, a.dy)).b);
			},
			valueArgs);
	});
var $author$project$Typesystem$Env$builtinDecls = function () {
	var diagnosticList = A3(
		$author$project$Typesystem$Types$TFrame,
		$author$project$Typesystem$Types$ListF,
		$author$project$Typesystem$Types$Axis('graphDiagnostic/cause'),
		A2($author$project$Typesystem$Types$TNamed, 'graphDiagnostic', _List_Nil));
	return _List_fromArray(
		[
			{
			h1: $author$project$Typesystem$Types$DeclVariants(
				_List_fromArray(
					[
						{
						eC: $elm$core$Maybe$Just(
							$author$project$Typesystem$Types$TRecord(
								$elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'value',
											$author$project$Typesystem$Types$TVar(0))
										])))),
						kL: 'fresh'
					},
						{
						eC: $elm$core$Maybe$Just(
							$author$project$Typesystem$Types$TRecord(
								$elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'diagnostics',
											A3(
												$author$project$Typesystem$Types$TFrame,
												$author$project$Typesystem$Types$ListF,
												$author$project$Typesystem$Types$Axis('outcome/diagnostics'),
												A2($author$project$Typesystem$Types$TNamed, 'graphDiagnostic', _List_Nil))),
											_Utils_Tuple2(
											'lastGood',
											$author$project$Typesystem$Types$union(
												_List_fromArray(
													[
														$author$project$Typesystem$Types$TVar(0),
														$author$project$Typesystem$Types$TEmpty
													])))
										])))),
						kL: 'failed'
					}
					])),
			c_: 'outcome',
			gK: _List_fromArray(
				[0]),
			dD: 1
		},
			{
			h1: $author$project$Typesystem$Types$DeclRecord(
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('kind', $author$project$Typesystem$Types$TText),
							_Utils_Tuple2('object', $author$project$Typesystem$Types$TText),
							_Utils_Tuple2(
							'source',
							$author$project$Typesystem$Types$union(
								_List_fromArray(
									[$author$project$Typesystem$Types$TText, $author$project$Typesystem$Types$TEmpty]))),
							_Utils_Tuple2('message', $author$project$Typesystem$Types$TText),
							_Utils_Tuple2('cause', diagnosticList)
						]))),
			c_: 'graphDiagnostic',
			gK: _List_Nil,
			dD: 1
		}
		]);
}();
var $author$project$Typesystem$Signature$Elementwise = {$: 0};
var $author$project$Typesystem$Algebra$Monoid = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Signature$Param = F2(
	function (id, type_) {
		return {c_: id, dy: type_};
	});
var $author$project$Typesystem$Signature$Reduction = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Algebra$Semigroup = {$: 1};
var $author$project$Typesystem$Signature$Structural = {$: 2};
var $author$project$Typesystem$Signature$quantify = F2(
	function (ps, res) {
		var types = _Utils_ap(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.dy;
				},
				ps),
			_List_fromArray(
				[res]));
		var order = function (pick) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (t, acc) {
						return A3(
							$elm$core$List$foldl,
							F2(
								function (v, a) {
									return A2($elm$core$List$member, v, a) ? a : _Utils_ap(
										a,
										_List_fromArray(
											[v]));
								}),
							acc,
							pick(t));
					}),
				_List_Nil,
				types);
		};
		var index = function (vars) {
			return $elm$core$Dict$fromList(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, v) {
							return _Utils_Tuple2(v, i);
						}),
					vars));
		};
		var typeIndex = index(
			order($author$project$Typesystem$Types$typeVars));
		var axisIndex = index(
			order($author$project$Typesystem$Types$axisVars));
		var rename = $author$project$Typesystem$Types$mapVars(
			{
				hV: function (v) {
					return $author$project$Typesystem$Types$AxisVar(
						A2(
							$elm$core$Maybe$withDefault,
							v,
							A2($elm$core$Dict$get, v, axisIndex)));
				},
				k6: function (v) {
					return $author$project$Typesystem$Types$TVar(
						A2(
							$elm$core$Maybe$withDefault,
							v,
							A2($elm$core$Dict$get, v, typeIndex)));
				}
			});
		return {
			fb: A2(
				$elm$core$List$range,
				0,
				$elm$core$Dict$size(axisIndex) - 1),
			h1: {
				gK: A2(
					$elm$core$List$map,
					function (p) {
						return _Utils_update(
							p,
							{
								dy: rename(p.dy)
							});
					},
					ps),
				cu: rename(res)
			},
			eV: A2(
				$elm$core$List$range,
				0,
				$elm$core$Dict$size(typeIndex) - 1)
		};
	});
var $author$project$Typesystem$Signature$mk = F5(
	function (id, ps, res, kind, lowering) {
		return {
			c_: id,
			jp: kind,
			f6: $elm$core$Maybe$Just(lowering),
			g1: A2($author$project$Typesystem$Signature$quantify, ps, res),
			dD: 1
		};
	});
var $author$project$Typesystem$Signature$binary = F4(
	function (operand, res, id, op) {
		return A5(
			$author$project$Typesystem$Signature$mk,
			id,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Signature$Param, 'left', operand),
					A2($author$project$Typesystem$Signature$Param, 'right', operand)
				]),
			res,
			$author$project$Typesystem$Signature$Elementwise,
			'({left} ' + (op + ' {right})'));
	});
var $author$project$Typesystem$Signature$arith = A2($author$project$Typesystem$Signature$binary, $author$project$Typesystem$Types$TNumber, $author$project$Typesystem$Types$TNumber);
var $author$project$Typesystem$Signature$t0 = $author$project$Typesystem$Types$TVar(0);
var $author$project$Typesystem$Signature$compareSig = A2($author$project$Typesystem$Signature$binary, $author$project$Typesystem$Signature$t0, $author$project$Typesystem$Types$TBool);
var $author$project$Typesystem$Signature$dictOf = function (k) {
	return A2(
		$author$project$Typesystem$Types$TFrame,
		$author$project$Typesystem$Types$DictF(k),
		$author$project$Typesystem$Types$AxisVar(0));
};
var $author$project$Typesystem$Signature$fn = F2(
	function (ps, res) {
		return A2(
			$author$project$Typesystem$Types$TFn,
			$elm$core$Dict$fromList(ps),
			res);
	});
var $author$project$Typesystem$Signature$listOf = A2(
	$author$project$Typesystem$Types$TFrame,
	$author$project$Typesystem$Types$ListF,
	$author$project$Typesystem$Types$AxisVar(0));
var $author$project$Typesystem$Signature$logic = F2(
	function (id, op) {
		return A5(
			$author$project$Typesystem$Signature$mk,
			id,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Signature$Param, 'left', $author$project$Typesystem$Types$TBool),
					A2($author$project$Typesystem$Signature$Param, 'right', $author$project$Typesystem$Types$TBool)
				]),
			$author$project$Typesystem$Types$TBool,
			$author$project$Typesystem$Signature$Elementwise,
			'CASE WHEN {left} IS NULL OR {right} IS NULL THEN NULL ELSE ({left} ' + (op + ' {right}) END'));
	});
var $author$project$Typesystem$Signature$scalar = $author$project$Typesystem$Types$union(
	_List_fromArray(
		[$author$project$Typesystem$Types$TNumber, $author$project$Typesystem$Types$TText, $author$project$Typesystem$Types$TBool, $author$project$Typesystem$Types$TDate]));
var $author$project$Typesystem$Signature$narrowing = F3(
	function (id, target, tag) {
		return A5(
			$author$project$Typesystem$Signature$mk,
			id,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Signature$scalar)
				]),
			$author$project$Typesystem$Types$nullable(target),
			$author$project$Typesystem$Signature$Elementwise,
			'union_extract({value}, \'' + (tag + '\')'));
	});
var $author$project$Typesystem$Signature$otherListOf = A2(
	$author$project$Typesystem$Types$TFrame,
	$author$project$Typesystem$Types$ListF,
	$author$project$Typesystem$Types$AxisVar(1));
var $author$project$Typesystem$Signature$t1 = $author$project$Typesystem$Types$TVar(1);
var $author$project$Typesystem$Signature$builtins = _List_fromArray(
	[
		A2($author$project$Typesystem$Signature$arith, 'add', '+'),
		A2($author$project$Typesystem$Signature$arith, 'sub', '-'),
		A2($author$project$Typesystem$Signature$arith, 'mul', '*'),
		A2($author$project$Typesystem$Signature$arith, 'div', '/'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'mod',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'left', $author$project$Typesystem$Types$TNumber),
				A2($author$project$Typesystem$Signature$Param, 'right', $author$project$Typesystem$Types$TNumber)
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Elementwise,
		'({left} % {right})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'pow',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'left', $author$project$Typesystem$Types$TNumber),
				A2($author$project$Typesystem$Signature$Param, 'right', $author$project$Typesystem$Types$TNumber)
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Elementwise,
		'pow({left}, {right})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'neg',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Types$TNumber)
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Elementwise,
		'(-{value})'),
		A2($author$project$Typesystem$Signature$compareSig, 'eq', '='),
		A2($author$project$Typesystem$Signature$compareSig, 'neq', '<>'),
		A2($author$project$Typesystem$Signature$compareSig, 'lt', '<'),
		A2($author$project$Typesystem$Signature$compareSig, 'lte', '<='),
		A2($author$project$Typesystem$Signature$compareSig, 'gt', '>'),
		A2($author$project$Typesystem$Signature$compareSig, 'gte', '>='),
		A2($author$project$Typesystem$Signature$logic, 'and', 'AND'),
		A2($author$project$Typesystem$Signature$logic, 'or', 'OR'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'not',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Types$TBool)
			]),
		$author$project$Typesystem$Types$TBool,
		$author$project$Typesystem$Signature$Elementwise,
		'(NOT {value})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'concat',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'left', $author$project$Typesystem$Types$TText),
				A2($author$project$Typesystem$Signature$Param, 'right', $author$project$Typesystem$Types$TText)
			]),
		$author$project$Typesystem$Types$TText,
		$author$project$Typesystem$Signature$Elementwise,
		'({left} || {right})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'concatList',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'left',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2(
				$author$project$Typesystem$Signature$Param,
				'right',
				A3(
					$author$project$Typesystem$Types$TFrame,
					$author$project$Typesystem$Types$ListF,
					$author$project$Typesystem$Types$AxisVar(1),
					$author$project$Typesystem$Signature$t0))
			]),
		A3(
			$author$project$Typesystem$Types$TFrame,
			$author$project$Typesystem$Types$ListF,
			$author$project$Typesystem$Types$AxisVar(2),
			$author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'CASE WHEN {left} IS NULL OR {right} IS NULL THEN NULL ELSE list_concat({left}, {right}) END'),
		A3($author$project$Typesystem$Signature$narrowing, 'asNumber', $author$project$Typesystem$Types$TNumber, 'number'),
		A3($author$project$Typesystem$Signature$narrowing, 'asText', $author$project$Typesystem$Types$TText, 'text'),
		A3($author$project$Typesystem$Signature$narrowing, 'asBool', $author$project$Typesystem$Types$TBool, 'bool'),
		A3($author$project$Typesystem$Signature$narrowing, 'asDate', $author$project$Typesystem$Types$TDate, 'date'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'coalesce',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'x',
				$author$project$Typesystem$Types$nullable($author$project$Typesystem$Signature$t0)),
				A2($author$project$Typesystem$Signature$Param, 'default', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Signature$t0,
		$author$project$Typesystem$Signature$Elementwise,
		'COALESCE({x}, {default})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'text',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Types$TText,
		$author$project$Typesystem$Signature$Elementwise,
		'CAST({value} AS VARCHAR)'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'templatePart',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Types$TText,
		$author$project$Typesystem$Signature$Structural,
		'COALESCE(template_part({value}), \'\')'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'count',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0))
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Reduction(
			$author$project$Typesystem$Algebra$Monoid(
				$author$project$Typesystem$Value$VNumber(0))),
		'CASE WHEN {list} IS NULL THEN NULL ELSE COALESCE(list_count({list}), 0) END'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'sum',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Types$TNumber))
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Reduction(
			$author$project$Typesystem$Algebra$Monoid(
				$author$project$Typesystem$Value$VNumber(0))),
		'CASE WHEN {list} IS NULL THEN NULL ELSE COALESCE(list_sum({list}), 0) END'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'min',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0))
			]),
		$author$project$Typesystem$Types$nullable($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Reduction($author$project$Typesystem$Algebra$Semigroup),
		'list_min({list})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'max',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0))
			]),
		$author$project$Typesystem$Types$nullable($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Reduction($author$project$Typesystem$Algebra$Semigroup),
		'list_max({list})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'length',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0))
			]),
		$author$project$Typesystem$Types$TNumber,
		$author$project$Typesystem$Signature$Structural,
		'len({list})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'first',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0))
			]),
		$author$project$Typesystem$Types$nullable($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'{list}[1]'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'filter',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2(
				$author$project$Typesystem$Signature$Param,
				'where',
				A2(
					$author$project$Typesystem$Signature$fn,
					_List_fromArray(
						[
							_Utils_Tuple2('entry', $author$project$Typesystem$Signature$t0)
						]),
					$author$project$Typesystem$Types$nullable($author$project$Typesystem$Types$TBool)))
			]),
		$author$project$Typesystem$Signature$otherListOf($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'list_filter({list}, {where})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'find',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2(
				$author$project$Typesystem$Signature$Param,
				'where',
				A2(
					$author$project$Typesystem$Signature$fn,
					_List_fromArray(
						[
							_Utils_Tuple2('entry', $author$project$Typesystem$Signature$t0)
						]),
					$author$project$Typesystem$Types$nullable($author$project$Typesystem$Types$TBool)))
			]),
		$author$project$Typesystem$Types$nullable($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'list_filter({list}, {where})[1]'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'contains',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2($author$project$Typesystem$Signature$Param, 'x', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Types$TBool,
		$author$project$Typesystem$Signature$Structural,
		'list_contains({list}, {x})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'hasKey',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'dict',
				A2($author$project$Typesystem$Signature$dictOf, $author$project$Typesystem$Signature$t0, $author$project$Typesystem$Signature$t1)),
				A2($author$project$Typesystem$Signature$Param, 'key', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Types$TBool,
		$author$project$Typesystem$Signature$Structural,
		'map_contains({dict}, {key})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'keys',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'dict',
				A2($author$project$Typesystem$Signature$dictOf, $author$project$Typesystem$Signature$t0, $author$project$Typesystem$Signature$t1))
			]),
		$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'list_transform(list_sort(map_entries({dict})), lambda e: e.key)'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'map',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2(
				$author$project$Typesystem$Signature$Param,
				'fn',
				A2(
					$author$project$Typesystem$Signature$fn,
					_List_fromArray(
						[
							_Utils_Tuple2('entry', $author$project$Typesystem$Signature$t0)
						]),
					$author$project$Typesystem$Signature$t1))
			]),
		$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t1),
		$author$project$Typesystem$Signature$Structural,
		'list_transform({list}, {fn})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'sortBy',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2(
				$author$project$Typesystem$Signature$Param,
				'key',
				A2(
					$author$project$Typesystem$Signature$fn,
					_List_fromArray(
						[
							_Utils_Tuple2('entry', $author$project$Typesystem$Signature$t0)
						]),
					$author$project$Typesystem$Signature$t1))
			]),
		$author$project$Typesystem$Signature$otherListOf($author$project$Typesystem$Signature$t0),
		$author$project$Typesystem$Signature$Structural,
		'list_sort_by({list}, {key})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'fold',
		_List_fromArray(
			[
				A2(
				$author$project$Typesystem$Signature$Param,
				'list',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t0)),
				A2($author$project$Typesystem$Signature$Param, 'initial', $author$project$Typesystem$Signature$t1),
				A2(
				$author$project$Typesystem$Signature$Param,
				'step',
				A2(
					$author$project$Typesystem$Signature$fn,
					_List_fromArray(
						[
							_Utils_Tuple2('acc', $author$project$Typesystem$Signature$t1),
							_Utils_Tuple2('entry', $author$project$Typesystem$Signature$t0)
						]),
					$author$project$Typesystem$Signature$t1))
			]),
		$author$project$Typesystem$Signature$t1,
		$author$project$Typesystem$Signature$Structural,
		'list_reduce({list}, {step}, {initial})'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'always',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Signature$t0)
			]),
		$author$project$Typesystem$Signature$t0,
		$author$project$Typesystem$Signature$Structural,
		'{value}'),
		A5(
		$author$project$Typesystem$Signature$mk,
		'group',
		_List_fromArray(
			[
				A2($author$project$Typesystem$Signature$Param, 'value', $author$project$Typesystem$Signature$t0),
				A2(
				$author$project$Typesystem$Signature$Param,
				'keys',
				$author$project$Typesystem$Signature$listOf($author$project$Typesystem$Signature$t1))
			]),
		$author$project$Typesystem$Signature$t0,
		$author$project$Typesystem$Signature$Structural,
		'GROUP BY {keys}')
	]);
var $author$project$Typesystem$Signature$displayNames = _List_fromArray(
	[
		_Utils_Tuple2('add', '+'),
		_Utils_Tuple2('sub', '-'),
		_Utils_Tuple2('mul', '*'),
		_Utils_Tuple2('div', '/'),
		_Utils_Tuple2('mod', '%'),
		_Utils_Tuple2('pow', '^'),
		_Utils_Tuple2('neg', '-'),
		_Utils_Tuple2('eq', '='),
		_Utils_Tuple2('neq', '!='),
		_Utils_Tuple2('lt', '<'),
		_Utils_Tuple2('lte', '<='),
		_Utils_Tuple2('gt', '>'),
		_Utils_Tuple2('gte', '>='),
		_Utils_Tuple2('and', 'and'),
		_Utils_Tuple2('or', 'or'),
		_Utils_Tuple2('not', 'not'),
		_Utils_Tuple2('concat', 'concat'),
		_Utils_Tuple2('concatList', 'concatList'),
		_Utils_Tuple2('asNumber', 'asNumber'),
		_Utils_Tuple2('asText', 'asText'),
		_Utils_Tuple2('asBool', 'asBool'),
		_Utils_Tuple2('asDate', 'asDate'),
		_Utils_Tuple2('coalesce', 'coalesce'),
		_Utils_Tuple2('text', 'text'),
		_Utils_Tuple2('templatePart', 'templatePart'),
		_Utils_Tuple2('count', 'count'),
		_Utils_Tuple2('sum', 'sum'),
		_Utils_Tuple2('min', 'min'),
		_Utils_Tuple2('max', 'max'),
		_Utils_Tuple2('length', 'length'),
		_Utils_Tuple2('first', 'first'),
		_Utils_Tuple2('find', 'find'),
		_Utils_Tuple2('contains', 'contains'),
		_Utils_Tuple2('hasKey', 'hasKey'),
		_Utils_Tuple2('keys', 'keys'),
		_Utils_Tuple2('filter', 'filter'),
		_Utils_Tuple2('map', 'map'),
		_Utils_Tuple2('sortBy', 'sortBy'),
		_Utils_Tuple2('fold', 'fold'),
		_Utils_Tuple2('always', 'always'),
		_Utils_Tuple2('group', 'group')
	]);
var $author$project$Typesystem$Signature$builtinNames = _Utils_ap(
	$author$project$Typesystem$Signature$displayNames,
	A2(
		$elm$core$List$concatMap,
		function (s) {
			return A2(
				$elm$core$List$map,
				function (p) {
					return _Utils_Tuple2(s.c_ + ('.' + p.c_), p.c_);
				},
				$author$project$Typesystem$Signature$params(s));
		},
		$author$project$Typesystem$Signature$builtins));
var $author$project$Typesystem$Env$empty = {
	dJ: $elm$core$Dict$empty,
	b6: $author$project$Typesystem$Budget$defaultBudget,
	dP: {fv: $elm$core$Dict$empty, ao: $elm$core$Dict$empty},
	U: $elm$core$Dict$empty,
	fv: $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (decl) {
				return _Utils_Tuple2(decl.c_, decl);
			},
			$author$project$Typesystem$Env$builtinDecls)),
	eh: _List_Nil,
	gs: $elm$core$Dict$fromList($author$project$Typesystem$Signature$builtinNames),
	gz: $elm$core$Dict$empty,
	ao: $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (sig) {
				return _Utils_Tuple2(sig.c_, sig);
			},
			$author$project$Typesystem$Signature$builtins))
};
var $author$project$Typesystem$Infer$Classify$unionOf = function (types) {
	if (!types.b) {
		return $author$project$Typesystem$Types$TEmpty;
	} else {
		var first = types.a;
		var rest = types.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (t, acc) {
					return _Utils_eq(t, acc) ? acc : $author$project$Typesystem$Types$union(
						_List_fromArray(
							[acc, t]));
				}),
			first,
			rest);
	}
};
var $author$project$Typesystem$Infer$Classify$paddingType = function (v) {
	switch (v.$) {
		case 0:
			return $author$project$Typesystem$Types$TNumber;
		case 1:
			return $author$project$Typesystem$Types$TText;
		case 2:
			return $author$project$Typesystem$Types$TBool;
		case 3:
			return $author$project$Typesystem$Types$TDate;
		case 8:
			return $author$project$Typesystem$Types$TEmpty;
		case 6:
			var items = v.a;
			return A3(
				$author$project$Typesystem$Types$TFrame,
				$author$project$Typesystem$Types$ListF,
				$author$project$Typesystem$Types$Axis('ax:unknown'),
				$author$project$Typesystem$Infer$Classify$unionOf(
					A2($elm$core$List$map, $author$project$Typesystem$Infer$Classify$paddingType, items)));
		case 7:
			var entries = v.a;
			return A3(
				$author$project$Typesystem$Types$TFrame,
				$author$project$Typesystem$Types$DictF(
					$author$project$Typesystem$Infer$Classify$unionOf(
						A2(
							$elm$core$List$map,
							A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $author$project$Typesystem$Infer$Classify$paddingType),
							entries))),
				$author$project$Typesystem$Types$Axis('ax:unknown'),
				$author$project$Typesystem$Infer$Classify$unionOf(
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Typesystem$Infer$Classify$paddingType),
						entries)));
		case 4:
			var fields = v.a;
			return $author$project$Typesystem$Types$TRecord(
				A2(
					$elm$core$Dict$map,
					function (_v1) {
						return $author$project$Typesystem$Infer$Classify$paddingType;
					},
					fields));
		default:
			return $author$project$Typesystem$Types$TEmpty;
	}
};
var $author$project$Typesystem$Infer$Classify$fitValue = F3(
	function (v, expected, subst) {
		var scalar = function (t) {
			return $elm$core$Result$toMaybe(
				A3($author$project$Typesystem$Unify$unify, expected, t, subst));
		};
		var all = F3(
			function (fit, items, s0) {
				return A3(
					$elm$core$List$foldl,
					function (item) {
						return $elm$core$Maybe$andThen(
							fit(item));
					},
					$elm$core$Maybe$Just(s0),
					items);
			});
		var _v0 = _Utils_Tuple2(
			v,
			A2($author$project$Typesystem$Unify$apply, subst, expected));
		_v0$0:
		while (true) {
			_v0$6:
			while (true) {
				_v0$7:
				while (true) {
					switch (_v0.a.$) {
						case 6:
							switch (_v0.b.$) {
								case 6:
									break _v0$0;
								case 8:
									if (!_v0.b.a.$) {
										var items = _v0.a.a;
										var _v1 = _v0.b;
										var _v2 = _v1.a;
										var inner = _v1.c;
										return A3(
											all,
											F2(
												function (item, s0) {
													return A3($author$project$Typesystem$Infer$Classify$fitValue, item, inner, s0);
												}),
											items,
											subst);
									} else {
										break _v0$6;
									}
								case 9:
									return $elm$core$Maybe$Just(subst);
								default:
									break _v0$6;
							}
						case 7:
							switch (_v0.b.$) {
								case 6:
									break _v0$0;
								case 8:
									if (_v0.b.a.$ === 1) {
										var entries = _v0.a.a;
										var _v3 = _v0.b;
										var key = _v3.a.a;
										var inner = _v3.c;
										return A3(
											all,
											F2(
												function (_v4, s0) {
													var k = _v4.a;
													var x = _v4.b;
													return A2(
														$elm$core$Maybe$andThen,
														A2($author$project$Typesystem$Infer$Classify$fitValue, x, inner),
														A3($author$project$Typesystem$Infer$Classify$fitValue, k, key, s0));
												}),
											entries,
											subst);
									} else {
										break _v0$7;
									}
								case 9:
									return $elm$core$Maybe$Just(subst);
								default:
									break _v0$7;
							}
						case 4:
							switch (_v0.b.$) {
								case 6:
									break _v0$0;
								case 4:
									var fields = _v0.a.a;
									var expectedFields = _v0.b.a;
									return _Utils_eq(
										$elm$core$Dict$keys(fields),
										$elm$core$Dict$keys(expectedFields)) ? A3(
										all,
										F2(
											function (_v5, s0) {
												var f = _v5.a;
												var x = _v5.b;
												return A2(
													$elm$core$Maybe$andThen,
													function (t) {
														return A3($author$project$Typesystem$Infer$Classify$fitValue, x, t, s0);
													},
													A2($elm$core$Dict$get, f, expectedFields));
											}),
										$elm$core$Dict$toList(fields),
										subst) : $elm$core$Maybe$Nothing;
								case 9:
									return $elm$core$Maybe$Just(subst);
								default:
									return $elm$core$Maybe$Nothing;
							}
						default:
							if (_v0.b.$ === 6) {
								break _v0$0;
							} else {
								return scalar(
									$author$project$Typesystem$Infer$Classify$paddingType(v));
							}
					}
				}
				return $elm$core$Maybe$Nothing;
			}
			return $elm$core$Maybe$Nothing;
		}
		var members = _v0.b.a;
		return $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				function (m) {
					return A3($author$project$Typesystem$Infer$Classify$fitValue, v, m, subst);
				},
				members));
	});
var $author$project$Typesystem$Infer$Classify$fitReplaced = F3(
	function (v, replaced, subst) {
		var mismatch = $author$project$Typesystem$Diagnostic$TypeMismatch(
			{
				e2: $author$project$Typesystem$Infer$Classify$paddingType(v),
				dV: A2($author$project$Typesystem$Unify$apply, subst, replaced)
			});
		var _v0 = A2(
			$author$project$Typesystem$Types$ground,
			$author$project$Typesystem$Types$emptyOrigins,
			A2($author$project$Typesystem$Unify$apply, subst, replaced));
		if (!_v0.$) {
			var ground = _v0.a;
			return A3($author$project$Typesystem$Conforms$value, $author$project$Typesystem$Env$empty, ground, v) ? $elm$core$Result$Ok(subst) : $elm$core$Result$Err(mismatch);
		} else {
			return A2(
				$elm$core$Result$fromMaybe,
				mismatch,
				A3($author$project$Typesystem$Infer$Classify$fitValue, v, replaced, subst));
		}
	});
var $author$project$Typesystem$Infer$Classify$replacedType = F6(
	function (options, valueArgs, classes, j, i, subst) {
		var _v0 = _Utils_Tuple2(
			$elm$core$List$head(
				A2($elm$core$List$drop, i, options)),
			$elm$core$List$head(
				A2($elm$core$List$drop, i, valueArgs)));
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var option = _v0.a.a;
			var _v1 = _v0.b.a;
			var a = _v1.b;
			var position = $elm$core$List$length(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.aD;
						},
						$elm$core$List$any(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								$elm$core$Basics$eq(i)))),
					A2($elm$core$List$take, j, classes)));
			var _v2 = $author$project$Typesystem$Types$peelLiftable(
				A2($author$project$Typesystem$Unify$apply, subst, a.dy));
			var levels = _v2.a;
			var cell = _v2.b;
			var _v3 = A3($author$project$Typesystem$Lift$pivotAll, option.j_, levels, cell);
			var reordered = _v3.a;
			var cell2 = _v3.b;
			return A2(
				$author$project$Typesystem$Types$wrapLevels,
				A2($elm$core$List$drop, position + 1, reordered),
				cell2);
		} else {
			return $author$project$Typesystem$Types$TEmpty;
		}
	});
var $author$project$Typesystem$Infer$Classify$paddingFits = F6(
	function (env, alignment, options, valueArgs, classes, subst) {
		if (alignment.$ === 2) {
			var v = alignment.a;
			if (_Utils_eq(v, $author$project$Typesystem$Value$VEmpty)) {
				return $elm$core$Result$Ok(subst);
			} else {
				var padded = A2($author$project$Typesystem$Infer$Classify$paddedClasses, env, classes);
				var fits = F2(
					function (_v3, s0) {
						var j = _v3.a;
						var c = _v3.b;
						return A3(
							$elm$core$List$foldl,
							function (_v2) {
								var i = _v2.a;
								return $elm$core$Result$andThen(
									A2(
										$author$project$Typesystem$Infer$Classify$fitReplaced,
										v,
										A6($author$project$Typesystem$Infer$Classify$replacedType, options, valueArgs, classes, j, i, s0)));
							},
							$elm$core$Result$Ok(s0),
							c.aD);
					});
				return A3(
					$elm$core$List$foldl,
					function (jc) {
						return $elm$core$Result$andThen(
							fits(jc));
					},
					$elm$core$Result$Ok(subst),
					A2(
						$elm$core$List$filter,
						function (_v1) {
							var j = _v1.a;
							return A2(
								$elm$core$List$member,
								j,
								$author$project$Typesystem$Infer$Classify$paddedIndexes(padded));
						},
						A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, classes)));
			}
		} else {
			return $elm$core$Result$Ok(subst);
		}
	});
var $author$project$Typesystem$Infer$Classify$frameMismatch = F3(
	function (s, expected, actual) {
		var _v0 = _Utils_Tuple2(expected, actual);
		if ((_v0.a.$ === 1) && (_v0.b.$ === 1)) {
			var expectedKey = _v0.a.a;
			var actualKey = _v0.b.a;
			return $author$project$Typesystem$Diagnostic$TypeMismatch(
				{
					e2: A2($author$project$Typesystem$Unify$apply, s, actualKey),
					dV: A2($author$project$Typesystem$Unify$apply, s, expectedKey)
				});
		} else {
			return $author$project$Typesystem$Diagnostic$MixedFrameKinds;
		}
	});
var $author$project$Typesystem$Infer$Classify$sameAxis = F4(
	function (s, dict, classAxis, levelAxis) {
		return A2(
			$elm$core$Result$mapError,
			function (_v0) {
				return $author$project$Typesystem$Diagnostic$MixedFrameKinds;
			},
			A2(
				$elm$core$Result$map,
				$elm$core$Tuple$pair(dict),
				A3(
					$author$project$Typesystem$Unify$unify,
					A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, classAxis, $author$project$Typesystem$Types$TBool),
					A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, levelAxis, $author$project$Typesystem$Types$TBool),
					s)));
	});
var $author$project$Typesystem$Infer$Classify$joinFrame = F4(
	function (s, kind, axis, level) {
		var _v0 = A3(
			$author$project$Typesystem$Unify$unify,
			A3($author$project$Typesystem$Types$TFrame, kind, axis, $author$project$Typesystem$Types$TBool),
			A3($author$project$Typesystem$Types$TFrame, level.jp, level.fa, $author$project$Typesystem$Types$TBool),
			s);
		if (!_v0.$) {
			var s2 = _v0.a;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(kind, s2));
		} else {
			var _v1 = _Utils_Tuple2(kind, level.jp);
			_v1$2:
			while (true) {
				if (!_v1.a.$) {
					if (_v1.b.$ === 1) {
						var _v2 = _v1.a;
						return A4($author$project$Typesystem$Infer$Classify$sameAxis, s, level.jp, axis, level.fa);
					} else {
						break _v1$2;
					}
				} else {
					if (!_v1.b.$) {
						var _v3 = _v1.b;
						return A4($author$project$Typesystem$Infer$Classify$sameAxis, s, kind, axis, level.fa);
					} else {
						break _v1$2;
					}
				}
			}
			return $elm$core$Result$Err(
				A3($author$project$Typesystem$Infer$Classify$frameMismatch, s, kind, level.jp));
		}
	});
var $author$project$Typesystem$Infer$Classify$placeClasses = F2(
	function (options, subst) {
		var probe = function (a) {
			return A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, a, $author$project$Typesystem$Types$TBool);
		};
		var placeFrame = F3(
			function (i, _v7, _v8) {
				var depth = _v7.a;
				var level = _v7.b;
				var classes = _v8.a;
				var s = _v8.b;
				var placed = _v8.c;
				var member = _Utils_Tuple2(
					i,
					A2($author$project$Typesystem$Unify$applyAxis, s, level.fa));
				var joins = function (_v6) {
					var j = _v6.a;
					var c = _v6.b;
					return (!A2(
						$elm$core$List$member,
						j,
						A2($elm$core$List$map, $elm$core$Tuple$first, placed))) && $author$project$Typesystem$Infer$Classify$isOk(
						A3(
							$author$project$Typesystem$Unify$unify,
							probe(c.fa),
							probe(level.fa),
							s));
				};
				var at = function (j) {
					return _Utils_ap(
						placed,
						_List_fromArray(
							[
								_Utils_Tuple2(
								j,
								_Utils_Tuple2(
									depth,
									$author$project$Typesystem$Infer$Classify$frameTag(level.jp)))
							]));
				};
				var _v3 = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						joins,
						A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, classes)));
				if (!_v3.$) {
					var _v4 = _v3.a;
					var j = _v4.a;
					var c = _v4.b;
					return A2(
						$elm$core$Result$map,
						function (_v5) {
							var kind = _v5.a;
							var s2 = _v5.b;
							return _Utils_Tuple3(
								A2(
									$elm$core$List$indexedMap,
									F2(
										function (k, cl) {
											return _Utils_eq(k, j) ? _Utils_update(
												cl,
												{
													jp: kind,
													aD: _Utils_ap(
														cl.aD,
														_List_fromArray(
															[member])),
													aW: cl.aW || level.aW
												}) : cl;
										}),
									classes),
								s2,
								at(j));
						},
						A4($author$project$Typesystem$Infer$Classify$joinFrame, s, c.jp, c.fa, level));
				} else {
					return $elm$core$Result$Ok(
						_Utils_Tuple3(
							_Utils_ap(
								classes,
								_List_fromArray(
									[
										{
										fa: level.fa,
										jp: level.jp,
										aD: _List_fromArray(
											[member]),
										aW: level.aW
									}
									])),
							s,
							at(
								$elm$core$List$length(classes))));
				}
			});
		var placeArg = F2(
			function (_v2, acc) {
				var i = _v2.a;
				var option = _v2.b;
				return A2(
					$elm$core$Result$andThen,
					function (_v0) {
						var classes = _v0.a;
						var s = _v0.b;
						var orders = _v0.c;
						return A2(
							$elm$core$Result$map,
							function (_v1) {
								var cs = _v1.a;
								var s2 = _v1.b;
								var placed = _v1.c;
								return _Utils_Tuple3(
									cs,
									s2,
									_Utils_ap(
										orders,
										_List_fromArray(
											[
												A2(
												$elm$core$List$map,
												$elm$core$Tuple$second,
												A2($elm$core$List$sortBy, $elm$core$Tuple$first, placed))
											])));
							},
							A3(
								$elm$core$List$foldl,
								function (frame) {
									return $elm$core$Result$andThen(
										A2(placeFrame, i, frame));
								},
								$elm$core$Result$Ok(
									_Utils_Tuple3(classes, s, _List_Nil)),
								A3($elm$core$List$map2, $elm$core$Tuple$pair, option.bg, option.iV)));
					},
					acc);
			});
		return A3(
			$elm$core$List$foldl,
			placeArg,
			$elm$core$Result$Ok(
				_Utils_Tuple3(_List_Nil, subst, _List_Nil)),
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, options));
	});
var $author$project$Typesystem$Infer$Classify$refit = F4(
	function (sig, valueArgs, base, orders) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, acc) {
					var _v1 = _v0.a;
					var param = _v1.a;
					var a = _v1.b;
					var order = _v0.b;
					return A2(
						$elm$core$Result$andThen,
						function (_v2) {
							var done = _v2.a;
							var s = _v2.b;
							var _v3 = A5(
								$author$project$Typesystem$Lift$fitOrder,
								s,
								a.dy,
								param.dy,
								$author$project$Typesystem$Infer$Classify$isReduction(sig.jp),
								A2($elm$core$List$map, $elm$core$Tuple$first, order));
							if (!_v3.$) {
								var option = _v3.a;
								return $elm$core$Result$Ok(
									_Utils_Tuple2(
										_Utils_ap(
											done,
											_List_fromArray(
												[option])),
										option.bl));
							} else {
								return $elm$core$Result$Err(
									$author$project$Typesystem$Diagnostic$TypeMismatch(
										{
											e2: A2($author$project$Typesystem$Unify$apply, s, a.dy),
											dV: A2($author$project$Typesystem$Unify$apply, s, param.dy)
										}));
							}
						},
						acc);
				}),
			$elm$core$Result$Ok(
				_Utils_Tuple2(_List_Nil, base)),
			A3($elm$core$List$map2, $elm$core$Tuple$pair, valueArgs, orders));
	});
var $author$project$Typesystem$Infer$Classify$classify = F6(
	function (env, node, sig, valueArgs, base, _v0) {
		var options = _v0.a;
		var subst = _v0.b;
		return A2(
			$elm$core$Result$andThen,
			function (_v3) {
				var finalOptions = _v3.a;
				var _v4 = _v3.b;
				var classes = _v4.a;
				var s = _v4.b;
				var orders = _v4.c;
				var alignment = A2(
					$elm$core$Maybe$withDefault,
					$author$project$Typesystem$Algebra$PadEmpty,
					A2($elm$core$Dict$get, node, env.dJ));
				return A2(
					$elm$core$Result$map,
					function (s2) {
						var _v5 = A3($author$project$Typesystem$Infer$Classify$nullableClasses, env, alignment, classes);
						var nullables = _v5.a;
						var cellPadded = _v5.b;
						var absorbs = A3($author$project$Typesystem$Infer$Classify$absorbedArg, sig, valueArgs, finalOptions) || (cellPadded || A3($author$project$Typesystem$Infer$Classify$nullableMember, sig, valueArgs, s2));
						return {
							fn: classes,
							jZ: finalOptions,
							gE: orders,
							bl: s2,
							dy: A2(
								$author$project$Typesystem$Types$wrapLevels,
								A3(
									$elm$core$List$map2,
									F2(
										function (c, nullable) {
											return {fa: c.fa, jp: c.jp, aW: nullable};
										}),
									classes,
									nullables),
								A2($author$project$Typesystem$Infer$Classify$resultCell, sig, absorbs))
						};
					},
					A6($author$project$Typesystem$Infer$Classify$paddingFits, env, alignment, finalOptions, valueArgs, classes, s));
			},
			A2(
				$elm$core$Result$andThen,
				function (_v1) {
					var classes = _v1.a;
					var s = _v1.b;
					var orders = _v1.c;
					return A2(
						$elm$core$List$all,
						$elm$core$Basics$identity,
						A3(
							$elm$core$List$map2,
							F2(
								function (option, order) {
									return _Utils_eq(
										A2($elm$core$List$map, $elm$core$Tuple$first, order),
										option.j_);
								}),
							options,
							orders)) ? $elm$core$Result$Ok(
						_Utils_Tuple2(
							options,
							_Utils_Tuple3(classes, s, orders))) : A2(
						$elm$core$Result$andThen,
						function (_v2) {
							var refitted = _v2.a;
							var refittedSubst = _v2.b;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(refitted),
								A2($author$project$Typesystem$Infer$Classify$placeClasses, refitted, refittedSubst));
						},
						A4($author$project$Typesystem$Infer$Classify$refit, sig, valueArgs, base, orders));
				},
				A2($author$project$Typesystem$Infer$Classify$placeClasses, options, subst)));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Typesystem$Infer$Classify$solveFitted = F6(
	function (env, node, sig, valueArgs, base, fitted) {
		if (fitted.b.b) {
			var mismatches = fitted.b;
			return $elm$core$Result$Err(mismatches);
		} else {
			var fits = fitted.a;
			var lifts = function (combo) {
				return $elm$core$List$sum(
					A2(
						$elm$core$List$map,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.bg;
							},
							$elm$core$List$length),
						combo.jZ));
			};
			var classified = A2(
				$elm$core$List$map,
				A5($author$project$Typesystem$Infer$Classify$classify, env, node, sig, valueArgs, base),
				fits);
			var combos = A2($elm$core$List$filterMap, $elm$core$Result$toMaybe, classified);
			var fewest = $elm$core$List$minimum(
				A2($elm$core$List$map, lifts, combos));
			if (!combos.b) {
				return function (problem) {
					return $elm$core$Result$Err(
						_List_fromArray(
							[
								_Utils_Tuple2(node, problem)
							]));
				}(
					A2(
						$elm$core$Maybe$withDefault,
						$author$project$Typesystem$Diagnostic$MixedFrameKinds,
						$elm$core$List$head(
							A2(
								$elm$core$List$filterMap,
								function (result) {
									if (result.$ === 1) {
										var problem = result.a;
										return $elm$core$Maybe$Just(problem);
									} else {
										return $elm$core$Maybe$Nothing;
									}
								},
								classified))));
			} else {
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$filter,
						function (combo) {
							return _Utils_eq(
								$elm$core$Maybe$Just(
									lifts(combo)),
								fewest);
						},
						combos));
			}
		}
	});
var $author$project$Typesystem$Infer$Classify$solveLifts = F5(
	function (env, node, sig, valueArgs, subst) {
		var _v0 = A3($author$project$Typesystem$Infer$Classify$fitArgs, sig, valueArgs, subst);
		var fits = _v0.a;
		var mismatches = _v0.b;
		var generated = _v0.c;
		return _Utils_Tuple2(
			A6(
				$author$project$Typesystem$Infer$Classify$solveFitted,
				env,
				node,
				sig,
				valueArgs,
				subst,
				_Utils_Tuple2(fits, mismatches)),
			generated);
	});
var $author$project$Typesystem$Infer$Elaborate$overloadAlternatives = F5(
	function (ctx, node, sig, valueArgs, st) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (id, _v0) {
					var found = _v0.a;
					var s = _v0.b;
					var _v1 = A2($elm$core$Dict$get, id, ctx.aB.ao);
					if (_v1.$ === 1) {
						return _Utils_Tuple2(found, s);
					} else {
						var scheme = _v1.a;
						var _v2 = A4($author$project$Typesystem$Infer$Sig$instantiate, ctx, node, scheme, s);
						var overload = _v2.a;
						var s2 = _v2.b;
						var pairs = A2(
							$elm$core$List$filterMap,
							function (p) {
								return A2(
									$elm$core$Maybe$map,
									function (_v6) {
										var a = _v6.b;
										return _Utils_Tuple2(p, a);
									},
									$elm$core$List$head(
										A2(
											$elm$core$List$filter,
											function (_v5) {
												var q = _v5.a;
												return _Utils_eq(q.c_, p.c_);
											},
											valueArgs)));
							},
							$author$project$Typesystem$Signature$params(overload));
						if (!_Utils_eq(
							$elm$core$List$length(pairs),
							$elm$core$List$length(valueArgs))) {
							return _Utils_Tuple2(found, s);
						} else {
							var _v3 = A5($author$project$Typesystem$Infer$Classify$solveLifts, ctx.aB, node, overload, pairs, s2.bl);
							if (!_v3.a.$) {
								var combos = _v3.a.a;
								var _v4 = A2(
									$elm$core$List$filter,
									function (alt) {
										return $author$project$Typesystem$Infer$Classify$isOk(
											A2(
												$author$project$Typesystem$Types$ground,
												s2.aa,
												$author$project$Typesystem$Infer$Classify$alternativeType(alt)));
									},
									A2(
										$elm$core$List$map,
										A2($author$project$Typesystem$Infer$Classify$ViaOverload, overload, pairs),
										combos));
								if (!_v4.b) {
									return _Utils_Tuple2(found, s);
								} else {
									var nameable = _v4;
									return _Utils_Tuple2(
										_Utils_ap(found, nameable),
										s2);
								}
							} else {
								return _Utils_Tuple2(found, s);
							}
						}
					}
				}),
			_Utils_Tuple2(_List_Nil, st),
			$author$project$Typesystem$Signature$overloads(sig));
	});
var $author$project$Typesystem$Infer$Elaborate$liftArgs = F7(
	function (synth, ctx, node, sig, valueArgs, slots, st) {
		var _v0 = A5($author$project$Typesystem$Infer$Classify$solveLifts, ctx.aB, node, sig, valueArgs, st.bl);
		var first = _v0.a;
		var firstOptions = _v0.b;
		var counted = A2($author$project$Typesystem$Infer$State$countSolve, firstOptions, st);
		var _v1 = A5($author$project$Typesystem$Infer$Elaborate$overloadAlternatives, ctx, node, sig, valueArgs, counted);
		var overloaded = _v1.a;
		var counted2 = _v1.b;
		var _v2 = _Utils_Tuple2(first, overloaded);
		if (!_v2.a.$) {
			var combos = _v2.a.a;
			return A9($author$project$Typesystem$Infer$Elaborate$choose, synth, ctx, node, sig, valueArgs, slots, combos, overloaded, counted2);
		} else {
			if (_v2.b.b) {
				var _v3 = _v2.b;
				return A9($author$project$Typesystem$Infer$Elaborate$choose, synth, ctx, node, sig, valueArgs, slots, _List_Nil, overloaded, counted2);
			} else {
				var problems = _v2.a.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3(
						$elm$core$List$foldl,
						F2(
							function (_v4, s) {
								var at = _v4.a;
								var problem = _v4.b;
								return A3($author$project$Typesystem$Infer$State$report, at, problem, s);
							}),
						counted,
						problems));
			}
		}
	});
var $author$project$Typesystem$Infer$Call$applyCall = F6(
	function (synth, ctx, node, scheme, mapping, _v0) {
		var synthesized = _v0.a;
		var stArgs = _v0.b;
		var missing = F2(
			function (param, s) {
				return A2($elm$core$Dict$member, param.c_, mapping) ? s : A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$MissingNode, s);
			});
		var _v1 = A4($author$project$Typesystem$Infer$Sig$instantiate, ctx, node, scheme, stArgs);
		var sig = _v1.a;
		var st2 = _v1.b;
		var assigned = function (isSlot) {
			return A2(
				$elm$core$List$filterMap,
				function (p) {
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(p),
						A2($elm$core$Dict$get, p.c_, mapping));
				},
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.dy;
						},
						A2(
							$elm$core$Basics$composeR,
							$author$project$Typesystem$Infer$Sig$isFnType,
							$elm$core$Basics$eq(isSlot))),
					$author$project$Typesystem$Signature$params(sig)));
		};
		var slots = {
			hS: A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						function ($) {
							return $.hp;
						})),
				assigned(true)),
			gs: A3(
				$author$project$Typesystem$Infer$Sig$binderNames,
				ctx,
				sig,
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v5, _v6) {
							var a = _v6.b;
							return a.hp;
						}),
					mapping))
		};
		if (synthesized.$ === 1) {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var typed = synthesized.a;
			var valueArgs = A2(
				$elm$core$List$filterMap,
				function (_v3) {
					var p = _v3.a;
					var _v4 = _v3.b;
					var i = _v4.a;
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(p),
						A2($elm$core$Dict$get, i, typed));
				},
				assigned(false));
			var st3 = A3(
				$elm$core$List$foldl,
				missing,
				st2,
				$author$project$Typesystem$Signature$params(sig));
			return (!_Utils_eq(
				$elm$core$List$length(st3.cf),
				$elm$core$List$length(st2.cf))) ? _Utils_Tuple2($elm$core$Maybe$Nothing, st3) : A7($author$project$Typesystem$Infer$Elaborate$liftArgs, synth, ctx, node, sig, valueArgs, slots, st3);
		}
	});
var $author$project$Typesystem$Infer$Sig$assignLabels = F4(
	function (env, sig, args, st) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (indexed, _v0) {
					var a = indexed.b;
					var labeled = _v0.a;
					var unlabeled = _v0.b;
					var s = _v0.c;
					var _v1 = a.f1;
					if (_v1.$ === 1) {
						return _Utils_Tuple3(
							labeled,
							_Utils_ap(
								unlabeled,
								_List_fromArray(
									[indexed])),
							s);
					} else {
						var label = _v1.a;
						var _v2 = A3($author$project$Typesystem$Infer$Sig$labelTarget, env, sig, label);
						if (!_v2.$) {
							var param = _v2.a;
							return A2($elm$core$Dict$member, param, labeled) ? _Utils_Tuple3(
								labeled,
								unlabeled,
								A3(
									$author$project$Typesystem$Infer$State$report,
									$author$project$Typesystem$Surface$nodeId(a.hp),
									$author$project$Typesystem$Diagnostic$AmbiguousArguments(sig.c_),
									s)) : _Utils_Tuple3(
								A3($elm$core$Dict$insert, param, indexed, labeled),
								unlabeled,
								s);
						} else {
							return _Utils_Tuple3(
								labeled,
								unlabeled,
								A3(
									$author$project$Typesystem$Infer$State$report,
									$author$project$Typesystem$Surface$nodeId(a.hp),
									$author$project$Typesystem$Diagnostic$UnknownName(
										$author$project$Typesystem$Infer$State$refName(label)),
									s));
						}
					}
				}),
			_Utils_Tuple3($elm$core$Dict$empty, _List_Nil, st),
			args);
	});
var $author$project$Typesystem$Infer$Sig$canonical = function (t) {
	var renaming = F2(
		function (ids, make) {
			return $elm$core$Dict$fromList(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, v) {
							return _Utils_Tuple2(
								v,
								make((-1) - i));
						}),
					ids));
		});
	return $author$project$Typesystem$Types$toString(
		A2(
			$author$project$Typesystem$Unify$apply,
			{
				e9: A2(
					renaming,
					$author$project$Typesystem$Types$axisVars(t),
					$author$project$Typesystem$Types$AxisVar),
				ho: A2(
					renaming,
					$author$project$Typesystem$Types$typeVars(t),
					$author$project$Typesystem$Types$TVar)
			},
			t));
};
var $author$project$Typesystem$Infer$Call$positional = function (sig) {
	return sig.c_ === 'coalesce';
};
var $author$project$Typesystem$Infer$Sig$selections = F2(
	function (m, pool) {
		return (!m) ? _List_fromArray(
			[_List_Nil]) : A2(
			$elm$core$List$concatMap,
			function (p) {
				return A2(
					$elm$core$List$map,
					$elm$core$List$cons(p),
					A2(
						$author$project$Typesystem$Infer$Sig$selections,
						m - 1,
						A2(
							$elm$core$List$filter,
							$elm$core$Basics$neq(p),
							pool)));
			},
			pool);
	});
var $author$project$Typesystem$Infer$Call$synthArg = F4(
	function (synth, ctx, a, st) {
		return A2(
			$elm$core$Tuple$mapFirst,
			$elm$core$Maybe$map(
				function (_v0) {
					var t = _v0.a;
					var core = _v0.b;
					return {
						iw: core,
						f1: a.f1,
						jG: $author$project$Typesystem$Surface$nodeId(a.hp),
						dy: t
					};
				}),
			A3(synth, ctx, a.hp, st));
	});
var $author$project$Typesystem$Infer$Call$synthValues = F4(
	function (synth, ctx, args, st) {
		return A2(
			$elm$core$Tuple$mapFirst,
			$elm$core$Maybe$map($elm$core$Dict$fromList),
			A3(
				$author$project$Typesystem$Infer$State$traverse,
				F2(
					function (_v0, s) {
						var i = _v0.a;
						var a = _v0.b;
						return A2(
							$elm$core$Tuple$mapFirst,
							$elm$core$Maybe$map(
								$elm$core$Tuple$pair(i)),
							A4($author$project$Typesystem$Infer$Call$synthArg, synth, ctx, a, s));
					}),
				args,
				st));
	});
var $author$project$Typesystem$Infer$Call$assignArgs = F6(
	function (synth, ctx, node, sig, args, st) {
		var valueRole = function (mapping) {
			return A2(
				$elm$core$List$sortBy,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$filterMap,
					function (p) {
						return A2($elm$core$Dict$get, p.c_, mapping);
					},
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.dy;
							},
							A2($elm$core$Basics$composeR, $author$project$Typesystem$Infer$Sig$isFnType, $elm$core$Basics$not)),
						$author$project$Typesystem$Signature$params(sig))));
		};
		var resultType = function (_v4) {
			var result = _v4.a;
			var s = _v4.b;
			return A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					A2(
						$elm$core$Basics$composeR,
						$author$project$Typesystem$Unify$apply(s.bl),
						$author$project$Typesystem$Infer$Sig$canonical)),
				result);
		};
		var _v0 = A4(
			$author$project$Typesystem$Infer$Sig$assignLabels,
			ctx.aB,
			sig,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, args),
			st);
		var labeled = _v0.a;
		var unlabeled = _v0.b;
		var st2 = _v0.c;
		var remaining = A2(
			$elm$core$List$filter,
			function (p) {
				return !A2($elm$core$Dict$member, p, labeled);
			},
			A2(
				$elm$core$List$map,
				function ($) {
					return $.c_;
				},
				$author$project$Typesystem$Signature$params(sig)));
		var clean = function (_v3) {
			var result = _v3.a;
			var s = _v3.b;
			return (!_Utils_eq(result, $elm$core$Maybe$Nothing)) && _Utils_eq(
				$elm$core$List$length(s.cf),
				$elm$core$List$length(st2.cf));
		};
		var arrangements = (($elm$core$List$length(unlabeled) > 4) || $author$project$Typesystem$Infer$Call$positional(sig)) ? _List_fromArray(
			[
				A2(
				$elm$core$List$take,
				$elm$core$List$length(unlabeled),
				remaining)
			]) : A2(
			$author$project$Typesystem$Infer$Sig$selections,
			$elm$core$List$length(unlabeled),
			remaining);
		var mappings = A2(
			$elm$core$List$map,
			function (params) {
				return A2(
					$elm$core$Dict$union,
					labeled,
					$elm$core$Dict$fromList(
						A3($elm$core$List$map2, $elm$core$Tuple$pair, params, unlabeled)));
			},
			arrangements);
		var synthesized = A3(
			$elm$core$List$foldl,
			F2(
				function (mapping, cache) {
					var key = A2(
						$elm$core$List$map,
						$elm$core$Tuple$first,
						valueRole(mapping));
					return A2($elm$core$Dict$member, key, cache) ? cache : A3(
						$elm$core$Dict$insert,
						key,
						A4(
							$author$project$Typesystem$Infer$Call$synthValues,
							synth,
							ctx,
							valueRole(mapping),
							st2),
						cache);
				}),
			$elm$core$Dict$empty,
			mappings);
		var runsUnder = function (c) {
			return A2(
				$elm$core$List$filterMap,
				function (mapping) {
					return A2(
						$elm$core$Maybe$map,
						A5($author$project$Typesystem$Infer$Call$applyCall, synth, c, node, sig, mapping),
						A2(
							$elm$core$Dict$get,
							A2(
								$elm$core$List$map,
								$elm$core$Tuple$first,
								valueRole(mapping)),
							synthesized));
				},
				mappings);
		};
		var runs = runsUnder(ctx);
		var ambiguous = function () {
			var defaultRuns = function () {
				if (A2($elm$core$Dict$member, node, ctx.aB.dJ)) {
					var env = ctx.aB;
					return runsUnder(
						_Utils_update(
							ctx,
							{
								aB: _Utils_update(
									env,
									{
										dJ: A2($elm$core$Dict$remove, node, env.dJ)
									})
							}));
				} else {
					return runs;
				}
			}();
			var _v2 = A2($elm$core$List$filter, clean, defaultRuns);
			if (_v2.b) {
				var first = _v2.a;
				var rest = _v2.b;
				return !A2(
					$elm$core$List$all,
					function (run) {
						return _Utils_eq(
							resultType(run),
							resultType(first));
					},
					rest);
			} else {
				return false;
			}
		}();
		var _v1 = A2($elm$core$List$filter, clean, runs);
		if (!_v1.b) {
			return A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2($elm$core$Maybe$Nothing, st2),
				$elm$core$List$head(runs));
		} else {
			var first = _v1.a;
			return (!ambiguous) ? first : _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					node,
					$author$project$Typesystem$Diagnostic$AmbiguousArguments(sig.c_),
					_Utils_update(
						st2,
						{
							U: A2(
								$elm$core$List$filter,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.jG;
									},
									$elm$core$Basics$neq(node)),
								first.b.U),
							eN: A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(node),
								first.b.eN)
						})));
		}
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Typesystem$Infer$Call$problemNode = F3(
	function (node, problem, args) {
		if (problem.$ === 14) {
			var expected = problem.a.dV;
			return A2(
				$elm$core$Maybe$withDefault,
				node,
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.hp;
						},
						$author$project$Typesystem$Surface$nodeId),
					$elm$core$List$head(
						A2(
							$elm$core$List$drop,
							A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$List$maximum(expected)),
							args))));
		} else {
			return node;
		}
	});
var $author$project$Typesystem$Diagnostic$UnknownSelector = function (a) {
	return {$: 10, a: a};
};
var $author$project$Typesystem$Selector$axisId = function (axis) {
	if (!axis.$) {
		var id = axis.a;
		return id;
	} else {
		var n = axis.a;
		return '?' + $elm$core$String$fromInt(n);
	}
};
var $author$project$Typesystem$Selector$derivedName = F4(
	function (env, i, selector, t) {
		var _v0 = _Utils_Tuple2(
			selector,
			A2(
				$elm$core$List$drop,
				i,
				$author$project$Typesystem$Types$peelLiftable(t).a));
		_v0$2:
		while (true) {
			if (_v0.b.b) {
				switch (_v0.a.$) {
					case 2:
						var path = _v0.a.a;
						var _v1 = _v0.b;
						var level = _v1.a;
						return _List_fromArray(
							[
								_Utils_Tuple2(
								$author$project$Typesystem$Selector$axisId(level.fa),
								A2(
									$elm$core$String$join,
									'.',
									A2(
										$elm$core$List$map,
										$author$project$Typesystem$Env$nameOf(env),
										path)))
							]);
					case 3:
						var _v2 = _v0.a;
						var path = _v2.a;
						var _v3 = _v0.b;
						var level = _v3.a;
						return _List_fromArray(
							[
								_Utils_Tuple2(
								$author$project$Typesystem$Selector$axisId(level.fa),
								A2(
									$elm$core$String$join,
									'.',
									A2(
										$elm$core$List$map,
										$author$project$Typesystem$Env$nameOf(env),
										path)))
							]);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return _List_Nil;
	});
var $author$project$Typesystem$Selector$flattened = F4(
	function (node, from, frames, cell) {
		return (_Utils_cmp(
			$elm$core$List$length(frames),
			from) < 1) ? A2($author$project$Typesystem$Types$wrapLevels, frames, cell) : A2(
			$author$project$Typesystem$Types$wrapLevels,
			_Utils_ap(
				A2($elm$core$List$take, from, frames),
				_List_fromArray(
					[
						{
						fa: $author$project$Typesystem$Types$Axis('flat:' + node),
						jp: $author$project$Typesystem$Types$ListF,
						aW: false
					}
					])),
			cell);
	});
var $author$project$Typesystem$Selector$problemNode = F3(
	function (node, key, problem) {
		if (problem.$ === 15) {
			return node;
		} else {
			return $author$project$Typesystem$Surface$nodeId(key);
		}
	});
var $author$project$Typesystem$Core$GPivot = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Typesystem$Selector$frameTag = function (kind) {
	if (!kind.$) {
		return 0;
	} else {
		return 1;
	}
};
var $author$project$Typesystem$Selector$axisKeys = F5(
	function (env, ref, above, below, cell) {
		var effect = F2(
			function (d, _v6) {
				var kind = _v6.jp;
				return $elm$core$Result$Ok(
					function () {
						var _v5 = A4(
							$author$project$Typesystem$Types$pivotLevel,
							$elm$core$List$length(above),
							d,
							_Utils_ap(above, below),
							cell);
						var levels = _v5.a;
						var cell2 = _v5.b;
						return _Utils_Tuple2(
							A2(
								$author$project$Typesystem$Core$GPivot,
								d,
								$author$project$Typesystem$Selector$frameTag(kind)),
							A2($author$project$Typesystem$Types$wrapLevels, levels, cell2));
					}());
			});
		var axisIds = A2(
			$elm$core$List$filterMap,
			function (level) {
				var _v4 = level.fa;
				if (!_v4.$) {
					var id = _v4.a;
					return $elm$core$Maybe$Just(id);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			below);
		var selected = function () {
			if (!ref.$) {
				var r = ref.a;
				return A2(
					$elm$core$List$filter,
					$elm$core$Basics$eq(r),
					axisIds);
			} else {
				var n = ref.a;
				return A4(
					$author$project$Typesystem$Resolve$byNameOrId,
					$author$project$Typesystem$Resolve$displayNameOf(env),
					$elm$core$Basics$identity,
					n,
					axisIds);
			}
		}();
		var names = function (axis) {
			if (!axis.$) {
				var id = axis.a;
				return A2($elm$core$List$member, id, selected);
			} else {
				return false;
			}
		};
		return A2(
			$elm$core$List$map,
			function (_v1) {
				var d = _v1.a;
				var level = _v1.b;
				return _Utils_Tuple2(
					$author$project$Typesystem$Selector$axisId(level.fa),
					A2(effect, d, level));
			},
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var level = _v0.b;
					return names(level.fa);
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, below)));
	});
var $author$project$Typesystem$Selector$argNamed = F2(
	function (name, args) {
		return A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.hp;
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (arg) {
						return _Utils_eq(
							arg.f1,
							$elm$core$Maybe$Just(
								$author$project$Typesystem$Surface$ByName(name))) || _Utils_eq(
							arg.f1,
							$elm$core$Maybe$Just(
								$author$project$Typesystem$Surface$ById(name)));
					},
					args)));
	});
var $author$project$Typesystem$Selector$calleeIds = F2(
	function (env, ref) {
		if (!ref.$) {
			var id = ref.a;
			return _List_fromArray(
				[id]);
		} else {
			var name = ref.a;
			return A4(
				$author$project$Typesystem$Resolve$byNameOrId,
				$author$project$Typesystem$Resolve$displayNameOf(env),
				$elm$core$Basics$identity,
				name,
				_List_fromArray(
					['coalesce']));
		}
	});
var $author$project$Typesystem$Selector$coalesceKey = F2(
	function (env, key) {
		if (key.$ === 3) {
			var ref = key.b;
			var args = key.c;
			return A2(
				$elm$core$List$member,
				'coalesce',
				A2($author$project$Typesystem$Selector$calleeIds, env, ref)) ? A2(
				$elm$core$Maybe$andThen,
				function (_v4) {
					var x = _v4.a;
					var d = _v4.b;
					if (!d.$) {
						var value = d.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(x, value));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				function () {
					var _v1 = A2(
						$elm$core$List$partition,
						function (arg) {
							return _Utils_eq(arg.f1, $elm$core$Maybe$Nothing);
						},
						args);
					if (_v1.a.b) {
						if ((_v1.a.b.b && (!_v1.a.b.b.b)) && (!_v1.b.b)) {
							var _v2 = _v1.a;
							var x = _v2.a;
							var _v3 = _v2.b;
							var d = _v3.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(x.hp, d.hp));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						var labelled = _v1.b;
						return A3(
							$elm$core$Maybe$map2,
							$elm$core$Tuple$pair,
							A2($author$project$Typesystem$Selector$argNamed, 'x', labelled),
							A2($author$project$Typesystem$Selector$argNamed, 'default', labelled));
					}
				}()) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Typesystem$Selector$byAxis = function (path) {
	return 'by:' + A2($elm$core$String$join, '/', path);
};
var $author$project$Typesystem$Resolve$fieldsByName = F4(
	function (env, subst, type_, name) {
		return A4(
			$author$project$Typesystem$Resolve$byNameOrId,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$author$project$Typesystem$Resolve$displayNameOf(env)),
			$elm$core$Tuple$first,
			name,
			A3($author$project$Typesystem$Resolve$recordFields, env, subst, type_));
	});
var $author$project$Typesystem$Resolve$fieldsNamed = F4(
	function (env, subst, type_, name) {
		return A2(
			$elm$core$List$filter,
			function (_v0) {
				var f = _v0.a;
				return _Utils_eq(
					A2($author$project$Typesystem$Env$nameOf, env, f),
					name);
			},
			A3($author$project$Typesystem$Resolve$recordFields, env, subst, type_));
	});
var $author$project$Typesystem$Selector$fieldsMatching = F3(
	function (env, ref, record) {
		if (!ref.$) {
			var id = ref.a;
			return A2(
				$elm$core$List$filter,
				function (_v1) {
					var f = _v1.a;
					return _Utils_eq(f, id);
				},
				A4(
					$author$project$Typesystem$Resolve$fieldsNamed,
					env,
					$elm$core$Basics$identity,
					record,
					A2($author$project$Typesystem$Env$nameOf, env, id)));
		} else {
			var name = ref.a;
			return A4($author$project$Typesystem$Resolve$fieldsByName, env, $elm$core$Basics$identity, record, name);
		}
	});
var $author$project$Typesystem$Selector$fieldPaths = F3(
	function (env, refs, t) {
		if (!refs.b) {
			return _List_fromArray(
				[
					_Utils_Tuple2(_List_Nil, t)
				]);
		} else {
			var ref = refs.a;
			var rest = refs.b;
			return A2(
				$elm$core$List$concatMap,
				function (_v1) {
					var f = _v1.a;
					var fieldType = _v1.b;
					return A2(
						$elm$core$List$map,
						$elm$core$Tuple$mapFirst(
							$elm$core$List$cons(f)),
						A3(
							$author$project$Typesystem$Selector$fieldPaths,
							env,
							rest,
							$author$project$Typesystem$Types$isNullable(t) ? $author$project$Typesystem$Types$nullable(fieldType) : fieldType));
				},
				A3(
					$author$project$Typesystem$Selector$fieldsMatching,
					env,
					ref,
					$author$project$Typesystem$Types$stripEmpty(t)));
		}
	});
var $author$project$Typesystem$Core$GByCoalesced = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Typesystem$Core$GByField = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Selector$refName = function (ref) {
	if (!ref.$) {
		var id = ref.a;
		return id;
	} else {
		var name = ref.a;
		return name;
	}
};
var $author$project$Typesystem$Selector$refPath = function (key) {
	switch (key.$) {
		case 1:
			var ref = key.b;
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[ref]));
		case 2:
			var target = key.b;
			var ref = key.c;
			return A2(
				$elm$core$Maybe$map,
				function (refs) {
					return _Utils_ap(
						refs,
						_List_fromArray(
							[ref]));
				},
				$author$project$Typesystem$Selector$refPath(target));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Typesystem$Selector$keyName = function (key) {
	var _v0 = $author$project$Typesystem$Selector$refPath(key);
	if (!_v0.$) {
		var refs = _v0.a;
		return A2(
			$elm$core$String$join,
			'.',
			A2($elm$core$List$map, $author$project$Typesystem$Selector$refName, refs));
	} else {
		return $author$project$Typesystem$Surface$nodeId(key);
	}
};
var $author$project$Typesystem$Selector$keyed = F4(
	function (field, _default, path, keyType) {
		if (_default.$ === 1) {
			return $author$project$Typesystem$Types$isNullable(keyType) ? $elm$core$Result$Err(
				$author$project$Typesystem$Diagnostic$NullableKey(
					{
						jn: $author$project$Typesystem$Selector$keyName(field),
						kK: '(coalesce ' + ($author$project$Typesystem$Selector$keyName(field) + ' <default>)')
					})) : $elm$core$Result$Ok(
				_Utils_Tuple2(
					$author$project$Typesystem$Core$GByField(path),
					keyType));
		} else {
			var value = _default.a;
			var plain = $author$project$Typesystem$Types$stripEmpty(keyType);
			var actual = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Typesystem$Types$TEmpty,
				$author$project$Typesystem$Types$baseType(value));
			return ((!_Utils_eq(actual, $author$project$Typesystem$Types$TEmpty)) && (!_Utils_eq(
				$elm$core$Result$toMaybe(
					A3($author$project$Typesystem$Unify$unify, plain, actual, $author$project$Typesystem$Unify$empty)),
				$elm$core$Maybe$Nothing))) ? $elm$core$Result$Ok(
				_Utils_Tuple2(
					A2($author$project$Typesystem$Core$GByCoalesced, path, value),
					plain)) : $elm$core$Result$Err(
				$author$project$Typesystem$Diagnostic$TypeMismatch(
					{e2: actual, dV: plain}));
		}
	});
var $author$project$Typesystem$Selector$rowsAxis = function (key) {
	return 'rows:' + $author$project$Typesystem$Surface$nodeId(key);
};
var $author$project$Typesystem$Selector$fieldKeys = F8(
	function (env, key, field, _default, refs, above, below, cell) {
		if (below.b && (!below.b.b)) {
			var kind = below.a.jp;
			var nullable = below.a.aW;
			return (_Utils_eq(kind, $author$project$Typesystem$Types$ListF) && (!nullable)) ? A2(
				$elm$core$List$map,
				function (_v1) {
					var path = _v1.a;
					var keyType = _v1.b;
					return _Utils_Tuple2(
						A2($elm$core$String$join, '.', path),
						A2(
							$elm$core$Result$map,
							function (_v2) {
								var selector = _v2.a;
								var keyType_ = _v2.b;
								return _Utils_Tuple2(
									selector,
									$author$project$Typesystem$Types$distinctAxes(
										A2(
											$author$project$Typesystem$Types$wrapLevels,
											_Utils_ap(
												above,
												_List_fromArray(
													[
														{
														fa: $author$project$Typesystem$Types$Axis(
															$author$project$Typesystem$Selector$byAxis(path)),
														jp: $author$project$Typesystem$Types$DictF(keyType_),
														aW: false
													},
														{
														fa: $author$project$Typesystem$Types$Axis(
															$author$project$Typesystem$Selector$rowsAxis(key)),
														jp: $author$project$Typesystem$Types$ListF,
														aW: false
													}
													])),
											cell)).a);
							},
							A4($author$project$Typesystem$Selector$keyed, field, _default, path, keyType)));
				},
				A3($author$project$Typesystem$Selector$fieldPaths, env, refs, cell)) : _List_Nil;
		} else {
			return _List_Nil;
		}
	});
var $author$project$Typesystem$Selector$typeKeys = F6(
	function (env, key, ref, above, below, cell) {
		var effect = $elm$core$Result$Ok(
			_Utils_Tuple2(
				$author$project$Typesystem$Core$GFlattenTo(
					$elm$core$List$length(below)),
				A4(
					$author$project$Typesystem$Selector$flattened,
					$author$project$Typesystem$Surface$nodeId(key),
					$elm$core$List$length(above),
					_Utils_ap(above, below),
					cell)));
		var declared = function () {
			if (!ref.$) {
				var id = ref.a;
				return A2($elm$core$Dict$member, id, env.fv) ? _List_fromArray(
					[id]) : _List_Nil;
			} else {
				var name = ref.a;
				return A4(
					$author$project$Typesystem$Resolve$byNameOrId,
					$author$project$Typesystem$Resolve$displayNameOf(env),
					$elm$core$Basics$identity,
					name,
					$elm$core$Dict$keys(env.fv));
			}
		}();
		var _v0 = $author$project$Typesystem$Types$stripEmpty(cell);
		if (_v0.$ === 5) {
			var named = _v0.a;
			return A2(
				$elm$core$List$map,
				function (id) {
					return _Utils_Tuple2(id, effect);
				},
				A2(
					$elm$core$List$filter,
					$elm$core$Basics$eq(named),
					declared));
		} else {
			return _List_Nil;
		}
	});
var $author$project$Typesystem$Selector$step = F4(
	function (env, i, key, t) {
		var _v0 = $author$project$Typesystem$Types$peelLiftable(t);
		var frames = _v0.a;
		var cell = _v0.b;
		var above = A2($elm$core$List$take, i, frames);
		var below = A2($elm$core$List$drop, i, frames);
		var candidates = function () {
			var _v3 = _Utils_Tuple2(
				$author$project$Typesystem$Selector$refPath(key),
				A2($author$project$Typesystem$Selector$coalesceKey, env, key));
			if (!_v3.a.$) {
				if (_v3.a.a.b && (!_v3.a.a.b.b)) {
					var _v4 = _v3.a.a;
					var ref = _v4.a;
					return _Utils_ap(
						A5($author$project$Typesystem$Selector$axisKeys, env, ref, above, below, cell),
						_Utils_ap(
							A8(
								$author$project$Typesystem$Selector$fieldKeys,
								env,
								key,
								key,
								$elm$core$Maybe$Nothing,
								_List_fromArray(
									[ref]),
								above,
								below,
								cell),
							A6($author$project$Typesystem$Selector$typeKeys, env, key, ref, above, below, cell)));
				} else {
					var refs = _v3.a.a;
					return A8($author$project$Typesystem$Selector$fieldKeys, env, key, key, $elm$core$Maybe$Nothing, refs, above, below, cell);
				}
			} else {
				if (!_v3.b.$) {
					var _v5 = _v3.a;
					var _v6 = _v3.b.a;
					var field = _v6.a;
					var _default = _v6.b;
					return A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2(
							$elm$core$Maybe$map,
							function (refs) {
								return A8(
									$author$project$Typesystem$Selector$fieldKeys,
									env,
									key,
									field,
									$elm$core$Maybe$Just(_default),
									refs,
									above,
									below,
									cell);
							},
							$author$project$Typesystem$Selector$refPath(field)));
				} else {
					var _v7 = _v3.a;
					var _v8 = _v3.b;
					return _List_Nil;
				}
			}
		}();
		if (candidates.b) {
			if (!candidates.b.b) {
				var _v2 = candidates.a;
				var effect = _v2.b;
				return effect;
			} else {
				var many = candidates;
				return $elm$core$Result$Err(
					$author$project$Typesystem$Diagnostic$AmbiguousName(
						{
							ic: $elm$core$List$sort(
								A2($elm$core$List$map, $elm$core$Tuple$first, many)),
							jD: $author$project$Typesystem$Selector$keyName(key)
						}));
			}
		} else {
			return $elm$core$Result$Err(
				$author$project$Typesystem$Diagnostic$UnknownSelector(
					$author$project$Typesystem$Selector$keyName(key)));
		}
	});
var $author$project$Typesystem$Selector$group = F4(
	function (env, node, keys, value) {
		if (!keys.b) {
			var _v1 = $author$project$Typesystem$Types$peelLiftable(value);
			var frames = _v1.a;
			var cell = _v1.b;
			return $elm$core$Result$Ok(
				{
					gs: _List_Nil,
					kq: _List_fromArray(
						[
							$author$project$Typesystem$Core$GFlattenTo(
							$elm$core$List$length(frames))
						]),
					dy: A4($author$project$Typesystem$Selector$flattened, node, 0, frames, cell)
				});
		} else {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (_v2, acc) {
						var i = _v2.a;
						var key = _v2.b;
						return A2(
							$elm$core$Result$andThen,
							function (grouped) {
								return A2(
									$elm$core$Result$mapError,
									function (problem) {
										return _Utils_Tuple2(
											A3($author$project$Typesystem$Selector$problemNode, node, key, problem),
											problem);
									},
									A2(
										$elm$core$Result$map,
										function (_v3) {
											var selector = _v3.a;
											var t = _v3.b;
											return {
												gs: _Utils_ap(
													grouped.gs,
													A4($author$project$Typesystem$Selector$derivedName, env, i, selector, t)),
												kq: _Utils_ap(
													grouped.kq,
													_List_fromArray(
														[selector])),
												dy: t
											};
										},
										A4($author$project$Typesystem$Selector$step, env, i, key, grouped.dy)));
							},
							acc);
					}),
				$elm$core$Result$Ok(
					{gs: _List_Nil, kq: _List_Nil, dy: value}),
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, keys));
		}
	});
var $author$project$Typesystem$Infer$Call$synthGroup = F6(
	function (synth, ctx, node, sig, args, st) {
		var isKeys = function (_v15) {
			var a = _v15.b;
			var _v14 = a.hp;
			if (_v14.$ === 6) {
				return true;
			} else {
				return false;
			}
		};
		var env = ctx.aB;
		var named = function (s) {
			return _Utils_update(
				env,
				{
					gs: A2($elm$core$Dict$union, s.dM, env.gs)
				});
		};
		var _v0 = A4(
			$author$project$Typesystem$Infer$Sig$assignLabels,
			ctx.aB,
			sig,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, args),
			st);
		var labeled = _v0.a;
		var unlabeled = _v0.b;
		var st2 = _v0.c;
		var open = A2(
			$elm$core$List$filter,
			function (p) {
				return !A2($elm$core$Dict$member, p, labeled);
			},
			A2(
				$elm$core$List$map,
				function ($) {
					return $.c_;
				},
				$author$project$Typesystem$Signature$params(sig)));
		var routed = function () {
			var _v8 = _Utils_Tuple2(
				open,
				A2($elm$core$List$partition, isKeys, unlabeled));
			if ((((((((_v8.a.b && (_v8.a.a === 'value')) && _v8.a.b.b) && (_v8.a.b.a === 'keys')) && (!_v8.a.b.b.b)) && _v8.b.a.b) && (!_v8.b.a.b.b)) && _v8.b.b.b) && (!_v8.b.b.b.b)) {
				var _v9 = _v8.a;
				var _v10 = _v9.b;
				var _v11 = _v8.b;
				var _v12 = _v11.a;
				var keys = _v12.a;
				var _v13 = _v11.b;
				var value = _v13.a;
				return _List_fromArray(
					[
						_Utils_Tuple2('value', value),
						_Utils_Tuple2('keys', keys)
					]);
			} else {
				return A3($elm$core$List$map2, $elm$core$Tuple$pair, open, unlabeled);
			}
		}();
		var assigned = A2(
			$elm$core$Dict$union,
			labeled,
			$elm$core$Dict$fromList(routed));
		var argFor = function (param) {
			return A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$second,
					function ($) {
						return $.hp;
					}),
				A2($elm$core$Dict$get, param, assigned));
		};
		var _v1 = _Utils_Tuple2(
			argFor('value'),
			argFor('keys'));
		if ((!_v1.a.$) && (!_v1.b.$)) {
			var value = _v1.a.a;
			var keys = _v1.b.a;
			var _v2 = A3(synth, ctx, value, st2);
			if (_v2.a.$ === 1) {
				var _v3 = _v2.a;
				var st3 = _v2.b;
				return _Utils_Tuple2($elm$core$Maybe$Nothing, st3);
			} else {
				var _v4 = _v2.a.a;
				var ungrouped = _v4.a;
				var core = _v4.b;
				var st3 = _v2.b;
				if (keys.$ === 6) {
					var items = keys.b;
					var _v6 = A4(
						$author$project$Typesystem$Selector$group,
						named(st3),
						node,
						items,
						A2($author$project$Typesystem$Infer$State$applied, st3, ungrouped));
					if (!_v6.$) {
						var grouped = _v6.a;
						return _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(
									grouped.dy,
									A2($author$project$Typesystem$Core$CGroup, grouped.kq, core))),
							A3(
								$author$project$Typesystem$Infer$State$annotate,
								node,
								$author$project$Typesystem$Infer$State$plain(grouped.dy),
								_Utils_update(
									st3,
									{
										dM: A2(
											$elm$core$Dict$union,
											$elm$core$Dict$fromList(grouped.gs),
											st3.dM)
									})));
					} else {
						var _v7 = _v6.a;
						var at = _v7.a;
						var problem = _v7.b;
						return _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A3($author$project$Typesystem$Infer$State$report, at, problem, st3));
					}
				} else {
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A3(
							$author$project$Typesystem$Infer$State$report,
							$author$project$Typesystem$Surface$nodeId(keys),
							$author$project$Typesystem$Diagnostic$UnknownSelector(
								$author$project$Typesystem$Selector$keyName(keys)),
							st3));
				}
			}
		} else {
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$MissingNode, st2));
		}
	});
var $author$project$Typesystem$Infer$Call$synthCall = F6(
	function (synth, ctx, node, fn, args, st) {
		var _v0 = A3(
			$author$project$Typesystem$Infer$Sig$lookupSignature,
			ctx.aB,
			fn,
			$elm$core$List$length(args));
		if (_v0.$ === 1) {
			var problem = _v0.a;
			var _v1 = A3(
				$author$project$Typesystem$Infer$State$traverse,
				A2($author$project$Typesystem$Infer$Call$synthArg, synth, ctx),
				args,
				st);
			var st2 = _v1.b;
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					A3($author$project$Typesystem$Infer$Call$problemNode, node, problem, args),
					problem,
					st2));
		} else {
			var sig = _v0.a;
			return (sig.c_ === 'always') ? _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$NotAFunctionSlot, st)) : ((sig.c_ === 'group') ? A6($author$project$Typesystem$Infer$Call$synthGroup, synth, ctx, node, sig, args, st) : A6($author$project$Typesystem$Infer$Call$assignArgs, synth, ctx, node, sig, args, st));
		}
	});
var $author$project$Typesystem$Infer$Access$liftThrough = F4(
	function (frames, source, body, st) {
		if (!frames.b) {
			return _Utils_Tuple2(
				body(source),
				st);
		} else {
			var kind = frames.a.jp;
			var inner = frames.b;
			var _v1 = $author$project$Typesystem$Infer$State$freshBinder(st);
			var binder = _v1.a;
			var st2 = _v1.b;
			var _v2 = A4(
				$author$project$Typesystem$Infer$Access$liftThrough,
				inner,
				$author$project$Typesystem$Core$CVar(binder),
				body,
				st2);
			var innerCore = _v2.a;
			var st3 = _v2.b;
			return _Utils_Tuple2(
				$author$project$Typesystem$Core$CLift(
					{
						dG: $author$project$Typesystem$Algebra$PadEmpty,
						h1: innerCore,
						iU: $author$project$Typesystem$Infer$Classify$frameTag(kind),
						ha: _List_fromArray(
							[
								_Utils_Tuple2(binder, source)
							])
					}),
				st3);
		}
	});
var $author$project$Typesystem$Infer$Access$lookupField = F4(
	function (env, st, cell, ref) {
		if (!ref.$) {
			var id = ref.a;
			return A2(
				$elm$core$List$filter,
				function (_v1) {
					var f = _v1.a;
					return _Utils_eq(f, id);
				},
				A4(
					$author$project$Typesystem$Resolve$fieldsNamed,
					env,
					$author$project$Typesystem$Infer$State$applied(st),
					cell,
					A2($author$project$Typesystem$Env$nameOf, env, id)));
		} else {
			var name = ref.a;
			return A4(
				$author$project$Typesystem$Resolve$fieldsByName,
				env,
				$author$project$Typesystem$Infer$State$applied(st),
				cell,
				name);
		}
	});
var $author$project$Typesystem$Infer$Access$fieldAccess = F5(
	function (ctx, node, ref, _v0, st) {
		var targetType = _v0.a;
		var targetCore = _v0.b;
		var _v1 = $author$project$Typesystem$Types$peelLiftable(
			A2($author$project$Typesystem$Infer$State$applied, st, targetType));
		var frames = _v1.a;
		var cell = _v1.b;
		var _v2 = A4(
			$author$project$Typesystem$Infer$Access$lookupField,
			ctx.aB,
			st,
			$author$project$Typesystem$Types$stripEmpty(cell),
			ref);
		if (_v2.b) {
			if (!_v2.b.b) {
				var _v3 = _v2.a;
				var f = _v3.a;
				var fieldType = _v3.b;
				var cellType = $author$project$Typesystem$Types$isNullable(cell) ? $author$project$Typesystem$Types$nullable(fieldType) : fieldType;
				var _v4 = A4(
					$author$project$Typesystem$Infer$Access$liftThrough,
					frames,
					targetCore,
					$author$project$Typesystem$Core$CField(f),
					st);
				var core = _v4.a;
				var st2 = _v4.b;
				var _v5 = A2(
					$author$project$Typesystem$Infer$Elaborate$distinctAxes,
					ctx,
					_Utils_Tuple2(
						A2($author$project$Typesystem$Types$wrapLevels, frames, cellType),
						st2));
				var type_ = _v5.a;
				var st3 = _v5.b;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(type_, core)),
					st3);
			} else {
				var many = _v2;
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3(
						$author$project$Typesystem$Infer$State$report,
						node,
						$author$project$Typesystem$Diagnostic$AmbiguousName(
							{
								ic: A2($elm$core$List$map, $elm$core$Tuple$first, many),
								jD: $author$project$Typesystem$Infer$State$refName(ref)
							}),
						st));
			}
		} else {
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					node,
					$author$project$Typesystem$Diagnostic$UnknownName(
						$author$project$Typesystem$Infer$State$refName(ref)),
					st));
		}
	});
var $author$project$Typesystem$Infer$Access$synthField = F6(
	function (synth, ctx, node, target, ref, st) {
		var _v0 = A3(synth, ctx, target, st);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			var st2 = _v0.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var typed = _v0.a.a;
			var st2 = _v0.b;
			return A5($author$project$Typesystem$Infer$Access$fieldAccess, ctx, node, ref, typed, st2);
		}
	});
var $author$project$Typesystem$Diagnostic$ImplicitParameter = 1;
var $author$project$Typesystem$Infer$State$markUsed = F2(
	function (binder, st) {
		return _Utils_update(
			st,
			{
				bZ: A2($elm$core$Set$insert, binder, st.bZ)
			});
	});
var $author$project$Typesystem$Core$CMissing = function (a) {
	return {$: 11, a: a};
};
var $author$project$Typesystem$Diagnostic$MissingAstNode = 2;
var $author$project$Typesystem$Infer$Synth$synthMissing = F2(
	function (node, st) {
		var _v0 = A3($author$project$Typesystem$Infer$State$freshVar, node, 'missing', st);
		var t = _v0.a;
		var st2 = _v0.b;
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(
				_Utils_Tuple2(
					t,
					$author$project$Typesystem$Core$CMissing(node))),
			A3(
				$author$project$Typesystem$Infer$State$annotate,
				node,
				{h0: _List_Nil, i$: 2, bg: _List_Nil, dy: t},
				A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$MissingNode, st2)));
	});
var $author$project$Typesystem$Infer$Synth$synthHole = F2(
	function (node, st) {
		var _v0 = st.aS;
		if (_v0.b) {
			var scope = _v0.a;
			var rest = _v0.b;
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					_Utils_Tuple2(
						scope.dy,
						$author$project$Typesystem$Core$CVar(scope.b4))),
				A3(
					$author$project$Typesystem$Infer$State$annotate,
					node,
					{
						h0: _List_Nil,
						i$: 1,
						bg: _List_Nil,
						dy: A2($author$project$Typesystem$Infer$State$applied, st, scope.dy)
					},
					A2(
						$author$project$Typesystem$Infer$State$markUsed,
						scope.b4,
						_Utils_update(
							st,
							{aS: rest}))));
		} else {
			return A2(
				$elm$core$Tuple$mapFirst,
				$elm$core$Basics$always($elm$core$Maybe$Nothing),
				A2($author$project$Typesystem$Infer$Synth$synthMissing, node, st));
		}
	});
var $author$project$Typesystem$Core$CList = function (a) {
	return {$: 5, a: a};
};
var $author$project$Typesystem$Infer$Collection$synthList = F5(
	function (synth, ctx, node, items, st) {
		var _v0 = A3(
			$author$project$Typesystem$Infer$State$traverse,
			synth(ctx),
			items,
			st);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			var st2 = _v0.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var typed = _v0.a.a;
			var st2 = _v0.b;
			var _v2 = A3(
				$author$project$Typesystem$Infer$Variant$joinTypes,
				node,
				A2($elm$core$List$map, $elm$core$Tuple$first, typed),
				st2);
			var elem = _v2.a;
			var st3 = _v2.b;
			var _v3 = A3($author$project$Typesystem$Infer$State$freshAxis, node, 'axis', st3);
			var axis = _v3.a;
			var st4 = _v3.b;
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					_Utils_Tuple2(
						A3($author$project$Typesystem$Types$TFrame, $author$project$Typesystem$Types$ListF, axis, elem),
						$author$project$Typesystem$Core$CList(
							A2($elm$core$List$map, $elm$core$Tuple$second, typed)))),
				st4);
		}
	});
var $author$project$Typesystem$Infer$State$candidates = function (resolution) {
	switch (resolution.$) {
		case 2:
			var o = resolution.a;
			return _List_fromArray(
				[o.c_]);
		case 0:
			var b = resolution.a;
			return _List_fromArray(
				[b.b4]);
		case 1:
			var b = resolution.a;
			var f = resolution.b;
			return _List_fromArray(
				[b.b4 + ('.' + f)]);
		case 3:
			return _List_Nil;
		default:
			var ids = resolution.a;
			return ids;
	}
};
var $author$project$Typesystem$Core$CRef = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Infer$Synth$synthResolved = F5(
	function (ctx, node, ref, resolution, st) {
		switch (resolution.$) {
			case 2:
				var o = resolution.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(
							$author$project$Typesystem$Types$open(o.dy),
							$author$project$Typesystem$Core$CRef(o.c_))),
					st);
			case 0:
				var b = resolution.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(
							b.dy,
							$author$project$Typesystem$Core$CVar(b.b4))),
					A2($author$project$Typesystem$Infer$State$markUsed, b.b4, st));
			case 1:
				var b = resolution.a;
				var f = resolution.b;
				var t = resolution.c;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(
							t,
							A2(
								$author$project$Typesystem$Core$CField,
								f,
								$author$project$Typesystem$Core$CVar(b.b4)))),
					A2($author$project$Typesystem$Infer$State$markUsed, b.b4, st));
			case 3:
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3(
						$author$project$Typesystem$Infer$State$report,
						node,
						$author$project$Typesystem$Diagnostic$UnknownName(
							$author$project$Typesystem$Infer$State$refName(ref)),
						st));
			default:
				var ids = resolution.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3(
						$author$project$Typesystem$Infer$State$report,
						node,
						$author$project$Typesystem$Diagnostic$AmbiguousName(
							{
								ic: ids,
								jD: $author$project$Typesystem$Infer$State$refName(ref)
							}),
						A3(
							$elm$core$List$foldl,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.b4;
								},
								$author$project$Typesystem$Infer$State$markUsed),
							st,
							A2(
								$elm$core$List$filter,
								function (b) {
									return A2(
										$elm$core$List$any,
										function (c) {
											return _Utils_eq(c, b.b4) || A2($elm$core$String$startsWith, b.b4 + '.', c);
										},
										ids);
								},
								ctx.h0))));
		}
	});
var $author$project$Typesystem$Infer$Synth$synthRef = F4(
	function (ctx, node, ref, st) {
		var subjectFields = A2(
			$elm$core$List$concatMap,
			function (subject) {
				return A2(
					$elm$core$List$map,
					function (_v4) {
						var f = _v4.a;
						return _Utils_Tuple2(subject, subject.jG + ('.' + f));
					},
					A4(
						$author$project$Typesystem$Infer$Access$lookupField,
						ctx.aB,
						st,
						$author$project$Typesystem$Types$stripEmpty(
							$author$project$Typesystem$Types$peelLiftable(
								A2($author$project$Typesystem$Infer$State$applied, st, subject.dy)).b),
						ref));
			},
			st.hd);
		var resolution = A4(
			$author$project$Typesystem$Resolve$resolve,
			ctx.aB,
			ctx.h0,
			$author$project$Typesystem$Infer$State$applied(st),
			ref);
		var _v0 = _Utils_Tuple2(resolution, subjectFields);
		if (!_v0.b.b) {
			return A5($author$project$Typesystem$Infer$Synth$synthResolved, ctx, node, ref, resolution, st);
		} else {
			if ((_v0.a.$ === 3) && (!_v0.b.b.b)) {
				var _v1 = _v0.a;
				var _v2 = _v0.b;
				var _v3 = _v2.a;
				var subject = _v3.a;
				return A5(
					$author$project$Typesystem$Infer$Access$fieldAccess,
					ctx,
					node,
					ref,
					_Utils_Tuple2(subject.dy, subject.iw),
					A2($author$project$Typesystem$Infer$State$markUsed, subject.b4, st));
			} else {
				return A5(
					$author$project$Typesystem$Infer$Synth$synthResolved,
					ctx,
					node,
					ref,
					$author$project$Typesystem$Resolve$Ambiguous(
						$elm$core$List$sort(
							_Utils_ap(
								$author$project$Typesystem$Infer$State$candidates(resolution),
								A2($elm$core$List$map, $elm$core$Tuple$second, subjectFields)))),
					A3(
						$elm$core$List$foldl,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$first,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.b4;
								},
								$author$project$Typesystem$Infer$State$markUsed)),
						st,
						subjectFields));
			}
		}
	});
var $author$project$Typesystem$Infer$Template$synthTemplate = F4(
	function (synth, ctx, parts, st) {
		var part = F2(
			function (p, s) {
				if (!p.$) {
					var text = p.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(
							_Utils_Tuple2(
								$author$project$Typesystem$Types$TText,
								$author$project$Typesystem$Core$CLit(
									$author$project$Typesystem$Value$VText(text)))),
						s);
				} else {
					var e = p.a;
					var _v4 = A3(synth, ctx, e, s);
					var result = _v4.a;
					var s2 = _v4.b;
					if (result.$ === 1) {
						return _Utils_Tuple2($elm$core$Maybe$Nothing, s2);
					} else {
						var _v6 = result.a;
						var t = _v6.a;
						var core = _v6.b;
						var actual = A2($author$project$Typesystem$Infer$State$applied, s2, t);
						return $author$project$Typesystem$Infer$Sig$isFnType(
							$author$project$Typesystem$Types$stripEmpty(actual)) ? _Utils_Tuple2(
							$elm$core$Maybe$Nothing,
							A3(
								$author$project$Typesystem$Infer$State$report,
								$author$project$Typesystem$Surface$nodeId(e),
								$author$project$Typesystem$Diagnostic$TypeMismatch(
									{e2: actual, dV: $author$project$Typesystem$Types$TText}),
								s2)) : _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(
									$author$project$Typesystem$Types$TText,
									A2(
										$author$project$Typesystem$Core$CPrim,
										'templatePart',
										$elm$core$Dict$fromList(
											_List_fromArray(
												[
													_Utils_Tuple2('value', core)
												]))))),
							s2);
					}
				}
			});
		var concat = F2(
			function (left, right) {
				return A2(
					$author$project$Typesystem$Core$CPrim,
					'concat',
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('left', left),
								_Utils_Tuple2('right', right)
							])));
			});
		var _v0 = A3($author$project$Typesystem$Infer$State$traverse, part, parts, st);
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			var st2 = _v0.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var typed = _v0.a.a;
			var st2 = _v0.b;
			var core = function () {
				var _v2 = A2($elm$core$List$map, $elm$core$Tuple$second, typed);
				if (!_v2.b) {
					return $author$project$Typesystem$Core$CLit(
						$author$project$Typesystem$Value$VText(''));
				} else {
					var first = _v2.a;
					var rest = _v2.b;
					return A3(
						$elm$core$List$foldl,
						F2(
							function (right, left) {
								return A2(concat, left, right);
							}),
						first,
						rest);
				}
			}();
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					_Utils_Tuple2($author$project$Typesystem$Types$TText, core)),
				st2);
		}
	});
var $author$project$Typesystem$Infer$Synth$notAFunction = F5(
	function (ctx, node, x, f, st) {
		var _v11 = A3(
			$author$project$Typesystem$Infer$State$traverse,
			$author$project$Typesystem$Infer$Synth$synth(ctx),
			_List_fromArray(
				[x, f]),
			st);
		if ((((!_v11.a.$) && _v11.a.a.b) && _v11.a.a.b.b) && (!_v11.a.a.b.b.b)) {
			var _v12 = _v11.a.a;
			var _v13 = _v12.a;
			var input = _v13.a;
			var _v14 = _v12.b;
			var _v15 = _v14.a;
			var actual = _v15.a;
			var st2 = _v11.b;
			var _v16 = A3($author$project$Typesystem$Infer$State$freshVar, node, 'result', st2);
			var result = _v16.a;
			var st3 = _v16.b;
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A3(
					$author$project$Typesystem$Infer$State$report,
					node,
					$author$project$Typesystem$Diagnostic$TypeMismatch(
						{
							e2: A2($author$project$Typesystem$Infer$State$applied, st3, actual),
							dV: A2(
								$author$project$Typesystem$Infer$State$applied,
								st3,
								A2(
									$author$project$Typesystem$Types$TFn,
									A2($elm$core$Dict$singleton, 'entry', input),
									result))
						}),
					st3));
		} else {
			var st2 = _v11.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		}
	});
var $author$project$Typesystem$Infer$Synth$synth = F3(
	function (ctx, surface, st) {
		return $author$project$Typesystem$Budget$exhausted(st.b6) ? _Utils_Tuple2($elm$core$Maybe$Nothing, st) : function (_v10) {
			var result = _v10.a;
			var st2 = _v10.b;
			return $author$project$Typesystem$Budget$exhausted(st2.b6) ? _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				A2(
					$author$project$Typesystem$Infer$Synth$reportTooComplex,
					$author$project$Typesystem$Surface$nodeId(surface),
					st2)) : _Utils_Tuple2(result, st2);
		}(
			A3($author$project$Typesystem$Infer$Synth$synthWithinBudget, ctx, surface, st));
	});
var $author$project$Typesystem$Infer$Synth$synthNode = F3(
	function (ctx, surface, st) {
		switch (surface.$) {
			case 0:
				var node = surface.a;
				var value = surface.b;
				return A2(
					$elm$core$Tuple$mapFirst,
					$elm$core$Maybe$map(
						function (_v8) {
							var t = _v8.a;
							var resolved = _v8.b;
							return _Utils_Tuple2(
								t,
								$author$project$Typesystem$Core$CLit(resolved));
						}),
					A4($author$project$Typesystem$Infer$Variant$valueType, ctx.aB, node, value, st));
			case 10:
				var node = surface.a;
				var ref = surface.b;
				var payload = surface.c;
				return A2(
					$elm$core$Tuple$mapFirst,
					$elm$core$Maybe$map(
						function (_v9) {
							var t = _v9.a;
							var resolved = _v9.b;
							return _Utils_Tuple2(
								t,
								$author$project$Typesystem$Core$CLit(resolved));
						}),
					A5($author$project$Typesystem$Infer$Variant$resolvedVariant, ctx.aB, node, ref, payload, st));
			case 1:
				var node = surface.a;
				var ref = surface.b;
				return A4($author$project$Typesystem$Infer$Synth$synthRef, ctx, node, ref, st);
			case 2:
				var node = surface.a;
				var target = surface.b;
				var ref = surface.c;
				return A6($author$project$Typesystem$Infer$Access$synthField, $author$project$Typesystem$Infer$Synth$synth, ctx, node, target, ref, st);
			case 6:
				var node = surface.a;
				var items = surface.b;
				return A5($author$project$Typesystem$Infer$Collection$synthList, $author$project$Typesystem$Infer$Synth$synth, ctx, node, items, st);
			case 7:
				var fields = surface.b;
				return A5($author$project$Typesystem$Infer$Check$synthRecord, $author$project$Typesystem$Infer$Synth$synth, ctx, $elm$core$Maybe$Nothing, fields, st);
			case 8:
				var parts = surface.b;
				return A4($author$project$Typesystem$Infer$Template$synthTemplate, $author$project$Typesystem$Infer$Synth$synth, ctx, parts, st);
			case 9:
				var node = surface.a;
				return A2($author$project$Typesystem$Infer$Synth$synthHole, node, st);
			case 11:
				var node = surface.a;
				return A2($author$project$Typesystem$Infer$Synth$synthMissing, node, st);
			case 3:
				var node = surface.a;
				var fn = surface.b;
				var args = surface.c;
				return A6($author$project$Typesystem$Infer$Call$synthCall, $author$project$Typesystem$Infer$Synth$synth, ctx, node, fn, args, st);
			case 4:
				var node = surface.a;
				var x = surface.b;
				var f = surface.c;
				return A5($author$project$Typesystem$Infer$Synth$synthPipe, ctx, node, x, f, st);
			default:
				var node = surface.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A3($author$project$Typesystem$Infer$State$report, node, $author$project$Typesystem$Diagnostic$NotAFunctionSlot, st));
		}
	});
var $author$project$Typesystem$Infer$Synth$synthPipe = F5(
	function (ctx, node, x, f, st) {
		synthPipe:
		while (true) {
			var fed = {f1: $elm$core$Maybe$Nothing, hp: x};
			switch (f.$) {
				case 3:
					var n = f.a;
					var g = f.b;
					var args = f.c;
					return ($author$project$Typesystem$Infer$Classify$isOk(
						A3(
							$author$project$Typesystem$Infer$Sig$lookupSignature,
							ctx.aB,
							g,
							$elm$core$List$length(args))) && (!$author$project$Typesystem$Infer$Classify$isOk(
						A3(
							$author$project$Typesystem$Infer$Sig$lookupSignature,
							ctx.aB,
							g,
							$elm$core$List$length(args) + 1)))) ? A5(
						$author$project$Typesystem$Infer$Synth$synthSubject,
						ctx,
						x,
						A3($author$project$Typesystem$Surface$SCall, n, g, args),
						A3(
							$author$project$Typesystem$Surface$SCall,
							n,
							g,
							_Utils_ap(
								args,
								_List_fromArray(
									[fed]))),
						st) : A3(
						$author$project$Typesystem$Infer$Synth$synth,
						ctx,
						A3(
							$author$project$Typesystem$Surface$SCall,
							n,
							g,
							_Utils_ap(
								args,
								_List_fromArray(
									[fed]))),
						st);
				case 5:
					var n = f.a;
					var f1 = f.b;
					var f2 = f.c;
					var $temp$ctx = ctx,
						$temp$node = node,
						$temp$x = A3($author$project$Typesystem$Surface$SPipe, n, x, f1),
						$temp$f = f2,
						$temp$st = st;
					ctx = $temp$ctx;
					node = $temp$node;
					x = $temp$x;
					f = $temp$f;
					st = $temp$st;
					continue synthPipe;
				case 1:
					var n = f.a;
					var ref = f.b;
					return A4($author$project$Typesystem$Infer$Synth$namesFunction, ctx, ref, 1, st) ? A3(
						$author$project$Typesystem$Infer$Synth$synth,
						ctx,
						A3(
							$author$project$Typesystem$Surface$SCall,
							n,
							ref,
							_List_fromArray(
								[fed])),
						st) : A5($author$project$Typesystem$Infer$Synth$notAFunction, ctx, node, x, f, st);
				default:
					return A5($author$project$Typesystem$Infer$Synth$notAFunction, ctx, node, x, f, st);
			}
		}
	});
var $author$project$Typesystem$Infer$Synth$synthSubject = F5(
	function (ctx, x, call, fed, st) {
		var _v1 = A3($author$project$Typesystem$Infer$Synth$synth, ctx, x, st);
		if (_v1.a.$ === 1) {
			var _v2 = _v1.a;
			var st2 = _v1.b;
			return _Utils_Tuple2($elm$core$Maybe$Nothing, st2);
		} else {
			var _v3 = _v1.a.a;
			var t = _v3.a;
			var core = _v3.b;
			var st2 = _v1.b;
			var _v4 = $author$project$Typesystem$Infer$State$freshBinder(st2);
			var binder = _v4.a;
			var st3 = _v4.b;
			var _v5 = A3(
				$author$project$Typesystem$Infer$Synth$synth,
				ctx,
				call,
				_Utils_update(
					st3,
					{
						hd: A2(
							$elm$core$List$cons,
							{
								b4: binder,
								iw: core,
								jG: $author$project$Typesystem$Surface$nodeId(x),
								dy: t
							},
							st3.hd)
					}));
			var result = _v5.a;
			var st4 = _v5.b;
			return A2($elm$core$Set$member, binder, st4.bZ) ? _Utils_Tuple2(
				result,
				_Utils_update(
					st4,
					{
						hd: st3.hd,
						bZ: A2($elm$core$Set$remove, binder, st4.bZ)
					})) : A3(
				$author$project$Typesystem$Infer$Synth$synth,
				ctx,
				fed,
				_Utils_update(
					st,
					{gx: st4.gx}));
		}
	});
var $author$project$Typesystem$Infer$Synth$synthWithinBudget = F3(
	function (ctx, surface, st) {
		switch (surface.$) {
			case 3:
				return A3($author$project$Typesystem$Infer$Synth$synthNode, ctx, surface, st);
			case 9:
				return A3($author$project$Typesystem$Infer$Synth$synthNode, ctx, surface, st);
			case 11:
				return A3($author$project$Typesystem$Infer$Synth$synthNode, ctx, surface, st);
			default:
				return A2(
					$author$project$Typesystem$Infer$State$annotateWith,
					$author$project$Typesystem$Surface$nodeId(surface),
					A3($author$project$Typesystem$Infer$Synth$synthNode, ctx, surface, st));
		}
	});
var $author$project$Typesystem$Infer$synth = $author$project$Typesystem$Infer$Synth$synth;
var $author$project$Typesystem$Check$check = F2(
	function (env, surface) {
		var _v0 = A3(
			$author$project$Typesystem$Check$narrowed,
			env,
			surface,
			F2(
				function (e, st) {
					return A3(
						$author$project$Typesystem$Infer$synth,
						{h0: _List_Nil, aB: e},
						surface,
						st);
				}));
		var result = _v0.a;
		return result;
	});
var $author$project$Typesystem$Types$openAxis = function (axis) {
	if (!axis.$) {
		var id = axis.a;
		return $author$project$Typesystem$Types$Axis(id);
	} else {
		var v = axis.a;
		return $elm$core$Basics$never(v);
	}
};
var $author$project$Typesystem$Check$openAnnotation = function (a) {
	return {
		h0: a.h0,
		i$: a.i$,
		bg: A2($elm$core$List$map, $author$project$Typesystem$Types$openAxis, a.bg),
		dy: $author$project$Typesystem$Types$open(a.dy)
	};
};
var $author$project$Typesystem$Check$checkPartial = F2(
	function (env, surface) {
		var _v0 = A3(
			$author$project$Typesystem$Infer$synth,
			{h0: _List_Nil, aB: env},
			surface,
			$author$project$Typesystem$Infer$initialFor(env));
		var result = _v0.a;
		var st = _v0.b;
		var _v1 = A2(
			$author$project$Typesystem$Check$outcome,
			surface,
			_Utils_Tuple2(result, st));
		if (!_v1.$) {
			var checked = _v1.a;
			return {
				e7: A2(
					$elm$core$Dict$map,
					F2(
						function (_v2, a) {
							return $author$project$Typesystem$Check$openAnnotation(a);
						}),
					checked.e7),
				U: checked.U,
				cf: _List_Nil,
				aa: $author$project$Typesystem$Types$emptyOrigins,
				eN: checked.eN,
				dy: $elm$core$Maybe$Just(
					$author$project$Typesystem$Types$open(checked.dy))
			};
		} else {
			var f = _v1.a;
			return {e7: f.e7, U: f.U, cf: f.cf, aa: f.aa, eN: st.eN, dy: f.dy};
		}
	});
var $author$project$Typesystem$Wire$Diagnostic$CheckErr = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Wire$Diagnostic$CheckOk = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Wire$Diagnostic$CheckPartial = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Wire$Codec$namedVariantObject = F4(
	function (name, ctor, _v0, _v1) {
		var o = _v0;
		var cc = _v1;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			o.fE,
			A2($elm$json$Json$Decode$map, ctor, o.c),
			cc.am(
				function (a) {
					return $elm$json$Json$Encode$object(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								cc.M,
								$elm$json$Json$Encode$string(name)),
							o.d(a)));
				}),
			cc);
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Typesystem$Wire$Codec$stringUnion = function (pairs) {
	return {
		c: A2(
			$elm$json$Json$Decode$andThen,
			function (s) {
				var _v0 = A2($author$project$Typesystem$Wire$Codec$lookup, s, pairs);
				if (!_v0.$) {
					var v = _v0.a;
					return $elm$json$Json$Decode$succeed(v);
				} else {
					return $elm$json$Json$Decode$fail('unknown value \"' + (s + '\"'));
				}
			},
			$elm$json$Json$Decode$string),
		d: function (a) {
			var _v1 = A2(
				$elm$core$List$filter,
				function (_v2) {
					var v = _v2.b;
					return _Utils_eq(v, a);
				},
				pairs);
			if (_v1.b) {
				var _v3 = _v1.a;
				var name = _v3.a;
				return $elm$json$Json$Encode$string(name);
			} else {
				return $elm$json$Json$Encode$null;
			}
		},
		e: $author$project$Typesystem$Wire$Codec$SStringEnum(
			A2($elm$core$List$map, $elm$core$Tuple$first, pairs))
	};
};
var $author$project$Typesystem$Wire$Diagnostic$holeCodec = $author$project$Typesystem$Wire$Codec$stringUnion(
	_List_fromArray(
		[
			_Utils_Tuple2('notAHole', 0),
			_Utils_Tuple2('implicitParameter', 1),
			_Utils_Tuple2('missingAstNode', 2)
		]));
var $author$project$Typesystem$Wire$Diagnostic$annotationWith = F2(
	function (typeCodec, axisCodec) {
		return $author$project$Typesystem$Wire$Codec$buildObject(
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'binders',
				function ($) {
					return $.h0;
				},
				$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Id$user),
				A4(
					$author$project$Typesystem$Wire$Codec$field,
					'hole',
					function ($) {
						return $.i$;
					},
					$author$project$Typesystem$Wire$Diagnostic$holeCodec,
					A4(
						$author$project$Typesystem$Wire$Codec$field,
						'lifted',
						function ($) {
							return $.bg;
						},
						$author$project$Typesystem$Wire$Codec$list(axisCodec),
						A4(
							$author$project$Typesystem$Wire$Codec$field,
							'type',
							function ($) {
								return $.dy;
							},
							typeCodec,
							$author$project$Typesystem$Wire$Codec$object(
								F4(
									function (type_, lifted, hole, binders) {
										return {h0: binders, i$: hole, bg: lifted, dy: type_};
									})))))));
	});
var $author$project$Typesystem$Wire$Diagnostic$annotationDefinition = A2($author$project$Typesystem$Wire$Diagnostic$annotationWith, $author$project$Typesystem$Wire$Type$openCodec, $author$project$Typesystem$Wire$Type$openAxisCodec);
var $author$project$Typesystem$Wire$Diagnostic$annotationCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Annotation',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$annotationDefinition;
	});
var $author$project$Typesystem$Diagnostic$ChoicePoint = F2(
	function (node, options) {
		return {jG: node, jZ: options};
	});
var $author$project$Typesystem$Choice$Option = F2(
	function (key, type_) {
		return {jn: key, dy: type_};
	});
var $author$project$Typesystem$Wire$Diagnostic$optionCodec = A2(
	$author$project$Typesystem$Wire$Codec$validate,
	function (o) {
		return _Utils_eq(
			o.jn,
			$author$project$Typesystem$Choice$key(o.dy)) ? $elm$core$Result$Ok(o) : $elm$core$Result$Err('option key is not the canonical key of its type');
	},
	$author$project$Typesystem$Wire$Codec$buildObject(
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'type',
			function ($) {
				return $.dy;
			},
			$author$project$Typesystem$Wire$Type$groundCodec,
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'key',
				function ($) {
					return $.jn;
				},
				$author$project$Typesystem$Wire$Codec$string,
				$author$project$Typesystem$Wire$Codec$object($author$project$Typesystem$Choice$Option)))));
var $author$project$Typesystem$Wire$Diagnostic$choicePointDefinition = $author$project$Typesystem$Wire$Codec$buildObject(
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'options',
		function ($) {
			return $.jZ;
		},
		$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Diagnostic$optionCodec),
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'node',
			function ($) {
				return $.jG;
			},
			$author$project$Typesystem$Wire$Id$structural,
			$author$project$Typesystem$Wire$Codec$object($author$project$Typesystem$Diagnostic$ChoicePoint))));
var $author$project$Typesystem$Wire$Diagnostic$choicePointCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'ChoicePoint',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$choicePointDefinition;
	});
var $author$project$Typesystem$Core$CVariant = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Typesystem$Wire$Core$frameTag = $author$project$Typesystem$Wire$Codec$stringUnion(
	_List_fromArray(
		[
			_Utils_Tuple2('list', 0),
			_Utils_Tuple2('dict', 1)
		]));
var $author$project$Typesystem$Wire$Codec$namedVariant4 = F7(
	function (name, ctor, _v0, _v1, _v2, _v3, _v4) {
		var n1 = _v0.a;
		var c1 = _v0.b;
		var n2 = _v1.a;
		var c2 = _v1.b;
		var n3 = _v2.a;
		var c3 = _v2.b;
		var n4 = _v3.a;
		var c4 = _v3.b;
		var cc = _v4;
		return A5(
			$author$project$Typesystem$Wire$Codec$addVariant,
			name,
			_List_fromArray(
				[
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n1, c1.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n2, c2.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n3, c3.e),
					A2($author$project$Typesystem$Wire$Codec$requiredShape, n4, c4.e)
				]),
			A5(
				$elm$json$Json$Decode$map4,
				ctor,
				A2($elm$json$Json$Decode$field, n1, c1.c),
				A2($elm$json$Json$Decode$field, n2, c2.c),
				A2($elm$json$Json$Decode$field, n3, c3.c),
				A2($elm$json$Json$Decode$field, n4, c4.c)),
			cc.am(
				F4(
					function (a, b, c, d) {
						return A3(
							$author$project$Typesystem$Wire$Codec$tagged,
							cc.M,
							name,
							_List_fromArray(
								[
									_Utils_Tuple2(
									n1,
									c1.d(a)),
									_Utils_Tuple2(
									n2,
									c2.d(b)),
									_Utils_Tuple2(
									n3,
									c3.d(c)),
									_Utils_Tuple2(
									n4,
									c4.d(d))
								]));
					})),
			cc);
	});
var $author$project$Typesystem$Wire$Core$selectorDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'flattenTo',
		$author$project$Typesystem$Core$GFlattenTo,
		_Utils_Tuple2('index', $author$project$Typesystem$Wire$Codec$int),
		A5(
			$author$project$Typesystem$Wire$Codec$namedVariant2,
			'byCoalesced',
			$author$project$Typesystem$Core$GByCoalesced,
			_Utils_Tuple2(
				'fields',
				$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Id$user)),
			_Utils_Tuple2('default', $author$project$Typesystem$Wire$Value$codec),
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariant1,
				'byField',
				$author$project$Typesystem$Core$GByField,
				_Utils_Tuple2(
					'fields',
					$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Id$user)),
				A5(
					$author$project$Typesystem$Wire$Codec$namedVariant2,
					'liftPivot',
					$author$project$Typesystem$Core$GLiftPivot,
					_Utils_Tuple2('index', $author$project$Typesystem$Wire$Codec$int),
					_Utils_Tuple2('frame', $author$project$Typesystem$Wire$Core$frameTag),
					A5(
						$author$project$Typesystem$Wire$Codec$namedVariant2,
						'pivot',
						$author$project$Typesystem$Core$GPivot,
						_Utils_Tuple2('index', $author$project$Typesystem$Wire$Codec$int),
						_Utils_Tuple2('frame', $author$project$Typesystem$Wire$Core$frameTag),
						A2(
							$author$project$Typesystem$Wire$Codec$custom,
							'kind',
							F6(
								function (vPivot, vLiftPivot, vByField, vByCoalesced, vFlattenTo, selector) {
									switch (selector.$) {
										case 0:
											var index = selector.a;
											var frame = selector.b;
											return A2(vPivot, index, frame);
										case 1:
											var index = selector.a;
											var frame = selector.b;
											return A2(vLiftPivot, index, frame);
										case 2:
											var fields = selector.a;
											return vByField(fields);
										case 3:
											var fields = selector.a;
											var _default = selector.b;
											return A2(vByCoalesced, fields, _default);
										default:
											var index = selector.a;
											return vFlattenTo(index);
									}
								}))))))));
var $author$project$Typesystem$Wire$Core$selectorCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Selector',
	function (_v0) {
		return $author$project$Typesystem$Wire$Core$selectorDefinition;
	});
function $author$project$Typesystem$Wire$Core$cyclic$definition() {
	return $author$project$Typesystem$Wire$Codec$buildCustom(
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'missing',
			$author$project$Typesystem$Core$CMissing,
			_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
			A5(
				$author$project$Typesystem$Wire$Codec$namedVariant2,
				'group',
				$author$project$Typesystem$Core$CGroup,
				_Utils_Tuple2(
					'selectors',
					$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Core$selectorCodec)),
				_Utils_Tuple2(
					'body',
					$author$project$Typesystem$Wire$Core$cyclic$codec()),
				A7(
					$author$project$Typesystem$Wire$Codec$namedVariant4,
					'lift',
					F4(
						function (frame, align, sources, body) {
							return $author$project$Typesystem$Core$CLift(
								{dG: align, h1: body, iU: frame, ha: sources});
						}),
					_Utils_Tuple2('frame', $author$project$Typesystem$Wire$Core$frameTag),
					_Utils_Tuple2('align', $author$project$Typesystem$Wire$Algebra$alignmentCodec),
					_Utils_Tuple2(
						'sources',
						$author$project$Typesystem$Wire$Codec$list(
							$author$project$Typesystem$Wire$Core$cyclic$sourceCodec())),
					_Utils_Tuple2(
						'body',
						$author$project$Typesystem$Wire$Core$cyclic$codec()),
					A5(
						$author$project$Typesystem$Wire$Codec$namedVariant2,
						'lambda',
						$author$project$Typesystem$Core$CLam,
						_Utils_Tuple2(
							'params',
							$author$project$Typesystem$Wire$Id$userDict($author$project$Typesystem$Wire$Id$user)),
						_Utils_Tuple2(
							'body',
							$author$project$Typesystem$Wire$Core$cyclic$codec()),
						A5(
							$author$project$Typesystem$Wire$Codec$namedVariant2,
							'primitive',
							$author$project$Typesystem$Core$CPrim,
							_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
							_Utils_Tuple2(
								'args',
								$author$project$Typesystem$Wire$Id$userDict(
									$author$project$Typesystem$Wire$Core$cyclic$codec())),
							A5(
								$author$project$Typesystem$Wire$Codec$namedVariant2Maybe,
								'variant',
								$author$project$Typesystem$Core$CVariant,
								_Utils_Tuple2('tag', $author$project$Typesystem$Wire$Id$user),
								_Utils_Tuple2(
									'payload',
									$author$project$Typesystem$Wire$Core$cyclic$codec()),
								A4(
									$author$project$Typesystem$Wire$Codec$namedVariant1,
									'list',
									$author$project$Typesystem$Core$CList,
									_Utils_Tuple2(
										'items',
										$author$project$Typesystem$Wire$Codec$list(
											$author$project$Typesystem$Wire$Core$cyclic$codec())),
									A4(
										$author$project$Typesystem$Wire$Codec$namedVariant1,
										'record',
										$author$project$Typesystem$Core$CRecord,
										_Utils_Tuple2(
											'fields',
											$author$project$Typesystem$Wire$Id$userDict(
												$author$project$Typesystem$Wire$Core$cyclic$codec())),
										A5(
											$author$project$Typesystem$Wire$Codec$namedVariant2,
											'field',
											$author$project$Typesystem$Core$CField,
											_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
											_Utils_Tuple2(
												'of',
												$author$project$Typesystem$Wire$Core$cyclic$codec()),
											A4(
												$author$project$Typesystem$Wire$Codec$namedVariant1,
												'reference',
												$author$project$Typesystem$Core$CRef,
												_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
												A4(
													$author$project$Typesystem$Wire$Codec$namedVariant1,
													'variable',
													$author$project$Typesystem$Core$CVar,
													_Utils_Tuple2('id', $author$project$Typesystem$Wire$Id$user),
													A4(
														$author$project$Typesystem$Wire$Codec$namedVariant1,
														'literal',
														$author$project$Typesystem$Core$CLit,
														_Utils_Tuple2('value', $author$project$Typesystem$Wire$Value$codec),
														A2(
															$author$project$Typesystem$Wire$Codec$custom,
															'kind',
															function (vLiteral) {
																return function (vVariable) {
																	return function (vReference) {
																		return function (vField) {
																			return function (vRecord) {
																				return function (vList) {
																					return function (vVariant) {
																						return function (vPrimitive) {
																							return function (vLambda) {
																								return function (vLift) {
																									return function (vGroup) {
																										return function (vMissing) {
																											return function (core) {
																												switch (core.$) {
																													case 0:
																														var v = core.a;
																														return vLiteral(v);
																													case 1:
																														var b = core.a;
																														return vVariable(b);
																													case 2:
																														var r = core.a;
																														return vReference(r);
																													case 3:
																														var f = core.a;
																														var inner = core.b;
																														return A2(vField, f, inner);
																													case 4:
																														var fields = core.a;
																														return vRecord(fields);
																													case 5:
																														var items = core.a;
																														return vList(items);
																													case 6:
																														var tag = core.a;
																														var payload = core.b;
																														return A2(vVariant, tag, payload);
																													case 7:
																														var id = core.a;
																														var args = core.b;
																														return A2(vPrimitive, id, args);
																													case 8:
																														var params = core.a;
																														var body = core.b;
																														return A2(vLambda, params, body);
																													case 9:
																														var spec = core.a;
																														return A4(vLift, spec.iU, spec.dG, spec.ha, spec.h1);
																													case 10:
																														var selectors = core.a;
																														var body = core.b;
																														return A2(vGroup, selectors, body);
																													default:
																														var id = core.a;
																														return vMissing(id);
																												}
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															}))))))))))))));
}
function $author$project$Typesystem$Wire$Core$cyclic$sourceCodec() {
	return $author$project$Typesystem$Wire$Codec$buildObject(
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'source',
			$elm$core$Tuple$second,
			$author$project$Typesystem$Wire$Core$cyclic$codec(),
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'binder',
				$elm$core$Tuple$first,
				$author$project$Typesystem$Wire$Id$user,
				$author$project$Typesystem$Wire$Codec$object($elm$core$Tuple$pair))));
}
function $author$project$Typesystem$Wire$Core$cyclic$codec() {
	return A2(
		$author$project$Typesystem$Wire$Codec$ref,
		'Core',
		function (_v0) {
			return $author$project$Typesystem$Wire$Core$cyclic$definition();
		});
}
var $author$project$Typesystem$Wire$Core$definition = $author$project$Typesystem$Wire$Core$cyclic$definition();
$author$project$Typesystem$Wire$Core$cyclic$definition = function () {
	return $author$project$Typesystem$Wire$Core$definition;
};
var $author$project$Typesystem$Wire$Core$sourceCodec = $author$project$Typesystem$Wire$Core$cyclic$sourceCodec();
$author$project$Typesystem$Wire$Core$cyclic$sourceCodec = function () {
	return $author$project$Typesystem$Wire$Core$sourceCodec;
};
var $author$project$Typesystem$Wire$Core$codec = $author$project$Typesystem$Wire$Core$cyclic$codec();
$author$project$Typesystem$Wire$Core$cyclic$codec = function () {
	return $author$project$Typesystem$Wire$Core$codec;
};
var $author$project$Typesystem$Wire$Diagnostic$mappingCodec = $author$project$Typesystem$Wire$Codec$buildObject(
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'fields',
		function ($) {
			return $.fE;
		},
		$author$project$Typesystem$Wire$Id$userDict($author$project$Typesystem$Wire$Core$codec),
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'to',
			function ($) {
				return $.k3;
			},
			$author$project$Typesystem$Wire$Type$openCodec,
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'from',
				function ($) {
					return $.iW;
				},
				$author$project$Typesystem$Wire$Type$openCodec,
				A4(
					$author$project$Typesystem$Wire$Codec$field,
					'id',
					function ($) {
						return $.c_;
					},
					$author$project$Typesystem$Wire$Id$user,
					$author$project$Typesystem$Wire$Codec$object(
						F4(
							function (id, from, to, fields) {
								return {fE: fields, iW: from, c_: id, k3: to};
							})))))));
var $author$project$Typesystem$Wire$Diagnostic$fixCodec = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'proposeMapping',
		$elm$core$Basics$identity,
		_Utils_Tuple2('mapping', $author$project$Typesystem$Wire$Diagnostic$mappingCodec),
		A2(
			$author$project$Typesystem$Wire$Codec$custom,
			'kind',
			F2(
				function (vPropose, fix) {
					var mapping = fix;
					return vPropose(mapping);
				}))));
var $author$project$Typesystem$Wire$Surface$index = A2(
	$author$project$Typesystem$Wire$Codec$validate,
	function (i) {
		return (i >= 0) ? $elm$core$Result$Ok(i) : $elm$core$Result$Err('index must not be negative');
	},
	$author$project$Typesystem$Wire$Codec$int);
var $author$project$Typesystem$Wire$Surface$pathStepDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariant1,
		'part',
		$author$project$Typesystem$Surface$PPart,
		_Utils_Tuple2('index', $author$project$Typesystem$Wire$Surface$index),
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariant1,
			'entry',
			$author$project$Typesystem$Surface$PEntry,
			_Utils_Tuple2('index', $author$project$Typesystem$Wire$Surface$index),
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariant1,
				'item',
				$author$project$Typesystem$Surface$PItem,
				_Utils_Tuple2('index', $author$project$Typesystem$Wire$Surface$index),
				A3(
					$author$project$Typesystem$Wire$Codec$namedVariant0,
					'second',
					$author$project$Typesystem$Surface$PSecond,
					A3(
						$author$project$Typesystem$Wire$Codec$namedVariant0,
						'first',
						$author$project$Typesystem$Surface$PFirst,
						A3(
							$author$project$Typesystem$Wire$Codec$namedVariant0,
							'function',
							$author$project$Typesystem$Surface$PFunction,
							A3(
								$author$project$Typesystem$Wire$Codec$namedVariant0,
								'input',
								$author$project$Typesystem$Surface$PInput,
								A4(
									$author$project$Typesystem$Wire$Codec$namedVariant1,
									'arg',
									$author$project$Typesystem$Surface$PArg,
									_Utils_Tuple2('index', $author$project$Typesystem$Wire$Surface$index),
									A3(
										$author$project$Typesystem$Wire$Codec$namedVariant0,
										'target',
										$author$project$Typesystem$Surface$PTarget,
										A2(
											$author$project$Typesystem$Wire$Codec$custom,
											'kind',
											function (vTarget) {
												return function (vArg) {
													return function (vInput) {
														return function (vFunction) {
															return function (vFirst) {
																return function (vSecond) {
																	return function (vItem) {
																		return function (vEntry) {
																			return function (vPart) {
																				return function (step) {
																					switch (step.$) {
																						case 0:
																							return vTarget;
																						case 1:
																							var i = step.a;
																							return vArg(i);
																						case 2:
																							return vInput;
																						case 3:
																							return vFunction;
																						case 4:
																							return vFirst;
																						case 5:
																							return vSecond;
																						case 6:
																							var i = step.a;
																							return vItem(i);
																						case 7:
																							var i = step.a;
																							return vEntry(i);
																						default:
																							var i = step.a;
																							return vPart(i);
																					}
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											})))))))))));
var $author$project$Typesystem$Wire$Surface$pathStepCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'PathStep',
	function (_v0) {
		return $author$project$Typesystem$Wire$Surface$pathStepDefinition;
	});
var $author$project$Typesystem$Wire$Surface$pathCodec = $author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Surface$pathStepCodec);
var $author$project$Typesystem$Diagnostic$BadPath = function (a) {
	return {$: 13, a: a};
};
var $author$project$Typesystem$Wire$Diagnostic$problemDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A5(
		$author$project$Typesystem$Wire$Codec$namedVariant2,
		'nullableKey',
		F2(
			function (key, suggestion) {
				return $author$project$Typesystem$Diagnostic$NullableKey(
					{jn: key, kK: suggestion});
			}),
		_Utils_Tuple2('key', $author$project$Typesystem$Wire$Codec$string),
		_Utils_Tuple2('suggestion', $author$project$Typesystem$Wire$Codec$string),
		A6(
			$author$project$Typesystem$Wire$Codec$namedVariant3,
			'wrongArity',
			F3(
				function (_function, expected, actual) {
					return $author$project$Typesystem$Diagnostic$WrongArity(
						{e2: actual, dV: expected, iY: _function});
				}),
			_Utils_Tuple2('function', $author$project$Typesystem$Wire$Codec$string),
			_Utils_Tuple2(
				'expected',
				$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Codec$int)),
			_Utils_Tuple2('actual', $author$project$Typesystem$Wire$Codec$int),
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariant1,
				'badPath',
				function (path) {
					return $author$project$Typesystem$Diagnostic$BadPath(
						{gL: path});
				},
				_Utils_Tuple2('path', $author$project$Typesystem$Wire$Codec$string),
				A3(
					$author$project$Typesystem$Wire$Codec$namedVariant0,
					'tooComplex',
					$author$project$Typesystem$Diagnostic$TooComplex,
					A3(
						$author$project$Typesystem$Wire$Codec$namedVariant0,
						'unresolvedType',
						$author$project$Typesystem$Diagnostic$UnresolvedType,
						A4(
							$author$project$Typesystem$Wire$Codec$namedVariant1,
							'unknownSelector',
							$author$project$Typesystem$Diagnostic$UnknownSelector,
							_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
							A4(
								$author$project$Typesystem$Wire$Codec$namedVariant1,
								'unknownFunction',
								$author$project$Typesystem$Diagnostic$UnknownFunction,
								_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
								A3(
									$author$project$Typesystem$Wire$Codec$namedVariant0,
									'occursCheck',
									$author$project$Typesystem$Diagnostic$OccursCheck,
									A3(
										$author$project$Typesystem$Wire$Codec$namedVariant0,
										'notAFunctionSlot',
										$author$project$Typesystem$Diagnostic$NotAFunctionSlot,
										A5(
											$author$project$Typesystem$Wire$Codec$namedVariant2,
											'needsNarrowing',
											F2(
												function (union, expected) {
													return $author$project$Typesystem$Diagnostic$NeedsNarrowing(
														{dV: expected, k8: union});
												}),
											_Utils_Tuple2('union', $author$project$Typesystem$Wire$Type$openCodec),
											_Utils_Tuple2('expected', $author$project$Typesystem$Wire$Type$openCodec),
											A3(
												$author$project$Typesystem$Wire$Codec$namedVariant0,
												'mixedFrameKinds',
												$author$project$Typesystem$Diagnostic$MixedFrameKinds,
												A3(
													$author$project$Typesystem$Wire$Codec$namedVariant0,
													'missingNode',
													$author$project$Typesystem$Diagnostic$MissingNode,
													A4(
														$author$project$Typesystem$Wire$Codec$namedVariant1,
														'ambiguousArguments',
														$author$project$Typesystem$Diagnostic$AmbiguousArguments,
														_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
														A5(
															$author$project$Typesystem$Wire$Codec$namedVariant2,
															'ambiguousName',
															F2(
																function (name, candidates) {
																	return $author$project$Typesystem$Diagnostic$AmbiguousName(
																		{ic: candidates, jD: name});
																}),
															_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
															_Utils_Tuple2(
																'candidates',
																$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Codec$string)),
															A4(
																$author$project$Typesystem$Wire$Codec$namedVariant1,
																'unknownName',
																$author$project$Typesystem$Diagnostic$UnknownName,
																_Utils_Tuple2('name', $author$project$Typesystem$Wire$Codec$string),
																A5(
																	$author$project$Typesystem$Wire$Codec$namedVariant2,
																	'typeMismatch',
																	F2(
																		function (expected, actual) {
																			return $author$project$Typesystem$Diagnostic$TypeMismatch(
																				{e2: actual, dV: expected});
																		}),
																	_Utils_Tuple2('expected', $author$project$Typesystem$Wire$Type$openCodec),
																	_Utils_Tuple2('actual', $author$project$Typesystem$Wire$Type$openCodec),
																	A2(
																		$author$project$Typesystem$Wire$Codec$custom,
																		'kind',
																		function (vMismatch) {
																			return function (vUnknownName) {
																				return function (vAmbiguousName) {
																					return function (vAmbiguousArguments) {
																						return function (vMissing) {
																							return function (vMixed) {
																								return function (vNarrowing) {
																									return function (vNotSlot) {
																										return function (vOccurs) {
																											return function (vUnknownFunction) {
																												return function (vUnknownSelector) {
																													return function (vUnresolved) {
																														return function (vTooComplex) {
																															return function (vBadPath) {
																																return function (vWrongArity) {
																																	return function (vNullableKey) {
																																		return function (problem) {
																																			switch (problem.$) {
																																				case 0:
																																					var t = problem.a;
																																					return A2(vMismatch, t.dV, t.e2);
																																				case 1:
																																					var name = problem.a;
																																					return vUnknownName(name);
																																				case 2:
																																					var a = problem.a;
																																					return A2(vAmbiguousName, a.jD, a.ic);
																																				case 3:
																																					var name = problem.a;
																																					return vAmbiguousArguments(name);
																																				case 4:
																																					return vMissing;
																																				case 5:
																																					return vMixed;
																																				case 6:
																																					var n = problem.a;
																																					return A2(vNarrowing, n.k8, n.dV);
																																				case 7:
																																					return vNotSlot;
																																				case 8:
																																					return vOccurs;
																																				case 9:
																																					var name = problem.a;
																																					return vUnknownFunction(name);
																																				case 10:
																																					var name = problem.a;
																																					return vUnknownSelector(name);
																																				case 11:
																																					return vUnresolved;
																																				case 12:
																																					return vTooComplex;
																																				case 13:
																																					var b = problem.a;
																																					return vBadPath(b.gL);
																																				case 14:
																																					var w = problem.a;
																																					return A3(vWrongArity, w.iY, w.dV, w.e2);
																																				default:
																																					var n = problem.a;
																																					return A2(vNullableKey, n.jn, n.kK);
																																			}
																																		};
																																	};
																																};
																															};
																														};
																													};
																												};
																											};
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		}))))))))))))))))));
var $author$project$Typesystem$Wire$Diagnostic$problemCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Problem',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$problemDefinition;
	});
var $author$project$Typesystem$Wire$Diagnostic$diagnosticDefinition = A2(
	$author$project$Typesystem$Wire$Codec$validate,
	function (d) {
		return _Utils_eq(
			d.ir,
			$author$project$Typesystem$Diagnostic$code(d.j9)) ? $elm$core$Result$Ok(d) : $elm$core$Result$Err('code \"' + (d.ir + '\" does not match the problem'));
	},
	$author$project$Typesystem$Wire$Codec$buildObject(
		A4(
			$author$project$Typesystem$Wire$Codec$optionalField,
			'fix',
			function ($) {
				return $.iS;
			},
			$author$project$Typesystem$Wire$Diagnostic$fixCodec,
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'problem',
				function ($) {
					return $.j9;
				},
				$author$project$Typesystem$Wire$Diagnostic$problemCodec,
				A4(
					$author$project$Typesystem$Wire$Codec$field,
					'code',
					function ($) {
						return $.ir;
					},
					$author$project$Typesystem$Wire$Codec$string,
					A4(
						$author$project$Typesystem$Wire$Codec$field,
						'path',
						function ($) {
							return $.gL;
						},
						$author$project$Typesystem$Wire$Surface$pathCodec,
						A4(
							$author$project$Typesystem$Wire$Codec$field,
							'node',
							function ($) {
								return $.jG;
							},
							$author$project$Typesystem$Wire$Id$structural,
							$author$project$Typesystem$Wire$Codec$object(
								F5(
									function (node, path, code, problem, fix) {
										return {ir: code, iS: fix, jG: node, gL: path, j9: problem};
									})))))))));
var $author$project$Typesystem$Wire$Diagnostic$diagnosticCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Diagnostic',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$diagnosticDefinition;
	});
var $author$project$Typesystem$Wire$Diagnostic$nodeDict = function (inner) {
	return A2(
		$author$project$Typesystem$Wire$Codec$validate,
		function (d) {
			var _v0 = A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Typesystem$Wire$Id$isStructural),
				$elm$core$Dict$keys(d));
			if (!_v0.b) {
				return $elm$core$Result$Ok(d);
			} else {
				var bad = _v0.a;
				return $elm$core$Result$Err('invalid node id \"' + (bad + '\"'));
			}
		},
		$author$project$Typesystem$Wire$Codec$dict(inner));
};
var $author$project$Typesystem$Wire$Diagnostic$nodeList = $author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Id$structural);
var $author$project$Typesystem$Types$Origin = F2(
	function (node, slot) {
		return {jG: node, g6: slot};
	});
var $author$project$Typesystem$Wire$Diagnostic$originCodec = $author$project$Typesystem$Wire$Codec$buildObject(
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'slot',
		function ($) {
			return $.g6;
		},
		$author$project$Typesystem$Wire$Codec$string,
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'node',
			function ($) {
				return $.jG;
			},
			$author$project$Typesystem$Wire$Codec$string,
			$author$project$Typesystem$Wire$Codec$object($author$project$Typesystem$Types$Origin))));
var $author$project$Typesystem$Wire$Diagnostic$parseVar = function (key) {
	return ((key !== '') && (A2($elm$core$String$all, $elm$core$Char$isDigit, key) && ((key === '0') || (!A2($elm$core$String$startsWith, '0', key))))) ? $elm$core$String$toInt(key) : $elm$core$Maybe$Nothing;
};
var $author$project$Typesystem$Wire$Diagnostic$varDict = function () {
	var _v0 = $author$project$Typesystem$Wire$Codec$dict($author$project$Typesystem$Wire$Diagnostic$originCodec);
	var c = _v0;
	return {
		c: A2(
			$elm$json$Json$Decode$andThen,
			function (d) {
				var parsed = A2(
					$elm$core$List$map,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						return A2(
							$elm$core$Maybe$map,
							function (n) {
								return _Utils_Tuple2(n, v);
							},
							$author$project$Typesystem$Wire$Diagnostic$parseVar(k));
					},
					$elm$core$Dict$toList(d));
				return A2(
					$elm$core$List$any,
					$elm$core$Basics$eq($elm$core$Maybe$Nothing),
					parsed) ? $elm$json$Json$Decode$fail('an origin key is a variable id (a non-negative integer)') : $elm$json$Json$Decode$succeed(
					$elm$core$Dict$fromList(
						A2($elm$core$List$filterMap, $elm$core$Basics$identity, parsed)));
			},
			c.c),
		d: function (d) {
			return c.d(
				$elm$core$Dict$fromList(
					A2(
						$elm$core$List$map,
						function (_v2) {
							var k = _v2.a;
							var v = _v2.b;
							return _Utils_Tuple2(
								$elm$core$String$fromInt(k),
								v);
						},
						$elm$core$Dict$toList(d))));
		},
		e: c.e
	};
}();
var $author$project$Typesystem$Wire$Diagnostic$originsDefinition = $author$project$Typesystem$Wire$Codec$buildObject(
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'types',
		function ($) {
			return $.ho;
		},
		$author$project$Typesystem$Wire$Diagnostic$varDict,
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'axes',
			function ($) {
				return $.e9;
			},
			$author$project$Typesystem$Wire$Diagnostic$varDict,
			$author$project$Typesystem$Wire$Codec$object(
				F2(
					function (axes, types) {
						return {e9: axes, ho: types};
					})))));
var $author$project$Typesystem$Wire$Diagnostic$originsCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'Origins',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$originsDefinition;
	});
var $author$project$Typesystem$Wire$Diagnostic$partialFields = A4(
	$author$project$Typesystem$Wire$Codec$field,
	'origins',
	function ($) {
		return $.aa;
	},
	$author$project$Typesystem$Wire$Diagnostic$originsCodec,
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'staleChoices',
		function ($) {
			return $.eN;
		},
		$author$project$Typesystem$Wire$Diagnostic$nodeList,
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'choices',
			function ($) {
				return $.U;
			},
			$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Diagnostic$choicePointCodec),
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'diagnostics',
				function ($) {
					return $.cf;
				},
				$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Diagnostic$diagnosticCodec),
				A4(
					$author$project$Typesystem$Wire$Codec$field,
					'annotations',
					function ($) {
						return $.e7;
					},
					$author$project$Typesystem$Wire$Diagnostic$nodeDict($author$project$Typesystem$Wire$Diagnostic$annotationCodec),
					A4(
						$author$project$Typesystem$Wire$Codec$optionalField,
						'type',
						function ($) {
							return $.dy;
						},
						$author$project$Typesystem$Wire$Type$openCodec,
						$author$project$Typesystem$Wire$Codec$object(
							F6(
								function (type_, annotations, diagnostics, choices, staleChoices, origins) {
									return {e7: annotations, U: choices, cf: diagnostics, aa: origins, eN: staleChoices, dy: type_};
								}))))))));
var $author$project$Typesystem$Wire$Diagnostic$rejectedFields = A4(
	$author$project$Typesystem$Wire$Codec$field,
	'origins',
	function ($) {
		return $.aa;
	},
	$author$project$Typesystem$Wire$Diagnostic$originsCodec,
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'annotations',
		function ($) {
			return $.e7;
		},
		$author$project$Typesystem$Wire$Diagnostic$nodeDict($author$project$Typesystem$Wire$Diagnostic$annotationCodec),
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'diagnostics',
			function ($) {
				return $.cf;
			},
			$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Diagnostic$diagnosticCodec),
			$author$project$Typesystem$Wire$Codec$object(
				F3(
					function (diagnostics, annotations, origins) {
						return {e7: annotations, cf: diagnostics, aa: origins};
					})))));
var $author$project$Typesystem$Wire$Type$axisCodec = function () {
	var _v0 = $author$project$Typesystem$Wire$Type$openAxisCodec;
	var c = _v0;
	return {
		c: A2(
			$elm$json$Json$Decode$andThen,
			function (axis) {
				if (!axis.$) {
					var id = axis.a;
					return $elm$json$Json$Decode$succeed(
						$author$project$Typesystem$Types$Axis(id));
				} else {
					return $elm$json$Json$Decode$fail('axis variable in a ground axis');
				}
			},
			c.c),
		d: function (axis) {
			return c.d(
				$author$project$Typesystem$Types$openAxis(axis));
		},
		e: c.e
	};
}();
var $author$project$Typesystem$Wire$Diagnostic$groundAnnotationCodec = A2($author$project$Typesystem$Wire$Diagnostic$annotationWith, $author$project$Typesystem$Wire$Type$groundCodec, $author$project$Typesystem$Wire$Type$axisCodec);
var $author$project$Typesystem$Wire$Diagnostic$summaryFields = A4(
	$author$project$Typesystem$Wire$Codec$field,
	'staleChoices',
	function ($) {
		return $.eN;
	},
	$author$project$Typesystem$Wire$Diagnostic$nodeList,
	A4(
		$author$project$Typesystem$Wire$Codec$field,
		'annotations',
		function ($) {
			return $.e7;
		},
		$author$project$Typesystem$Wire$Diagnostic$nodeDict($author$project$Typesystem$Wire$Diagnostic$groundAnnotationCodec),
		A4(
			$author$project$Typesystem$Wire$Codec$field,
			'choices',
			function ($) {
				return $.U;
			},
			$author$project$Typesystem$Wire$Codec$list($author$project$Typesystem$Wire$Diagnostic$choicePointCodec),
			A4(
				$author$project$Typesystem$Wire$Codec$field,
				'type',
				function ($) {
					return $.dy;
				},
				$author$project$Typesystem$Wire$Type$groundCodec,
				$author$project$Typesystem$Wire$Codec$object(
					F4(
						function (type_, choices, annotations, staleChoices) {
							return {e7: annotations, U: choices, eN: staleChoices, dy: type_};
						}))))));
var $author$project$Typesystem$Wire$Diagnostic$checkResultDefinition = $author$project$Typesystem$Wire$Codec$buildCustom(
	A4(
		$author$project$Typesystem$Wire$Codec$namedVariantObject,
		'partial',
		$author$project$Typesystem$Wire$Diagnostic$CheckPartial,
		$author$project$Typesystem$Wire$Diagnostic$partialFields,
		A4(
			$author$project$Typesystem$Wire$Codec$namedVariantObject,
			'err',
			$author$project$Typesystem$Wire$Diagnostic$CheckErr,
			$author$project$Typesystem$Wire$Diagnostic$rejectedFields,
			A4(
				$author$project$Typesystem$Wire$Codec$namedVariantObject,
				'ok',
				$author$project$Typesystem$Wire$Diagnostic$CheckOk,
				$author$project$Typesystem$Wire$Diagnostic$summaryFields,
				A2(
					$author$project$Typesystem$Wire$Codec$custom,
					'kind',
					F4(
						function (vOk, vErr, vPartial, result) {
							switch (result.$) {
								case 0:
									var summary = result.a;
									return vOk(summary);
								case 1:
									var rejected = result.a;
									return vErr(rejected);
								default:
									var partial = result.a;
									return vPartial(partial);
							}
						}))))));
var $author$project$Typesystem$Wire$Diagnostic$checkResultCodec = A2(
	$author$project$Typesystem$Wire$Codec$ref,
	'CheckResult',
	function (_v0) {
		return $author$project$Typesystem$Wire$Diagnostic$checkResultDefinition;
	});
var $author$project$Typesystem$Surface$childAt = F2(
	function (step, surface) {
		var _v0 = _Utils_Tuple2(step, surface);
		_v0$9:
		while (true) {
			switch (_v0.b.$) {
				case 2:
					if (!_v0.a.$) {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						var target = _v2.b;
						return $elm$core$Maybe$Just(target);
					} else {
						break _v0$9;
					}
				case 3:
					if (_v0.a.$ === 1) {
						var i = _v0.a.a;
						var _v3 = _v0.b;
						var args = _v3.c;
						return A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.hp;
							},
							$elm$core$List$head(
								A2($elm$core$List$drop, i, args)));
					} else {
						break _v0$9;
					}
				case 4:
					switch (_v0.a.$) {
						case 2:
							var _v4 = _v0.a;
							var _v5 = _v0.b;
							var x = _v5.b;
							return $elm$core$Maybe$Just(x);
						case 3:
							var _v6 = _v0.a;
							var _v7 = _v0.b;
							var f = _v7.c;
							return $elm$core$Maybe$Just(f);
						default:
							break _v0$9;
					}
				case 5:
					switch (_v0.a.$) {
						case 4:
							var _v8 = _v0.a;
							var _v9 = _v0.b;
							var f = _v9.b;
							return $elm$core$Maybe$Just(f);
						case 5:
							var _v10 = _v0.a;
							var _v11 = _v0.b;
							var g = _v11.c;
							return $elm$core$Maybe$Just(g);
						default:
							break _v0$9;
					}
				case 6:
					if (_v0.a.$ === 6) {
						var i = _v0.a.a;
						var _v12 = _v0.b;
						var items = _v12.b;
						return $elm$core$List$head(
							A2($elm$core$List$drop, i, items));
					} else {
						break _v0$9;
					}
				case 7:
					if (_v0.a.$ === 7) {
						var i = _v0.a.a;
						var _v13 = _v0.b;
						var fields = _v13.b;
						return A2(
							$elm$core$Maybe$map,
							$elm$core$Tuple$second,
							$elm$core$List$head(
								A2($elm$core$List$drop, i, fields)));
					} else {
						break _v0$9;
					}
				case 8:
					if (_v0.a.$ === 8) {
						var i = _v0.a.a;
						var _v14 = _v0.b;
						var parts = _v14.b;
						var _v15 = $elm$core$List$head(
							A2($elm$core$List$drop, i, parts));
						if ((!_v15.$) && (_v15.a.$ === 1)) {
							var x = _v15.a.a;
							return $elm$core$Maybe$Just(x);
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$9;
					}
				default:
					break _v0$9;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Typesystem$Surface$at = F2(
	function (path, surface) {
		if (!path.b) {
			return $elm$core$Maybe$Just(surface);
		} else {
			var step = path.a;
			var rest = path.b;
			return A2(
				$elm$core$Maybe$andThen,
				$author$project$Typesystem$Surface$at(rest),
				A2($author$project$Typesystem$Surface$childAt, step, surface));
		}
	});
var $author$project$Try$nodeSurface = F2(
	function (node, surface) {
		return A2(
			$elm$core$Maybe$andThen,
			function (path) {
				return A2($author$project$Typesystem$Surface$at, path, surface);
			},
			A2($author$project$Typesystem$Surface$pathTo, node, surface));
	});
var $author$project$Try$Pretty$stepToString = function (step) {
	switch (step.$) {
		case 0:
			return 'target';
		case 1:
			var i = step.a;
			return 'arg[' + ($elm$core$String$fromInt(i) + ']');
		case 2:
			return 'input';
		case 3:
			return 'function';
		case 4:
			return 'first';
		case 5:
			return 'second';
		case 6:
			var i = step.a;
			return 'item[' + ($elm$core$String$fromInt(i) + ']');
		case 7:
			var i = step.a;
			return 'entry[' + ($elm$core$String$fromInt(i) + ']');
		default:
			var i = step.a;
			return 'part[' + ($elm$core$String$fromInt(i) + ']');
	}
};
var $author$project$Try$Pretty$pathToString = function (path) {
	if (!path.b) {
		return '(root)';
	} else {
		return A2(
			$elm$core$String$join,
			'.',
			A2($elm$core$List$map, $author$project$Try$Pretty$stepToString, path));
	}
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Try$Pretty$refName = F2(
	function (env, ref) {
		if (!ref.$) {
			var id = ref.a;
			return A2($author$project$Typesystem$Env$nameOf, env, id);
		} else {
			var name = ref.a;
			return name;
		}
	});
var $author$project$Try$Pretty$showSurface = F2(
	function (env, surface) {
		var isSymbol = function (name) {
			return (name !== '') && (!A2(
				$elm$core$String$all,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || (c === '_');
				},
				name));
		};
		var go = $author$project$Try$Pretty$showSurface(env);
		var operand = function (x) {
			switch (x.$) {
				case 4:
					return '(' + (go(x) + ')');
				case 5:
					return '(' + (go(x) + ')');
				default:
					return go(x);
			}
		};
		var call = F2(
			function (ref, args) {
				return '(' + (A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(''),
						A2(
							$elm$core$List$cons,
							A2($author$project$Try$Pretty$refName, env, ref),
							_List_fromArray(
								[
									A2(
									$elm$core$String$join,
									', ',
									A2(
										$elm$core$List$map,
										A2(
											$elm$core$Basics$composeR,
											function ($) {
												return $.hp;
											},
											go),
										args))
								])))) + ')');
			});
		switch (surface.$) {
			case 0:
				var v = surface.b;
				return A2($author$project$Try$Pretty$showValue, env, v);
			case 1:
				var ref = surface.b;
				return A2($author$project$Try$Pretty$refName, env, ref);
			case 2:
				var target = surface.b;
				var ref = surface.c;
				return operand(target) + ('.' + A2($author$project$Try$Pretty$refName, env, ref));
			case 3:
				if ((surface.c.b && surface.c.b.b) && (!surface.c.b.b.b)) {
					var ref = surface.b;
					var _v1 = surface.c;
					var l = _v1.a;
					var _v2 = _v1.b;
					var r = _v2.a;
					return isSymbol(
						A2($author$project$Try$Pretty$refName, env, ref)) ? ('(' + (operand(l.hp) + (' ' + (A2($author$project$Try$Pretty$refName, env, ref) + (' ' + (operand(r.hp) + ')')))))) : A2(
						call,
						ref,
						_List_fromArray(
							[l, r]));
				} else {
					var ref = surface.b;
					var args = surface.c;
					return A2(call, ref, args);
				}
			case 4:
				var input = surface.b;
				var f = surface.c;
				return go(input) + (' |> ' + go(f));
			case 5:
				var f = surface.b;
				var g = surface.c;
				return go(f) + (' >> ' + go(g));
			case 6:
				var items = surface.b;
				return '[' + (A2(
					$elm$core$String$join,
					', ',
					A2($elm$core$List$map, go, items)) + ']');
			case 7:
				var entries = surface.b;
				return '{' + (A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v3) {
							var k = _v3.a;
							var v = _v3.b;
							return A2($author$project$Try$Pretty$refName, env, k) + (': ' + go(v));
						},
						entries)) + '}');
			case 8:
				var parts = surface.b;
				return '`' + ($elm$core$String$concat(
					A2(
						$elm$core$List$map,
						function (part) {
							if (!part.$) {
								var s = part.a;
								return s;
							} else {
								var x = part.a;
								return '${' + (go(x) + '}');
							}
						},
						parts)) + '`');
			case 9:
				return '_';
			case 10:
				var v = surface.b;
				return v.kL;
			default:
				return '▮';
		}
	});
var $author$project$Try$choiceJson = F3(
	function (env, surface, point) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'node',
					$elm$json$Json$Encode$string(point.jG)),
					_Utils_Tuple2(
					'path',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2($elm$core$Basics$composeR, $author$project$Try$Pretty$pathToString, $elm$json$Json$Encode$string),
							A2($author$project$Typesystem$Surface$pathTo, point.jG, surface)))),
					_Utils_Tuple2(
					'at',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$Try$Pretty$showSurface(env),
								$elm$json$Json$Encode$string),
							A2($author$project$Try$nodeSurface, point.jG, surface)))),
					_Utils_Tuple2(
					'options',
					A2(
						$elm$json$Json$Encode$list,
						function (option) {
							return $elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'label',
										$elm$json$Json$Encode$string(
											A3($author$project$Try$Pretty$showType, env, $elm$core$Basics$never, option.dy))),
										_Utils_Tuple2(
										'key',
										$elm$json$Json$Encode$string(option.jn))
									]));
						},
						point.jZ))
				]));
	});
var $author$project$Try$Pretty$varName = function (n) {
	return '?' + $elm$core$String$fromInt(n);
};
var $author$project$Try$Pretty$problemMessage = F2(
	function (env, diagnostic) {
		var ty = A2($author$project$Try$Pretty$showType, env, $author$project$Try$Pretty$varName);
		var base = function () {
			var _v1 = diagnostic.j9;
			switch (_v1.$) {
				case 0:
					var t = _v1.a;
					return 'expected ' + (ty(t.dV) + (', got ' + ty(t.e2)));
				case 1:
					var name = _v1.a;
					return 'unknown name `' + (name + '`');
				case 2:
					var a = _v1.a;
					return 'ambiguous name `' + (a.jD + ('` (candidates: ' + (A2($elm$core$String$join, ', ', a.ic) + ')')));
				case 3:
					var name = _v1.a;
					return 'ambiguous arguments to `' + (name + '`');
				case 4:
					return 'missing expression (an unfilled hole)';
				case 5:
					return 'cannot mix list and dict frames here';
				case 6:
					var n = _v1.a;
					return 'value of type ' + (ty(n.k8) + (' must be narrowed to ' + (ty(n.dV) + ' first (asNumber, asText, asBool or asDate)')));
				case 7:
					return 'this argument is not a function slot';
				case 8:
					return 'infinite type (occurs check)';
				case 9:
					var name = _v1.a;
					return 'unknown function `' + (name + '`');
				case 10:
					var name = _v1.a;
					return 'unknown selector `' + (name + '`');
				case 11:
					return 'type could not be determined';
				case 12:
					return 'expression too complex to check within the budget';
				case 14:
					var a = _v1.a;
					return '`' + (a.iY + ('` takes ' + (A2(
						$elm$core$String$join,
						' or ',
						A2($elm$core$List$map, $elm$core$String$fromInt, a.dV)) + (' argument(s), got ' + $elm$core$String$fromInt(a.e2)))));
				case 15:
					var k = _v1.a;
					return 'group key `' + (k.jn + ('` can be missing; give a default: ' + k.kK));
				default:
					var p = _v1.a;
					return 'bad path ' + p.gL;
			}
		}();
		var _v0 = diagnostic.iS;
		if (!_v0.$) {
			var mapping = _v0.a;
			return base + (' (fix: map ' + (ty(mapping.iW) + (' to ' + (ty(mapping.k3) + ')'))));
		} else {
			return base;
		}
	});
var $author$project$Try$diagnosticJson = F3(
	function (env, surface, diagnostic) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'code',
					$elm$json$Json$Encode$string(diagnostic.ir)),
					_Utils_Tuple2(
					'message',
					$elm$json$Json$Encode$string(
						A2($author$project$Try$Pretty$problemMessage, env, diagnostic))),
					_Utils_Tuple2(
					'path',
					$elm$json$Json$Encode$string(
						$author$project$Try$Pretty$pathToString(diagnostic.gL))),
					_Utils_Tuple2(
					'at',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$Try$Pretty$showSurface(env),
								$elm$json$Json$Encode$string),
							A2($author$project$Typesystem$Surface$at, diagnostic.gL, surface)))),
					_Utils_Tuple2(
					'node',
					$elm$json$Json$Encode$string(diagnostic.jG))
				]));
	});
var $author$project$Try$docJson = function (doc) {
	if (!doc.$) {
		var text = doc.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'line',
					$elm$json$Json$Encode$string(text))
				]));
	} else {
		var head = doc.a;
		var rows = doc.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'head',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, head)),
					_Utils_Tuple2(
					'rows',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$list($elm$json$Json$Encode$string),
						rows))
				]));
	}
};
var $author$project$Typesystem$Wire$Data$encode = F3(
	function (env, type_, value) {
		encode:
		while (true) {
			var _v0 = _Utils_Tuple2(
				A2($author$project$Typesystem$Wire$Data$form, env, type_),
				value);
			_v0$13:
			while (true) {
				switch (_v0.a.$) {
					case 0:
						if (!_v0.b.$) {
							var _v1 = _v0.a;
							return $author$project$Typesystem$Wire$Data$scalar(value);
						} else {
							break _v0$13;
						}
					case 1:
						if (_v0.b.$ === 1) {
							var _v2 = _v0.a;
							return $author$project$Typesystem$Wire$Data$scalar(value);
						} else {
							break _v0$13;
						}
					case 2:
						if (_v0.b.$ === 2) {
							var _v3 = _v0.a;
							return $author$project$Typesystem$Wire$Data$scalar(value);
						} else {
							break _v0$13;
						}
					case 3:
						if (_v0.b.$ === 3) {
							var _v4 = _v0.a;
							return $author$project$Typesystem$Wire$Data$scalar(value);
						} else {
							break _v0$13;
						}
					case 4:
						if (_v0.b.$ === 8) {
							var _v5 = _v0.a;
							var _v6 = _v0.b;
							return $elm$json$Json$Encode$null;
						} else {
							break _v0$13;
						}
					case 5:
						var literal = _v0.a.a;
						return A2($author$project$Typesystem$Semantics$equal, literal, value) ? $author$project$Typesystem$Wire$Data$scalar(value) : $author$project$Typesystem$Wire$Data$tagged(value);
					case 6:
						var _v7 = _v0.a;
						var literals = _v7.a;
						var hasEmpty = _v7.b;
						return (_Utils_eq(value, $author$project$Typesystem$Value$VEmpty) && hasEmpty) ? $elm$json$Json$Encode$null : (A2(
							$elm$core$List$any,
							$author$project$Typesystem$Semantics$equal(value),
							literals) ? $author$project$Typesystem$Wire$Data$scalar(value) : $author$project$Typesystem$Wire$Data$tagged(value));
					case 7:
						if (_v0.b.$ === 8) {
							var _v8 = _v0.b;
							return $elm$json$Json$Encode$null;
						} else {
							var inner = _v0.a.a;
							var $temp$env = env,
								$temp$type_ = inner,
								$temp$value = value;
							env = $temp$env;
							type_ = $temp$type_;
							value = $temp$value;
							continue encode;
						}
					case 8:
						if (_v0.b.$ === 4) {
							var fieldTypes = _v0.a.a;
							var fields = _v0.b.a;
							return _Utils_eq(
								$elm$core$Dict$keys(fieldTypes),
								$elm$core$Dict$keys(fields)) ? $elm$json$Json$Encode$object(
								A2(
									$elm$core$List$map,
									function (_v9) {
										var id = _v9.a;
										var fieldType = _v9.b;
										return _Utils_Tuple2(
											id,
											A3(
												$author$project$Typesystem$Wire$Data$encode,
												env,
												fieldType,
												A2(
													$elm$core$Maybe$withDefault,
													$author$project$Typesystem$Value$VEmpty,
													A2($elm$core$Dict$get, id, fields))));
									},
									$elm$core$Dict$toList(fieldTypes))) : $author$project$Typesystem$Wire$Data$tagged(value);
						} else {
							break _v0$13;
						}
					case 9:
						if (_v0.b.$ === 5) {
							var variants = _v0.a.a;
							var _v10 = _v0.b;
							var tag = _v10.a;
							var payload = _v10.b;
							var _v11 = _Utils_Tuple2(
								A2($author$project$Typesystem$Wire$Data$variantPayload, tag, variants),
								payload);
							_v11$2:
							while (true) {
								if (!_v11.a.$) {
									if (_v11.a.a.$ === 1) {
										if (_v11.b.$ === 1) {
											var _v12 = _v11.a.a;
											var _v13 = _v11.b;
											return $elm$json$Json$Encode$object(
												_List_fromArray(
													[
														_Utils_Tuple2(
														'tag',
														$elm$json$Json$Encode$string(tag))
													]));
										} else {
											break _v11$2;
										}
									} else {
										if (!_v11.b.$) {
											var payloadType = _v11.a.a.a;
											var inner = _v11.b.a;
											return $elm$json$Json$Encode$object(
												_List_fromArray(
													[
														_Utils_Tuple2(
														'tag',
														$elm$json$Json$Encode$string(tag)),
														_Utils_Tuple2(
														'payload',
														A3($author$project$Typesystem$Wire$Data$encode, env, payloadType, inner))
													]));
										} else {
											break _v11$2;
										}
									}
								} else {
									break _v11$2;
								}
							}
							return $author$project$Typesystem$Wire$Data$tagged(value);
						} else {
							break _v0$13;
						}
					case 10:
						if (_v0.b.$ === 6) {
							var cell = _v0.a.a;
							var items = _v0.b.a;
							return A2(
								$elm$json$Json$Encode$list,
								A2($author$project$Typesystem$Wire$Data$encode, env, cell),
								items);
						} else {
							break _v0$13;
						}
					case 11:
						if (_v0.b.$ === 7) {
							var _v14 = _v0.a;
							var keyType = _v14.a;
							var cell = _v14.b;
							var entries = _v0.b.a;
							return A2(
								$elm$json$Json$Encode$list,
								function (_v15) {
									var k = _v15.a;
									var v = _v15.b;
									return A2(
										$elm$json$Json$Encode$list,
										$elm$core$Basics$identity,
										_List_fromArray(
											[
												A3($author$project$Typesystem$Wire$Data$encode, env, keyType, k),
												A3($author$project$Typesystem$Wire$Data$encode, env, cell, v)
											]));
								},
								entries);
						} else {
							break _v0$13;
						}
					default:
						break _v0$13;
				}
			}
			return $author$project$Typesystem$Wire$Data$tagged(value);
		}
	});
var $author$project$Typesystem$Prims$Fn = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Eval$MissingAt = function (a) {
	return {$: 4, a: a};
};
var $author$project$Typesystem$Eval$TypeFault = function (a) {
	return {$: 3, a: a};
};
var $author$project$Typesystem$Eval$UnboundBinder = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Eval$UnknownObject = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Eval$UnknownPrim = function (a) {
	return {$: 2, a: a};
};
var $author$project$Typesystem$Prims$Val = function (a) {
	return {$: 0, a: a};
};
var $author$project$Typesystem$Algebra$padValue = function (alignment) {
	if (alignment.$ === 2) {
		var v = alignment.a;
		return v;
	} else {
		return $author$project$Typesystem$Value$VEmpty;
	}
};
var $author$project$Typesystem$Algebra$alignDicts = F2(
	function (alignment, dicts) {
		var lookup = F2(
			function (k, entries) {
				return A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$second,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (_v1) {
								var k2 = _v1.a;
								return A2($author$project$Typesystem$Semantics$equal, k, k2);
							},
							entries)));
			});
		var allKeys = A2(
			$elm$core$List$sortWith,
			$author$project$Typesystem$Semantics$compare,
			A3(
				$elm$core$List$foldl,
				F2(
					function (k, acc) {
						return A2(
							$elm$core$List$any,
							$author$project$Typesystem$Semantics$equal(k),
							acc) ? acc : _Utils_ap(
							acc,
							_List_fromArray(
								[k]));
					}),
				_List_Nil,
				A2(
					$elm$core$List$concatMap,
					$elm$core$List$map($elm$core$Tuple$first),
					dicts)));
		var keys = function () {
			if (alignment.$ === 1) {
				return A2(
					$elm$core$List$filter,
					function (k) {
						return A2(
							$elm$core$List$all,
							function (d) {
								return !_Utils_eq(
									A2(lookup, k, d),
									$elm$core$Maybe$Nothing);
							},
							dicts);
					},
					allKeys);
			} else {
				return allKeys;
			}
		}();
		return A2(
			$elm$core$List$map,
			function (k) {
				return _Utils_Tuple2(
					k,
					A2(
						$elm$core$List$map,
						function (d) {
							return A2(
								$elm$core$Maybe$withDefault,
								$author$project$Typesystem$Algebra$padValue(alignment),
								A2(lookup, k, d));
						},
						dicts));
			},
			keys);
	});
var $author$project$Typesystem$Algebra$alignLists = F2(
	function (alignment, columns) {
		var lengths = A2($elm$core$List$map, $elm$core$List$length, columns);
		var n = function () {
			if (alignment.$ === 1) {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$List$minimum(lengths));
			} else {
				return A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$List$maximum(lengths));
			}
		}();
		var at = F2(
			function (i, col) {
				return A2(
					$elm$core$Maybe$withDefault,
					$author$project$Typesystem$Algebra$padValue(alignment),
					$elm$core$List$head(
						A2($elm$core$List$drop, i, col)));
			});
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$elm$core$List$map,
					at(i),
					columns);
			},
			A2($elm$core$List$range, 0, n - 1));
	});
var $author$project$Typesystem$Eval$traverse = function (f) {
	return A2(
		$elm$core$List$foldr,
		F2(
			function (x, acc) {
				return A3(
					$elm$core$Result$map2,
					$elm$core$List$cons,
					f(x),
					acc);
			}),
		$elm$core$Result$Ok(_List_Nil));
};
var $author$project$Typesystem$Eval$flatten = F2(
	function (k, v) {
		if (k <= 0) {
			return $elm$core$Result$Ok(
				_List_fromArray(
					[v]));
		} else {
			switch (v.$) {
				case 6:
					var items = v.a;
					return A2(
						$elm$core$Result$map,
						$elm$core$List$concat,
						A2(
							$author$project$Typesystem$Eval$traverse,
							$author$project$Typesystem$Eval$flatten(k - 1),
							items));
				case 7:
					var entries = v.a;
					return A2(
						$elm$core$Result$map,
						$elm$core$List$concat,
						A2(
							$author$project$Typesystem$Eval$traverse,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$second,
								$author$project$Typesystem$Eval$flatten(k - 1)),
							entries));
				case 8:
					return $elm$core$Result$Ok(_List_Nil);
				default:
					return $elm$core$Result$Err(
						$author$project$Typesystem$Eval$TypeFault('flatten of a non-frame value'));
			}
		}
	});
var $author$project$Typesystem$Eval$keyAt = F2(
	function (path, row) {
		if (!path.b) {
			return $elm$core$Result$Ok(row);
		} else {
			var f = path.a;
			var rest = path.b;
			switch (row.$) {
				case 4:
					var fields = row.a;
					return A2(
						$author$project$Typesystem$Eval$keyAt,
						rest,
						A2(
							$elm$core$Maybe$withDefault,
							$author$project$Typesystem$Value$VEmpty,
							A2($elm$core$Dict$get, f, fields)));
				case 8:
					return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
				default:
					return $elm$core$Result$Err(
						$author$project$Typesystem$Eval$TypeFault('group by field ' + (f + ' on a non-record')));
			}
		}
	});
var $author$project$Typesystem$Eval$nonEmptyKey = F2(
	function (_default, key) {
		var _v0 = _Utils_Tuple2(key, _default);
		if (_v0.a.$ === 8) {
			if (!_v0.b.$) {
				var _v1 = _v0.a;
				var d = _v0.b.a;
				return $elm$core$Result$Ok(d);
			} else {
				var _v2 = _v0.a;
				var _v3 = _v0.b;
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$TypeFault('group by a field that is Empty: no dict key can be Empty'));
			}
		} else {
			return $elm$core$Result$Ok(key);
		}
	});
var $author$project$Typesystem$Eval$groupByField = F3(
	function (_default, path, v) {
		if (v.$ === 6) {
			var rows = v.a;
			return A2(
				$elm$core$Result$map,
				function (keyed) {
					return $author$project$Typesystem$Semantics$dictFromList(
						A2(
							$elm$core$List$map,
							$elm$core$Tuple$mapSecond($author$project$Typesystem$Value$VList),
							A3(
								$elm$core$List$foldl,
								F2(
									function (_v1, acc) {
										var row = _v1.a;
										var key = _v1.b;
										return A2(
											$elm$core$List$any,
											function (_v2) {
												var k = _v2.a;
												return A2($author$project$Typesystem$Semantics$equal, k, key);
											},
											acc) ? A2(
											$elm$core$List$map,
											function (_v3) {
												var k = _v3.a;
												var rs = _v3.b;
												return A2($author$project$Typesystem$Semantics$equal, k, key) ? _Utils_Tuple2(
													k,
													_Utils_ap(
														rs,
														_List_fromArray(
															[row]))) : _Utils_Tuple2(k, rs);
											},
											acc) : _Utils_ap(
											acc,
											_List_fromArray(
												[
													_Utils_Tuple2(
													key,
													_List_fromArray(
														[row]))
												]));
									}),
								_List_Nil,
								keyed)));
				},
				A2(
					$author$project$Typesystem$Eval$traverse,
					function (row) {
						return A2(
							$elm$core$Result$map,
							$elm$core$Tuple$pair(row),
							A2(
								$elm$core$Result$andThen,
								$author$project$Typesystem$Eval$nonEmptyKey(_default),
								A2($author$project$Typesystem$Eval$keyAt, path, row)));
					},
					rows));
		} else {
			return $elm$core$Result$Err(
				$author$project$Typesystem$Eval$TypeFault('group by field on a non-List value'));
		}
	});
var $author$project$Typesystem$Eval$mapFrame = F2(
	function (f, v) {
		switch (v.$) {
			case 6:
				var items = v.a;
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VList,
					A2($author$project$Typesystem$Eval$traverse, f, items));
			case 7:
				var entries = v.a;
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VDict,
					A2(
						$author$project$Typesystem$Eval$traverse,
						function (_v1) {
							var k = _v1.a;
							var x = _v1.b;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(k),
								f(x));
						},
						entries));
			case 8:
				return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
			default:
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$TypeFault('selector applied beneath a non-frame value'));
		}
	});
var $author$project$Typesystem$Eval$OuterDict = function (a) {
	return {$: 1, a: a};
};
var $author$project$Typesystem$Eval$OuterList = {$: 0};
var $author$project$Typesystem$Eval$asDict = function (v) {
	if (v.$ === 7) {
		var entries = v.a;
		return $elm$core$Result$Ok(entries);
	} else {
		return $elm$core$Result$Err(
			$author$project$Typesystem$Eval$TypeFault('lift over a non-Dict value'));
	}
};
var $author$project$Typesystem$Eval$asDictOrEmpty = function (v) {
	return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty) ? $elm$core$Result$Ok(_List_Nil) : A2(
		$elm$core$Result$mapError,
		function (_v0) {
			return $author$project$Typesystem$Eval$TypeFault('pivot expected a Dict frame');
		},
		$author$project$Typesystem$Eval$asDict(v));
};
var $author$project$Typesystem$Eval$asList = function (v) {
	if (v.$ === 6) {
		var items = v.a;
		return $elm$core$Result$Ok(items);
	} else {
		return $elm$core$Result$Err(
			$author$project$Typesystem$Eval$TypeFault('lift over a non-List value'));
	}
};
var $author$project$Typesystem$Eval$asListOrEmpty = function (v) {
	return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty) ? $elm$core$Result$Ok(_List_Nil) : A2(
		$elm$core$Result$mapError,
		function (_v0) {
			return $author$project$Typesystem$Eval$TypeFault('pivot expected a List frame');
		},
		$author$project$Typesystem$Eval$asList(v));
};
var $author$project$Typesystem$Eval$swapEntries = F4(
	function (align, tag, outer, inners) {
		var rewrap = function (column) {
			if (!outer.$) {
				return $author$project$Typesystem$Value$VList(column);
			} else {
				var keys = outer.a;
				return $author$project$Typesystem$Value$VDict(
					A3($elm$core$List$map2, $elm$core$Tuple$pair, keys, column));
			}
		};
		if (tag === 1) {
			return A2(
				$elm$core$Result$map,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Typesystem$Algebra$alignDicts(align),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(
							function (_v1) {
								var k = _v1.a;
								var column = _v1.b;
								return _Utils_Tuple2(
									k,
									rewrap(column));
							}),
						$author$project$Typesystem$Value$VDict)),
				A2($author$project$Typesystem$Eval$traverse, $author$project$Typesystem$Eval$asDictOrEmpty, inners));
		} else {
			return A2(
				$elm$core$Result$map,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Typesystem$Algebra$alignLists(align),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$map(rewrap),
						$author$project$Typesystem$Value$VList)),
				A2($author$project$Typesystem$Eval$traverse, $author$project$Typesystem$Eval$asListOrEmpty, inners));
		}
	});
var $author$project$Typesystem$Eval$swap = F3(
	function (align, tag, v) {
		switch (v.$) {
			case 8:
				return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
			case 6:
				var items = v.a;
				return A4($author$project$Typesystem$Eval$swapEntries, align, tag, $author$project$Typesystem$Eval$OuterList, items);
			case 7:
				var entries = v.a;
				return A4(
					$author$project$Typesystem$Eval$swapEntries,
					align,
					tag,
					$author$project$Typesystem$Eval$OuterDict(
						A2($elm$core$List$map, $elm$core$Tuple$first, entries)),
					A2($elm$core$List$map, $elm$core$Tuple$second, entries));
			default:
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$TypeFault('pivot of a non-frame value'));
		}
	});
var $author$project$Typesystem$Eval$pivot = F4(
	function (align, depth, tag, v) {
		return (depth <= 0) ? $elm$core$Result$Ok(v) : A2(
			$elm$core$Result$andThen,
			A2($author$project$Typesystem$Eval$swap, align, tag),
			A2(
				$author$project$Typesystem$Eval$mapFrame,
				A3($author$project$Typesystem$Eval$pivot, align, depth - 1, tag),
				v));
	});
var $author$project$Typesystem$Eval$applySelector = F3(
	function (align, selector, v) {
		switch (selector.$) {
			case 0:
				var depth = selector.a;
				var tag = selector.b;
				return A4($author$project$Typesystem$Eval$pivot, $author$project$Typesystem$Algebra$PadEmpty, depth, tag, v);
			case 1:
				var depth = selector.a;
				var tag = selector.b;
				return A4($author$project$Typesystem$Eval$pivot, align, depth, tag, v);
			case 2:
				var path = selector.a;
				return A3($author$project$Typesystem$Eval$groupByField, $elm$core$Maybe$Nothing, path, v);
			case 3:
				var path = selector.a;
				var _default = selector.b;
				return A3(
					$author$project$Typesystem$Eval$groupByField,
					$elm$core$Maybe$Just(_default),
					path,
					v);
			default:
				if (!selector.a) {
					return $elm$core$Result$Ok(v);
				} else {
					var k = selector.a;
					return A2(
						$elm$core$Result$map,
						$author$project$Typesystem$Value$VList,
						A2($author$project$Typesystem$Eval$flatten, k, v));
				}
		}
	});
var $author$project$Typesystem$Eval$mapUnder = F3(
	function (depth, f, v) {
		return (depth <= 0) ? f(v) : A2(
			$author$project$Typesystem$Eval$mapFrame,
			A2($author$project$Typesystem$Eval$mapUnder, depth - 1, f),
			v);
	});
var $author$project$Typesystem$Eval$applySelectors = F3(
	function (align, selectors, value) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, acc) {
					var depth = _v0.a;
					var selector = _v0.b;
					return A2(
						$elm$core$Result$andThen,
						A2(
							$author$project$Typesystem$Eval$mapUnder,
							depth,
							A2($author$project$Typesystem$Eval$applySelector, align, selector)),
						acc);
				}),
			$elm$core$Result$Ok(value),
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, selectors));
	});
var $author$project$Typesystem$Eval$asDictOr = F2(
	function (keys, v) {
		if (v.$ === 6) {
			var items = v.a;
			return $elm$core$Result$Ok(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, k) {
							return _Utils_Tuple2(
								k,
								A2(
									$elm$core$Maybe$withDefault,
									$author$project$Typesystem$Value$VEmpty,
									$elm$core$List$head(
										A2($elm$core$List$drop, i, items))));
						}),
					keys));
		} else {
			return $author$project$Typesystem$Eval$asDict(v);
		}
	});
var $author$project$Typesystem$Eval$errorToString = function (error) {
	switch (error.$) {
		case 0:
			var b = error.a;
			return 'unbound binder ' + b;
		case 1:
			var id = error.a;
			return 'unknown object ' + id;
		case 2:
			var id = error.a;
			return 'unknown primitive ' + id;
		case 3:
			var message = error.a;
			return message;
		default:
			var node = error.a;
			return 'missing node ' + node;
	}
};
var $author$project$Typesystem$Eval$field = F2(
	function (f, v) {
		switch (v.$) {
			case 4:
				var fields = v.a;
				return A2(
					$elm$core$Result$fromMaybe,
					$author$project$Typesystem$Eval$TypeFault('missing field ' + f),
					A2($elm$core$Dict$get, f, fields));
			case 8:
				return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
			default:
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$TypeFault('field ' + (f + ' on a non-record')));
		}
	});
var $author$project$Typesystem$Eval$keysOf = function (values) {
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				function (v) {
					if (v.$ === 7) {
						var entries = v.a;
						return $elm$core$Maybe$Just(
							A2($elm$core$List$map, $elm$core$Tuple$first, entries));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				values)));
};
var $author$project$Typesystem$Prims$add = F2(
	function (a, b) {
		var _v0 = _Utils_Tuple2(a, b);
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var x = _v0.a.a;
			var y = _v0.b.a;
			return $author$project$Typesystem$Value$VNumber(x + y);
		} else {
			return a;
		}
	});
var $author$project$Typesystem$Prims$value = F3(
	function (prim, key, args) {
		var _v0 = A2($elm$core$Dict$get, key, args);
		if (!_v0.$) {
			if (!_v0.a.$) {
				var v = _v0.a.a;
				return $elm$core$Result$Ok(v);
			} else {
				return $elm$core$Result$Err(prim + (': ' + (key + ' must be a value, not a function')));
			}
		} else {
			return $elm$core$Result$Err(prim + (': missing argument ' + key));
		}
	});
var $author$project$Typesystem$Prims$binary = F4(
	function (prim, check, f, args) {
		return A2(
			$elm$core$Result$andThen,
			function (_v0) {
				var l = _v0.a;
				var r = _v0.b;
				return A2(
					$elm$core$List$member,
					$author$project$Typesystem$Value$VEmpty,
					_List_fromArray(
						[l, r])) ? $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty) : A2(
					$elm$core$Result$mapError,
					function (e) {
						return prim + (': ' + e);
					},
					A3(
						$elm$core$Result$map2,
						f,
						check(l),
						check(r)));
			},
			A3(
				$elm$core$Result$map2,
				$elm$core$Tuple$pair,
				A3($author$project$Typesystem$Prims$value, prim, 'left', args),
				A3($author$project$Typesystem$Prims$value, prim, 'right', args)));
	});
var $author$project$Typesystem$Prims$bool = function (v) {
	if (v.$ === 2) {
		var b = v.a;
		return $elm$core$Result$Ok(b);
	} else {
		return $elm$core$Result$Err('expected a Bool');
	}
};
var $author$project$Typesystem$Prims$coalesce = function (args) {
	return A3(
		$elm$core$Result$map2,
		F2(
			function (x, _default) {
				return _Utils_eq(x, $author$project$Typesystem$Value$VEmpty) ? _default : x;
			}),
		A3($author$project$Typesystem$Prims$value, 'coalesce', 'x', args),
		A3($author$project$Typesystem$Prims$value, 'coalesce', 'default', args));
};
var $author$project$Typesystem$Prims$list = F3(
	function (prim, key, args) {
		return A2(
			$elm$core$Result$andThen,
			function (v) {
				switch (v.$) {
					case 6:
						var items = v.a;
						return $elm$core$Result$Ok(
							$elm$core$Maybe$Just(items));
					case 8:
						return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
					default:
						return $elm$core$Result$Err(prim + (': ' + (key + ' must be a List')));
				}
			},
			A3($author$project$Typesystem$Prims$value, prim, key, args));
	});
var $author$project$Typesystem$Prims$concatList = function (args) {
	return A2(
		$elm$core$Result$map,
		function (_v0) {
			var left = _v0.a;
			var right = _v0.b;
			return A2(
				$elm$core$Maybe$withDefault,
				$author$project$Typesystem$Value$VEmpty,
				A3(
					$elm$core$Maybe$map2,
					F2(
						function (l, r) {
							return $author$project$Typesystem$Value$VList(
								_Utils_ap(l, r));
						}),
					left,
					right));
		},
		A3(
			$elm$core$Result$map2,
			$elm$core$Tuple$pair,
			A3($author$project$Typesystem$Prims$list, 'concatList', 'left', args),
			A3($author$project$Typesystem$Prims$list, 'concatList', 'right', args)));
};
var $author$project$Typesystem$Prims$onList = F3(
	function (prim, impl, args) {
		return A2(
			$elm$core$Result$andThen,
			function (maybeItems) {
				if (maybeItems.$ === 1) {
					return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
				} else {
					var items = maybeItems.a;
					return A2(impl, items, args);
				}
			},
			A3($author$project$Typesystem$Prims$list, prim, 'list', args));
	});
var $author$project$Typesystem$Prims$contains = A2(
	$author$project$Typesystem$Prims$onList,
	'contains',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$map,
				function (x) {
					return $author$project$Typesystem$Value$VBool(
						A2(
							$elm$core$List$any,
							$author$project$Typesystem$Semantics$equal(x),
							items));
				},
				A3($author$project$Typesystem$Prims$value, 'contains', 'x', args));
		}));
var $author$project$Typesystem$Prims$function = F3(
	function (prim, key, args) {
		var _v0 = A2($elm$core$Dict$get, key, args);
		if (!_v0.$) {
			if (_v0.a.$ === 1) {
				var f = _v0.a.a;
				return $elm$core$Result$Ok(f);
			} else {
				return $elm$core$Result$Err(prim + (': ' + (key + ' must be a function')));
			}
		} else {
			return $elm$core$Result$Err(prim + (': missing argument ' + key));
		}
	});
var $author$project$Typesystem$Prims$traverse = function (f) {
	return A2(
		$elm$core$List$foldr,
		F2(
			function (x, acc) {
				return A3(
					$elm$core$Result$map2,
					$elm$core$List$cons,
					f(x),
					acc);
			}),
		$elm$core$Result$Ok(_List_Nil));
};
var $author$project$Typesystem$Prims$filter = A2(
	$author$project$Typesystem$Prims$onList,
	'filter',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$andThen,
				function (f) {
					return A2(
						$elm$core$Result$map,
						A2($elm$core$Basics$composeR, $elm$core$List$concat, $author$project$Typesystem$Value$VList),
						A2(
							$author$project$Typesystem$Prims$traverse,
							function (item) {
								return A2(
									$elm$core$Result$andThen,
									function (keep) {
										switch (keep.$) {
											case 2:
												if (keep.a) {
													return $elm$core$Result$Ok(
														_List_fromArray(
															[item]));
												} else {
													return $elm$core$Result$Ok(_List_Nil);
												}
											case 8:
												return $elm$core$Result$Ok(_List_Nil);
											default:
												return $elm$core$Result$Err('filter: where must return a Bool');
										}
									},
									f(
										A2($elm$core$Dict$singleton, 'entry', item)));
							},
							items));
				},
				A3($author$project$Typesystem$Prims$function, 'filter', 'where', args));
		}));
var $author$project$Typesystem$Prims$firstWhere = F2(
	function (test, items) {
		if (!items.b) {
			return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
		} else {
			var item = items.a;
			var rest = items.b;
			return A2(
				$elm$core$Result$andThen,
				function (keep) {
					return keep ? $elm$core$Result$Ok(item) : A2($author$project$Typesystem$Prims$firstWhere, test, rest);
				},
				test(item));
		}
	});
var $author$project$Typesystem$Prims$find = A2(
	$author$project$Typesystem$Prims$onList,
	'find',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$andThen,
				function (f) {
					return A2(
						$author$project$Typesystem$Prims$firstWhere,
						function (item) {
							return A2(
								$elm$core$Result$andThen,
								function (keep) {
									switch (keep.$) {
										case 2:
											var b = keep.a;
											return $elm$core$Result$Ok(b);
										case 8:
											return $elm$core$Result$Ok(false);
										default:
											return $elm$core$Result$Err('find: where must return a Bool');
									}
								},
								f(
									A2($elm$core$Dict$singleton, 'entry', item)));
						},
						items);
				},
				A3($author$project$Typesystem$Prims$function, 'find', 'where', args));
		}));
var $author$project$Typesystem$Prims$fold = A2(
	$author$project$Typesystem$Prims$onList,
	'fold',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$andThen,
				function (_v0) {
					var initial = _v0.a;
					var f = _v0.b;
					return A3(
						$elm$core$List$foldl,
						F2(
							function (item, acc) {
								return A2(
									$elm$core$Result$andThen,
									function (a) {
										return f(
											$elm$core$Dict$fromList(
												_List_fromArray(
													[
														_Utils_Tuple2('acc', a),
														_Utils_Tuple2('entry', item)
													])));
									},
									acc);
							}),
						$elm$core$Result$Ok(initial),
						items);
				},
				A3(
					$elm$core$Result$map2,
					$elm$core$Tuple$pair,
					A3($author$project$Typesystem$Prims$value, 'fold', 'initial', args),
					A3($author$project$Typesystem$Prims$function, 'fold', 'step', args)));
		}));
var $author$project$Typesystem$Prims$onDict = F3(
	function (prim, impl, args) {
		return A2(
			$elm$core$Result$andThen,
			function (v) {
				switch (v.$) {
					case 7:
						var entries = v.a;
						return A2(impl, entries, args);
					case 8:
						return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
					default:
						return $elm$core$Result$Err(prim + ': dict must be a Dict');
				}
			},
			A3($author$project$Typesystem$Prims$value, prim, 'dict', args));
	});
var $author$project$Typesystem$Prims$hasKey = A2(
	$author$project$Typesystem$Prims$onDict,
	'hasKey',
	F2(
		function (entries, args) {
			return A2(
				$elm$core$Result$map,
				function (k) {
					return _Utils_eq(k, $author$project$Typesystem$Value$VEmpty) ? $author$project$Typesystem$Value$VEmpty : $author$project$Typesystem$Value$VBool(
						A2(
							$elm$core$List$any,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								$author$project$Typesystem$Semantics$equal(k)),
							entries));
				},
				A3($author$project$Typesystem$Prims$value, 'hasKey', 'key', args));
		}));
var $author$project$Typesystem$Prims$number = function (v) {
	if (!v.$) {
		var n = v.a;
		return $elm$core$Result$Ok(n);
	} else {
		return $elm$core$Result$Err('expected a Number');
	}
};
var $author$project$Typesystem$Prims$isNumber = A2(
	$elm$core$Basics$composeR,
	$author$project$Typesystem$Prims$number,
	$elm$core$Result$map(
		function (_v0) {
			return 0;
		}));
var $author$project$Typesystem$Prims$keys = A2(
	$author$project$Typesystem$Prims$onDict,
	'keys',
	F2(
		function (entries, _v0) {
			return $elm$core$Result$Ok(
				$author$project$Typesystem$Value$VList(
					A2($elm$core$List$map, $elm$core$Tuple$first, entries)));
		}));
var $author$project$Typesystem$Prims$map = A2(
	$author$project$Typesystem$Prims$onList,
	'map',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$andThen,
				function (f) {
					return A2(
						$elm$core$Result$map,
						$author$project$Typesystem$Value$VList,
						A2(
							$author$project$Typesystem$Prims$traverse,
							function (item) {
								return f(
									A2($elm$core$Dict$singleton, 'entry', item));
							},
							items));
				},
				A3($author$project$Typesystem$Prims$function, 'map', 'fn', args));
		}));
var $author$project$Typesystem$Prims$memberTag = function (v) {
	switch (v.$) {
		case 0:
			return 'number';
		case 1:
			return 'text';
		case 2:
			return 'bool';
		case 3:
			return 'date';
		default:
			return '';
	}
};
var $author$project$Typesystem$Prims$unary = F4(
	function (prim, check, f, args) {
		return A2(
			$elm$core$Result$andThen,
			function (v) {
				return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty) ? $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty) : A2(
					$elm$core$Result$mapError,
					function (e) {
						return prim + (': ' + e);
					},
					A2(
						$elm$core$Result$map,
						f,
						check(v)));
			},
			A3($author$project$Typesystem$Prims$value, prim, 'value', args));
	});
var $author$project$Typesystem$Prims$narrow = F2(
	function (prim, tag) {
		return A3(
			$author$project$Typesystem$Prims$unary,
			prim,
			$elm$core$Result$Ok,
			function (v) {
				return _Utils_eq(
					$author$project$Typesystem$Prims$memberTag(v),
					tag) ? v : $author$project$Typesystem$Value$VEmpty;
			});
	});
var $author$project$Typesystem$Prims$numeric2 = F2(
	function (prim, op) {
		return A3(
			$author$project$Typesystem$Prims$binary,
			prim,
			$author$project$Typesystem$Prims$number,
			F2(
				function (a, b) {
					return $author$project$Typesystem$Value$VNumber(
						A2(op, a, b));
				}));
	});
var $author$project$Typesystem$Prims$ordering = F2(
	function (prim, test) {
		return A3(
			$author$project$Typesystem$Prims$binary,
			prim,
			$elm$core$Result$Ok,
			F2(
				function (a, b) {
					return $author$project$Typesystem$Value$VBool(
						test(
							A2($author$project$Typesystem$Semantics$compare, a, b)));
				}));
	});
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Typesystem$Prims$power = F2(
	function (x, y) {
		return ((x === 1) || (_Utils_eq(x, -1) && $elm$core$Basics$isInfinite(y))) ? 1 : A2($elm$core$Basics$pow, x, y);
	});
var $author$project$Typesystem$Prims$presence = function (v) {
	return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty) ? $author$project$Typesystem$Value$VEmpty : $author$project$Typesystem$Value$VNumber(1);
};
var $author$project$Typesystem$Algebra$reduce = F3(
	function (algebra, step, values) {
		var _v0 = A2(
			$elm$core$List$filter,
			$elm$core$Basics$neq($author$project$Typesystem$Value$VEmpty),
			values);
		if (!_v0.b) {
			if (!algebra.$) {
				var identity = algebra.a;
				return identity;
			} else {
				return $author$project$Typesystem$Value$VEmpty;
			}
		} else {
			var first = _v0.a;
			var rest = _v0.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (v, acc) {
						return A2(step, acc, v);
					}),
				first,
				rest);
		}
	});
var $author$project$Typesystem$Prims$reduction = F6(
	function (prim, algebra, check, prepare, step, args) {
		return A3(
			$author$project$Typesystem$Prims$onList,
			prim,
			F2(
				function (items, _v0) {
					return A2(
						$elm$core$Result$map,
						function (_v1) {
							return A3(
								$author$project$Typesystem$Algebra$reduce,
								algebra,
								step,
								A2($elm$core$List$map, prepare, items));
						},
						A2(
							$elm$core$Result$mapError,
							function (e) {
								return prim + (': ' + e);
							},
							A2(
								$author$project$Typesystem$Prims$traverse,
								function (v) {
									return _Utils_eq(v, $author$project$Typesystem$Value$VEmpty) ? $elm$core$Result$Ok(0) : check(v);
								},
								items)));
				}),
			args);
	});
var $author$project$Typesystem$Prims$doublings = F3(
	function (step, limit, acc) {
		doublings:
		while (true) {
			if (_Utils_cmp(step, limit) > 0) {
				return acc;
			} else {
				var $temp$step = step * 2,
					$temp$limit = limit,
					$temp$acc = A2($elm$core$List$cons, step, acc);
				step = $temp$step;
				limit = $temp$limit;
				acc = $temp$acc;
				continue doublings;
			}
		}
	});
var $author$project$Typesystem$Prims$reduceBy = F2(
	function (steps, x) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (step, remaining) {
					return (_Utils_cmp(remaining, step) > -1) ? (remaining - step) : remaining;
				}),
			x,
			steps);
	});
var $author$project$Typesystem$Prims$remainder = F2(
	function (x, y) {
		if ((!y) || ($elm$core$Basics$isInfinite(x) || ($elm$core$Basics$isNaN(x) || $elm$core$Basics$isNaN(y)))) {
			return 0 / 0;
		} else {
			if ($elm$core$Basics$isInfinite(y)) {
				return x;
			} else {
				var magnitude = A2(
					$author$project$Typesystem$Prims$reduceBy,
					A3(
						$author$project$Typesystem$Prims$doublings,
						$elm$core$Basics$abs(y),
						$elm$core$Basics$abs(x),
						_List_Nil),
					$elm$core$Basics$abs(x));
				return ((x < 0) || ((!x) && ((1 / x) < 0))) ? (-magnitude) : magnitude;
			}
		}
	});
var $author$project$Typesystem$Prims$sortBy = A2(
	$author$project$Typesystem$Prims$onList,
	'sortBy',
	F2(
		function (items, args) {
			return A2(
				$elm$core$Result$andThen,
				function (f) {
					return A2(
						$elm$core$Result$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$sortWith(
								F2(
									function (_v0, _v1) {
										var k1 = _v0.b;
										var k2 = _v1.b;
										return A2($author$project$Typesystem$Semantics$compare, k1, k2);
									})),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$List$map($elm$core$Tuple$first),
								$author$project$Typesystem$Value$VList)),
						A2(
							$author$project$Typesystem$Prims$traverse,
							function (item) {
								return A2(
									$elm$core$Result$map,
									$elm$core$Tuple$pair(item),
									f(
										A2($elm$core$Dict$singleton, 'entry', item)));
							},
							items));
				},
				A3($author$project$Typesystem$Prims$function, 'sortBy', 'key', args));
		}));
var $author$project$Typesystem$Prims$text = function (v) {
	if (v.$ === 1) {
		var s = v.a;
		return $elm$core$Result$Ok(s);
	} else {
		return $elm$core$Result$Err('expected a Text');
	}
};
var $author$project$Typesystem$Prims$table = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'add',
			A2($author$project$Typesystem$Prims$numeric2, 'add', $elm$core$Basics$add)),
			_Utils_Tuple2(
			'sub',
			A2($author$project$Typesystem$Prims$numeric2, 'sub', $elm$core$Basics$sub)),
			_Utils_Tuple2(
			'mul',
			A2($author$project$Typesystem$Prims$numeric2, 'mul', $elm$core$Basics$mul)),
			_Utils_Tuple2(
			'div',
			A2($author$project$Typesystem$Prims$numeric2, 'div', $elm$core$Basics$fdiv)),
			_Utils_Tuple2(
			'mod',
			A2($author$project$Typesystem$Prims$numeric2, 'mod', $author$project$Typesystem$Prims$remainder)),
			_Utils_Tuple2(
			'pow',
			A2($author$project$Typesystem$Prims$numeric2, 'pow', $author$project$Typesystem$Prims$power)),
			_Utils_Tuple2(
			'neg',
			A3(
				$author$project$Typesystem$Prims$unary,
				'neg',
				$author$project$Typesystem$Prims$number,
				function (n) {
					return $author$project$Typesystem$Value$VNumber(-n);
				})),
			_Utils_Tuple2(
			'eq',
			A3(
				$author$project$Typesystem$Prims$binary,
				'eq',
				$elm$core$Result$Ok,
				F2(
					function (a, b) {
						return $author$project$Typesystem$Value$VBool(
							A2($author$project$Typesystem$Semantics$equal, a, b));
					}))),
			_Utils_Tuple2(
			'neq',
			A3(
				$author$project$Typesystem$Prims$binary,
				'neq',
				$elm$core$Result$Ok,
				F2(
					function (a, b) {
						return $author$project$Typesystem$Value$VBool(
							!A2($author$project$Typesystem$Semantics$equal, a, b));
					}))),
			_Utils_Tuple2(
			'lt',
			A2(
				$author$project$Typesystem$Prims$ordering,
				'lt',
				function (o) {
					return !o;
				})),
			_Utils_Tuple2(
			'lte',
			A2(
				$author$project$Typesystem$Prims$ordering,
				'lte',
				function (o) {
					return o !== 2;
				})),
			_Utils_Tuple2(
			'gt',
			A2(
				$author$project$Typesystem$Prims$ordering,
				'gt',
				function (o) {
					return o === 2;
				})),
			_Utils_Tuple2(
			'gte',
			A2(
				$author$project$Typesystem$Prims$ordering,
				'gte',
				function (o) {
					return !(!o);
				})),
			_Utils_Tuple2(
			'and',
			A3(
				$author$project$Typesystem$Prims$binary,
				'and',
				$author$project$Typesystem$Prims$bool,
				F2(
					function (a, b) {
						return $author$project$Typesystem$Value$VBool(a && b);
					}))),
			_Utils_Tuple2(
			'or',
			A3(
				$author$project$Typesystem$Prims$binary,
				'or',
				$author$project$Typesystem$Prims$bool,
				F2(
					function (a, b) {
						return $author$project$Typesystem$Value$VBool(a || b);
					}))),
			_Utils_Tuple2(
			'not',
			A3(
				$author$project$Typesystem$Prims$unary,
				'not',
				$author$project$Typesystem$Prims$bool,
				function (b) {
					return $author$project$Typesystem$Value$VBool(!b);
				})),
			_Utils_Tuple2(
			'concat',
			A3(
				$author$project$Typesystem$Prims$binary,
				'concat',
				$author$project$Typesystem$Prims$text,
				F2(
					function (a, b) {
						return $author$project$Typesystem$Value$VText(
							_Utils_ap(a, b));
					}))),
			_Utils_Tuple2('concatList', $author$project$Typesystem$Prims$concatList),
			_Utils_Tuple2(
			'asNumber',
			A2($author$project$Typesystem$Prims$narrow, 'asNumber', 'number')),
			_Utils_Tuple2(
			'asText',
			A2($author$project$Typesystem$Prims$narrow, 'asText', 'text')),
			_Utils_Tuple2(
			'asBool',
			A2($author$project$Typesystem$Prims$narrow, 'asBool', 'bool')),
			_Utils_Tuple2(
			'asDate',
			A2($author$project$Typesystem$Prims$narrow, 'asDate', 'date')),
			_Utils_Tuple2('coalesce', $author$project$Typesystem$Prims$coalesce),
			_Utils_Tuple2(
			'text',
			A3(
				$author$project$Typesystem$Prims$unary,
				'text',
				$elm$core$Result$Ok,
				function (v) {
					return $author$project$Typesystem$Value$VText(
						$author$project$Typesystem$Semantics$toText(v));
				})),
			_Utils_Tuple2(
			'count',
			A5(
				$author$project$Typesystem$Prims$reduction,
				'count',
				$author$project$Typesystem$Algebra$Monoid(
					$author$project$Typesystem$Value$VNumber(0)),
				function (_v0) {
					return $elm$core$Result$Ok(0);
				},
				$author$project$Typesystem$Prims$presence,
				$author$project$Typesystem$Prims$add)),
			_Utils_Tuple2(
			'sum',
			A5(
				$author$project$Typesystem$Prims$reduction,
				'sum',
				$author$project$Typesystem$Algebra$Monoid(
					$author$project$Typesystem$Value$VNumber(0)),
				$author$project$Typesystem$Prims$isNumber,
				$elm$core$Basics$identity,
				$author$project$Typesystem$Prims$add)),
			_Utils_Tuple2(
			'min',
			A5(
				$author$project$Typesystem$Prims$reduction,
				'min',
				$author$project$Typesystem$Algebra$Semigroup,
				function (_v1) {
					return $elm$core$Result$Ok(0);
				},
				$elm$core$Basics$identity,
				F2(
					function (a, b) {
						return (!A2($author$project$Typesystem$Semantics$compare, b, a)) ? b : a;
					}))),
			_Utils_Tuple2(
			'max',
			A5(
				$author$project$Typesystem$Prims$reduction,
				'max',
				$author$project$Typesystem$Algebra$Semigroup,
				function (_v2) {
					return $elm$core$Result$Ok(0);
				},
				$elm$core$Basics$identity,
				F2(
					function (a, b) {
						return (A2($author$project$Typesystem$Semantics$compare, b, a) === 2) ? b : a;
					}))),
			_Utils_Tuple2(
			'length',
			A2(
				$author$project$Typesystem$Prims$onList,
				'length',
				F2(
					function (items, _v3) {
						return $elm$core$Result$Ok(
							$author$project$Typesystem$Value$VNumber(
								$elm$core$List$length(items)));
					}))),
			_Utils_Tuple2(
			'first',
			A2(
				$author$project$Typesystem$Prims$onList,
				'first',
				F2(
					function (items, _v4) {
						return $elm$core$Result$Ok(
							A2(
								$elm$core$Maybe$withDefault,
								$author$project$Typesystem$Value$VEmpty,
								$elm$core$List$head(items)));
					}))),
			_Utils_Tuple2('find', $author$project$Typesystem$Prims$find),
			_Utils_Tuple2('contains', $author$project$Typesystem$Prims$contains),
			_Utils_Tuple2('hasKey', $author$project$Typesystem$Prims$hasKey),
			_Utils_Tuple2('keys', $author$project$Typesystem$Prims$keys),
			_Utils_Tuple2('filter', $author$project$Typesystem$Prims$filter),
			_Utils_Tuple2('map', $author$project$Typesystem$Prims$map),
			_Utils_Tuple2('sortBy', $author$project$Typesystem$Prims$sortBy),
			_Utils_Tuple2('fold', $author$project$Typesystem$Prims$fold),
			_Utils_Tuple2(
			'always',
			function (args) {
				return A3($author$project$Typesystem$Prims$value, 'always', 'value', args);
			}),
			_Utils_Tuple2(
			'group',
			function (_v5) {
				return $elm$core$Result$Err('group is a special form');
			})
		]));
var $author$project$Typesystem$Semantics$variantName = F2(
	function (names, tag) {
		var _v0 = $elm$core$Dict$values(
			A2(
				$elm$core$Dict$filter,
				F2(
					function (key, _v1) {
						return A2($elm$core$String$endsWith, '.' + tag, key);
					}),
				names));
		if (_v0.b && (!_v0.b.b)) {
			var name = _v0.a;
			return name;
		} else {
			return tag;
		}
	});
var $author$project$Typesystem$Semantics$friendly = F3(
	function (names, nested, v) {
		switch (v.$) {
			case 0:
				var n = v.a;
				return ($elm$core$Basics$isNaN(n) || $elm$core$Basics$isInfinite(n)) ? $author$project$Typesystem$Semantics$numberToText(n) : ((!n) ? '0' : ((($elm$core$Basics$abs(n) < 1.0e16) && _Utils_eq(
					n,
					$elm$core$Basics$floor(n))) ? A2(
					$elm$core$String$dropRight,
					2,
					$author$project$Typesystem$Semantics$numberToText(n)) : $author$project$Typesystem$Semantics$numberToText(n)));
			case 8:
				return '';
			case 6:
				var items = v.a;
				var joined = A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						A2($author$project$Typesystem$Semantics$friendly, names, true),
						items));
				return nested ? ('[' + (joined + ']')) : joined;
			case 4:
				var fields = v.a;
				return A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var x = _v1.b;
							return A2(
								$elm$core$Maybe$withDefault,
								k,
								A2($elm$core$Dict$get, k, names)) + (': ' + A3($author$project$Typesystem$Semantics$friendly, names, true, x));
						},
						$elm$core$Dict$toList(fields)));
			case 7:
				var entries = v.a;
				return A2(
					$elm$core$String$join,
					', ',
					A2(
						$elm$core$List$map,
						function (_v2) {
							var k = _v2.a;
							var x = _v2.b;
							return A3($author$project$Typesystem$Semantics$friendly, names, true, k) + (': ' + A3($author$project$Typesystem$Semantics$friendly, names, true, x));
						},
						entries));
			case 5:
				var tag = v.a;
				var payload = v.b;
				return A2(
					$elm$core$Maybe$withDefault,
					A2($author$project$Typesystem$Semantics$variantName, names, tag),
					A2(
						$elm$core$Maybe$map,
						A2($author$project$Typesystem$Semantics$friendly, names, true),
						payload));
			default:
				return $author$project$Typesystem$Semantics$duckText(v);
		}
	});
var $author$project$Typesystem$Semantics$toTemplateText = F2(
	function (names, v) {
		return A3($author$project$Typesystem$Semantics$friendly, names, false, v);
	});
var $author$project$Typesystem$Prims$templatePart = F2(
	function (names, args) {
		return A2(
			$elm$core$Result$map,
			A2(
				$elm$core$Basics$composeR,
				$author$project$Typesystem$Semantics$toTemplateText(names),
				$author$project$Typesystem$Value$VText),
			A3($author$project$Typesystem$Prims$value, 'templatePart', 'value', args));
	});
var $author$project$Typesystem$Prims$lookup = F2(
	function (names, id) {
		return (id === 'templatePart') ? $elm$core$Maybe$Just(
			$author$project$Typesystem$Prims$templatePart(names)) : A2($elm$core$Dict$get, id, $author$project$Typesystem$Prims$table);
	});
var $author$project$Typesystem$Eval$eval = F2(
	function (env, core) {
		switch (core.$) {
			case 0:
				var v = core.a;
				return $elm$core$Result$Ok(v);
			case 11:
				var node = core.a;
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$MissingAt(node));
			case 1:
				var b = core.a;
				return A2(
					$elm$core$Result$fromMaybe,
					$author$project$Typesystem$Eval$UnboundBinder(b),
					A2($elm$core$Dict$get, b, env.h0));
			case 2:
				var id = core.a;
				return A2(
					$elm$core$Result$fromMaybe,
					$author$project$Typesystem$Eval$UnknownObject(id),
					A2($elm$core$Dict$get, id, env.gz));
			case 3:
				var f = core.a;
				var inner = core.b;
				return A2(
					$elm$core$Result$andThen,
					$author$project$Typesystem$Eval$field(f),
					A2($author$project$Typesystem$Eval$eval, env, inner));
			case 4:
				var fields = core.a;
				return A2(
					$elm$core$Result$map,
					A2($elm$core$Basics$composeR, $elm$core$Dict$fromList, $author$project$Typesystem$Value$VRecord),
					A2(
						$author$project$Typesystem$Eval$traverse,
						function (_v9) {
							var k = _v9.a;
							var c = _v9.b;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(k),
								A2($author$project$Typesystem$Eval$eval, env, c));
						},
						$elm$core$Dict$toList(fields)));
			case 5:
				var items = core.a;
				return A2(
					$elm$core$Result$map,
					$author$project$Typesystem$Value$VList,
					A2(
						$author$project$Typesystem$Eval$traverse,
						$author$project$Typesystem$Eval$eval(env),
						items));
			case 6:
				var tag = core.a;
				var payload = core.b;
				if (payload.$ === 1) {
					return $elm$core$Result$Ok(
						A2($author$project$Typesystem$Value$VVariant, tag, $elm$core$Maybe$Nothing));
				} else {
					var p = payload.a;
					return A2(
						$elm$core$Result$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$Just,
							$author$project$Typesystem$Value$VVariant(tag)),
						A2($author$project$Typesystem$Eval$eval, env, p));
				}
			case 7:
				var id = core.a;
				var args = core.b;
				return A3($author$project$Typesystem$Eval$evalPrim, env, id, args);
			case 8:
				return $elm$core$Result$Err(
					$author$project$Typesystem$Eval$TypeFault('lambda outside a higher-order argument'));
			case 9:
				var spec = core.a;
				return A2($author$project$Typesystem$Eval$evalLift, env, spec);
			default:
				var selectors = core.a;
				var inner = core.b;
				return A2(
					$elm$core$Result$andThen,
					A2($author$project$Typesystem$Eval$applySelectors, $author$project$Typesystem$Algebra$PadEmpty, selectors),
					A2($author$project$Typesystem$Eval$eval, env, inner));
		}
	});
var $author$project$Typesystem$Eval$evalArg = F2(
	function (env, arg) {
		if (arg.$ === 8) {
			var binders = arg.a;
			var body = arg.b;
			return $elm$core$Result$Ok(
				$author$project$Typesystem$Prims$Fn(
					function (values) {
						var bound = A3(
							$elm$core$Dict$foldl,
							F3(
								function (param, binder, acc) {
									var _v7 = A2($elm$core$Dict$get, param, values);
									if (!_v7.$) {
										var v = _v7.a;
										return A3($elm$core$Dict$insert, binder, v, acc);
									} else {
										return acc;
									}
								}),
							env.h0,
							binders);
						return A2(
							$elm$core$Result$mapError,
							$author$project$Typesystem$Eval$errorToString,
							A2(
								$author$project$Typesystem$Eval$eval,
								_Utils_update(
									env,
									{h0: bound}),
								body));
					}));
		} else {
			return A2(
				$elm$core$Result$map,
				$author$project$Typesystem$Prims$Val,
				A2($author$project$Typesystem$Eval$eval, env, arg));
		}
	});
var $author$project$Typesystem$Eval$evalLift = F2(
	function (env, spec) {
		var names = A2($elm$core$List$map, $elm$core$Tuple$first, spec.ha);
		var runRow = function (row) {
			return A2(
				$author$project$Typesystem$Eval$eval,
				_Utils_update(
					env,
					{
						h0: A3(
							$elm$core$List$foldl,
							function (_v5) {
								var b = _v5.a;
								var v = _v5.b;
								return A2($elm$core$Dict$insert, b, v);
							},
							env.h0,
							A3($elm$core$List$map2, $elm$core$Tuple$pair, names, row))
					}),
				spec.h1);
		};
		return A2(
			$elm$core$Result$andThen,
			function (values) {
				if (A2($elm$core$List$member, $author$project$Typesystem$Value$VEmpty, values)) {
					return $elm$core$Result$Ok($author$project$Typesystem$Value$VEmpty);
				} else {
					var _v3 = spec.iU;
					if (!_v3) {
						return A2(
							$elm$core$Result$map,
							$author$project$Typesystem$Value$VList,
							A2(
								$elm$core$Result$andThen,
								A2(
									$elm$core$Basics$composeR,
									$author$project$Typesystem$Algebra$alignLists(spec.dG),
									$author$project$Typesystem$Eval$traverse(runRow)),
								A2($author$project$Typesystem$Eval$traverse, $author$project$Typesystem$Eval$asList, values)));
					} else {
						return A2(
							$elm$core$Result$map,
							$author$project$Typesystem$Semantics$dictFromList,
							A2(
								$elm$core$Result$andThen,
								A2(
									$elm$core$Basics$composeR,
									$author$project$Typesystem$Algebra$alignDicts(spec.dG),
									$author$project$Typesystem$Eval$traverse(
										function (_v4) {
											var k = _v4.a;
											var row = _v4.b;
											return A2(
												$elm$core$Result$map,
												$elm$core$Tuple$pair(k),
												runRow(row));
										})),
								A2(
									$author$project$Typesystem$Eval$traverse,
									$author$project$Typesystem$Eval$asDictOr(
										$author$project$Typesystem$Eval$keysOf(values)),
									values)));
					}
				}
			},
			A2(
				$author$project$Typesystem$Eval$traverse,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$second,
					A2($author$project$Typesystem$Eval$evalSource, env, spec.dG)),
				spec.ha));
	});
var $author$project$Typesystem$Eval$evalPrim = F3(
	function (env, id, args) {
		var _v1 = A2($author$project$Typesystem$Prims$lookup, env.gs, id);
		if (_v1.$ === 1) {
			return $elm$core$Result$Err(
				$author$project$Typesystem$Eval$UnknownPrim(id));
		} else {
			var impl = _v1.a;
			return A2(
				$elm$core$Result$andThen,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Dict$fromList,
					A2(
						$elm$core$Basics$composeR,
						impl,
						$elm$core$Result$mapError($author$project$Typesystem$Eval$TypeFault))),
				A2(
					$author$project$Typesystem$Eval$traverse,
					function (_v2) {
						var k = _v2.a;
						var c = _v2.b;
						return A2(
							$elm$core$Result$map,
							$elm$core$Tuple$pair(k),
							A2($author$project$Typesystem$Eval$evalArg, env, c));
					},
					$elm$core$Dict$toList(args)));
		}
	});
var $author$project$Typesystem$Eval$evalSource = F3(
	function (env, align, source) {
		if (source.$ === 10) {
			var selectors = source.a;
			var inner = source.b;
			return A2(
				$elm$core$Result$andThen,
				A2($author$project$Typesystem$Eval$applySelectors, align, selectors),
				A2($author$project$Typesystem$Eval$eval, env, inner));
		} else {
			return A2($author$project$Typesystem$Eval$eval, env, source);
		}
	});
var $author$project$Designer$Evaluate$faultMessage = function (error) {
	switch (error.$) {
		case 0:
			var binder = error.a;
			return 'unbound binder ' + binder;
		case 1:
			var id = error.a;
			return 'no value for object ' + id;
		case 2:
			var id = error.a;
			return 'unknown primitive ' + id;
		case 3:
			var text = error.a;
			return text;
		default:
			var node = error.a;
			return 'missing node ' + node;
	}
};
var $author$project$Designer$Evaluate$Resolved = function (a) {
	return {$: 0, a: a};
};
var $author$project$Designer$Evaluate$defaults = function (points) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$filterMap,
			function (point) {
				return A2(
					$elm$core$Maybe$map,
					function (option) {
						return _Utils_Tuple2(point.jG, option.dy);
					},
					$elm$core$List$head(point.jZ));
			},
			points));
};
var $author$project$Designer$Evaluate$ReplayRejected = function (a) {
	return {$: 2, a: a};
};
var $author$project$Designer$Evaluate$StillOpen = {$: 1};
var $author$project$Designer$Evaluate$replayDefaults = F4(
	function (checker, env, fuel, chosen) {
		replayDefaults:
		while (true) {
			var _v0 = checker(
				_Utils_update(
					env,
					{
						U: A2($elm$core$Dict$union, chosen, env.U)
					}));
			if (!_v0.$) {
				var resolved = _v0.a;
				if ($elm$core$List$isEmpty(resolved.U)) {
					return $author$project$Designer$Evaluate$Resolved(resolved);
				} else {
					if (fuel <= 1) {
						return $author$project$Designer$Evaluate$StillOpen;
					} else {
						var $temp$checker = checker,
							$temp$env = env,
							$temp$fuel = fuel - 1,
							$temp$chosen = A2(
							$elm$core$Dict$union,
							chosen,
							$author$project$Designer$Evaluate$defaults(resolved.U));
						checker = $temp$checker;
						env = $temp$env;
						fuel = $temp$fuel;
						chosen = $temp$chosen;
						continue replayDefaults;
					}
				}
			} else {
				var rejected = _v0.a;
				return $author$project$Designer$Evaluate$ReplayRejected(rejected.cf);
			}
		}
	});
var $author$project$Designer$Evaluate$replayLimit = 8;
var $author$project$Designer$Evaluate$resolve = F3(
	function (checker, env, first) {
		return $elm$core$List$isEmpty(first.U) ? $author$project$Designer$Evaluate$Resolved(first) : A4(
			$author$project$Designer$Evaluate$replayDefaults,
			checker,
			env,
			$author$project$Designer$Evaluate$replayLimit,
			$author$project$Designer$Evaluate$defaults(first.U));
	});
var $author$project$Try$Pretty$Line = function (a) {
	return {$: 0, a: a};
};
var $author$project$Try$Pretty$Table = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Try$Pretty$showCell = F2(
	function (env, value) {
		if (value.$ === 1) {
			var s = value.a;
			return s;
		} else {
			return A2($author$project$Try$Pretty$showValue, env, value);
		}
	});
var $author$project$Try$Pretty$recordCells = F3(
	function (env, columns, item) {
		if (item.$ === 4) {
			var fields = item.a;
			return A2(
				$elm$core$List$map,
				function (c) {
					return A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							$author$project$Try$Pretty$showCell(env),
							A2($elm$core$Dict$get, c, fields)));
				},
				columns);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Try$Pretty$allJust = A2(
	$elm$core$List$foldr,
	$elm$core$Maybe$map2($elm$core$List$cons),
	$elm$core$Maybe$Just(_List_Nil));
var $author$project$Try$Pretty$recordColumns = F2(
	function (rank, items) {
		var fieldsOf = function (item) {
			if (item.$ === 4) {
				var fields = item.a;
				return $elm$core$Maybe$Just(
					$elm$core$Dict$keys(fields));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var _v0 = $author$project$Try$Pretty$allJust(
			A2($elm$core$List$map, fieldsOf, items));
		if (!_v0.$) {
			var lists = _v0.a;
			return $elm$core$Maybe$Just(
				A2(
					$elm$core$List$sortBy,
					function (id) {
						return _Utils_Tuple2(
							A2(
								$elm$core$Maybe$withDefault,
								9999,
								A2($elm$core$Dict$get, id, rank)),
							id);
					},
					$elm$core$Set$toList(
						$elm$core$Set$fromList(
							$elm$core$List$concat(lists)))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Try$Pretty$valueDoc = F3(
	function (env, rank, value) {
		switch (value.$) {
			case 6:
				if (!value.a.b) {
					return $author$project$Try$Pretty$Line('[]');
				} else {
					var items = value.a;
					var _v1 = A2($author$project$Try$Pretty$recordColumns, rank, items);
					if (!_v1.$) {
						var columns = _v1.a;
						return A2(
							$author$project$Try$Pretty$Table,
							A2(
								$elm$core$List$cons,
								'#',
								A2(
									$elm$core$List$map,
									$author$project$Typesystem$Env$nameOf(env),
									columns)),
							A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, item) {
										return A2(
											$elm$core$List$cons,
											$elm$core$String$fromInt(i),
											A3($author$project$Try$Pretty$recordCells, env, columns, item));
									}),
								items));
					} else {
						return A2(
							$author$project$Try$Pretty$Table,
							_List_fromArray(
								['#', 'value']),
							A2(
								$elm$core$List$indexedMap,
								F2(
									function (i, item) {
										return _List_fromArray(
											[
												$elm$core$String$fromInt(i),
												A2($author$project$Try$Pretty$showCell, env, item)
											]);
									}),
								items));
					}
				}
			case 7:
				if (!value.a.b) {
					return $author$project$Try$Pretty$Line('{}');
				} else {
					var entries = value.a;
					var _v2 = A2(
						$author$project$Try$Pretty$recordColumns,
						rank,
						A2($elm$core$List$map, $elm$core$Tuple$second, entries));
					if (!_v2.$) {
						var columns = _v2.a;
						return A2(
							$author$project$Try$Pretty$Table,
							A2(
								$elm$core$List$cons,
								'key',
								A2(
									$elm$core$List$map,
									$author$project$Typesystem$Env$nameOf(env),
									columns)),
							A2(
								$elm$core$List$map,
								function (_v3) {
									var k = _v3.a;
									var v = _v3.b;
									return A2(
										$elm$core$List$cons,
										A2($author$project$Try$Pretty$showCell, env, k),
										A3($author$project$Try$Pretty$recordCells, env, columns, v));
								},
								entries));
					} else {
						return A2(
							$author$project$Try$Pretty$Table,
							_List_fromArray(
								['key', 'value']),
							A2(
								$elm$core$List$map,
								function (_v4) {
									var k = _v4.a;
									var v = _v4.b;
									return _List_fromArray(
										[
											A2($author$project$Try$Pretty$showCell, env, k),
											A2($author$project$Try$Pretty$showCell, env, v)
										]);
								},
								entries));
					}
				}
			default:
				return $author$project$Try$Pretty$Line(
					A2($author$project$Try$Pretty$showValue, env, value));
		}
	});
var $author$project$Try$evaluation = F5(
	function (env, rank, values, surface, accepted) {
		var withType = F2(
			function (resolved, rest) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						'type',
						$elm$json$Json$Encode$string(
							A3($author$project$Try$Pretty$showType, env, $elm$core$Basics$never, resolved.dy))),
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							'typeWire',
							$author$project$Typesystem$Wire$Type$groundEncoder(resolved.dy)),
						rest));
			});
		var defaults = !$elm$core$List$isEmpty(accepted.U);
		var _v0 = A3(
			$author$project$Designer$Evaluate$resolve,
			function (e) {
				return A2($author$project$Typesystem$Check$check, e, surface);
			},
			env,
			accepted);
		switch (_v0.$) {
			case 0:
				var resolved = _v0.a;
				var _v1 = A2(
					$author$project$Typesystem$Eval$eval,
					{h0: $elm$core$Dict$empty, gs: env.gs, gz: values},
					resolved.iw);
				if (!_v1.$) {
					var value = _v1.a;
					return A2(
						withType,
						resolved,
						_List_fromArray(
							[
								_Utils_Tuple2(
								'status',
								$elm$json$Json$Encode$string('ok')),
								_Utils_Tuple2(
								'usedDefaults',
								$elm$json$Json$Encode$bool(defaults)),
								_Utils_Tuple2(
								'value',
								$author$project$Try$docJson(
									A3($author$project$Try$Pretty$valueDoc, env, rank, value))),
								_Utils_Tuple2(
								'valueWire',
								A3($author$project$Typesystem$Wire$Data$encode, env, resolved.dy, value))
							]));
				} else {
					var error = _v1.a;
					return A2(
						withType,
						resolved,
						_List_fromArray(
							[
								_Utils_Tuple2(
								'status',
								$elm$json$Json$Encode$string('fault')),
								_Utils_Tuple2(
								'fault',
								$elm$json$Json$Encode$string(
									$author$project$Designer$Evaluate$faultMessage(error)))
							]));
				}
			case 1:
				return _List_fromArray(
					[
						_Utils_Tuple2(
						'status',
						$elm$json$Json$Encode$string('fault')),
						_Utils_Tuple2(
						'fault',
						$elm$json$Json$Encode$string('choices still unresolved after replaying the defaults'))
					]);
			default:
				var diagnostics = _v0.a;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						'status',
						$elm$json$Json$Encode$string('rejected')),
						_Utils_Tuple2(
						'diagnostics',
						A2(
							$elm$json$Json$Encode$list,
							A2($author$project$Try$diagnosticJson, env, surface),
							diagnostics))
					]);
		}
	});
var $author$project$Typesystem$Wire$Diagnostic$fromCheck = function (result) {
	if (!result.$) {
		var checked = result.a;
		return $author$project$Typesystem$Wire$Diagnostic$CheckOk(
			{e7: checked.e7, U: checked.U, eN: checked.eN, dy: checked.dy});
	} else {
		var rejected = result.a;
		return $author$project$Typesystem$Wire$Diagnostic$CheckErr(rejected);
	}
};
var $author$project$Typesystem$Wire$Diagnostic$fromPartial = $author$project$Typesystem$Wire$Diagnostic$CheckPartial;
var $author$project$Typesystem$Check$expectedAt = F3(
	function (env, surface, node) {
		var _v0 = A3(
			$author$project$Typesystem$Infer$synth,
			{h0: _List_Nil, aB: env},
			surface,
			$author$project$Typesystem$Infer$initialFor(env));
		var st = _v0.b;
		return A2(
			$elm$core$Maybe$andThen,
			function (t) {
				if (t.$ === 9) {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(t);
				}
			},
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.dy;
					},
					$author$project$Typesystem$Unify$apply(st.bl)),
				A2($elm$core$Dict$get, node, st.e7)));
	});
var $author$project$Try$holeJson = F4(
	function (env, surface, _v0, node) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'node',
					$elm$json$Json$Encode$string(node)),
					_Utils_Tuple2(
					'path',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2($elm$core$Basics$composeR, $author$project$Try$Pretty$pathToString, $elm$json$Json$Encode$string),
							A2($author$project$Typesystem$Surface$pathTo, node, surface)))),
					_Utils_Tuple2(
					'expects',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								A2($author$project$Try$Pretty$showType, env, $author$project$Try$Pretty$varName),
								$elm$json$Json$Encode$string),
							A3($author$project$Typesystem$Check$expectedAt, env, surface, node))))
				]));
	});
var $author$project$Try$children = function (surface) {
	switch (surface.$) {
		case 2:
			var target = surface.b;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PTarget, target)
				]);
		case 3:
			var args = surface.c;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, arg) {
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PArg(i),
							arg.hp);
					}),
				args);
		case 4:
			var x = surface.b;
			var f = surface.c;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PInput, x),
					_Utils_Tuple2($author$project$Typesystem$Surface$PFunction, f)
				]);
		case 5:
			var f = surface.b;
			var g = surface.c;
			return _List_fromArray(
				[
					_Utils_Tuple2($author$project$Typesystem$Surface$PFirst, f),
					_Utils_Tuple2($author$project$Typesystem$Surface$PSecond, g)
				]);
		case 6:
			var items = surface.b;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, item) {
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PItem(i),
							item);
					}),
				items);
		case 7:
			var entries = surface.b;
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, _v1) {
						var v = _v1.b;
						return _Utils_Tuple2(
							$author$project$Typesystem$Surface$PEntry(i),
							v);
					}),
				entries);
		case 8:
			var parts = surface.b;
			return A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, part) {
							if (part.$ === 1) {
								var x = part.a;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										$author$project$Typesystem$Surface$PPart(i),
										x));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}),
					parts));
		default:
			return _List_Nil;
	}
};
var $author$project$Try$nodesOf = function (surface) {
	var go = F2(
		function (path, node) {
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(path, node),
				A2(
					$elm$core$List$concatMap,
					function (_v0) {
						var step = _v0.a;
						var child = _v0.b;
						return A2(
							go,
							_Utils_ap(
								path,
								_List_fromArray(
									[step])),
							child);
					},
					$author$project$Try$children(node)));
		});
	return A2(go, _List_Nil, surface);
};
var $author$project$Try$holeNodes = F3(
	function (_v0, surface, partial) {
		return A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Typesystem$Surface$nodeId),
			A2(
				$elm$core$List$filter,
				function (_v1) {
					var node = _v1.b;
					return A2(
						$elm$core$Maybe$withDefault,
						false,
						A2(
							$elm$core$Maybe$map,
							function (a) {
								return a.i$ === 2;
							},
							A2(
								$elm$core$Dict$get,
								$author$project$Typesystem$Surface$nodeId(node),
								partial.e7)));
				},
				$author$project$Try$nodesOf(surface)));
	});
var $author$project$Try$nodeJson = F3(
	function (env, partial, _v0) {
		var path = _v0.a;
		var surface = _v0.b;
		var annotation = A2(
			$elm$core$Dict$get,
			$author$project$Typesystem$Surface$nodeId(surface),
			partial.e7);
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'node',
					$elm$json$Json$Encode$string(
						$author$project$Typesystem$Surface$nodeId(surface))),
					_Utils_Tuple2(
					'path',
					$elm$json$Json$Encode$string(
						$author$project$Try$Pretty$pathToString(path))),
					_Utils_Tuple2(
					'text',
					$elm$json$Json$Encode$string(
						A2($author$project$Try$Pretty$showSurface, env, surface))),
					_Utils_Tuple2(
					'type',
					A2(
						$elm$core$Maybe$withDefault,
						$elm$json$Json$Encode$null,
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.dy;
								},
								A2(
									$elm$core$Basics$composeR,
									A2($author$project$Try$Pretty$showType, env, $author$project$Try$Pretty$varName),
									$elm$json$Json$Encode$string)),
							annotation)))
				]));
	});
var $author$project$Try$partialChoices = F2(
	function (checked, partial) {
		if (!checked.$) {
			var accepted = checked.a;
			return accepted.U;
		} else {
			return partial.U;
		}
	});
var $author$project$Try$staleChoices = F2(
	function (checked, partial) {
		if (!checked.$) {
			var accepted = checked.a;
			return accepted.eN;
		} else {
			return partial.eN;
		}
	});
var $author$project$Try$runSurface = F4(
	function (model, rank, values, surface) {
		var env = model.aB;
		var partial = A2($author$project$Typesystem$Check$checkPartial, env, surface);
		var shownType = A2($author$project$Try$Pretty$showType, env, $author$project$Try$Pretty$varName);
		var checked = A2($author$project$Typesystem$Check$check, env, surface);
		var checkedFields = function () {
			if (checked.$ === 1) {
				var rejected = checked.a;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						'status',
						$elm$json$Json$Encode$string(
							$elm$core$List$isEmpty(
								A3($author$project$Try$holeNodes, env, surface, partial)) ? 'rejected' : 'incomplete')),
						_Utils_Tuple2(
						'diagnostics',
						A2(
							$elm$json$Json$Encode$list,
							A2($author$project$Try$diagnosticJson, env, surface),
							rejected.cf))
					]);
			} else {
				var accepted = checked.a;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						'diagnostics',
						A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, _List_Nil)),
					A5($author$project$Try$evaluation, env, rank, values, surface, accepted));
			}
		}();
		var wire = function () {
			if (!checked.$) {
				return $author$project$Typesystem$Wire$Diagnostic$fromCheck(checked);
			} else {
				return $author$project$Typesystem$Wire$Diagnostic$fromPartial(partial);
			}
		}();
		return $elm$json$Json$Encode$object(
			_Utils_ap(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'ok',
						$elm$json$Json$Encode$bool(true)),
						_Utils_Tuple2(
						'expression',
						$elm$json$Json$Encode$string(
							A2($author$project$Try$Pretty$showSurface, env, surface))),
						_Utils_Tuple2(
						'partialType',
						A2(
							$elm$core$Maybe$withDefault,
							$elm$json$Json$Encode$null,
							A2(
								$elm$core$Maybe$map,
								A2($elm$core$Basics$composeR, shownType, $elm$json$Json$Encode$string),
								partial.dy))),
						_Utils_Tuple2(
						'holes',
						A2(
							$elm$json$Json$Encode$list,
							A3($author$project$Try$holeJson, env, surface, partial),
							A3($author$project$Try$holeNodes, env, surface, partial))),
						_Utils_Tuple2(
						'choices',
						A2(
							$elm$json$Json$Encode$list,
							A2($author$project$Try$choiceJson, env, surface),
							A2($author$project$Try$partialChoices, checked, partial))),
						_Utils_Tuple2(
						'stale',
						A2(
							$elm$json$Json$Encode$list,
							$elm$json$Json$Encode$string,
							A2($author$project$Try$staleChoices, checked, partial))),
						_Utils_Tuple2(
						'nodes',
						A2(
							$elm$json$Json$Encode$list,
							A2($author$project$Try$nodeJson, env, partial),
							$author$project$Try$nodesOf(surface))),
						_Utils_Tuple2(
						'raw',
						A2($author$project$Typesystem$Wire$Codec$encoder, $author$project$Typesystem$Wire$Diagnostic$checkResultCodec, wire))
					]),
				checkedFields));
	});
var $author$project$Try$withSession = F2(
	function (req, env) {
		return _Utils_update(
			env,
			{dJ: req.dJ, U: req.U});
	});
var $author$project$Try$run = F2(
	function (request, model) {
		var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Try$runDecoder, request);
		if (_v0.$ === 1) {
			var error = _v0.a;
			return $author$project$Try$failure(
				$elm$json$Json$Decode$errorToString(error));
		} else {
			var req = _v0.a;
			var _v1 = req.g9;
			if (_v1.$ === 1) {
				var message = _v1.a;
				return $author$project$Try$failure(message);
			} else {
				var surface = _v1.a;
				return A4(
					$author$project$Try$runSurface,
					_Utils_update(
						model,
						{
							aB: A2($author$project$Try$withSession, req, model.aB)
						}),
					model.cs,
					model.cD,
					surface);
			}
		}
	});
var $author$project$Try$typeJson = F2(
	function (request, model) {
		var _v0 = A2(
			$elm$json$Json$Decode$decodeValue,
			A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
			request);
		if (!_v0.$) {
			var name = _v0.a;
			var _v1 = A2(
				$elm$core$List$filter,
				function (t) {
					return _Utils_eq(t.jD, name);
				},
				model.bU);
			if (_v1.b) {
				var table = _v1.a;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'ok',
							$elm$json$Json$Encode$bool(true)),
							_Utils_Tuple2(
							'type',
							$author$project$Typesystem$Wire$Type$groundEncoder(table.dy))
						]));
			} else {
				return $author$project$Try$failure('no table named ' + name);
			}
		} else {
			return $author$project$Try$failure('typejson needs a name');
		}
	});
var $author$project$Try$handle = F2(
	function (request, model) {
		var _v0 = A2(
			$elm$json$Json$Decode$decodeValue,
			A2($elm$json$Json$Decode$field, 'cmd', $elm$json$Json$Decode$string),
			request);
		_v0$4:
		while (true) {
			if (!_v0.$) {
				switch (_v0.a) {
					case 'load':
						var _v1 = A2($author$project$Try$load, request, model);
						if (!_v1.$) {
							var _v2 = _v1.a;
							var next = _v2.a;
							var reply = _v2.b;
							return _Utils_Tuple2(
								next,
								$author$project$Try$output(reply));
						} else {
							var message = _v1.a;
							return _Utils_Tuple2(
								model,
								$author$project$Try$output(
									$author$project$Try$failure(message)));
						}
					case 'run':
						return _Utils_Tuple2(
							model,
							$author$project$Try$output(
								A2($author$project$Try$run, request, model)));
					case 'typejson':
						return _Utils_Tuple2(
							model,
							$author$project$Try$output(
								A2($author$project$Try$typeJson, request, model)));
					case 'data':
						return _Utils_Tuple2(
							model,
							$author$project$Try$output(
								$author$project$Try$dataReply(model)));
					default:
						break _v0$4;
				}
			} else {
				break _v0$4;
			}
		}
		return _Utils_Tuple2(
			model,
			$author$project$Try$output(
				$author$project$Try$failure('unknown request')));
	});
var $author$project$Generated$Operators$displayOverlay = _List_fromArray(
	[
		_Utils_Tuple2('and', '&'),
		_Utils_Tuple2('or', '|'),
		_Utils_Tuple2('neq', '!=')
	]);
var $author$project$Designer$EnvBuild$emptyEnv = $author$project$Typesystem$Env$empty;
var $author$project$Typesystem$Env$withDecl = F2(
	function (decl, env) {
		return _Utils_update(
			env,
			{
				fv: A3($elm$core$Dict$insert, decl.c_, decl, env.fv)
			});
	});
var $author$project$Designer$EnvBuild$base = function (ws) {
	var withDecls = A3(
		$elm$core$List$foldl,
		$author$project$Typesystem$Env$withDecl,
		_Utils_update(
			$author$project$Designer$EnvBuild$emptyEnv,
			{dP: ws.dP}),
		ws.fv);
	var withNames = A3($elm$core$Dict$foldl, $author$project$Typesystem$Env$withName, withDecls, ws.gs);
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, env) {
				var id = _v0.a;
				var display = _v0.b;
				return A3($author$project$Typesystem$Env$withName, id, display, env);
			}),
		withNames,
		$author$project$Generated$Operators$displayOverlay);
};
var $author$project$Try$initial = {
	aB: $author$project$Designer$EnvBuild$base(
		{dP: $author$project$Typesystem$Env$empty.dP, fv: _List_Nil, gs: $elm$core$Dict$empty, gz: _List_Nil, j_: $elm$core$Dict$empty}),
	cs: $elm$core$Dict$empty,
	bU: _List_Nil,
	cD: $elm$core$Dict$empty
};
var $author$project$Try$input = _Platform_incomingPort('input', $elm$json$Json$Decode$value);
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$Try$main = $elm$core$Platform$worker(
	{
		ja: function (_v0) {
			return _Utils_Tuple2($author$project$Try$initial, $elm$core$Platform$Cmd$none);
		},
		kJ: function (_v1) {
			return $author$project$Try$input($elm$core$Basics$identity);
		},
		k9: F2(
			function (_v2, model) {
				var request = _v2;
				return A2($author$project$Try$handle, request, model);
			})
	});
_Platform_export({'Try':{'init':$author$project$Try$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));