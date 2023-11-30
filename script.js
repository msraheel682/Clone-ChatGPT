const chatInput = document.querySelector("#chat-input");
const sendbtn = document.querySelector("#send-btn");
const chatcontainer = document.querySelector(".chat-container");
const themebtn = document.querySelector("#theme-btn");
const deletebtn = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "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";



const loadDataFromLocalstorage = ()=>{
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor ==="light_mode");
    themebtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatcontainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight); //scroll even bottom 
}

const createChatElement = (content, calssName)=>{
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("char" , calssName);
        chatDiv.innerHTML = content;
        return chatDiv; //return chatDiv 
}


const getChatResponse = async (incomingChatDiv) =>{
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    const requstOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Ensure API_KEY is the correct key
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }
    
    //send post request to Api
    try{
        const response = await(await fetch(API_URL, requstOptions)).json();
        console.log(response);
        pElement.textContent = response.choices[0].text.trim();
    }
    catch(error){
        pElement.classList.add("error");
        pElement.textContent = "Opps! somthing wents wrong please try again";
    }

    const typingAnimation = incomingChatDiv.querySelector(".typing-animation");
    if (typingAnimation) {
        typingAnimation.remove();
    }
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatcontainer.innerHTML);
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
}


const copyResponse = (copybtn)=>{
    const responseTextElement = copybtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copybtn.textContent = "done";
    setTimeout(()=>copybtn.textContent = "content_copy", 1000);
}


const showTypingAnimation = ()=>{
    const html =
    `<div class="chat-content">
         <div class="chat-details">
             <img src="gpt.webp" alt="" srcset="">
             <div class="typing-animation">
                 <div class="typing-dot" style="--delay:0.2s"></div>
                 <div class="typing-dot" style="--delay:0.3s"></div>
                 <div class="typing-dot" style="--delay:0.4s"></div>
             </div>
             <span onclick="copyResponse(this)"  class="material-symbols-outlined">content_copy</span>
         </div>
     </div>`;




            const incomingChatDiv = createChatElement(html, "incoming");
            chatcontainer.appendChild(incomingChatDiv);
            chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
            const typingAnimation = incomingChatDiv.querySelector(".typing-animation");
            if (typingAnimation) {
                getChatResponse(incomingChatDiv);
                
            }
}


const handleOutgoingChat = ()=>{
    userText = chatInput.value.trim();
    if(!userText) return;  // If chatInput is empty return from here

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="img.JPG" alt="" srcset="">
                    <p>${userText}</p>
                    </div>
                </div>`;


    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatcontainer.querySelector(".default-text")?.remove();
    chatcontainer.appendChild(outgoingChatDiv);
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);

}

deletebtn.addEventListener("click", ()=>{
    if(confirm("Are You sure You want to delete this chat?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});


themebtn.addEventListener("click", ()=>{
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themebtn.innerText);
    themebtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", ()=>{

    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && !e.shiftKey  && window.innerWidth>800){
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendbtn.addEventListener("click", handleOutgoingChat);





