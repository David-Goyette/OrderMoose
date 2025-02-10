const url = window.location.href;
if(url === 'https://docs.google.com/forms/d/e/1FAIpQLSeu1N-H444rvSUnRYp5d3FebjV6A9nALU0_xxW97WyJ88q9DA/viewform'){
    fillForm();
    copyCard();
}

function fillForm(){
    const defaultCard = document.querySelector('div.KKjvXb');
    if(defaultCard){
        defaultCard.click()
        const defaultCardObserver = new MutationObserver(()=>{
            chrome.storage.local.get('cardNumber', (r)=>{
                const cardOption = document.querySelectorAll('div.MocG8c.HZ3kWc.mhLiyf.OIC90c.LMgvRb')[r.cardNumber + 99];
                if(cardOption){
                    defaultCardObserver.disconnect();
                    cardOption.click();
                }
            });
        });
        defaultCardObserver.observe(document.body, {childList: true, subtree: true});
    }
    const totalInput = document.querySelector('input.whsOnd.zHQkBf');
    if(totalInput){
        chrome.storage.local.get('orderTotal', (r)=>{
            totalInput.value = r.orderTotal;
            totalInput.dispatchEvent(new Event('input', {bubbles: true}));
        });
    }
    console.log('OrderMoose - filling out credit tracking form');
}

function copyCard(){
    const submitButton = document.querySelector('div[aria-label="Submit"]');
    submitButton.addEventListener('click', ()=>{
        const cardNumber = +document.querySelector('div.KKjvXb').textContent;
        chrome.storage.local.set({cardNumber: cardNumber}, ()=>{console.log('OrderMoose - copied card number')});
    });
}