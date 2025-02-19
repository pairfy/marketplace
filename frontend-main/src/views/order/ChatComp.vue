<template>
    <div class="chat">
        <div class="header flex">
            <template v-if="getCurrentUser">
                <div class="avatar flex">
                    <img :src="createAvatarURL(getOrderData.order)" alt="">
                </div>
                <div class="name">
                    <span>{{ getOrderData.order.seller_username }}</span>
                    <div class="last">
                        {{ lastSeen }}
                    </div>
                </div>
            </template>
            <template v-if="getCurrentSeller">
                <div class="avatar flex">
                    <img src="@/assets/user.png" alt="">
                </div>
                <div class="name">
                    <span>{{ getOrderData.order.buyer_username }}</span>
                    <div class="last">
                        {{ lastSeen }}
                    </div>
                </div>

            </template>
        </div>
        <div class="content" id="scrollable">
            <div class="message" v-for="(item, index) in messageList" :key="index" :id="`m-${index}`">
                <MyMessage v-if="currentAgent === item.agent" :data="item" />
                <PartyMessage v-if="currentAgent !== item.agent" :data="item" />
            </div>
        </div>
        <div class="footer">
            <div class="footer-top flex">
                <button class="flex">
                    <i class="pi pi-image" />
                </button>
            </div>

            <div class="footer-bottom flex">
                <Textarea class="chat-input" id="chatInput" unstyled rows="1" cols="30" v-model="chatInput" autoResize
                    @keydown="handleEnter" placeholder="Chat with the other party..." />

                <div class="chat-send flex" @click="sendMessage">
                    <i class="pi pi-send" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import gql from 'graphql-tag'
import orderAPI from '@/views/order/api/index'
import MyMessage from '@/views/order/MyMessage.vue'
import PartyMessage from '@/views/order/PartyMessage.vue'
import headerAPI from '@/components/header/api'
import { useSubscription, useMutation, useQuery } from "@vue/apollo-composable"
import { computed, watch, ref, onBeforeUnmount, inject, nextTick, onMounted, onUnmounted } from "vue"
import { format } from 'timeago.js';

const { setupAudio } = inject('utils');

const { getCurrentSeller, getCurrentUser } = headerAPI();

const currentAgent = computed(() => {
    return getCurrentSeller.value?.id || getCurrentUser.value?.pubkeyhash
})

const { getOrderData } = orderAPI();

const { playNotification } = setupAudio();

const userViewing = ref(true);

const chatInput = ref("");

const messageList = ref([]);

const lastSeen = computed(() => {
    const msg = messageList.value.filter(msg => msg.seen && msg.agent === currentAgent.value).at(-1);

    if (msg) {
        return "Last seen " + format(msg.created_at);
    }
});



///////////////////////////////////////////////////////////////////////////////////////////////

const getMessagesVariables = ref({
    "getMessagesVariables": {
        session: getOrderData.value.session,
    }

})

const { result: onGetMessagesResult } = useQuery(gql`
      query getMessages($getMessagesVariables: GetMessagesInput!) {
        getMessages(getMessagesInput: $getMessagesVariables) {
           messages { 
            id
            agent
            role
            content
            seen
            created_at
           }
    
           seen
        }
      }
    `,
    getMessagesVariables,
    {
        clientId: 'chat',
        pollInterval: 60000,
        enabled: true,
        lazy: true
    })


const unwatchMessages = watch(onGetMessagesResult, value => {
    messageList.value = [];

    messageList.value.push(...value.getMessages.messages);

    messageList.value = updateUnseenMessages(messageList.value, value.getMessages.seen);

    scrollToBottom();
})

///////////////////////////////////////////////////////////////////////////////////////////////

const { result: onNewMessagesResult, onError: onNewMessagesError } = useSubscription(gql`
      subscription newMessages($session: ID!){
         newMessages(session: $session) {
          id
          agent
          role
          content
          seen
          created_at
        }
      }
    `,

    () => ({
        session: getOrderData.value.session
    }),
    {
        clientId: "chat",
        enabled: true,
        lazy: true
    }
)

