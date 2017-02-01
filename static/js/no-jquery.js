
document.getElementsByClassName('dropdown-toggle')[0].onclick = function(e) {
    var drop_menu = document.getElementsByClassName('dropdown-menu')[0];
    toggle(drop_menu)
}

function toggle(ele) {
    if (ele.style.display == 'none') {
        ele.style.display = 'block';
    }
    else if (ele.style.display == '') {
        ele.style.display = 'block';
    }
    else {
        ele.style.display = 'none';
    }
}



