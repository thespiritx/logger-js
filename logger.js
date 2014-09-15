var logger = function(){
	logger.info("Please call a specific logging function");
};
logger.debug = function(msg){
	if(window.console)
		console.debug(msg);
};
logger.info = function(msg){
	if(window.console)
		console.info(msg);
};
logger.warn = function(msg){
	if(window.console)
		console.warn(msg);
};
logger.error = function(msg){
	if(window.console)
		console.error(msg);
};
logger.log = function(msg){
	if(window.console)
		console.log(msg);
};
window.logger = logger;