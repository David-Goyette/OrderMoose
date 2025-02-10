const observer = new MutationObserver(()=>{
    const shippingForm = document.querySelector('div[data-testid="shipping-add-address-form"');
    let pasteButton = document.getElementById('pasteButtonOrderMoose');
    if(shippingForm && !pasteButton){
        pasteButton = document.createElement('button');
        pasteButton.id = 'pasteButtonOrderMoose';
        pasteButton.type = 'button';
        pasteButton.textContent = 'Paste Shipping Info';
        pasteButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        shippingForm.insertBefore(pasteButton, shippingForm.firstChild);
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
    const totalsTable = document.querySelector('div.w_RODD');
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
    const firstNameInput = document.querySelector('input[name="firstName"]');
    const lastNameInput = document.querySelector('input[name="lastName"]');
    const streetAddressInput = document.querySelector('input[name="addressLineOne"]');
    const stateInput = document.querySelector('select[name="state"]');
    const cityInput = document.querySelector('input[name="city"]');
    const zipInput = document.querySelector('input[name="postalCode"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    chrome.storage.local.get('shippingInfo', (r)=>{
        const index = r.shippingInfo.fullName.indexOf(' ');
        firstNameInput.value = r.shippingInfo.fullName.slice(0, index);
        firstNameInput.dispatchEvent(new Event('change', { bubbles: true }));
        lastNameInput.value = r.shippingInfo.fullName.slice(index + 1);
        lastNameInput.dispatchEvent(new Event('change', { bubbles: true }));
        streetAddressInput.value = r.shippingInfo.address;
        streetAddressInput.dispatchEvent(new Event('change', { bubbles: true }));
        stateInput.value = 'WV';
        stateInput.dispatchEvent(new Event('change', { bubbles: true }));
        cityInput.value = r.shippingInfo.city;
        cityInput.dispatchEvent(new Event('change', { bubbles: true }));
        zipInput.value = +r.shippingInfo.zip.replace('-', '').slice(0, 5);
        zipInput.dispatchEvent(new Event('change', { bubbles: true }));
        phoneInput.value = '(812) 200-6589';
        phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('OrderMoose - pasted shipping info');
    });
}

function copyOrderSlip(){
    const viewDetails = document.querySelector('button[data-testid="view-details"]');
    if(viewDetails){
        viewDetails.click();
    }
    let output = '|';
    const items = document.querySelectorAll('div[data-testid^="product-"]');
    for(let item of items){
        const itemName = item.querySelector('span.w_vi_D');
        if(itemName){
            output += ' ' + itemName.textContent + ' - ';
        }
        const itemPrice = item.querySelector('div.f5.black.b.black.tr');
        if(itemPrice){
            output += itemPrice.textContent;
        }
        const quantity = item.querySelector('div.f5.mid-gray.nowrap.tl.mr2');
        if(quantity){
            output +=  ' - ' + quantity.textContent;
        }
        output += ' |';
    }
    const shipping = document.querySelector('div[data-testid="fee"]');
    if(shipping){
        output += ` Shipping - ${shipping.nextElementSibling.textContent} |`;
    }
    else{
        output += ` Shipping - Free |`;
    }
    const tax = document.querySelector('label[for="taxtotal-label"]')
    if(tax){
        output += ` Tax - ${tax.nextElementSibling.textContent} |`;
    }
    const total = document.querySelector('div[data-testid="grand-total-value"]');
    if(total){
        output += ` Total - ${total.textContent} |`;
    }
    navigator.clipboard.writeText(output);
    console.log('OrderMoose - copied order slip');
}