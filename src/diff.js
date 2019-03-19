import lodash from 'lodash'
import _ from './utils'
import patch from './patch'
import listDiff from 'list-diff2'

function diff(oldTree, newTree) {
    let index = 0
    let patches = {}
    dsfWalk(oldTree, newTree, index, patches)
    return patches
}

function dsfWalk(oldNode, newNode, index, patches) {
    let currentPatch = []

    if(newNode === null) {

    } else if (lodash.isString(oldNode) && lodash.isString(newNode)) {
        if(newNode !== oldNode) {
            currentPatch.push({ type: patch.TEXT, content: newNode })
        }
    } else if(
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ) {
        let propsPatches = diffProps(oldNode, newNode)
        if(propsPatches) {
            currentPatch.push({ type: patch.PROPS, props: propsPatches })
        }

        if(!isIgnoreChildren(newNode)) {
            diffChildren(
                oldNode.children,
                newNode.children,
                index,
                patches,
                currentPatch
            )
        }
    } else {
        currentPatch.push({ type: patch.REPLACE, node: newNode })
    }

    if(currentPatch.length) {
        patches[index] = currentPatch
    }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if(diffs.moves.length) {
        let reorderPatch = { type: patch.REORDER, moves: diffs.moves }
        currentPatch.push(reorderPatch)
    }

    let leftNode = null
    let currentNodeIndex = index
    lodash.each(oldChildren, (child, i) => {
        let newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1
        dsfWalk(child, newChild, currentNodeIndex, patches)
        leftNode = null
    })
}

function diffProps(oldNode, newNode) {
    let count = 0
    let oldProps = oldNode.props
    let newProps = newNode.props

    let key, value
    let propsPatches = {}

    for(key in oldProps) {
        value = oldProps[key]
        if(newProps[key] !== value) {
            count++
            propsPatches[key] = newProps[key]
        }
    }

    for(key in newProps) {
        value = newProps[key]
        if(!oldProps.hasOwnProperty(key)) {
            count++
            propsPatches[key] = newProps[key]
        }
    }

    if(count === 0) {
        return null
    }

    return propsPatches
}

function isIgnoreChildren(node) {
    return (node.props && node.props.hasOwnProperty('ignore'))
}

export default diff