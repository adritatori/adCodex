import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.getElementById('formm');
const chatContainer = document.getElementById('chat_container');


let loadInerval;

function loader(element){
  element.textContent = '';

  loadInerval = setInterval(()=>{
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }
  }, 300)

}


function typeText(element,text){
  let index = 0;

  let interval = setInterval(()=>{
    if(index < text.length){
    
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  })
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
    console.log(`id-${timestamp}-${hexadecimalString}`);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAI, value, uniqueId) {

  return (
    `
    <div class = "wrapper ${isAI && 'ai'}">

    <div class="chat">
      <div class="profile">
        <img src="${isAI ? bot : user}"
        alt="${isAI?'bot':'user'}"/>
      </div>
    <div class = "message" id=${uniqueId}>${value}</div>
    </div>
    
    </div>
    `
  )
}


const handleSubmit = async (e) => {
e.preventDefault();

const data = new FormData(form);

chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

form.reset();

const uniqueId = generateUniqueId();

chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

chatContainer.scrollTop = chatContainer.scrollHeight;

const messageDiv = document.getElementById(uniqueId);

loader(messageDiv);
console.log(data.get("prompt"));
const response = await fetch('https://adcodex.onrender.com/',{
  method: 'POST',
  headers:{
    'Content-Type': 'application/json'
  },
  body:JSON.stringify({
    
    prompt:data.get('prompt')
  })
})

clearInterval(loadInerval);
messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();
   
  typeText(messageDiv, parsedData);
}else{
  const err = await response.text();
  messageDiv.innerHTML = "Something went wrong";
  console.log(err);
  alert(err);
}

}


form.addEventListener('submit', handleSubmit);
form.addEventListener("keyup", (e) => {
    if(e.keyCode === 13){
      handleSubmit(e);
    }

})