let _ = {}

_.setAttr = (node, key, value) => {
    switch (key) {
        case 'style':
            node.style.cssText = value
            break;
        case 'value':
            let tagName = node.tagName || ''
            tagName = tagName.toLowerCase()
            if(tagName === 'input' || tagName === 'textarea') {
                node.value = value
            } else {
                node.setAttribute(key, value)
            }
            break;
        default:
            node.setAttribute(key, value)
            break;
    }
}

_.toArray = (arrayLike) => {
    if(!arrayLike) {
        return []
    }
    return Array.from(arrayLike)
}

export default _