logger-js
=========

A simple Logging utility for Javascript as used on webpages to print messages to the embedded browser console without causing error in cases where window.console is not available.  This also acts as a shim in most cases for older browsers with limited functions on window.console.

Installation
============

Download to web viewable directly and reference the script in your html file.

<script src="${install-directory}/logger.js></script>

Usage
=============
<script>
	var logger = new loggerJS(options);
</script>

Options
=============
logLevel - default log level used
className - explicit class being executed from
methodName - explicit method name
logMsg - default message to be logged
logObj - default object to be logged
debugLevel - level of debugging allowed to be shown
assertToggle - toggle for allowing asserts

Methods
=============

Use the functions available for console on https://developer.mozilla.org/en-US/docs/Web/API/Console from logger.

Version History
=============

1.0.0 
- Initial JS Object, built to personal need

2.0.0
- Second build, using additional ES2015 types.
- Built around objects specifiec on https://developer.mozilla.org/en-US/docs/Web/API/Console
- Minification provided by: https://javascript-minifier.com/
- Obfucation provided by: https://javascriptobfuscator.com/Javascript-Obfuscator.aspx

2.0.1
- Corrected className and methodName overrides
- Corrected usage of console functions

Future
=============
Allow other methods of logging other than window.console
Browser determining on whether window.console is available (mobile), toggle whether to use browser behavior.