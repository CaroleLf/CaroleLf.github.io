let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('open');
};

const sr = ScrollReveal ({
	distance: '65px',
	duration: 2600,
	delay: 450,
	reset: true
});




sr.reveal('.me-text',{delay:200, origin:'top'});
sr.reveal('.me-Personal',{delay:200,origin:'top'});
sr.reveal('.me-img',{delay:450, origin:'top'});
sr.reveal('.icons',{delay:500, origin:'left'});
sr.reveal('.scroll-down',{delay:500, origin:'right'});
sr.reveal('.work', {delay:200,origin:'right'})


/***** MiXITUUP FILTER  **************************/
var containerEl = document.querySelector('.work_container');
var mixer;

if (containerEl) {
    mixer = mixitup(containerEl, {
		selectors :  {
			target : '.work__card'
		},
         animation : {
			duration : 300
		}
    });
}



/*** LINK ACTIVE WORK  ********/

const linkWork  = document.querySelectorAll('.work_item');

function activeWork(){
	linkWork.forEach(l => l.classList.remove('active-work'))
	this.classList.add('active-work')
}

linkWork.forEach(l=> l.addEventListener("click",activeWork))



/*** PopUP ***/

document.addEventListener("click", (e)=> {
	if(e.target.classList.contains("work__button")){
		togglePortfolioPopup();
		portfolioItemDetails(e.target.parentElement);

	}
})


function togglePortfolioPopup(){
	document.querySelector(".portfolio__popup").classList.toggle("open");
}

document.querySelector(".portfolio__popup-close").addEventListener("click", togglePortfolioPopup)


function portfolioItemDetails(portfolioItem){
	document.querySelector(".pp__thumbnail img").src = portfolioItem.querySelector(".work_img").src;
	document.querySelector(".portfolio__popup-body").innerHTML = portfolioItem.querySelector(".portfolio__item-details").innerHTML;

}




/** Scroolbar ***/


const progressBar = document.querySelector('.scrollbar');
let totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener('scroll',()=> {
	let progress = (document.documentElement.scrollTop / totalHeight) * 100;
	progressBar.style.height = `${progress}%`;
	progressBar.style.opacity = `${progress}%`
})