const container = document.querySelector('.container')
const addParagraph = document.getElementById('addParagraph')

addParagraph.addEventListener('click', () => {
    console.log('clicked')
    const p = document.createElement("p")
    p.classList.add('draggable')
    p.draggable = "true"
    p.innerHTML = "test"
    console.log(p)
    container.appendChild(p)
    makeDraggable()
    
    reorderElements()
})




function makeDraggable() {
    const draggables = document.querySelectorAll('.draggable')

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })
    
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    });
}



container.addEventListener('dragover', e => {
    e.preventDefault()

    const afterElement = getDragAfterElement(container, e.clientY)
    const draggable = document.querySelector('.dragging')

    if (afterElement == null) {
        container.appendChild(draggable)
    } else {
        container.insertBefore(draggable, afterElement)
    }
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}


function reorderElements() {
    const draggables = document.querySelectorAll('.draggable')

    draggables.forEach(draggable => {
        const reorderEventListener = draggable.addEventListener('dblclick', () => {
            draggable.style.display = "none"
            const textarea = document.createElement("textarea")
            textarea.innerHTML = draggable.innerHTML
            textarea.classList.add('editing')
            textarea.rows = "12"
            container.insertBefore(textarea, draggable)
            const wrapper = document.querySelector('.wrapper')
            wrapper.addEventListener('click', a)
            function a() {
                console.log(textarea.innerHTML)
                const editing = document.querySelector('.editing')
                draggable.innerHTML = editing.innerHTML
                // textarea.remove()
                draggable.style.display = "block"
                wrapper.removeEventListener('click', a)
            }
            textarea.addEventListener('click', (e) => {
                e.stopPropagation()
            })
            makeDraggable()
        })
    });
}

function removeReorderEventListener() {
    const draggables = document.querySelectorAll('.draggable')

    draggables.forEach(draggable => {
        draggable.removeEventListener('dblclick')
    });
}


makeDraggable()
reorderElements()