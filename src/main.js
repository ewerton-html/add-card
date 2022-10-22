const ccBgColor01 = document.querySelector(".cc");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

const color = {
  visa:["url('./public/cc-bg-visa.svg')"],
  mastercard:["url('./public/cc-bg-mastercard.svg')"],
  default:["url('./public/cc-bg-default.svg')"]
}

function setCardType(type){
  ccBgColor01.setAttribute("style",`background-image:url('./public/cc-bg-${type}.svg');`)
  console.log(ccBgColor01)
  ccLogo.setAttribute("src", `./public/cc-${type}.svg`)
}

globalThis.setCardType = setCardType;


const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask:"0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks:{
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to:String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask:[
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d{0,2}|^2[3-7]\d{0-2})\d{0,12}/,
      cardtype: "mastercard", 
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
  const number = (dynamicMasked.value + appended).replace(/\D/g,'')
  const foundMask = dynamicMasked.compiledMasks.find(function (item) {
    return number.match(item.regex)
  })
  console.log(foundMask)  
  return foundMask                                           
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("form button")
addButton.addEventListener("click", ()=>{
  alert("Cartão adicionado!")
})


const cardHolder = document.querySelector("#card-holder"); 
cardHolder.addEventListener("input", ()=>{
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value 
})


securityCodeMasked.on("accept", ()=>{
  const ccSecurity = document.querySelector(".cc-extra .cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value
})

securityCodeMasked.on("accept", ()=>{
  const ccSecurity = document.querySelector(".cc-extra .cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value
})


expirationDateMasked.on("accept", ()=>{
  const ccExpiration = document.querySelector(".cc-extra .cc-expiration .value")
  ccExpiration.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value
})


cardNumberMasked.on("accept", ()=>{
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)


  const ccNumber = document.querySelector(".cc-info .cc-number")
  ccNumber.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value
})