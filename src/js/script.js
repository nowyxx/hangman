$(document).ready(() => {
	$('#myModal').modal({backdrop: 'static', keyboard: false},'show');
});

let word;
let word_length;
let word1;
let fail_num = 0;
let wins = 0;
let rwins;
let rtime;
let tmr;

const w = document.getElementById("miss");
let	recordnumber = document.getElementById("record");

	w.innerText = "Pomyłki: 0";
	recordnumber.innerHTML = document.cookie;


const buttons = document.getElementsByClassName("btn-letter");
	for (let i = 0; i < buttons.length; i++) {
		let b = buttons[i];
		b.addEventListener('click', function() {
			check1(this);
	});
}
const s = document.getElementById("btn-start");
	s.addEventListener("click", () => {
		startgame();
		timer();
		if (document.cookie.indexOf('rekord') == -1 ) {
			document.cookie = "rekord=0";
}
});

function startgame() {
	word1 = '';
	word = '';

	ajaxget("http://localhost/server/get_has.php", data => {

		const pom = Math.floor(Math.random() * (121 - 1) + 1);
			word = data.problems[pom].value;
			console.log(word);
			word_length = word.length;

			for ( let i = 0; i < word_length; i++) {
				if (word.charAt(i) == " ") 
				{
					word1 = word1 + " ";
			}
			else word1 = word1+ "-";
			}
			console.log(word_length);
			set_letter();
			word = word.toUpperCase();

		});
};

function setCookie(cname, cvalue, exdays) {
	let d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	const name = cname+"=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function checkCookie(r) {
	const record = getCookie("rekord"); // Pobierz ciasteczko get cookie
	if (record != "") {
		setCookie("rekord", r, 365);
	} else {
		if (record != "" && r != null) {
			setCookie("rekord", r, 365); // Zapisz ciasteczko save cookie
		}
	}
}
function timer() {
	let time = 0,
		elapsed = '0:0';
	tmr = window.setInterval(() => {
		time += 1000;
		elapsed = Math.floor(time / 10000);
		if (Math.round(elapsed) == elapsed) { elapsed }
	const timer = document.getElementById("timer");
		timer.innerText = `Czas:${elapsed}`;
		rtime = elapsed;

	}, 100);

};

function ajaxget(url, callback) {
	const xhr = new XMLHttpRequest();
	let  data;
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status == 200) {
			try {
				 data = JSON.parse(xhr.responseText);
			} catch (err) {
				console.log(`${err.message} in ${xhr.responseText}`);
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
	if (charnumber > this.length - 1) return this.toString();
	else return this.substr(0, charnumber) + char + this.substr(charnumber + 1);
}

function clearKeyboard() {
	const btnarray = document.getElementsByClassName("btn-letter");
	for (let i = 0; i <= btnarray.length - 1; i++) {
		btnarray[i].classList.remove("false");
		btnarray[i].classList.remove("true");
		btnarray[i].disabled = false;
	}
}

function check1(el) {
	let hit = false;
	for (let i = 0; i < word_length; i++) {
		if (word.charAt(i) == el.innerText) {
			word1 = word1.setChar(i, el.innerText);
			hit = true;
		}
	}
	el.disabled = true;

	if (hit == true) {
		el.className += " true";
		set_letter();
	}
	else {
		el.className += " false";
		//skucha wrong letter
		fail_num++;
	const pic = `img/s${fail_num}.jpg`;
		document.getElementById("gallows").innerHTML = `<img src="${pic}" alt="" />`;
		w.innerText = `Pomyłki: ${fail_num}`;
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

		document.getElementById("alphabet-container").innerHTML = `Przegrana! Prawidłowe hasło:${word}<br /><br /><p>Odgadniętych powiedzeń: ${wins}</p><span class="reset" onclick="location.reload()">JESZCZE RAZ?</span>`;
		let record = Math.round(rtime * wins / fail_num);
		let txt = document.cookie;
		let	numb = txt.match(/\d/g);
				console.log(record);

		numb = numb.join("");

		if (record > numb) {
			checkCookie(record);
		}
		let arows = document.getElementsByClassName("alphabet-row");
		for (let i = 1; i <= (arows.length); i++)
			arows[i].style.display = "none";
	}
}
