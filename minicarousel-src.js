function minicarousel(configuration) {

	this._settings = configuration;
	this._scrollingElement = document.getElementById(this._settings.scrollingElementId);
	this._isVertical = this._settings.mode == 'vertical' ? true : false;
	this._timeout = this._settings.timeout == undefined ? 100 : this._settings.timeout;

	this.buildWrapperHTML();
	
	return this;
};

minicarousel.prototype.buildWrapperHTML = function() {

	var parentElement = this._scrollingElement.parentNode;
	
	this._scrollingElement.style.left = 0;
	this._scrollingElement.style.top = 0;
	this._scrollingElement.style.position = 'relative';
		
	var carousel = document.createElement('div');
	carousel.setAttribute('id', 'carousel_home_' + this._settings.scrollingElementId);
	carousel.style.width = this._settings.width;
	carousel.style.overflow = 'hidden';
	
	var scrollingWrapper = document.createElement('div');
	scrollingWrapper.setAttribute('id', 'carousel_wrapper_' + this._settings.scrollingElementId);
	scrollingWrapper.style.width = this._settings.width;
	scrollingWrapper.style.height = this._settings.height;
	scrollingWrapper.style.overflow = 'hidden';
	scrollingWrapper.appendChild(this._scrollingElement);
	
	var that = this;
	
	this._leftOrUpSpan = document.createElement('span');
	this._leftOrUpSpan.setAttribute('id', (this._isVertical ? 'carousel_up_' : 'carousel_left_') + this._settings.scrollingElementId);
	this._leftOrUpSpan.innerHTML = this._settings.leftOrUpHTML.disabled != null ? this._settings.leftOrUpHTML.disabled : this._settings.leftOrUpHTML.enabled;	
	(window.ActiveXObject) ? this._leftOrUpSpan.style.styleFloat = 'left' : this._leftOrUpSpan.style.cssFloat = 'left';
	this._leftOrUpSpan.onmouseover = function(){that._leftOrUpSpan.style.cursor = 'pointer'};
	
	this._rightOrDownSpan = document.createElement('span');
	this._rightOrDownSpan.setAttribute('id', (this._isVertical ? 'carousel_down_' : 'carousel_right_') + this._settings.scrollingElementId);
	this._rightOrDownSpan.innerHTML = this._settings.rightOrDownHTML.enabled;	
	(window.ActiveXObject) ? this._rightOrDownSpan.style.styleFloat = 'right' : this._rightOrDownSpan.style.cssFloat = 'right';	
	this._rightOrDownSpan.onmouseover = function(){that._rightOrDownSpan.style.cursor = 'pointer'};
	
	this.addOnclickHandlers();
	
	var header = document.createElement('div');
	header.setAttribute('id', 'carousel_header_' + this._settings.scrollingElementId);
	header.style.display = 'block';
	header.appendChild(this._leftOrUpSpan);
	header.appendChild(this._rightOrDownSpan);
	var br = document.createElement('br');
	br.style.clear = 'both';
	header.appendChild(br);
	
	carousel.appendChild(header);
	carousel.appendChild(scrollingWrapper);
	parentElement.appendChild(carousel);
};
	
minicarousel.prototype.getCurrentPos = function() {

	return this._isVertical ? parseInt(this._scrollingElement.style.top)  : parseInt(this._scrollingElement.style.left);
};
	
minicarousel.prototype.getLeftTargetPos = function() {

	return this.getCurrentPos() + this._settings.amountToScroll;
};

minicarousel.prototype.getTopTargetPos = function() {

	return this.getCurrentPos() + this._settings.amountToScroll;
};

minicarousel.prototype.getRightTargetPos = function() {

	return this.getCurrentPos() - this._settings.amountToScroll;
};

minicarousel.prototype.getBottomTargetPos = function() {

	return this.getCurrentPos() - this._settings.amountToScroll;
};

minicarousel.prototype.setNewPos = function(pos) {

	if (this._isVertical) {
		this._scrollingElement.style.top = pos + 'px';
	}
	else {
		this._scrollingElement.style.left = pos + 'px';
	}
};

minicarousel.prototype.stopHorizontal = function() {

	return (parseInt(this._settings.amountToScroll) - parseInt(this._scrollingElement.style.width));
};

minicarousel.prototype.stopVertical = function() {

	return (parseInt(this._settings.amountToScroll) - parseInt(this._scrollingElement.style.height));
};

minicarousel.prototype.removeOnclickHandlers = function() {

	this._leftOrUpSpan.onclick = null;
	this._rightOrDownSpan.onclick = null;
};

