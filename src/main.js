/**
 var observer = new IntersectionObserver(function(entries) {
	// isIntersecting is true when element and viewport are overlapping
	// isIntersecting is false when element and viewport don't overlap
	if(entries[0].isIntersecting === true)
		console.log('Element has just become visible in screen');
}, { threshold: [0] });

observer.observe(document.querySelector("#main-container"));
If we want to know when element becomes fully visible in screen :

var observer = new IntersectionObserver(function(entries) {
	if(entries[0].isIntersecting === true)
		console.log('Element is fully visible in screen');
}, { threshold: [1] });

observer.observe(document.querySelector("#main-container"));

//document.querySelectorAll('div[shown][type="checkbox"]:not([value=""])');
 */

const showAtt = "shown";

function doHandleElment(el){
    let classArray = el.getAttribute(showAtt);
    classArray.split(" ").forEach(curClass =>el.classList.add(curClass));
    console.log(el);
}

function doInitVisibleElements(){
    console.log("Is about checking for elements....");
    
    

    var els = document.querySelectorAll(`div[${showAtt}]:not([${showAtt}=""])`);
    console.log("Found " + els.length + " elements ....");

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(ent => {if (ent.isIntersecting) doHandleElment(ent.target);});
    }, { threshold: [0] });

    els.forEach (e=> observer.observe(e));
    
}


window.onload = function(){doInitVisibleElements();}