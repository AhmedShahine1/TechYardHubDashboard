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


// Execute the code when the page loads
window.addEventListener('load', function () {
    renderItems();
});

// const itemsData = [
//     {
//         image: 'Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 1',
//         description: 'Lorem, ipsum dolor.',
//         size: '225 ml',
//         quantity: 1,
//         price: 40,
//         currency: 'LE'
//     },
//     {
//         image: 'Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 2',
//         description: 'Another description.',
//         size: '500 ml',
//         quantity: 2,
//         price: 80,
//         currency: 'LE'
//     },
//     {
//         image: 'Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 3',
//         description: 'Different description.',
//         size: '750 ml',
//         quantity: 1,
//         price: 120,
//         currency: 'LE'
//     },
//     {
//         image: 'Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg',
//         name: 'Product 4',
//         description: 'Another unique description.',
//         size: '1000 ml',
//         quantity: 1,
//         price: 100,
//         currency: 'LE'
//     }
// ];







var cartona = document.querySelectorAll('.inner-table');

function renderItems() {
    let getSubtotal = 0;
    let content = '';

    for (let index = 0; index < itemsData.length; index++) {
        const item = itemsData[index];

        content += `
            <div class="row my-5 px-3">
                <div class="col-7 m-0 p-0">
                    <div class="m-0 p-0">
                        <p class="p-0 m-0 fs-small fs-4">${item.name}</p>
                        <p class="p-0 m-0 fs-small fs-6 "><span class="colr-yellow">${item.os}</span> ${item.model}</p>
                    </div>
                </div>
                <div class="col-5  p-0 m-0">
                    <div class="row  w-100 p-0 m-0 justify-content-between">
                        <div class="col-4 fs-6 p-0 text-end">${item.quantity} x </div>
                        <div class="col-8 fs-6 p-0 text-end">${(item.oldPrice * (1 - item.discount / 100)).toFixed(2)} LE</div>
                    </div>
                </div>
            </div>
        `;

        getSubtotal += (item.oldPrice * (1 - item.discount / 100)) * item.quantity;
    }

    cartona.forEach(element => {
        element.innerHTML = content;
    });

    let tot = document.querySelectorAll('.total');
    tot.forEach(el => el.innerHTML = getSubtotal.toFixed(2));
}

const checkoutData = {
    step1: {},
    step2: {},
    step3: {}
};

function collectStep1Data() {
    checkoutData.step1.email = document.getElementById('email').value;
    checkoutData.step1.firstName = document.getElementById('fname').value;
    checkoutData.step1.lastName = document.getElementById('lname').value;
}


function collectStep2Data() {
    checkoutData.step2.Country = document.getElementById('Country').value;
    checkoutData.step2.Address = document.getElementById('Address').value;
    checkoutData.step2.city = document.getElementById('city').value;
    checkoutData.step2.zipCode = document.getElementById('zcode').value;
    checkoutData.step2.stateProvince = document.getElementById('stateProvince').value;
    checkoutData.step2.countryCode = document.getElementById('ccode').value;
    checkoutData.step2.phone = document.getElementById('phone').value;

    const DeliveryOptions = document.getElementsByName('itemGroup');
    let selectedDeliveryOption = null; // Initialize variable to hold the selected option
    for (let i = 0; i < DeliveryOptions.length; i++) {
        if (DeliveryOptions[i].checked) {
            selectedDeliveryOption = DeliveryOptions[i].nextElementSibling.innerText; // Get label text
            checkoutData.step2.selectedDeliveryOption = selectedDeliveryOption;
            break; // Stop once we find the selected option
        }
    }
    
    // If no radio button is selected, you might want to handle that case
    if (!selectedDeliveryOption) {
        checkoutData.step2.selectedDeliveryOption = "None selected";
    }
}



