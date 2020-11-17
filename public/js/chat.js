const socket = io()
const $messageForm = document.querySelector('#submit')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    // storing the final html we will render in browser - use Mustache liebrary
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("H:mm a")
    })
    // insert html to messages element
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationURL) => {
    console.log(locationURL)

    const html = Mustache.render(locationTemplate, {
        url: locationURL.url,
        createdAt: moment(locationURL.createdAt).format("H:mm a")
    })
    // insert html to messages element
    $messages.insertAdjacentHTML('beforeend', html)
    // $messages.insertAdjacentElement('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable the button
    $messageFormButton.setAttribute('disabled', 'disabled')
    // save the typed text
    const message = e.target.elements.messageText.value
    // activate event 'sendMessage' at the server
    socket.emit('sendMessage', message, (error) => {

        //enable the button when callback function activates
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('message was sent!')
    })
})

$sendLocationButton.addEventListener('click', () => {

    //here use geo-location API:
    const successCallback = (position) => {
        //sends position to the server
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, () => {
            // enable button when callback function activates
            $sendLocationButton.removeAttribute('disabled')

            console.log('Location shared!')
        })
        
    }
    const errorCallback = (error) => {
        console.error(error)
    }

    if(!navigator.geolocation) {
        /* geolocation is not available */
        return alert('geolocation is not supported by your browser!')
    }
    /* geolocation IS available */
    // disable the button
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback) 
    
})

