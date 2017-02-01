var config_file = ['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]

var app = angular.module('root', []);
app.config(config_file);

var data = {
    notes: [{val: 'A'},{val: 'A#'},{val: 'B'},
            {val: 'C'},{val: 'C#'},{val: 'D'},{val: 'D#'},
            {val: 'E'},{val: 'F'},{val: 'F#'},{val: 'G'},
            {val: 'G#'}],

    extensions: [{val: '4'}, {val: '5'}, {val: '5'}, {val: '6'},
                 {val: '7'}, {val: '9'}, {val: '11'}, {val: '13'}, {val: 'sus4'}, {val: 'aug'}, {val: 'dim'}, {val: 'dim7'},
                 {val: 'maj7'}, {val: 'mm'}, {val: 'm'}, {val: 'm7'}, {val: 'm7b5'}, {val: 'm9'}],

    basses: [{val: '/A'},{val: '/A#'},{val: '/B'},
            {val: '/C'},{val: '/C#'},{val: '/D'},{val: '/D#'},
            {val: '/E'},{val: '/F'},{val: '/F#'},{val: '/G'},
            {val: '/G#'}]
    } // Chords + Extensions

app.controller('chords_tools', ['$scope', function($scope) {
    $scope.notes = data.notes;
    $scope.extensions = data.extensions;
    $scope.basses = data.basses; $scope.note_selected; $scope.ext_selected; $scope.bass_selected;
}]);


function render_lyrics() {
    hideToolbar();
    var editor = document.getElementById('editor');
    localStorage.setItem('raw_lyrics', editor.value)

    var editor_lines = editor.value.split('\n');

    var lyrics = '';
    for (var i=0; i < editor_lines.length; i++) {

        if (editor_lines[i].trim() == 'פתיחה:') {
            continue;
        }

        if ( editor_lines[i].trim() == '---- פה תוכלו להכניס מעבר בעריכה----') {
            lyrics += '<div class="lyrics-line transition_chords_line" style="width: 400px;"><img class="add_symbol" src="static/img/plus.png" width="30"><div class="temp_line">הוסיפו אקורדים (המשפט יעלם)</div></div>';
            continue;
        }

        if( editor_lines[i].trim() == '---- פה תוכלו להכניס פתיחה בעריכה ----' ) {
            lyrics += '<div class="lyrics-line opening_chords_line" style="width: 400px;"><img class="add_symbol" src="static/img/plus.png" width="30"><div class="temp_line">הוסיפו אקורדים (המשפט יעלם)</div></div>';
            continue;
        }

        if ( editor_lines[i].trim() == '') {
            lyrics += '<br>';
        }
        else if (editor_lines[i].length > 70) {
            var ensure_space_line = editor_lines[i].substr(0,70).split(' ')
            ensure_space_line.pop()

            lyrics += '<div class="lyrics-line"><hr class="hr_control" ng-click="create_box"><div class="in_line">' + ensure_space_line.join(' ') + '</div></div><br>';
            lyrics += '<div class="lyrics-line"><hr class="hr_control" ng-click="create_box"><div class="in_line">' + editor_lines[i].substr(ensure_space_line.join(' ').length) + '</div></div><br>';

        }
        else {
            lyrics += '<div class="lyrics-line"><hr class="hr_control" ng-click="create_box"><div class="in_line">' + editor_lines[i].trim() + '</div></div><br>';
        }
    }

    var inner_render = document.getElementById('inner-lines');
    inner_render.innerHTML = lyrics;
    localStorage.setItem('lyrics', lyrics)
    setInterval(save_final, 10000);
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
}

document.querySelector('body').addEventListener('click', function(e) {
    if (e.target.className == 'add_symbol') {
        if ( e.target.nextSibling.className == 'temp_line' ) {
            if ( hasClass(e.target.parentNode, 'transition_chords_line')) {
                e.target.nextSibling.innerHTML = 'מעבר:';
            }
            else if ( hasClass(e.target.parentNode, 'opening_chords_line')){
                e.target.nextSibling.innerHTML = 'פתיחה:';
            }
            e.target.nextSibling.style.visibility = 'hidden';
            e.target.nextSibling.style.display = 'block';
        }

        resetSelect();

        getToolbarPosition(e, 50);

        if ( document.querySelector('.active_chord') ) {
            var active_t = document.querySelector('.active_chord');
            active_t.className = active_t.className.replace('active_chord', '');
        }
        var curr_box = document.getElementById('curr_box');

        if (curr_box) {
            if (curr_box.innerHTML.length == 0) {
                // if curr_box is empty
                var parent = curr_box.parentNode;
                parent.removeChild(curr_box);
            }
            else {
                document.getElementById('curr_box').removeAttribute('id');
            }
        }

        var t_chord = document.createElement('span');
        t_chord.className = 'transition_chord';
        t_chord.setAttribute('id', 'curr_box')
        e.target.parentNode.insertBefore(t_chord, e.target)
        e.target.parentNode.className += ' transition_wrapper';

    }

    if ( hasClass(e.target, 'hr_control') ) {

        if ( document.querySelector('.active_chord') ) {
            var active_t = document.querySelector('.active_chord');
            active_t.className = active_t.className.replace('active_chord', '');
        }

        resetSelect()

        try {
            document.querySelector('.active_chord').removeAttribute('active_chord');
        }
        catch(x) {

        }

        getToolbarPosition(e, 50)

        var curr_box = document.getElementById('curr_box');

        if (curr_box) {
            if (curr_box.innerHTML.length == 0) {
                // if curr_box is empty
                var parent = curr_box.parentNode;
                parent.removeChild(curr_box);
            }
            else {
                document.getElementById('curr_box').removeAttribute('id');
            }
        }

        // Create chord box
        var c_box = document.createElement('span');
        var cont_line = e.target.parentNode;

        c_box.className += 'word_chord_box ';
        c_box.setAttribute('id', 'curr_box');
        c_box.style.left = e.clientX - cont_line.getBoundingClientRect().left - 8 + 'px';
        cont_line.append(c_box)

        addStyles('chord-toolbar', {'visibility': 'visible'})

    }

    if ( hasClass(e.target, 'chord_value') ) {

        if ( document.querySelector('.active_chord') ) {
            document.querySelector('.active_chord').className = document.querySelector('.active_chord').className.replace('active_chord', '');
        }

        getToolbarPosition(e, 80);

        var curr_box = document.getElementById('curr_box');

        if (curr_box) {
            if (curr_box.innerHTML.length == 0) {
                // if curr_box is empty
                var parent = curr_box.parentNode;
                parent.removeChild(curr_box);
            }
            else {
                curr_box.removeAttribute('id');
            }
        }

        e.target.className += ' active_chord';
        e.target.setAttribute('id', 'curr_box')

        var curr_box = document.getElementById('curr_box');
        var chord_letter = /[A-Z]{1}#?/.exec(e.target.innerHTML);
        var chord_bass = /\/.*/.exec(e.target.innerHTML);
        var chord_ext = e.target.innerHTML.replace(chord_letter, '').replace(chord_bass, '');

        // Set select values
        if (chord_letter) {
            chords_select = document.querySelector('.chords-select').value = chord_letter;
        }
        else {
            document.querySelector('.chords-select').selectedIndex = 0;
            document.querySelector('.chords-select').disabled = false;
        }

        if (chord_bass) {
            document.querySelector('.bass-select').value = chord_bass;
            document.querySelector('.bass-select').disabled = false;
        }

        else {
            document.querySelector('.bass-select').selectedIndex = 0;
            document.querySelector('.bass-select').disabled = false;
        }

        if (chord_ext) {
            document.querySelector('.ext-select').value = chord_ext;
            document.querySelector('.ext-select').disabled = false;
        }

        else {
            document.querySelector('.ext-select').selectedIndex = 0;
            document.querySelector('.ext-select').disabled = false;
        }
    }
});

document.querySelector('.chords-select').addEventListener('change', function(e) {

    document.getElementsByClassName('ext-select')[0].disabled = false;
    document.getElementsByClassName('bass-select')[0].disabled = false;

    var curr_box = document.getElementById('curr_box');


    if (curr_box) {
        if (curr_box.innerHTML.trim().length > 0) {
            curr_box.innerHTML = curr_box.innerHTML.replace(/[A-Z]{1}#?/, document.querySelector('.chords-select').value);
        }

        else {
            addStyles('curr_box', {'backgroundColor':'transparent', 'border': 'none', 'height':'auto', 'width': 'auto'});
            curr_box.className += ' chord_value';
            curr_box.innerHTML = document.querySelector('.chords-select').value;
        }
    }
});

document.querySelector('.bass-select').addEventListener('change', function(e) {

    var curr_box = document.getElementById('curr_box');
    curr_box.innerHTML = curr_box.innerHTML.replace(/\/.*/, '') + document.querySelector('.bass-select').value;

    if ( hasClass(curr_box, 'word_chord_box') && !hasClass(curr_box, 'b_moved') )  {
        curr_box.style.left = parseFloat(curr_box.style.left) - 10 + 'px';
        curr_box.className += ' b_moved';
    }
})

var data_pos = {
    1: '8',
    2: '14',
    3: '22',
    4: '34'
}
document.querySelector('.ext-select').addEventListener('change', function(e){

    var curr_box = document.getElementById('curr_box');
    var ext_value = document.querySelector('.ext-select').value;

    if ( hasClass(curr_box, 'word_chord_box') && !hasClass(curr_box, 'e_moved') ) {
        curr_box.style.left = parseFloat(curr_box.style.left) - data_pos[ext_value.length] + 'px';
        curr_box.className += ' e_moved';
    }

    if ( /\/\.*/.test(curr_box.innerHTML) ) {
        var chord_letter = /[A-Z]{1}#?/.exec(curr_box.innerHTML);
        var bass = /\/.*/.exec(curr_box.innerHTML);
        curr_box.innerHTML = chord_letter + ext_value + bass;
    }
    else {
        var chord_letter = /[A-Z]{1}#?/.exec(curr_box.innerHTML);
        curr_box.innerHTML = chord_letter + ext_value;
    }
})


function getToolbarPosition(e, clickedElementPixels) {
    // Get positions for toolbar

    var tools = document.querySelector('.chord-toolbar');
    var container = document.querySelector('.rendered-lyrics-wrapper');
    var xPosition = e.clientX - container.getBoundingClientRect().left - (tools.clientWidth / 2);
    var yPosition = e.clientY - container.getBoundingClientRect().top - (tools.clientHeight / 2);
    if (xPosition >= 800) {
        tools.style.left = 800 + 'px';
    }

    else {
        tools.style.left = xPosition + 'px';
    }

    tools.style.top = yPosition - clickedElementPixels + 'px';
    tools.style.visibility = 'visible';
}



// ----- Editing Functions ! ----- //

function resetSelect() {
    // Reset select values & active_chord
    document.querySelector('.chords-select').selectedIndex = 0;
    document.querySelector('.bass-select').selectedIndex = 0;
    document.querySelector('.bass-select').disabled = true;
    document.querySelector('.ext-select').selectedIndex = 0;
    document.querySelector('.ext-select').disabled = true;
}

function expandRow() {
    if ( hasClass(document.querySelector('#curr_box').parentNode, 'transition_wrapper')) {
        return;
    }
    var curr_hr = document.getElementById('curr_box').previousElementSibling || document.getElementById('curr_box').previousSibling.previousSibling;
    curr_hr.style.width = '108%';
}

function deleteChord() {
    var curr_box = document.getElementById('curr_box');
    curr_box.parentNode.removeChild(curr_box);
    resetSelect()
}

function addOpening() {
    document.getElementById('editor').value = 'פתיחה:' + '\n ---- פה תוכלו להכניס פתיחה בעריכה ---- \n\n' + document.getElementById('editor').value;
}

function addChordsRow() {
    document.getElementById('editor').value += '\n ---- פה תוכלו להכניס מעבר בעריכה---- \n';
}

function hideToolbar() {
    document.getElementsByClassName('chord-toolbar')[0].style.visibility = 'hidden';
}

function save_final() {
    localStorage.setItem('lyrics_chords', document.querySelector('#inner-lines').innerHTML)
}

function addStyles(obj, styles) {
    var elem = document.getElementById(obj) || document.getElementsByClassName(obj)[0];
    for(var property in styles) {
        elem.style[property] = styles[property];
    }
}

function hasClass(ele, cls) {
    return (' ' + ele.className + ' ').indexOf(' ' + cls + ' ') > -1;
}









