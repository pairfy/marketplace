<template>
  <div class="bubble-wrap" :class="{ sender: sender }">
    <editor-content
      :editor="editor"
      v-tooltip.left="{
        value: formatDate(date),
        pt: {
          text: {
            style: {
              fontSize: 'var(--text-size-a)',
            },
          },
        },
      }"
    />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

export default {
  components: {
    EditorContent,
  },
  emits: ["onLast"],
  props: {
    content: {
      type: Object,
      required: true,
    },
    last: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    sender: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const bubbleClass = `bubbleClass ${props.sender ? "sender" : ""}`;

    const editor = useEditor({
      extensions: [StarterKit],
      content: props.content,
      editable: false,
      editorProps: {
        attributes: {
          class: bubbleClass,
        },
      },
    });

    const formatDate = (inputDate) => {
      let date = new Date(inputDate);

      let day = date.getDate();
      let month = date.toLocaleString("en-US", { month: "long" });
      let year = date.getFullYear();


      let hours = date.getHours();
      let minutes = date.getMinutes();
      let period = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; 
      minutes = minutes < 10 ? "0" + minutes : minutes;

      let formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${period}`;

      return formattedDate;
    };

    onMounted(() => {
      if (props.last) {
        emit("onLast");
      }
    });


    return {
      editor,
      formatDate,
    };
  },
};
</script>

<style scoped>
.ProseMirror {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

::v-deep(.bubbleClass) {
  border-radius: 8px;
  max-width: 344px;
  background: rgb(245, 245, 245);
  line-height: 24px;
  padding: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: var(--text-size-b);
}

::v-deep(.sender) {
  background: #0084ff;
  color: var(--text-w);
}

.bubble-wrap {
  display: flex;
  margin-top: 1rem;
  justify-content: flex-start;
  text-align: start;
}

.bubble-wrap.sender {
  justify-content: flex-end;
}
</style>
