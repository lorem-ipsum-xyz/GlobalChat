let socket = io()

const submit = document.getElementById('send');
submit.addEventListener('click', () => {
  const input = document.getElementById("msg-input");
  if(input.value.trim() !== ''){
    socket.emit('text', input.value.trim())
    input.value = ''
  }
})

socket.on('conn', (c) => {
  socket.emit('connected', {name:c.name,profile:c.pfp})
})

socket.on('message', (data) => {
  if(data.name === name){
    send_my_message(data.message);
  }else{
    send_other_message(data.name,data.message,data.profile)
  }
})

socket.on('chat', (data) => {
  if(data.connected){
    system_announe(`${data.name} joined the chat`)
  }else{
    system_announe(`${data.name} has been left`)
  }
})


// Nothinh
const scroll = () => document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
const getTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

  const time = `${hours}:${minutesFormatted}${ampm}`;
  return time;
}

// Sending Messages
function system_announe(msg){
  const container = document.getElementById('MESSAGES');
  
  const ann_container = document.createElement('div');
  ann_container.className = "announce-container";
  
  const line = document.createElement("div");
  line.className = 'line';
  
  const text = document.createElement('small');
  text.textContent = msg;
  
  line.appendChild(text)
  ann_container.appendChild(line)
  container.appendChild(ann_container)
  
  scroll()
}
function send_my_message(message){
  const container = document.getElementById('MESSAGES');

  const my_msg = document.createElement('div');
  my_msg.classList.add('my_message');
  const msg_container = document.createElement('div');
  msg_container.classList.add('message_container');
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.textContent = message;
  
  msg_container.appendChild(msg);
  my_msg.appendChild(msg_container);
  container.appendChild(my_msg);
  
  scroll();
}
function send_other_message(name, message, profile){
  const PROFILE_SRC = profilePath + profile
  const container = document.getElementById('MESSAGES');

  const other_msg = document.createElement('div');
  other_msg.classList.add('other_message');
  
  const pfp = document.createElement('div');
  pfp.classList.add('profile');
  const pfp_img = document.createElement('img');
  pfp_img.src = PROFILE_SRC
  
  pfp.appendChild(pfp_img);
  other_msg.appendChild(pfp)
  
  const msg_container = document.createElement('div');
  msg_container.classList.add('message_container');
  
  const msg_box = document.createElement('div');
  msg_box.classList.add('message_box');
  
  const msg = document.createElement('div');
  msg.classList.add('message');
  msg.textContent = message;
  
  const msg_time = document.createElement('div');
  msg_time.classList.add('msg-time');
  const small = document.createElement('small');
  small.textContent = `${name} - ${getTime()}`;
  
  msg_time.appendChild(small)
  msg_box.appendChild(msg);
  msg_box.appendChild(msg_time);
  msg_container.appendChild(msg_box);
  other_msg.appendChild(msg_container);
  
  container.appendChild(other_msg);
  
  scroll();
}
