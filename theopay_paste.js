if(window.location.href.includes('/approve')){
    deny_buttons_info = [
        {
            text:'Ineligible',
            family_note:'This order contains an item (item name(s) here) that is not an allowable expense under the Hope Scholarship.' +
    ' Please refer to the Parent Handbook starting at page 15 for item eligibility questions. Please resubmit order without ineligible expense(s). If you' +
    ' would like to submit a qualifying expense form to the Hope Scholarship, here is the link to do so (Please only submit ONE form per item): ' +
    'https://www.hopescholarshipwv.com/Portals/HopeScholarship/content/Documents/Forms/ParentStudent/Qualifying%20Expense%20Request%20Form.pdf?ver=6zByLOz' +
    '-xwoLYFVQwUANyw%3d%3d For any further questions or concerns, please reach out to the Hope Engagement Center at (681) 999-4673 or via email at ' +
    'help@hopescholarshipwv.com.',
            admin_note:'Ineligible Expense'
        },
        {
            text:'Unavailable',
            family_note:'(Insert item name) is currently out of stock or unavailable. Kindly resubmit your order, either omitting the item or adding a different.' +
    ' The replacement order will be processed as soon as possible. For further assistance, please contact the Hope Engagement Center at (681) 999-4673 or via ' +
    'email at help@hopescholarshipwv.com.',
            admin_note:'Item/s Unavailable'
        },
        {
            text:'Price ↗',
            family_note:'This order contains an item that has been priced at $__ more than when it was initially submitted. If this price increase is not a ' +
    'significant concern, kindly re-submit the order. For further assistance, please contact the Hope Engagement Center at (681) 999-4673 or via email at ' +
    'help@hopescholarshipwv.com.',
            admin_note:'Price Increase'
        },
        {
            text:'Digital',
            family_note:'This order includes a digital item. Unfortunately, digital items are currently unavailable for fulfillment. Please resubmit any non-digital' +
    ' products. For further inquiries, please contact the Hope Engagement Center at (681) 999-4673 or via email at help@hopescholarshipwv.com.',
            admin_note:'Digital Product/s'
        },
        {
            text:'Scan ⚠',
            family_note:'Your order has not been captured by Theopay due to an incorrect scan. Please resubmit the order by navigating to the cart and expanding any' +
    ' drop-downs that may list the items. For further assistance, please contact the Hope Engagement Center at (681) 999-4673 or via email at help@hopescholarshipwv.com.',
            admin_note:'Cart Scanning Error'
        },
        {
            text:'Disability',
            family_note:'In order to purchase sensory items, you will need to have documentation on your HOPE Scholarship application showing your child qualifies for' +
    ' the items. To do this, please send documentation to the West Virginia State Treasury Office at hopescholarshipwv@wvsto.gov. The documentation/justification you' +
    ' send to WVSTO needs to be from a physician or other clinician that can confirm the need OR confirm a diagnosis. Once the WVSTO receives and reviews what you send,' +
    ' the information will be added to your HOPE Scholarship application and we can place the orders.',
            admin_note:'Disability documentation needed'
        },
        {
            text:'🛇 Age',
            family_note:"This order includes an item that has been determined to be unsuitable for this student's age. If this is a concern and requires further" +
    ' clarification, please submit a qualifying expense form using the following link: https://hopescholarshipwv.com/Portals/HopeScholarship/content/Documents/' +
    'Forms/ParentStudent/Qualifying%20Expense%20Request%20Form.pdf?ver=6zByLOz-xwoLYFVQwUANyw%3d%3d',
            admin_note:'Not Age Appropriate'
        },
        {
            text:'Discount',
            family_note:'This order contains a coupon or discount code that is currently unavailable to our fulfillment team. If the price increase is not a concern,' +
    ' please resubmit the order without the codes applied. The order will be processed as soon as possible. For further inquiries, please contact the Hope Engagement' +
    ' Center at (681) 999-4673 or via email at help@hopescholarshipwv.com.',
            admin_note:'Unavailable Coupon or Discount'
        }
    ]
    const select = document.getElementById('information_verified');
    select.addEventListener('change', ()=>{
        const value = select.value;
        if(value === 'false'){
            console.log('OrderMoose - ready to paste deny reasoning');
            const grid_div = document.querySelectorAll('div.grid')[2];
            const family_note_box = document.getElementById('esa_account_line_item_family_notes');
            const admin_note_box = document.getElementById('esa_account_line_item_notes');
            for(let deny of deny_buttons_info){
                const button = document.createElement('button');
                button.classList.add('deny_button')
                button.textContent = deny.text;
                button.type = 'button';
                button.style.cssText = 'background-color: white; color: black; font-size: 15px; height: 22.8px; vertical-align: top; text-align: center;';
                grid_div.insertAdjacentElement('afterend', button);
                button.addEventListener('mouseenter', ()=>{button.style.cursor = 'pointer'});
                button.addEventListener('mouseleave', ()=>{button.style.cursor = 'default'});
                button.addEventListener('click', ()=>{
                    console.log('OrderMoose - pasted deny reasoning');
                    family_note_box.value = deny.family_note;
                    admin_note_box.value = deny.admin_note;
                });
            }
        }
        else{
            const deny_buttons = document.querySelectorAll('.deny_button');
            for(let deny_button of deny_buttons){
                deny_button.remove();
            }
        }
    });
}

