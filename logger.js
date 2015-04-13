/*
 * Logger.js
 * Implementation similar to log4j
 *
 * Constructors
 * ------------
 * Logger(path) - path of class/function/placement that the logger is being defined for use with.
 * 
 */

var Logger = function(){
    if(arguments.length>=1){
        var newLogger = new Logger();
        var options = arguments.length>=2&&typeof arguments[2]=='object'?arguments:{'path':arguments[1]};
        newLogger._constructor(options);
        return newLogger;
    }
    return true;
}

// Constructor
Logger.prototype._constructor = function(options){
    this.fnc._this = this;
    this.fnc.formatters._this = this;     
    this.fnc.loggers._this = this;
    this.fnc.setOptions(options);
    
    var formatters = {
        'CLASS': function(){
             return this._this.attr.path;
        },
        'MSG': function(msg){
              return msg;  
        },
        'PATH': function(){
             return this._this.attr.path;
        },
        'UTC': function(){
             return new Date().toUTCString();
        }
    }
    for(var key in formatters){
        this.fnc.setFormatter(key,formatters[key]);
    };
    
    var loggers = {
        'debug': function(msg){
            console.debug(msg);
        },
        'info': function(msg){
            console.info(msg);
        },
        'warn': function(msg, loggerRef){
            console.warn(msg);
            if(loggerRef.attr.traceOnWarn) console.trace();
        },
        'error': function(msg, loggerRef){
            console.error(msg);
            if(loggerRef.attr.traceOnError) console.trace();
        },
        'log': function(msg){
            console.log(msg);
        },
        'object': function(object, loggerRef){
            if(loggerRef.attr.forceDir){
                console.dir(object);
            } else if(loggerRef.attr.forceJSON) {
                console.log(JSON.stringify(object));
            } else {
                console.log(object);
            }
        }
    }
    for(var key in loggers){
        this.fnc.setLogger(key,loggers[key]);
    };
    
}

// Attributes
Logger.attr = Logger.prototype.attr = {
    path: 'window',
    forceDir: false,
    forceJSON: false,
    format: '[%UTC%] %PATH% %MSG%',
    objectEcho: true,
    objectTypes: ['object'],
    traceOnError: true,
    traceOnWarn: false
};
Logger.fnc = Logger.prototype.fnc = {
    _this: this,
    formatters: function(type){
        return typeof this._this.fnc.formatters[type] == 'function';
    },
    formatMsg: function(msg){
        var formattedMsg = '';
        var formatAttr = this._this.attr.format.split('%');
        for(var i in formatAttr){
            var formatPiece = formatAttr[i];
            var pieceArray = formatPiece.split(' ');
            if(this._this.fnc.formatters(pieceArray[0])) {
                formattedMsg += this._this.fnc.formatters[pieceArray[0]](msg);
            } else {
                formattedMsg += pieceArray[0];
            }
            for(var j = 1; j < pieceArray.length; j++){
                formattedMsg += ' '+pieceArray[j];
            }
            if(i>0 && formatAttr.length-1 != i) formatPiece += ' ';
        }
        return formattedMsg;
    },
    loggers: function(level){
        return typeof this._this.fnc.loggers[level] == 'function';
    },
    print: function(msg,level){
        if(!level) var level = 'log';
        if(this._this.fnc.loggers(level)){
            formattedMsg = this._this.fnc.formatMsg(msg);
            this._this.fnc.loggers[level](formattedMsg, this._this);
            if(this._this.fnc.util.indexOf.call(this._this.attr.objectTypes,typeof msg) > -1 && this._this.attr.objectEcho){
                this._this.fnc.loggers['object'](msg, this._this);
            }
        }
    },
    setOptions: function(options){
        for(var attr in this._this.attr){
             if(this._attr in options && typeof options[attr] === typeof this._this.attr[attr]) this._this.attr[attr] = options[attr];
        }
    },
    setFormatter: function(key,fnc){
      this._this.fnc.formatters[key] = fnc;
    },
    setLogger: function(key,fnc){
      this._this.fnc.loggers[key] = fnc;
      this._this[key] = new Function('msg',  'return this.fnc.print(msg, "'+key+'");');
    },
    util: {
        isArray:function(obj){
            return (typeof obj !== 'undefined' && obj && obj.constructor === Array);
        },
        indexOf: function(needle) {
            if(typeof Array.prototype.indexOf === 'function') {
                indexOf = Array.prototype.indexOf;
            } else {
                indexOf = function(needle) {
                    var i = -1, index = -1;

                    for(i = 0; i < this.length; i++) {
                        if(this[i] === needle) {
                            index = i;
                            break;
                        }
                    }

                    return index;
                };
            }
            return indexOf.call(this, needle);
        }
    }
};