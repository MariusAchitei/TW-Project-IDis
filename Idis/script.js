
const menuItem = document.querySelectorAll('.menu-item');


const removeActive = ()=>{
    menuItem.forEach(item => {
        item.classList.remove('active')        
    });
 }

menuItem.forEach(item => {
    item.addEventListener('click',()=>{
        removeActive();
        item.classList.add('active');

        if(item.id != 'notifice'){
            document.querySelector('.notification').style.display ='none'
        }else{
            document.querySelector('.notification').style.display ='block' 
            document.querySelector('#notifice .count').style.display='none'
        }
    })
})


const message = document.querySelector('#message');
const messageBox = document.querySelector('#message-box');

message.addEventListener('click',()=>{

    messageBox.classList.add('box-sh');
    message.querySelector('.count').style.display='none'


    setTimeout(() => {
        messageBox.classList.remove('box-sh');
    }, 2000);

})


const themeMenu = document.querySelector('#themeMenu');
const themBOx = document.querySelector('.theme')


themeMenu.addEventListener('click',()=>{
    themBOx.style.display= 'grid'
})


window.addEventListener('scroll',()=>{
    themBOx.style.display= 'none'
    document.querySelector('.notification').style.display ='none'
})