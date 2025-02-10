const observer = new MutationObserver(()=>{
    const shippingForm = document.getElementById('shipping-new-address-form');
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
    const totalsTable = document.querySelector('table.data.table.table-totals');
    let copyButton = document.getElementById('copyButtonOrderMoose');
    if(totalsTable && !copyButton){
        copyButton = document.createElement('button');
        copyButton.id = 'copyButtonOrderMoose';
        copyButton.type = 'button';
        copyButton.textContent = 'Copy Order Slip';
        copyButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        const summaryBox = document.querySelector('div.opc-block-summary');
        summaryBox.insertAdjacentElement('afterend', copyButton);
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
        copyButton.addEventListener('click', ()=>{copyOrderSlip(totalsTable)});
        console.log('OrderMoose - ready to copy order slip');
    }
});

observer.observe(document.body, {childList: true, subtree: true});

function pasteShippingInfo(){
    const firstNameInput = document.querySelector('input[name="firstname"]');
    const lastNameInput = document.querySelector('input[name="lastname"]');
    const streetAddressInput = document.querySelector('input[name="street[0]"]');
    const stateInput = document.querySelector('select[name="region_id"]');
    const cityInput = document.querySelector('input[name="city"]');
    const zipInput = document.querySelector('input[name="postcode"]');
    const phoneInput = document.querySelector('input[name="telephone"]');
    chrome.storage.local.get('shippingInfo', (r)=>{
        const index = r.shippingInfo.fullName.indexOf(' ');
        firstNameInput.value = r.shippingInfo.fullName.slice(0, index);
        firstNameInput.dispatchEvent(new Event('change', {bubbles: true}));
        lastNameInput.value = r.shippingInfo.fullName.slice(index + 1);
        lastNameInput.dispatchEvent(new Event('change', {bubbles: true}));
        streetAddressInput.value = r.shippingInfo.address;
        streetAddressInput.dispatchEvent(new Event('change', {bubbles: true}));
        stateInput.value = '63';
        stateInput.dispatchEvent(new Event('change', {bubbles: true}));
        cityInput.value = r.shippingInfo.city;
        cityInput.dispatchEvent(new Event('change', {bubbles: true}));
        zipInput.value = +r.shippingInfo.zip.replace('-', '').slice(0, 5);
        zipInput.dispatchEvent(new Event('change', { bubbles: true}));
        phoneInput.value = '8122006589';
        phoneInput.dispatchEvent(new Event('change', {bubbles: true}));
        console.log('OrderMoose - pasted shipping info');
    });
}

function copyOrderSlip(totalsTable){
    let output = '|';
    const items = document.querySelectorAll('div.product-item-inner');
    for(let item of items){
        output += ' ';
        const itemName = item.querySelector('strong.product-item-name');
        if(itemName){
            output += itemName.textContent + ' - ';
        }
        const itemPrice = item.querySelector('span.price');
        if(itemPrice){
            output += itemPrice.textContent;
        }
        const unitPrice = item.querySelector('span.item-price');
        if(unitPrice){
            output +=  ' - ' + unitPrice.textContent;
        }
        else{
            output += ' - Qty 1';
        }
        output += ' |';
    }
    const totals = totalsTable.querySelectorAll('span.price');
    const shipping = totals[totals.length - 3]
    if(shipping){
        output += ` Shipping - ${shipping.textContent} |`;
    }
    const tax = totals[totals.length - 2];
    if(tax){
        output += ` Tax - ${tax.textContent} |`;
    }
    const total = totals[totals.length - 1];
    if(total){
        output += ` Total - ${total.textContent} |`;
    }
    navigator.clipboard.writeText(output);
    console.log('OrderMoose - copied shipping info');
}