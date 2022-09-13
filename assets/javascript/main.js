const $ = document.querySelector.bind(document)


// Handle Validators
function Validator(selector) {
    var _this =  this
    function getParent (element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            } 
            element = element.parentElement
        }
    }
    var formRules = {}
    var validatorRules ={
        required: (value) => {
            return value ? undefined : 'vui long nhap truong nay'
        },
         email: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'vui long nhap email'
        },
        min: (min) => {
            return function (value) {
                return value.length >= min ? undefined :`mat khau toi thieu co ${min} ki tu`
            }

        }
    }
    // Get form element in DOM
    var formElement = document.querySelector(selector)
    // Handle when has element in DOm
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')
        // Get all function rule
        for ( var input of inputs) {
            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {
                var ruleInfo
                // get function min
                var isRuleHasValue = rule.includes(':')
                
                // console.log(ruleFunc)
                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                var ruleFunc = validatorRules[rule]
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
                // Push function into Array of formRules
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] =[ruleFunc]
                }
            }
            input.onblur = handleValidate
            input.oninput = handleClearError
            
            // Handle validate
            function handleValidate (event) {
                var rules = formRules[event.target.name]
                var errorMessage
                for (var rule of rules ) {
                    errorMessage = rule(event.target.value)
                    if (errorMessage) {
                        break;
                    }
                }                      
                //  If has error
                if (errorMessage) {
                    var formGroup = getParent(event.target, '.form-group')
                    if (formGroup) {
                        formGroup.classList.add('invalid')
                        var formMessage = formGroup.querySelector('.form-message')
                        formMessage.innerText = errorMessage
                    }
                }

             return !errorMessage
            }
            function handleClearError (event) {
                var formGroup = getParent(event.target, '.form-group')
                if (formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid')
                    formGroup.querySelector('.form-message').innerText =''
                }
            }
        }
    }

    // Get  Sibling Element
    function getSiblingElement (element,selector) {
        while (element.nextElementSibling) {
            if (element.nextElementSibling.matches(selector)) {
                return element.nextElementSibling
            } 
            element = element.nextElementSibling
        }
        
    }
    // Handle submit event
    const modal = $('.modal')
    const confirmBtn = getSiblingElement(formElement,'.auth-form__controls').querySelector('.btn.btn--primary')
    const backBtn = getSiblingElement(formElement,'.auth-form__controls').querySelector('.btn.auth-form__control-back')
    // console.log(backBtn)
    backBtn.onclick =()=> {
        modal.style.display = ' none'
    }
    confirmBtn.onclick = function (event) {
        // event.preventDefault()
        var isValid = true
        var hasValue = false
        var inputs = formElement.querySelectorAll('[name][rules]')
        for ( var input of inputs) {
          if  (!handleValidate({ target: input })) {
            isValid =false;
          }
        }
        // Handle User Click Back Button
        
        // When no error
        if (isValid) {
            hasValue =true
            if (hasValue) {
                if (confirmBtn.innerText === "ĐĂNG KÝ") {
                    modal.style.display = ' none'
                }
                else {
                    login.onclick = () => {
                        const email = form_login.querySelector('input[name="email"]').value
                        const password = form_login.querySelector('input[name="password"]').value
                        var hasAccount = userAccounts.some(userAccount =>{
                            return email === userAccount.email && password === userAccount.password
                        })
                        if (hasAccount) {
                            modal.style.display = 'none'
                            registerBtn.style.display = 'none'
                            loginBtn.style.display = 'none'
                            userAccount.style.display = 'flex'
                        }    
                    }
                }
            }
            if ( typeof _this.onSubmit === 'function') {
                var data
                var enabledInputs = formElement.querySelectorAll('[name]')
                data = Array.from(enabledInputs).reduce( (values, input) => {
                    switch (input.type) {
                        case 'radio':
                            if (input.matches(':checked')) {
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]');
                            } else values[input.name] = ''
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) return values
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = []
                            }
                            value[input.name].push(input.value)
                            break
                        case 'file':
                            value[input.name] =input.files
                        default:
                            values[input.name] = input.value
                    }
                    return  values;
                },{})
                _this.onSubmit(data)
            }
             
        }
    }
}

