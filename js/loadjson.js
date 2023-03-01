
    function loadProjects(){
        const myRequest = new Request('../json/projets.json');
        let container  = document.getElementById("work_container");
        fetch(myRequest)
            .then((response)=> response.json())
            .then((data) => {
                for (const v of data){
                    let work_card = document.createElement('div');
                    work_card.className += "work__card mix " + v.filter; 
                    let image = document.createElement('img');
                    image.className = "work_img";
                    image.src = v.img;

                    let sp = document.createElement('span');
                    sp.className = "work__button";
                    sp.innerText = "En savoir plus";

                    let arrow = document.createElement('i');
                    arrow.className = "uil uil-arrow-left work__button-icon";

                  

                    let cahierCharge = document.createElement("h3");
                    cahierCharge.className = "text-info";
                    cahierCharge.innerText = "Cahier des charges";

                    let title1 = document.createElement("h3");
                    title1.className = "work_title";
                    title1.innerText = v.name;

                    let title2 = document.createElement("h3");
                    title2.className = "work_title";
                    title2.innerText = v.name;

                    let itemDetail = document.createElement("div");
                    let ulCharge = document.createElement("ul");
                    ulCharge.className = "details__description";


                    let titleCompetences = document.createElement("h3")
                    titleCompetences.className = "text-info";
                    titleCompetences.innerText = "Compétences acquises";

                    let ulCompetences = document.createElement("ul");
                    ulCompetences.className = "details__description";
                    
                    itemDetail.className = "portfolio__item-details";
                    
                    let titleLivrable = document.createElement("h3");
                    titleLivrable.className = "text-info";
                    titleLivrable.innerText = "Livrables";
                    
                    let ulLivrable = document.createElement("ul");
                    ulLivrable.className = "details__description";

                    let ulDetails = document.createElement("ul");
                    ulDetails.className = "details__info h6";
                    
                    let liAnnee = document.createElement("li");
                    let bAnnee = document.createElement("b");
                    bAnnee.className = "text-info";
                    bAnnee.innerText = v.annee
                    liAnnee.innerText =  "Année : " 

                    let liLangage = document.createElement("li");
                    let bLangage = document.createElement("b");
                    bLangage.className = "text-info";
                    bLangage.innerText = v.language;
                    liLangage.innerText =  "Langage(s) : " 

                    let parts = v.cahierDesCharges.split("/");

                    sp.appendChild(arrow);

                    container.appendChild(work_card);
                    work_card.appendChild(image);
                    work_card.appendChild(title1);
                    work_card.appendChild(sp);
                    if (v.icon != ""){
                        let icon = document.createElement('i')
                        icon.className = v.icon;
                        work_card.appendChild(icon)
                    }
                    work_card.appendChild(itemDetail);

                    itemDetail.appendChild(title2);
                    itemDetail.appendChild(cahierCharge);
                    itemDetail.appendChild(ulCharge);

                    
                    parts.forEach(function(charge) {
                        let liCharge = document.createElement("li");
                        liCharge.innerText = charge;
                        ulCharge.appendChild(liCharge);
                    });

                    itemDetail.appendChild(titleCompetences);
                    itemDetail.appendChild(ulCompetences);  

                    parts = v.compétencesAcquises.split("/");
                    parts.forEach(function(competence) {
                        let liCompetence = document.createElement("li");
                        liCompetence.innerText = competence;
                        ulCompetences.appendChild(liCompetence);
                    });

                    itemDetail.appendChild(titleLivrable);
                    itemDetail.appendChild(ulLivrable);  

                    parts = v.livrables.split("/");
                    parts.forEach(function(livrable) {
                        let liLivrable = document.createElement("li");
                        liLivrable.innerText = livrable;
                        ulLivrable.appendChild(liLivrable);
                    });

                    itemDetail.appendChild(ulDetails);

                    ulDetails.appendChild(liAnnee);
                    liAnnee.appendChild(bAnnee);

                    ulDetails.appendChild(liLangage);
                    liLangage.appendChild(bLangage);

                    if(v.depot !=""){
                        let liDepot = document.createElement("li");
                        let bDepot = document.createElement("b");
                        let linkDepot = document.createElement("a");
                        linkDepot.href = v.depot;
                        liDepot.innerText = "Dépot : ";
                        bDepot.innerText = "Github";
                        
                        ulDetails.appendChild(liDepot);
                        liDepot.appendChild(linkDepot);
                        linkDepot.appendChild(bDepot);

                    }
                }
        })

}