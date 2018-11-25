var s3dCtrls = {
	SelectTree : function(replaceElement, objects, styleClass, checkable, onSelect, onCheck) {
		var selected = null,
			self = $('<ul class="' + styleClass + '"/>');
		self.getSelected = function() {
			return selected;
		};
		self.onSelect = function(callback) {
			onSelect = callback;
			select(selected);
		};
		self.onCheck = function(callback) {
			onCheck = callback;
		};
		
		function select(object) {
			selected = object;
			
			if (typeof onSelect == 'function') {
				onSelect(selected);
			}
		}
		
		function check(object, checked) {
			if (typeof onCheck == 'function')  {
				onCheck(object, checked);
			}
		}
		
		function createObjectSelectors(o, parent, recursionDepth) {
			var title = '' + o;
			var a = $('<a href="javascript://select:' + title.replace(/[^\w]/g, '_') + '">' + title + '</a>');
			var li = $('<li/>');
			
			if (checkable) {
				var checkbox = $('<input type="checkbox" checked="checked"/>');
				checkbox.click(function() {
					check(o, this.checked);
				});
				li.append(checkbox);
			}
			
			$(parent).append(li.append(a));
			
			a.click(function() {
				select(o);
			});
			
			// run recursive
			if (typeof o.children == 'function') {
				var children = o.children();
				
				if (children.length > 0) {
					var ul = $('<ul/>');
					
					for (var i = 0; i < children.length; i++) {
						createObjectSelectors(children[i], ul, recursionDepth + 1);
					}
					
					li.append(ul);
				}
			}
		}
		
		for (var i = 0; i < objects.length; i++) {
			createObjectSelectors(objects[i], self, 0);
		}
		
		$(replaceElement).replaceWith(self);
		
		select(objects[0]);
		
		return self;
	},

	VectorEditor : function(replaceElement) {
		var self = $('<div/>'),
			x = $('<input name="x" value="" size="5"/>'),
			y = $('<input name="y" value="" size="5"/>'),
			z = $('<input name="z" value="" size="5"/>');
		
		self.append(' x: ').append(x)
			.append(' y: ').append(y)
			.append(' z: ').append(z);
		
		$(replaceElement).replaceWith(self);
		
		self.setValues = function(v) {
			x.val(v[0]);
			y.val(v[1]);
			z.val(v[2]);
		};
		self.getValues = function() {
			return new Float32Array([x.val(), y.val(), z.val()]);
		};
		
		return self;
	},
	
	FloatEditor : function(replaceElement, title) {
		var self = $('<div/>'), input = $('<input name="floatval" value=""/>');
		self.append(title + ': ').append(input);
		self.val = function() {
			return arguments.length == 1 ? input.val(arguments[0]) : input.val();
		};
		
		$(replaceElement).replaceWith(self);
		
		return self;
	}
};