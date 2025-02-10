const observer = new MutationObserver(()=>{
    const shippingForm = document.getElementById('toggleableFieldsContainer');
    let pasteButton = document.getElementById('pasteButtonOrderMoose');
    if(shippingForm && !pasteButton){
        pasteButton = document.createElement('button');
        pasteButton.id = 'pasteButtonOrderMoose';
        pasteButton.type = 'button';
        pasteButton.textContent = 'Paste Shipping Info';
        pasteButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        shippingForm.insertAdjacentElement('beforebegin', pasteButton);
        pasteButton.addEventListener('mouseenter', ()=>{
            pasteButton.style.cursor = 'pointer';
            pasteButton.style.backgroundImage = `url(${chrome.runtime.getURL('orderMooseIcon.png')})`;
            pasteButton.style.backgroundSize = 'contain';
            pasteButton.style.backgroundRepeat= 'no-repeat';
        });
        pasteButton.addEventListener('mouseleave', ()=>{
            pasteButton.style.cursor = 'default';
            pasteButton.style.backgroundImage = ``;
        });
        pasteButton.addEventListener('mousedown', ()=>{pasteButton.style.border = 'solid rgb(188, 147, 97) 2px'});
        pasteButton.addEventListener('mouseup', ()=>{pasteButton.style.border = 'solid rgb(180, 83, 242) 2px'});
        pasteButton.addEventListener('click', ()=>{pasteShippingInfo()});
        console.log('OrderMoose - ready to paste shipping info');
    }
    const totalsTable = document.getElementById('checkoutSidebarOrderSummary');
    let copyButton = document.getElementById('copyButtonOrderMoose');
    if(totalsTable && !copyButton){
        copyButton = document.createElement('button');
        copyButton.id = 'copyButtonOrderMoose';
        copyButton.type = 'button';
        copyButton.textContent = 'Copy Order Slip';
        copyButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        totalsTable.insertAdjacentElement('afterend', copyButton);
        copyButton.addEventListener('mouseenter', ()=>{
            copyButton.style.cursor = 'pointer';
            copyButton.style.backgroundImage = `url(${chrome.runtime.getURL('orderMooseIcon.png')})`;
            copyButton.style.backgroundSize = 'contain';
            copyButton.style.backgroundRepeat= 'no-repeat';
        });
        copyButton.addEventListener('mouseleave', ()=>{
            copyButton.style.cursor = 'default';
            copyButton.style.backgroundImage = ``;
        });
        copyButton.addEventListener('mousedown', ()=>{copyButton.style.border = 'solid rgb(188, 147, 97) 2px'});
        copyButton.addEventListener('mouseup', ()=>{copyButton.style.border = 'solid rgb(180, 83, 242) 2px'});
        copyButton.addEventListener('click', ()=>{copyOrderSlip()});
        console.log('OrderMoose - ready to copy order slip');
    }
});

observer.observe(document.body, {childList: true, subtree: true});

function pasteShippingInfo(){
    //later I might add some sort of element validation for the inputs and local storage values
    const firstNameInput = document.getElementById('firstName-0');
    const lastNameInput = document.getElementById('lastName-0');
    const companyInput = document.getElementById('shipToName-0');
    const streetAddressInput = document.getElementById('address1-0');
    const stateInput = document.getElementById('state-0');
    const cityInput = document.getElementById('city-0');
    const zipInput = document.getElementById('postalCode1-0');
    const phoneInput1 = document.getElementById('phoneNumber1-0');
    const phoneInput2 = document.getElementById('phoneNumber2-0');
    const phoneInput3 = document.getElementById('phoneNumber3-0');
    const emailInput = document.getElementById('email-0');
    chrome.storage.local.get('shippingInfo', (r)=>{
        const index = r.shippingInfo.fullName.indexOf(' ');
        firstNameInput.value = r.shippingInfo.fullName.slice(index + 1);
        firstNameInput.dispatchEvent(new Event('change', {bubbles: true}));
        lastNameInput.value = r.shippingInfo.fullName;
        lastNameInput.dispatchEvent(new Event('change', {bubbles: true}));
        companyInput.value = 'N/A';
        companyInput.dispatchEvent(new Event('change', {bubbles: true}));
        streetAddressInput.value = r.shippingInfo.address;
        streetAddressInput.dispatchEvent(new Event('change', {bubbles: true}));
        stateInput.value = 'WV';
        stateInput.dispatchEvent(new Event('change', {bubbles: true}));
        cityInput.value = r.shippingInfo.city;
        cityInput.dispatchEvent(new Event('change', {bubbles: true}));
        zipInput.value = r.shippingInfo.zip;
        zipInput.dispatchEvent(new Event('change', { bubbles: true}));
        phoneInput1.value = '812';
        phoneInput1.dispatchEvent(new Event('change', {bubbles: true}));
        phoneInput2.value = '200';
        phoneInput2.dispatchEvent(new Event('change', {bubbles: true}));
        phoneInput3.value = '6589';
        phoneInput3.dispatchEvent(new Event('change', {bubbles: true}));
        emailInput.value = 'wvorders@studentfirsttech.com';
        emailInput.dispatchEvent(new Event('change', {bubbles: true}));
        console.log('OrderMoose - pasted shipping info');
    });
}

function copyOrderSlip(){
    let output = '| ';
    const items = document.querySelectorAll('tbody.cartEntry ');
    for(let item of items){
        const itemName = item.querySelector('td.line_item_description');
        if(itemName){
            output += itemName.outerText.replace(/[\n\t]/g, '') + ' - ';
        }
        const itemPrice = item.querySelector('td.line_item_extended_price');
        if(itemPrice){
            output += itemPrice.firstElementChild.innerText.replace(/[\n\t]/g, '');
        }
        const quantity = item.querySelector('td.line_item_quantity');
        if(quantity){
            output +=  ' - ' + quantity.outerText.replace(/[\n\t]/g, '');
        }
        output += ' |';
    }
    const shipping = document.querySelector('td.orderSummary_delivery');
    if(shipping){
        output += ` Shipping - ${shipping.outerText} |`;
    }
    const tax = document.querySelector('td.orderSummary_taxes');
    if(tax){
        output += ` Tax - ${tax.outerText} |`;
    }
    const total = document.querySelector('td.orderSummary_total');
    if(total){
        output += ` Total - ${total.outerText} |`;
    }
    navigator.clipboard.writeText(output);
    console.log('OrderMoose - copied shipping info');
}