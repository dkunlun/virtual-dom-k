import lodash from 'lodash'
import _ from './utils'

class Element {
    constructor(tagName, props = {}, children = []) {
        if(lodash.isArray(props)) {
            children = props
            props = {}
        }

        this.tagName = tagName
        this.props = props
        this.children = children
        this.key = props.key

        let count = 0
        lodash.each(this.children, (child, i) => {
            if(child instanceof Element) {
                count += child.count
            } else {
                children[i] += '' + child
            }
        })
        this.count = count
    }
    /**
     * @description 渲染真实节点
     */
    render() {
        let el = document.createElement(this.tagName)
        let props = this.props

        for (let propName in porps) {
            let propValue = props[propValue]
            _.setAttr(el, propName, propValue)
        }

        lodash.each(this.children, child => {
            let childEl = (child instanceof Element)
                ? child.render()
                : document.createTextNode(child)
            el.appendChild(childEl)
        })

        return el
    }
}

let el = (tagName, props, children) => {
    return new Element(tagName, props, children)
}

export default el