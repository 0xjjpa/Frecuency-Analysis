$(document).ready(function() {

	function ViewModel() {
		var self = this;
		self.cipherText = ko.observable("")
		self.plainText = ko.observable("Please input something to propose a text");
		self.analysis = ko.observable();

		self.chart = ko.observable({
			chart: {
				renderTo: 'container',
				type: 'bar'
			},
			title: {
				text: 'Frecuency Analysis'
			},
			xAxis: {
				categories: ['Letters']
			},
			yAxis: {
				title: {
					text: 'Chracters Detected'
				}
			},
			series: []
		});

		var frecuencyEnglish = [
			{key: "a", value: 8.167},
			{key: "b", value: 1.492},
			{key: "c", value: 2.782},
			{key: "d", value: 4.253},
			{key: "e", value: 12.702},
			{key: "f", value: 2.228},
			{key: "g", value: 2.015},
			{key: "h", value: 6.094},
			{key: "i", value: 6.966},
			{key: "j", value: 0.153},
			{key: "k", value: 0.772},
			{key: "l", value: 4.025},
			{key: "m", value: 2.406},
			{key: "n", value: 6.749},
			{key: "o", value: 7.507},
			{key: "p", value: 1.929},
			{key: "q", value: 0.095},
			{key: "r", value: 5.987},
			{key: "s", value: 6.327},
			{key: "t", value: 9.056},
			{key: "u", value: 2.758},
			{key: "v", value: 0.978},
			{key: "w", value: 2.360},
			{key: "x", value: 0.150},
			{key: "y", value: 1.974},
			{key: "z", value: 0.074},
		];

		frecuencyEnglish.sort(function(a,b) {
			return a.value - b.value;
		})

		var frecuencyAlgorithm = function(text) {
			var hashDictionary = {}
			for (var i = 0, len = text.length; i < len; i++) {
				if(hashDictionary[text[i]]) {
					hashDictionary[text[i]] = ++hashDictionary[text[i]];
				} else {
					hashDictionary[text[i]] = 1;
				}
			}
			var series = [];
			var rawArray = [];
			for (var k in hashDictionary) {
				if (hashDictionary.hasOwnProperty(k)) {
					var letter = k;
					var value = hashDictionary[k];

					series.push({
						name: letter,
						data: [value]
					});

					rawArray.push({
						key: letter,
						value: value
					});


				}
			}

			rawArray.sort(function(a, b) {
				return a.value - b.value;
			});

			self.analysis({series: series, orderedSeries: rawArray});
		}

		self.cipherText.subscribe(function(text) {
			frecuencyAlgorithm(text)
			var tmpChart = self.chart();
			tmpChart.series = self.analysis().series;
			self.chart(tmpChart);
			self.drawHighchart();
			self.simpleSubstitution();
		})

		self.simpleSubstitution = function() {
			var cipherText = self.cipherText().toLowerCase();
			var cipherFrecuency = self.analysis().orderedSeries;
			var regExp, cipherLetter;
			for (var i = 0, len = cipherFrecuency.length; i < len; i++) {
				cipherLetter = cipherFrecuency[i].key;
				regExp = new RegExp(cipherLetter, "ig");
				cipherText = cipherText.replace(regExp, frecuencyEnglish[i].key);
			}
			self.plainText(cipherText);
		}

		self.drawHighchart = function() {
			new Highcharts.Chart(self.chart());
		}

		self.drawHighchart()
	}

	var viewModel = new ViewModel();
	ko.applyBindings(viewModel);
})