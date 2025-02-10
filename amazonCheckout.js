const observer = new MutationObserver(()=>{
    const shippingForms = document.querySelectorAll('#address-ui-widgets-enterAddressFormContainer');
    for(let shippingForm of shippingForms){
        let pasteButton = shippingForm.parentElement.querySelector('#pasteButtonOrderMoose');
        if(!pasteButton){
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
            pasteButton.addEventListener('click', ()=>{pasteShippingInfo(shippingForm)});
            console.log('OrderMoose - ready to paste shipping info');
        }
    }
    const totalsTable = document.getElementById('subtotals-marketplace-table');
    let copyButton = document.getElementById('copyButtonOrderMoose');
    if(totalsTable && !copyButton){
        copyButton = document.createElement('button');
        copyButton.id = 'copyButtonOrderMoose';
        copyButton.type = 'button';
        copyButton.textContent = 'Copy Order Slip';
        copyButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        const totalsBox = document.getElementById('subtotalsContainer');
        totalsBox.append(copyButton);
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

function pasteShippingInfo(shippingForm){
    //later I might add some sort of element validation for the inputs and local storage values
    const fullNameInput = shippingForm.querySelector('#address-ui-widgets-enterAddressFullName');
    const streetAddressInput = shippingForm.querySelector('#address-ui-widgets-enterAddressLine1');
    const stateInput = shippingForm.querySelector('#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId');;
    const cityInput = shippingForm.querySelector('#address-ui-widgets-enterAddressCity');
    const zipInput = shippingForm.querySelector('#address-ui-widgets-enterAddressPostalCode');
    const phoneInput = shippingForm.querySelector('#address-ui-widgets-enterAddressPhoneNumber');
    chrome.storage.local.get('shippingInfo', (r)=>{
        fullNameInput.value = r.shippingInfo.fullName;
        fullNameInput.dispatchEvent(new Event('change', {bubbles: true}));
        streetAddressInput.value = r.shippingInfo.address;
        streetAddressInput.dispatchEvent(new Event('change', {bubbles: true}));
        stateInput.selectedIndex = 57;
        stateInput.dispatchEvent(new Event('change', {bubbles: true}));
        cityInput.value = r.shippingInfo.city;
        cityInput.dispatchEvent(new Event('change', {bubbles: true}));
        zipInput.value = r.shippingInfo.zip;
        zipInput.dispatchEvent(new Event('change', { bubbles: true}));
        phoneInput.value = '8122006589';
        phoneInput.dispatchEvent(new Event('change', {bubbles: true}));
        console.log('OrderMoose - pasted shipping info');
    });
}

function copyOrderSlip(){
    let output = '| ';
    let usedItems = false;
    const items = document.querySelectorAll('div.item-details-right-column');
    for(let item of items){
        const itemName = item.querySelector('[data-testid]');
        if(itemName){
            output += itemName.outerText + ' - ';
            if(item.innerText.includes('Condition:Used')){
                usedItems = true;
            }
        }
        const itemPrice = item.querySelector('span.a-color-price');
        if(itemPrice){
            output += itemPrice.innerText.trim();
        }
        const quantity = item.querySelector('span.a-button-text.a-declarative');
        if(quantity){
            output +=  ' - ' + quantity.outerText;
        }
        output += ' |';
    }
    let totals = document.querySelectorAll('div.order-summary-line-definition');
    if(totals.length === 0){
        totals = document.querySelectorAll('td.a-text-right.aok-nowrap.a-nowrap');
    }
    const shipping = totals[1];
    if(shipping){
        output += ` Shipping - ${shipping.outerText} |`;
    }
    const tax = totals[totals.length - 2];
    if(tax){
        output += ` Tax - ${tax.outerText} |`;
    }
    const total = totals[totals.length - 1];
    if(total){
        output += ` Total - ${total.outerText} |`;
    }
    if(usedItems){
        output += ' We fulfilled your order request for used book(s), however we cannot guarantee the quality or edition of used book(s).' +
        ' In the future, if quality or edition is important to you, when using the HOPE Scholarship please only place orders for new books, thank you.'
    }
    navigator.clipboard.writeText(output);
    console.log('OrderMoose - copied shipping info');
}