function collectStep3Data() {
    checkoutData.step3.NameOfCard = document.getElementById('NOCard').value;
    checkoutData.step3.cardNumber = document.getElementById('cnumber').value;
    checkoutData.step3.Expiration = document.getElementById('Expiration').value;
    checkoutData.step3.ccv = document.getElementById('ccv').value;



    const paymentOptions = document.getElementsByName('itemGroup2');
    let selectedPaymentOption = null; // Initialize variable to hold the selected option
    for (let i = 0; i < paymentOptions.length; i++) {
        if (paymentOptions[i].checked) {
            selectedPaymentOption = paymentOptions[i].nextElementSibling.innerText; // Get label text
            checkoutData.step3.selectedPaymentOption = selectedPaymentOption;
            break; // Stop once we find the selected option
        }
    }
    
    // If no radio button is selected, you might want to handle that case
    if (!selectedPaymentOption) {
        checkoutData.step3.selectedPaymentOption = "None selected";
    }

    // Collecting checkbox values
    const checkboxOptions = [
        { option: 'Use shipping address as billing address', checked: document.getElementById('option1').checked },
        { option: 'I accept TYH Terms & Conditions', checked: document.getElementById('option2').checked }
    ];
    
    // Assign the checkbox options array to checkoutData
    checkoutData.step3.checkboxes = checkboxOptions;

}




document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.first-check-step');

    let currentStep = 0;

    // Start with the first step active and fading in
    steps[currentStep].classList.add('active');
    fadeInElements(steps[currentStep]);

    document.querySelectorAll('.proceed').forEach((button, index) => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            let isStepValid = false;

            // Validate steps based on the current index
            if (index === 0) {
                isStepValid = validateForm();
                if (isStepValid) {
                    collectStep1Data();
                }
            } else if (index === 1) {
                isStepValid = validateForm2();
                if (isStepValid) {
                    collectStep2Data();
                }
            } else if (index === 2) {
                isStepValid = validateForm3();
                if (isStepValid) {
                    collectStep3Data();
                }
            }

            if (!isStepValid) return;

            steps[currentStep].classList.add('exit');

            setTimeout(() => {
                steps[currentStep].classList.remove('active', 'exit');
                currentStep++;

                if (currentStep < steps.length) {
                    steps[currentStep].classList.add('active');
                    fadeInElements(steps[currentStep]);
                } else {
                    console.log(checkoutData);
                    sendCheckoutData(checkoutData);
                }
            }, 500);
        });
    });

    document.querySelectorAll('input[name="itemGroup2"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.radio-row').forEach(row => {
                row.style.opacity = '0.5';
            });
            this.closest('.radio-row').style.opacity = '1';
        });
    });

    // Function to fade in elements one by one
    function fadeInElements(step) {
        const fadeIns = step.querySelectorAll('.fade-in');
        fadeIns.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 300); // Adjust the timing as necessary
        });
    }
});











function sendCheckoutData(data) {
    console.log(data);
}

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



// function GoToOrder() {
//     // sendCheckoutData(checkoutData);
//     if(validateForm3()){

//         window.location.href = '../HTML/order.html';
//     }
// }



// عند الضغط على الزر، إضافة تأثير الخروج
const checkoutButtons = document.querySelectorAll('.GoToOrder');
checkoutButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // منع الانتقال الفوري
        if(validateForm3()){
        
            window.location.href = '../HTML/order.html'; // تغيير الرابط إلى صفحة الدفع
    }
    });
});


























function goToCard() {
    window.location.href = '../HTML/cart.html';
}


