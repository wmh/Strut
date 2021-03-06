define(['lexed'],
function(Lexed) {
	var rules = {
			initial: {
				'/\\*': function(text, lexed) {
					lexed.state('comment');
					return text;
				},

				'\\s+': function(text, lexed) {
					return text;
				},

				'[^{\\s\\/]+': function(text, lexed) {
					lexed.state('ruleName');
					return {text: text};
				}
			},

			ruleName: {
				'{': function(text, lexed) {
					lexed.state('ruleDefinition');
					return text;
				},

				'[^{]+': function(text, lexed) {
					return text;
				}
			},

			comment: {
				'\\*/': function(text, lexed) {
					lexed.state('initial');
					return text;
				},
				'\\*': function(text) {return text;},
				'[^*]': function(text) {return text;}
			},

			ruleDefinition: {
				'/\\*': function(text, lexed) {
					lexed.state('comment');
					return text;
				},

				'[^}]': function(text) {
					return text;
				},

				'}': function(text, lexed) {
					lexed.state('initial');
					return text;
				}
			}
		};

	return {
		beforeSave: function(cssText) {
			var allText = '';
			var l = new Lexed(cssText, null, rules);
			while((token = l.lex()) != Lexed.EOF) {
				if (token.text)
					allText += ".slideContainer " + token.text;
				else
					allText += token;
			}

			return allText;
		},

		beforeEdit: function(cssText) {
			if (cssText)
				return cssText.replace(/.slideContainer /g, "");
			return '';
		}
	};
});