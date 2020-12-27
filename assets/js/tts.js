	//code reference is taken from https://github.com/sentient-io/platform-demo_apps-tts
	
	document.getElementById("demo").style.display = "none";
	
	// Characters count bind on keyup
	document.getElementById('query').onkeyup = function () {
		var language = $("input[name='language']:checked").val();
		if (language == 0) {
			document.getElementById('count').innerHTML = "Characters left: " + (this.value.length + " / 750");
			if (this.value.length >= 751) {
				$("#confirmation-modal").modal();
				document.getElementById("errorTxt").innerHTML = "Speech Content allow upto 750 Characters. Please Try Again...";
				return false;
			}
		}
		else if (language == 1) {
			document.getElementById('count').innerHTML = "Characters left: " + (this.value.length + " / 2000");
			if (this.value.length >= 2001) {
				$("#confirmation-modal").modal();
				document.getElementById("errorTxt").innerHTML = "Speech Content allow upto 2000 Characters. Please Try Again";
				return false;
			}
		}
	};

	// Characters count method
	function charCount() {
		var language = $("input[name='language']:checked").val();
		var text = document.getElementById('query').value;
		if (language == 0) {
			document.getElementById('count').innerHTML = "Characters left: " + (text.length + " / 750");
		} if (language == 1) {
			document.getElementById('count').innerHTML = "Characters left: " + (text.length + " / 2000");
		}
	}
	
	//Process
	function keyPressMe() {
		$(".txt-to-speech").attr('disabled', true);
		document.getElementById("demo").style.display = "none";
		audio.pause();
		var language = $("input[name='language']:checked").val();
		var text = $('#query').val();
		var url = "";
		// Calling TTS ENG
		if (language == 1) {
			url = "https://apis.sentient.io/microservices/voice/ttseng/v0.1/getpredictions";
			if (text.length >= 2001) {
				$("#confirmation-modal").modal();
				document.getElementById("errorTxt").innerHTML = "Speech Content allow upto 2000 Characters. Please Try Again";
				return false;
			} else {
				document.getElementById("query").readOnly = true;
				$(".txt-to-speech").hide();
				$(".speech-processing").show();
			}
		}
		// Calling TTS SCH
		if (language == 0) {
			url = "https://apis.sentient.io/microservices/voice/ttssch/v0.1/getpredictions";
			if (text.length >= 751) {
				$("#confirmation-modal").modal();
				document.getElementById("errorTxt").innerHTML = "Speech Content allow upto 750 Characters. Please Try Again...";
				return false;
			} else {
				document.getElementById("query").readOnly = true;
				$(".txt-to-speech").hide();
				$(".speech-processing").show();
			}
		}
		// Process API
		$.ajax({
			url: url,
			method: "POST",
			headers: { 'x-api-key': apikey },
			contentType: 'application/json',
			data: JSON.stringify({ "text": text, "language": language }),
			timeout: 80000,
			success: function (result) {
				// Response
				$(".txt-to-speech").show();
				$(".speech-processing").hide();
				var audioString = "data:audio/mp3;base64," + result.audioContent;
				document.getElementById("demo").style.display = "block";
				var audio = document.getElementById('audio');
				audio.src = audioString;
				audio.crossOrigin = 'anonymous';
				audio.play();
				document.getElementById("query").readOnly = false;
			}, error: function (err) {
				$("#confirmation-modal").modal();
				document.getElementById("errorTxt").innerHTML = "Please check your content and Try Again...";
			}
		});
	}
	
	// Play audio method
	window.playAudio = function () {
		audio.crossOrigin = 'anonymous';
		audio.play();
	}

	// Clear audio and text
	function cleartextboxes() {
		$("#query").val("");
		$(".txt-to-speech").attr('disabled', true);
		document.getElementById("demo").style.display = "none";
		var language = $("input[name='language']:checked").val();
		if (language == 0) {
			document.getElementById('count').innerHTML = "Characters left: " + ("0 / 750");
		}
		else if (language == 1) {
			document.getElementById('count').innerHTML = "Characters left: " + ("0 / 2000");
		}
	}