// GEt Element From Dom
const loginBtn = $('.header__navbar-item-bold-2')
const registerBtn = $('.header__navbar-item-bold-1')
const form_register = $('#form-register')
const form_login = $('#form-login')
const modal = $('.modal')
const changeFormLogin = $('.auth-form__switch-btn-1')
const changeFormRegister = $('.auth-form__switch-btn-2')
const userAccount = $('.header__navbar-user')
const logOutBtn =$('.log-out')
const login = form_login.querySelector('.btn--primary')
const register = form_register.querySelector('.btn--primary')
var userAccounts = [
    {
        id:1,
        email: 'tinh@gmail.com',
        password: '1234'
    }
]
function handleLoginAndRegister() {
// Handle Login
function handleLogin() {
    loginBtn.onclick = () => {
        loginAndRegister(form_login, form_register)
    }
    changeFormRegister.onclick = () => {
        loginAndRegister(form_register, form_login)
    }

}

// Handle Login Account
// handle log out
function logOut() {
    logOutBtn.onclick = function() {
        registerBtn.style.display = 'block'
        loginBtn.style.display = 'block'
        userAccount.style.display = 'none'
    }
}
// Handle Register
function handleRegister() {
    registerBtn.onclick = () => {
        loginAndRegister(form_register, form_login)
    }
    changeFormLogin.onclick = () => {
        loginAndRegister(form_login, form_register)
    }
}

// Function Handle Login And Register
function loginAndRegister(form_1,form_2) {
    modal.style.display = 'flex'
    form_1.style.display = 'block'
    form_2.style.display = 'none'
    form_1.onclick = function (e) {
        e.stopPropagation()
    }
    modal.onclick = function (e) {
        modal.style.display = 'none'
    }
}


 handleLogin()
 logOut()
 handleRegister()
}




// Handle Navbar
function handleNavbar() {
    const navbarBtn = $('.header__navbar-bar-option')
    const navbar = $('.header__bar-mobile-tablet')
    const navbarOverlay = $('.header__navbar-overlay')
    var isOpen = false
    navbar.onclick = (e) => {
        e.stopPropagation()
    }
    navbarBtn.onclick = (e) => {
        e.stopPropagation()
        if (isOpen) {
            isOpen = !isOpen
            navbar.style.display = 'none'
            navbarOverlay.style.display = 'none'
        } else {
            isOpen = !isOpen
            navbar.style.display = 'block'
            navbarOverlay.style.display = 'block'

        }
    }
    document.onclick =() => {
        navbar.style.display = 'none'
        navbarOverlay.style.display = 'none'
    }
}

function handleEvent (elementBtn,elementLayout) {
        const btn = $(elementBtn)
        const layout = $(elementLayout)
        var isOpen = false
        btn.onclick = () => {
            if (isOpen) {
                isOpen = !isOpen
                layout.style.display = 'none'
            } else {
                isOpen = !isOpen
                layout.style.display = 'block'
    
            }
        }


}