function validateForm() {
    const email = document.getElementById('email');
    const firstName = document.getElementById('fname');
    const lastName = document.getElementById('lname');
    let isValid = true;
    let hasData = false;


    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    // Validate email
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.value.match(emailPattern)) {
        document.querySelector('.error-message').style.display = 'block'; // Display email error
        isValid = false;
        hasData = true;

    }

    // Validate first name
    if (firstName.value === '') {
        document.querySelector('.fname-message').style.display = 'block';// Display first name error
        isValid = false;
    } else {
        document.querySelector('.fname-message').style.display = 'none'; // Hide first name error if valid
        hasData = true;

    }

    // Validate last name
    if (lastName.value === '') {
        document.querySelector('.lname-message').style.display = 'block'; // Display last name error
        isValid = false;
    } else {
        document.querySelector('.lname-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }

    return isValid && hasData; // Return the validation result
}


function validateForm2() {
    const Country = document.getElementById('Country');
    const Address = document.getElementById('Address');
    const City = document.getElementById('city');
    const zcode = document.getElementById('zcode');
    const stateProvince = document.getElementById('stateProvince');
    const ccode = document.getElementById('ccode');
    const phone = document.getElementById('phone');
    const radioValue = validateRadioSelection('itemGroup','radio-error-message');



    let isValid = true;
    let hasData = false;


    // Validate first name
    if (Country.value === '') {
        document.querySelector('.country-message').style.display = 'block'; // Display first name country
        isValid = false;
    } else {
        document.querySelector('.country-message').style.display = 'none'; // Hide first name error if valid
        hasData = true;
    }
    // Validate last name
    if (Address.value === '') {
        document.querySelector('.add-message').style.display = 'block'; // Display last name add
        isValid = false;
    } else {
        document.querySelector('.add-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (City.value === '') {
        document.querySelector('.city-message').style.display = 'block'; // Display last name city
        isValid = false;
    } else {
        document.querySelector('.city-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (zcode.value === '') {
        document.querySelector('.zip-message').style.display = 'block'; // Display last name zip
        isValid = false;
    } else {
        document.querySelector('.zip-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (stateProvince.value === '') {
        document.querySelector('.ps-message').style.display = 'block'; // Display last name ps
        isValid = false;
    } else {
        document.querySelector('.ps-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (ccode.value === '') {
        document.querySelector('.ccode-message').style.display = 'block'; // Display last name ccode
        isValid = false;
    } else {
        document.querySelector('.ccode-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (phone.value === '') {
        document.querySelector('.phone-message').style.display = 'block'; // Display last name phone
        isValid = false;
    } else {
        document.querySelector('.phone-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }


    return isValid && hasData && radioValue; // Return the validation result
}

function validateForm3() {
    const NOCard = document.getElementById('NOCard');
    const cnumber = document.getElementById('cnumber');
    const Expiration = document.getElementById('Expiration');
    const ccv = document.getElementById('ccv');
    const radioValue = validateRadioSelection('itemGroup2','radio-error-message2');
    const checkValue = validateCheckboxSelection();




    let isValid = true;
    let hasData = false;


    // Validate first name
    if (NOCard.value === '') {
        document.querySelector('.NOCard-message').style.display = 'block'; // Display first name error
        isValid = false;
    } else {
        document.querySelector('.NOCard-message').style.display = 'none'; // Hide first name error if valid
        hasData = true;
    }
    // Validate last name
    if (cnumber.value === '') {
        document.querySelector('.cnumber-message').style.display = 'block'; // Display last name error
        isValid = false;
    } else {
        document.querySelector('.cnumber-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (Expiration.value === '') {
        document.querySelector('.Expiration-message').style.display = 'block'; // Display last name error
        isValid = false;
    } else {
        document.querySelector('.Expiration-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }
    // Validate last name
    if (ccv.value === '') {
        document.querySelector('.ccv-message').style.display = 'block'; // Display last name error
        isValid = false;
    } else {
        document.querySelector('.ccv-message').style.display = 'none'; // Hide last name error if valid
        hasData = true;
    }


    return isValid && hasData && radioValue && checkValue; // Return the validation result
}


// إضافة حدث لكل حقل لإجراء التحقق في الوقت الحقيقي
document.getElementById('email').addEventListener('input', function () {
    const emailError = document.querySelector('.error-message');
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (this.value.match(emailPattern)) {
        emailError.style.display = 'none'; // Hide email error when valid
    } else {
        emailError.style.display = 'block'; // Show email error when invalid
    }

     // تحقق من صحة النموذج
});

document.getElementById('fname').addEventListener('input', function () {
    const firstNameError = document.querySelector('.fname-message');

    if (this.value !== "") {
        firstNameError.style.display = 'none'; // Hide first name error when valid
    } else {
        firstNameError.style.display = 'block'; // Show first name error when invalid
    }

     // تحقق من صحة النموذج
});

document.getElementById('lname').addEventListener('input', function () {
    const lastNameError = document.querySelector('.lname-message');

    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }

     // تحقق من صحة النموذج
});

// Adding event listeners to the input fields
document.getElementById('Country').addEventListener('input', function () {
    const lastNameError = document.querySelector('.country-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('Address').addEventListener('input', function () {
    const lastNameError = document.querySelector('.add-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('city').addEventListener('input', function () {
    const lastNameError = document.querySelector('.city-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

// Continue adding similar event listeners for remaining fields
document.getElementById('zcode').addEventListener('input', function () {
    const lastNameError = document.querySelector('.zip-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('stateProvince').addEventListener('input', function () {
    const lastNameError = document.querySelector('.ps-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('ccode').addEventListener('input', function () {
    const lastNameError = document.querySelector('.ccode-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('phone').addEventListener('input', function () {
    const lastNameError = document.querySelector('.phone-message');
    if (this.value !== "") {
        lastNameError.style.display = 'none'; // Hide last name error when valid
    } else {
        lastNameError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});


// Continue adding similar event listeners for remaining fields
document.getElementById('NOCard').addEventListener('input', function () {
    const NOCardError = document.querySelector('.NOCard-message');
    if (this.value !== "") {
        NOCardError.style.display = 'none'; // Hide last name error when valid
    } else {
        NOCardError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('cnumber').addEventListener('input', function () {
    const cnumberError = document.querySelector('.cnumber-message');
    if (this.value !== "") {
        cnumberError.style.display = 'none'; // Hide last name error when valid
    } else {
        cnumberError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('Expiration').addEventListener('input', function () {
    const ExpirationError = document.querySelector('.Expiration-message');
    if (this.value !== "") {
        ExpirationError.style.display = 'none'; // Hide last name error when valid
    } else {
        ExpirationError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});

document.getElementById('ccv').addEventListener('input', function () {
    const ccvError = document.querySelector('.ccv-message');
    if (this.value !== "") {
        ccvError.style.display = 'none'; // Hide last name error when valid
    } else {
        ccvError.style.display = 'block'; // Show last name error when invalid
    }
     // Validate the form
});





function validateRadioSelection(itemGroup, radioMessage) {
    const radioGroup = document.getElementsByName(itemGroup);
    const errorMessage = document.querySelector(`.${radioMessage}`);
    let isRadioSelected = false;

    // Check if any radio button in the group is selected
    for (let radio of radioGroup) {
        if (radio.checked) {
            isRadioSelected = true;
            break;
        }
    }

    // Display an error message if no option is selected
    if (!isRadioSelected) {
        errorMessage.style.display = 'block'; // Show error message
    } else {
        errorMessage.style.display = 'none'; // Hide error message
    }

    return isRadioSelected;
}

// Add event listeners to the first group of radio buttons
const radioButtons1 = document.querySelectorAll('input[name="itemGroup"]');
radioButtons1.forEach(radio => {
    radio.addEventListener('change', function () {
        // Hide the error message when a radio button is selected
        validateRadioSelection('itemGroup', 'radio-error-message');
    });
});

// Add event listeners to the second group of radio buttons
const radioButtons2 = document.querySelectorAll('input[name="itemGroup2"]');
radioButtons2.forEach(radio => {
    radio.addEventListener('change', function () {
        // Hide the error message when a radio button is selected
        validateRadioSelection('itemGroup2', 'radio-error-message2');
    });
});



const checkboxes = document.querySelectorAll('.custom-checkbox');
const errorMessage = document.querySelector('.checkbox-error-message');

// Add event listeners to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            errorMessage.style.display = 'none'; // Hide the error message when a checkbox is selected
        }
    });
});

// Function to validate checkbox selection
function validateCheckboxSelection() {
    let isCheckboxSelected = false;

    // Check if at least one checkbox is selected
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            isCheckboxSelected = true;
        }
    });

    // Display error message if no checkbox is selected
    if (!isCheckboxSelected) {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }

    return isCheckboxSelected;
}



// document.addEventListener('DOMContentLoaded', function() {
//     const content = document.querySelector('.new-content');

//     // إضافة تأثير دخول المحتوى
//     content.classList.add('content-enter');

//     // بعد فترة قصيرة، نضيف الفئة الفعالة
//     setTimeout(() => {
//         content.classList.add('content-enter-active');
//     }, 10);
// });



