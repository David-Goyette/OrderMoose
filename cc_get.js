if(window.location.href.includes('/approve')){
    console.log('OrderMooose - ready to copy order total');
    document.querySelector('input.btn.btn-secondary.btn-block').addEventListener('click',()=>{
        const order_total=document.getElementById('esa_account_line_item_debit_total').value.replace(/[^0-9.]/g,'');
        chrome.storage.local.set({order_total:order_total},()=>{console.log('OrderMoose - copied order total')});
    });
}