onNewMessagesError((error, context) => {
    console.error(error, context)
})

const unwatchChat = watch(
    onNewMessagesResult,
    data => {
        console.log("New message received:", data.newMessages);

        messageList.value.push(data.newMessages);

        scrollToBottom();

        if (!userViewing.value) {
            playNotification()
            document.title = `${document.title} | New Message`;
        }

    },
    {
        lazy: true
    }
)


///////////////////////////////////////////////////////////////////////////////////////////////

const { mutate: createMessage, onDone: onCreateMessageDone } = useMutation(gql`
  mutation createMessage ($createMessageVariable: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageVariable) {
      success
    }
  }
`,
    {
        clientId: "chat"
    })


onCreateMessageDone(() => {
    console.log(chatInput.value);
    chatInput.value = ""
})

const sendMessage = () => {
    createMessage({
        "createMessageVariable": {
            session: getOrderData.value.session,
            content: chatInput.value
        }
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////

const handleEnter = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        const textarea = document.getElementById('chatInput');
        const cursorPos = textarea.selectionStart;
        chatInput.value =
            chatInput.value.slice(0, cursorPos) +
            '\n' +
            chatInput.value.slice(cursorPos);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
        });
    } else if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage()
    }
};

function scrollToBottom() {
    nextTick(() => {
        const element = document.getElementById(`m-${messageList.value.length - 1}`);

        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "end" });
        }

    })
}

function handleVisibilityChange() {
    if (document.hidden) {
        userViewing.value = false;
    } else {
        userViewing.value = true;
    }
};

function createAvatarURL(order) {
    if (!order) {
        return;
    }

    return order.seller_avatar_base + order.seller_avatar_path
};

function updateUnseenMessages(messages, seen) {
    const seenList = new Set(Object.keys(JSON.parse(seen)));

    const processed = messages.map(item => {
        if (!item.seen && seenList.has(item.id)) {
            return { ...item, seen: true };
        }
        return item;
    });

    return processed

};


onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});

onBeforeUnmount(() => {
    unwatchChat()

    unwatchMessages()
})
</script>

<style lang="css" scoped>
.chat {
    width: 100%;
    min-height: 700px;
    border: 2px solid var(--border-a);
    border-radius: 20px;
    overflow: hidden;
    transition: 0.2s;
}

.header {
    border-bottom: 1px solid var(--border-a);
    padding: 1rem;
}

.avatar {
    background: var(--background-a);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid transparent;
}

.avatar img {
    width: 40px;
    height: 40px;
    object-fit: scale-down;
}

.name {
    margin-left: 1rem;
    display: block;
}

.last {
    font-size: var(--text-size-0);
    color: var(--text-b);
}

.content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 500px;
    font-size: var(--text-size-1);
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;
    scroll-behavior: smooth;
    padding: 1rem;
}

.content::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.content::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 2px;
}

.content::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
}

.content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}


.footer {
    border-top: 1px solid var(--border-a);
    width: inherit;
}

.footer-top {
    padding-top: 1rem;
    padding-left: 1rem;
    padding-bottom: 0;
}

.footer-top button {
    background: transparent;
    border: none;
    justify-content: center;
    cursor: pointer;
}

.footer-bottom {
    width: inherit;
    padding: 1rem;
}

.chat-input {
    padding: 0.75rem;
    outline: none;
    color: inherit;
    font-family: inherit;
    font-size: var(--text-size-1);
    transition: 0.2s;
    max-height: 100px;
    border: 1px solid var(--border-a);
    border-radius: 8px;
    resize: none;
    width: inherit;
    background: var(--background-b);
}

.chat-input:focus-within {
    border: 1px solid var(--text-a);
}

.chat-input::placeholder {
    color: var(--text-b);
    opacity: 0.5;
}

.chat-send {
    justify-content: center;
    width: 60px;
    height: inherit;
    cursor: pointer;
}

.chat-send i {
    font-size: var(--text-size-3);
    transform: rotate(45deg);
}
</style>