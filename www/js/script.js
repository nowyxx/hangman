$(document).ready(function () {
	$('#myModal').modal('show');

});

// w następnej wersji skupić się na zmniejszeniu ilości poniższych zmiennych
//nadać animacje przy zmianie obrazu
var word;
var word_length;
var word1;
var fail_num = 0;
var wins = 0;
var rwins;
var rtime;
var tmr;

var w = document.getElementById("miss");
w.innerText = "Pomyłki: 0";
var recordnumber = document.getElementById("record");
recordnumber.innerHTML = document.cookie;


var buttons = document.getElementsByClassName("btn-letter");
for (let i = 0; i < buttons.length; i++) {
	let b = buttons[i];
	b.addEventListener('click', function () {
		sprawdz1(this);
	});
}
var s = document.getElementById("btn-start");
s.addEventListener("click", function () {
	startgame();
	timer();
});

function startgame() {
	word1 = '';
	word = '';

	ajaxget("http://localhost/server/get_has.php",
		function (data) {
			var pom = Math.floor(Math.random() * (121 - 1) + 1);
			word = data.problems[pom].value;
			console.log(word);
			word_length = word.length;

			for (i = 0; i < word_length; i++) {
				if (word.charAt(i) == " ") word1 = word1 + " ";
				else word1 = word1 + "-";
			}
			set_letter();
			word = word.toUpperCase();

		});


}
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function checkCookie(r) {
	var record = getCookie("rekord"); // Pobierz ciasteczko 
	// Test ciasteczka
	if (record != "") {
		// Ciasteczko istnieje
		setCookie("rekord", r, 365);
	} else {
		// Ciasteczko nie istnieje
		if (record != "" && r != null) {
			setCookie("rekord", r, 365); // Zapisz ciasteczko
		}
	}
}
function timer() {
	var time = 0,
		elapsed = '0:0';
	tmr = window.setInterval(function () {
		time += 1000;
		elapsed = Math.floor(time / 10000);
		if (Math.round(elapsed) == elapsed) { elapsed }
		var timer = document.getElementById("timer");
		timer.innerText = "Czas: " + elapsed;
		rtime = elapsed;

	}, 100);

}

function ajaxget(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			//console.log('responseText:' + xhr.responseText);
			try {
				var data = JSON.parse(xhr.responseText);
			} catch (err) {
				console.log(err.message + " in " + xhr.responseText);
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

String.prototype.ustawZnak = function (miejsce, znak) {
	if (miejsce > this.length - 1) return this.toString();
	else return this.substr(0, miejsce) + znak + this.substr(miejsce + 1);
}

function clearKeyboard() {
	var btnarray = document.getElementsByClassName("btn-letter");
	for (let i = 0; i <= btnarray.length - 1; i++) {
		btnarray[i].classList.remove("false");
		btnarray[i].classList.remove("true");
		btnarray[i].disabled = false;
	}
}

function sprawdz1(el) {
	var trafiona = false;
	for (let i = 0; i < word_length; i++) {
		if (word.charAt(i) == el.innerText) {
			word1 = word1.ustawZnak(i, el.innerText);
			trafiona = true;
		}
	}
	el.disabled = true;

	if (trafiona == true) {
		el.className += " true";
		set_letter();
	}
	else {
		el.className += " false";
		//skucha
		fail_num++;
		var obraz = "img/s" + fail_num + ".jpg";
		document.getElementById("gallows").innerHTML = '<img src="' + obraz + '" alt="" />';
		w.innerText = "Pomyłki: " + fail_num;
	}
	//wygrana
	if (word == word1) {
		wins++;
		startgame();
		clearKeyboard();
	}
	//przegrana
	if (fail_num >= 9) {
		window.clearInterval(tmr);
		//c = document.getElementById("timer");
		//c.className+= "d-none";

		document.getElementById("alphabet-container").innerHTML = "Przegrana! Prawidłowe hasło: " + word + '<br /><br /><p>Odgadniętych powiedzeń: ' + wins + '</p><span class="reset" onclick="location.reload()">JESZCZE RAZ?</span>';
		var rekord = Math.round(rtime * wins / fail_num),
			txt = document.cookie,
			numb = txt.match(/\d/g);
		numb = numb.join("");
		console.log(rekord);

		if (rekord > numb) {
			checkCookie(rekord);
		}
		var arows = document.getElementsByClassName("alphabet-row");
		for (let i = 1; i <= (arows.length); i++)
			arows[i].style.display = "none";
	}
}
