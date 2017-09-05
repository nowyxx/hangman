'use strict';

$(document).ready(function () {
	$('#myModal').modal({ backdrop: 'static', keyboard: false }, 'show');
});

var word = void 0;
var word_length = void 0;
var word1 = void 0;
var fail_num = 0;
var wins = 0;
var rwins = void 0;
var rtime = void 0;
var tmr = void 0;

var w = document.getElementById("miss");
var recordnumber = document.getElementById("record");

w.innerText = "Pomyłki: 0";
recordnumber.innerHTML = document.cookie;

var buttons = document.getElementsByClassName("btn-letter");
for (var i = 0; i < buttons.length; i++) {
	var b = buttons[i];
	b.addEventListener('click', function () {
		check1(this);
	});
}
var s = document.getElementById("btn-start");
s.addEventListener("click", function () {
	startgame();
	timer();
	if (document.cookie.indexOf('rekord') == -1) {
		document.cookie = "rekord=0";
	}
});

function startgame() {
	word1 = '';
	word = '';

	ajaxget("http://localhost/server/get_has.php", function (data) {

		var pom = Math.floor(Math.random() * (121 - 1) + 1);
		word = data.problems[pom].value;
		console.log(word);
		word_length = word.length;

		for (var _i = 0; _i < word_length; _i++) {
			if (word.charAt(_i) == " ") {
				word1 = word1 + " ";
			} else word1 = word1 + "-";
		}
		console.log(word_length);
		set_letter();
		word = word.toUpperCase();
	});
};

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var _i2 = 0; _i2 < ca.length; _i2++) {
		var c = ca[_i2].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function checkCookie(r) {
	var record = getCookie("rekord"); // Pobierz ciasteczko get cookie
	if (record != "") {
		setCookie("rekord", r, 365);
	} else {
		if (record != "" && r != null) {
			setCookie("rekord", r, 365); // Zapisz ciasteczko save cookie
		}
	}
}
function timer() {
	var time = 0,
	    elapsed = '0:0';
	tmr = window.setInterval(function () {
		time += 1000;
		elapsed = Math.floor(time / 10000);
		if (Math.round(elapsed) == elapsed) {
			elapsed;
		}
		var timer = document.getElementById("timer");
		timer.innerText = 'Czas:' + elapsed;
		rtime = elapsed;
	}, 100);
};

function ajaxget(url, callback) {
	var xhr = new XMLHttpRequest();
	var data = void 0;
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			try {
				data = JSON.parse(xhr.responseText);
			} catch (err) {
				console.log(err.message + ' in ' + xhr.responseText);
				return;
			}
			callback(data);
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
};

function set_letter() {
	document.getElementById("word").innerHTML = word1;
}

String.prototype.setChar = function (charnumber, char) {
	if (charnumber > this.length - 1) return this.toString();else return this.substr(0, charnumber) + char + this.substr(charnumber + 1);
};

function clearKeyboard() {
	var btnarray = document.getElementsByClassName("btn-letter");
	for (var _i3 = 0; _i3 <= btnarray.length - 1; _i3++) {
		btnarray[_i3].classList.remove("false");
		btnarray[_i3].classList.remove("true");
		btnarray[_i3].disabled = false;
	}
}

function check1(el) {
	var hit = false;
	for (var _i4 = 0; _i4 < word_length; _i4++) {
		if (word.charAt(_i4) == el.innerText) {
			word1 = word1.setChar(_i4, el.innerText);
			hit = true;
		}
	}
	el.disabled = true;

	if (hit == true) {
		el.className += " true";
		set_letter();
	} else {
		el.className += " false";
		//skucha wrong letter
		fail_num++;
		var pic = 'img/s' + fail_num + '.jpg';
		document.getElementById("gallows").innerHTML = '<img src="' + pic + '" alt="" />';
		w.innerText = 'Pomy\u0142ki: ' + fail_num;
	}
	//wygrana win
	if (word == word1) {
		wins++;
		startgame();
		clearKeyboard();
	}
	//przegrana lose
	if (fail_num >= 9) {
		window.clearInterval(tmr);

		document.getElementById("alphabet-container").innerHTML = 'Przegrana! Prawid\u0142owe has\u0142o:' + word + '<br /><br /><p>Odgadni\u0119tych powiedze\u0144: ' + wins + '</p><span class="reset" onclick="location.reload()">JESZCZE RAZ?</span>';
		var record = Math.round(rtime * wins / fail_num);
		var txt = document.cookie;
		var numb = txt.match(/\d/g);
		console.log(record);

		numb = numb.join("");

		if (record > numb) {
			checkCookie(record);
		}
		var arows = document.getElementsByClassName("alphabet-row");
		for (var _i5 = 1; _i5 <= arows.length; _i5++) {
			arows[_i5].style.display = "none";
		}
	}
}