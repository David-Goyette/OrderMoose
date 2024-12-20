if(window.location.href==='https://docs.google.com/forms/d/e/1FAIpQLSeu1N-H444rvSUnRYp5d3FebjV6A9nALU0_xxW97WyJ88q9DA/viewform'){
    const input=document.querySelector('input.whsOnd.zHQkBf');
    const submit=document.querySelector('div.uArJ5e.UQuaGc.Y5sE8d.VkkpIf.QvWxOd');
    function fill(){
        chrome.storage.local.get('order_total',(r)=>{
            input.value=r.order_total;
            input.setAttribute('data-initial-value',r.order_total);
            document.getElementsByName('entry.1634408425')[0].value=r.order_total;
            document.querySelector('div.rFrNMe.k3kHxc.RdH0ib.yqQS1.ccuQue.zKHdkd').classList.add('CDELXb');
            chrome.storage.local.get('saved_cc',(r)=>{
                document.querySelector('div.KKjvXb').click();
                const observer = new MutationObserver(()=>{
                    if(document.querySelector('div.OA0qNb.ncFHed.QXL7Te').querySelectorAll('div')[(r.saved_cc * 2) + 1]){
                        observer.disconnect();
                        document.querySelector('div.OA0qNb.ncFHed.QXL7Te').querySelectorAll('div')[(r.saved_cc * 2) + 1].click();
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });
            });           
        });
    }
    fill();
    document.addEventListener('visibilitychange', ()=>{
        fill();
    })
    submit.addEventListener('click', ()=>{
        const used_cc = document.querySelector('div.KKjvXb');
        const saved_cc = +used_cc.textContent;
        chrome.storage.local.set({saved_cc:saved_cc}, ()=>{console.log('OrderMoose - saved cc number')});
    });
}