minicarousel.prototype.addOnclickHandlers = function() {

	var that = this;
	this._rightOrDownSpan.onclick = this._isVertical ? function(){that.moveDown(that.getBottomTargetPos())} : function(){that.moveRight(that.getRightTargetPos())};
	this._leftOrUpSpan.onclick = this._isVertical ? function(){that.moveUp(that.getTopTargetPos())} : function(){that.moveLeft(that.getLeftTargetPos())};
};

minicarousel.prototype.disableLeftTop = function() {

	if (this._settings.leftOrUpHTML.disabled != null) {
		this._leftOrUpSpan.innerHTML = this._settings.leftOrUpHTML.disabled;
	}
};

minicarousel.prototype.enableLeftTop = function() {

	this._leftOrUpSpan.innerHTML = this._settings.leftOrUpHTML.enabled;
};

minicarousel.prototype.disableRightBottom = function() {

	if (this._settings.rightOrDownHTML.disabled != null) {
		this._rightOrDownSpan.innerHTML = this._settings.rightOrDownHTML.disabled;
	}
};

minicarousel.prototype.enableRightBottom = function() {

	this._rightOrDownSpan.innerHTML = this._settings.rightOrDownHTML.enabled;
};

minicarousel.prototype.moveRight = function(targetPos) {

	var currentPos = this.getCurrentPos();	
	this.removeOnclickHandlers();
	
	this.enableLeftTop();
	
	if (currentPos == this.stopHorizontal()) {
		this.addOnclickHandlers();
		this.disableRightBottom();
		return;
	}
	
	this.calculateAndSetNewRightOrDownPos(targetPos, currentPos);
		
	if (this.positionsAreEqual(currentPos, targetPos)) {		
		return;
	}
	
	var that = this;
	timer = setTimeout(function() {
		that.moveRight(targetPos);
	}, this._timeout);
};

minicarousel.prototype.moveDown = function(targetPos) {

	var currentPos = this.getCurrentPos();
	this.removeOnclickHandlers();
			
	this.enableLeftTop();
	
	if (currentPos == this.stopVertical()) {
		this.addOnclickHandlers();
		this.disableRightBottom();
		return;
	}
	
	this.calculateAndSetNewRightOrDownPos(targetPos, currentPos);
	
	if (this.positionsAreEqual(currentPos, targetPos)) {		
		return;
	}
	
	var that = this;
	timer = setTimeout(function() {
		that.moveDown(targetPos);
	}, this._timeout);
};

minicarousel.prototype.moveLeft = function(targetPos) {

	var currentPos = this.getCurrentPos();
	this.removeOnclickHandlers();
	
	this.enableRightBottom();
	
	if (currentPos == 0) {
		this.addOnclickHandlers();
		this.disableLeftTop();
		return;
	}
	
	this.calculateAndSetNewLeftOrUpPos(targetPos, currentPos);
			
	if (this.positionsAreEqual(currentPos, targetPos)) {		
		return;
	}
	
	var that = this;
	timer = setTimeout(function() {
		that.moveLeft(targetPos);
	}, this._timeout);
};

minicarousel.prototype.moveUp = function(targetPos) {

	var currentPos = this.getCurrentPos();
	this.removeOnclickHandlers();
	
	this.enableRightBottom();
	
	if (currentPos == 0) {
		this.addOnclickHandlers();
		this.disableLeftTop();
		return;
	}
	
	this.calculateAndSetNewLeftOrUpPos(targetPos, currentPos);
	
	if (this.positionsAreEqual(currentPos, targetPos)) {		
		return;
	}
	
	var that = this;
	timer = setTimeout(function() {
		that.moveUp(targetPos);
	}, this._timeout);
};

minicarousel.prototype.calculateAndSetNewLeftOrUpPos = function(targetPos, currentPos) {

	var change = Math.abs(targetPos) - Math.abs(currentPos);
	var newPos = currentPos - Math.floor((change/2));
	this.setNewPos(newPos);
};

minicarousel.prototype.calculateAndSetNewRightOrDownPos = function(targetPos, currentPos) {

	var change = Math.abs(targetPos) - Math.abs(currentPos);
	var newPos = currentPos - Math.ceil((change/2));
	this.setNewPos(newPos);
};

minicarousel.prototype.positionsAreEqual = function(currentPos, targetPos) {

	if (currentPos == targetPos) {
		clearTimeout(timer);
		this.addOnclickHandlers();
		return true;
	}
	return false;
};