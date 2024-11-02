// دالة لاسترجاع البيانات من localStorage
function getItemsData() {
    const storedData = localStorage.getItem('itemsData');
    if (storedData) {
        return JSON.parse(storedData); // تحويل النص إلى كائنات جافا سكريبت
    }
    return storedData; // في حالة عدم وجود بيانات في localStorage، ارجع البيانات الافتراضية
}

var itemsData =[]
// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
     itemsData = getItemsData(); // استرجاع البيانات
    console.log(itemsData); // استخدم البيانات كما تريد
});







window.addEventListener('load', function () {
    renderItems();
});

const OrderData = {
    number : "9PM2EQ",
    deliveryDate : "0.6.08.19"
}


const customerData = {
    name : "john Appleseed",
    email:"John.applessed@gmail.com",
    address : "194 Ferry St London, 07105",
    country : "Europe Standard"
}

// const itemsData = [
//     {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     },
//     {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     }, {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     },
//     {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 2',
//         description: 'Another description.',
//         size: '500 ml',
//         quantity: 2,
//         price: 80,
//         currency: 'LE'
//     },
//     {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 3',
//         description: 'Different description.',
//         size: '750 ml',
//         quantity: 1,
//         price: 120,
//         currency: 'LE'
//     },
//     {
//         image: '../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 4',
//         description: 'Another unique description.',
//         size: '1000 ml',
//         quantity: 1,
//         price: 100,
//         currency: 'LE'
//     }
// ];

var CustomerEmail = document.getElementById('emailOfCustomer');
CustomerEmail.innerHTML = customerData.email;


var CustomerName = document.querySelectorAll('.name');
CustomerName.forEach(el => el.innerHTML = customerData.name);


var CustomerAddress = document.querySelectorAll('.add');
CustomerAddress.forEach(el => el.innerHTML = customerData.address);

var CustomerCountry = document.querySelectorAll('.customerCountry');
CustomerCountry.forEach(el => el.innerHTML = customerData.country);


var OrderNumber = document.querySelectorAll('.orderNo');
OrderNumber.forEach(el => el.innerHTML = OrderData.number);

var OrderDeliveryDate = document.querySelectorAll('.orderDeleveryDate');
OrderDeliveryDate.forEach(el => el.innerHTML = OrderData.deliveryDate);




var cartona = document.querySelectorAll('.inner-order-summary');

function renderItems() {
    let getSubtotal = 0;
    let content = '';

    for (let index = 0; index < itemsData.length; index++) {
        const item = itemsData[index];

        content += `
            <div class="row my-4 d-flex  align-items-center">
                        <div class="col-4">
                            <div class="img-cover">
                                <img class="bord" src="${item.image}" alt="">  
                            </div>
                        </div>
                        <div class="col-5 d-flex flex-column justify-content-center ">
                            <p class="p-0 m-0 fsize">${item.name}</p>
                            <p class="p-0 m-0 fsize">
                            <span class="colr-yellow">${item.os}</span>  ${item.model}</p>
                        </div>
    
                        <div class="col-3 ">
                            <p class="fsize p-0 m-0">${(item.oldPrice * (1 - item.discount / 100)).toFixed(2)} LE</p>
                        </div>
                    </div>
        `;

        getSubtotal += (item.oldPrice * (1 - item.discount / 100)).toFixed(0) * item.quantity.toFixed(0);
    }

    cartona.forEach(el => el.innerHTML = content);


    let tot = document.querySelectorAll('.total');
    tot.forEach(el => el.innerHTML = getSubtotal);
}


// function goToHome(){    
//     window.location.href = '../index.html';
// }



function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const icon = document.querySelector('.left-right-arrow');

    sidebar.classList.toggle('active');

    if (icon.classList.contains('fa-angle-left')) {
        icon.classList.replace('fa-angle-left', 'fa-angle-right');
    } else {
        icon.classList.replace('fa-angle-right', 'fa-angle-left');
    }
}

document.querySelector('.arrow-back').addEventListener('click', toggleSidebar);












// document.addEventListener('DOMContentLoaded', function() {
//     const content = document.querySelector('.new-content');

//     // إضافة تأثير دخول المحتوى
//     content.classList.add('content-enter');

//     // بعد فترة قصيرة، نضيف الفئة الفعالة
//     setTimeout(() => {
//         content.classList.add('content-enter-active');
//     }, 10);
// });

// عند الضغط على الزر، إضافة تأثير الخروج
const checkoutButtons = document.querySelectorAll('.goToHome');
checkoutButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // منع الانتقال الفوري

        // // إضافة تأثير الخروج للصفحة الحالية
        // document.body.classList.add('page-exit');

        // الانتظار حتى ينتهي تأثير الخروج
        // setTimeout(() => {
            // الانتقال إلى الصفحة الجديدة
            window.location.href = '../index.html'; // تغيير الرابط إلى صفحة الدفع
        // }, 750); // تأخير لمدة 0.75 ثانية
    });
});