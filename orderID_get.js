console.log('runing')
const observer = new MutationObserver(()=>{
    const orderIDs = document.querySelectorAll('li#orderIdField');
    if(orderIDs[0]){
        observer.disconnect();
        for(let orderID of orderIDs){
            orderID.addEventListener('click', ()=>{navigator.clipboard.writeText(orderID.outerText)});
        }
    } 
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
});



