if(window.location.href.includes('/approve')){
    console.log('OrderMoose - ready to copy shipping info');
    const button = document.createElement('button');
    button.textContent = 'Copy to OrderMoose';
    button.type = 'button';
    button.style.cssText = 'background-color: white; color: black; font-size: 15px;';
    document.querySelector('.inner-box').appendChild(button);
    button.addEventListener('mouseenter', ()=>{button.style.cursor = 'pointer'});
    button.addEventListener('mouseleave', ()=>{button.style.cursor = 'default'});
    button.addEventListener('click', ()=>{
        const infobox = document.querySelector('a[href*="edit_shipping_address"]');
        const text = infobox.querySelector('p').textContent.trim();
        const fullname = text.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const address = text.split('\n')[1].replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const bottom = text.split('\n')[2];
        const index = bottom.indexOf(',');
        const city = bottom.slice(0, index).replace(/[^a-zA-Z0-9 ]/g, '').trim();
        const zip = bottom.slice(index).replace(/[^0-9-]/g, '');
        chrome.storage.local.set({
            shipping_info:{
                fullname:fullname,
                address:address,
                city:city,
                zip:zip
            }
        }, ()=>{console.log('OrderMoose - copied shipping info')});
    });
}

