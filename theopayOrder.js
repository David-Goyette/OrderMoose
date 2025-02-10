const url = window.location.href;
if(url.includes('/approve')){
    addCopyButton();
    const approveOrReject = document.getElementById('information_verified');
    approveOrReject.addEventListener('change', ()=>{
        if(approveOrReject.value === 'false'){
            fetch(chrome.runtime.getURL('denyReasons.json'))
            .then(response => response.json())
            .then(data => addDenyReasonButtons(data))
            .catch(error => console.error(error))
        }
        else{
            removeDenyReasonButtons();
        }
    });
    const submitButton = document.querySelector('input.btn.btn-secondary.btn-block');
    submitButton.addEventListener('click', ()=>{
        const orderTotal = document.getElementById('esa_account_line_item_debit_total').value.replace(/[^0-9.]/g,'');
        chrome.storage.local.set({orderTotal: orderTotal}, ()=>{console.log('OrderMoose - copied order total')});
    });
}

function addCopyButton(){
    const infoBox = document.querySelector('div.inner-box');
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = 'Copy';
    copyButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
    infoBox.append(copyButton);
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
    copyButton.addEventListener('click', ()=>{
        const shippingInfo = document.querySelector('a[href*="edit_shipping_address"]');
        const text = shippingInfo.textContent.trim();
        const fullName = text.split('\n')[0].replace(/[^a-zA-Z0-9- ]/g, '').trim();
        const address = text.split('\n')[1].replace(/[^a-zA-Z0-9- ]/g, '').trim();
        const bottom = text.split('\n')[2];
        const index = bottom.indexOf(',');
        const city = bottom.slice(0, index).replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const zip = bottom.slice(index).replace(/[^0-9-]/g, '');
        chrome.storage.local.set({
            shippingInfo:{
                fullName:fullName,
                address:address,
                city:city,
                zip:zip
            }
        }, ()=>{console.log('OrderMoose - copied shipping info')});
    });
    console.log('OrderMoose - ready to copy shipping info');
}

function addDenyReasonButtons(denyReasons){
    const gridDiv = document.querySelectorAll('div.grid')[2];
    const familyNoteInput = document.getElementById('esa_account_line_item_family_notes');
    const adminNoteInput = document.getElementById('esa_account_line_item_notes');
    for(let denyReason of denyReasons){
        const pasteButton = document.createElement('button');
        pasteButton.classList.add('denyReasonButton')
        pasteButton.textContent = denyReason.text;
        pasteButton.type = 'button';
        pasteButton.style = 'background: rgb(180, 83, 242); font-family: Arial; font-size: 15px; font-weight: normal; color: rgb(249, 229, 207); padding: 5px 30px; border-radius: 5px; border: solid rgb(180, 83, 242) 2px; margin: 10px';
        gridDiv.insertAdjacentElement('afterend', pasteButton);
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
        pasteButton.addEventListener('click', ()=>{
            familyNoteInput.value = denyReason.familyNote;
            adminNoteInput.value = denyReason.adminNote;
            console.log('OrderMoose - pasted deny reason');
        });
    }
    console.log('OrderMoose - ready to paste deny reason');
}

function removeDenyReasonButtons(){
    const denyReasonButtons = document.querySelectorAll('button.denyReasonButton');
    for(let denyReasonButton of denyReasonButtons){
        denyReasonButton.remove();
    }
}