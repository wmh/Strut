define(['strut/deck/Slide'], function(Slide) {
		var Create, Move, Remove, result;
		Create = function(deck, index) {
			this.deck = deck;
			this.index = index;
			return this;
		};
		Create.prototype = {
			"do": function() {
				var slides;
				slides = this.deck.get("slides");
				if (this.slide === undefined) {
					this.slide = new Slide({
						num: slides.length
					});
				}

				if (this.index == null)
					slides.add(this.slide);
				else
					slides.add(this.slide, {at: this.index})
				return this.slide;
			},
			undo: function() {
				this.deck.get("slides").remove(this.slide);
				return this.slide;
			},
			name: "Create Slide"
		};

		var Paste = function(deck, slide) {
			this.deck = deck;
			this.slide = slide;
		};

		Paste.prototype = {
			"do": function() {
				this.deck.get('slides').add(this.slide);
			},
			undo: function() {
				this.deck.get('slides').remove(this.slide);
			},
			name: 'Paste Slide'
		};

		Remove = function(deck, slide) {
			this.deck = deck;
			this.slide = slide;
			return this;
		};
		Remove.prototype = {
			"do": function() {
				var slides;
				slides = this.deck.get("slides");
				this._idx = slides.indexOf(this.slide);
				slides.remove(this.slide);
				this.slide.off();
				return this.slide;
			},
			undo: function() {
				this.slide.on('unrender', this.slide._unrendered, this.slide);
				return this.deck.get("slides").add(this.slide, {
					at: this._idx
				});
			},
			name: "Remove Slide"
		};
	 
		return {
			Create: Create,
			Remove: Remove,
			Paste: Paste
		};
	});
