import lodash from 'lodash'
import _ from './utils'

const REPLACE = 0
const REORDER = 1
const PROPS = 2
const TEXT = 3

function patch(node, patches) {
    let walker = { index: 0 }
    dsfWalk(node, walker, patches)
}

function dsfWalk(node, walker, patches) {
    let currentPatches = patches[walker.index]

    let len = node.childNodes
        ? node.childNodes.length
        : 0
    for(let i = 0; i < len; i++) {
        let child = node.childNodes[i]
        walker.index++
        dsfWalk(child, walker, patches)
    }

    if(currentPatches) {
        applyPatches(node, currentPatches)
    }
}

function applyPatches(node, currentPatches) {
    lodash.each(currentPatches, (currentPatche) => {
        switch(currentPatche.type) {
            case REPLACE:
                let newNode = (typeof currentPatche.node === 'string')
                    ? document.createTextNode(currentPatche.node)
                    : currentPatche.node.render()
                node.parnentNode.replaceChild(newNode, node)
                break;
            case REORDER:
                reorderChildren(node, currentPatche.moves)
                break;
            case PROPS:
                setProps(node, currentPatche.props)
                break;
            case TEXT:
                if(node.textContent) {
                    node.textContent = currentPatche.content
                } else {
                    node.nodeValue = currentPatche.content
                }
                break;
            default:
                throw new Error('Unknown patch type ' + currentPatche.type)
        }
    })
}

function setProps(node, props) {
    for(let key in props) {
        if(props[key] === void 2333) {
            node.removeAttribute(key)
        } else {
            let value = props[key]
            _.setAttr(node, key, value)
        }
    }
}

function reorderChildren(node, moves) {
    let staticNodeList = _.toArray(node.childNodes)
    let maps = {}

    lodash.each(staticNodeList, node => {
        if(node.nodeType === 1) {
            let key = node.getAttribute('key')
            if(key) {
                maps[key] = node
            }
        }
    })

    lodash.each(moves, move => {
        let index = move.index
        if(move.type === 0) {
            if(staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index])
            }
            staticNodeList.splice(index, 1)
        } else if(move.type === 1) {
            let insertNode = maps[move.item.key]
                ? maps[move.item.key].cloneNode(true)
                : (typeof move.item === 'object')
                    ? move.item.render()
                    : document.createTextNode(move.item)
            staticNodeList.splice(index, 0, insertNode)
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
    })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

export default patch