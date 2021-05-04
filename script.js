(()=>{
    let pageToken;
    // Template for rendering the message cards
    const template = (message)=>{
        return `<li>
                <div class="card">
                    <div class="delete" data-type="DELETE"><i class="fa fa-trash-o"></i> Delete</div>
                    <div class="content">
                        <div class="profile">
                            <img src="https://message-list.appspot.com/${message.author.photoUrl}" alt="">
                            <div class="name-date">
                                <p>${message.author.name}</p>
                                <span>${moment(new Date(message.updated)).fromNow()}</span>
                            </div>
                        </div>
                        <div class="message">
                            <p>${message.content}</p>
                        </div>
                    </div>
                    <div class="edit" data-type="EDIT"> <i class='fa fa-edit'></i> Edit</div>
                </div>
            </li>`;
    };
    // Method to swipe the card to show Edit and delete
    const swipe = (type) =>{
        return (e) =>{
            if(type === "LEFT"){
                var selectedCard = e.target.closest(".card");
                selectedCard.classList.remove("show-delete")
                selectedCard.classList.add('show-edit')
            }else{
                var selectedCard = e.target.closest(".card");
                selectedCard.classList.remove("show-edit")
                selectedCard.classList.add('show-delete')
            }

        }
    }
    // On Click on the Edit/Delete button Action takes place 
    const action = (e) => {
        let ele = e.target
        if(ele.tagName == "I"){
            ele = e.target.parentNode;
        }
        if(ele.dataset && ele.dataset.type){
            let currentCard = ele.parentNode;
            switch(ele.dataset.type){
                case "DELETE": 
                    deleteCard(currentCard);
                    break;
                case "EDIT": 
                    editCard(currentCard);
                    break;
            }
        }
    }
    
    // Delete action
    const deleteCard = (currentCard)=>{
        currentCard.remove()
    }
    // Edit action
    const editCard = (currentCard)=>{
        alert("Edit");
    }
    //Method to load data for both initial load and pagination
    const loadData = ()=>{
        fetch('https://message-list.appspot.com/messages?'+new URLSearchParams({
            pageToken
        }))
        .then(response => response.json())
        .then((data) => {
            let cardSection = document.querySelector('section ul');
            pageToken = data.pageToken
            data.messages.forEach(message => {
                cardSection.innerHTML += template(message);
            });
            addObserver();
        });
    }
    // Callback function of IntersectionObserver below
    const observe =  (entries, observer) => {
        entries.forEach(function(entry) {
            if(entry.isIntersecting) {
                const card = entry.target
                if(!card.parentNode.nextSibling){
                    loadData()
                }
                observer.unobserve(card)
            }
        })
    }
    // Adding the IntersectionObserver for all the Cards to do the lazy load of message smoothly
    const observer = new IntersectionObserver(observe, {
        rootMargin: "3000px",
    });
    const addObserver = ()=>{
        const cards = document.querySelectorAll('.card')
        cards.forEach(function(card) {
            observer.unobserve(card);
            observer.observe(card)
        })
    };
    // Registering all the event listener in the inital load
    const registerListeners = () =>{
        document.addEventListener('swiped-left', swipe("LEFT")); // Here i have use closure funtion we have Left and used it in the event listers
        document.addEventListener('swiped-right', swipe("RIGHT"));
        document.addEventListener('click', action);
    }
    registerListeners();

    loadData(); // Called this to load the initial set of messages
})();



