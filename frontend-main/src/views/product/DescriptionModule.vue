<template>
    <div>
        <div class="title">Description</div>
        <Skeleton v-if="!getProductData" width="100%" height="500px" />
        <editor-content v-if="getProductData" :editor="editor" />
    </div>
</template>

<script setup>
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import productAPI from '@/views/product/api/index';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { onMounted, ref, nextTick, onBeforeUnmount, computed, watch } from 'vue';


const { getProductData } = productAPI();

const editor = ref(null);

const setupEditor = async () => {
    await nextTick(() => {
        editor.value = new Editor({
            editable: false,
            extensions: [
                StarterKit,
                TextStyle.configure({ types: [ListItem.name] }),
            ],
            editorProps: {
                attributes: {
                    class: 'editor-class',
                },
            },
            content: "aa",
        })
    });
}

watch(getProductData, () => {
    if (editor) {
        editor.value.commands.setContent(JSON.parse(getProductData.value?.features));
    }
})


onMounted(() => {
    setupEditor();
})

onBeforeUnmount(() => {
    editor.value.destroy()
})


</script>

<style lang="css" scoped>
::v-deep(.editor-class) {
    line-height: 2rem;
    color: var(--text-b);
}

.title {
    font-size: var(--text-size-c);
    font-weight: 600;
    line-height: 4rem;
}
</style>