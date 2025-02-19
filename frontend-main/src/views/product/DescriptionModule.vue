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
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';

const { getProductData } = productAPI();

const editor = ref(null);

const setupEditor = async () => {
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
        content: "",
    })

    if (getProductData.value) {
        const features = JSON.parse(getProductData.value.features);

        editor.value.commands.setContent(features);
    }


}

const unwatchData = watch(getProductData, async (value) => {
    if (value) {
        const features = JSON.parse(value.features);

        if (editor.value) {
            
            editor.value.commands.setContent(features);
        }
    }

}, { immediate: true })


onMounted(() => {
    setupEditor();
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }

    unwatchData()
})


</script>

<style lang="css" scoped>
::v-deep(.editor-class) {
    line-height: 2rem;
    font-size: var(--text-size-1);
}

.title {
    font-size: var(--text-size-c);
    font-weight: 600;
    line-height: 4rem;
}
</style>