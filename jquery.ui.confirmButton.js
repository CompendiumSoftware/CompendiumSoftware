/**
 *
 * JQuery UI Confirm Button plugin
 *
 * Author: Stephen Gregory
 * Date: 10/19/2011
 *
 * This plugin expands the functionality of the jquery button plugin to make it modal. This provides a simple mechanism
 * for hiding ejection levers.
 * 
 * There are two modes 'normal' and 'confirm'.
 *
 * In normal mode clicking the button changs the button to 'confirm' mode.
 * In confirm mode clicking the button triggers a 'confirmedclick' event.  Clicking elsewhere on the screen
 * will cause the button to revert to normal mode.
 *
 **/
(function($){

	$.widget('ui.confirmButton',{
		options: {
			confirmStyle: 'ui-confirm',
			normalStyle : 'ui-confirm-normal',
			button: {},
			confirmLabel: 'Confirm'
		},
	
		//
		// Set up the widget
		//
		_create: function(){
			var self = this,
				o = self.options,
				el = self.element;

			this.current_mode = 'normal';
			el.button(o.button);
			el.addClass(this.options.normalStyle);
			if(typeof o.button.label === 'undefined' ){	
				self.originalLabel = "";
			}else{
				self.originalLabel = o.button.label;
			}

			$(document).bind('click',this, this._click_handler );
		},

		//
		// Options
		//
		// button options should be set via .button()
		//
		_setOption: function(option, value){
		
			if(option == 'confirmLabel'){
				this.options.confirmLabel =value;
				if(this.current_mode == 'confirm'){
					this.element.button('option', 'label', value);
				}
			}

			if(option == 'confirmStyle'){
				var oldStyle = this.options.confirmStyle;
				this.options.confirmStyle = value;
				if(this.current_mode === 'confirm'){
					this.element.removeStyle(oldStyle);
					this.element.addStyle(value);
				}
			}
			if(option == 'normalStyle'){
				var oldNormalStyle = this.options.normalStyle;
				this.options.normalStyle = value;
				if(this.current_mode === 'normal'){
					this.element.removeStyle(oldNormalStyle);
					this.element.addStyle(value);
				}
			}
		},

		//
		// Destroy object
		//
		destroy: function(){
			this.el.unbind('click');	
			$(document).unbind('click', this._click_handler);
		},

		//
		// transition back to normal mode
		//
		_back_to_normal: function(){	
			var self = this;
			self.mode('normal');
		},

		// transition animation to next state
		//
		_transition: function(self, targetmode, trans){
			self.current_mode = 'transition';
			var el = self.element;
			el.effect('slide',{ direction: "left",mode: 'hide' }, 250, function(){	
				el.removeClass(trans.remove );
				el.button('option', 'label',targetmode === 'normal'? self.originalLabel : self.options.confirmLabel);

				el.effect('slide',{ direction: "left", mode: 'show' }, 250, function(){
					self.current_mode = targetmode;	
					el.trigger('modechanged', self.current_mode);
					el.addClass(trans.add, 250);
				});
			});
		},

		//
		// Wrap click events
		//
		_click_handler: function(event){
			var self = event.data;
			if(self.element[0] !== event.originalTarget && self.element[0] !== event.srcElement && self.element[0] !== event.target  ){
				if(self.current_mode === 'confirm'){
					self._back_to_normal();		
				}
				return; 
			}

			if(self.current_mode === 'normal'){
				self.mode('confirm');
			}else if (self.current_mode === 'confirm'){
				self.element.trigger('confirmedclick');
			}

		},

		//
		// set/get the mode
		//
		// Will set the mode to the new value
		// 
		//
		mode: function(value){
			result = this.current_mode;
			if (typeof value !== 'undefined'){
				if(value != 'confirm' && value != 'normal' ){
					throw "Unknown mode value: "+value+".  Valid values are 'confirm' or 'normal'";					
				}
				if(this.current_mode != value){
					//if value == confirm
					var styles = {add: this.options.confirmStyle, remove: this.options.normalStyle};
					if(value == 'normal'){
						//swap if targeting normal mode
						styles = {remove: this.options.confirmStyle, add: this.options.normalStyle};
					}
					this._transition(this, value, styles);
				}
			}
			
			return result;
		}

	});

}(jQuery));
