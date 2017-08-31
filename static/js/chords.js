

var hr_lines = document.getElementsByClassName('hr_control');
var temp_lines = document.getElementsByClassName('temp_line');
var add_symbols = document.getElementsByClassName('add_symbol');
var transition_line = document.getElementsByClassName('transition_wrapper');


while (hr_lines[0]) {
    hr_lines[0].parentNode.removeChild(hr_lines[0]);
}

while (add_symbols[0]) {
    add_symbols[0].parentNode.removeChild(add_symbols[0]);
}

for (var i=0; i < temp_lines.length; i++) {
    temp_lines[i].style.marginBottom = '20px';
    temp_lines[i].style.fontSize = '14px';
    temp_lines[i].style.visibility = 'visible';
}

for (var i=0; i < transition_line.length; i++) {
    var line = transition_line[i];
    var lastC = line.lastChild;
    lastC.style.marginBottom = '0';
    line.insertBefore(lastC, line.firstChild)
}

function changeTone(e) {

    var chord_data = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    var tone = parseInt(e.getAttribute('tone'));
    var chords = document.getElementsByClassName('chord_value');

    for (i=0; i < chords.length; i++) {
    
        var chord_full = chords[i].innerHTML
        var chord_value = /[A-Z]{1}#?/.exec(chord_full);
        var chord_index = parseInt(chord_data.indexOf(chord_value[0]));
        var chord_ext = chord_full.substr(chord_value.length)

        if ( tone > 0) {
            if ( chord_index + tone > 11) {
                chord_index = chord_index + tone - 12;
            }
            else {
                chord_index = chord_index + tone;
            }
        }
        else {
            if ( chord_index + tone < 0 ) {
                chord_index = 12 + tone;
            }
            else {
                chord_index = chord_index + tone;
            }
        }

        chords[i].innerHTML = chord_data[chord_index] + chord_ext;
    }
}




