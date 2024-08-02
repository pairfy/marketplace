<template>
  <div class="p-chat">
    <div class="p-chat-top">
      <img src="@/assets/empty-user.png" alt="" />

      <span>{{ shortFormat(getSlotData.buyer_pubkeyhash, 20, "Buyer") }}</span>

      <button
        @click="toggleMenu"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      >
        <i class="pi pi-ellipsis-v" />
      </button>

      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
    </div>
    <div class="p-chat-body" id="scroll">
      <BubbleMsg
        v-for="(item, index) in messageHistory"
        :key="item"
        :content="item.content"
        :last="messageHistory.length - 1 === index"
        :sender="item.role === 'SELLER'"
        :date="item.date"
        @onLast="scrollBottom"
      />
    </div>
    <div class="p-chat-bottom">
      <div class="p-chat-editor">
        <div v-if="editor">
          <editor-content :editor="editor" id="editorElement" />
        </div>
        <button
          class="p-chat-editor-send"
          :class="{ active: characterCounter > 0 }"
          @click="sendMessage"
        >
          <i class="pi pi-send" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import headerAPI from "@/components/header/composable/header-api";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import BubbleMsg from "./BubbleMsg.vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { io } from "socket.io-client";
import { HOST } from "@/api/index";
import { sessionAPI } from "@/pages/session/api";
import { ref, computed } from "vue";
import { shortFormat } from "@/utils";

export default {
  components: {
    EditorContent,
    BubbleMsg,
  },

  setup() {
    const { getCurrentSeller } = headerAPI();
    const { getSlotData } = sessionAPI();

    const socket = io(HOST, {
      query: {
        role: "SELLER",
        token: getCurrentSeller.value.token,
      },
    });

    const connectRoom = () => {
      const payload = {
        room: getSlotData.value.id,
      };
      socket.emit("joinRoom", JSON.stringify(payload));
    };

    connectRoom();

    const editor = ref(null);

    const editorLimit = ref(500);

    const characterCounter = computed(() => {
      if (editor.value === null) {
        return 0;
      }

      return editor.value.storage.characterCount.characters();
    });

    const getContent = () => {
      if (editor.value) {
        return editor.value.getJSON();
      }
    };

    const sendMessage = () => {
      if (characterCounter.value < 1) {
        return;
      }

      const payload = {
        room: getSlotData.value.id,
        content: getContent(),
      };

      socket.emit("message", JSON.stringify(payload));

      if (editor.value) {
        editor.value.commands.clearContent();
      }
    };

    let messageHistory = ref([]);

    const scrollBottom = () => {
      const div = document.getElementById("scroll");
      if (div) {
        setTimeout(() => {
          div.scrollTop = div.scrollHeight;
        }, 100);
      }
    };

    const menu = ref();

    const menuItems = ref([
      {
        label: "Options",
        items: [
          {
            label: "Report",
            icon: "pi pi-receipt",
          },
        ],
      },
    ]);

    const toggleMenu = (event) => {
      menu.value.toggle(event);
    };

    return {
      socket,
      editor,
      menu,
      connectRoom,
      getSlotData,
      menuItems,
      sendMessage,
      getCurrentSeller,
      characterCounter,
      editorLimit,
      getContent,
      toggleMenu,
      messageHistory,
      scrollBottom,
      shortFormat,
    };
  },
  mounted() {
    const handleEnterKey = () => {
      this.sendMessage();
    };

    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: "editorClass",
        },
        handleKeyDown(view, event) {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleEnterKey();
            return true;
          }
          return false;
        },
      },
      extensions: [
        Document,
        Paragraph,
        StarterKit,
        Text,
        TextAlign.configure({
          alignments: ["left"],
          defaultAlignment: "left",
        }),
        Placeholder.configure({
          placeholder: "write a message…",
          emptyEditorClass: "is-editor-empty",
          emptyNodeClass: "my-custom-is-empty-class",
        }),
        CharacterCount.configure({
          limit: this.editorLimit,
        }),
      ],
      editable: true,
      content: "",
    });

    const setMessages = (msg) => {
      this.messageHistory = msg.map((e) => JSON.parse(e));
    };

    this.socket.on(this.getCurrentSeller.id, (msg) => {
      setMessages(msg);
    });

    const setMessage = (msg) => {
      this.messageHistory.push(JSON.parse(msg));
    };

    this.socket.on("message", function (msg) {
      setMessage(msg);
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="css" scoped>
::v-deep(.tiptap p.is-editor-empty:first-child::before) {
  color: var(--text-b);
  content: attr(data-placeholder);
  float: left;
  opacity: 0.5;
  font-size: var(--text-size-b);
  height: 0;
  font-weight: 500;
  pointer-events: none;
}

::v-deep(.tiptap p.is-empty::before) {
  color: var(--text-b);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

::v-deep(.editorClass) {
  width: 355px;
  padding: 0.75rem;
  border-radius: 6px;
  background: var(--base-b);
  font-weight: 500;
  text-align: left;
  font-size: var(--text-size-b);
  max-height: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border: 1px solid var(--border-b);
  transition-duration: 250ms;
  transition-property: all;
  transition-timing-function: ease-in-out;
}

::v-deep(.editorClass::-webkit-scrollbar) {
  display: none;
}

::v-deep(.editorClass:hover) {
  border: 1px solid var(--primary-c);
}

::v-deep(.ProseMirror-focused) {
  border: 1px solid var(--primary-c);
  outline: initial;
}

.p-chat {
  background: var(--base-a);
  width: 425px;
  height: 700px;
  border-radius: 16px;
  margin-left: auto;
  border: 3px solid var(--border-a);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.p-chat .p-chat-top {
  height: 100px;
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-a);
}

.p-chat .p-chat-top button {
  margin-left: auto;
  background: transparent;
  border: none;
  cursor: pointer;
}

.p-chat .p-chat-top img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-a);
  background: var(--base-a);
}

.p-chat .p-chat-top span {
  margin-left: 1rem;
  font-weight: 500;
}

.p-chat .p-chat-body {
  height: 100%;
  background: var(--base-a);
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 1rem;
}

.p-chat-body::-webkit-scrollbar {
  width: 8px;
}

.p-chat-body::-webkit-scrollbar-track {
  background: var(--base-b);
  border-radius: 8px;
}

.p-chat-body::-webkit-scrollbar-thumb {
  background: #b7bdc6;
  border-radius: 8px;
}

.p-chat-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.p-chat .p-chat-bottom {
  padding: 1rem;
  border-top: 1px solid var(--border-a);
}

.p-chat .p-chat-editor {
  display: flex;
  align-items: center;
}

.p-chat .p-chat-editor-send {
  border: none;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base-a);
  color: var(--text-b);
  cursor: pointer;
}

.p-chat .p-chat-editor-send.active {
  color: var(--primary-c);
}

.p-chat .p-chat-editor-send i {
  transform: rotate(45deg);
  color: inherit;
  font-size: var(--text-size-e) !important;
}
</style>
