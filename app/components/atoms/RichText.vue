<template>
    <div class="prose dark:prose-invert">
        <RichTextRenderer
            v-if="richTextContent"
            :document="richTextContent"
            :node-renderers="renderNodes"
        />
    </div>
</template>

<script setup>
import { h } from 'vue'
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import RichTextRenderer from 'contentful-rich-text-vue-renderer'

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
})

const richTextContent = computed(() => {
    return props.content
})

const renderNodes = computed(() => ({
    [INLINES.ENTRY_HYPERLINK]: customHyperlink,
    [INLINES.HYPERLINK]: customHyperlink,
    [BLOCKS.TABLE]: customTable,
    [BLOCKS.PARAGRAPH]: customParagraph,
    [BLOCKS.EMBEDDED_ASSET]: customAsset
}))

const customAsset = (node, key) => {
    const asset = node.data.target
    const contentType = asset?.fields?.file?.contentType
    let url = asset?.fields?.file?.url
    const title = asset?.fields?.title || ''
    if (!url) return null
    // Ensure url is absolute
    if (url.startsWith('//')) url = 'https:' + url
    if (contentType && contentType.startsWith('image/')) {
        return h('img', {
            key,
            src: url,
            alt: title,
            class: 'my-4 rounded shadow'
        })
    }
    if (contentType && contentType.startsWith('video/')) {
        return h('video', {
            key,
            src: url,
            controls: true,
            class: 'my-4 rounded shadow'
        })
    }
    // fallback for other asset types
    return h('a', { key, href: url, target: '_blank' }, title || url)
}

const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
const phoneRegex =
    /(\+?\d{1,4}?[-.\s]?(\()?(\d{1,3})?(\))?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/gi

const customHyperlink = (node, key) => {
    const isEntryHyperlink = node.nodeType === INLINES.ENTRY_HYPERLINK
    let dataTarget = node.data.uri

    if (!isEntryHyperlink && dataTarget && typeof dataTarget === 'string') {
        if (
            phoneRegex.test(dataTarget) &&
            !dataTarget.startsWith('tel:') &&
            !dataTarget.startsWith('http')
        ) {
            dataTarget = `tel:${dataTarget.replace('mailto:', '')}`
        } else if (
            emailRegex.test(dataTarget) &&
            !dataTarget.startsWith('mailto:') &&
            !dataTarget.startsWith('http')
        ) {
            dataTarget = `mailto:${dataTarget.replace('tel:', '')}`
        }
    }

    const href = !isEntryHyperlink && dataTarget ? dataTarget : node.data.target
    const target =
        isTel(href) || isMailto(href) || isEntryHyperlink ? '_self' : '_blank'

    // Use a function-based slot for the link content
    const linkContent = () => [node.content[0].value]

    return h(resolveComponent('NuxtLink'), { key, href, target }, linkContent)
}

const isTel = (uri) => {
    return uri?.startsWith('tel:')
}

const isMailto = (uri) => {
    return uri?.startsWith('mailto:')
}

const customTable = (node, key, next) => {
    const tableElement = h(
        'table',
        { key },
        h('tbody', { key }, next(node.content, key, next))
    )
    return h('div', { key, class: 'table-wrapper' }, [tableElement])
}

const customParagraph = (node, key, next) => {
    const textContent = node.content
        .map((contentNode) => contentNode.value)
        .join(' ')
    return textContent ? h('p', { key }, next(node.content)) : ''
}
</script>
