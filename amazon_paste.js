console.log('OrderMoose - ready to paste shipping info');
const observer1 = new MutationObserver(()=>{
    const items = document.querySelectorAll('div.a-modal-scroller');
    for(let item of items){
        const paste_button = item.querySelector('#paste_button');
        if(item.style.visibility === 'visible' && item.style.paddingBottom === '1px' && !paste_button){
            observer1.disconnect();
            const fullname_input = item.querySelector('#address-ui-widgets-enterAddressFullName');
            const address_input = item.querySelector('#address-ui-widgets-enterAddressLine1');
            const city_input = item.querySelector('#address-ui-widgets-enterAddressCity');
            const zip_input = item.querySelector('#address-ui-widgets-enterAddressPostalCode');
            const button = document.createElement('button');
            button.id = 'paste_button';
            button.textContent = 'Paste from OrderMoose';
            button.type = 'button';
            button.style.cssText = 'background-color: white; color: black; font-size: 15px;';
            fullname_input.insertAdjacentElement('afterend', button);
            button.addEventListener('click', ()=>{
                chrome.storage.local.get('shipping_info', (r)=>{
                    fullname_input.value = r.shipping_info.fullname;
                    address_input.value = r.shipping_info.address;
                    city_input.value = r.shipping_info.city;
                    zip_input.value = r.shipping_info.zip;
                    console.log('OrderMoose - pasted shipping info');
                });
            });
            observer1.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }
});
observer1.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
});