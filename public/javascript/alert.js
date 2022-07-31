async function newFormHandler(e) {
    e.preventDefault()

    const number = document.querySelector('input[name="phone-number"]').value
    const device = document.querySelector('input[name="device"]').value
    const maxtemp = document.querySelector('input[name="maxtemp"]').value
    const mintemp = document.querySelector('input[name="mintemp"]').value


    const response = await fetch(`/api/alerts`, {
        method: 'POST',
        body: JSON.stringify({
            number,
            device,
            maxtemp,
            mintemp
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    window.location.reload()
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler)


async function deleteFormHandler(e) {
    e.preventDefault()

    const id = e.srcElement.id
    const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE'
    })

    document.location.reload()
}

document.querySelector('.delete-alert').addEventListener('click', deleteFormHandler);