function reder() {
     
    function rederNotification() {
     
    var listNotifications = [
       {
        img: 'https://cf.shopee.vn/file/0469a082f14004eaf44093929d06ad93_tn',
        description: 'đã được xác nhận. Vui lòng kiểm tra thời gian nhận hàng dự kiến trong phần chi tiết đơn hàng nhé!',
        date: '12/23/2004'
       },
       {
        img: 'https://cf.shopee.vn/file/0469a082f14004eaf44093929d06ad93_tn',
        description: 'đã được xác nhận. Vui lòng kiểm tra thời gian nhận hàng dự kiến trong phần chi tiết đơn hàng nhé!',
        date: '12/23/2004'
       },
       {
        img: 'https://cf.shopee.vn/file/0469a082f14004eaf44093929d06ad93_tn',
        description: 'đã được xác nhận. Vui lòng kiểm tra thời gian nhận hàng dự kiến trong phần chi tiết đơn hàng nhé!',
        date: '12/23/2004'
       },
    ]
    const wrapNotifications = $('.header__notifi-list')
    var htmls = listNotifications.map((listNotification) => {
        return `
        <li class="header__notifi-item">
            <a href="header__notifi-link" class="header__notifi-link">
            <img src="${listNotification.img}" alt="" class="header__notifi-img">
                <div class="header__notifi-info">
                    <span class="header__notifi-desc">${listNotification.description}</span>
                    <span class="header__notifi-date">${listNotification.date}</span>
            </div>
        </a>
    </li> 
        `
    })
    wrapNotifications.innerHTML = htmls.join('')


   }
    function rederListCart() {
        const wrapCart =$('.header__cart-list-product')
        var listCartProducts = [
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },
            {
                img: 'https://cf.shopee.vn/file/e00c554ab3e8e04ecfa0258acc4d01f0_tn',
                name:'Sản phẩm tốt chất lượng',
                price: '1.300.222đ',
                quantity: '4',
                type:'Áo Khoác'
            },            
        ]
        var htmls = listCartProducts.map((listCartProduct) => {
            return `
                <li class="header__cart-item-product">
                    <img src="${listCartProduct.img}" alt="" class="header__cart-item-img">
                    <div class="header__cart-item-info">
                        <div class="header__cart-item-desc">
                            <h5 class="header__cart-item-name">${listCartProduct.name}</h5>
                            <div class="header__cart-price-warp">
                                <span class="header__cart-item-price">${listCartProduct.price}</span>
                                <span class="header__cart-item-multiphy">x</span>
                                <span class="header__cart-item-quantity">${listCartProduct.quantity}</span>
                            </div>
                        </div>
                        <div class="header__cart-item-body">
                            <span class="header__cart-item-type">Phân loại:${listCartProduct.type}</span>
                            <span class="header__cart-item-delete">Xóa</span>  
                        </div>
                    </div>
                </li>  
                `
        })
        wrapCart.innerHTML = htmls.join('')
    }
    function rederProduct() {
        const wrapListProduct = $('.row.sm-gutter')
        var listProducts = [
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },

            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },

            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },

            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },

            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },

            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
            {
                img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
                name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
                oldPrice:'1.250.000đ',
                newPrice:'899.000đ',
                sold: 'Đã bán 212',
                band: 'GAN',
                origin: 'China',
                priceFall: '28%',
                desc: 'GIẢM'
            },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
    
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
    
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
    
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
    
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
    
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        },
        {
            img: 'https://cf.shopee.vn/file/891eeed6ac60648d7c5371d5b0a29090_tn',
            name: '[Siêu Phẩm 2021] Rubik 3x3x3 GAN 12 SERIES 3 phiên bản: Maglev & Gan 12M LEAP Stickerless không viền (Hãng Mod Nam châm)',
            oldPrice:'1.250.000đ',
            newPrice:'899.000đ',
            sold: 'Đã bán 212',
            band: 'GAN',
            origin: 'China',
            priceFall: '28%',
            desc: 'GIẢM'
        }
            
        ]
        var htmls = listProducts.map( listProduct => {
            return `
                <div class="col l-2-4 m-3 c-6">
                    <div class="home-product-item">
                        <div class="home-product-item__img" style="background-image: url(${listProduct.img})"></div>
                        <h4 class="home-product-item__name">${listProduct.name}</h4>
                        <div class="home-product-item__price">
                            <span class="home-product-item__price-old">${listProduct.oldPrice}</span>
                            <span class="home-product-item__price-new">${listProduct.newPrice}</span>
                        </div>
                        <div class="home-product-item__action">
                            <span class="">
                                <i class="home-product-item__like fa-regular fa-heart"></i>
                                <i class="home-product-item__liked fa-solid fa-heart"></i>
                            </span>
                            <div class="home-product-item__ratting">
                                <i class="home-product-item__ratting-icon fa-solid fa-star"></i>
                                <i class="home-product-item__ratting-icon fa-solid fa-star"></i>
                                <i class="home-product-item__ratting-icon fa-solid fa-star"></i>
                                <i class="home-product-item__ratting-icon fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <span class="home-product-item__sold">${listProduct.sold}</span>
                        </div>
                        <div class="home-product-item__origin">
                            <span class="home-product-item__band">${listProduct.band}</span>
                            <span class="home-product-item__origin">${listProduct.origin}</span>
                        </div>
                        <div class="home-product-item__favourite">
                            <i class="fa-solid fa-check"></i>
                            Yêu thích
                        </div>
                        <div class="home-product-item__sale">
                            <div class="home-product-item__percent">${listProduct.priceFall}</div>
                            <div class="home-product-item__label">${listProduct.desc}</div>
                        </div>
                    </div>
                </div>  
            `
        })
        wrapListProduct.innerHTML = htmls.join('')
    }





    rederNotification()
    rederListCart()
    rederProduct()
}


    









function start () {
    
    reder()

    handleLoginAndRegister()

    Validator('#register-form')

    Validator('#login-form')
    // Handle Qr Code 

    handleEvent('.header__navbar-item--has-qr','.header__qr')
    // Handle Notifications

    handleEvent('.header__navbar-item-notifi','.header__notifi')
    // Handle List Carr

    handleEvent('.header__cart-wrap','.header__cart-list')

    handleNavbar()
   
}
start()



