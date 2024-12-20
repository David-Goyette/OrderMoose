console.log('OrderMoose - ready to copy order slip');
let button_exists = false;
const observer2 = new MutationObserver(()=>{
    if(window.location.href.includes('https://www.amazon.com/gp/buy/spc/handlers/') && !button_exists){
        addbutton();
        button_exists = true;
    }
    else if(!window.location.href.includes('https://www.amazon.com/gp/buy/spc/handlers/') && button_exists){
        removebutton();
        button_exists = false;
    }
});
observer2.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
});
function addbutton(){
    const infobox = document.getElementById('subtotalsContainer');
    const button = document.createElement('button');
    button.id = 'copy_button';
    button.textContent = 'Copy slip to clipboard';
    button.type = 'button';
    button.style.cssText = 'background-color: white; color: black; font-size: 15px;';
    infobox.appendChild(button);
    button.addEventListener('click', ()=>{
        let output = '| ';
        const items = document.querySelectorAll('div.item-details-right-column');
        for(let item of items){
            output+=item.querySelectorAll('[data-testid]')[0].outerText + ' - ';
            if(item.querySelectorAll('span.a-color-price')[0]){
                output+=item.querySelectorAll('span.a-color-price')[0].outerText + ' - ';
            }
            output+=item.querySelectorAll('span.a-button-text.a-declarative')[0].outerText + ' | ';
        }
        const items2 = document.getElementById('spc-order-summary').querySelectorAll('td.aok-nowrap');
        output+='Shipping - ' + items2[1].outerText + ' | ';
        output+='Tax - ' + items2[items2.length - 2].outerText + ' | ';
        output+='Total - ' + items2[items2.length - 1].outerText + ' |';
        navigator.clipboard.writeText(output);
        console.log('OrderMoose - copied order slip');
    });
}
function removebutton(){
    document.getElementById('copy_button').remove();
}