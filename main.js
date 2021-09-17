const container = document.querySelector('.container')
const addParagraph = document.getElementById('addParagraph')
const addImage = document.getElementById('addImage')

addParagraph.addEventListener('click', () => {
    console.log('clicked')
    const p = document.createElement("p")
    p.classList.add('draggable')
    p.classList.toggle('border')
    p.draggable = "true"
    p.innerHTML = "Double-click to edit text"
    console.log(p)
    container.appendChild(p)
    makeDraggable()
    
    reorderElements()
})

addImage.onchange = () => {

    function logFile (e) {
        let str = e.target.result
        let img = document.createElement('img')
        img.src = str
        img.classList.add('draggable')
        img.draggable = "true"
        container.append(img)
        console.log(str)
        
        makeDraggable()
    }

    // If there's no file, do nothing
    if (!addImage.value.length) return

    // Create a new FileReader() object
    let reader = new FileReader()

    // Setup the callback event to run when the file is read
    reader.onload = logFile

    // Read the file
    reader.readAsDataURL(addImage.files[0])

}


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
            wrapper.addEventListener('click', textareaToParagraph)
            
            textarea.addEventListener('click', (e) => {
                e.stopPropagation()
            })
            makeDraggable()
        })
    });
}

function textareaToParagraph() {
    const draggables = document.querySelectorAll('.draggable')
    let element = ""

    draggables.forEach(draggable => {
        if (draggable.style.display == "none") {
            element = draggable
            console.log(element)
        } else {
            console.log("not found")
        }
    });

    const editing = document.querySelector('.editing')
    element.innerHTML = editing.value
    editing.remove()
    element.style.display = "block"
    const wrapper = document.querySelector('.wrapper')
    wrapper.removeEventListener('click', textareaToParagraph)
}

function removeReorderEventListener() {
    const draggables = document.querySelectorAll('.draggable')

    draggables.forEach(draggable => {
        draggable.removeEventListener('dblclick')
    });
}


makeDraggable()
reorderElements()