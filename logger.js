(function(f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
        module.exports.loggerJs = function () {
          console.warn('Deprecated: please use require("loggerJs.js") directly, instead of the logger method of the function');
          return f().apply(this, arguments);
        };
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        let g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.loggerJs = f();
    }
})(function () {

	const VERSION = '1.0.0';

	const CONSTANTS = {
		TYPES_FLAT: ['string', 'number', 'bigint', 'symbol', 'boolean'],
		TYPES_EMPTY: ['null', 'undefined'],
		TYPES_OBJECT: ['object', 'function'],
		START: 0,
		END: 1,
		RESET: 2,
		MARK: 3,
		COLLAPSED: 4,
		LEVEL_OFF: 0,
		LEVEL_FATAL: 1,
		LEVEL_ERROR: 2,
		LEVEL_WARN: 3,
		LEVEL_INFO: 4,
		LEVEL_DEBUG: 5,
		LEVEL_TRACE: 6,
		LEVEL_ALL: 7,
		ASSERT_OFF: false,
		ASSERT_ON: true,
		FMT_DELIMITER: " : "
	}

	function Logger(obj) {

		this._options = {
			logLevel: CONSTANTS['LEVEL_INFO'],
			className: null,
			methodName: null,
			logMsg: "",
			logObj: null,
			debugLevel: loggerJs.consts['LEVEL_ALL'],
			assertToggle: loggerJs.consts['ASSERT_ON']
		};

		for (let key in obj){
			this._options[key] = obj[key];
		}

		return this;

	}

	/**
	  * Mark any object with an incrementing number
	  * used for keeping track of objects
	  *
	  * @param Object obj   Any object or DOM Element
	  * @param String key
	  * @return Object
	  */
	  let _stamp = (function () {
	    let keys = {};
	    return function stamp (obj, key) {

	      // get group key
	      key = key || 'introjs-stamp';

	      // each group increments from 0
	      keys[key] = keys[key] || 0;

	      // stamp only once per object
	      if (obj[key] === undefined) {
	        // increment key for each new object
	        obj[key] = keys[key]++;
	      }

	      return obj[key];
	    };
	  })();

	function _Logger_Init() {
		return this._options;
	}

	function _Logger_Clear(){
		if(window.console) {
			console.clear();
		}
	}

	function _Logger_Count(call, obj) {
		if(window.console) {
			switch(call) {
				case loggerJs.consts['START']:
					console.count(obj.logLabel);
					break;
				case loggerJs.consts['RESET']:
					console.countReset(obj.logLabel);
					break;
			}
		}
	}

	function _Logger_Group(call, obj) {
		if(_Verify_Level(obj, 'LEVEL_ALL') && window.console) {
			switch(call) {
				case loggerJs.consts['START']:
					console.group(obj.logLabel);
					break;
				case loggerJs.consts['COLLAPSED']:
					console.groupEnd(obj.logLabel);
					break;
				case loggerJs.consts['END']:
					console.groupEnd(obj.logLabel);
					break;
			}
		}
	}

	function _Logger_Profile(call, obj) {
		if(_Verify_Level(obj, 'LEVEL_ALL') && window.console) {
			switch(call) {
				case loggerJs.consts['START']:
					console.profile(obj.logLabel);
					break;
				case loggerJs.consts['END']:
					console.profileEnd(obj.logLabel);
					break;
				case loggerJs.consts['MARK']:
					console.timeStamp(obj.logLabel);
					break;
			}
		}
	}

	function _Logger_Timer(call, obj) {
		if(_Verify_Level(obj, 'LEVEL_ALL') && window.console) {
			switch(call) {
				case loggerJs.consts['START']:
					console.time(obj.logLabel);
					break;
				case loggerJs.consts['END']:
					console.timeEnd(obj.logLabel);
					break;
				case loggerJs.consts['MARK']:
					console.timeLog(obj.logLabel);
					break;
			}
		}
	}

	function _Logger_Console(obj) {
		if(_Verify_Level(obj, 'LEVEL_FATAL') && window.console) {
			switch(obj.logLevel){
				case 'assert':
					if(obj.assertToggle == loggerJs.consts['ASSERT_ON'])
						if(obj.logObjs != null) {
							console.assert(obj.assert, obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.assert(obj.assert, _Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
				case 'debug':
					if(_Verify_Level(obj, 'LEVEL_DEBUG'))
						if(obj.logObjs != null) {
							console.debug(obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.debug(_Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
					break;
				case 'error':
					if(_Verify_Level(obj, 'LEVEL_ERROR'))
						if(obj.logObjs != null) {
							console.error(obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.error(_Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
					break;
				case 'info':
					if(_Verify_Level(obj, 'LEVEL_INFO'))
						if(obj.logObjs != null) {
							console.info(obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.info(_Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
					break;
				case 'dir':
					if(_Verify_Level(obj, 'LEVEL_ALL') && !_Verify_Type('TYPES_EMPTY',console.dir)){
						console.dir(obj.logObj);
					} else {
						_Logger_Console({"debugLevel":CONSTANTS['LEVEL_ERROR'],"logMsg":"console.dir could not be executed"});
					}
					break;
				case 'dirxml':
					if(_Verify_Level(obj, 'LEVEL_ALL') && !_Verify_Type('TYPES_EMPTY',console.dirxml)){
						console.dirxml(obj.logObj);
					} else {
						_Logger_Console({"debugLevel":CONSTANTS['LEVEL_ERROR'],"logMsg":"console.dirxml could not be executed"});
					}
					break;
				case 'table':
					if(_Verify_Level(obj, 'LEVEL_ALL') && !_Verify_Type('TYPES_EMPTY',console.table)){
						console.table(obj.logObj);
					} else {
						_Logger_Console({"debugLevel":CONSTANTS['LEVEL_ERROR'],"logMsg":"console.table could not be executed"});
					}
					break;
				case 'warn':
					if(_Verify_Level(obj, 'LEVEL_WARN'))
						if(obj.logObjs != null) {
							console.warn(obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.warn(_Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
					break;
				case 'log':
				default :
					if(_Verify_Level(obj, 'LEVEL_FATAL'))
						if(obj.logObjs != null) {
							console.log(obj.logObjs[0], obj.logObjs[1], obj.logObjs[2]);
						} else {
							console.log(_Verify_Type('TYPES_FLAT', obj.logMsg)?obj.logMsg:obj.logObj);
						}
			}
		}
	}

	function _Get_Formatted_Msg(obj, msg) {
		let fmtmsg = "";
		if(obj.logLabel != null) fmtmsg += obj.logLabel;
		if(obj.className != null) fmtmsg += (fmtmsg != ""?loggerJs.consts['FMT_DELIMITER']:"")+obj.className;
		if(obj.methodName != null) fmtmsg += (fmtmsg != ""?loggerJs.consts['FMT_DELIMITER']:"")+obj.methodName;
		fmtmsg += (fmtmsg != ""?loggerJs.consts['FMT_DELIMITER']:"")+msg;
		return fmtmsg;
	}
	function _Get_Obj_Name(obj) {
		if(obj == null) return "Null";
	   const funcNameRegex = /function (.{1,})\(/;
	   const results = (funcNameRegex).exec(obj.constructor.toString());
	   return (results && results.length > 1) ? results[1] : "";
	}

	function _Set_Option(instance, name, value, obj = null){
		if(obj == null) obj = instance._options;
		obj[name] = value;
		return obj;
	}
	function _Set_Options(instance, pairs, obj = null){
		if(obj == null) obj = instance._options;
		for(let key in pairs){
			obj[key] = pairs[key];
		}
		return obj;
	}

	function _Verify_Level(obj, level){
		return obj.debugLevel>=loggerJs.consts[level];
	}
	function _Verify_Type(types, argument){
		return loggerJs.consts[types].includes(typeof argument);
	}

	function _Set_Fnc_Options(obj, input) {

		if(_Verify_Type('TYPES_FLAT', input.arg1)){
			if(_Verify_Type('TYPES_EMPTY', obj.className)) {
				if(_Verify_Type('TYPES_FLAT', input.arg2)){
					obj = _Set_Option(this, 'className', input.arg2, obj);
				} else if (_Verify_Type('TYPES_OBJECT', input.arg2)) {
					obj = _Set_Option(this, 'className', _Get_Obj_Name(input.arg2), obj);
				}
			}

			if(_Verify_Type('TYPES_EMPTY', obj.methodName)) {
				if(_Verify_Type('TYPES_FLAT', input.arg3)){
					obj = _Set_Option(this, 'methodName', input.arg3, obj);
				} else if (_Verify_Type('TYPES_OBJECT', input.arg3)) {
					obj = _Set_Option(this, 'methodName', input.caller, obj);
				}
			}

			obj = _Set_Option(this, 'logMsg', _Get_Formatted_Msg(obj,input.arg1), obj);
		} else {

			if(!_Verify_Type('TYPES_EMPTY', input.arg2)) {
				obj = _Set_Option(this, 'logObjs', [input.arg1, input.arg2], obj);
			} else {
				obj = _Set_Option(this, 'logObj', input.arg1, obj);
			}

		}

		return obj;

	}

	let loggerJs = function(obj) {

		let instance;

		if (typeof (obj) === 'object') {
	      // create a new instance
	      instance = new Logger(obj);

	    } else if (typeof (obj) === 'string') {
	      // set the label
	      const options = {
	    		  logLabel : obj
	      	};

	        instance = new Logger(options);
	    } else {

	      // use defaults
	      instance = new Logger();
	    }

	    // add instance to list of _instances
	    // passing group to _stamp to increment
	    // from 0 onward somewhat reliably
	    loggerJs.instances[ _stamp(instance, 'introjs-instance') ] = instance;

		return instance;

	};

	loggerJs.version = VERSION;
	loggerJs.consts = CONSTANTS;

	loggerJs.instances = {};

	loggerJs.fn = Logger.prototype = {
		assert: function (assertion, arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Options(this, {
				logLevel: 'debug',
				assert: assertion
			});
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Assert(obj);
		},
		clear: function () {
			_Logger_Clear();
		},
		clone: function () {
			return new Logger();
		},
		count: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Count(loggerJs.consts['START'],obj);
		},
		countReset: function () {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Count(loggerJs.consts['RESET'],obj);
		},
		debug: function (arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Option(this, 'logLevel', 'debug');
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		},
		dir: function (object) {
			let obj = _Set_Option(this, 'logLevel', 'dir');
			obj = _Set_Fnc_Options(obj, {
				'logObj': object,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		},
		dirxml: function (object) {
			const obj = _Set_Option(this, 'logObj', object);
			_Logger_Console(obj);
		},
		error: function (arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Option(this, 'logLevel', 'error');
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		},
		exception: function (arg1, arg2 = null, arg3 = null) {
			this.error(arg1, arg2, arg3);
		},
		group: function () {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Group(loggerJs.consts['START'],obj);
		},
		groupCollapsed: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Group(loggerJs.consts['COLLAPSED'],obj);
		},
		groupEnd: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Group(loggerJs.consts['END'],obj);
		},
		info: function (arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Option(this, 'logLevel', 'info');
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		},
		log: function (arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Option(this, 'logLevel', 'log');
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		},
		profile: function () {
			_Logger_Profile(loggerJs.consts['START']);
		},
		profileEnd: function () {
			_Logger_Profile(loggerJs.consts['END']);
		},
		table: function (arg1) {
			const obj = _Set_Options(this, {
				logLevel: "table",
				logObj: arg1
			});
			_Logger_Console(obj);
		},
		time: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Timer(loggerJs.consts['START'],obj);
		},
		timeEnd: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Timer(loggerJs.consts['END'],obj);
		},
		timeLog: function (label) {
			const obj = _Set_Option(this, 'logLabel', label);
			_Logger_Timer(loggerJs.consts['LOG'],obj);
		},
		timeStamp: function () {
			_Logger_Profile(loggerJs.consts['STAMP']);
		},
		trace: function (arg1) {
			let obj = _Set_Option(this, 'logLevel', 'trace');
			if(_Verify_Type('TYPES_FLAT', arg1)) obj = _Set_Option(this, 'logMsg', _Get_Formatted_Msg(obj,arg1), obj);
			if(_Verify_Type('TYPES_OBJECT', arg1)) obj = _Set_Option(this, 'logObj', arg1, obj);
			_Logger_Console(obj);
		},
		warn: function (arg1, arg2 = null, arg3 = null) {
			let obj = _Set_Option(this, 'logLevel', 'warn');
			obj = _Set_Fnc_Options(obj, {
				'arg1': arg1,
				'arg2': arg2,
				'arg3': arg3,
				'caller': _Verify_Type('TYPES_EMPTY', this.caller)?null:this.caller
			});
			_Logger_Console(obj);
		}
	}

	return loggerJs;
});
